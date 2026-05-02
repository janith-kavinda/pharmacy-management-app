import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

import API from "../src/api/api";

const GREEN = "#00A878";
const GREEN_DARK = "#047857";
const GREEN_SOFT = "#E6F7F2";
const BG = "#F4FAF7";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";
const BORDER = "#E2E8F0";
const RED = "#DC2626";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginHandler = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const userData = response.data.data;

      await SecureStore.setItemAsync("token", userData.token);
      await SecureStore.setItemAsync("role", userData.role);
      await SecureStore.setItemAsync("user", JSON.stringify(userData));

      if (userData.role === "admin") {
        router.replace("/(admin)" as any);
      } else {
        router.replace("/(customer)" as any);
      }
    } catch (error: any) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);

      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Invalid email or password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoSection}>
          <View style={styles.logoBox}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.appName}>Medix App</Text>
          <Text style={styles.appSubtitle}>
            Login to manage your medicines and orders
          </Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIconBox}>
            <Ionicons name="shield-checkmark-outline" size={30} color={GREEN} />
          </View>

          <Text style={styles.heroTitle}>Welcome Back</Text>
          <Text style={styles.heroText}>
            Use one login for both customers and pharmacy admins.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Login Account</Text>
          <Text style={styles.formSubtitle}>
            Enter your account details below
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>

            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color={MUTED} />

              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                placeholderTextColor={MUTED}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>

            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color={MUTED} />

              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={MUTED}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={21}
                  color={MUTED}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.mainButton, loading && styles.disabledButton]}
            onPress={loginHandler}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={WHITE} />
            ) : (
              <>
                <Text style={styles.mainButtonText}>Login</Text>
                <Ionicons name="log-in-outline" size={20} color={WHITE} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryLink}
            onPress={() => router.push("/register" as any)}
          >
            <Text style={styles.secondaryText}>New customer?</Text>
            <Text style={styles.secondaryTextBold}> Create account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteCard}>
          <View style={styles.noteIcon}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={GREEN}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.noteTitle}>Access Control</Text>
            <Text style={styles.noteText}>
              Admin users will be redirected to the admin dashboard. Customers
              will be redirected to the pharmacy store.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 22,
  },
  logoBox: {
    width: 82,
    height: 82,
    borderRadius: 30,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  logoImage: {
    width: 65,
    height: 65,
  },
  appName: {
    color: TEXT,
    fontSize: 29,
    fontWeight: "900",
    marginTop: 14,
  },
  appSubtitle: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
  },
  heroCard: {
    backgroundColor: GREEN,
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  heroIconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    color: WHITE,
    fontSize: 24,
    fontWeight: "900",
  },
  heroText: {
    color: "#EFFFF9",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 7,
  },
  formCard: {
    backgroundColor: WHITE,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
  },
  formTitle: {
    color: TEXT,
    fontSize: 21,
    fontWeight: "900",
  },
  formSubtitle: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  input: {
    flex: 1,
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 12,
  },
  mainButton: {
    backgroundColor: GREEN,
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  disabledButton: {
    opacity: 0.7,
  },
  mainButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "900",
  },
  secondaryLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  secondaryText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "700",
  },
  secondaryTextBold: {
    color: GREEN_DARK,
    fontSize: 13,
    fontWeight: "900",
  },
  noteCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    gap: 14,
  },
  noteIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: GREEN_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  noteTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "900",
  },
  noteText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    marginTop: 4,
  },
});
