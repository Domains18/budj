import { IconSymbol } from '@/components/ui/icon-symbol';
import { NumberText, Typography } from '@/components/ui/typography';
import { Image } from 'expo-image';
import React from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

const { height } = Dimensions.get('window');

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

interface MerchantBottomSheetProps {
  merchant: Merchant | null;
  slideAnimation: Animated.Value;
  onClose: () => void;
}

export function MerchantBottomSheet({ merchant, slideAnimation, onClose }: MerchantBottomSheetProps) {
  if (!merchant) return null;

  return (
    <Animated.View style={[
      styles.bottomSheet,
      { bottom: slideAnimation.interpolate({
          inputRange: [0, height],
          outputRange: [0, -height],
        })
      }
    ]}>
      <View style={styles.bottomSheetHandle} />
      
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={onClose}
      >
        <IconSymbol name="xmark" size={20} color="#666" />
      </TouchableOpacity>

      <View style={styles.merchantInfo}>
        <View style={styles.merchantHeader}>
          {merchant.logo && (
            <Image 
              source={{ uri: merchant.logo }}
              style={styles.merchantLogo}
              placeholder={merchant.blurhash}
            />
          )}
          <View style={styles.merchantDetails}>
            <Typography variant="h4" weight="bold" color="#333" style={styles.merchantName}>
              {merchant.name}
            </Typography>
            <Typography variant="body" color="#666" style={styles.merchantAddress}>
              {merchant.street}
            </Typography>
            <View style={styles.merchantMeta}>
              <Typography
                variant="bodySmall"
                weight="semiBold"
                color={merchant.status === 'Open' ? '#4CAF50' : '#F44336'}
              >
                {merchant.status}
              </Typography>
              <Typography variant="bodySmall" color="#666">
                {merchant.distance}km away
              </Typography>
              <View style={styles.ratingContainer}>
                <IconSymbol name="star.fill" size={14} color="#FFD700" />
                <NumberText style={styles.rating}>{merchant.rating}</NumberText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.offersContainer}>
          <Typography variant="h5" weight="semiBold" color="#333" style={styles.offersTitle}>
            Available Offers
          </Typography>
          {merchant.offers.map((offer, index) => (
            <View key={index} style={styles.offerCard}>
              <IconSymbol 
                name={offer.type === 'cashback' ? 'dollarsign.circle.fill' : 'star.fill'} 
                size={24} 
                color={offer.type === 'cashback' ? '#4CAF50' : '#FF9800'} 
              />
              <View style={styles.offerDetails}>
                <Typography variant="body" weight="semiBold" color="#333">
                  {offer.type === 'cashback' ? 'Cashback' : 'Loyalty Points'}
                </Typography>
                <Typography variant="bodySmall" color="#666">
                  {offer.type === 'cashback' 
                    ? `${offer.value}% back (up to KES ${offer.upto})`
                    : `Earn points (up to ${offer.upto} pts)`
                  }
                </Typography>
              </View>
            </View>
          ))}
          
          {merchant.exclusive && (
            <View style={styles.exclusiveTag}>
              <IconSymbol name="crown.fill" size={16} color="#FFD700" />
              <Typography variant="body" weight="semiBold" color="#F57F17" style={styles.exclusiveText}>
                Exclusive Offer
              </Typography>
              {merchant.offersLeft && (
                <Typography variant="bodySmall" color="#F57F17">
                  {merchant.offersLeft} offers left
                </Typography>
              )}
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: height * 0.7,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20,
    paddingTop: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  merchantInfo: {
    flex: 1,
    paddingHorizontal: 24,
  },
  merchantHeader: {
    flexDirection: 'row',
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
    marginBottom: 4,
  },
  merchantAddress: {
    marginBottom: 8,
  },
  merchantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  offersContainer: {
    flex: 1,
  },
  offersTitle: {
    marginBottom: 16,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  offerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  exclusiveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  exclusiveText: {
    marginLeft: 8,
    flex: 1,
  },
});