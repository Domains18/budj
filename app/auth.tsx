import { AuthView } from "@/components/auth-view";
import { colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import "../globals.css";

export default function AuthScreen() {
  const { isLoggedIn, userData, checkLoginStatus } = useAuth();

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  // If already logged in, redirect to main app
  if (isLoggedIn && userData) {
    return <Redirect href="/(tabs)/explore" />;
  }

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