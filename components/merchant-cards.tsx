import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_SPACING = 16;
const EXPANDED_HEIGHT = 300;
const COLLAPSED_HEIGHT = 80;

export interface Merchant {
  id: string;
  name: string;
  category: string;
  street: string;
  distance: string;
  rating: number;
  exclusive?: boolean;
  offersLeft?: number | null;
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
      activeOpacity={0.95}
      style={styles.card}
    >
      {merchant.exclusive && (
        <View style={styles.exclusiveBadge}>
          <IconSymbol name="star.fill" size={10} color="white" />
          <Text style={styles.exclusiveText}>EXCLUSIVE</Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <View style={styles.logoContainer}>
          <IconSymbol name="storefront.fill" size={24} color="#4F46E5" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.merchantName} numberOfLines={1}>
            {merchant.name}
          </Text>
          <View style={styles.locationRow}>
            <IconSymbol name="location.fill" size={11} color="#9CA3AF" />
            <Text style={styles.streetText} numberOfLines={1}>
              {merchant.street}
            </Text>
          </View>
          <Text style={styles.distanceText}>{merchant.distance} km away</Text>
        </View>
      </View>

      <View style={styles.offerContainer}>
        {cashbackOffer && cashbackOffer.value && (
          <View style={styles.cashbackSection}>
            <View style={styles.cashbackRow}>
              <Text style={styles.cashbackValue}>{cashbackOffer.value}%</Text>
              <Text style={styles.cashbackLabel}>Cashback</Text>
            </View>
            <Text style={styles.cashbackLimit}>
              Up to KES {cashbackOffer.upto}
            </Text>
          </View>
        )}

        {pointsOffer && cashbackOffer && cashbackOffer.value && (
          <View style={styles.divider} />
        )}

        {pointsOffer && pointsOffer.value && (
          <View style={styles.pointsSection}>
            <IconSymbol name="star.circle.fill" size={14} color="#3B82F6" />
            <Text style={styles.pointsText} numberOfLines={1}>
              +{pointsOffer.value} pts/transaction
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.ratingBadge}>
          <IconSymbol name="star.fill" size={12} color="#F59E0B" />
          <Text style={styles.ratingText}>{merchant.rating}</Text>
        </View>

        {merchant.offersLeft && merchant.offersLeft > 0 && (
          <View style={styles.offersLeftRow}>
            <View style={styles.greenDot} />
            <Text style={styles.offersLeftText}>
              {merchant.offersLeft} left
            </Text>
          </View>
        )}
      </View>

      {merchant.offerEnd && (
        <View style={styles.offerEndSection}>
          <IconSymbol name="clock.fill" size={10} color="#2563EB" />
          <Text style={styles.offerEndText}>
            Ends {new Date(merchant.offerEnd).toLocaleDateString()}
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerHeight = useRef(new Animated.Value(EXPANDED_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Pulsing animation for indicator
  useEffect(() => {
    const pulseAnimation = Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0.4,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]);

    const loop = Animated.loop(pulseAnimation);
    loop.start();

    return () => loop.stop();
  }, [opacity]);

  const toggleCollapse = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);

    Animated.spring(containerHeight, {
      toValue: newCollapsedState ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT,
      useNativeDriver: false,
      tension: 80,
      friction: 10,
    }).start();
  }, [isCollapsed, containerHeight]);

  const triggerSwipeUp = useCallback(() => {
    if (!isCollapsed) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSwipeUp?.();
    }
  }, [onSwipeUp, isCollapsed]);

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        if (!isCollapsed) {
          Animated.spring(scale, {
            toValue: 0.98,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderMove: (_, gestureState) => {
        if (!isCollapsed && gestureState.dy < 0) {
          const clampedValue = Math.max(gestureState.dy, -120);
          // Apply transform without using setValue to avoid conflicts
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }).start();

        if (!isCollapsed && gestureState.dy < -60 && gestureState.vy < -0.5) {
          triggerSwipeUp();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handleMerchantPress = useCallback(
    (merchant: Merchant) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onMerchantPress(merchant);
    },
    [onMerchantPress]
  );

  if (merchants.length === 0) return null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          height: containerHeight,
          transform: [{ scale }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={toggleCollapse}
        activeOpacity={0.8}
        style={styles.indicatorSection}
      >
        <Animated.View style={[styles.indicator, { opacity }]} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>
            {merchants.length} Offers Nearby
          </Text>
          <View style={styles.swipeHint}>
            <IconSymbol
              name={isCollapsed ? "chevron.up" : "chevron.down"}
              size={12}
              color="#6B7280"
            />
            <Text style={styles.swipeHintText}>
              {isCollapsed ? "Tap to expand" : "Tap to minimize"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {!isCollapsed && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          snapToAlignment="center"
          style={styles.scrollView}
        >
          {merchants.slice(0, 6).map((merchant) => (
            <MerchantCard
              key={merchant.id}
              merchant={merchant}
              onPress={() => handleMerchantPress(merchant)}
            />
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 24,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  indicatorSection: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#FAFBFC",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 2.5,
    marginBottom: 8,
  },
  headerTextContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  swipeHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  swipeHintText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginLeft: 3,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
    paddingVertical: 12,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginHorizontal: CARD_SPACING / 2,
    width: CARD_WIDTH,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  exclusiveBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#F97316",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 10,
  },
  exclusiveText: {
    fontSize: 9,
    fontWeight: "800",
    color: "white",
    marginLeft: 3,
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
  },
  streetText: {
    fontSize: 11,
    color: "#6B7280",
    marginLeft: 3,
    flex: 1,
  },
  distanceText: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "600",
    marginTop: 2,
  },
  offerContainer: {
    backgroundColor: "#F0F5FF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  cashbackSection: {
    marginBottom: 4,
  },
  cashbackRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 2,
  },
  cashbackValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#2563EB",
    lineHeight: 36,
  },
  cashbackLabel: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 6,
    fontWeight: "600",
  },
  cashbackLimit: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#DBEAFE",
    marginVertical: 8,
  },
  pointsSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  pointsText: {
    fontSize: 12,
    color: "#1D4ED8",
    fontWeight: "600",
    marginLeft: 6,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingBadge: {
    backgroundColor: "#FEF3C7",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#B45309",
    marginLeft: 4,
  },
  offersLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  offersLeftText: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "600",
  },
  offerEndSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  offerEndText: {
    fontSize: 11,
    color: "#2563EB",
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default MerchantCards;
