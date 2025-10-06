import { AuthView } from "@/components/ui/auth-view";
import { colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const { isLoggedIn, userData, checkLoginStatus } = useAuth();

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  useEffect(() => {
    if (isLoggedIn && userData) {
      router.replace("/explore");
    }
  }, [isLoggedIn, userData]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <AuthView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
