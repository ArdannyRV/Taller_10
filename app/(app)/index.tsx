import { Room } from "@features/chat/domain/entities/Message";
import { useRooms } from "@features/chat/presentation/hooks/useRooms";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

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

export default function RoomsScreen() {
  const { rooms, isLoading, createRoom, isCreating, createError } = useRooms();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName] = useState("");

  const handleCreate = () => {
    if (!roomName.trim() || isCreating) return;
    createRoom(roomName.trim(), {
      onSuccess: () => {
        setRoomName("");
        setModalVisible(false);
      },
    });
  };

  const renderRoom = ({ item }: { item: Room }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.roomRow}>
        <View style={styles.avatar}>
          <LinearGradient colors={['#25D366', '#075E54']} style={styles.avatarGrad}>
            <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
          </LinearGradient>
        </View>
        <View style={styles.roomInfo}>
          <Text style={styles.roomName}>{item.name}</Text>
          <Text style={styles.roomDate}>{item.createdAt.toLocaleDateString()}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        keyExtractor={(r) => r.id}
        renderItem={renderRoom}
        contentContainerStyle={rooms.length === 0 ? { flex: 1 } : undefined}
        ListEmptyComponent={
          <View style={styles.centered}>
            <View style={styles.emptyWrap}>
              <Ionicons name="chatbubbles-outline" size={80} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No hay salas aún</Text>
              <Text style={styles.emptySub}>Toca el botón para crear una sala</Text>
            </View>
          </View>
        }
      />

      <View style={styles.fabWrap}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <LinearGradient colors={['#25D366', '#075E54']} style={styles.fab}>
            <Ionicons name="create-outline" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Nueva Sala</Text>
            {createError && <Text style={styles.dialogError}>{createError}</Text>}
            <TextInput
              style={styles.dialogInput}
              placeholder="Nombre de la sala"
              placeholderTextColor={COLORS.textMuted}
              value={roomName}
              onChangeText={setRoomName}
              autoFocus
              maxLength={50}
            />
            <View style={styles.dialogActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <View style={styles.createBtnWrap}>
                <LinearGradient colors={['#25D366', '#128C7E']} style={styles.createGrad}>
                  <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    onPress={handleCreate}
                    disabled={isCreating}
                  >
                    <View style={styles.createInner}>
                      {isCreating ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text style={styles.createText}>Crear</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgChat },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyWrap: { alignItems: "center", gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "600", color: COLORS.textPrimary },
  emptySub: { fontSize: 14, color: COLORS.textMuted },
  roomItem: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F0F2F5',
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatarGrad: {
    flex: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  roomInfo: { flex: 1 },
  roomName: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  roomDate: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  fabWrap: {
    position: 'absolute',
    right: 20,
    bottom: 28,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#075E54',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  dialog: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dialogError: { color: 'red', fontSize: 13, marginBottom: 8 },
  dialogInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    marginVertical: 16,
    color: COLORS.textPrimary,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: COLORS.textMuted,
    fontWeight: '600',
    fontSize: 15,
  },
  createBtnWrap: {
    flex: 1,
    borderRadius: 12,
    height: 48,
    overflow: 'hidden',
  },
  createGrad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
