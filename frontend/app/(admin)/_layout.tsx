import { Tabs, router } from "expo-router";
import { TouchableOpacity, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

const DARK_GREEN = "#065F46";
const MID_GREEN = "#047857";
const ACTIVE_BG = "#D1FAE5";
const INACTIVE = "#6B7280";
const HEADER_BG = "#022C22";

export default function AdminLayout() {
  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("role");
    await SecureStore.deleteItemAsync("user");
    router.replace("/login");
  };

  const tabIcon = (
    name: string,
    focused: boolean,
    color: string,
    size: number,
  ) => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 30,
        borderRadius: 12,
        backgroundColor: focused ? ACTIVE_BG : "transparent",
        borderWidth: focused ? 1 : 0,
        borderColor: focused ? "#6EE7B7" : "transparent",
      }}
    >
      <Ionicons name={name as any} size={size - 2} color={color} />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: HEADER_BG,
          shadowColor: "transparent",
          elevation: 0,
        },
        headerShown: false,
        headerTintColor: "#D1FAE5",
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 17,
          letterSpacing: 0.8,
          color: "#ECFDF5",
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={logout}
            style={{
              marginRight: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "rgba(6, 95, 70, 0.6)",
              paddingHorizontal: 13,
              paddingVertical: 7,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#6EE7B7",
            }}
          >
            <Ionicons name="log-out-outline" size={14} color="#6EE7B7" />
            <Text
              style={{
                color: "#6EE7B7",
                fontWeight: "700",
                fontSize: 12,
                letterSpacing: 0.5,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: DARK_GREEN,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          position: "absolute",
          bottom: 22,
          left: 18,
          right: 18,
          height: 70,
          borderRadius: 22,
          paddingBottom: 0,
          paddingTop: 0,
          backgroundColor: "#F0FDF4",
          borderTopWidth: 0,
          borderWidth: 1.5,
          borderColor: "#A7F3D0",
          // Dark green tinted shadow for authority feel
          shadowColor: "#022C22",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.22,
          shadowRadius: 24,
          elevation: 18,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 0.3,
          marginBottom: 8,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        sceneStyle: {
          paddingBottom: 108,
          backgroundColor: "#F0FDF4",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("grid-outline", focused, color, size),
        }}
      />

      <Tabs.Screen
        name="medicines"
        options={{
          title: "Medicines",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("medkit-outline", focused, color, size),
        }}
      />

      <Tabs.Screen
        name="suppliers"
        options={{
          title: "Suppliers",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("business-outline", focused, color, size),
        }}
      />

      <Tabs.Screen
        name="customers"
        options={{
          title: "Customers",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("people-outline", focused, color, size),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("receipt-outline", focused, color, size),
        }}
      />
    </Tabs>
  );
}
