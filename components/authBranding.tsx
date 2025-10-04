import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

export function AuthBranding() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <IconSymbol name="dollarsign.circle.fill" size={48} color="#007AFF" />
      </View>
      <Text style={styles.title}>Budj</Text>
      <Text style={styles.subtitle}>Cashback & Loyalty Platform</Text>
      <Text style={styles.tagline}>Save more money with every purchase</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#E6F3FF",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
