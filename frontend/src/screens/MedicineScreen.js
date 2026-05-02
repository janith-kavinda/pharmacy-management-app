import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
  Platform,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import API from "../api/api";
import AdminMedicineCard from "../components/admin/AdminMedicineCard";
import AdminStatCard from "../components/admin/AdminStatCard";

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

const MedicineScreen = () => {
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryDateObject, setExpiryDateObject] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setExpiryDateObject(selectedDate);
      setExpiryDate(formatDate(selectedDate));
    }
  };

  const getMedicines = async () => {
    try {
      setLoading(true);

      const response = await API.get("/medicines");
      setMedicines(response.data.data);
    } catch (error) {
      console.log(
        "GET MEDICINES ERROR:",
        error.response?.data || error.message,
      );
      Alert.alert("Error", "Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  const getSuppliers = async () => {
    try {
      const response = await API.get("/suppliers");
      setSuppliers(response.data.data);
    } catch (error) {
      console.log(
        "GET SUPPLIERS ERROR:",
        error.response?.data || error.message,
      );
      Alert.alert("Error", "Failed to fetch suppliers");
    }
  };

  const clearForm = () => {
    setSelectedMedicineId(null);
    setName("");
    setCategory("");
    setSupplier("");
    setPrice("");
    setQuantity("");
    setExpiryDate("");
    setExpiryDateObject(new Date());
    setShowDatePicker(false);
  };

  const closeModal = () => {
    clearForm();
    setModalVisible(false);
  };

  const openAddModal = () => {
    clearForm();
    setModalVisible(true);
  };

  const openEditModal = (medicine) => {
    setSelectedMedicineId(medicine._id);
    setName(medicine.name);
    setCategory(medicine.category);
    setSupplier(medicine.supplier?._id || medicine.supplier || "");
    setPrice(String(medicine.price));
    setQuantity(String(medicine.quantity));

    const selectedDate = medicine.expiryDate
      ? new Date(medicine.expiryDate)
      : new Date();

    setExpiryDateObject(selectedDate);
    setExpiryDate(formatDate(selectedDate));
    setModalVisible(true);
  };

  const addMedicine = async () => {
    if (!name || !category || !supplier || !price || !quantity || !expiryDate) {
      Alert.alert("Validation Error", "Please fill all fields");
      return;
    }

    try {
      await API.post("/medicines", {
        name,
        category,
        supplier,
        price: Number(price),
        quantity: Number(quantity),
        expiryDate,
      });

      closeModal();
      getMedicines();

      Alert.alert("Success", "Medicine added successfully");
    } catch (error) {
      console.log("ADD MEDICINE ERROR:", error.response?.data || error.message);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add medicine",
      );
    }
  };

  const updateMedicine = async () => {
    if (!selectedMedicineId) {
      Alert.alert("Error", "Please select a medicine first");
      return;
    }

    if (!name || !category || !supplier || !price || !quantity || !expiryDate) {
      Alert.alert("Validation Error", "Please fill all fields");
      return;
    }

    try {
      await API.put(`/medicines/${selectedMedicineId}`, {
        name,
        category,
        supplier,
        price: Number(price),
        quantity: Number(quantity),
        expiryDate,
      });

      closeModal();
      getMedicines();

      Alert.alert("Success", "Medicine updated successfully");
    } catch (error) {
      console.log(
        "UPDATE MEDICINE ERROR:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update medicine",
      );
    }
  };

  const deleteMedicine = async (id) => {
    try {
      await API.delete(`/medicines/${id}`);
      getMedicines();
    } catch (error) {
      console.log(
        "DELETE MEDICINE ERROR:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to delete medicine",
      );
    }
  };

  const confirmDeleteMedicine = (id) => {
    Alert.alert(
      "Delete Medicine",
      "Are you sure you want to delete this medicine?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMedicine(id),
        },
      ],
    );
  };

  useFocusEffect(
    useCallback(() => {
      getMedicines();
      getSuppliers();
    }, []),
  );

  const filteredMedicines = medicines.filter((medicine) => {
    const keyword = searchQuery.toLowerCase();

    const medicineName = medicine.name?.toLowerCase() || "";
    const medicineCategory = medicine.category?.toLowerCase() || "";
    const supplierName = medicine.supplier?.name?.toLowerCase() || "";
    const supplierCompany = medicine.supplier?.company?.toLowerCase() || "";

    return (
      medicineName.includes(keyword) ||
      medicineCategory.includes(keyword) ||
      supplierName.includes(keyword) ||
      supplierCompany.includes(keyword)
    );
  });

  const lowStockCount = medicines.filter(
    (medicine) => medicine.quantity > 0 && medicine.quantity <= 10,
  ).length;

  const outOfStockCount = medicines.filter(
    (medicine) => medicine.quantity <= 0,
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.smallTitle}>Admin Inventory</Text>
          <Text style={styles.title}>Medicines</Text>
        </View>

        <TouchableOpacity style={styles.headerIconBtn} onPress={getMedicines}>
          <Ionicons name="refresh-outline" size={22} color={DARK_GREEN} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <AdminStatCard
          title="Total"
          value={medicines.length}
          icon="medkit-outline"
        />

        <AdminStatCard
          title="Low Stock"
          value={lowStockCount}
          icon="warning-outline"
          iconColor="#D97706"
          iconBg="#FEF3C7"
          valueColor="#D97706"
        />

        <AdminStatCard
          title="Out Stock"
          value={outOfStockCount}
          icon="close-circle-outline"
          iconColor={RED}
          iconBg={RED_SOFT}
          valueColor={RED}
        />
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={MUTED} />

        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines, categories, suppliers..."
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
          <Text style={styles.loadingText}>Loading medicines...</Text>
        </View>
      ) : filteredMedicines.length === 0 ? (
        <View style={styles.emptyBox}>
          <View style={styles.emptyIcon}>
            <Ionicons name="medkit-outline" size={42} color={DARK_GREEN} />
          </View>

          <Text style={styles.emptyTitle}>
            {searchQuery ? "No results found" : "No medicines yet"}
          </Text>

          <Text style={styles.emptyText}>
            {searchQuery
              ? "Try a different search term."
              : "Tap the Add Medicine button below to add your first medicine."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMedicines}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AdminMedicineCard
              medicine={item}
              onEdit={openEditModal}
              onDelete={confirmDeleteMedicine}
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
        <Text style={styles.fabText}>Add Medicine</Text>
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
                {selectedMedicineId ? "Edit Medicine" : "Add Medicine"}
              </Text>

              <Text style={styles.modalSubtitle}>
                {selectedMedicineId
                  ? "Update the medicine details below"
                  : "Fill in the details to add a new medicine"}
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
              <Text style={styles.label}>Medicine Name</Text>

              <View style={styles.inputBox}>
                <Ionicons name="medkit-outline" size={20} color={MUTED} />

                <TextInput
                  style={styles.input}
                  placeholder="e.g. Paracetamol 500mg"
                  placeholderTextColor={MUTED}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>

              <View style={styles.inputBox}>
                <Ionicons name="pricetag-outline" size={20} color={MUTED} />

                <TextInput
                  style={styles.input}
                  placeholder="e.g. Pain Relief"
                  placeholderTextColor={MUTED}
                  value={category}
                  onChangeText={setCategory}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Supplier</Text>

              <View style={styles.pickerBox}>
                <Ionicons name="business-outline" size={20} color={MUTED} />

                <Picker
                  selectedValue={supplier}
                  style={styles.picker}
                  onValueChange={(value) => setSupplier(value)}
                >
                  <Picker.Item label="Select Supplier" value="" />

                  {suppliers.map((supplierItem) => (
                    <Picker.Item
                      key={supplierItem._id}
                      label={`${supplierItem.name} — ${supplierItem.company}`}
                      value={supplierItem._id}
                    />
                  ))}
                </Picker>
              </View>

              {suppliers.length === 0 && (
                <Text style={styles.helperText}>
                  No suppliers found. Add one from the Suppliers tab first.
                </Text>
              )}
            </View>

            <View style={styles.twoColumnRow}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Price (Rs.)</Text>

                <View style={styles.inputBox}>
                  <Ionicons name="cash-outline" size={20} color={MUTED} />

                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor={MUTED}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>Quantity</Text>

                <View style={styles.inputBox}>
                  <Ionicons name="cube-outline" size={20} color={MUTED} />

                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={MUTED}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expiry Date</Text>

              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={MUTED} />

                <Text
                  style={expiryDate ? styles.dateText : styles.placeholderText}
                >
                  {expiryDate || "Select expiry date"}
                </Text>

                <Ionicons
                  name="chevron-forward-outline"
                  size={18}
                  color={MUTED}
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={expiryDateObject}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
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
                onPress={selectedMedicineId ? updateMedicine : addMedicine}
              >
                <Ionicons
                  name={
                    selectedMedicineId ? "save-outline" : "add-circle-outline"
                  }
                  size={20}
                  color={WHITE}
                />

                <Text style={styles.submitButtonText}>
                  {selectedMedicineId ? "Save Changes" : "Add Medicine"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default MedicineScreen;

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
    backgroundColor: HEADER_BG,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#6EE7B7",
    shadowColor: HEADER_BG,
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
  input: {
    flex: 1,
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 12,
  },
  pickerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingLeft: 14,
    minHeight: 52,
  },
  picker: {
    flex: 1,
    color: TEXT,
  },
  helperText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
  },
  twoColumnRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  dateBox: {
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
  dateText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "700",
  },
  placeholderText: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "600",
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
