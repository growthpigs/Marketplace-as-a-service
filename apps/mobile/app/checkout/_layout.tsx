import { Stack } from 'expo-router';
import { CheckoutProvider } from '@/context/CheckoutContext';

/**
 * Checkout Stack Layout
 *
 * UBER EATS CHECKOUT FLOW:
 * address → delivery-time → payment → review → confirmation
 *
 * Each screen has:
 * - Back button (except confirmation)
 * - Progress indicator
 * - Consistent header styling
 */

export default function CheckoutLayout() {
  return (
    <CheckoutProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      >
        <Stack.Screen
          name="address"
          options={{
            title: 'Adresse de livraison',
          }}
        />
        <Stack.Screen
          name="delivery-time"
          options={{
            title: 'Heure de livraison',
          }}
        />
        <Stack.Screen
          name="payment"
          options={{
            title: 'Paiement',
          }}
        />
        <Stack.Screen
          name="review"
          options={{
            title: 'Vérifier la commande',
          }}
        />
        <Stack.Screen
          name="confirmation"
          options={{
            title: 'Commande confirmée',
            headerShown: false,
            gestureEnabled: false, // Prevent swipe back
          }}
        />
      </Stack>
    </CheckoutProvider>
  );
}
