import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

export interface Merchant {
  id: string;
  name: string;
  category: string;
  street: string;
  distance: string;
  rating: number;
  exclusive?: boolean;
  offersLeft?: number;
  offerEnd?: string;
  offers: {
    type: "cashback" | "points";
    value: string;
    upto: string;
  }[];
}

interface MerchantCardsProps {
  merchants: Merchant[];
  onMerchantPress: (merchant: Merchant) => void;
  onSwipeUp: () => void;
}

export function MerchantCards({
  merchants,
  onMerchantPress,
  onSwipeUp,
}: MerchantCardsProps) {
  const handleOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(handleOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(handleOpacity, {
          toValue: 0.6,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [handleOpacity]);

  const handlePress = (merchant: Merchant) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onMerchantPress(merchant);
  };

  const handleSwipeUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSwipeUp();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          gestureState.dy < -20 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onPanResponderMove: () => {},
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50 && gestureState.vy < -0.5) {
          handleSwipeUp();
        }
      },
    })
  ).current;

  return (
    <View
      className="absolute bottom-0 left-0 right-0"
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        className="items-center py-2"
        onPress={handleSwipeUp}
        activeOpacity={0.7}
      >
        <Animated.View
          className="w-10 h-1 bg-gray-400 rounded-full mb-2"
          style={{ opacity: handleOpacity }}
        />
        <View className="bg-white px-4 py-2 rounded-full shadow-md">
          <Text className="text-sm text-gray-900 font-medium">
            Swipe up to see {merchants.length} offers nearby
          </Text>
        </View>
      </TouchableOpacity>

      {/* Horizontal Scroll of Merchant Cards */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
        contentContainerClassName="px-3 pb-4 gap-3"
      >
        {merchants.map((merchant) => (
          <MerchantCard
            key={merchant.id}
            merchant={merchant}
            onPress={() => handlePress(merchant)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function MerchantCard({
  merchant,
  onPress,
}: {
  merchant: Merchant;
  onPress: () => void;
}) {
  const cashbackOffer = merchant.offers.find((o) => o.type === "cashback");

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 shadow-lg"
      style={{ width: CARD_WIDTH }}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View className="flex-row mb-3">
        <View className="w-12 h-12 rounded-xl bg-blue-50 items-center justify-center mr-3">
          <IconSymbol name="cart.fill" size={24} color="#3B82F6" />
        </View>
        <View className="flex-1">
          <Text
            className="text-lg font-bold text-gray-900 mb-1"
            numberOfLines={1}
          >
            {merchant.name}
          </Text>
          <View className="flex-row items-center flex-wrap">
            <Text className="text-sm text-gray-600 mr-1" numberOfLines={1}>
              {merchant.street}
            </Text>
            <Text className="text-sm text-gray-400 mx-1">•</Text>
            <Text className="text-sm text-gray-600">{merchant.distance}</Text>
            {merchant.exclusive && (
              <>
                <Text className="text-sm text-gray-400 mx-1">•</Text>
                <View className="flex-row items-center">
                  <IconSymbol name="star.fill" size={12} color="#FFA500" />
                  <Text className="text-xs text-orange-500 font-semibold ml-1">
                    Exclusive
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      <View className="gap-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600 capitalize">
            {merchant.category}
          </Text>
          <View className="flex-row items-center">
            <IconSymbol name="star.fill" size={14} color="#FFA500" />
            <Text className="text-sm font-semibold text-gray-900 ml-1">
              {merchant.rating}
            </Text>
            <Text className="text-xs text-gray-500 ml-1">on Google</Text>
          </View>
        </View>

        {cashbackOffer && (
          <View className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl">
            <View className="flex-row items-baseline">
              <Text className="text-2xl font-bold text-blue-600">
                {cashbackOffer.value}%
              </Text>
              <Text className="text-sm text-gray-700 ml-2">cashback</Text>
            </View>
            <Text className="text-xs text-gray-600 mt-1">
              Up to KES {cashbackOffer.upto}
            </Text>
          </View>
        )}

        {merchant.offersLeft && (
          <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
            <Text className="text-xs text-gray-600">
              About {merchant.offersLeft} offers left
            </Text>
            {merchant.offerEnd && (
              <Text className="text-xs text-blue-600 font-medium">
                {merchant.offerEnd}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
