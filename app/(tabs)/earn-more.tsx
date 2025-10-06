import { BudjHeader } from "@/components/budj-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { colors } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface EarnMoreCard {
  id: string;
  title: string;
  subtitle: string;
  reward: string;
  icon: string;
  color: string;
  action: () => void;
}

export default function EarnMoreScreen() {
  const [referralCode] = useState("BUDJ2025");

  const shareReferralCode = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await Share.share({
        message: `Join Budj and start earning cashback on every purchase! Use my referral code: ${referralCode} and get KES 500 bonus when you make your first transaction. Download the app now!`,
        title: "Join Budj with my referral code",
      });
    } catch (error) {
      console.error("Error sharing referral code:", error);
    }
  };

  const completeProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Complete Profile", "Profile completion feature coming soon!");
  };

  const connectSocialMedia = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Connect Social Media",
      "Social media integration coming soon!"
    );
  };

  const takeSurvey = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Take Survey", "Survey feature coming soon!");
  };

  const watchAds = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Watch Ads", "Rewarded ads feature coming soon!");
  };

  const earnMoreCards: EarnMoreCard[] = [
    {
      id: "1",
      title: "Refer Friends",
      subtitle: "Earn KES 500 for each friend who joins",
      reward: "KES 500",
      icon: "person.2.fill",
      color: colors.primary,
      action: shareReferralCode,
    },
    {
      id: "2",
      title: "Complete Profile",
      subtitle: "Add your details and verify account",
      reward: "KES 100",
      icon: "person.fill.checkmark",
      color: "#4CAF50",
      action: completeProfile,
    },
    {
      id: "3",
      title: "Connect Social Media",
      subtitle: "Link your Instagram or Facebook",
      reward: "KES 50",
      icon: "link",
      color: "#9C27B0",
      action: connectSocialMedia,
    },
    {
      id: "4",
      title: "Take Surveys",
      subtitle: "Share your opinion and earn points",
      reward: "50 Points",
      icon: "list.clipboard",
      color: "#FF9800",
      action: takeSurvey,
    },
    {
      id: "5",
      title: "Watch Ads",
      subtitle: "Watch short videos to earn rewards",
      reward: "20 Points",
      icon: "play.rectangle",
      color: "#F44336",
      action: watchAds,
    },
  ];

  const EarnMoreItem: React.FC<{ item: EarnMoreCard }> = ({ item }) => (
    <TouchableOpacity style={styles.earnMoreItem} onPress={item.action}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <IconSymbol
            name={item.icon as any}
            size={24}
            color={colors.background}
          />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <View style={styles.rewardContainer}>
        <Text style={styles.rewardText}>{item.reward}</Text>
        <IconSymbol
          name="chevron.right"
          size={16}
          color={colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
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
          <Text style={styles.title}>Earn More Rewards</Text>
          <Text style={styles.subtitle}>
            Complete these activities to boost your cashback earnings
          </Text>

          {/* Referral Code Card */}
          <View style={styles.referralCard}>
            <View style={styles.referralHeader}>
              <IconSymbol name="gift.fill" size={32} color={colors.primary} />
              <Text style={styles.referralTitle}>Your Referral Code</Text>
            </View>
            <View style={styles.referralCodeContainer}>
              <Text style={styles.referralCodeText}>{referralCode}</Text>
            </View>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={shareReferralCode}
            >
              <IconSymbol
                name="square.and.arrow.up"
                size={20}
                color={colors.background}
              />
              <Text style={styles.shareButtonText}>Share Code</Text>
            </TouchableOpacity>
            <Text style={styles.referralDescription}>
              Share your code with friends and earn KES 500 when they make their
              first purchase!
            </Text>
          </View>

          {/* Earn More Activities */}
          <Text style={styles.sectionTitle}>Ways to Earn More</Text>

          {earnMoreCards.map((item) => (
            <EarnMoreItem key={item.id} item={item} />
          ))}

          {/* Tips Section */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Shop at partner stores to maximize cashback
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Check for exclusive offers daily
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Invite friends during bonus periods
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                • Complete your profile for better rewards
              </Text>
            </View>
          </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  referralCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  referralHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  referralTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginTop: 8,
  },
  referralCodeContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
  },
  referralCodeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    letterSpacing: 2,
  },
  shareButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  shareButtonText: {
    color: colors.background,
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  referralDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  earnMoreItem: {
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
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  rewardContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rewardText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginRight: 8,
  },
  tipsCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  tip: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
