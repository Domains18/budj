import React, { useState, useCallback } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/hooks/useAuth";
import { useAuthAnimations } from "@/hooks/use-auth-animations";
import { AuthBranding } from "./authBranding";
import { AuthToggle } from "./authToggle";
import { AuthForm } from "./forms/authForm";
import { FeaturesList } from "./featuresList";


export function AuthView() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, isLoading } = useAuth();
  const { slideAnimation, scaleAnimation, animateToggle, animateButtonPress } =
    useAuthAnimations();

  const handleToggle = useCallback(() => {
    setIsLogin((prev) => !prev);
    animateToggle(isLogin);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isLogin, animateToggle]);

  const handleSubmit = useCallback(
    async (email: string, password: string, name?: string) => {
      animateButtonPress();
      try {
        await login({ email, password, name });
      } catch (error) {
        console.error("Auth error:", error);
      }
    },
    [login, animateButtonPress]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <AuthBranding />

        <Animated.View
          style={[
            styles.formContainer,
            {
              transform: [
                {
                  translateX: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            },
          ]}
        >
          <AuthToggle isLogin={isLogin} onToggle={handleToggle} />

          <AuthForm
            isLogin={isLogin}
            isLoading={isLoading}
            scaleAnimation={scaleAnimation}
            onSubmit={handleSubmit}
          />

          <FeaturesList isLogin={isLogin} />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
});
