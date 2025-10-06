import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

const ACTIVITIES = [
  {
    icon: "checkmark.circle.fill" as const,
    color: "#4CAF50",
    title: "Cashback earned at Java House",
    subtitle: "2 hours ago • KES 125",
  },
  {
    icon: "star.fill" as const,
    color: "#FF9800",
    title: "Points earned at Carrefour",
    subtitle: "1 day ago • 200 points",
  },
];

export function RecentActivity() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>

      {ACTIVITIES.map((activity, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.iconContainer}>
            <IconSymbol name={activity.icon} size={20} color={activity.color} />
          </View>
          <View style={styles.content}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.subtitle}>{activity.subtitle}</Text>
          </View>
        </View>
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
});
