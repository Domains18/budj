import { colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
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

  // If not logged in, redirect to auth screen
  if (!isLoggedIn || !userData) {
    return <Redirect href="./auth" />;
  }

  // If logged in, show the children (tabs)
  return <>{children}</>;
}