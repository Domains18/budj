import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface FeaturesListProps {
  isLogin: boolean;
}

const FEATURES = [
  {
    icon: "dollarsign.circle.fill" as const,
    color: "#4CAF50",
    text: "Earn cashback at partner merchants",
  },
  {
    icon: "star.fill" as const,
    color: "#FF9800",
    text: "Collect loyalty points",
  },
  {
    icon: "map.fill" as const,
    color: "#007AFF",
    text: "Discover offers nearby",
  },
  {
    icon: "crown.fill" as const,
    color: "#FFD700",
    text: "Access exclusive deals",
  },
];

export function FeaturesList({ isLogin }: FeaturesListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLogin
          ? "Welcome back to Budj!"
          : "Join thousands saving money with Budj"}
      </Text>

      <View style={styles.list}>
        {FEATURES.map((feature, index) => (
          <View key={index} style={styles.item}>
            <IconSymbol name={feature.icon} size={16} color={feature.color} />
            <Text style={styles.text}>{feature.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  text: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
});
