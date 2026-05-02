import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const GREEN = "#00A878";
const GREEN_DARK = "#047857";
const GREEN_SOFT = "#E6F7F2";
const BG = "#F4FAF7";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";
const BORDER = "#E2E8F0";

export default function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;
  const [loadingText, setLoadingText] = useState("Preparing your pharmacy...");

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start();

    const textTimer1 = setTimeout(() => {
      setLoadingText("Checking your account...");
    }, 1800);

    const textTimer2 = setTimeout(() => {
      setLoadingText("Almost ready...");
    }, 3600);

    const navigationTimer = setTimeout(async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const role = await SecureStore.getItemAsync("role");

        if (!token || !role) {
          router.replace("/login");
          return;
        }

        if (role === "admin") {
          router.replace("/(admin)");
          return;
        }

        if (role === "customer") {
          router.replace("/(customer)");
          return;
        }

        router.replace("/login");
      } catch (error) {
        console.log("SPLASH AUTH CHECK ERROR:", error);
        router.replace("/login");
      }
    }, 5000);

    return () => {
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(navigationTimer);
    };
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoOuter}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.appName}>Medix</Text>

      <Text style={styles.tagline}>
        Smart pharmacy management and medicine ordering
      </Text>

      <View style={styles.card}>
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={GREEN} />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>

        <Text style={styles.progressNote}>Loading secure session...</Text>
      </View>

      <View style={styles.footer}>
        <Ionicons
          name="shield-checkmark-outline"
          size={18}
          color={GREEN_DARK}
        />
        <Text style={styles.footerText}>Safe • Fast • Trusted</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logoOuter: {
    width: 150,
    height: 150,
    borderRadius: 42,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  logoImage: {
    width: 118,
    height: 118,
  },
  appName: {
    color: TEXT,
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  tagline: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 34,
    maxWidth: 300,
  },
  card: {
    width: "100%",
    backgroundColor: WHITE,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  loadingText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "800",
  },
  progressTrack: {
    width: "100%",
    height: 12,
    borderRadius: 20,
    backgroundColor: GREEN_SOFT,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: GREEN,
  },
  progressNote: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: GREEN_SOFT,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
  },
  footerText: {
    color: GREEN_DARK,
    fontSize: 12,
    fontWeight: "900",
  },
});
