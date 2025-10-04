import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

const ACTIONS = [
  {
    icon: "map.fill" as const,
    color: "#007AFF",
    title: "Explore Nearby Offers",
    subtitle: "Find merchants with cashback deals",
  },
  {
    icon: "creditcard.fill" as const,
    color: "#FF6B6B",
    title: "Cashback History",
    subtitle: "View your earning history",
  },
  {
    icon: "crown.fill" as const,
    color: "#FFD700",
    title: "Exclusive Offers",
    subtitle: "Limited time deals near you",
  },
];

export function QuickActions() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>

      {ACTIONS.map((action, index) => (
        <TouchableOpacity key={index} style={styles.card} activeOpacity={0.7}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${action.color}15` },
            ]}
          >
            <IconSymbol name={action.icon} size={24} color={action.color} />
          </View>
          <View style={styles.content}>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.subtitle}>{action.subtitle}</Text>
          </View>
          <IconSymbol name="chevron.right" size={16} color="#999" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});
