import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DARK_GREEN = "#065F46";
const MID_GREEN = "#047857";
const ACTIVE_BG = "#D1FAE5";
const WHITE = "#FFFFFF";
const TEXT = "#0F172A";
const MUTED = "#6B7280";
const BORDER = "#A7F3D0";
const RED = "#DC2626";

const AdminSupplierCard = ({ supplier, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Ionicons name="business-outline" size={26} color={DARK_GREEN} />
        </View>

        <View style={styles.badge}>
          <Ionicons
            name="checkmark-circle-outline"
            size={14}
            color={DARK_GREEN}
          />
          <Text style={styles.badgeText}>Supplier</Text>
        </View>
      </View>

      <Text style={styles.name}>{supplier.name}</Text>
      <Text style={styles.company}>{supplier.company}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>{supplier.phone}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="mail-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>
          {supplier.email || "No email provided"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>
          {supplier.address || "No address provided"}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(supplier)}
        >
          <Ionicons name="create-outline" size={17} color={WHITE} />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(supplier._id)}
        >
          <Ionicons name="trash-outline" size={18} color={WHITE} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminSupplierCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: DARK_GREEN,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: ACTIVE_BG,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: ACTIVE_BG,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: DARK_GREEN,
    fontSize: 11,
    fontWeight: "900",
  },
  name: {
    color: TEXT,
    fontSize: 21,
    fontWeight: "900",
    marginTop: 14,
  },
  company: {
    color: MID_GREEN,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 7,
  },
  infoText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  bottomRow: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: MID_GREEN,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 20,
  },
  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 18,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "900",
  },
});
