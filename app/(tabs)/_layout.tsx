import { Tabs, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

export default function TabLayout() {
  const { isLoggedIn, checkLoginStatus } = useAuth();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    checkLoginStatus();
    setMounted(true);
  }, [checkLoginStatus]);

  // Don't render anything until we've checked auth status
  if (!mounted) {
    return null;
  }

  // Hide tab bar on login screen (index route)
  const shouldShowTabBar = isLoggedIn && pathname !== "/";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 100,
          display: shouldShowTabBar ? "flex" : "none",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Find Offers",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="magnifyingglass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "My History",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="clock.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="earn-more"
        options={{
          title: "Earn More",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="star.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
