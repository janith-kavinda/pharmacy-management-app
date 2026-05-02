import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";

import API from "../../api/api";
import { useCart } from "../../context/CartContext";
import CartItemCard from "../../components/customer/CartItemCard";

const GREEN = "#00A878";
const GREEN_DARK = "#047857";
const GREEN_SOFT = "#E6F7F2";
const BG = "#F4FAF7";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";
const RED = "#DC2626";
const RED_SOFT = "#FEE2E2";

const CartScreen = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const loadUserData = async () => {
    const userString = await SecureStore.getItemAsync("user");

    if (userString) {
      const user = JSON.parse(userString);
      setDeliveryAddress(user.address || "");
      setPhone(user.phone || "");
    }
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart Empty", "Please add medicines to cart first");
      return;
    }

    if (!deliveryAddress || !phone) {
      Alert.alert("Missing Details", "Delivery address and phone are required");
      return;
    }

    try {
      setPlacingOrder(true);

      const orderItems = cartItems.map((item) => ({
        medicine: item.medicine,
        quantity: item.quantity,
      }));

      await API.post("/orders", {
        items: orderItems,
        deliveryAddress,
        phone,
        paymentMethod: "Cash On Delivery",
      });

      clearCart();

      Alert.alert("Success", "Order placed successfully");
      router.push("/orders");
    } catch (error) {
      console.log("PLACE ORDER ERROR:", error.response?.data || error.message);

      Alert.alert(
        "Order Failed",
        error.response?.data?.message || "Failed to place order",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, []),
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>Checkout</Text>
          <Text style={styles.title}>My Cart</Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="cart-outline" size={27} color={GREEN} />
        </View>
      </View>

      <View style={styles.heroCard}>
        <View>
          <Text style={styles.heroTitle}>Order Summary</Text>
          <Text style={styles.heroText}>
            Review selected medicines and confirm your delivery details.
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>{cartCount}</Text>
            <Text style={styles.summaryLabel}>Items</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>Rs. {cartTotal}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyBox}>
          <View style={styles.emptyIcon}>
            <Ionicons name="cart-outline" size={44} color={GREEN} />
          </View>

          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Browse available medicines and add them to your cart before placing
            an order.
          </Text>

          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/medicines")}
          >
            <Text style={styles.browseButtonText}>Browse Medicines</Text>
            <Ionicons name="arrow-forward" size={18} color={WHITE} />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cart Items</Text>

            <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
              <Ionicons name="trash-outline" size={16} color={RED} />
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {cartItems.map((item) => (
            <CartItemCard
              key={item.medicine}
              item={item}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
            />
          ))}

          <Text style={styles.sectionTitle}>Delivery Details</Text>

          <View style={styles.deliveryCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Delivery Address</Text>

              <View style={styles.inputBox}>
                <Ionicons name="location-outline" size={20} color={MUTED} />

                <TextInput
                  style={styles.input}
                  placeholder="Enter delivery address"
                  placeholderTextColor={MUTED}
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                  multiline
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>

              <View style={styles.inputBox}>
                <Ionicons name="call-outline" size={20} color={MUTED} />

                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  placeholderTextColor={MUTED}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.paymentBox}>
              <View style={styles.paymentIcon}>
                <Ionicons name="cash-outline" size={22} color={GREEN} />
              </View>

              <View>
                <Text style={styles.paymentTitle}>Cash On Delivery</Text>
                <Text style={styles.paymentText}>
                  Payment will be collected when order is delivered.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.totalCard}>
            <View>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>Rs. {cartTotal}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.placeOrderButton,
                placingOrder && styles.disabledButton,
              ]}
              onPress={placeOrder}
              disabled={placingOrder}
            >
              {placingOrder ? (
                <ActivityIndicator size="small" color={WHITE} />
              ) : (
                <>
                  <Text style={styles.placeOrderText}>Place Order</Text>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={WHITE}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default CartScreen;

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
    marginBottom: 18,
  },
  browseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: GREEN,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "900",
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
    marginBottom: 14,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: RED_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginBottom: 12,
  },
  clearText: {
    color: RED,
    fontSize: 12,
    fontWeight: "900",
  },
  deliveryCard: {
    backgroundColor: WHITE,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  input: {
    flex: 1,
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 12,
  },
  paymentBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: GREEN_SOFT,
    borderRadius: 20,
    padding: 14,
    marginTop: 4,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "900",
  },
  paymentText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
    maxWidth: 240,
  },
  totalCard: {
    backgroundColor: WHITE,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
  },
  totalAmount: {
    color: TEXT,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 2,
  },
  placeOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: GREEN,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  placeOrderText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "900",
  },
});
