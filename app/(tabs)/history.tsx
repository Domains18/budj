import { BudjHeader } from "@/components/budj-header";
import { colors } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

interface PurchaseHistoryItem {
  id: string;
  merchantName: string;
  merchantLogo?: string;
  amount: string;
  cashbackAmount: string;
  date: string;
  category: string;
  status: "completed" | "pending" | "cancelled";
}

const mockHistoryData: PurchaseHistoryItem[] = [
  {
    id: "1",
    merchantName: "Naivas Supermarket",
    amount: "KES 2,450",
    cashbackAmount: "KES 98",
    date: "2025-10-04",
    category: "shop",
    status: "completed",
  },
  {
    id: "2",
    merchantName: "Java House",
    amount: "KES 890",
    cashbackAmount: "KES 45",
    date: "2025-10-03",
    category: "restaurant",
    status: "completed",
  },
  {
    id: "3",
    merchantName: "Fitness Palace",
    amount: "KES 3,200",
    cashbackAmount: "KES 160",
    date: "2025-10-01",
    category: "fitness",
    status: "pending",
  },
  {
    id: "4",
    merchantName: "Carrefour",
    amount: "KES 1,850",
    cashbackAmount: "KES 74",
    date: "2025-09-28",
    category: "shop",
    status: "completed",
  },
  {
    id: "5",
    merchantName: "KFC",
    amount: "KES 650",
    cashbackAmount: "KES 32",
    date: "2025-09-26",
    category: "restaurant",
    status: "completed",
  },
];

const HistoryItem: React.FC<{ item: PurchaseHistoryItem }> = ({ item }) => {
  const getStatusColor = () => {
    switch (item.status) {
      case "completed":
        return colors.success || "#4CAF50";
      case "pending":
        return colors.warning || "#FF9800";
      case "cancelled":
        return colors.error || "#F44336";
      default:
        return colors.textSecondary;
    }
  };

  const getCategoryIcon = () => {
    switch (item.category) {
      case "shop":
        return "🛍️";
      case "restaurant":
        return "🍽️";
      case "fitness":
        return "💪";
      default:
        return "🏪";
    }
  };

  return (
    <View style={styles.historyItem}>
      <View style={styles.merchantInfo}>
        <View style={styles.iconContainer}>
          <Text style={styles.categoryIcon}>{getCategoryIcon()}</Text>
        </View>
        <View style={styles.merchantDetails}>
          <Text style={styles.merchantName}>{item.merchantName}</Text>
          <Text style={styles.purchaseDate}>
            {new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>
      <View style={styles.amountInfo}>
        <Text style={styles.purchaseAmount}>{item.amount}</Text>
        <Text style={styles.cashbackAmount}>
          +{item.cashbackAmount} cashback
        </Text>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );
};

export default function HistoryScreen() {
  const totalCashback = mockHistoryData
    .filter((item) => item.status === "completed")
    .reduce(
      (sum, item) => sum + parseInt(item.cashbackAmount.replace(/[^0-9]/g, "")),
      0
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <BudjHeader
        onMenuPress={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
        walletBalance="KES 2,031"
      />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>My Purchase History</Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Cashback Earned</Text>
            <Text style={styles.summaryAmount}>
              KES {totalCashback.toLocaleString()}
            </Text>
            <Text style={styles.summarySubtext}>
              From {mockHistoryData.length} transactions
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Recent Transactions</Text>

          {mockHistoryData.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 16,
    color: colors.background,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.background,
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  historyItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  merchantInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 20,
  },
  merchantDetails: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  purchaseDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  amountInfo: {
    alignItems: "flex-end",
  },
  purchaseAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  cashbackAmount: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: colors.background,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});
