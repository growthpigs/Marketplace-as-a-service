import { View, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * RestaurantHero - Pixel-perfect copy of Uber Eats restaurant hero image
 *
 * UBER EATS DESIGN:
 * - Full-width hero image (~250px height)
 * - Back button overlay (top-left, circular white background)
 * - Favorite heart button (top-right)
 * - More options button (top-right, next to heart)
 * - Gradient overlay at top for button visibility
 *
 * LAYOUT:
 * ┌─────────────────────────────────────┐
 * │ [←]                         [♡] [⋯]│ ← White circular buttons
 * │                                     │
 * │      [HERO IMAGE - FULL WIDTH]      │
 * │                                     │
 * │                                     │
 * └─────────────────────────────────────┘
 */

interface RestaurantHeroProps {
  image: string | null;
  isFavorited?: boolean;
  onBackPress?: () => void;
  onFavoritePress?: () => void;
  onMorePress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 250;
const BUTTON_SIZE = 36;

export function RestaurantHero({
  image,
  isFavorited = false,
  onBackPress,
  onFavoritePress,
  onMorePress,
}: RestaurantHeroProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Hero Image */}
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <FontAwesome name="cutlery" size={60} color="#9CA3AF" />
        </View>
      )}

      {/* Button Overlay */}
      <View style={[styles.buttonOverlay, { paddingTop: insets.top + 8 }]}>
        {/* Left: Back Button */}
        <Pressable
          style={styles.circleButton}
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome name="arrow-left" size={16} color="#000000" />
        </Pressable>

        {/* Right: Favorite + More */}
        <View style={styles.rightButtons}>
          <Pressable
            style={[styles.circleButton, isFavorited && styles.favoriteActive]}
            onPress={onFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome
              name={isFavorited ? "heart" : "heart-o"}
              size={16}
              color={isFavorited ? "#FF6B6B" : "#000000"}
            />
          </Pressable>
          <Pressable
            style={[styles.circleButton, styles.moreButton]}
            onPress={onMorePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome name="ellipsis-h" size={16} color="#000000" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
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
  buttonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  circleButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    // iOS shadow properties (deprecated but iOS-specific)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rightButtons: {
    flexDirection: 'row',
  },
  moreButton: {
    marginLeft: 8,
  },
  favoriteActive: {
    backgroundColor: '#FFE8E8',
  },
});

export default RestaurantHero;
