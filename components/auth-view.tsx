import { FormInput } from "@/components/ui/form-input";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { borderRadius, colors, shadows, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useCallback, useState, useEffect } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

export function AuthView() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();

  const slideAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    clearError();
  }, [isLogin, clearError]);

  useEffect(() => {
    if (error) {
      Alert.alert("Authentication Error", error.message, [
        { text: "OK", onPress: clearError },
      ]);
    }
  }, [error, clearError]);

  const handleToggle = useCallback(() => {
    const toValue = isLogin ? 1 : 0;
    setIsLogin(!isLogin);
    clearError();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.spring(slideAnimation, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [isLogin, slideAnimation, clearError]);

  const handleSubmit = useCallback(async () => {
    if (!email.trim() || !password.trim() || (!isLogin && !name.trim())) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    try {
      await login({
        email: email.trim(),
        password: password.trim(),
        name: isLogin ? undefined : name.trim(),
      });
    } catch (error) {
      console.error("Auth error:", error);
    }
  }, [email, password, name, isLogin, login]);

  const isFormValid = isLogin
    ? email.trim() && password.trim()
    : email.trim() && password.trim() && name.trim();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <LinearGradient
        colors={[colors.background, colors.surface, colors.primaryLight + "20"]}
        style={styles.backgroundGradient}
        locations={[0, 0.7, 1]}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                style={styles.logoGradient}
              >
                <IconSymbol name="location.fill" size={32} color="#FFFFFF" />
              </LinearGradient>
            </View>

            <Text style={styles.appTitle}>Budj</Text>
            <Text style={styles.appSubtitle}>
              {isLogin ? "Welcome back" : "Join the cashback revolution"}
            </Text>
          </View>

          <View style={styles.formCard}>
            <BlurView intensity={20} tint="light" style={styles.cardBlur}>
              <LinearGradient
                colors={[colors.background + "F0", colors.surface + "F0"]}
                style={styles.cardGradient}
              >
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      isLogin && styles.toggleButtonActive,
                    ]}
                    onPress={() => !isLogin && handleToggle()}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    {isLogin && (
                      <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        style={styles.toggleButtonGradient}
                      />
                    )}
                    <Text
                      style={[
                        styles.toggleText,
                        isLogin && styles.toggleTextActive,
                      ]}
                    >
                      Sign In
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      !isLogin && styles.toggleButtonActive,
                    ]}
                    onPress={() => isLogin && handleToggle()}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    {!isLogin && (
                      <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        style={styles.toggleButtonGradient}
                      />
                    )}
                    <Text
                      style={[
                        styles.toggleText,
                        !isLogin && styles.toggleTextActive,
                      ]}
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.formSection}>
                  {!isLogin && (
                    <Animated.View
                      style={[
                        styles.inputContainer,
                        {
                          height: slideAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 70],
                          }),
                          opacity: slideAnimation.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 0, 1],
                          }),
                        },
                      ]}
                    >
                      <FormInput
                        icon="person.fill"
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        editable={!isLoading}
                      />
                    </Animated.View>
                  )}

                  <View style={styles.inputContainer}>
                    <FormInput
                      icon="envelope.fill"
                      placeholder="Email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <View style={styles.passwordContainer}>
                      <FormInput
                        icon="lock.fill"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        editable={!isLoading}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.passwordToggle}
                        disabled={isLoading}
                      >
                        <IconSymbol
                          name={showPassword ? "eye.slash.fill" : "eye.fill"}
                          size={20}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!isFormValid || isLoading) && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!isFormValid || isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      isFormValid && !isLoading
                        ? [colors.gradientStart, colors.gradientEnd]
                        : [colors.textTertiary, colors.textTertiary]
                    }
                    style={styles.submitGradient}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <IconSymbol
                          name="arrow.clockwise"
                          size={20}
                          color="#FFFFFF"
                        />
                        <Text style={styles.submitText}>
                          {isLogin ? "Signing in..." : "Creating account..."}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.submitContainer}>
                        <Text style={styles.submitText}>
                          {isLogin ? "Sign In" : "Create Account"}
                        </Text>
                        <IconSymbol
                          name="arrow.right"
                          size={20}
                          color="#FFFFFF"
                        />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresTitle}>Why choose Budj?</Text>
                  <View style={styles.featuresList}>
                    <FeatureItem
                      icon="creditcard.fill"
                      title="Instant Cashback"
                      subtitle="Get money back on every purchase"
                    />
                    <FeatureItem
                      icon="map.fill"
                      title="Discover Deals"
                      subtitle="Find the best offers near you"
                    />
                    <FeatureItem
                      icon="chart.bar.fill"
                      title="Track Earnings"
                      subtitle="Monitor your cashback progress"
                    />
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function FeatureItem({
  icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <IconSymbol name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "500",
    textAlign: "center",
  },
  formCard: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.lg,
  },
  cardBlur: {
    flex: 1,
  },
  cardGradient: {
    padding: spacing.xl,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.xl,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  toggleButtonActive: {
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  toggleButtonGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordToggle: {
    position: "absolute",
    right: spacing.md,
    top: "50%",
    transform: [{ translateY: -10 }],
    padding: spacing.xs,
  },
  submitButton: {
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  submitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: spacing.sm,
  },
  featuresContainer: {
    marginTop: spacing.md,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
