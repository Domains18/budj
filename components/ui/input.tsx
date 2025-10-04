import React from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { Typography } from './typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: any;
  rightIcon?: any;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Typography
          variant="bodySmall"
          weight="semiBold"
          color="#333"
          style={styles.label}
        >
          {label}
        </Typography>
      )}
      
      <View style={[
        styles.inputContainer,
        error && styles.inputError,
      ]}>
        {leftIcon && (
          <IconSymbol name={leftIcon} size={20} color="#999" style={styles.leftIcon} />
        )}
        
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#999"
          {...props}
        />
        
        {rightIcon && (
          onRightIconPress ? (
            <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
              <IconSymbol name={rightIcon} size={20} color="#999" />
            </TouchableOpacity>
          ) : (
            <IconSymbol name={rightIcon} size={20} color="#999" style={styles.rightIcon} />
          )
        )}
      </View>
      
      {error && (
        <Typography
          variant="caption"
          color="#F44336"
          style={styles.errorText}
        >
          {error}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputError: {
    borderColor: '#F44336',
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 8,
    padding: 8,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
});