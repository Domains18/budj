import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

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

interface AuthError {
  message: string;
  field?: "email" | "password" | "name";
}

const STORAGE_KEY = "budj_user_data";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const checkLoginStatus = useCallback(async () => {
    try {
      const savedUserData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedUserData) {
        const parsedData: UserData = JSON.parse(savedUserData);
        setUserData(parsedData);
        setIsLoggedIn(true);

        router.replace("/(tabs)/explore");
      }
    } catch (error) {
      console.error("Error checking login status:", error);

      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async (credentials: AuthCredentials): Promise<UserData> => {
      const { email, password, name } = credentials;

      setError(null);

      if (!email.trim()) {
        const error: AuthError = {
          message: "Email is required",
          field: "email",
        };
        setError(error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        throw new Error(error.message);
      }

      if (!validateEmail(email.trim())) {
        const error: AuthError = {
          message: "Please enter a valid email address",
          field: "email",
        };
        setError(error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        throw new Error(error.message);
      }

      if (!password.trim()) {
        const error: AuthError = {
          message: "Password is required",
          field: "password",
        };
        setError(error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        throw new Error(error.message);
      }

      if (!validatePassword(password)) {
        const error: AuthError = {
          message: "Password must be at least 6 characters",
          field: "password",
        };
        setError(error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        throw new Error(error.message);
      }

      if (name !== undefined && !name.trim()) {
        const error: AuthError = {
          message: "Name is required for signup",
          field: "name",
        };
        setError(error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        throw new Error(error.message);
      }

      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      try {
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

        router.replace("/(tabs)/explore");

        return newUserData;
      } catch (error) {
        console.error("Error during login:", error);
        const authError: AuthError = {
          message:
            error instanceof Error
              ? error.message
              : "Login failed. Please try again.",
        };
        setError(authError);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      await AsyncStorage.removeItem(STORAGE_KEY);

      setUserData(null);
      setIsLoggedIn(false);
      setError(null);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      router.replace("./auth");
    } catch (error) {
      console.error("Error during logout:", error);

      setUserData(null);
      setIsLoggedIn(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return {
    isLoggedIn,
    userData,
    isLoading,
    error,
    checkLoginStatus,
    login,
    logout,
    clearError,
  };
}
