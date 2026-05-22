import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Message } from "@features/chat/domain/entities/Message";
import { useChat } from "@features/chat/presentation/hooks/useChat";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const COLORS = {
  primary: '#075E54',
  secondary: '#25D366',
  accent: '#128C7E',
  bgChat: '#ECE5DD',
  bubbleOwn: '#DCF8C6',
  bubbleOther: '#FFFFFF',
  surface: '#FFFFFF',
  inputBg: '#F0F2F5',
  textPrimary: '#111B21',
  textMuted: '#667781',
  white: '#FFFFFF',
};

export default function ChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { messages, sendMessage, isLoading, uploadImage, isUploading } = useChat(roomId);
  const user = useAuthStore((s) => s.user);
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    sendMessage({ content: input.trim() });
    setInput("");
  }, [input, sendMessage]);

  const handlePickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    uploadImage(uri, {
      onSuccess: (imageUrl: string) => {
        sendMessage({ content: input.trim(), imageUrl });
        setInput("");
      },
    });
  }, [input, uploadImage, sendMessage]);

  const renderMsg = ({ item }: { item: Message }) => {
    const isOwn = item.userId === user?.id;
    return (
      <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
        <View style={[styles.bubble, isOwn ? styles.own : styles.other]}>
          {!isOwn && <Text style={styles.author}>{item.authorUsername}</Text>}
          {item.content ? (
            <Text style={styles.text}>{item.content}</Text>
          ) : null}
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : null}
          <Text style={styles.time}>
            {item.createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderMsg}
        contentContainerStyle={{ paddingVertical: 12 }}
      />
      <View style={styles.inputBar}>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.clipBtn} onPress={handlePickImage}>
            {isUploading ? (
              <ActivityIndicator size="small" color={COLORS.secondary} />
            ) : (
              <Ionicons name="attach" size={22} color={COLORS.primary} />
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <LinearGradient colors={['#25D366', '#128C7E']} style={styles.sendGrad}>
              <Ionicons name="send" size={18} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgChat },
  row: {
    marginVertical: 3,
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  rowOwn: { justifyContent: 'flex-end' },
  rowOther: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  own: {
    backgroundColor: COLORS.bubbleOwn,
    borderRadius: 16,
    borderBottomRightRadius: 2,
  },
  other: {
    backgroundColor: COLORS.bubbleOther,
    borderRadius: 16,
    borderBottomLeftRadius: 2,
  },
  author: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  text: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  image: {
    borderRadius: 10,
    marginTop: 6,
    width: 220,
    height: 220,
  },
  time: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  inputBar: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  clipBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendGrad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
