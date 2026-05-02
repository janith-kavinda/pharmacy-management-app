import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

import API from "../../api/api";

const GREEN = "#00A878";
const GREEN_DARK = "#047857";
const GREEN_SOFT = "#E6F7F2";
const BG = "#F4FAF7";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";
const BORDER = "#E2E8F0";

const CustomerProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const getProfile = async () => {
    try {
      setLoading(true);

      const response = await API.get("/auth/profile");
      const user = response.data.data;

      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");

      await SecureStore.setItemAsync("user", JSON.stringify(user));
    } catch (error) {
      console.log("GET PROFILE ERROR:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!name || !phone) {
      Alert.alert("Validation Error", "Name and phone are required");
      return;
    }

    try {
      setSaving(true);

      const response = await API.put("/auth/profile", {
        name,
        phone,
        address,
      });

      const updatedUser = response.data.data;

      const oldUserString = await SecureStore.getItemAsync("user");
      const oldUser = oldUserString ? JSON.parse(oldUserString) : {};

      await SecureStore.setItemAsync(
        "user",
        JSON.stringify({
          ...oldUser,
          ...updatedUser,
        }),
      );

      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.log(
        "UPDATE PROFILE ERROR:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Update Failed",
        error.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={GREEN} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>Account Settings</Text>
          <Text style={styles.title}>My Profile</Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="person-circle-outline" size={30} color={GREEN} />
        </View>
      </View>

      <View style={styles.profileHero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {name ? name.charAt(0).toUpperCase() : "U"}
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{name || "Customer"}</Text>
          <Text style={styles.profileEmail}>{email || "No email found"}</Text>

          <View style={styles.roleBadge}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color={GREEN_DARK}
            />
            <Text style={styles.roleText}>Customer Account</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Personal Details</Text>

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

          <View style={[styles.inputBox, styles.disabledBox]}>
            <Ionicons name="mail-outline" size={20} color={MUTED} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={MUTED}
              value={email}
              editable={false}
            />
          </View>

          <Text style={styles.helperText}>Email cannot be changed here.</Text>
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

        <TouchableOpacity
          style={[styles.updateButton, saving && styles.disabledButton]}
          onPress={updateProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <>
              <Text style={styles.updateButtonText}>Update Profile</Text>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={WHITE}
              />
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.noteCard}>
        <View style={styles.noteIcon}>
          <Ionicons name="information-circle-outline" size={24} color={GREEN} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.noteTitle}>Profile Tip</Text>
          <Text style={styles.noteText}>
            Keep your phone number and delivery address updated to avoid delays
            when placing pharmacy orders.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default CustomerProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 130,
  },
  center: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: MUTED,
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  smallTitle: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    color: TEXT,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 2,
  },
  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 19,
    backgroundColor: GREEN_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  profileHero: {
    backgroundColor: GREEN,
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 26,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: GREEN,
    fontSize: 32,
    fontWeight: "900",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: WHITE,
    fontSize: 21,
    fontWeight: "900",
  },
  profileEmail: {
    color: "#EFFFF9",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  roleBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: WHITE,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    marginTop: 10,
  },
  roleText: {
    color: GREEN_DARK,
    fontSize: 11,
    fontWeight: "900",
  },
  infoCard: {
    backgroundColor: WHITE,
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
  },
  sectionTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
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
    gap: 9,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  disabledBox: {
    backgroundColor: "#F1F5F9",
  },
  input: {
    flex: 1,
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 12,
  },
  addressBox: {
    alignItems: "flex-start",
    paddingTop: 12,
  },
  addressInput: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  helperText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
  },
  updateButton: {
    marginTop: 8,
    backgroundColor: GREEN,
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: WHITE,
    fontSize: 14,
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
