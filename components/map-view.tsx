// Install: npx expo install react-native-maps

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { colors } from "@/constants/theme";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

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

interface MapViewComponentProps {
  merchants: Merchant[];
  onMarkerPress: (merchant: Merchant) => void;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const getCategoryColor = (category: string, exclusive?: boolean) => {
  if (exclusive) return "#EC4899";

  switch (category) {
    case "restaurant":
      return "#6366F1";
    case "shop":
      return "#8B5CF6";
    case "fitness":
      return "#10B981";
    case "arts":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
};

const getOfferDisplayText = (merchant: Merchant) => {
  const cashbackOffer = merchant.offers.find(
    (offer) => offer.type === "cashback"
  );
  const pointsOffer = merchant.offers.find((offer) => offer.type === "points");

  if (cashbackOffer && cashbackOffer.value) {
    return `${cashbackOffer.value}%`;
  }
  if (pointsOffer && pointsOffer.value) {
    return `${pointsOffer.value}pts`;
  }
  return "Offer";
};

// Custom Map Style - Light theme
const customMapStyle = [
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }],
  },
];

export function MapViewComponent({
  merchants,
  onMarkerPress,
  initialRegion,
}: MapViewComponentProps) {
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  const handleMarkerPress = (merchant: Merchant) => {
    setSelectedMerchant(merchant.id);
    onMarkerPress(merchant);

    // Animate to selected marker
    mapRef.current?.animateToRegion(
      {
        latitude: merchant.latitude,
        longitude: merchant.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const centerMap = () => {
    mapRef.current?.animateToRegion(initialRegion, 1000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {merchants.map((merchant) => {
          const isSelected = selectedMerchant === merchant.id;

          return (
            <Marker
              key={merchant.id}
              coordinate={{
                latitude: merchant.latitude,
                longitude: merchant.longitude,
              }}
              onPress={() => handleMarkerPress(merchant)}
              tracksViewChanges={false}
            >
              <View style={styles.markerWrapper}>
                <View
                  style={[
                    styles.markerContainer,
                    {
                      backgroundColor: getCategoryColor(
                        merchant.category,
                        merchant.exclusive
                      ),
                    },
                    isSelected && styles.selectedMarker,
                  ]}
                >
                  <Text style={styles.markerText}>
                    {getOfferDisplayText(merchant)}
                  </Text>
                  {merchant.exclusive && (
                    <View style={styles.crownWrapper}>
                      <Text style={styles.crownIcon}>👑</Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.markerPin,
                    {
                      borderTopColor: getCategoryColor(
                        merchant.category,
                        merchant.exclusive
                      ),
                    },
                    isSelected && styles.selectedPin,
                  ]}
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={centerMap}
          activeOpacity={0.7}
        >
          <IconSymbol name="location.fill" size={20} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.merchantCount}>
          <IconSymbol
            name="mappin.and.ellipse"
            size={16}
            color={colors.primary}
          />
          <Typography
            variant="caption"
            color={colors.primary}
            weight="bold"
            style={styles.countText}
          >
            {merchants.length}
          </Typography>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E7EB",
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: "absolute",
    top: 16,
    right: 16,
    gap: 12,
  },
  controlButton: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  merchantCount: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  countText: {
    marginLeft: 6,
    fontSize: 14,
  },
  markerWrapper: {
    alignItems: "center",
  },
  markerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.9)",
    minWidth: 60,
  },
  selectedMarker: {
    transform: [{ scale: 1.2 }],
    elevation: 12,
    shadowOpacity: 0.45,
    borderWidth: 3,
  },
  markerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  crownWrapper: {
    marginLeft: 4,
  },
  crownIcon: {
    fontSize: 10,
  },
  markerPin: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -2,
  },
  selectedPin: {
    borderTopWidth: 12,
    borderLeftWidth: 7,
    borderRightWidth: 7,
  },
});
