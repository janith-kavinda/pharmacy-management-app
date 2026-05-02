import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import API from "../../api/api";
import { useCart } from "../../context/CartContext";
import MedicineCard from "../../components/customer/MedicineCard";

const GREEN = "#00A878";
const GREEN_DARK = "#047857";
const GREEN_SOFT = "#E6F7F2";
const BG = "#F4FAF7";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";

const CustomerMedicineScreen = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const { addToCart } = useCart();

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

  const handleAddToCart = (medicine) => {
    if (medicine.quantity <= 0) {
      Alert.alert("Out of Stock", "This medicine is not available");
      return;
    }

    addToCart(medicine);
    Alert.alert("Added to Cart", `${medicine.name} added to your cart`);
  };

  useFocusEffect(
    useCallback(() => {
      getMedicines();
    }, []),
  );

  const filteredMedicines = medicines.filter((medicine) => {
    const keyword = searchText.toLowerCase();

    const name = medicine.name?.toLowerCase() || "";
    const category = medicine.category?.toLowerCase() || "";
    const supplierName = medicine.supplier?.name?.toLowerCase() || "";
    const supplierCompany = medicine.supplier?.company?.toLowerCase() || "";

    return (
      name.includes(keyword) ||
      category.includes(keyword) ||
      supplierName.includes(keyword) ||
      supplierCompany.includes(keyword)
    );
  });

  const availableCount = medicines.filter((item) => item.quantity > 0).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>Pharmacy Store</Text>
          <Text style={styles.title}>Available Medicines</Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="medkit-outline" size={26} color={GREEN} />
        </View>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Find your medicine fast</Text>
        <Text style={styles.heroText}>
          Search available medicines, check stock, and add items to your cart.
        </Text>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={MUTED} />

          <TextInput
            style={styles.searchInput}
            placeholder="Search by medicine, category, supplier..."
            placeholderTextColor={MUTED}
            value={searchText}
            onChangeText={setSearchText}
          />

          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={20} color={MUTED} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{medicines.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{availableCount}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{filteredMedicines.length}</Text>
          <Text style={styles.statLabel}>Showing</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Medicine List</Text>

        <TouchableOpacity style={styles.refreshButton} onPress={getMedicines}>
          <Ionicons name="refresh-outline" size={18} color={GREEN_DARK} />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={GREEN} />
          <Text style={styles.loadingText}>Loading medicines...</Text>
        </View>
      ) : filteredMedicines.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="search-outline" size={42} color={MUTED} />
          <Text style={styles.emptyTitle}>No medicines found</Text>
          <Text style={styles.emptyText}>
            Try searching with another medicine name or category.
          </Text>
        </View>
      ) : (
        filteredMedicines.map((medicine) => (
          <MedicineCard
            key={medicine._id}
            medicine={medicine}
            onAddToCart={handleAddToCart}
          />
        ))
      )}
    </ScrollView>
  );
};

export default CustomerMedicineScreen;

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
    marginBottom: 16,
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
  searchBox: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  searchInput: {
    flex: 1,
    color: TEXT,
    fontSize: 13,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statNumber: {
    color: TEXT,
    fontSize: 22,
    fontWeight: "900",
  },
  statLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
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
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },
  emptyText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },
});
