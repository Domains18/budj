import { IconSymbol } from '@/components/ui/icon-symbol';
import { Typography } from '@/components/ui/typography';
import React from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Filters {
  categories: string[];
  offerTypes: string[];
  searchQuery: string;
}

interface SearchHeaderProps {
  filters: Filters;
  showFilters: boolean;
  onSearchChange: (text: string) => void;
  onToggleFilters: () => void;
}

interface FilterChipsProps {
  filters: Filters;
  onCategoryToggle: (categoryId: string) => void;
}

interface FilterPanelProps {
  filters: Filters;
  filterAnimation: Animated.Value;
  onOfferTypeToggle: (offerTypeId: string) => void;
  onClearFilters: () => void;
}

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'list.bullet' as const },
  { id: 'restaurant', name: 'Restaurants', icon: 'fork.knife' as const },
  { id: 'shop', name: 'Shopping', icon: 'bag.fill' as const },
  { id: 'fitness', name: 'Fitness', icon: 'figure.walk' as const },
  { id: 'arts', name: 'Arts & Culture', icon: 'paintbrush.fill' as const },
];

const OFFER_TYPES = [
  { id: 'cashback', name: 'Cashback', icon: 'dollarsign.circle.fill' as const },
  { id: 'points', name: 'Points', icon: 'star.fill' as const },
  { id: 'exclusive', name: 'Exclusive', icon: 'crown.fill' as const },
];

export function SearchHeader({ filters, showFilters, onSearchChange, onToggleFilters }: SearchHeaderProps) {
  return (
    <View style={styles.searchContainer}>
      <IconSymbol name="magnifyingglass" size={20} color="#666" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search merchants..."
        value={filters.searchQuery}
        onChangeText={onSearchChange}
        placeholderTextColor="#999"
      />
      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: showFilters ? '#007AFF' : '#F0F0F0' }]}
        onPress={onToggleFilters}
      >
        <IconSymbol 
          name="slider.horizontal.3" 
          size={20} 
          color={showFilters ? '#FFF' : '#666'} 
        />
      </TouchableOpacity>
    </View>
  );
}

export function FilterChips({ filters, onCategoryToggle }: FilterChipsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryContainer}
      contentContainerStyle={styles.categoryContent}
    >
      {CATEGORIES.map((category) => {
        const isActive = filters.categories.includes(category.id);
        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              { backgroundColor: isActive ? '#007AFF' : '#F0F0F0' }
            ]}
            onPress={() => onCategoryToggle(category.id)}
          >
            <IconSymbol 
              name={category.icon} 
              size={16} 
              color={isActive ? '#FFF' : '#666'} 
            />
            <Typography
              variant="bodySmall"
              weight="semiBold"
              color={isActive ? '#FFF' : '#666'}
              style={styles.categoryText}
            >
              {category.name}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export function FilterPanel({ filters, filterAnimation, onOfferTypeToggle, onClearFilters }: FilterPanelProps) {
  return (
    <Animated.View style={[
      styles.filtersPanel,
      {
        height: filterAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 120],
        }),
        opacity: filterAnimation,
      }
    ]}>
      <Typography variant="h6" weight="semiBold" color="#333" style={styles.filterTitle}>
        Offer Types
      </Typography>
      <View style={styles.offerTypeContainer}>
        {OFFER_TYPES.map((offerType) => {
          const isActive = filters.offerTypes.includes(offerType.id);
          return (
            <TouchableOpacity
              key={offerType.id}
              style={[
                styles.offerTypeChip,
                { backgroundColor: isActive ? '#007AFF' : '#F0F0F0' }
              ]}
              onPress={() => onOfferTypeToggle(offerType.id)}
            >
              <IconSymbol 
                name={offerType.icon} 
                size={16} 
                color={isActive ? '#FFF' : '#666'} 
              />
              <Typography
                variant="bodySmall"
                weight="semiBold"
                color={isActive ? '#FFF' : '#666'}
                style={styles.offerTypeText}
              >
                {offerType.name}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>
      
      <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
        <Typography variant="bodySmall" weight="semiBold" color="#007AFF">
          Clear All Filters
        </Typography>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryContent: {
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    marginLeft: 6,
  },
  filtersPanel: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  filterTitle: {
    marginBottom: 12,
  },
  offerTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  offerTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  offerTypeText: {
    marginLeft: 6,
  },
  clearButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});