import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FormInput } from "@/components/ui/form-input";

interface AuthFormProps {
  isLogin: boolean;
  isLoading: boolean;
  scaleAnimation: Animated.Value;
  onSubmit: (email: string, password: string, name?: string) => void;
}

export function AuthForm({
  isLogin,
  isLoading,
  scaleAnimation,
  onSubmit,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onSubmit(email, password, isLogin ? undefined : name);
  };

  const isFormValid = isLogin
    ? email.trim() && password.trim()
    : email.trim() && password.trim() && name.trim();

  return (
    <View style={styles.container}>
      {!isLogin && (
        <FormInput
          icon="person.fill"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!isLoading}
        />
      )}

      <FormInput
        icon="envelope.fill"
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />

      <FormInput
        icon="lock.fill"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        editable={!isLoading}
        rightIcon={showPassword ? "eye.slash.fill" : "eye.fill"}
        onRightIconPress={() => setShowPassword(!showPassword)}
      />

      <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isFormValid || isLoading) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFF" />
              <Text style={styles.loadingText}>
                {isLogin ? "Signing in..." : "Creating account..."}
              </Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>
              {isLogin ? "Sign In" : "Create Account"}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      {isLogin && (
        <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  submitButton: {
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
  submitButtonDisabled: {
    backgroundColor: "#B0B0B0",
    shadowOpacity: 0.1,
  },
  submitButtonText: {
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
});
