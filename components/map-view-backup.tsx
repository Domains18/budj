import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { colors } from "@/constants/theme";
import React, { useState, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MapLibreGL from "@maplibre/maplibre-react-native";

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

const { width, height } = Dimensions.get("window");
const ZOOM_LEVEL = 14;

const getCategoryColor = (category: string, exclusive?: boolean) => {
  if (exclusive) return "#EC4899"; // Pink for exclusive

  switch (category) {
    case "restaurant":
      return "#6366F1"; // Indigo
    case "shop":
      return "#8B5CF6"; // Purple
    case "fitness":
      return "#10B981"; // Green
    case "arts":
      return "#F59E0B"; // Amber
    default:
      return "#6B7280"; // Gray
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

// Generate static map URL
const getStaticMapUrl = (
  latitude: number,
  longitude: number,
  zoom: number = ZOOM_LEVEL
) => {
  const mapWidth = Math.floor(width);
  const mapHeight = Math.floor(height);

  const url = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=${mapWidth}x${mapHeight}&maptype=mapnik`;
  return url;
};

// Calculate marker positions
const calculateMarkerPosition = (
  merchantLat: number,
  merchantLng: number,
  centerLat: number,
  centerLng: number,
  zoom: number
) => {
  const scale = 256 * Math.pow(2, zoom);
  const centerX = (centerLng + 180) * (scale / 360);
  const centerY =
    scale / 2 -
    (scale * Math.log(Math.tan(Math.PI / 4 + (centerLat * Math.PI) / 360))) /
      (2 * Math.PI);

  const pointX = (merchantLng + 180) * (scale / 360);
  const pointY =
    scale / 2 -
    (scale * Math.log(Math.tan(Math.PI / 4 + (merchantLat * Math.PI) / 360))) /
      (2 * Math.PI);

  const x = (pointX - centerX) * (width / scale) + width / 2;
  const y = (pointY - centerY) * (height / scale) + height / 2;

  return { x, y };
};

export function MapViewComponent({
  merchants,
  onMarkerPress,
  initialRegion,
}: MapViewComponentProps) {
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const handleMarkerPress = (merchant: Merchant) => {
    setSelectedMerchant(merchant.id);
    onMarkerPress(merchant);
  };

  const mapUrl = getStaticMapUrl(
    initialRegion.latitude,
    initialRegion.longitude,
    ZOOM_LEVEL
  );

  useEffect(() => {
    // Reset error state when map URL changes
    setMapError(false);
  }, [mapUrl]);

  return (
    <View style={styles.container}>
      {/* Loading Indicator */}
      {!mapLoaded && !mapError && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typography
            variant="caption"
            color={colors.textSecondary}
            style={styles.loadingText}
          >
            Loading map...
          </Typography>
        </View>
      )}

      {/* Error State */}
      {mapError && (
        <View style={styles.errorContainer}>
          <IconSymbol
            name="exclamationmark.triangle"
            size={48}
            color="#EF4444"
          />
          <Typography variant="body" color="#EF4444" style={styles.errorText}>
            Map failed to load
            
          </Typography>
        </View>
      )}

      {/* Static Map Background */}
      <Image
        source={{ uri: mapUrl }}
        style={styles.mapImage}
        resizeMode="cover"
        onLoad={() => {
          setMapLoaded(true);
          setMapError(false);
        }}
        onError={() => {
          setMapError(true);
          setMapLoaded(false);
        }}
      />

      {/* Overlay Markers */}
      {mapLoaded && merchants.length > 0 && (
        <View style={styles.markersContainer}>
          {merchants.map((merchant) => {
            const position = calculateMarkerPosition(
              merchant.latitude,
              merchant.longitude,
              initialRegion.latitude,
              initialRegion.longitude,
              ZOOM_LEVEL
            );

            const isVisible =
              position.x >= 0 &&
              position.x <= width &&
              position.y >= 0 &&
              position.y <= height;

            if (!isVisible) return null;

            const isSelected = selectedMerchant === merchant.id;

            return (
              <TouchableOpacity
                key={merchant.id}
                style={[
                  styles.markerWrapper,
                  {
                    left: position.x - 40,
                    top: position.y - 30,
                  },
                ]}
                onPress={() => handleMarkerPress(merchant)}
                activeOpacity={0.7}
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
                    isSelected && styles.selectedMarker,
                  ]}
                >
                  <Typography
                    variant="caption"
                    color="#FFF"
                    weight="bold"
                    style={styles.markerText}
                  >
                    {getOfferDisplayText(merchant)}
                  </Typography>
                  {merchant.exclusive && (
                    <View style={styles.crownWrapper}>
                      <IconSymbol name="crown.fill" size={10} color="#FFD700" />
                    </View>
                  )}
                </View>
                <View
                  style={[styles.markerPin, isSelected && styles.selectedPin]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* User Location Indicator */}
      <View style={styles.userLocationIndicator}>
        <View style={styles.userLocationPulse} />
        <View style={styles.userLocationDot} />
      </View>

      {/* Map Controls */}
      <View style={styles.mapControls}>
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
    overflow: "hidden",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    zIndex: 10,
  },
  errorText: {
    marginTop: 12,
  },
  markersContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  markerWrapper: {
    position: "absolute",
    alignItems: "center",
    zIndex: 2,
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
    letterSpacing: 0.5,
  },
  crownWrapper: {
    marginLeft: 4,
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
    borderTopColor: "rgba(0, 0, 0, 0.3)",
    marginTop: -2,
  },
  selectedPin: {
    borderTopWidth: 12,
    borderLeftWidth: 7,
    borderRightWidth: 7,
  },
  userLocationIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  userLocationPulse: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(66, 133, 244, 0.15)",
  },
  userLocationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4285F4",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  mapControls: {
    position: "absolute",
    top: 16,
    right: 16,
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
});
