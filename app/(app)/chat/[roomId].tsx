import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { Message } from '@features/chat/domain/entities/Message';
import { useChat } from '@features/chat/presentation/hooks/useChat';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
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
} from 'react-native';

const COLORS = {
  bg:           '#0C0C0C',
  surface:      '#141414',
  card:         '#1A1A2E',
  primary:      '#7C3AED',
  primaryLight: '#A855F7',
  accent:       '#C084FC',
  gradStart:    '#18011F',
  gradMid:      '#7621B0',
  gradEnd:      '#4C1D95',
  bubbleOwn:    '#2D1B69',
  bubbleOther:  '#1C1C2E',
  textPrimary:  '#F5F0FF',
  textMuted:    '#9CA3AF',
  textAccent:   '#C084FC',
  border:       'rgba(124,58,237,0.3)',
  inputBg:      '#1E1E3A',
  white:        '#FAF5FF',
};

export default function ChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { messages, sendMessage, isLoading, uploadImage, isUploading } = useChat(roomId);
  const user = useAuthStore((s) => s.user);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    sendMessage({ content: input.trim() });
    setInput('');
  }, [input, sendMessage]);

  const handlePickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (result.canceled) return;
    uploadImage(result.assets[0].uri);
  }, [uploadImage]);

  const renderMsg = ({ item }: { item: Message }) => {
    const isOwn = item.userId === user?.id;
    return (
      <View style={[styles.msgContainer, isOwn ? styles.msgOwn : styles.msgOther]}>
        <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
          {!isOwn && (
            <Text style={styles.authorName}>{item.authorUsername}</Text>
          )}
          {item.content ? (
            <Text style={styles.msgText}>{item.content}</Text>
          ) : null}
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.msgImage}
              resizeMode="cover"
            />
          ) : null}
          <Text style={styles.msgTime}>
            {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderMsg}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn} onPress={handlePickImage} disabled={isUploading}>
          {isUploading ? (
            <ActivityIndicator size="small" color={COLORS.accent} />
          ) : (
            <Ionicons name="attach" size={22} color={COLORS.accent} />
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <LinearGradient
            colors={['#7621B0', '#A855F7']}
            style={styles.sendGrad}
          >
            <Ionicons name="send" size={17} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: COLORS.bg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },
  messagesList:     { padding: 12, paddingBottom: 8, paddingTop: 8 },

  msgContainer:  { flexDirection: 'row', marginVertical: 4, paddingHorizontal: 12 },
  msgOwn:        { justifyContent: 'flex-end' },
  msgOther:      { justifyContent: 'flex-start' },

  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  bubbleOwn: {
    backgroundColor: COLORS.bubbleOwn,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.4)',
  },
  bubbleOther: {
    backgroundColor: COLORS.bubbleOther,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  authorName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textAccent,
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  msgText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  msgImage: {
    width: 220,
    height: 220,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  msgTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginTop: 6,
    letterSpacing: 0.5,
  },

  inputBar: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  attachBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
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
