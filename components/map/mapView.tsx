import { IconSymbol } from '@/components/ui/icon-symbol';
import { Typography } from '@/components/ui/typography';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

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
    type: 'cashback' | 'points';
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
  if (exclusive) return '#FFD700'; // Gold for exclusive
  
  switch (category) {
    case 'restaurant': return '#FF6B6B';
    case 'shop': return '#4ECDC4';
    case 'fitness': return '#45B7D1';
    case 'arts': return '#96CEB4';
    default: return '#95E1D3';
  }
};

const getOfferDisplayText = (merchant: Merchant) => {
  const cashbackOffer = merchant.offers.find(offer => offer.type === 'cashback');
  const pointsOffer = merchant.offers.find(offer => offer.type === 'points');
  
  if (cashbackOffer) {
    return `${cashbackOffer.value}% back`;
  }
  if (pointsOffer) {
    return `${pointsOffer.value || 'Earn'} pts`;
  }
  return 'Offers';
};

export function MapViewComponent({ merchants, onMarkerPress, initialRegion }: MapViewComponentProps) {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation={true}
      showsMyLocationButton={false}
      toolbarEnabled={false}
    >
      {merchants.map((merchant) => (
        <Marker
          key={merchant.id}
          coordinate={{
            latitude: merchant.latitude,
            longitude: merchant.longitude,
          }}
          onPress={() => onMarkerPress(merchant)}
        >
          <View style={[
            styles.markerContainer,
            { backgroundColor: getCategoryColor(merchant.category, merchant.exclusive) }
          ]}>
            <Typography
              variant="caption"
              color="#FFF"
              weight="semiBold"
              style={styles.markerText}
            >
              {getOfferDisplayText(merchant)}
            </Typography>
            {merchant.exclusive && (
              <IconSymbol name="crown.fill" size={12} color="#FFF" style={styles.markerIcon} />
            )}
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    fontSize: 12,
  },
  markerIcon: {
    marginLeft: 4,
  },
});