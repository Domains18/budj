import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: boolean;
  borderRadius?: number;
}

export function Card({
  children,
  padding = 'medium',
  shadow = true,
  borderRadius = 12,
  style,
  ...props
}: CardProps) {
  const getCardStyle = () => {
    const baseStyle = [
      styles.card,
      { borderRadius },
      styles[`padding_${padding}`],
    ];

    if (shadow) {
      baseStyle.push(styles.shadow as any);
    }

    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
  },
  
  // Padding variants
  padding_none: {
    padding: 0,
  },
  padding_small: {
    padding: 12,
  },
  padding_medium: {
    padding: 16,
  },
  padding_large: {
    padding: 24,
  },
  
  // Shadow
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});