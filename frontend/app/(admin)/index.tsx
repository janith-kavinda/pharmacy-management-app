import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import API from "../../src/api/api";

const DARK_GREEN = "#065F46";
const MID_GREEN = "#047857";
const HEADER_BG = "#022C22";
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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalSuppliers: 0,
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockMedicines: 0,
    totalSales: 0,
  });

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("role");
    await SecureStore.deleteItemAsync("user");

    router.replace("/login");
  };

  const getDashboardStats = async () => {
    try {
      setLoading(true);

      const response = await API.get("/dashboard/stats");
      setStats(response.data.data);
    } catch (error: any) {
      console.log("DASHBOARD ERROR:", error.response?.data || error.message);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getDashboardStats();
    }, []),
  );

  const statCards = [
    {
      title: "Medicines",
      value: stats.totalMedicines,
      icon: "medkit-outline",
      route: "/medicines",
    },
    {
      title: "Suppliers",
      value: stats.totalSuppliers,
      icon: "business-outline",
      route: "/suppliers",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: "people-outline",
      route: "/customers",
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: "receipt-outline",
      route: "/orders",
    },
  ];

  const quickActions = [
    {
      title: "Manage Medicines",
      subtitle: "Add, update and check stock",
      icon: "medkit-outline",
      route: "/medicines",
    },
    {
      title: "Manage Orders",
      subtitle: "Approve or reject customer orders",
      icon: "receipt-outline",
      route: "/orders",
    },
    {
      title: "Manage Suppliers",
      subtitle: "View and update suppliers",
      icon: "business-outline",
      route: "/suppliers",
    },
    {
      title: "Manage Customers",
      subtitle: "View registered customers",
      icon: "people-outline",
      route: "/customers",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>Pharmacy Admin</Text>
          <Text style={styles.title}>Dashboard</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={17} color={ACTIVE_BG} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroIconBox}>
            <Ionicons
              name="shield-checkmark-outline"
              size={34}
              color={DARK_GREEN}
            />
          </View>

          <View style={styles.adminBadge}>
            <Ionicons name="lock-closed-outline" size={13} color={ACTIVE_BG} />
            <Text style={styles.adminBadgeText}>Admin Panel</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Manage your pharmacy smoothly</Text>
        <Text style={styles.heroText}>
          Track medicines, suppliers, customers, orders, stock alerts and sales
          from one place.
        </Text>

        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => router.push("/orders" as any)}
        >
          <Text style={styles.heroButtonText}>View Orders</Text>
          <Ionicons name="arrow-forward" size={18} color={WHITE} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={DARK_GREEN} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      ) : (
        <>
          <View style={styles.alertRow}>
            <TouchableOpacity
              style={styles.pendingCard}
              onPress={() => router.push("/orders" as any)}
            >
              <View style={styles.alertIconYellow}>
                <Ionicons name="time-outline" size={24} color={YELLOW} />
              </View>

              <View>
                <Text style={styles.alertNumber}>{stats.pendingOrders}</Text>
                <Text style={styles.alertLabel}>Pending Orders</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.lowStockCard}
              onPress={() => router.push("/medicines" as any)}
            >
              <View style={styles.alertIconRed}>
                <Ionicons name="warning-outline" size={24} color={RED} />
              </View>

              <View>
                <Text style={styles.alertNumber}>
                  {stats.lowStockMedicines}
                </Text>
                <Text style={styles.alertLabel}>Low Stock</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.salesCard}>
            <View>
              <Text style={styles.salesLabel}>Total Sales</Text>
              <Text style={styles.salesAmount}>Rs. {stats.totalSales}</Text>
              <Text style={styles.salesNote}>
                Calculated from completed orders only
              </Text>
            </View>

            <View style={styles.salesIcon}>
              <Ionicons name="cash-outline" size={30} color={DARK_GREEN} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Overview</Text>

          <View style={styles.statsGrid}>
            {statCards.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={styles.statCard}
                onPress={() => router.push(item.route as any)}
              >
                <View style={styles.statIconBox}>
                  <Ionicons
                    name={item.icon as any}
                    size={25}
                    color={DARK_GREEN}
                  />
                </View>

                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actionGrid}>
            {quickActions.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={styles.actionCard}
                onPress={() => router.push(item.route as any)}
              >
                <View style={styles.actionIconBox}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={DARK_GREEN}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.actionTitle}>{item.title}</Text>
                  <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color={MUTED} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.noteCard}>
            <View style={styles.noteIcon}>
              <Ionicons name="analytics-outline" size={24} color={DARK_GREEN} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.noteTitle}>Admin Reminder</Text>
              <Text style={styles.noteText}>
                Check pending orders and low-stock medicines daily to keep the
                pharmacy service running smoothly.
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

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
    fontSize: 30,
    fontWeight: "900",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: HEADER_BG,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#6EE7B7",
  },
  logoutText: {
    color: ACTIVE_BG,
    fontSize: 12,
    fontWeight: "900",
  },
  heroCard: {
    backgroundColor: HEADER_BG,
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    shadowColor: HEADER_BG,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 22,
    elevation: 12,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroIconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: ACTIVE_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(6, 95, 70, 0.6)",
    borderWidth: 1,
    borderColor: "#6EE7B7",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 18,
  },
  adminBadgeText: {
    color: ACTIVE_BG,
    fontSize: 11,
    fontWeight: "900",
  },
  heroTitle: {
    color: WHITE,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 18,
  },
  heroText: {
    color: "#D1FAE5",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 18,
  },
  heroButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: MID_GREEN,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
  },
  heroButtonText: {
    color: WHITE,
    fontWeight: "900",
    fontSize: 13,
  },
  loadingBox: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  loadingText: {
    color: MUTED,
    marginTop: 10,
    fontWeight: "700",
  },
  alertRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  pendingCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  lowStockCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  alertIconYellow: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: YELLOW_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  alertIconRed: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: RED_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  alertNumber: {
    color: TEXT,
    fontSize: 22,
    fontWeight: "900",
  },
  alertLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
  salesCard: {
    backgroundColor: WHITE,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  salesLabel: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "800",
  },
  salesAmount: {
    color: TEXT,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },
  salesNote: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  salesIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: ACTIVE_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  statCard: {
    width: "48%",
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 17,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: ACTIVE_BG,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    color: TEXT,
    fontSize: 26,
    fontWeight: "900",
  },
  statTitle: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },
  actionGrid: {
    gap: 12,
    marginBottom: 18,
  },
  actionCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: ACTIVE_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "900",
  },
  actionSubtitle: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
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
    backgroundColor: ACTIVE_BG,
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
