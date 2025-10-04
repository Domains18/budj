import { IconSymbol } from "@/components/ui/icon-symbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserData {
  email: string;
  name: string;
  isLoggedIn: boolean;
}

export default function HomeScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem("budj_user_data");
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        setUserData(parsedData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log("Error checking login status:", error);
    }
  };

  const handleAuth = async () => {
    if ((!isLogin && !name.trim()) || !email.trim() || !password.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newUserData: UserData = {
      email: email.trim(),
      name: isLogin ? email.split("@")[0] : name.trim(),
      isLoggedIn: true,
    };

    try {
      await AsyncStorage.setItem("budj_user_data", JSON.stringify(newUserData));
      setUserData(newUserData);
      setIsLoggedIn(true);

      // Success animation
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log("Error saving user data:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await AsyncStorage.removeItem("budj_user_data");
      setUserData(null);
      setIsLoggedIn(false);
      setEmail("");
      setPassword("");
      setName("");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setName("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Slide animation for mode switch
    Animated.timing(slideAnimation, {
      toValue: isLogin ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  if (isLoggedIn && userData) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Dashboard Header */}
        <SafeAreaView style={styles.dashboardContainer}>
          <View style={styles.header}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{userData.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FF6B6B" />
              ) : (
                <IconSymbol
                  name="rectangle.portrait.and.arrow.right"
                  size={20}
                  color="#FF6B6B"
                />
              )}
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <IconSymbol
                  name="dollarsign.circle.fill"
                  size={32}
                  color="#4CAF50"
                />
                <Text style={styles.statValue}>KES 2,450</Text>
                <Text style={styles.statLabel}>Total Cashback</Text>
              </View>

              <View style={styles.statCard}>
                <IconSymbol name="star.fill" size={32} color="#FF9800" />
                <Text style={styles.statValue}>1,240</Text>
                <Text style={styles.statLabel}>Points Earned</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>

              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <IconSymbol name="map.fill" size={24} color="#007AFF" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Explore Nearby Offers</Text>
                  <Text style={styles.actionSubtitle}>
                    Find merchants with cashback deals
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <IconSymbol
                    name="creditcard.fill"
                    size={24}
                    color="#FF6B6B"
                  />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Cashback History</Text>
                  <Text style={styles.actionSubtitle}>
                    View your earning history
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <IconSymbol name="crown.fill" size={24} color="#FFD700" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Exclusive Offers</Text>
                  <Text style={styles.actionSubtitle}>
                    Limited time deals near you
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Recent Activity */}
            <View style={styles.recentActivity}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>

              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={20}
                    color="#4CAF50"
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    Cashback earned at Java House
                  </Text>
                  <Text style={styles.activitySubtitle}>
                    2 hours ago • KES 125
                  </Text>
                </View>
              </View>

              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <IconSymbol name="star.fill" size={20} color="#FF9800" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    Points earned at Carrefour
                  </Text>
                  <Text style={styles.activitySubtitle}>
                    1 day ago • 200 points
                  </Text>
                </View>
              </View>
            </View>

            {/* Call to Action */}
            <View style={styles.ctaContainer}>
              <Text style={styles.ctaTitle}>Ready to save more?</Text>
              <Text style={styles.ctaSubtitle}>
                Check out the map to discover cashback offers near you!
              </Text>
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Explore Map</Text>
                <IconSymbol name="arrow.right" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <SafeAreaView style={styles.authContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Logo and Branding */}
          <View style={styles.brandingSection}>
            <View style={styles.logoContainer}>
              <IconSymbol
                name="dollarsign.circle.fill"
                size={48}
                color="#007AFF"
              />
            </View>
            <Text style={styles.appTitle}>Budj</Text>
            <Text style={styles.appSubtitle}>Cashback & Loyalty Platform</Text>
            <Text style={styles.tagline}>
              Save more money with every purchase
            </Text>
          </View>

          {/* Auth Form */}
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
            <View style={styles.authToggle}>
              <TouchableOpacity
                style={[styles.toggleButton, isLogin && styles.activeToggle]}
                onPress={() => isLogin || toggleAuthMode()}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isLogin && styles.activeToggleText,
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !isLogin && styles.activeToggle]}
                onPress={() => !isLogin || toggleAuthMode()}
              >
                <Text
                  style={[
                    styles.toggleText,
                    !isLogin && styles.activeToggleText,
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formFields}>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <IconSymbol
                    name="person.fill"
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <IconSymbol
                  name="envelope.fill"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <IconSymbol
                  name="lock.fill"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <IconSymbol
                    name={showPassword ? "eye.slash.fill" : "eye.fill"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
                <TouchableOpacity
                  style={[
                    styles.authButton,
                    isLoading && styles.authButtonDisabled,
                  ]}
                  onPress={handleAuth}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#FFF" />
                      <Text style={styles.loadingText}>
                        {isLogin ? "Signing in..." : "Creating account..."}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.authButtonText}>
                      {isLogin ? "Sign In" : "Create Account"}
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>

              {isLogin && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Features Preview */}
            <View style={styles.featuresSection}>
              <Text style={styles.featuresTitle}>
                {isLogin
                  ? "Welcome back to Budj!"
                  : "Join thousands saving money with Budj"}
              </Text>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <IconSymbol
                    name="dollarsign.circle.fill"
                    size={16}
                    color="#4CAF50"
                  />
                  <Text style={styles.featureText}>
                    Earn cashback at partner merchants
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol name="star.fill" size={16} color="#FF9800" />
                  <Text style={styles.featureText}>Collect loyalty points</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol name="map.fill" size={16} color="#007AFF" />
                  <Text style={styles.featureText}>Discover offers nearby</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol name="crown.fill" size={16} color="#FFD700" />
                  <Text style={styles.featureText}>Access exclusive deals</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Auth Styles
  authContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  brandingSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#E6F3FF",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
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
  authToggle: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: "#007AFF",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeToggleText: {
    color: "#FFF",
  },
  formFields: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 12,
  },
  passwordToggle: {
    padding: 8,
    marginLeft: 8,
  },
  authButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  authButtonDisabled: {
    backgroundColor: "#B0B0B0",
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  forgotPassword: {
    alignItems: "center",
    paddingTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#007AFF",
  },
  featuresSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#666",
  },

  // Dashboard Styles
  dashboardContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  quickActions: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F0F8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  recentActivity: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: "#666",
  },
  ctaContainer: {
    margin: 24,
    backgroundColor: "#007AFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: "#B3D9FF",
    textAlign: "center",
    marginBottom: 20,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});
