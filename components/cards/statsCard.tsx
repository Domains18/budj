import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

const STATS = [
  {
    icon: "dollarsign.circle.fill" as const,
    color: "#4CAF50",
    value: "KES 2,450",
    label: "Total Cashback",
  },
  {
    icon: "star.fill" as const,
    color: "#FF9800",
    value: "1,240",
    label: "Points Earned",
  },
];

export function StatsCards() {
  return (
    <View style={styles.container}>
      {STATS.map((stat, index) => (
        <View key={index} style={styles.card}>
          <IconSymbol name={stat.icon} size={32} color={stat.color} />
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
});
