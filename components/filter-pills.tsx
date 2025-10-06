import { borderRadius, colors, spacing } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FilterPill {
  id: string;
  label: string;
}

interface FilterPillsProps {
  categoryFilters: FilterPill[];
  offerTypeFilters: FilterPill[];
  selectedCategories: string[];
  selectedOfferTypes: string[];
  onCategoryToggle: (id: string) => void;
  onOfferTypeToggle: (id: string) => void;
}

export function FilterPills({
  categoryFilters,
  offerTypeFilters,
  selectedCategories,
  selectedOfferTypes,
  onCategoryToggle,
  onOfferTypeToggle,
}: FilterPillsProps) {
  const handleCategoryPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryToggle(id);
  };

  const handleOfferTypePress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOfferTypeToggle(id);
  };

  return (
    <View style={styles.container}>
      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categoryFilters.map((filter) => {
          const isSelected = selectedCategories.includes(filter.id);
          return (
            <TouchableOpacity
              key={filter.id}
              style={[styles.pill, isSelected && styles.pillActive]}
              onPress={() => handleCategoryPress(filter.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.pillText, isSelected && styles.pillTextActive]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Offer Type Filters - Only show if we have selections */}
      {(selectedOfferTypes.length > 0 || offerTypeFilters.length > 0) && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.secondRow}
        >
          {offerTypeFilters.map((filter) => {
            const isSelected = selectedOfferTypes.includes(filter.id);
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.pill,
                  styles.pillSecondary,
                  isSelected && styles.pillSecondaryActive,
                ]}
                onPress={() => handleOfferTypePress(filter.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.pillText,
                    styles.pillTextSecondary,
                    isSelected && styles.pillTextSecondaryActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingTop: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  secondRow: {
    marginTop: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  pillSecondary: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.primary,
  },
  pillSecondaryActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
  },
  pillTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  pillTextSecondary: {
    color: colors.primary,
  },
  pillTextSecondaryActive: {
    color: "#FFFFFF",
  },
});
