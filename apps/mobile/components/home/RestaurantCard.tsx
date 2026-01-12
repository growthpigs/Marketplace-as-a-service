import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * RestaurantCard - Pixel-perfect copy of Uber Eats restaurant card
 *
 * UBER EATS DESIGN:
 * - Hero image (full width, ~180px height)
 * - Restaurant name (bold, 16px)
 * - Rating with star icon
 * - Delivery time + min order + distance
 * - Promo badge if applicable
 *
 * Layout:
 * ┌─────────────────────────────────────┐
 * │ [HERO IMAGE - 320x180px]            │
 * │                                     │
 * │ Restaurant Name            ★ 4.5   │
 * │ 15-25 min • Min €10 • 1.2km        │
 * │ [Top offer • 2 offres disponibles] │
 * └─────────────────────────────────────┘
 */

export interface Restaurant {
  id: string;
  name: string;
  image: string | null;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  minOrder: number;
  distance: string;
  promo?: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_MARGIN * 2);
const IMAGE_HEIGHT = 180;

export function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        {restaurant.image ? (
          <Image
            source={{ uri: restaurant.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <FontAwesome name="cutlery" size={40} color="#9CA3AF" />
          </View>
        )}
      </View>

      {/* Restaurant Info */}
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.rating}>
            <FontAwesome name="star" size={12} color="#000000" />
            <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.details} numberOfLines={1}>
          {restaurant.deliveryTime} • Min €{restaurant.minOrder} • {restaurant.distance}
        </Text>

        {restaurant.promo && (
          <View style={styles.promoContainer}>
            <Text style={styles.promoText} numberOfLines={1}>{restaurant.promo}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: CARD_MARGIN,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  info: {
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 4,
  },
  details: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  promoContainer: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  promoText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
});

export default RestaurantCard;
