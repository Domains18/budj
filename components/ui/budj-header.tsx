import { IconSymbol } from '@/components/ui/icon-symbol';
import { colors, spacing } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface BudjHeaderProps {
  onMenuPress: () => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  walletBalance: string;
}

export function BudjHeader({ 
  onMenuPress, 
  searchQuery,
  onSearchChange,
  walletBalance 
}: BudjHeaderProps) {
  const handleMenuPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onMenuPress();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.topRow}>
        {/* Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleMenuPress}
          activeOpacity={0.7}
        >
          <IconSymbol name="line.3.horizontal" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>

        {/* Wallet Balance */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>{walletBalance}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
  },
  balanceContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
});