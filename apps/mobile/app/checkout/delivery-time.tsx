import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { useCheckout } from '@/context/CheckoutContext';

/**
 * DeliveryTimeScreen - Delivery time selection
 *
 * MVP: ASAP only (as per design decision)
 *
 * UBER EATS DELIVERY TIME LAYOUT:
 * ┌─────────────────────────────────────┐
 * │ ← Heure de livraison                │
 * ├─────────────────────────────────────┤
 * │ ⚡ Dès que possible                  │
 * │    Livraison estimée: 25-35 min    │
 * │    [✓ Selected]                     │
 * ├─────────────────────────────────────┤
 * │ 📅 Planifier pour plus tard         │
 * │    (Bientôt disponible)            │
 * │    [Disabled]                       │
 * ├─────────────────────────────────────┤
 * │ [         Continuer              ]  │
 * └─────────────────────────────────────┘
 */

export default function DeliveryTimeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, setDeliveryTime } = useCheckout();

  const [selectedOption, setSelectedOption] = useState<'asap' | 'scheduled'>(
    state.deliveryTime === 'asap' || !state.deliveryTime ? 'asap' : 'scheduled'
  );

  // Estimated delivery time (mock for MVP)
  const estimatedMinTime = 25;
  const estimatedMaxTime = 35;

  // Handle continue
  const handleContinue = () => {
    if (selectedOption === 'asap') {
      setDeliveryTime('asap');
    }
    // For scheduled (future feature), would set specific time
    router.push('/checkout/payment');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* ASAP Option */}
        <Pressable
          style={[
            styles.optionCard,
            selectedOption === 'asap' && styles.optionCardSelected,
          ]}
          onPress={() => setSelectedOption('asap')}
        >
          <View style={styles.optionIconContainer}>
            <FontAwesome
              name="bolt"
              size={24}
              color={selectedOption === 'asap' ? '#000000' : '#6B7280'}
            />
          </View>
          <View style={styles.optionContent}>
            <Text
              style={[
                styles.optionTitle,
                selectedOption === 'asap' && styles.optionTitleSelected,
              ]}
            >
              Dès que possible
            </Text>
            <Text style={styles.optionSubtitle}>
              Livraison estimée: {estimatedMinTime}-{estimatedMaxTime} min
            </Text>
          </View>
          <View
            style={[
              styles.radioOuter,
              selectedOption === 'asap' && styles.radioOuterSelected,
            ]}
          >
            {selectedOption === 'asap' && <View style={styles.radioInner} />}
          </View>
        </Pressable>

        {/* Scheduled Option (Disabled for MVP) */}
        <Pressable
          style={[styles.optionCard, styles.optionCardDisabled]}
          disabled
        >
          <View style={styles.optionIconContainer}>
            <FontAwesome name="calendar" size={24} color="#D1D5DB" />
          </View>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, styles.optionTitleDisabled]}>
              Planifier pour plus tard
            </Text>
            <Text style={[styles.optionSubtitle, styles.optionSubtitleDisabled]}>
              Bientôt disponible
            </Text>
          </View>
          <View style={[styles.radioOuter, styles.radioOuterDisabled]} />
        </Pressable>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <FontAwesome name="info-circle" size={16} color="#6B7280" />
          <Text style={styles.infoText}>
            Le temps de livraison est une estimation et peut varier selon la demande
            et les conditions de circulation.
          </Text>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuer</Text>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionCardSelected: {
    borderColor: '#000000',
    backgroundColor: '#F9FAFB',
  },
  optionCardDisabled: {
    opacity: 0.5,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: '#000000',
  },
  optionTitleDisabled: {
    color: '#9CA3AF',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  optionSubtitleDisabled: {
    color: '#D1D5DB',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#000000',
  },
  radioOuterDisabled: {
    borderColor: '#E5E7EB',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000000',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  continueButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
