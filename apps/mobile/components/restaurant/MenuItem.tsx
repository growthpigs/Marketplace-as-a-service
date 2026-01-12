import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * MenuItem - Pixel-perfect copy of Uber Eats menu item
 *
 * UBER EATS DESIGN:
 * - Left: Item info (name, description, price)
 * - Right: Square image (80x80px)
 * - "Most liked" badge if applicable
 * - Add button (+) on image corner
 *
 * LAYOUT:
 * ┌─────────────────────────────────────┐
 * │ [#1 Most liked]                     │
 * ├─────────────────────────┬───────────┤
 * │ Döner Sandwich          │  [IMG]    │
 * │ Viande döner grillée... │    [+]    │
 * │ €7.50                   │           │
 * └─────────────────────────┴───────────┘
 */

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  popular?: boolean;
}

interface MenuItemProps {
  item: MenuItemData;
  onPress?: () => void;
}

const IMAGE_SIZE = 80;

export function MenuItem({ item, onPress }: MenuItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* Popular Badge */}
      {item.popular && (
        <View style={styles.popularBadge}>
          <FontAwesome name="thumbs-up" size={10} color="#059669" />
          <Text style={styles.popularText}>#1 Le plus aimé</Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Left: Item Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.price}>€{item.price.toFixed(2)}</Text>
        </View>

        {/* Right: Image with Add Button */}
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <FontAwesome name="cutlery" size={24} color="#9CA3AF" />
            </View>
          )}

          {/* Add Button */}
          <Pressable
            style={styles.addButton}
            onPress={onPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome name="plus" size={14} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    marginRight: 12,
    paddingVertical: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  imageContainer: {
    position: 'relative',
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
  },
  placeholderImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginTop: 16,
    marginBottom: 16,
  },
});

export default MenuItem;
