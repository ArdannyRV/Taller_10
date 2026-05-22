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
        <LinearGradient colors={['#075E54', '#128C7E']} style={styles.header}>
          <Ionicons name="chatbubbles" size={72} color="white" />
          <Text style={styles.headerTitle}>Mi Chat</Text>
          <Text style={styles.headerSub}>Conecta con todos</Text>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.bodyTitle}>Iniciar Sesión</Text>
          <Text style={styles.bodySub}>Bienvenido de vuelta</Text>

          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
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
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
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
              <Ionicons name="alert-circle" color="#E53935" size={16} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.btnWrap}>
            <LinearGradient colors={['#25D366', '#128C7E']} style={styles.btnGrad}>
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={() => login({ email, password })}
                disabled={isLoading}
              >
                <View style={styles.btnInner}>
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.btnText}>Ingresar</Text>
                  )}
                </View>
              </TouchableOpacity>
            </LinearGradient>
          </View>

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
  safe: { flex: 1, backgroundColor: COLORS.surface },
  flex: { flex: 1 },
  header: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  body: {
    padding: 32,
    gap: 16,
  },
  bodyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  bodySub: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  errorText: {
    color: '#E53935',
    fontSize: 14,
    flex: 1,
  },
  btnWrap: {
    borderRadius: 14,
    height: 54,
    overflow: 'hidden',
  },
  btnGrad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  linkAction: {
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: 14,
  },
});
