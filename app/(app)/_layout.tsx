import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function AppLayout() {
  const { logout } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerBackground: () => (
          <LinearGradient colors={['#075E54', '#128C7E']} style={{ flex: 1 }} />
        ),
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '800', fontSize: 18 },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Mi Chat',
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ marginRight: 4 }}>
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="chat/[roomId]" options={{ title: "Chat" }} />
    </Stack>
  );
}
