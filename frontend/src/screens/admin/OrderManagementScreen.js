import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import API from "../../api/api";
import AdminOrderCard from "../../components/admin/AdminOrderCard";

const DARK_GREEN = "#065F46";
const HEADER_BG = "#022C22";
const ACTIVE_BG = "#D1FAE5";
const BG = "#F0FDF4";
const WHITE = "#FFFFFF";
const TEXT = "#0F172A";
const MUTED = "#6B7280";
const BORDER = "#A7F3D0";

const OrderManagementScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "Pending",
    "Preparing",
    "Completed",
    "Rejected",
    "Cancelled",
  ];

  const getOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get("/orders");
      setOrders(response.data.data);
    } catch (error) {
      console.log("ADMIN ORDERS ERROR:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const approveOrder = async (id) => {
    Alert.alert(
      "Approve Order",
      "Are you sure you want to approve this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            try {
              await API.put(`/orders/${id}/approve`);
              Alert.alert(
                "Success",
                "Order approved. Status changed to Preparing.",
              );
              getOrders();
            } catch (error) {
              Alert.alert(
                "Approve Failed",
                error.response?.data?.message || "Failed to approve order",
              );
            }
          },
        },
      ],
    );
  };

  const rejectOrder = async (id) => {
    Alert.alert("Reject Order", "Are you sure you want to reject this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          try {
            await API.put(`/orders/${id}/reject`);
            Alert.alert("Success", "Order rejected successfully");
            getOrders();
          } catch (error) {
            Alert.alert(
              "Reject Failed",
              error.response?.data?.message || "Failed to reject order",
            );
          }
        },
      },
    ]);
  };

  const completeOrder = async (id) => {
    Alert.alert(
      "Complete Order",
      "Mark this order as delivered and completed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delivered",
          onPress: async () => {
            try {
              await API.put(`/orders/${id}/complete`);
              Alert.alert("Success", "Order completed successfully");
              getOrders();
            } catch (error) {
              Alert.alert(
                "Complete Failed",
                error.response?.data?.message || "Failed to complete order",
              );
            }
          },
        },
      ],
    );
  };

  const deleteOrder = async (id) => {
    Alert.alert(
      "Delete Order",
      "This will permanently delete the rejected order. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await API.delete(`/orders/${id}`);
              Alert.alert("Success", "Rejected order deleted successfully");
              getOrders();
            } catch (error) {
              Alert.alert(
                "Delete Failed",
                error.response?.data?.message || "Failed to delete order",
              );
            }
          },
        },
      ],
    );
  };

  useFocusEffect(
    useCallback(() => {
      getOrders();
    }, []),
  );

  const pendingCount = orders.filter(
    (order) => order.status === "Pending",
  ).length;

  const activeOrdersCount = orders.filter(
    (order) => order.status === "Pending" || order.status === "Preparing",
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "Completed",
  ).length;

  const filteredOrders = orders.filter((order) => {
    const keyword = searchQuery.toLowerCase();

    const customerName = order.customer?.name?.toLowerCase() || "";
    const customerEmail = order.customer?.email?.toLowerCase() || "";
    const phone = order.phone?.toLowerCase() || "";
    const status = order.status?.toLowerCase() || "";
    const orderId = order._id?.toLowerCase() || "";

    const matchesSearch =
      customerName.includes(keyword) ||
      customerEmail.includes(keyword) ||
      phone.includes(keyword) ||
      status.includes(keyword) ||
      orderId.includes(keyword);

    const matchesFilter =
      activeFilter === "All" || order.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const renderHeader = () => (
    <>
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.smallTitle}>Admin Sales</Text>
          <Text style={styles.title}>Orders</Text>
        </View>

        <TouchableOpacity style={styles.headerIconBtn} onPress={getOrders}>
          <Ionicons name="refresh-outline" size={22} color={DARK_GREEN} />
        </TouchableOpacity>
      </View>

      <View style={styles.overviewCard}>
        <View style={styles.overviewTop}>
          <View style={styles.overviewIcon}>
            <Ionicons name="receipt-outline" size={27} color={DARK_GREEN} />
          </View>

          <View style={styles.pendingBadge}>
            <Ionicons name="time-outline" size={14} color="#D97706" />
            <Text style={styles.pendingBadgeText}>{pendingCount} Pending</Text>
          </View>
        </View>

        <Text style={styles.overviewTitle}>Order Management</Text>
        <Text style={styles.overviewText}>
          Review customer orders, approve pending orders, and complete
          deliveries.
        </Text>

        <View style={styles.overviewNumbers}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber}>{orders.length}</Text>
            <Text style={styles.overviewLabel}>Total</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber}>{activeOrdersCount}</Text>
            <Text style={styles.overviewLabel}>Active</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber}>{completedCount}</Text>
            <Text style={styles.overviewLabel}>Done</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={MUTED} />

        <TextInput
          style={styles.searchInput}
          placeholder="Search orders, customers, phone..."
          placeholderTextColor={MUTED}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={MUTED} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterCard}>
        <View style={styles.filterHeader}>
          <View>
            <Text style={styles.filterTitle}>Filter Orders</Text>
            <Text style={styles.filterSubtitle}>
              Showing {filteredOrders.length} of {orders.length}
            </Text>
          </View>

          <Ionicons name="filter-outline" size={22} color={DARK_GREEN} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
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
                  style={[
                    styles.filterText,
                    isActive && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={DARK_GREEN} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyBox}>
        <View style={styles.emptyIcon}>
          <Ionicons name="receipt-outline" size={42} color={DARK_GREEN} />
        </View>

        <Text style={styles.emptyTitle}>
          {searchQuery || activeFilter !== "All"
            ? "No orders found"
            : "No orders yet"}
        </Text>

        <Text style={styles.emptyText}>
          {searchQuery || activeFilter !== "All"
            ? "Try changing your search or selected filter."
            : "Customer orders will appear here after they place orders."}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={loading ? [] : filteredOrders}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <AdminOrderCard
          order={item}
          onApprove={approveOrder}
          onReject={rejectOrder}
          onComplete={completeOrder}
          onDelete={deleteOrder}
        />
      )}
    />
  );
};

export default OrderManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  listContent: {
    paddingBottom: 150,
  },

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 16,
    backgroundColor: BG,
  },
  smallTitle: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    color: TEXT,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 2,
  },
  headerIconBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: ACTIVE_BG,
    alignItems: "center",
    justifyContent: "center",
  },

  overviewCard: {
    backgroundColor: HEADER_BG,
    marginHorizontal: 20,
    borderRadius: 26,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#6EE7B7",
  },
  overviewTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  overviewIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: ACTIVE_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 18,
  },
  pendingBadgeText: {
    color: "#D97706",
    fontSize: 11,
    fontWeight: "900",
  },
  overviewTitle: {
    color: WHITE,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 14,
  },
  overviewText: {
    color: ACTIVE_BG,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    marginTop: 6,
  },
  overviewNumbers: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  overviewItem: {
    flex: 1,
    alignItems: "center",
  },
  overviewNumber: {
    color: WHITE,
    fontSize: 21,
    fontWeight: "900",
  },
  overviewLabel: {
    color: ACTIVE_BG,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 3,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(209,250,229,0.35)",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    height: 50,
  },
  searchInput: {
    flex: 1,
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
  },

  filterCard: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 14,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "900",
  },
  filterSubtitle: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  filterScroll: {
    gap: 8,
    paddingRight: 8,
  },
  filterChip: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 18,
  },
  activeFilterChip: {
    backgroundColor: HEADER_BG,
    borderColor: "#6EE7B7",
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
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  loadingText: {
    color: MUTED,
    fontWeight: "700",
    fontSize: 14,
    marginTop: 10,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 50,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: ACTIVE_BG,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: TEXT,
    fontSize: 20,
    fontWeight: "900",
  },
  emptyText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 6,
  },
});
