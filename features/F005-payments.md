# F005 - Payment Processing

**ID:** F005
**Priority:** P0 (MVP)
**Status:** Spec Complete
**Estimate:** 5 DU

---

## Overview

Stripe Connect integration for marketplace payments. Customers pay platform, platform transfers to restaurants minus commission. Supports card payments and wallet balance.

---

## User Stories

### US-017: Add Payment Method
```
As a customer
I want to save my card
So I can pay for orders quickly

Acceptance Criteria:
- [ ] Add card via Stripe Elements
- [ ] Save card for future use
- [ ] View saved cards (last 4 digits, expiry)
- [ ] Set default card
- [ ] Delete saved card
```

### US-018: Pay for Order
```
As a customer
I want to pay for my order
So the restaurant can prepare it

Acceptance Criteria:
- [ ] Select payment method (saved card, new card, wallet)
- [ ] Apply wallet balance first (optional)
- [ ] Pay remaining with card
- [ ] 3D Secure handling
- [ ] Show payment confirmation
```

### US-019: View Payment History
```
As a customer
I want to see my payment history
So I can track my spending

Acceptance Criteria:
- [ ] List of all payments
- [ ] Show date, restaurant, amount
- [ ] Show payment status
- [ ] Link to order details
```

---

## Technical Specification

### Stripe Connect Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Customer   │────>│  Platform   │────>│ Restaurant  │
│  (Stripe)   │     │  (Stripe)   │     │ (Connected) │
└─────────────┘     └─────────────┘     └─────────────┘
      │                    │                   │
      │  Payment           │  Commission       │  Transfer
      │  €10.20            │  €0.70            │  €9.50
      └────────────────────┴───────────────────┘
```

### Payment Flow

1. Customer places order (€10.20 total)
2. Platform creates PaymentIntent with:
   - Amount: €10.20
   - Application fee: €0.70 (5% commission + 2% service fee)
   - Transfer to connected account: €9.50
3. Stripe processes payment
4. Platform receives €0.70
5. Restaurant receives €9.50 (automatic transfer)

### API Endpoints

```typescript
// POST /payments/setup-intent
// Get SetupIntent for saving card
Response: {
  client_secret: "seti_..._secret_...",
  customer_id: "cus_..."
}

// GET /payments/methods
// List saved payment methods
Response: {
  payment_methods: [{
    id: "pm_...",
    type: "card",
    card: {
      brand: "visa",
      last4: "4242",
      exp_month: 12,
      exp_year: 2026
    },
    is_default: true
  }]
}

// DELETE /payments/methods/:id
Response: { success: true }

// POST /payments/methods/:id/default
Response: { success: true }

// POST /orders/:id/pay
Request: {
  payment_method_id: "pm_...", // or "new_card"
  use_wallet: true
}
Response: {
  status: "succeeded" | "requires_action" | "failed",
  client_secret: "pi_..._secret_..." // If requires 3DS
}

// POST /orders/:id/confirm-payment
// After 3D Secure completion
Request: { payment_intent_id: "pi_..." }
Response: { status: "succeeded" }
```

### Database Schema

```sql
-- Stripe customer ID linked to user
ALTER TABLE user_profiles
ADD COLUMN stripe_customer_id VARCHAR(50);

-- Payment methods (Stripe is source of truth, this is cache)
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  stripe_payment_method_id VARCHAR(50) NOT NULL,
  type VARCHAR(20) DEFAULT 'card',
  card_brand VARCHAR(20),
  card_last4 VARCHAR(4),
  card_exp_month INT,
  card_exp_year INT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurant Stripe Connect accounts
ALTER TABLE restaurants
ADD COLUMN stripe_account_id VARCHAR(50),
ADD COLUMN stripe_account_status VARCHAR(20) DEFAULT 'pending';
-- pending, enabled, disabled

-- Payment records
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  user_id UUID REFERENCES auth.users(id),

  -- Stripe references
  stripe_payment_intent_id VARCHAR(50),
  stripe_charge_id VARCHAR(50),

  -- Amounts
  amount DECIMAL(10,2) NOT NULL,
  wallet_amount DECIMAL(10,2) DEFAULT 0,
  card_amount DECIMAL(10,2) DEFAULT 0,

  -- Platform fees
  platform_fee DECIMAL(10,2),
  restaurant_amount DECIMAL(10,2),

  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  -- pending, processing, succeeded, failed, refunded

  failure_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### React Native Implementation

```typescript
// lib/stores/payment-store.ts
import { create } from 'zustand';
import { initStripe, presentPaymentSheet, confirmPayment } from '@stripe/stripe-react-native';
import { api } from '../api';

interface PaymentState {
  savedCards: PaymentMethod[];
  loading: boolean;
  initializeStripe: () => Promise<void>;
  saveCard: () => Promise<void>;
  payForOrder: (orderId: string, paymentMethodId?: string, useWallet?: boolean) => Promise<PaymentResult>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  savedCards: [],
  loading: false,

  initializeStripe: async () => {
    await initStripe({
      publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      merchantIdentifier: 'merchant.com.turkeats',
    });
  },

  saveCard: async () => {
    set({ loading: true });
    try {
      // Get SetupIntent from backend
      const { data: setupIntent } = await api.post('/payments/setup-intent');

      // Show Stripe payment sheet
      const { error } = await presentPaymentSheet({
        clientSecret: setupIntent.client_secret,
      });

      if (error) throw new Error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  payForOrder: async (orderId, paymentMethodId, useWallet = true) => {
    set({ loading: true });
    try {
      const { data } = await api.post(`/orders/${orderId}/pay`, {
        payment_method_id: paymentMethodId,
        use_wallet: useWallet,
      });

      if (data.status === 'requires_action') {
        // Handle 3D Secure
        const { error } = await confirmPayment(data.client_secret);
        if (error) throw new Error(error.message);
        return await get().confirmPayment(orderId, data.payment_intent_id);
      }

      return data;
    } finally {
      set({ loading: false });
    }
  },
}));
```

### Webhook Handler

```typescript
// Handle Stripe webhooks for async events
// POST /webhooks/stripe

switch (event.type) {
  case 'payment_intent.succeeded':
    await updateOrderPaymentStatus(event.data.object.id, 'succeeded');
    await creditCashback(event.data.object.metadata.order_id);
    break;

  case 'payment_intent.payment_failed':
    await updateOrderPaymentStatus(event.data.object.id, 'failed');
    await notifyPaymentFailed(event.data.object.metadata.order_id);
    break;

  case 'charge.refunded':
    await processRefund(event.data.object);
    break;
}
```

---

## UI Screens

1. **Payment Methods** - List saved cards + add new
2. **Add Card** - Stripe Elements form
3. **Checkout Payment** - Select method, apply wallet
4. **3D Secure** - WebView for bank auth
5. **Payment Success** - Confirmation + receipt option

---

## Dependencies

- F001 (Auth) - User must be logged in
- F004 (Ordering) - Order must exist
- F007 (Wallet) - Wallet balance for partial payment
- Stripe account with Connect enabled
- Restaurants must have connected accounts

---

## Security Considerations

- Never store full card numbers (Stripe handles PCI)
- Webhook signature verification
- idempotency keys for payment requests
- Server-side amount validation (never trust client)
- 3D Secure for EU compliance (SCA)

---

## Testing Checklist

- [ ] Add card via Stripe Elements
- [ ] Save card for future use
- [ ] Pay with saved card
- [ ] Pay with new card
- [ ] 3D Secure flow
- [ ] Partial wallet + card payment
- [ ] Full wallet payment
- [ ] Payment failure handling
- [ ] Webhook processing
- [ ] Refund processing
