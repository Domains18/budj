import { IconSymbol } from "@/components/ui/icon-symbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import merchantData from "@/assets/data.json";

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

const CATEGORIES = [
  { id: "all", name: "All", icon: "list.bullet" as const },
  { id: "restaurant", name: "Restaurants", icon: "fork.knife" as const },
  { id: "shop", name: "Shopping", icon: "bag.fill" as const },
  { id: "fitness", name: "Fitness", icon: "figure.walk" as const },
  { id: "arts", name: "Arts & Culture", icon: "paintbrush.fill" as const },
];

const OFFER_TYPES = [
  { id: "cashback", name: "Cashback", icon: "dollarsign.circle.fill" as const },
  { id: "points", name: "Points", icon: "star.fill" as const },
  { id: "exclusive", name: "Exclusive", icon: "crown.fill" as const },
];

const getCategoryColor = (category: string, exclusive?: boolean) => {
  if (exclusive) return "#FFD700";

  switch (category) {
    case "restaurant":
      return "#FF6B6B";
    case "shop":
      return "#4ECDC4";
    case "fitness":
      return "#45B7D1";
    case "arts":
      return "#96CEB4";
    default:
      return "#95E1D3";
  }
};

export default function MapScreen() {
  const [merchants] = useState<Merchant[]>(merchantData as Merchant[]);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    offerTypes: [],
    searchQuery: "",
  });

  const slideAnimation = useState(new Animated.Value(height))[0];
  const filterAnimation = useState(new Animated.Value(0))[0];

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

  const getOfferDisplayText = (merchant: Merchant) => {
    const cashbackOffer = merchant.offers.find(
      (offer) => offer.type === "cashback"
    );
    const pointsOffer = merchant.offers.find(
      (offer) => offer.type === "points"
    );

    if (cashbackOffer) {
      return `${cashbackOffer.value}% back`;
    }
    if (pointsOffer) {
      return `${pointsOffer.value || "Earn"} pts`;
    }
    return "Offers";
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        toolbarEnabled={false}
      >
        {filteredMerchants.map((merchant) => (
          <Marker
            key={merchant.id}
            coordinate={{
              latitude: merchant.latitude,
              longitude: merchant.longitude,
            }}
            onPress={() => handleMarkerPress(merchant)}
          >
            <View
              style={[
                styles.markerContainer,
                {
                  backgroundColor: getCategoryColor(
                    merchant.category,
                    merchant.exclusive
                  ),
                },
              ]}
            >
              <Text style={styles.markerText}>
                {getOfferDisplayText(merchant)}
              </Text>
              {merchant.exclusive && (
                <IconSymbol
                  name="crown.fill"
                  size={12}
                  color="#FFF"
                  style={styles.markerIcon}
                />
              )}
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Header with Search and Filter */}
      <SafeAreaView style={styles.header}>
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search merchants..."
            value={filters.searchQuery}
            onChangeText={(text) =>
              setFilters((prev) => ({ ...prev, searchQuery: text }))
            }
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: showFilters ? "#007AFF" : "#F0F0F0" },
            ]}
            onPress={toggleFilters}
          >
            <IconSymbol
              name="slider.horizontal.3"
              size={20}
              color={showFilters ? "#FFF" : "#666"}
            />
          </TouchableOpacity>
        </View>

        {/* Category Filter Chips */}
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
                  { backgroundColor: isActive ? "#007AFF" : "#F0F0F0" },
                ]}
                onPress={() => toggleCategoryFilter(category.id)}
              >
                <IconSymbol
                  name={category.icon}
                  size={16}
                  color={isActive ? "#FFF" : "#666"}
                />
                <Text
                  style={[
                    styles.categoryText,
                    { color: isActive ? "#FFF" : "#666" },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Advanced Filters Panel */}
        <Animated.View
          style={[
            styles.filtersPanel,
            {
              height: filterAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 120],
              }),
              opacity: filterAnimation,
            },
          ]}
        >
          <Text style={styles.filterTitle}>Offer Types</Text>
          <View style={styles.offerTypeContainer}>
            {OFFER_TYPES.map((offerType) => {
              const isActive = filters.offerTypes.includes(offerType.id);
              return (
                <TouchableOpacity
                  key={offerType.id}
                  style={[
                    styles.offerTypeChip,
                    { backgroundColor: isActive ? "#007AFF" : "#F0F0F0" },
                  ]}
                  onPress={() => toggleOfferTypeFilter(offerType.id)}
                >
                  <IconSymbol
                    name={offerType.icon}
                    size={16}
                    color={isActive ? "#FFF" : "#666"}
                  />
                  <Text
                    style={[
                      styles.offerTypeText,
                      { color: isActive ? "#FFF" : "#666" },
                    ]}
                  >
                    {offerType.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllFilters}
          >
            <Text style={styles.clearButtonText}>Clear All Filters</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>

      {/* Merchant Details Bottom Sheet */}
      {selectedMerchant && (
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              bottom: slideAnimation.interpolate({
                inputRange: [0, height],
                outputRange: [0, -height],
              }),
            },
          ]}
        >
          <View style={styles.bottomSheetHandle} />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeMerchantDetails}
          >
            <IconSymbol name="xmark" size={20} color="#666" />
          </TouchableOpacity>

          <View style={styles.merchantInfo}>
            <View style={styles.merchantHeader}>
              {selectedMerchant.logo && (
                <Image
                  source={{ uri: selectedMerchant.logo }}
                  style={styles.merchantLogo}
                  placeholder={selectedMerchant.blurhash}
                />
              )}
              <View style={styles.merchantDetails}>
                <Text style={styles.merchantName}>{selectedMerchant.name}</Text>
                <Text style={styles.merchantAddress}>
                  {selectedMerchant.street}
                </Text>
                <View style={styles.merchantMeta}>
                  <Text
                    style={[
                      styles.merchantStatus,
                      {
                        color:
                          selectedMerchant.status === "Open"
                            ? "#4CAF50"
                            : "#F44336",
                      },
                    ]}
                  >
                    {selectedMerchant.status}
                  </Text>
                  <Text style={styles.merchantDistance}>
                    {selectedMerchant.distance}km away
                  </Text>
                  <View style={styles.ratingContainer}>
                    <IconSymbol name="star.fill" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{selectedMerchant.rating}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.offersContainer}>
              <Text style={styles.offersTitle}>Available Offers</Text>
              {selectedMerchant.offers.map((offer, index) => (
                <View key={index} style={styles.offerCard}>
                  <IconSymbol
                    name={
                      offer.type === "cashback"
                        ? "dollarsign.circle.fill"
                        : "star.fill"
                    }
                    size={24}
                    color={offer.type === "cashback" ? "#4CAF50" : "#FF9800"}
                  />
                  <View style={styles.offerDetails}>
                    <Text style={styles.offerType}>
                      {offer.type === "cashback"
                        ? "Cashback"
                        : "Loyalty Points"}
                    </Text>
                    <Text style={styles.offerValue}>
                      {offer.type === "cashback"
                        ? `${offer.value}% back (up to KES ${offer.upto})`
                        : `Earn points (up to ${offer.upto} pts)`}
                    </Text>
                  </View>
                </View>
              ))}

              {selectedMerchant.exclusive && (
                <View style={styles.exclusiveTag}>
                  <IconSymbol name="crown.fill" size={16} color="#FFD700" />
                  <Text style={styles.exclusiveText}>Exclusive Offer</Text>
                  {selectedMerchant.offersLeft && (
                    <Text style={styles.offersLeft}>
                      {selectedMerchant.offersLeft} offers left
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      )}

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredMerchants.length} merchant
          {filteredMerchants.length !== 1 ? "s" : ""} found
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  filtersPanel: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  offerTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  offerTypeChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  offerTypeText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  clearButton: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  markerContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  markerIcon: {
    marginLeft: 4,
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    height: height * 0.7,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20,
    paddingTop: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  merchantInfo: {
    flex: 1,
    paddingHorizontal: 24,
  },
  merchantHeader: {
    flexDirection: "row",
    marginBottom: 24,
  },
  merchantLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  merchantDetails: {
    flex: 1,
  },
  merchantName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  merchantAddress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  merchantMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  merchantStatus: {
    fontSize: 14,
    fontWeight: "600",
  },
  merchantDistance: {
    fontSize: 14,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  offersContainer: {
    flex: 1,
  },
  offersTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  offerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  offerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  offerType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  offerValue: {
    fontSize: 14,
    color: "#666",
  },
  exclusiveTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  exclusiveText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F57F17",
    marginLeft: 8,
    flex: 1,
  },
  offersLeft: {
    fontSize: 14,
    color: "#F57F17",
  },
  resultsContainer: {
    position: "absolute",
    bottom: 100,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resultsText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
