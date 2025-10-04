import React from "react";
import { Animated, ScrollView, StyleSheet } from "react-native";
import { UserData } from "@/hooks/useAuth";
import { DashboardHeader } from "./dashBoardHeader";
import { StatsCards } from "./cards/statsCard";
import { QuickActions } from "./quickActions";
import { RecentActivity } from "./recentActivity";
import { CallToAction } from "./callAction";


interface DashboardViewProps {
  userData: UserData;
}

export function DashboardView({ userData }: DashboardViewProps) {
  return (
    <Animated.View style={styles.container}>
      <DashboardHeader userName={userData.name} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <StatsCards />
        <QuickActions />
        <RecentActivity />
        <CallToAction />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
});
