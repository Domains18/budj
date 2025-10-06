import { IconSymbol } from "@/components/ui/icon-symbol";
import { borderRadius, colors, shadows, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = Math.min(width * 0.7, 320);

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  slideAnimation: Animated.Value;
  userName: string;
}

export function Sidebar({
  isVisible,
  onClose,
  slideAnimation,
  userName,
}: SidebarProps) {
  const { logout } = useAuth();

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose(); // Close sidebar first
    await logout(); // Then logout
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: slideAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.7],
            }),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [
              {
                translateX: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [SIDEBAR_WIDTH, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.background, colors.surface]}
          style={styles.sidebarGradient}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              style={styles.avatarLarge}
            >
              <Text style={styles.avatarLargeText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <IconSymbol name="xmark" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userNameLarge}>{userName}</Text>
            <View style={styles.ratingRow}>
              <IconSymbol name="star.fill" size={16} color={colors.warning} />
              <Text style={styles.userRating}>4.9</Text>
              <Text style={styles.userRatingLabel}>• 127 trips</Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuContent}
          >
            {/* Wallet Section */}
            <View style={styles.walletCard}>
              <LinearGradient
                colors={[colors.surfaceSecondary, colors.surfaceElevated]}
                style={styles.walletGradient}
              >
                <View style={styles.walletHeader}>
                  <IconSymbol
                    name="creditcard.fill"
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={styles.walletTitle}>Budj Wallet</Text>
                </View>
                <Text style={styles.walletBalance}>$127.50</Text>
                <Text style={styles.walletSubtitle}>Available cashback</Text>
              </LinearGradient>
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              <MenuItem
                icon="person.fill"
                title="My Profile"
                subtitle="Personal details and preferences"
                onPress={() => {}}
              />
              <MenuItem
                icon="creditcard"
                title="Payment Methods"
                subtitle="Manage cards and payment options"
                onPress={() => {}}
              />
              <MenuItem
                icon="chart.bar.fill"
                title="Earnings"
                subtitle="View your cashback history"
                onPress={() => {}}
              />
              <MenuItem
                icon="gift.fill"
                title="Rewards"
                subtitle="Redeem points and offers"
                onPress={() => {}}
              />
              <MenuItem
                icon="bell"
                title="Notifications"
                subtitle="Manage your alerts"
                onPress={() => {}}
              />
              <MenuItem
                icon="questionmark.circle"
                title="Help & Support"
                subtitle="Get help when you need it"
                onPress={() => {}}
              />
              <MenuItem
                icon="gearshape.fill"
                title="Settings"
                subtitle="App preferences and privacy"
                onPress={() => {}}
              />
            </View>

            {/* Sign Out */}
            <TouchableOpacity
              style={styles.signOutButton}
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <IconSymbol
                name="arrow.backward.square"
                size={20}
                color={colors.error}
              />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemIcon}>
          {/* @ts-ignore */}
        <IconSymbol name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
      </View>
      <IconSymbol name="chevron.right" size={16} color={colors.textTertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    zIndex: 999,
  },
  backdropTouch: {
    flex: 1,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    right: 0,
    width: SIDEBAR_WIDTH,
    height: "100%",
    zIndex: 1000,
  },
  sidebarGradient: {
    flex: 1,
    paddingTop: 50,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  avatarLargeText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  closeButton: {
    padding: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
  },
  userInfo: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  userNameLarge: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userRating: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: spacing.xs,
  },
  userRatingLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  menuContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  walletCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  walletGradient: {
    padding: spacing.lg,
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: spacing.sm,
  },
  walletBalance: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  walletSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  menuSection: {
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.md,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.error,
    marginLeft: spacing.sm,
  },
});
