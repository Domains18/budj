import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "./icon-symbol";

interface FormInputProps extends TextInputProps {
  icon: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export function FormInput({
  icon,
  rightIcon,
  onRightIconPress,
  ...textInputProps
}: FormInputProps) {
  return (
    <View style={styles.container}>
      <IconSymbol name={icon} size={20} color="#999" style={styles.leftIcon} />
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        {...textInputProps}
      />
      {rightIcon && onRightIconPress && (
        <TouchableOpacity
          style={styles.rightIconButton}
          onPress={onRightIconPress}
          activeOpacity={0.7}
        >
          <IconSymbol name={rightIcon} size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  leftIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 12,
  },
  rightIconButton: {
    padding: 8,
    marginLeft: 8,
  },
});
