import { Platform } from "react-native";

export const FontFamily = {
  // Headings and Titles
  heading: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium",
  subheading: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-medium",

  // Body text
  body: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif",
  bodyMedium: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif-medium",
  bodySemiBold: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif-medium",

  // UI Elements
  button: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif-medium",
  caption: Platform.OS === "ios" ? "SF Pro Text" : "sans-serif",

  // Numbers and Stats
  numbers: Platform.OS === "ios" ? "SF Mono" : "monospace",

  // Branding
  brand: Platform.OS === "ios" ? "SF Pro Display" : "sans-serif-black",

  // Fallbacks for system fonts
  systemBold: "System",
  systemRegular: "System",
} as const;

export const FontSize = {
  // Headings
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  h6: 14,

  // Body
  body: 16,
  bodySmall: 14,
  caption: 12,
  tiny: 10,

  // Interactive Elements
  button: 16,
  input: 16,

  // Brand
  brand: 36,
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;

// Configuration for expo-font loading
// Note: We'll use system fonts instead of loading custom fonts
// to avoid download errors with "System" font references
export const customFonts = {
  // We're not loading any custom fonts since we're using system fonts
  // This prevents the "Unable to download asset from url: System" error
};

// Font utility functions
export const getFontFamily = (fontKey: keyof typeof FontFamily) => {
  return FontFamily[fontKey];
};

export const getTextStyle = (
  size: keyof typeof FontSize,
  family: keyof typeof FontFamily,
  lineHeight?: keyof typeof LineHeight
) => ({
  fontSize: FontSize[size],
  fontFamily: FontFamily[family],
  ...(lineHeight && { lineHeight: FontSize[size] * LineHeight[lineHeight] }),
});
