import { StatsCards } from "@/components/cards/statsCard";
import { QuickActions } from "@/components/quickActions";
import { RecentActivity } from "@/components/recentActivity";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React from "react";
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
const SIDEBAR_WIDTH = width * 0.85;

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  slideAnimation: Animated.Value;
  userName: string;
}

export function Sidebar({ isVisible, onClose, slideAnimation, userName }: SidebarProps) {
  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
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
              outputRange: [0, 0.5],
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
        <BlurView intensity={95} tint="light" style={styles.blurContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <IconSymbol name="xmark.circle.fill" size={28} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <StatsCards />
            <QuickActions />
            <RecentActivity />
          </ScrollView>
        </BlurView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    zIndex: 998,
  },
  backdropTouch: {
    flex: 1,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 999,
  },
  blurContainer: {
    flex: 1,
    backgroundColor: "rgba(248, 249, 250, 0.9)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  welcomeText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "System",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "System",
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});