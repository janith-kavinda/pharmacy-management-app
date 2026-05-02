import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#00A878";
const GREEN_DARK = "#047857";
const GREEN_SOFT = "#E6F7F2";
const BLUE_SOFT = "#DBEAFE";
const BLUE = "#2563EB";
const YELLOW_SOFT = "#FEF3C7";
const YELLOW = "#D97706";
const RED_SOFT = "#FEE2E2";
const RED = "#DC2626";
const GRAY_SOFT = "#F1F5F9";
const GRAY = "#64748B";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";

const OrderItemCard = ({ order, onCancel }) => {
  const getStatusStyle = () => {
    if (order.status === "Pending") {
      return {
        badge: styles.pendingBadge,
        text: styles.pendingText,
        icon: "time-outline",
      };
    }

    if (order.status === "Preparing") {
      return {
        badge: styles.preparingBadge,
        text: styles.preparingText,
        icon: "cube-outline",
      };
    }

    if (order.status === "Completed") {
      return {
        badge: styles.completedBadge,
        text: styles.completedText,
        icon: "checkmark-circle-outline",
      };
    }

    if (order.status === "Rejected") {
      return {
        badge: styles.rejectedBadge,
        text: styles.rejectedText,
        icon: "close-circle-outline",
      };
    }

    if (order.status === "Cancelled") {
      return {
        badge: styles.cancelledBadge,
        text: styles.cancelledText,
        icon: "ban-outline",
      };
    }

    return {
      badge: styles.cancelledBadge,
      text: styles.cancelledText,
      icon: "help-circle-outline",
    };
  };

  const status = getStatusStyle();

  const createdDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : "N/A";

  const orderId = order._id ? order._id.slice(-6).toUpperCase() : "N/A";

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Ionicons name="receipt-outline" size={25} color={GREEN} />
        </View>

        <View style={status.badge}>
          <Ionicons name={status.icon} size={14} color={status.text.color} />
          <Text style={status.text}>{order.status}</Text>
        </View>
      </View>

      <Text style={styles.orderTitle}>Order #{orderId}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>Date: {createdDate}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>Phone: {order.phone}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>Address: {order.deliveryAddress}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="cash-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>Payment: {order.paymentMethod}</Text>
      </View>

      <View style={styles.itemsBox}>
        <Text style={styles.itemsTitle}>Medicines</Text>

        {order.items.map((medicine, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {medicine.name} x {medicine.quantity}
            </Text>

            <Text style={styles.itemPrice}>
              Rs. {medicine.price * medicine.quantity}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>Rs. {order.totalAmount}</Text>
        </View>

        {order.status === "Pending" && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => onCancel(order._id)}
          >
            <Ionicons name="close-circle-outline" size={18} color={WHITE} />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OrderItemCard;

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
    justifyContent: "center",
    alignItems: "center",
  },
  orderTitle: {
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
    flex: 1,
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: YELLOW_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pendingText: {
    color: YELLOW,
    fontSize: 11,
    fontWeight: "900",
  },
  preparingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: BLUE_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  preparingText: {
    color: BLUE,
    fontSize: 11,
    fontWeight: "900",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: GREEN_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completedText: {
    color: GREEN_DARK,
    fontSize: 11,
    fontWeight: "900",
  },
  rejectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: RED_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rejectedText: {
    color: RED,
    fontSize: 11,
    fontWeight: "900",
  },
  cancelledBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: GRAY_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cancelledText: {
    color: GRAY,
    fontSize: 11,
    fontWeight: "900",
  },
  itemsBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 14,
    marginTop: 12,
  },
  itemsTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 10,
  },
  itemName: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  itemPrice: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "900",
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
  totalAmount: {
    color: TEXT,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 2,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: RED,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
  },
  cancelText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "900",
  },
});
