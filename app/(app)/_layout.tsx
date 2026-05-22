import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const COLORS = {
  bg:      '#0C0C0C',
  accent:  '#C084FC',
  border:  'rgba(124,58,237,0.3)',
  white:   '#FAF5FF',
};

export default function AppLayout() {
  const { logout } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTransparent: false,
        contentStyle: {
          backgroundColor: COLORS.bg,
        },
        headerBackground: () => (
          <LinearGradient
            colors={['#18011F', '#7621B0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        ),
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '800', fontSize: 18, letterSpacing: 3 },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'MI CHAT',
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ marginRight: 8 }}>
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(192,132,252,0.15)',
                borderWidth: 1,
                borderColor: COLORS.accent,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Ionicons name="log-out-outline" size={18} color={COLORS.accent} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="chat/[roomId]" options={{ title: "Chat" }} />
    </Stack>
  );
}
