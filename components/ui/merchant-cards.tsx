import * as Haptics from "expo-haptics";
import { useCallback, useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { IconSymbol } from "./icon-symbol";
import { runOnJS } from "react-native-worklets";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

function MerchantCard({
  merchant,
  onPress,
}: {
  merchant: Merchant;
  onPress: () => void;
}) {
  const cashbackOffer = merchant.offers.find((o) => o.type === "cashback");
  const pointsOffer = merchant.offers.find((o) => o.type === "points");

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white rounded-3xl p-5 mr-4 w-80 shadow-xl border border-gray-50"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      {merchant.exclusive && (
        <View className="absolute -top-2 -right-2 bg-orange-500 rounded-full px-3 py-1.5 flex-row items-center shadow-lg z-10">
          <IconSymbol name="star.fill" size={12} color="white" />
          <Text className="text-xs font-bold text-white ml-1">EXCLUSIVE</Text>
        </View>
      )}

      <View className="flex-row items-center mb-4">
        <View className="w-14 h-14 rounded-2xl bg-blue-50 items-center justify-center mr-3 shadow-sm">
          <IconSymbol name="storefront.fill" size={28} color="#4F46E5" />
        </View>
        <View className="flex-1">
          <Text
            className="text-lg font-bold text-gray-900 mb-0.5"
            numberOfLines={1}
          >
            {merchant.name}
          </Text>
          <View className="flex-row items-center">
            <IconSymbol name="location.fill" size={12} color="#9CA3AF" />
            <Text
              className="text-xs text-gray-500 ml-1 flex-1"
              numberOfLines={1}
            >
              {merchant.street}
            </Text>
          </View>
          <Text className="text-xs text-gray-400 font-medium mt-0.5">
            {merchant.distance}
          </Text>
        </View>
      </View>

      <View className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 mb-3">
        {cashbackOffer && (
          <View className="mb-2">
            <View className="flex-row items-baseline mb-1">
              <Text className="text-4xl font-black text-blue-600">
                {cashbackOffer.value}%
              </Text>
              <Text className="text-base text-gray-700 ml-2 font-semibold">
                Cashback
              </Text>
            </View>
            <Text className="text-xs text-gray-600 font-medium">
              Up to KES {cashbackOffer.upto}
            </Text>
          </View>
        )}

        {pointsOffer && (
          <View className="flex-row items-center mt-2 pt-2 border-t border-blue-100">
            <IconSymbol name="star.circle.fill" size={16} color="#3B82F6" />
            <Text className="text-sm text-blue-700 font-semibold ml-2">
              +{pointsOffer.value} points per transaction
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row justify-between items-center">
        <View className="bg-amber-50 flex-row items-center px-3 py-2 rounded-xl">
          <IconSymbol name="star.fill" size={14} color="#F59E0B" />
          <Text className="text-sm font-bold text-amber-700 ml-1.5">
            {merchant.rating}
          </Text>
        </View>

        {merchant.offersLeft && (
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            <Text className="text-xs text-gray-600 font-medium">
              {merchant.offersLeft} offers left
            </Text>
          </View>
        )}
      </View>

      {merchant.offerEnd && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <Text className="text-xs text-blue-600 font-semibold text-center">
            Ends {merchant.offerEnd}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function MerchantCards({
  merchants,
  onMerchantPress,
  onSwipeUp,
}: MerchantCardsProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  // Pulse animation
  useEffect(() => {
    const pulseAnimation = () => {
      opacity.value = withTiming(0.5, { duration: 1000 }, () => {
        opacity.value = withTiming(1, { duration: 1000 });
      });
    };
    const interval = setInterval(pulseAnimation, 2000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Safe JS handler called from worklet
  const triggerSwipeUp = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSwipeUp?.();
  }, [onSwipeUp]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(0.98, { damping: 15 });
    })
    .onUpdate((event) => {
      if (event.translationY < 0) {
        translateY.value = Math.max(event.translationY, -100);
      }
    })
    .onEnd((event) => {
      scale.value = withSpring(1, { damping: 15 });

      if (event.translationY < -50 && event.velocityY < -500) {
        runOnJS(triggerSwipeUp)();
      }

      translateY.value = withSpring(0);
    });

  const handleIndicatorPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSwipeUp?.();
  }, [onSwipeUp]);

  const handleMerchantPress = useCallback(
    (merchant: Merchant) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onMerchantPress(merchant);
    },
    [onMerchantPress]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (merchants.length === 0) return null;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={animatedStyle}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl"
      >
        <TouchableOpacity
          onPress={handleIndicatorPress}
          activeOpacity={0.8}
          className="items-center py-4 bg-gradient-to-b from-gray-50 to-white rounded-t-3xl"
        >
          <Animated.View
            style={indicatorStyle}
            className="w-12 h-1.5 bg-gray-300 rounded-full mb-3"
          />
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              {merchants.length} Offers Nearby
            </Text>
            <View className="flex-row items-center">
              <IconSymbol name="chevron.up" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-500 font-medium ml-1">
                Swipe up to see all
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 24,
            paddingTop: 8,
          }}
          decelerationRate="fast"
          snapToInterval={SCREEN_WIDTH * 0.85}
          snapToAlignment="start"
        >
          {merchants.slice(0, 6).map((merchant) => (
            <MerchantCard
              key={merchant.id}
              merchant={merchant}
              onPress={() => handleMerchantPress(merchant)}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
}

export default MerchantCards;
