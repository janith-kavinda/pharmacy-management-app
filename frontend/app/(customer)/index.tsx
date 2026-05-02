import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";

import API from "../../src/api/api";
import { useCart } from "../../src/context/CartContext";

const GREEN = "#00A878";
const GREEN_DARK = "#047857";
const GREEN_SOFT = "#E6F7F2";
const BG = "#F4FAF7";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";

export default function CustomerHome() {
  const [name, setName] = useState("Customer");
  const [medicineCount, setMedicineCount] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [loading, setLoading] = useState(false);

  const { cartItems, cartTotal } = useCart();

  const cartCount = cartItems.reduce(
    (total: number, item: any) => total + item.quantity,
    0,
  );

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("role");
    await SecureStore.deleteItemAsync("user");

    router.replace("/login");
  };

  const loadHomeData = async () => {
    try {
      setLoading(true);

      const userString = await SecureStore.getItemAsync("user");

      if (userString) {
        const user = JSON.parse(userString);
        setName(user.name || "Customer");
      }

      const medicineResponse = await API.get("/medicines");
      setMedicineCount(medicineResponse.data.data.length);

      const orderResponse = await API.get("/orders/my-orders");

      const active = orderResponse.data.data.filter(
        (order: any) =>
          order.status === "Pending" || order.status === "Preparing",
      );

      setActiveOrders(active.length);
    } catch (error: any) {
      console.log("HOME LOAD ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, []),
  );

  const quickActions = [
    {
      title: "Medicines",
      subtitle: "Browse available medicine",
      icon: "medkit-outline",
      route: "/medicines",
    },
    {
      title: "Cart",
      subtitle: `${cartCount} item${cartCount === 1 ? "" : "s"} selected`,
      icon: "cart-outline",
      route: "/cart",
    },
    {
      title: "My Orders",
      subtitle: "Track your orders",
      icon: "bag-check-outline",
      route: "/orders",
    },
    {
      title: "Profile",
      subtitle: "Update your details",
      icon: "person-circle-outline",
      route: "/profile",
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
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.name}>{name}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color={WHITE} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroIconBox}>
          <Ionicons name="medical-outline" size={34} color={GREEN} />
        </View>

        <Text style={styles.heroTitle}>Your trusted online pharmacy</Text>
        <Text style={styles.heroText}>
          Check medicine availability, add items to your cart, and track your
          orders easily.
        </Text>

        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => router.push("/medicines")}
        >
          <Text style={styles.heroButtonText}>Browse Medicines</Text>
          <Ionicons name="arrow-forward" size={18} color={WHITE} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Overview</Text>

      {loading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="small" color={GREEN} />
          <Text style={styles.loadingText}>Loading latest data...</Text>
        </View>
      ) : (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="medkit-outline" size={24} color={GREEN} />
            <Text style={styles.statNumber}>{medicineCount}</Text>
            <Text style={styles.statLabel}>Medicines</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="cart-outline" size={24} color={GREEN} />
            <Text style={styles.statNumber}>{cartCount}</Text>
            <Text style={styles.statLabel}>Cart Items</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color={GREEN} />
            <Text style={styles.statNumber}>{activeOrders}</Text>
            <Text style={styles.statLabel}>Active Orders</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actionGrid}>
        {quickActions.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.actionCard}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.actionIconBox}>
              <Ionicons name={item.icon as any} size={24} color={GREEN} />
            </View>

            <Text style={styles.actionTitle}>{item.title}</Text>
            <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.cartSummary}>
        <View>
          <Text style={styles.cartTitle}>Current Cart</Text>
          <Text style={styles.cartSubtitle}>
            {cartCount > 0
              ? `${cartCount} item${cartCount === 1 ? "" : "s"} ready to order`
              : "Your cart is empty"}
          </Text>
        </View>

        <View style={styles.cartAmountBox}>
          <Text style={styles.cartAmount}>Rs. {cartTotal}</Text>
        </View>
      </View>

      <View style={styles.tipCard}>
        <View style={styles.tipIconBox}>
          <Ionicons name="shield-checkmark-outline" size={24} color={GREEN} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.tipTitle}>Health Reminder</Text>
          <Text style={styles.tipText}>
            Always check expiry dates and follow pharmacist instructions before
            using medicine.
          </Text>
        </View>
      </View>
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
    marginBottom: 20,
  },
  welcome: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "600",
  },
  name: {
    color: TEXT,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: GREEN,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
  },
  logoutText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "800",
  },
  heroCard: {
    backgroundColor: GREEN,
    borderRadius: 28,
    padding: 22,
    marginBottom: 24,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 12,
  },
  heroIconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    color: WHITE,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  heroText: {
    color: "#EFFFF9",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  heroButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: GREEN_DARK,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
  },
  heroButtonText: {
    color: WHITE,
    fontWeight: "800",
    fontSize: 13,
  },
  sectionTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },
  loadingCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    marginBottom: 22,
  },
  loadingText: {
    marginTop: 8,
    color: MUTED,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: TEXT,
    marginTop: 8,
  },
  statLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "center",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  actionCard: {
    width: "48%",
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  actionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: GREEN_SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "900",
  },
  actionSubtitle: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    lineHeight: 17,
  },
  cartSummary: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "900",
  },
  cartSubtitle: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  cartAmountBox: {
    backgroundColor: GREEN_SOFT,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  cartAmount: {
    color: GREEN_DARK,
    fontWeight: "900",
  },
  tipCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    gap: 14,
  },
  tipIconBox: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: GREEN_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  tipTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "900",
  },
  tipText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    marginTop: 4,
  },
});
