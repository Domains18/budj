import { AuthView } from "@/components/authView";
import { DashboardView } from "@/components/dashboardView";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomeScreen() {
  const { isLoggedIn, userData, checkLoginStatus } = useAuth();

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.safeArea}>
        {isLoggedIn && userData ? (
          <DashboardView userData={userData} />
        ) : (
          <AuthView />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
});
