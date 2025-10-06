import { AuthView } from "@/components/auth-view";
import { colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import "../../globals.css";

export default function HomeScreen() {
  const { isLoggedIn, userData, checkLoginStatus } = useAuth();

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  useEffect(() => {
    if (isLoggedIn && userData) {
      console.log("User is logged in:", userData);
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
