import { Tabs, router } from "expo-router";
import { TouchableOpacity, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#00A878";
const GREEN_SOFT = "#E6F7F2";
const INACTIVE = "#94A3B8";

export default function CustomerLayout() {
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
        borderRadius: 14,
        backgroundColor: focused ? GREEN_SOFT : "transparent",
      }}
    >
      <Ionicons name={name as any} size={size - 2} color={color} />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: GREEN,
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
          letterSpacing: 0.3,
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={logout}
            style={{
              marginRight: 16,
              backgroundColor: "rgba(255,255,255,0.18)",
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: 12,
                letterSpacing: 0.4,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        ),
        headerShown: false,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          position: "absolute",
          bottom: 22,
          left: 18,
          right: 18,
          height: 70,
          borderRadius: 26,
          paddingBottom: 0,
          paddingTop: 0,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          // Colored green shadow for a pharmacy feel
          shadowColor: "#00A878",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.18,
          shadowRadius: 24,
          elevation: 16,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 0.2,
          marginBottom: 8,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        sceneStyle: {
          paddingBottom: 108,
          backgroundColor: "#F4FAF7",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("home-outline", focused, color, size),
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
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("cart-outline", focused, color, size),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("bag-check-outline", focused, color, size),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("person-circle-outline", focused, color, size),
        }}
      />
    </Tabs>
  );
}
