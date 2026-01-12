import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * FloatingCartButton - Pixel-perfect copy of Uber Eats cart button
 *
 * UBER EATS DESIGN:
 * - Fixed at bottom of screen
 * - Full-width black button
 * - "View cart" text + item count + total
 * - Safe area aware
 *
 * LAYOUT:
 * ┌─────────────────────────────────────┐
 * │                                     │
 * │ [   View cart • 2 items - €20.40   ]│
 * │                                     │
 * └─────────────────────────────────────┘
 */

interface FloatingCartButtonProps {
  itemCount: number;
  total: number;
  onPress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function FloatingCartButton({
  itemCount,
  total,
  onPress,
}: FloatingCartButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      <Pressable style={styles.button} onPress={onPress}>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{itemCount}</Text>
        </View>
        <Text style={styles.buttonText}>Voir le panier</Text>
        <Text style={styles.totalText}>€{total.toFixed(2)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
  },
  countBadge: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FloatingCartButton;
