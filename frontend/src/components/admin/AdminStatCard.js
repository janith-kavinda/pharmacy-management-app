import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WHITE = "#FFFFFF";
const TEXT = "#0F172A";
const MUTED = "#6B7280";
const BORDER = "#A7F3D0";
const ACTIVE_BG = "#D1FAE5";
const DARK_GREEN = "#065F46";

const AdminStatCard = ({
  title,
  value,
  icon,
  iconColor = DARK_GREEN,
  iconBg = ACTIVE_BG,
  valueColor = TEXT,
}) => {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>

      <Text style={[styles.statNumber, { color: valueColor }]}>{value}</Text>

      <Text style={styles.statLabel}>{title}</Text>
    </View>
  );
};

export default AdminStatCard;

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statIconBox: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "900",
  },
  statLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 3,
  },
});
