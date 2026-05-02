import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#00A878";
const GREEN_DARK = "#047857";
const GREEN_SOFT = "#E6F7F2";
const RED = "#DC2626";
const RED_SOFT = "#FEE2E2";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";

const CartItemCard = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Ionicons name="medkit-outline" size={25} color={GREEN} />
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.medicine)}
        >
          <Ionicons name="trash-outline" size={18} color={RED} />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{item.name}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="pricetag-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>Unit Price: Rs. {item.price}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="cube-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>
          Available Stock: {item.availableQuantity}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.totalLabel}>Item Total</Text>
          <Text style={styles.totalPrice}>
            Rs. {item.price * item.quantity}
          </Text>
        </View>

        <View style={styles.quantityBox}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => onDecrease(item.medicine)}
          >
            <Ionicons name="remove" size={18} color={GREEN_DARK} />
          </TouchableOpacity>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => onIncrease(item.medicine)}
          >
            <Ionicons name="add" size={18} color={GREEN_DARK} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CartItemCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: GREEN,
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
    alignItems: "center",
    justifyContent: "center",
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: RED_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: TEXT,
    fontSize: 21,
    fontWeight: "900",
    marginTop: 14,
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
  totalLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
  },
  totalPrice: {
    color: TEXT,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 2,
  },
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GREEN_SOFT,
    borderRadius: 22,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 10,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  quantity: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "900",
    minWidth: 20,
    textAlign: "center",
  },
});
