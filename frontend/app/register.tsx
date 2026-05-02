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

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const registerHandler = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert(
        "Validation Error",
        "Name, email, password and phone are required",
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register", {
        name,
        email,
        password,
        phone,
        address,
      });

      const userData = response.data.data;

      await SecureStore.setItemAsync("token", userData.token);
      await SecureStore.setItemAsync("role", userData.role);
      await SecureStore.setItemAsync("user", JSON.stringify(userData));

      Alert.alert("Success", "Registration successful");
      router.replace("/(customer)" as any);
    } catch (error: any) {
      console.log("REGISTER ERROR:", error.response?.data || error.message);

      Alert.alert(
        "Registration Failed",
        error.response?.data?.message || "Failed to register",
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
            <Ionicons name="person-add-outline" size={40} color={GREEN} />
          </View>

          <Text style={styles.appName}>Create Account</Text>
          <Text style={styles.appSubtitle}>
            Register as a customer and start ordering medicines
          </Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIconBox}>
            <Ionicons name="medkit-outline" size={30} color={GREEN} />
          </View>

          <Text style={styles.heroTitle}>Join Pharmacy Store</Text>
          <Text style={styles.heroText}>
            Create your customer account to browse medicines, place orders, and
            track deliveries.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Customer Registration</Text>
          <Text style={styles.formSubtitle}>
            Fill your details to create a new account
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>

            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={20} color={MUTED} />

              <TextInput
                style={styles.input}
                placeholder="Enter full name"
                placeholderTextColor={MUTED}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

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
            <Text style={styles.label}>Phone Number</Text>

            <View style={styles.inputBox}>
              <Ionicons name="call-outline" size={20} color={MUTED} />

              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor={MUTED}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Delivery Address</Text>

            <View style={[styles.inputBox, styles.addressBox]}>
              <Ionicons name="location-outline" size={20} color={MUTED} />

              <TextInput
                style={[styles.input, styles.addressInput]}
                placeholder="Enter delivery address"
                placeholderTextColor={MUTED}
                value={address}
                onChangeText={setAddress}
                multiline
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>

            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color={MUTED} />

              <TextInput
                style={styles.input}
                placeholder="Minimum 6 characters"
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
            onPress={registerHandler}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={WHITE} />
            ) : (
              <>
                <Text style={styles.mainButtonText}>Create Account</Text>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={WHITE}
                />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryLink}
            onPress={() => router.push("/login" as any)}
          >
            <Text style={styles.secondaryText}>Already have an account?</Text>
            <Text style={styles.secondaryTextBold}> Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteCard}>
          <View style={styles.noteIcon}>
            <Ionicons name="shield-checkmark-outline" size={24} color={GREEN} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.noteTitle}>Customer Account</Text>
            <Text style={styles.noteText}>
              This registration creates a customer account only. Admin accounts
              are managed separately by the pharmacy.
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
  appName: {
    color: TEXT,
    fontSize: 29,
    fontWeight: "900",
    marginTop: 14,
    textAlign: "center",
  },
  appSubtitle: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
    lineHeight: 19,
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
  addressBox: {
    alignItems: "flex-start",
    paddingTop: 12,
  },
  input: {
    flex: 1,
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 12,
  },
  addressInput: {
    minHeight: 70,
    textAlignVertical: "top",
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
