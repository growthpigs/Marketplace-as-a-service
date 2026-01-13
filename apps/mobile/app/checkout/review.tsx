import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';

/**
 * Validation vs System Errors:
 * - VALIDATION: User needs to fix something (min order, missing address) → Toast warning
 * - SYSTEM: App/server issue (network error, 500) → Error screen with retry
 */
type ValidationError = { type: 'validation'; message: string };
type SystemError = { type: 'system'; message: string };

/**
 * ReviewScreen - Order review before confirmation
 *
 * UBER EATS REVIEW SCREEN LAYOUT:
 * ┌─────────────────────────────────────┐
 * │ ← Vérifier la commande              │
 * ├─────────────────────────────────────┤
 * │ 📍 Livraison                        │
 * │    12 rue de la Paix, Paris        │
 * │    Dès que possible (25-35 min)    │
 * ├─────────────────────────────────────┤
 * │ 💳 Paiement                         │
 * │    •••• 4242 - Visa                │
 * ├─────────────────────────────────────┤
 * │ 🍴 Votre commande                   │
 * │    Kebab Palace                     │
 * │    2x Döner Sandwich       €15.00  │
 * │    1x Assiette Grecque     €12.90  │
 * ├─────────────────────────────────────┤
 * │ Résumé des frais                    │
 * │    Sous-total              €27.90  │
 * │    Livraison               €0.49   │
 * │    Frais de service        €0.56   │
 * │    Cashback (10%)          -€2.79  │
 * │    ─────────────────────────────── │
 * │    Total                   €28.95  │
 * ├─────────────────────────────────────┤
 * │ [    Passer la commande    ]       │
 * └─────────────────────────────────────┘
 */

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state: checkoutState, startProcessing, orderSuccess, orderError } = useCheckout();
  const { state: cartState, subtotal, total, clearCart, meetsMinOrder } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate fees
  const deliveryFee = cartState.deliveryFee;
  const serviceFee = subtotal * 0.02;
  const cashback = subtotal * 0.10; // 10% cashback

  // Format payment method display
  const formatPaymentMethod = () => {
    const method = checkoutState.paymentMethod;
    if (!method) return 'Non sélectionné';

    if (method.type === 'card') {
      const brand = method.brand
        ? method.brand.charAt(0).toUpperCase() + method.brand.slice(1)
        : 'Carte';
      return `•••• ${method.last4 || '****'} - ${brand}`;
    }
    if (method.type === 'apple_pay') return 'Apple Pay';
    if (method.type === 'google_pay') return 'Google Pay';
    return 'Carte';
  };

  // Format delivery time display
  const formatDeliveryTime = () => {
    if (checkoutState.deliveryTime === 'asap') {
      return 'Dès que possible (25-35 min)';
    }
    if (checkoutState.deliveryTime instanceof Date) {
      return checkoutState.deliveryTime.toLocaleString('fr-FR');
    }
    return 'Non sélectionné';
  };

  // Show validation toast (user needs to fix something)
  const showValidationToast = (message: string, subtitle?: string) => {
    Toast.show({
      type: 'warning',
      text1: message,
      text2: subtitle,
      visibilityTime: 4000,
    });
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    // ─────────────────────────────────────────────────────────
    // VALIDATION CHECKS (show toast, don't proceed)
    // These are user-fixable issues, not app errors
    // ─────────────────────────────────────────────────────────

    // Check minimum order requirement FIRST (most common issue)
    if (!meetsMinOrder) {
      showValidationToast(
        `Commande minimum: €${cartState.minOrder.toFixed(2)}`,
        `Ajoutez €${(cartState.minOrder - subtotal).toFixed(2)} pour commander`
      );
      return; // Don't proceed, don't show error screen
    }

    // Check delivery address
    if (!checkoutState.deliveryAddress) {
      showValidationToast('Adresse manquante', 'Ajoutez une adresse de livraison');
      return;
    }

    // Check cart has items
    if (cartState.items.length === 0) {
      showValidationToast('Panier vide', 'Ajoutez des articles pour commander');
      return;
    }

    // Check items have quantity
    const hasItems = cartState.items.some(item => item.quantity > 0);
    if (!hasItems) {
      showValidationToast('Panier vide', 'Ajoutez des articles pour commander');
      return;
    }

    // Check restaurant selected
    if (!cartState.restaurantId) {
      showValidationToast('Restaurant non sélectionné', 'Retournez au menu');
      return;
    }

    // ─────────────────────────────────────────────────────────
    // VALIDATION PASSED - Now process order
    // From here, errors are SYSTEM errors (show error screen)
    // ─────────────────────────────────────────────────────────

    setIsProcessing(true);
    startProcessing();

    const isDemoMode = process.env.EXPO_PUBLIC_ENV === 'demo' ||
                       process.env.EXPO_PUBLIC_ENV === 'development' ||
                       !process.env.EXPO_PUBLIC_API_URL;

    try {
      // Additional address validation for production mode
      if (!isDemoMode) {
        const addressFields = ['streetAddress', 'city', 'postalCode'];
        for (const field of addressFields) {
          if (!checkoutState.deliveryAddress[field as keyof typeof checkoutState.deliveryAddress]) {
            showValidationToast('Adresse incomplète', `${field} manquant`);
            setIsProcessing(false);
            return;
          }
        }
      }

      // Build order request matching backend CreateOrderRequest schema
      const orderRequest = {
        user_id: 'mock-user-id', // TODO: Get real user ID from auth context
        restaurant_id: cartState.restaurantId,
        items: cartState.items.map((item) => ({
          menu_item_id: item.menuItem.id,
          name: item.menuItem.name,
          quantity: item.quantity,
          unit_price: item.menuItem.price,
          options_price: 0, // TODO: support menu item options
          options: null,
          special_instructions: null,
        })),
        delivery_address: {
          formatted: checkoutState.deliveryAddress.formatted,
          placeId: checkoutState.deliveryAddress.placeId,
          streetAddress: checkoutState.deliveryAddress.streetAddress || 'Position GPS',
          city: checkoutState.deliveryAddress.city || 'Paris',
          postalCode: checkoutState.deliveryAddress.postalCode || '75000',
          coordinates: checkoutState.deliveryAddress.coordinates,
        },
        delivery_instructions: checkoutState.deliveryAddress.instructions || undefined,
        tips: checkoutState.tip || 0,
        wallet_amount_to_apply: 0, // TODO: integrate wallet
        promo_code: checkoutState.promoCode || undefined,
      };

      // Use isDemoMode already defined above for order submission
      let orderId: string;
      let paymentIntentId: string;

      if (isDemoMode) {
        // Demo mode: simulate successful order without API call
        // This allows testing the full UI flow without backend
        console.log('[DEMO MODE] Simulating order submission:', orderRequest);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

        orderId = `demo-order-${Date.now()}`;
        paymentIntentId = `demo-pi-${Date.now()}`;
        console.log('[DEMO MODE] Order created:', { orderId, paymentIntentId });
      } else {
        // Production mode: Call backend API with timeout
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;

        // API URL is REQUIRED in production mode
        if (!apiUrl) {
          throw new Error('Configuration erreur: API non configurée');
        }

        // Auth token - MVP uses placeholder, production needs real auth
        const authToken = process.env.EXPO_PUBLIC_ENV === 'production'
          ? null // TODO: Get from secure storage after real auth
          : 'mock-jwt-token-placeholder'; // MVP demo token

        if (!authToken) {
          throw new Error('Authentification requise');
        }

        // Add 30-second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        // Generate idempotency key to prevent duplicate orders on retry
        // Format: order-{restaurantId}-{timestamp}-{random}
        const idempotencyKey = `order-${cartState.restaurantId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        let response;
        try {
          response = await fetch(`${apiUrl}/api/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
              'Idempotency-Key': idempotencyKey,
            },
            body: JSON.stringify(orderRequest),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeoutId);
        }

        if (!response.ok) {
          let errorMessage = `Erreur serveur: ${response.status}`;
          try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            }
          } catch (e) {
            // Content is not JSON, use status code message
          }
          throw new Error(errorMessage);
        }

        const orderResponse = await response.json();

        // Validate API response shape
        if (!orderResponse?.id) {
          throw new Error('Réponse serveur invalide: ID de commande manquant');
        }

        orderId = orderResponse.id;
        paymentIntentId = orderResponse.payment_intent_id ?? `pi-${orderId}`;
      }

      // Success! Order created (real or demo)
      Toast.show({
        type: 'success',
        text1: 'Commande confirmée!',
        text2: 'Préparation en cours...',
        visibilityTime: 2000,
      });
      orderSuccess(orderId, paymentIntentId);
      clearCart();
      router.replace('/checkout/confirmation');
    } catch (error) {
      let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Délai d\'attente dépassé (30s). Vérifiez votre connexion et réessayez.';
        } else {
          errorMessage = error.message;
        }
      }

      orderError(errorMessage);
      setIsProcessing(false);
    }
  };

  // Show loading state during order processing
  if (isProcessing) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Traitement de votre commande...</Text>
          <Text style={styles.loadingSubtext}>Veuillez patienter</Text>
        </View>
      </View>
    );
  }

  // Show error state
  if (checkoutState.error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={48} color="#DC2626" style={styles.errorIcon} />
          <Text style={styles.errorTitle}>Une erreur s'est produite</Text>
          <Text style={styles.errorMessage}>{checkoutState.error}</Text>
          <Pressable style={styles.retryButton} onPress={handlePlaceOrder}>
            <FontAwesome name="refresh" size={16} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>  Réessayer</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Retour</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Delivery Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="map-marker" size={18} color="#000000" />
            <Text style={styles.sectionTitle}>Livraison</Text>
            <Pressable onPress={() => router.push('/checkout/address')}>
              <Text style={styles.editButton}>Modifier</Text>
            </Pressable>
          </View>
          <Text style={styles.sectionContent}>
            {checkoutState.deliveryAddress?.formatted || 'Aucune adresse'}
          </Text>
          {checkoutState.deliveryAddress?.instructions && (
            <Text style={styles.sectionSubtext}>
              Instructions: {checkoutState.deliveryAddress.instructions}
            </Text>
          )}
          <Text style={styles.sectionSubtext}>{formatDeliveryTime()}</Text>
        </View>

        {/* Payment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="credit-card" size={18} color="#000000" />
            <Text style={styles.sectionTitle}>Paiement</Text>
            <Pressable onPress={() => router.push('/checkout/payment')}>
              <Text style={styles.editButton}>Modifier</Text>
            </Pressable>
          </View>
          <Text style={styles.sectionContent}>{formatPaymentMethod()}</Text>
        </View>

        {/* Order Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="cutlery" size={18} color="#000000" />
            <Text style={styles.sectionTitle}>Votre commande</Text>
          </View>
          <Text style={styles.restaurantName}>{cartState.restaurantName}</Text>

          {cartState.items.map((item) => (
            <View key={item.menuItem.id} style={styles.orderItem}>
              <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
              <Text style={styles.orderItemName}>{item.menuItem.name}</Text>
              <Text style={styles.orderItemPrice}>
                €{(item.menuItem.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Price Summary Section */}
        <View style={styles.section}>
          <Text style={styles.summaryTitle}>Résumé des frais</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>€{subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frais de livraison</Text>
            <Text style={styles.summaryValue}>€{deliveryFee.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frais de service</Text>
            <Text style={styles.summaryValue}>€{serviceFee.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.cashbackLabel}>
              <FontAwesome name="gift" size={14} color="#22C55E" />
              <Text style={styles.cashbackText}>Cashback (10%)</Text>
            </View>
            <Text style={styles.cashbackValue}>+€{cashback.toFixed(2)}</Text>
          </View>

          <View style={styles.totalDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>€{total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Cashback Info */}
        <View style={styles.cashbackInfo}>
          <FontAwesome name="info-circle" size={16} color="#22C55E" />
          <Text style={styles.cashbackInfoText}>
            €{cashback.toFixed(2)} seront ajoutés à votre portefeuille après livraison
          </Text>
        </View>

        {/* Terms */}
        <Text style={styles.termsText}>
          En passant cette commande, vous acceptez nos{' '}
          <Text style={styles.termsLink}>conditions générales</Text>
        </Text>

        {/* Bottom spacing */}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[
            styles.placeOrderButton,
            isProcessing && styles.placeOrderButtonDisabled,
          ]}
          disabled={isProcessing}
          onPress={handlePlaceOrder}
        >
          {isProcessing ? (
            <View style={styles.processingContent}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.placeOrderButtonText}>Traitement en cours...</Text>
            </View>
          ) : (
            <Text style={styles.placeOrderButtonText}>
              Passer la commande • €{total.toFixed(2)}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
    flex: 1,
  },
  editButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#22C55E',
  },
  sectionContent: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  sectionSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  orderItemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    width: 30,
  },
  orderItemName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#374151',
  },
  cashbackLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cashbackText: {
    fontSize: 14,
    color: '#22C55E',
    marginLeft: 6,
  },
  cashbackValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
  },
  totalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  cashbackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  cashbackInfoText: {
    flex: 1,
    fontSize: 13,
    color: '#166534',
    marginLeft: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    lineHeight: 18,
  },
  termsLink: {
    color: '#000000',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  placeOrderButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#374151',
  },
  processingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});
