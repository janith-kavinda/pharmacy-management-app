import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DARK_GREEN = "#065F46";
const MID_GREEN = "#047857";
const ACTIVE_BG = "#D1FAE5";
const BG = "#F0FDF4";
const WHITE = "#FFFFFF";
const TEXT = "#0F172A";
const MUTED = "#6B7280";
const BORDER = "#A7F3D0";
const RED = "#DC2626";
const RED_SOFT = "#FEE2E2";
const YELLOW = "#D97706";
const YELLOW_SOFT = "#FEF3C7";

const AdminMedicineCard = ({ medicine, onEdit, onDelete }) => {
  const isOutOfStock = medicine.quantity <= 0;
  const isLowStock = medicine.quantity > 0 && medicine.quantity <= 10;

  const expiryDate = medicine.expiryDate
    ? medicine.expiryDate.substring(0, 10)
    : "N/A";

  const supplierName = medicine.supplier
    ? `${medicine.supplier.name} - ${medicine.supplier.company}`
    : "No supplier";

  const stockBadgeStyle = isOutOfStock
    ? styles.outStockBadge
    : isLowStock
      ? styles.lowStockBadge
      : styles.availableBadge;

  const stockTextStyle = isOutOfStock
    ? styles.outStockText
    : isLowStock
      ? styles.lowStockText
      : styles.availableText;

  const stockLabel = isOutOfStock
    ? "Out of Stock"
    : isLowStock
      ? "Low Stock"
      : "In Stock";

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Ionicons name="medkit-outline" size={26} color={DARK_GREEN} />
        </View>

        <View style={stockBadgeStyle}>
          <Text style={stockTextStyle}>{stockLabel}</Text>
        </View>
      </View>

      <Text style={styles.name}>{medicine.name}</Text>

      <View style={styles.categoryBadge}>
        <Ionicons name="pricetag-outline" size={13} color={DARK_GREEN} />
        <Text style={styles.categoryText}>{medicine.category}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="business-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>{supplierName}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>Expiry: {expiryDate}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="cube-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>Quantity: {medicine.quantity}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.priceLabel}>Selling Price</Text>
          <Text style={styles.price}>Rs. {medicine.price}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(medicine)}
          >
            <Ionicons name="create-outline" size={17} color={WHITE} />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(medicine._id)}
          >
            <Ionicons name="trash-outline" size={17} color={WHITE} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AdminMedicineCard;

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
  availableBadge: {
    backgroundColor: ACTIVE_BG,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availableText: {
    color: DARK_GREEN,
    fontSize: 11,
    fontWeight: "900",
  },
  lowStockBadge: {
    backgroundColor: YELLOW_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  lowStockText: {
    color: YELLOW,
    fontSize: 11,
    fontWeight: "900",
  },
  outStockBadge: {
    backgroundColor: RED_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  outStockText: {
    color: RED,
    fontSize: 11,
    fontWeight: "900",
  },
  name: {
    color: TEXT,
    fontSize: 21,
    fontWeight: "900",
    marginTop: 14,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: ACTIVE_BG,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 9,
    marginBottom: 12,
  },
  categoryText: {
    color: DARK_GREEN,
    fontSize: 12,
    fontWeight: "800",
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
  },
  price: {
    color: TEXT,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: MID_GREEN,
    paddingHorizontal: 14,
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
