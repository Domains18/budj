import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import merchantData from "@/assets/data.json";
import { MapViewComponent } from "@/components/map/mapView";
import { MerchantBottomSheet } from "@/components/map/merchantBottomSheet";
import { ResultsCounter } from "@/components/map/resultsCounter";
import {
  FilterChips,
  FilterPanel,
  SearchHeader,
} from "@/components/map/searchAndFilters";
import { Sidebar } from "@/components/sidebar";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/useAuth";

const { height } = Dimensions.get("window");

interface Merchant {
  id: string;
  name: string;
  logo?: string;
  category: string;
  street: string;
  distance: string;
  status: string;
  rating: number;
  exclusive?: boolean;
  offersLeft?: number;
  offerEnd?: string;
  offers: {
    type: "cashback" | "points";
    value: string;
    upto: string;
  }[];
  latitude: number;
  longitude: number;
  imageUrl?: string;
  blurhash?: string;
}

interface Filters {
  categories: string[];
  offerTypes: string[];
  searchQuery: string;
}

export default function MapScreen() {
  const { userData, isLoggedIn, checkLoginStatus } = useAuth();
  const [merchants] = useState<Merchant[]>(merchantData as Merchant[]);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    offerTypes: [],
    searchQuery: "",
  });

  const slideAnimation = useState(new Animated.Value(height))[0];
  const filterAnimation = useState(new Animated.Value(0))[0];
  const sidebarAnimation = useState(new Animated.Value(0))[0];

  // Check authentication status on mount
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const initialRegion = {
    latitude: -1.2847,
    longitude: 36.8219,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const filteredMerchants = useMemo(() => {
    return merchants.filter((merchant) => {
      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(merchant.category) ||
        filters.categories.includes("all");

      const offerTypeMatch =
        filters.offerTypes.length === 0 ||
        filters.offerTypes.some((filterType) => {
          if (filterType === "exclusive") return merchant.exclusive;
          return merchant.offers.some((offer) => offer.type === filterType);
        });

      const searchMatch =
        filters.searchQuery === "" ||
        merchant.name
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        merchant.street
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());

      return categoryMatch && offerTypeMatch && searchMatch;
    });
  }, [merchants, filters]);

  useEffect(() => {
    loadSavedFilters();
  }, []);

  useEffect(() => {
    const saveFiltersAsync = async () => {
      try {
        await AsyncStorage.setItem("budj_filters", JSON.stringify(filters));
      } catch (error) {
        console.log("Error saving filters:", error);
      }
    };
    saveFiltersAsync();
  }, [filters]);

  const loadSavedFilters = async () => {
    try {
      const saved = await AsyncStorage.getItem("budj_filters");
      if (saved) {
        const parsedFilters = JSON.parse(saved);
        setFilters(parsedFilters);
      }
    } catch (error) {
      console.log("Error loading filters:", error);
    }
  };

  const handleMarkerPress = (merchant: Merchant) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMerchant(merchant);
    Animated.spring(slideAnimation, {
      toValue: height * 0.3,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const closeMerchantDetails = () => {
    Animated.spring(slideAnimation, {
      toValue: height,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start(() => {
      setSelectedMerchant(null);
    });
  };

  const toggleFilters = () => {
    const toValue = showFilters ? 0 : 1;
    setShowFilters(!showFilters);

    Animated.spring(filterAnimation, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const toggleCategoryFilter = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (categoryId === "all") {
      setFilters((prev) => ({
        ...prev,
        categories: prev.categories.includes("all") ? [] : ["all"],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        categories: prev.categories.includes(categoryId)
          ? prev.categories.filter((id) => id !== categoryId && id !== "all")
          : [...prev.categories.filter((id) => id !== "all"), categoryId],
      }));
    }
  };

  const toggleOfferTypeFilter = (offerTypeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setFilters((prev) => ({
      ...prev,
      offerTypes: prev.offerTypes.includes(offerTypeId)
        ? prev.offerTypes.filter((id) => id !== offerTypeId)
        : [...prev.offerTypes, offerTypeId],
    }));
  };

  const clearAllFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFilters({
      categories: [],
      offerTypes: [],
      searchQuery: "",
    });
  };

  const handleSearchChange = (text: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: text }));
  };

  const toggleSidebar = () => {
    const toValue = showSidebar ? 0 : 1;
    setShowSidebar(!showSidebar);

    Animated.spring(sidebarAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const closeSidebar = () => {
    Animated.spring(sidebarAnimation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setShowSidebar(false);
    });
  };

  // Show loading screen if not authenticated
  if (!isLoggedIn || !userData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Map */}
      <MapViewComponent
        merchants={filteredMerchants}
        onMarkerPress={handleMarkerPress}
        initialRegion={initialRegion}
      />

      {/* Header with Search and Filter */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.searchContainer}>
            <SearchHeader
              filters={filters}
              showFilters={showFilters}
              onSearchChange={handleSearchChange}
              onToggleFilters={toggleFilters}
            />
          </View>

          {/* Sidebar Toggle Button */}
          <TouchableOpacity
            style={styles.sidebarButton}
            onPress={toggleSidebar}
            activeOpacity={0.7}
          >
            <IconSymbol name="line.3.horizontal" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Category Filter Chips */}
        <FilterChips
          filters={filters}
          onCategoryToggle={toggleCategoryFilter}
        />

        {/* Advanced Filters Panel */}
        <FilterPanel
          filters={filters}
          filterAnimation={filterAnimation}
          onOfferTypeToggle={toggleOfferTypeFilter}
          onClearFilters={clearAllFilters}
        />
      </SafeAreaView>

      {/* Merchant Details Bottom Sheet */}
      <MerchantBottomSheet
        merchant={selectedMerchant}
        slideAnimation={slideAnimation}
        onClose={closeMerchantDetails}
      />

      {/* Results Count */}
      <ResultsCounter count={filteredMerchants.length} />

      {/* Sidebar */}
      <Sidebar
        isVisible={showSidebar}
        onClose={closeSidebar}
        slideAnimation={sidebarAnimation}
        userName={userData?.name || "User"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 1000,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchContainer: {
    flex: 1,
    marginRight: 12,
  },
  sidebarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
