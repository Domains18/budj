import { colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../globals.css";

export default function Index() {
  const { isLoggedIn, userData, checkLoginStatus, isLoading } = useAuth();

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: colors.background 
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Redirect based on authentication status
  if (isLoggedIn && userData) {
    return <Redirect href="/(tabs)/explore" />;
  } else {
    return <Redirect href="./auth" />;
  }
}