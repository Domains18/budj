import { IconSymbol } from "@/components/ui/icon-symbol";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.9;

export interface Merchant {
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

interface StoreDetailsBottomSheetProps {
  isVisible: boolean;
  merchants: Merchant[];
  onClose: () => void;
  onMerchantPress: (merchant: Merchant) => void;
}

export function StoreDetailsBottomSheet({
  isVisible,
  merchants,
  onClose,
  onMerchantPress,
}: StoreDetailsBottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [isVisible, translateY]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderGrant: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        const newTranslateY = Math.max(
          SCREEN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT,
          SCREEN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT + gestureState.dy
        );
        translateY.setValue(newTranslateY);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50 || gestureState.vy > 0.5) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onClose();
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    },
  });

  const handleMerchantPress = useCallback(
    (merchant: Merchant) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onMerchantPress(merchant);
    },
    [onMerchantPress]
  );

  const renderMerchantItem = ({ item }: { item: Merchant }) => (
    <StoreCard merchant={item} onPress={() => handleMerchantPress(item)} />
  );

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50">
        {/* Backdrop */}
        <TouchableOpacity
          className="flex-1"
          onPress={onClose}
          activeOpacity={1}
        />

        {/* Bottom Sheet */}
        <Animated.View
          className="absolute top-0 left-0 right-0 rounded-t-3xl overflow-hidden"
          style={{
            height: SCREEN_HEIGHT,
            transform: [{ translateY }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <BlurView intensity={20} tint="light" className="flex-1">
            <View className="flex-1 pt-4">
              {/* Handle and Header - with drag gesture */}
              <View {...panResponder.panHandlers}>
                {/* Handle */}
                <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-5" />

                {/* Header */}
                <View className="flex-row justify-between items-start px-5 mb-5">
                  <TouchableOpacity onPress={onClose} className="p-2 -mt-2">
                    <IconSymbol name="xmark" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Merchant List */}
              <FlatList
                data={merchants}
                renderItem={renderMerchantItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="px-5 pb-24"
                ItemSeparatorComponent={() => <View className="h-3" />}
              />
            </View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
}

function StoreCard({
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
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between mb-3">
        <View className="flex-row flex-1 mr-3">
          <View className="mr-3">
            {merchant.logo ? (
              <Image
                source={{ uri: merchant.logo }}
                className="w-14 h-14 rounded-xl"
              />
            ) : (
              <View className="w-14 h-14 rounded-xl bg-gray-100 items-center justify-center">
                <IconSymbol name="storefront" size={24} color="#9CA3AF" />
              </View>
            )}
          </View>
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text
                className="text-lg font-semibold text-gray-900 flex-1 mr-2"
                numberOfLines={1}
              >
                {merchant.name}
              </Text>
              {merchant.exclusive && (
                <View className="bg-blue-500 px-2 py-0.5 rounded">
                  <Text className="text-[10px] font-semibold text-white">
                    Exclusive
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-row items-center mb-1 flex-wrap">
              <Text className="text-sm text-gray-600 capitalize">
                {merchant.category}
              </Text>
              <Text className="text-sm text-gray-400 mx-1.5">•</Text>
              <Text className="text-sm text-gray-600">
                {merchant.distance} km
              </Text>
              <Text className="text-sm text-gray-400 mx-1.5">•</Text>
              <View className="flex-row items-center">
                <IconSymbol name="star.fill" size={12} color="#FFA500" />
                <Text className="text-sm text-gray-600 ml-1">
                  {merchant.rating}
                </Text>
              </View>
            </View>
            <Text className="text-sm text-gray-500" numberOfLines={1}>
              {merchant.street}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <View
            className={`px-2.5 py-1 rounded-lg ${
              merchant.status === "Open" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                merchant.status === "Open" ? "text-green-700" : "text-red-700"
              }`}
            >
              {merchant.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Offers Section */}
      <View className="gap-2">
        {cashbackOffer && (
          <View className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg self-start">
            <IconSymbol name="creditcard.fill" size={14} color="#3B82F6" />
            <Text className="text-sm text-gray-900 ml-2 font-medium">
              {cashbackOffer.value}% cashback up to KES {cashbackOffer.upto}
            </Text>
          </View>
        )}
        {pointsOffer && (
          <View className="flex-row items-center bg-orange-50 px-3 py-2 rounded-lg self-start">
            <IconSymbol name="star.circle.fill" size={14} color="#F97316" />
            <Text className="text-sm text-gray-900 ml-2 font-medium">
              {pointsOffer.value ? `${pointsOffer.value} points` : "Points"}
              {pointsOffer.upto && ` up to ${pointsOffer.upto}`}
            </Text>
          </View>
        )}
        {merchant.offersLeft && (
          <Text className="text-xs text-gray-500 italic mt-1">
            {merchant.offersLeft} offers left
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
