import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import API from "../../api/api";
import OrderItemCard from "../../components/customer/OrderItemCard";

const GREEN = "#00A878";
const GREEN_DARK = "#047857";
const GREEN_SOFT = "#E6F7F2";
const BG = "#F4FAF7";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const filters = [
    "All",
    "Pending",
    "Preparing",
    "Completed",
    "Rejected",
    "Cancelled",
  ];

  const getMyOrders = async () => {
    try {
      setLoading(true);

      const response = await API.get("/orders/my-orders");
      setOrders(response.data.data);
    } catch (error) {
      console.log("MY ORDERS ERROR:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    try {
      await API.put(`/orders/${id}/cancel`);

      Alert.alert("Success", "Order cancelled successfully");
      getMyOrders();
    } catch (error) {
      console.log("CANCEL ORDER ERROR:", error.response?.data || error.message);

      Alert.alert(
        "Cancel Failed",
        error.response?.data?.message || "Failed to cancel order",
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      getMyOrders();
    }, []),
  );

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  const pendingCount = orders.filter(
    (order) => order.status === "Pending",
  ).length;
  const preparingCount = orders.filter(
    (order) => order.status === "Preparing",
  ).length;
  const completedCount = orders.filter(
    (order) => order.status === "Completed",
  ).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>Order Tracking</Text>
          <Text style={styles.title}>My Orders</Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="bag-check-outline" size={27} color={GREEN} />
        </View>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Track your pharmacy orders</Text>
        <Text style={styles.heroText}>
          Check your order status from pending approval to completed delivery.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>{pendingCount}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>{preparingCount}</Text>
            <Text style={styles.summaryLabel}>Preparing</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>{completedCount}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Order History</Text>

        <TouchableOpacity style={styles.refreshButton} onPress={getMyOrders}>
          <Ionicons name="refresh-outline" size={18} color={GREEN_DARK} />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, isActive && styles.activeFilterChip]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[styles.filterText, isActive && styles.activeFilterText]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={GREEN} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyBox}>
          <View style={styles.emptyIcon}>
            <Ionicons name="receipt-outline" size={44} color={GREEN} />
          </View>

          <Text style={styles.emptyTitle}>No orders found</Text>
          <Text style={styles.emptyText}>
            Your orders will appear here after you place an order.
          </Text>
        </View>
      ) : (
        filteredOrders.map((order) => (
          <OrderItemCard key={order._id} order={order} onCancel={cancelOrder} />
        ))
      )}
    </ScrollView>
  );
};

export default MyOrdersScreen;

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
  heroCard: {
    backgroundColor: GREEN,
    borderRadius: 28,
    padding: 20,
    marginBottom: 22,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  heroTitle: {
    color: WHITE,
    fontSize: 22,
    fontWeight: "900",
  },
  heroText: {
    color: "#EFFFF9",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  summaryNumber: {
    color: WHITE,
    fontSize: 20,
    fontWeight: "900",
  },
  summaryLabel: {
    color: "#EFFFF9",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "900",
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: GREEN_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  refreshText: {
    color: GREEN_DARK,
    fontSize: 12,
    fontWeight: "900",
  },
  filterRow: {
    gap: 10,
    paddingBottom: 16,
  },
  filterChip: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  activeFilterChip: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  filterText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "900",
  },
  activeFilterText: {
    color: WHITE,
  },
  loadingBox: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  loadingText: {
    color: MUTED,
    marginTop: 10,
    fontWeight: "700",
  },
  emptyBox: {
    backgroundColor: WHITE,
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyIcon: {
    width: 78,
    height: 78,
    borderRadius: 28,
    backgroundColor: GREEN_SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: TEXT,
    fontSize: 21,
    fontWeight: "900",
  },
  emptyText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
});
