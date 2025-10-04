import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

export interface UserData {
  email: string;
  name: string;
  isLoggedIn: boolean;
}

interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

const STORAGE_KEY = "budj_user_data";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkLoginStatus = useCallback(async () => {
    try {
      const savedUserData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedUserData) {
        const parsedData: UserData = JSON.parse(savedUserData);
        setUserData(parsedData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  }, []);

  const login = useCallback(async (credentials: AuthCredentials) => {
    const { email, password, name } = credentials;

    if (!email.trim() || !password.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw new Error("Email and password are required");
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newUserData: UserData = {
        email: email.trim(),
        name: name?.trim() || email.split("@")[0],
        isLoggedIn: true,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUserData));
      setUserData(newUserData);
      setIsLoggedIn(true);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return newUserData;
    } catch (error) {
      console.error("Error during login:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await AsyncStorage.removeItem(STORAGE_KEY);

      setUserData(null);
      setIsLoggedIn(false);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error during logout:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoggedIn,
    userData,
    isLoading,
    checkLoginStatus,
    login,
    logout,
  };
}
