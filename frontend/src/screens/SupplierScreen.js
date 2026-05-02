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
import AdminSupplierCard from "../components/admin/AdminSupplierCard";
import AdminStatCard from "../components/admin/AdminStatCard";

const DARK_GREEN = "#065F46";
const MID_GREEN = "#047857";
const ACTIVE_BG = "#D1FAE5";
const BG = "#F0FDF4";
const WHITE = "#FFFFFF";
const TEXT = "#0F172A";
const MUTED = "#6B7280";
const BORDER = "#A7F3D0";

const SupplierScreen = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const getSuppliers = async () => {
    try {
      setLoading(true);

      const response = await API.get("/suppliers");
      setSuppliers(response.data.data);
    } catch (error) {
      console.log(
        "GET SUPPLIERS ERROR:",
        error.response?.data || error.message,
      );
      Alert.alert("Error", "Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setSelectedSupplierId(null);
    setName("");
    setCompany("");
    setPhone("");
    setEmail("");
    setAddress("");
  };

  const closeModal = () => {
    clearForm();
    setModalVisible(false);
  };

  const openAddModal = () => {
    clearForm();
    setModalVisible(true);
  };

  const openEditModal = (supplier) => {
    setSelectedSupplierId(supplier._id);
    setName(supplier.name || "");
    setCompany(supplier.company || "");
    setPhone(supplier.phone || "");
    setEmail(supplier.email || "");
    setAddress(supplier.address || "");
    setModalVisible(true);
  };

  const addSupplier = async () => {
    if (!name || !company || !phone) {
      Alert.alert("Validation Error", "Name, company and phone are required");
      return;
    }

    try {
      await API.post("/suppliers", {
        name,
        company,
        phone,
        email,
        address,
      });

      closeModal();
      getSuppliers();

      Alert.alert("Success", "Supplier added successfully");
    } catch (error) {
      console.log("ADD SUPPLIER ERROR:", error.response?.data || error.message);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add supplier",
      );
    }
  };

  const updateSupplier = async () => {
    if (!selectedSupplierId) {
      Alert.alert("Error", "Please select a supplier first");
      return;
    }

    if (!name || !company || !phone) {
      Alert.alert("Validation Error", "Name, company and phone are required");
      return;
    }

    try {
      await API.put(`/suppliers/${selectedSupplierId}`, {
        name,
        company,
        phone,
        email,
        address,
      });

      closeModal();
      getSuppliers();

      Alert.alert("Success", "Supplier updated successfully");
    } catch (error) {
      console.log(
        "UPDATE SUPPLIER ERROR:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update supplier",
      );
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await API.delete(`/suppliers/${id}`);
      getSuppliers();

      Alert.alert("Success", "Supplier deleted successfully");
    } catch (error) {
      console.log(
        "DELETE SUPPLIER ERROR:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to delete supplier",
      );
    }
  };

  const confirmDeleteSupplier = (id) => {
    Alert.alert(
      "Delete Supplier",
      "Are you sure you want to delete this supplier?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteSupplier(id),
        },
      ],
    );
  };

  useFocusEffect(
    useCallback(() => {
      getSuppliers();
    }, []),
  );

  const filteredSuppliers = suppliers.filter((supplier) => {
    const keyword = searchQuery.toLowerCase();

    const supplierName = supplier.name?.toLowerCase() || "";
    const supplierCompany = supplier.company?.toLowerCase() || "";
    const supplierPhone = supplier.phone?.toLowerCase() || "";
    const supplierEmail = supplier.email?.toLowerCase() || "";

    return (
      supplierName.includes(keyword) ||
      supplierCompany.includes(keyword) ||
      supplierPhone.includes(keyword) ||
      supplierEmail.includes(keyword)
    );
  });

  const companiesCount = new Set(
    suppliers.map((supplier) => supplier.company).filter(Boolean),
  ).size;

  const withEmailCount = suppliers.filter((supplier) => supplier.email).length;

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.smallTitle}>Admin Inventory</Text>
          <Text style={styles.title}>Suppliers</Text>
        </View>

        <TouchableOpacity style={styles.headerIconBtn} onPress={getSuppliers}>
          <Ionicons name="refresh-outline" size={22} color={DARK_GREEN} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <AdminStatCard
          title="Total"
          value={suppliers.length}
          icon="business-outline"
        />

        <AdminStatCard
          title="Companies"
          value={companiesCount}
          icon="briefcase-outline"
          iconColor="#2563EB"
          iconBg="#DBEAFE"
          valueColor="#2563EB"
        />

        <AdminStatCard
          title="With Email"
          value={withEmailCount}
          icon="mail-outline"
          iconColor="#D97706"
          iconBg="#FEF3C7"
          valueColor="#D97706"
        />
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={MUTED} />

        <TextInput
          style={styles.searchInput}
          placeholder="Search suppliers, company, phone..."
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
          <Text style={styles.loadingText}>Loading suppliers...</Text>
        </View>
      ) : filteredSuppliers.length === 0 ? (
        <View style={styles.emptyBox}>
          <View style={styles.emptyIcon}>
            <Ionicons name="business-outline" size={42} color={DARK_GREEN} />
          </View>

          <Text style={styles.emptyTitle}>
            {searchQuery ? "No results found" : "No suppliers yet"}
          </Text>

          <Text style={styles.emptyText}>
            {searchQuery
              ? "Try searching with another supplier name or company."
              : "Tap the Add Supplier button below to create your first supplier."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredSuppliers}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AdminSupplierCard
              supplier={item}
              onEdit={openEditModal}
              onDelete={confirmDeleteSupplier}
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
        <Text style={styles.fabText}>Add Supplier</Text>
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
                {selectedSupplierId ? "Edit Supplier" : "Add Supplier"}
              </Text>

              <Text style={styles.modalSubtitle}>
                {selectedSupplierId
                  ? "Update supplier details below"
                  : "Fill in the details to add a new supplier"}
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
              <Text style={styles.label}>Supplier Name</Text>

              <View style={styles.inputBox}>
                <Ionicons name="person-outline" size={20} color={MUTED} />

                <TextInput
                  style={styles.input}
                  placeholder="e.g. John Supplier"
                  placeholderTextColor={MUTED}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company</Text>

              <View style={styles.inputBox}>
                <Ionicons name="business-outline" size={20} color={MUTED} />

                <TextInput
                  style={styles.input}
                  placeholder="e.g. ABC Pharma"
                  placeholderTextColor={MUTED}
                  value={company}
                  onChangeText={setCompany}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>

              <View style={styles.inputBox}>
                <Ionicons name="call-outline" size={20} color={MUTED} />

                <TextInput
                  style={styles.input}
                  placeholder="e.g. 0771234567"
                  placeholderTextColor={MUTED}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>

              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={20} color={MUTED} />

                <TextInput
                  style={styles.input}
                  placeholder="supplier@example.com"
                  placeholderTextColor={MUTED}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>

              <View style={[styles.inputBox, styles.addressBox]}>
                <Ionicons name="location-outline" size={20} color={MUTED} />

                <TextInput
                  style={[styles.input, styles.addressInput]}
                  placeholder="Supplier address"
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
                onPress={selectedSupplierId ? updateSupplier : addSupplier}
              >
                <Ionicons
                  name={
                    selectedSupplierId ? "save-outline" : "add-circle-outline"
                  }
                  size={20}
                  color={WHITE}
                />

                <Text style={styles.submitButtonText}>
                  {selectedSupplierId ? "Save Changes" : "Add Supplier"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default SupplierScreen;

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
