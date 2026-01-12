import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

/**
 * LaunchScreen - Pixel-perfect copy of Uber Eats launch screen
 *
 * UBER EATS REFERENCE:
 * - Full screen green (#06C167) background
 * - Centered "Uber Eats" text in white
 * - Bold display font (32px)
 *
 * TURKEATS ADAPTATION:
 * - Same green, same layout
 * - "TurkEats" text instead
 */
export function LaunchScreen() {
  return (
    <View style={styles.container} className="flex-1 bg-turkeats-green items-center justify-center">
      <StatusBar style="light" />
      <Text style={styles.logo} className="text-white text-display font-bold tracking-tight">
        TurkEats
      </Text>
    </View>
  );
}

// Fallback styles (NativeWind className takes priority when working)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06C167', // Uber Eats green
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});

export default LaunchScreen;
