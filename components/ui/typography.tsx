import {
  FontFamily,
  FontSize,
  LineHeight,
  getTextStyle,
} from "@/constants/fonts";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

interface TypographyProps extends TextProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "bodySmall"
    | "caption"
    | "button"
    | "brand";
  fontFamily?: keyof typeof FontFamily;
  weight?: "regular" | "medium" | "semiBold" | "bold";
  color?: string;
  align?: "left" | "center" | "right" | "justify";
  numberOfLines?: number;
}

export function Typography({
  variant = "body",
  fontFamily,
  weight = "regular",
  color = "#333",
  align = "left",
  style,
  children,
  ...props
}: TypographyProps) {
  const getFontFamily = () => {
    if (fontFamily) {
      return FontFamily[fontFamily];
    }

    // Default font families based on variant and weight
    switch (variant) {
      case "h1":
      case "h2":
      case "h3":
        return weight === "bold" ? FontFamily.heading : FontFamily.subheading;
      case "h4":
      case "h5":
      case "h6":
        return FontFamily.subheading;
      case "button":
        return FontFamily.button;
      case "brand":
        return FontFamily.brand;
      case "caption":
        return FontFamily.caption;
      default:
        switch (weight) {
          case "medium":
            return FontFamily.bodyMedium;
          case "semiBold":
            return FontFamily.bodySemiBold;
          default:
            return FontFamily.body;
        }
    }
  };

  const getFontSize = () => {
    switch (variant) {
      case "h1":
        return FontSize.h1;
      case "h2":
        return FontSize.h2;
      case "h3":
        return FontSize.h3;
      case "h4":
        return FontSize.h4;
      case "h5":
        return FontSize.h5;
      case "h6":
        return FontSize.h6;
      case "bodySmall":
        return FontSize.bodySmall;
      case "caption":
        return FontSize.caption;
      case "button":
        return FontSize.button;
      case "brand":
        return FontSize.brand;
      default:
        return FontSize.body;
    }
  };

  const getFontWeight = ():
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | "normal"
    | "bold" => {
    switch (weight) {
      case "medium":
        return "500";
      case "semiBold":
        return "600";
      case "bold":
        return "700";
      default:
        return "400";
    }
  };

  const getLineHeight = () => {
    const fontSize = getFontSize();
    switch (variant) {
      case "h1":
      case "h2":
      case "h3":
        return fontSize * LineHeight.tight;
      case "caption":
        return fontSize * LineHeight.normal;
      default:
        return fontSize * LineHeight.normal;
    }
  };

  const textStyle = [
    styles.text,
    {
      fontFamily: getFontFamily(),
      fontSize: getFontSize(),
      fontWeight: getFontWeight(),
      lineHeight: getLineHeight(),
      color,
      textAlign: align,
    },
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
}

// Convenience components for common text variants
export const Heading1 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h1" weight="bold" {...props} />
);

export const Heading2 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h2" weight="bold" {...props} />
);

export const Heading3 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h3" weight="semiBold" {...props} />
);

export const BodyText = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="body" {...props} />
);

export const Caption = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="caption" color="#666" {...props} />
);

export const ButtonText = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="button" weight="semiBold" {...props} />
);

export const BrandText = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="brand" weight="bold" {...props} />
);

// Number component with monospace font for better alignment
export const NumberText = ({ children, style, ...props }: TextProps) => (
  <Text
    style={[
      {
        fontFamily: FontFamily.numbers,
        fontSize: FontSize.body,
        fontWeight: "500",
      },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false, // Android: removes extra padding
    textAlignVertical: "center", // Android: better text alignment
  },
});

// Export font constants for direct use when needed
export { FontFamily, FontSize, LineHeight, getTextStyle };
