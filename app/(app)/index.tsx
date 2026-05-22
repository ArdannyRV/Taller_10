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
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

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
      <View style={styles.avatar}>
        <LinearGradient colors={['#7621B0', '#4C1D95']} style={styles.avatarGrad}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </LinearGradient>
      </View>
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomDate}>{item.createdAt.toLocaleDateString()}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.accent} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SALAS ACTIVAS</Text>
        </View>

        <FlatList
          data={rooms}
          keyExtractor={(r) => r.id}
          renderItem={renderRoom}
          contentContainerStyle={rooms.length === 0 ? { flex: 1 } : undefined}
          ListEmptyComponent={
            <View style={styles.centered}>
              <View style={styles.emptyIcon}>
                <Ionicons name="chatbubbles-outline" size={44} color={COLORS.accent} />
              </View>
              <Text style={styles.emptyTitle}>Sin salas aún</Text>
              <Text style={styles.emptySub}>Crea la primera sala</Text>
            </View>
          }
        />

        <View style={styles.fabWrap}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setModalVisible(true)}
          >
            <LinearGradient
              colors={['#7621B0', '#4C1D95', '#A855F7']}
              style={styles.fabGrad}
            >
              <Ionicons name="create-outline" size={28} color={COLORS.white} />
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
              <Text style={styles.dialogTitle}>NUEVA SALA</Text>
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
                <TouchableOpacity
                  style={styles.createBtnWrap}
                  onPress={handleCreate}
                  disabled={isCreating}
                >
                  <LinearGradient
                    colors={['#7621B0', '#A855F7']}
                    style={styles.createGrad}
                  >
                    {isCreating ? (
                      <ActivityIndicator color={COLORS.white} />
                    ) : (
                      <Text style={styles.createText}>Crear</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 3,
    fontWeight: '600',
  },
  roomItem: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },
  avatarGrad: {
    flex: 1,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
  },
  roomInfo: { flex: 1 },
  roomName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  roomDate: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 3,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(124,58,237,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  fabWrap: {
    position: 'absolute',
    right: 20,
    bottom: 28,
  },
  fab: {
    width: 62,
    height: 62,
    borderRadius: 31,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  fabGrad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 3,
    marginBottom: 20,
  },
  dialogError: { color: COLORS.accent, fontSize: 13, marginBottom: 8 },
  dialogInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
  },
  createBtnWrap: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  createGrad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createText: {
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
