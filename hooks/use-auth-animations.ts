import { useRef, useCallback } from "react";
import { Animated } from "react-native";

export function useAuthAnimations() {
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const animateToggle = useCallback(
    (isLogin: boolean) => {
      Animated.timing(slideAnimation, {
        toValue: isLogin ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [slideAnimation]
  );

  const animateButtonPress = useCallback(() => {
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
  }, [scaleAnimation]);

  const animateFadeTransition = useCallback(() => {
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
  }, [fadeAnimation]);

  return {
    fadeAnimation,
    slideAnimation,
    scaleAnimation,
    animateToggle,
    animateButtonPress,
    animateFadeTransition,
  };
}
