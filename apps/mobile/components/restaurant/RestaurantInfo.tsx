import { View, Text, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * RestaurantInfo - Pixel-perfect copy of Uber Eats restaurant info section
 *
 * UBER EATS DESIGN:
 * - Restaurant name (large, bold)
 * - Rating badge with star icon
 * - Price level + cuisine + distance
 * - Delivery time + delivery fee
 * - "More info" button
 *
 * LAYOUT:
 * ┌─────────────────────────────────────┐
 * │ Kebab Palace              ★ 4.5    │
 * │ €€ • Turkish • 1.2km               │
 * │ 15-25 min delivery • €0.49 fee     │
 * │ [More info ›]                       │
 * └─────────────────────────────────────┘
 */

interface RestaurantInfoProps {
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  cuisine: string;
  distance: string;
  deliveryTime: string;
  deliveryFee: string;
  onMoreInfoPress?: () => void;
}

export function RestaurantInfo({
  name,
  rating,
  reviewCount,
  priceLevel,
  cuisine,
  distance,
  deliveryTime,
  deliveryFee,
  onMoreInfoPress,
}: RestaurantInfoProps) {
  return (
    <View style={styles.container}>
      {/* Name + Rating Row */}
      <View style={styles.headerRow}>
        <Text style={styles.name}>{name}</Text>
        <Pressable style={styles.ratingBadge}>
          <FontAwesome name="star" size={12} color="#000000" />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({reviewCount}+)</Text>
        </Pressable>
      </View>

      {/* Price Level + Cuisine + Distance */}
      <Text style={styles.metaText}>
        {priceLevel} • {cuisine} • {distance}
      </Text>

      {/* Delivery Info */}
      <View style={styles.deliveryRow}>
        <View style={styles.deliveryItem}>
          <FontAwesome name="clock-o" size={14} color="#6B7280" style={styles.deliveryIcon} />
          <Text style={styles.deliveryText}>{deliveryTime}</Text>
        </View>
        <View style={styles.deliveryDot} />
        <View style={styles.deliveryItem}>
          <FontAwesome name="motorcycle" size={14} color="#6B7280" style={styles.deliveryIcon} />
          <Text style={styles.deliveryText}>{deliveryFee} Frais de livraison</Text>
        </View>
      </View>

      {/* More Info Link */}
      <Pressable style={styles.moreInfoButton} onPress={onMoreInfoPress}>
        <Text style={styles.moreInfoText}>Plus d'infos</Text>
        <FontAwesome name="chevron-right" size={12} color="#6B7280" />
      </Pressable>

      {/* Divider */}
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
    marginRight: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 2,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryIcon: {
    marginRight: 6,
  },
  deliveryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  deliveryDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6B7280',
    marginHorizontal: 8,
  },
  moreInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  moreInfoText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 12,
  },
});

export default RestaurantInfo;
