import { View, Text, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * HomeHeader - Pixel-perfect copy of Uber Eats home header
 *
 * UBER EATS DESIGN:
 * - "Deliver now" label (small)
 * - Address with dropdown arrow
 * - Notification bell on right
 *
 * Layout:
 * ┌─────────────────────────────────────┐
 * │ Deliver now                      🔔 │
 * │ 1226 University Dr            ▼    │
 * └─────────────────────────────────────┘
 */

interface HomeHeaderProps {
  address?: string;
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
}

export function HomeHeader({
  address = "123 Rue de la République",
  onLocationPress,
  onNotificationPress,
}: HomeHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Pressable style={styles.locationButton} onPress={onLocationPress}>
        <Text style={styles.deliverLabel}>Livrer maintenant</Text>
        <View style={styles.addressRow}>
          <Text style={styles.address} numberOfLines={1}>{address}</Text>
          <FontAwesome name="chevron-down" size={12} color="#000000" style={styles.chevron} />
        </View>
      </Pressable>

      <Pressable style={styles.notificationButton} onPress={onNotificationPress}>
        <FontAwesome name="bell-o" size={22} color="#000000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  locationButton: {
    flex: 1,
  },
  deliverLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    maxWidth: '90%',
  },
  chevron: {
    marginLeft: 6,
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeHeader;
