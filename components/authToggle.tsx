import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

export function AuthToggle({ isLogin, onToggle }: AuthToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isLogin && styles.activeButton]}
        onPress={() => !isLogin && onToggle()}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, isLogin && styles.activeText]}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, !isLogin && styles.activeButton]}
        onPress={() => isLogin && onToggle()}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, !isLogin && styles.activeText]}>
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeText: {
    color: "#FFF",
  },
});
