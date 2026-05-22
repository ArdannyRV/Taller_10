import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient colors={['#18011F', '#7621B0', '#4C1D95']} style={styles.header}>
          <View style={styles.headerIconWrap}>
            <Ionicons name="chatbubbles" size={44} color={COLORS.accent} />
          </View>
          <Text style={styles.headerTitle}>MI CHAT</Text>
          <Text style={styles.headerSub}>Conecta con todos</Text>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.bodyTitle}>Iniciar Sesión</Text>
          <Text style={styles.bodySub}>Bienvenido de vuelta</Text>

          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={20} color={COLORS.accent} />
            <TextInput
              style={styles.input}
              placeholder="Correo"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.accent} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" color={COLORS.accent} size={16} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.btnWrap}
            onPress={() => login({ email, password })}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#18011F', '#7621B0', '#4C1D95', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnGrad}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.btnText}>Ingresar</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>¿No tienes cuenta? </Text>
            <Link href="/(auth)/register" style={styles.linkAction}>Regístrate</Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  flex: { flex: 1 },
  header: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  headerIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderWidth: 1,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  headerSub: {
    color: 'rgba(192,132,252,0.7)',
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  body: {
    padding: 32,
    gap: 20,
  },
  bodyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  bodySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputWrap: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  errorBox: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    color: COLORS.accent,
    fontSize: 13,
    flex: 1,
  },
  btnWrap: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  btnGrad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  linkAction: {
    color: COLORS.accent,
    fontWeight: '600',
    fontSize: 13,
  },
});
