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
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import API from "../api/api";
import AdminCustomerCard from "../components/admin/AdminCustomerCard";
import AdminStatCard from "../components/admin/AdminStatCard";

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

const CustomerScreen = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const getCustomers = async () => {
    try {
      setLoading(true);

      const response = await API.get("/customers");
      setCustomers(response.data.data);
    } catch (error) {
      console.log(
        "GET CUSTOMERS ERROR:",
        error.response?.data || error.message,
      );
      Alert.alert("Error", "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setSelectedCustomerId(null);
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setPassword("");
  };

  const closeModal = () => {
    clearForm();
    setModalVisible(false);
  };

  const openAddModal = () => {
    clearForm();
    setModalVisible(true);
  };

  const openEditModal = (customer) => {
    setSelectedCustomerId(customer._id);
    setName(customer.name || "");
    setPhone(customer.phone || "");
    setEmail(customer.email || "");
    setAddress(customer.address || "");
    setPassword("");
    setModalVisible(true);
  };

  const addCustomer = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert(
        "Validation Error",
        "Name, email, password and phone are required",
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await API.post("/customers", {
        name,
        email,
        password,
        phone,
        address,
      });

      closeModal();
      getCustomers();

      Alert.alert("Success", "Customer created successfully");
    } catch (error) {
      console.log("ADD CUSTOMER ERROR:", error.response?.data || error.message);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add customer",
      );
    }
  };

  const updateCustomer = async () => {
    if (!selectedCustomerId) {
      Alert.alert("Error", "Please select a customer first");
      return;
    }

    if (!name || !email || !phone) {
      Alert.alert("Validation Error", "Name, email and phone are required");
      return;
    }

    try {
      await API.put(`/customers/${selectedCustomerId}`, {
        name,
        email,
        phone,
        address,
      });

      closeModal();
      getCustomers();

      Alert.alert("Success", "Customer updated successfully");
    } catch (error) {
      console.log(
        "UPDATE CUSTOMER ERROR:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update customer",
      );
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await API.delete(`/customers/${id}`);
      getCustomers();

      Alert.alert("Success", "Customer deleted successfully");
    } catch (error) {
      console.log(
        "DELETE CUSTOMER ERROR:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to delete customer",
      );
    }
  };

  const confirmDeleteCustomer = (id) => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCustomer(id),
        },
      ],
    );
  };

  useFocusEffect(
    useCallback(() => {
      getCustomers();
    }, []),
  );

  const filteredCustomers = customers.filter((customer) => {
    const keyword = searchQuery.toLowerCase();

    const customerName = customer.name?.toLowerCase() || "";
    const customerEmail = customer.email?.toLowerCase() || "";
    const customerPhone = customer.phone?.toLowerCase() || "";
    const customerAddress = customer.address?.toLowerCase() || "";

    return (
      customerName.includes(keyword) ||
      customerEmail.includes(keyword) ||
      customerPhone.includes(keyword) ||
      customerAddress.includes(keyword)
    );
  });

  const withAddressCount = customers.filter(
    (customer) => customer.address,
  ).length;
  const noAddressCount = customers.filter(
    (customer) => !customer.address,
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.smallTitle}>Admin Users</Text>
          <Text style={styles.title}>Customers</Text>
        </View>

        <TouchableOpacity style={styles.headerIconBtn} onPress={getCustomers}>
          <Ionicons name="refresh-outline" size={22} color={DARK_GREEN} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <AdminStatCard
          title="Total"
          value={customers.length}
          icon="people-outline"
        />

        <AdminStatCard
          title="Address"
          value={withAddressCount}
          icon="location-outline"
          iconColor="#2563EB"
          iconBg="#DBEAFE"
          valueColor="#2563EB"
        />

        <AdminStatCard
          title="No Address"
          value={noAddressCount}
          icon="alert-circle-outline"
          iconColor="#D97706"
          iconBg="#FEF3C7"
          valueColor="#D97706"
        />
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={MUTED} />

        <TextInput
          style={styles.searchInput}
          placeholder="Search customers, email, phone..."
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

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={DARK_GREEN} />
          <Text style={styles.loadingText}>Loading customers...</Text>
        </View>
      ) : filteredCustomers.length === 0 ? (
        <View style={styles.emptyBox}>
          <View style={styles.emptyIcon}>
            <Ionicons name="people-outline" size={42} color={DARK_GREEN} />
          </View>

          <Text style={styles.emptyTitle}>
            {searchQuery ? "No results found" : "No customers yet"}
          </Text>

          <Text style={styles.emptyText}>
            {searchQuery
              ? "Try searching with another customer name, email or phone."
              : "Tap the Add Customer button below to create your first customer."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AdminCustomerCard
              customer={item}
              onEdit={openEditModal}
              onDelete={confirmDeleteCustomer}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={openAddModal}
        activeOpacity={0.9}
      >
        <Ionicons name="add-circle-outline" size={22} color={WHITE} />
        <Text style={styles.fabText}>Add Customer</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                {selectedCustomerId ? "Edit Customer" : "Add Customer"}
              </Text>

              <Text style={styles.modalSubtitle}>
                {selectedCustomerId
                  ? "Update customer details below"
                  : "Create a new customer account"}
              </Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
              <Ionicons name="close" size={22} color={TEXT} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Name</Text>

              <View style={styles.inputBox}>
                <Ionicons name="person-outline" size={20} color={MUTED} />

                <TextInput
                  style={styles.input}
                  placeholder="e.g. Nimal Perera"
                  placeholderTextColor={MUTED}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>

              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={20} color={MUTED} />

                <TextInput
                  style={styles.input}
                  placeholder="customer@example.com"
                  placeholderTextColor={MUTED}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {!selectedCustomerId && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Temporary Password</Text>

                <View style={styles.inputBox}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={MUTED}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Minimum 6 characters"
                    placeholderTextColor={MUTED}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                <Text style={styles.helperText}>
                  Customer can use this password to login.
                </Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>

              <View style={styles.inputBox}>
                <Ionicons name="call-outline" size={20} color={MUTED} />

                <TextInput
                  style={styles.input}
                  placeholder="e.g. 0712345678"
                  placeholderTextColor={MUTED}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Delivery Address</Text>

              <View style={[styles.inputBox, styles.addressBox]}>
                <Ionicons name="location-outline" size={20} color={MUTED} />

                <TextInput
                  style={[styles.input, styles.addressInput]}
                  placeholder="Customer delivery address"
                  placeholderTextColor={MUTED}
                  value={address}
                  onChangeText={setAddress}
                  multiline
                />
              </View>
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={selectedCustomerId ? updateCustomer : addCustomer}
              >
                <Ionicons
                  name={
                    selectedCustomerId ? "save-outline" : "add-circle-outline"
                  }
                  size={20}
                  color={WHITE}
                />

                <Text style={styles.submitButtonText}>
                  {selectedCustomerId ? "Save Changes" : "Add Customer"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default CustomerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
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

  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
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
    marginBottom: 14,
    height: 50,
  },
  searchInput: {
    flex: 1,
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 12,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 10,
    height: 56,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: "#022C22",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#6EE7B7",
    shadowColor: "#022C22",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 18,
    zIndex: 20,
  },
  fabText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: MUTED,
    fontWeight: "700",
    fontSize: 14,
  },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
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

  modalContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    color: TEXT,
    fontSize: 22,
    fontWeight: "900",
  },
  modalSubtitle: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 22,
    paddingBottom: 40,
  },

  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  addressBox: {
    alignItems: "flex-start",
    paddingTop: 12,
  },
  input: {
    flex: 1,
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 12,
  },
  addressInput: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  helperText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
  },

  modalButtonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "800",
  },
  submitButton: {
    flex: 2,
    backgroundColor: MID_GREEN,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  submitButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "900",
  },
});
