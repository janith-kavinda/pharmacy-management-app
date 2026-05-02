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
const RED_SOFT = "#FEE2E2";
const YELLOW = "#D97706";
const YELLOW_SOFT = "#FEF3C7";
const BLUE = "#2563EB";
const BLUE_SOFT = "#DBEAFE";
const GRAY = "#64748B";
const GRAY_SOFT = "#F1F5F9";

const AdminOrderCard = ({
  order,
  onApprove,
  onReject,
  onComplete,
  onDelete,
}) => {
  const orderId = order._id ? order._id.slice(-6).toUpperCase() : "N/A";

  const createdDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : "N/A";

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

  const statusStyle = getStatusStyle();

  const renderButtons = () => {
    if (order.status === "Pending") {
      return (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => onApprove(order._id)}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={WHITE} />
            <Text style={styles.actionText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => onReject(order._id)}
          >
            <Ionicons name="close-circle-outline" size={18} color={WHITE} />
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (order.status === "Preparing") {
      return (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.deliveredButton}
            onPress={() => onComplete(order._id)}
          >
            <Ionicons name="bag-check-outline" size={18} color={WHITE} />
            <Text style={styles.actionText}>Delivered</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (order.status === "Rejected") {
      return (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(order._id)}
          >
            <Ionicons name="trash-outline" size={18} color={WHITE} />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Ionicons name="receipt-outline" size={26} color={DARK_GREEN} />
        </View>

        <View style={statusStyle.badge}>
          <Ionicons
            name={statusStyle.icon}
            size={14}
            color={statusStyle.text.color}
          />
          <Text style={statusStyle.text}>{order.status}</Text>
        </View>
      </View>

      <Text style={styles.orderTitle}>Order #{orderId}</Text>

      <Text style={styles.customerName}>
        {order.customer?.name || "Unknown Customer"}
      </Text>

      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>Date: {createdDate}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="mail-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>
          {order.customer?.email || "No email"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>{order.phone}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color={MUTED} />
        <Text style={styles.infoText}>{order.deliveryAddress}</Text>
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

        <View style={styles.paymentBox}>
          <Ionicons name="cash-outline" size={16} color={DARK_GREEN} />
          <Text style={styles.paymentText}>{order.paymentMethod}</Text>
        </View>
      </View>

      {renderButtons()}
    </View>
  );
};

export default AdminOrderCard;

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
  orderTitle: {
    color: TEXT,
    fontSize: 21,
    fontWeight: "900",
    marginTop: 14,
  },
  customerName: {
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
    backgroundColor: ACTIVE_BG,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completedText: {
    color: DARK_GREEN,
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
    gap: 10,
    marginBottom: 6,
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
  paymentBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: ACTIVE_BG,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 18,
  },
  paymentText: {
    color: DARK_GREEN,
    fontSize: 11,
    fontWeight: "900",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  approveButton: {
    flex: 1,
    backgroundColor: MID_GREEN,
    borderRadius: 20,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: RED,
    borderRadius: 20,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  deliveredButton: {
    flex: 1,
    backgroundColor: MID_GREEN,
    borderRadius: 20,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: RED,
    borderRadius: 20,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  actionText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "900",
  },
});
