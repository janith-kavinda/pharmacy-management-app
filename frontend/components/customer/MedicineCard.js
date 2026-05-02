import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#00A878";
const GREEN_DARK = "#047857";
const GREEN_SOFT = "#E6F7F2";
const RED_SOFT = "#FEE2E2";
const RED = "#DC2626";
const YELLOW_SOFT = "#FEF3C7";
const YELLOW = "#D97706";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";

const MedicineCard = ({ medicine, onAddToCart }) => {
  const isOutOfStock = medicine.quantity <= 0;
  const isLowStock = medicine.quantity > 0 && medicine.quantity <= 10;

  const expiryDate = medicine.expiryDate
    ? medicine.expiryDate.substring(0, 10)
    : "N/A";

  const supplierName = medicine.supplier
    ? `${medicine.supplier.name} - ${medicine.supplier.company}`
    : "No supplier";

  const stockLabel = isOutOfStock
    ? "Out of Stock"
    : isLowStock
      ? "Low Stock"
      : "Available";

  const stockStyle = isOutOfStock
    ? styles.outStockBadge
    : isLowStock
      ? styles.lowStockBadge
      : styles.availableBadge;

  const stockTextStyle = isOutOfStock
    ? styles.outStockText
    : isLowStock
      ? styles.lowStockText
      : styles.availableText;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Ionicons name="medkit-outline" size={26} color={GREEN} />
        </View>

        <View style={stockStyle}>
          <Text style={stockTextStyle}>{stockLabel}</Text>
        </View>
      </View>

      <Text style={styles.name}>{medicine.name}</Text>

      <View style={styles.categoryBadge}>
        <Ionicons name="pricetag-outline" size={13} color={GREEN_DARK} />
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
        <Text style={styles.infoText}>Stock: {medicine.quantity}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>Rs. {medicine.price}</Text>
        </View>

        <TouchableOpacity
          style={[styles.addButton, isOutOfStock && styles.disabledButton]}
          onPress={() => onAddToCart(medicine)}
          disabled={isOutOfStock}
        >
          <Ionicons
            name={isOutOfStock ? "close-circle-outline" : "cart-outline"}
            size={18}
            color={WHITE}
          />
          <Text style={styles.addButtonText}>
            {isOutOfStock ? "Unavailable" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MedicineCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#00A878",
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
    backgroundColor: GREEN_SOFT,
    justifyContent: "center",
    alignItems: "center",
  },
  availableBadge: {
    backgroundColor: GREEN_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availableText: {
    color: GREEN_DARK,
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
    backgroundColor: GREEN_SOFT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 9,
    marginBottom: 12,
  },
  categoryText: {
    color: GREEN_DARK,
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: GREEN,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
  },
  disabledButton: {
    backgroundColor: "#94A3B8",
  },
  addButtonText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "900",
  },
});
