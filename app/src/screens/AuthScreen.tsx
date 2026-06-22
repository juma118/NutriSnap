import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

export function AuthScreen() {
  const { signIn, signUp, demoLogin } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        await signUp(email.trim(), password, fullName.trim());
      } else {
        await signIn(email.trim(), password);
      }
    } catch (err: any) {
      Alert.alert("Authentication failed", err.message ?? String(err));
    } finally {
      setBusy(false);
    }
  };

  const tryDemo = async () => {
    setBusy(true);
    try {
      await demoLogin();
    } catch (err: any) {
      Alert.alert("Demo login failed", err.message ?? String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.logo}>🥗 NutriSnap</Text>
          <Text style={styles.tagline}>AI nutrition tracking & meal coach</Text>

          <View style={styles.card}>
            <Text style={styles.heading}>
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </Text>

            {mode === "signup" && (
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={colors.textMuted}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.button}
              onPress={submit}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {mode === "signin" ? "Sign in" : "Sign up"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setMode(mode === "signin" ? "signup" : "signin")
              }
              style={styles.switch}
            >
              <Text style={styles.switchText}>
                {mode === "signin"
                  ? "New here? Create an account"
                  : "Already have an account? Sign in"}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.demoButton}
              onPress={tryDemo}
              disabled={busy}
            >
              <Text style={styles.demoButtonText}>⚡ Try the demo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, justifyContent: "center", padding: 24 },
  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.primaryDark,
    textAlign: "center",
  },
  tagline: {
    textAlign: "center",
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: 28,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  switch: { marginTop: 16, alignItems: "center" },
  switchText: { color: colors.primaryDark, fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 18,
  },
  demoButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  demoButtonText: { color: colors.primaryDark, fontSize: 15, fontWeight: "700" },
});
