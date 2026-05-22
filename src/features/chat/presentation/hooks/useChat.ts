import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { GetMessagesUseCase } from "@features/chat/application/use-cases/GetMessagesUseCase";
import { SendMessageUseCase } from "@features/chat/application/use-cases/SendMessageUseCase";
import { SubscribeToRoomUseCase } from "@features/chat/application/use-cases/SubscribeToRoomUseCase";
import { UploadImageUseCase } from "@features/chat/application/use-cases/UploadImageUseCase";
import { Message } from "@features/chat/domain/entities/Message";
import { SupabaseChatRepository } from "@features/chat/infrastructure/repositories/SupabaseChatRepository";
import { NotificationService } from "@features/notifications/infrastructure/NotificationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const chatRepo = new SupabaseChatRepository();
const sendMessageUseCase = new SendMessageUseCase(chatRepo);
const getMessagesUseCase = new GetMessagesUseCase(chatRepo);
const subscribeUseCase = new SubscribeToRoomUseCase(chatRepo);
const uploadImageUseCase = new UploadImageUseCase(chatRepo);

export function useChat(roomId: string) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Paso 1: obtener historial de mensajes con cache
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: () => getMessagesUseCase.execute(roomId),
    enabled: !!user,
    staleTime: Infinity,
  });

  // Paso 2: suscribirse al canal Realtime
  useEffect(() => {
    const unsubscribe = subscribeUseCase.execute(roomId, (newMsg) => {
      try {
        if (newMsg.userId !== user?.id) {
          NotificationService.scheduleLocalNotification(
            newMsg.authorUsername ?? 'Nuevo mensaje',
            newMsg.content,
          );
        }
      } catch (_) {}
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) => {
        const exists = old.some((m) => m.id === newMsg.id);
        return exists ? old : [...old, newMsg];
      });
    });
    return unsubscribe;
  }, [roomId, user?.id]);

  // Paso 3: enviar mensaje con optimistic update via useMutation
  const sendMutation = useMutation({
    mutationFn: (params: { content: string; imageUrl?: string }) =>
      sendMessageUseCase.execute(roomId, user!.id, params.content, params.imageUrl),

    onMutate: async (params) => {
      const tempMsg: Message = {
        id: `temp-${Date.now()}`,
        roomId,
        userId: user!.id,
        content: params.content,
        createdAt: new Date(),
        authorUsername: user!.username,
        imageUrl: params.imageUrl,
      };
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) => [
        ...old,
        tempMsg,
      ]);
      return { tempMsg };
    },

    onSuccess: (realMsg, _params, context) => {
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) =>
        old.map((m) => (m.id === context?.tempMsg.id ? realMsg : m)),
      );
    },

    onError: (_err, _params, context) => {
      if (context?.tempMsg) {
        queryClient.setQueryData(["messages", roomId], (old: Message[] = []) =>
          old.filter((m) => m.id !== context.tempMsg.id),
        );
      }
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (uri: string) => uploadImageUseCase.execute(uri, user!.id),
  });

  return {
    messages,
    sendMessage: sendMutation.mutate,
    isLoading,
    isSending: sendMutation.isPending,
    uploadImage: uploadImageMutation.mutate,
    isUploading: uploadImageMutation.isPending,
  };
}