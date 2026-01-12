import React, { createContext, useContext, useReducer, useMemo } from 'react';

/**
 * CheckoutContext - Manages checkout flow state
 *
 * UBER EATS CHECKOUT FLOW:
 * 1. Address → Delivery location selection
 * 2. Delivery Time → Schedule or ASAP
 * 3. Payment → Card, Apple Pay, Google Pay
 * 4. Review → Order summary before confirmation
 * 5. Confirmation → Success with order details
 *
 * STATE:
 * - deliveryAddress: { formatted, placeId, coordinates }
 * - deliveryTime: 'asap' | scheduled timestamp
 * - paymentMethod: { type, last4, brand } (from Stripe)
 * - tip: number (optional tip amount)
 */

// Types
export interface DeliveryAddress {
  formatted: string;
  placeId: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  instructions?: string; // Delivery instructions
}

export interface PaymentMethod {
  type: 'card' | 'apple_pay' | 'google_pay';
  brand?: string; // visa, mastercard, etc.
  last4?: string;
}

export interface CheckoutState {
  deliveryAddress: DeliveryAddress | null;
  deliveryTime: 'asap' | Date | null;
  paymentMethod: PaymentMethod | null;
  tip: number;
  promoCode: string | null;
  stripePaymentIntentId: string | null;
  orderId: string | null;
  status: 'idle' | 'processing' | 'success' | 'error';
  error: string | null;
}

// Action Types
type CheckoutAction =
  | { type: 'SET_ADDRESS'; payload: DeliveryAddress }
  | { type: 'SET_DELIVERY_TIME'; payload: 'asap' | Date }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'SET_TIP'; payload: number }
  | { type: 'SET_PROMO_CODE'; payload: string | null }
  | { type: 'START_PROCESSING' }
  | { type: 'ORDER_SUCCESS'; payload: { orderId: string; paymentIntentId: string } }
  | { type: 'ORDER_ERROR'; payload: string }
  | { type: 'RESET_CHECKOUT' };

// Initial State
const initialState: CheckoutState = {
  deliveryAddress: null,
  deliveryTime: null,
  paymentMethod: null,
  tip: 0,
  promoCode: null,
  stripePaymentIntentId: null,
  orderId: null,
  status: 'idle',
  error: null,
};

// Reducer
function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_ADDRESS':
      return { ...state, deliveryAddress: action.payload };

    case 'SET_DELIVERY_TIME':
      return { ...state, deliveryTime: action.payload };

    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };

    case 'SET_TIP':
      return { ...state, tip: action.payload };

    case 'SET_PROMO_CODE':
      return { ...state, promoCode: action.payload };

    case 'START_PROCESSING':
      return { ...state, status: 'processing', error: null };

    case 'ORDER_SUCCESS':
      return {
        ...state,
        status: 'success',
        orderId: action.payload.orderId,
        stripePaymentIntentId: action.payload.paymentIntentId,
      };

    case 'ORDER_ERROR':
      return { ...state, status: 'error', error: action.payload };

    case 'RESET_CHECKOUT':
      return initialState;

    default:
      return state;
  }
}

// Context Types
interface CheckoutContextValue {
  state: CheckoutState;
  // Actions
  setAddress: (address: DeliveryAddress) => void;
  setDeliveryTime: (time: 'asap' | Date) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setTip: (amount: number) => void;
  setPromoCode: (code: string | null) => void;
  startProcessing: () => void;
  orderSuccess: (orderId: string, paymentIntentId: string) => void;
  orderError: (error: string) => void;
  resetCheckout: () => void;
  // Computed
  isReadyForPayment: boolean;
  isComplete: boolean;
}

// Create Context
const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined);

// Provider Component
export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  // Actions
  const setAddress = (address: DeliveryAddress) => {
    dispatch({ type: 'SET_ADDRESS', payload: address });
  };

  const setDeliveryTime = (time: 'asap' | Date) => {
    dispatch({ type: 'SET_DELIVERY_TIME', payload: time });
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const setTip = (amount: number) => {
    dispatch({ type: 'SET_TIP', payload: amount });
  };

  const setPromoCode = (code: string | null) => {
    dispatch({ type: 'SET_PROMO_CODE', payload: code });
  };

  const startProcessing = () => {
    dispatch({ type: 'START_PROCESSING' });
  };

  const orderSuccess = (orderId: string, paymentIntentId: string) => {
    dispatch({ type: 'ORDER_SUCCESS', payload: { orderId, paymentIntentId } });
  };

  const orderError = (error: string) => {
    dispatch({ type: 'ORDER_ERROR', payload: error });
  };

  const resetCheckout = () => {
    dispatch({ type: 'RESET_CHECKOUT' });
  };

  // Computed values
  const computed = useMemo(() => {
    const isReadyForPayment = !!(
      state.deliveryAddress &&
      state.deliveryTime
    );
    const isComplete = state.status === 'success' && !!state.orderId;

    return { isReadyForPayment, isComplete };
  }, [state]);

  const value: CheckoutContextValue = {
    state,
    setAddress,
    setDeliveryTime,
    setPaymentMethod,
    setTip,
    setPromoCode,
    startProcessing,
    orderSuccess,
    orderError,
    resetCheckout,
    ...computed,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

// Hook for consuming checkout context
export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}

export default CheckoutContext;
