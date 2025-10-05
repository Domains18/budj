
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useState } from "react";
import { Animated, StatusBar, View } from "react-native";

import merchantData from "@/assets/data.json";
import { MapViewComponent } from "@/components/map/mapView";
import { Sidebar } from "@/components/sidebar";
import { BudjHeader } from "@/components/ui/budj-header";
import { FilterPills } from "@/components/ui/filter-pills";
import {
  MerchantCards,
  type Merchant as MerchantCardType,
} from "@/components/ui/merchant-cards";
import { StoreDetailsBottomSheet } from "@/components/ui/store-details-bottom-sheet";
import { colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

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

export default function MapScreen() {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [merchants] = useState<Merchant[]>(merchantData as Merchant[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ]);
  const [selectedOfferTypes, setSelectedOfferTypes] = useState<string[]>([]);
  const sidebarAnimation = useState(new Animated.Value(0))[0];
  const { isLoggedIn, userData, checkLoginStatus } = useAuth();

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const initialRegion = {
    latitude: -1.2847,
    longitude: 36.8219,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleMarkerPress = (merchant: Merchant) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMerchant(merchant);
  };

  const handleMerchantSelect = (merchant: MerchantCardType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const fullMerchant = merchants.find((m) => m.id === merchant.id);
    if (fullMerchant) {
      setSelectedMerchant(fullMerchant);
    }
  };

  const handleSwipeUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsBottomSheetVisible(true);
  };

  const handleBottomSheetClose = () => {
    setIsBottomSheetVisible(false);
  };

  const handleBottomSheetMerchantPress = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    // Optionally close the bottom sheet when a merchant is selected
    // setIsBottomSheetVisible(false);
  };

  const handleCategoryToggle = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (categoryId === "all") {
      setSelectedCategories(["all"]);
    } else {
      setSelectedCategories((prev) => {
        const filtered = prev.filter((id) => id !== "all");
        if (filtered.includes(categoryId)) {
          const newSelection = filtered.filter((id) => id !== categoryId);
          return newSelection.length === 0 ? ["all"] : newSelection;
        }
        return [...filtered, categoryId];
      });
    }
  };

  const handleOfferTypeToggle = (offerTypeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSelectedOfferTypes((prev) => {
      if (prev.includes(offerTypeId)) {
        return prev.filter((id) => id !== offerTypeId);
      }
      return [...prev, offerTypeId];
    });
  };

  const toggleSidebar = () => {
    const isOpening = !isSidebarVisible;
    setIsSidebarVisible(isOpening);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.spring(sidebarAnimation, {
      toValue: isOpening ? 1 : 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
    Animated.spring(sidebarAnimation, {
      toValue: 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const categoryFilters = [
    { id: "all", label: "All" },
    { id: "shop", label: "shop" },
    { id: "restaurant", label: "restaurant" },
    { id: "fitness", label: "fitness" },
  ];

  const offerTypeFilters = [
    { id: "cashback", label: "Cashback" },
    { id: "exclusive", label: "Exclusive" },
    { id: "points", label: "Points" },
  ];

  const filteredMerchants = useMemo(() => {
    return merchants.filter((merchant) => {
      const categoryMatch =
        selectedCategories.includes("all") ||
        selectedCategories.length === 0 ||
        selectedCategories.includes(merchant.category);

      const offerTypeMatch =
        selectedOfferTypes.length === 0 ||
        selectedOfferTypes.some((filterType) => {
          if (filterType === "exclusive") return merchant.exclusive;
          if (filterType === "cashback") {
            return merchant.offers.some((o) => o.type === "cashback");
          }
          if (filterType === "points") {
            return merchant.offers.some((o) => o.type === "points");
          }
          return false;
        });

      const searchMatch =
        searchQuery === "" ||
        merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        merchant.street.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && offerTypeMatch && searchMatch;
    });
  }, [merchants, selectedCategories, selectedOfferTypes, searchQuery]);

  if (!isLoggedIn || !userData) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Budj Header */}
      <BudjHeader
        onMenuPress={toggleSidebar}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        walletBalance="KES 2,031"
      />

      {/* Filter Pills */}
      <FilterPills
        categoryFilters={categoryFilters}
        offerTypeFilters={offerTypeFilters}
        selectedCategories={selectedCategories}
        selectedOfferTypes={selectedOfferTypes}
        onCategoryToggle={handleCategoryToggle}
        onOfferTypeToggle={handleOfferTypeToggle}
      />

      {/* Map View */}
      <View className="flex-1">
        <MapViewComponent
          merchants={filteredMerchants}
          onMarkerPress={handleMarkerPress}
          initialRegion={initialRegion}
        />
      </View>

      {/* Merchant Cards at Bottom */}
      <MerchantCards
        merchants={filteredMerchants}
        onMerchantPress={handleMerchantSelect}
        onSwipeUp={handleSwipeUp}
      />

      {/* Sidebar */}
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={closeSidebar}
        slideAnimation={sidebarAnimation}
        userName={userData.name}
      />

      {/* Store Details Bottom Sheet */}
      <StoreDetailsBottomSheet
        isVisible={isBottomSheetVisible}
        merchants={filteredMerchants}
        onClose={handleBottomSheetClose}
        onMerchantPress={handleBottomSheetMerchantPress}
      />
    </View>
  );
}
