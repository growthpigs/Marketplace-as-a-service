import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useRef } from 'react';
import { useCheckout } from '@/context/CheckoutContext';

/**
 * ConfirmationScreen - Order success celebration
 *
 * UBER EATS CONFIRMATION LAYOUT:
 * ┌─────────────────────────────────────┐
 * │                                      │
 * │            ✓ (animated)             │
 * │                                      │
 * │      Commande confirmée!            │
 * │      Votre commande est en          │
 * │      cours de préparation           │
 * │                                      │
 * │      Numéro: TKE-ABC123             │
 * │      Livraison: 25-35 min           │
 * │                                      │
 * │   ┌───────────────────────────┐     │
 * │   │  🎁 +€2.79 cashback       │     │
 * │   │  ajouté à votre wallet!   │     │
 * │   └───────────────────────────┘     │
 * │                                      │
 * │   [    Suivre ma commande     ]     │
 * │   [    Retour à l'accueil     ]     │
 * │                                      │
 * └─────────────────────────────────────┘
 *
 * ANIMATIONS:
 * - Checkmark scale + bounce
 * - Confetti particles
 * - Fade-in for text elements
 */

// Simple confetti particle component
function ConfettiParticle({
  color,
  startX,
  startY,
  delay,
}: {
  color: string;
  startX: number;
  startY: number;
  delay: number;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const randomXEnd = (Math.random() - 0.5) * 200;
    const randomDuration = 1500 + Math.random() * 1000;

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 400,
          duration: randomDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: randomXEnd,
          duration: randomDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: Math.random() * 10,
          duration: randomDuration,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(randomDuration * 0.7),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 10],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          backgroundColor: color,
          left: startX,
          top: startY,
          opacity,
          transform: [{ translateX }, { translateY }, { rotate: spin }],
        },
      ]}
    />
  );
}

export default function ConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, resetCheckout } = useCheckout();

  // Animation values
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const cashbackScale = useRef(new Animated.Value(0.8)).current;

  // Confetti colors (TurkEats brand inspired)
  const confettiColors = ['#22C55E', '#000000', '#F59E0B', '#3B82F6', '#EC4899'];

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    startX: Math.random() * 300 + 50,
    startY: -20,
    delay: i * 50,
  }));

  // Calculate mock cashback
  const mockCashback = 2.79; // Would come from actual order

  useEffect(() => {
    // Sequence the animations
    Animated.sequence([
      // 1. Checkmark appears with bounce
      Animated.parallel([
        Animated.spring(checkmarkScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // 2. Content fades in
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // 3. Cashback badge bounces
      Animated.spring(cashbackScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle back to home
  const handleBackToHome = () => {
    resetCheckout();
    router.replace('/');
  };

  // Handle track order
  const handleTrackOrder = () => {
    // TODO: Navigate to order tracking screen
    console.log('Track order:', state.orderId);
    handleBackToHome();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Confetti */}
      {confettiParticles.map((particle) => (
        <ConfettiParticle
          key={particle.id}
          color={particle.color}
          startX={particle.startX}
          startY={particle.startY}
          delay={particle.delay}
        />
      ))}

      {/* Main Content */}
      <View style={styles.content}>
        {/* Animated Checkmark */}
        <Animated.View
          style={[
            styles.checkmarkContainer,
            {
              opacity: checkmarkOpacity,
              transform: [{ scale: checkmarkScale }],
            },
          ]}
        >
          <View style={styles.checkmarkCircle}>
            <FontAwesome name="check" size={48} color="#FFFFFF" />
          </View>
        </Animated.View>

        {/* Success Text */}
        <Animated.View style={{ opacity: contentOpacity }}>
          <Text style={styles.successTitle}>Commande confirmée!</Text>
          <Text style={styles.successSubtitle}>
            Votre commande est en cours de préparation
          </Text>

          {/* Order Info */}
          <View style={styles.orderInfo}>
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Numéro de commande</Text>
              <Text style={styles.orderInfoValue}>{state.orderId || 'TKE-XXX'}</Text>
            </View>
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Livraison estimée</Text>
              <Text style={styles.orderInfoValue}>25-35 min</Text>
            </View>
          </View>
        </Animated.View>

        {/* Cashback Badge */}
        <Animated.View
          style={[
            styles.cashbackBadge,
            {
              opacity: contentOpacity,
              transform: [{ scale: cashbackScale }],
            },
          ]}
        >
          <FontAwesome name="gift" size={24} color="#22C55E" />
          <View style={styles.cashbackTextContainer}>
            <Text style={styles.cashbackAmount}>+€{mockCashback.toFixed(2)} cashback</Text>
            <Text style={styles.cashbackSubtext}>ajouté à votre portefeuille!</Text>
          </View>
        </Animated.View>
      </View>

      {/* Buttons */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.trackButton} onPress={handleTrackOrder}>
          <FontAwesome name="map-marker" size={18} color="#FFFFFF" />
          <Text style={styles.trackButtonText}>Suivre ma commande</Text>
        </Pressable>

        <Pressable style={styles.homeButton} onPress={handleBackToHome}>
          <Text style={styles.homeButtonText}>Retour à l'accueil</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  checkmarkContainer: {
    marginBottom: 24,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  orderInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  orderInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  cashbackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  cashbackTextContainer: {
    marginLeft: 12,
  },
  cashbackAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22C55E',
  },
  cashbackSubtext: {
    fontSize: 14,
    color: '#166534',
    marginTop: 2,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  homeButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  // Confetti styles
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
