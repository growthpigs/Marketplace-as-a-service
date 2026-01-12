import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { useCheckout, PaymentMethod } from '@/context/CheckoutContext';

/**
 * PaymentScreen - Payment method selection
 *
 * MVP: MOCK implementation (no real Stripe)
 * Shows UI but fakes the payment processing
 *
 * UBER EATS PAYMENT SCREEN LAYOUT:
 * ┌─────────────────────────────────────┐
 * │ ← Paiement                          │
 * ├─────────────────────────────────────┤
 * │ Méthodes de paiement                │
 * │                                      │
 * │ ┌───────────────────────────────┐   │
 * │ │ 💳 •••• 4242        VISA  ✓  │   │
 * │ └───────────────────────────────┘   │
 * │ ┌───────────────────────────────┐   │
 * │ │  Apple Pay                    │   │
 * │ └───────────────────────────────┘   │
 * │ ┌───────────────────────────────┐   │
 * │ │  Google Pay                   │   │
 * │ └───────────────────────────────┘   │
 * │                                      │
 * │ + Ajouter une carte                 │
 * ├─────────────────────────────────────┤
 * │ [         Continuer              ]  │
 * └─────────────────────────────────────┘
 *
 * TODO: Integrate real Stripe Payment Sheet when keys available
 */

// Mock payment methods for demo
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { type: 'card', brand: 'visa', last4: '4242' },
  { type: 'apple_pay' },
  { type: 'google_pay' },
];

// Card brand icons mapping
const CARD_BRAND_ICONS: Record<string, string> = {
  visa: 'cc-visa',
  mastercard: 'cc-mastercard',
  amex: 'cc-amex',
  discover: 'cc-discover',
};

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, setPaymentMethod } = useCheckout();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    state.paymentMethod || MOCK_PAYMENT_METHODS[0]
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle payment method selection
  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  // Handle continue (mock payment setup)
  const handleContinue = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    // Simulate network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500));

    setPaymentMethod(selectedMethod);
    setIsProcessing(false);
    router.push('/checkout/review');
  };

  // Format payment method display
  const formatMethodDisplay = (method: PaymentMethod) => {
    if (method.type === 'card') {
      return `•••• ${method.last4 || '****'}`;
    }
    if (method.type === 'apple_pay') {
      return 'Apple Pay';
    }
    if (method.type === 'google_pay') {
      return 'Google Pay';
    }
    return 'Carte';
  };

  // Get icon for payment method
  const getMethodIcon = (method: PaymentMethod): string => {
    if (method.type === 'card' && method.brand) {
      return CARD_BRAND_ICONS[method.brand.toLowerCase()] || 'credit-card';
    }
    if (method.type === 'apple_pay') {
      return 'apple';
    }
    if (method.type === 'google_pay') {
      return 'google';
    }
    return 'credit-card';
  };

  // Check if method is selected
  const isSelected = (method: PaymentMethod) => {
    if (!selectedMethod) return false;
    if (method.type !== selectedMethod.type) return false;
    if (method.type === 'card') {
      return method.last4 === selectedMethod.last4;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Section Header */}
        <Text style={styles.sectionTitle}>Méthodes de paiement</Text>

        {/* Payment Methods List */}
        {MOCK_PAYMENT_METHODS.map((method, index) => (
          <Pressable
            key={`${method.type}-${method.last4 || index}`}
            style={[
              styles.paymentMethodCard,
              isSelected(method) && styles.paymentMethodCardSelected,
            ]}
            onPress={() => handleSelectMethod(method)}
          >
            {/* Icon */}
            <View style={styles.methodIconContainer}>
              <FontAwesome
                name={getMethodIcon(method) as any}
                size={24}
                color={isSelected(method) ? '#000000' : '#6B7280'}
              />
            </View>

            {/* Method Details */}
            <View style={styles.methodContent}>
              <Text
                style={[
                  styles.methodTitle,
                  isSelected(method) && styles.methodTitleSelected,
                ]}
              >
                {formatMethodDisplay(method)}
              </Text>
              {method.type === 'card' && method.brand && (
                <Text style={styles.methodSubtitle}>
                  {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)}
                </Text>
              )}
            </View>

            {/* Selection Indicator */}
            <View
              style={[
                styles.radioOuter,
                isSelected(method) && styles.radioOuterSelected,
              ]}
            >
              {isSelected(method) && <View style={styles.radioInner} />}
            </View>
          </Pressable>
        ))}

        {/* Add New Card (Placeholder) */}
        <Pressable
          style={styles.addCardButton}
          onPress={() => {
            // TODO: Open Stripe Card Element or manual entry
            console.log('Add card pressed - would open Stripe Card Element');
          }}
        >
          <FontAwesome name="plus" size={16} color="#000000" />
          <Text style={styles.addCardButtonText}>Ajouter une carte</Text>
        </Pressable>

        {/* Demo Notice */}
        <View style={styles.demoNotice}>
          <FontAwesome name="flask" size={16} color="#F59E0B" />
          <Text style={styles.demoNoticeText}>
            Mode démo - Aucun paiement réel ne sera effectué
          </Text>
        </View>

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <FontAwesome name="lock" size={14} color="#6B7280" />
          <Text style={styles.securityText}>
            Paiement sécurisé par chiffrement SSL
          </Text>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[
            styles.continueButton,
            (!selectedMethod || isProcessing) && styles.continueButtonDisabled,
          ]}
          disabled={!selectedMethod || isProcessing}
          onPress={handleContinue}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.continueButtonText}>Continuer</Text>
          )}
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  paymentMethodCardSelected: {
    borderColor: '#000000',
    backgroundColor: '#F9FAFB',
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  methodTitleSelected: {
    color: '#000000',
  },
  methodSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
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
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000000',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  addCardButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 8,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  demoNoticeText: {
    fontSize: 13,
    color: '#92400E',
    marginLeft: 8,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  securityText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
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
  continueButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
