import { Typography } from "@/components/ui/typography";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ResultsCounterProps {
  count: number;
}

export function ResultsCounter({ count }: ResultsCounterProps) {
  return (
    <View style={styles.container}>
      <Typography variant="caption" color="#FFF" weight="semiBold">
        {count} merchant{count !== 1 ? "s" : ""} found
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
