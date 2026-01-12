# F004 - Order Placement

**ID:** F004
**Priority:** P0 (MVP)
**Status:** Spec Complete
**Estimate:** 4 DU

---

## Overview

Shopping cart management and order placement flow. Includes delivery address, order review, and checkout.

---

## User Stories

### US-012: Add to Cart
```
As a customer
I want to add items to my cart
So I can build my order

Acceptance Criteria:
- [ ] Add item with selected options
- [ ] Show cart icon with item count
- [ ] Cart persists across app navigation
- [ ] View cart from any screen
- [ ] Single restaurant per cart (clear cart prompt if switching)
```

### US-013: Manage Cart
```
As a customer
I want to edit my cart
So I can adjust my order

Acceptance Criteria:
- [ ] View all cart items
- [ ] Increase/decrease quantity
- [ ] Remove items (swipe or button)
- [ ] Edit item options
- [ ] See subtotal, fees, total
- [ ] Apply promo code
```

### US-014: Delivery Address
```
As a customer
I want to set my delivery address
So the restaurant knows where to deliver

Acceptance Criteria:
- [ ] Select saved address (home, work)
- [ ] Add new address with autocomplete
- [ ] Confirm location on map
- [ ] Add delivery instructions (gate code, floor)
- [ ] Verify address in delivery zone
```

### US-015: Order Review
```
As a customer
I want to review my order before paying
So I can confirm everything is correct

Acceptance Criteria:
- [ ] Show restaurant name and logo
- [ ] List all items with options
- [ ] Show price breakdown:
  - Subtotal
  - Delivery fee
  - Service fee (2%)
  - Wallet credit applied (optional)
  - Promo discount (if any)
  - Total
- [ ] Estimated delivery time
- [ ] Edit order button
```

### US-016: Place Order
```
As a customer
I want to place my order
So the restaurant can prepare my food

Acceptance Criteria:
- [ ] "Place Order" button
- [ ] Loading state during submission
- [ ] Order confirmation screen
- [ ] Order number generated
- [ ] Push notification sent
- [ ] Clear cart after success
```

---

## Technical Specification

### API Endpoints

```typescript
// Cart is client-side only (Flutter state)
// Only submitted order hits API

// POST /orders
Request: {
  restaurant_id: "uuid",
  delivery_address: {
    street: "123 Rue de Paris",
    city: "Paris",
    postal_code: "75001",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    instructions: "Code: 1234"
  },
  items: [{
    menu_item_id: "uuid",
    quantity: 2,
    options: {
      size: "xl",
      sauce: "blanche",
      extras: ["cheese"]
    },
    special_instructions: "No onions"
  }],
  promo_code: "FIRST10",
  use_wallet_balance: true
}

Response: {
  order_id: "uuid",
  order_number: "TK-2026-001234",
  status: "pending",
  estimated_delivery: "2026-01-12T14:30:00Z",
  total: 22.50,
  wallet_credit_used: 5.00,
  cashback_earned: 2.25,
  payment_intent_client_secret: "pi_..." // If card payment
}

// GET /orders/:id
Response: { ...orderDetails }

// POST /orders/:id/cancel
Request: { reason: "Changed my mind" }
Response: { success: true, refund_amount: 22.50 }
```

### Database Schema

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  restaurant_id UUID REFERENCES restaurants(id),

  -- Delivery
  delivery_address JSONB NOT NULL,
  delivery_instructions TEXT,

  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(6,2) DEFAULT 0,
  service_fee DECIMAL(6,2) DEFAULT 0,
  promo_discount DECIMAL(6,2) DEFAULT 0,
  wallet_credit_used DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Cashback
  cashback_rate DECIMAL(4,2) DEFAULT 10.00,
  cashback_amount DECIMAL(10,2) DEFAULT 0,

  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  -- pending → confirmed → preparing → ready → delivering → delivered
  -- cancelled, refunded

  -- Timestamps
  placed_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  preparing_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  delivering_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  -- Payment
  payment_method VARCHAR(20), -- card, wallet, cash
  payment_status VARCHAR(20) DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(100),

  -- Promo
  promo_code_id UUID REFERENCES promo_codes(id),

  estimated_delivery_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  name VARCHAR(150) NOT NULL, -- Snapshot at order time
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(8,2) NOT NULL,
  options_price DECIMAL(8,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  options JSONB, -- Selected options snapshot
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  seq INT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 9) AS INT)), 0) + 1
  INTO seq
  FROM orders
  WHERE order_number LIKE 'TK-' || TO_CHAR(NOW(), 'YYYY') || '-%';

  NEW.order_number := 'TK-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION generate_order_number();
```

### Flutter Implementation

```dart
// lib/features/cart/providers/cart_provider.dart
@riverpod
class Cart extends _$Cart {
  @override
  CartState build() => CartState.empty();

  void addItem(MenuItem item, Map<String, dynamic> options, int quantity) {
    // Check if different restaurant - prompt to clear
    if (state.restaurantId != null && state.restaurantId != item.restaurantId) {
      // Show clear cart dialog
      return;
    }

    final cartItem = CartItem(
      menuItem: item,
      options: options,
      quantity: quantity,
      totalPrice: _calculateItemPrice(item, options, quantity),
    );

    state = state.copyWith(
      restaurantId: item.restaurantId,
      items: [...state.items, cartItem],
    );
  }

  void removeItem(String itemId) { ... }
  void updateQuantity(String itemId, int quantity) { ... }
  void applyPromoCode(String code) { ... }
  void clear() { ... }
}

// lib/features/checkout/screens/checkout_screen.dart
class CheckoutScreen extends ConsumerWidget {
  // Address selection
  // Order summary
  // Payment method
  // Place order button
}
```

---

## UI Screens

1. **Cart Sheet** - Slide-up panel with cart contents
2. **Address Selection** - List of saved addresses + add new
3. **Address Entry** - Google Places autocomplete + map confirm
4. **Order Review** - Full order summary + pricing
5. **Order Confirmation** - Success screen with order number

---

## Dependencies

- F001 (Auth) - User must be logged in
- F003 (Menu) - Items come from menu
- F005 (Payments) - Payment processing
- F007 (Wallet) - Wallet balance integration

---

## Edge Cases

- Cart empty → Disable checkout button
- Below minimum order → Show "Add €X more" message
- Out of delivery zone → Block checkout with message
- Restaurant closed → Block checkout, suggest scheduling
- Item unavailable after adding → Show alert, remove from cart
- Promo code invalid → Show error message
- Wallet insufficient → Fall back to card

---

## Testing Checklist

- [ ] Add single item to cart
- [ ] Add item with options
- [ ] Add multiple items
- [ ] Update item quantity
- [ ] Remove item from cart
- [ ] Switch restaurant clears cart (with confirmation)
- [ ] Promo code application
- [ ] Wallet balance application
- [ ] Order placement success
- [ ] Order placement with card payment
- [ ] Order placement with wallet only
- [ ] Below minimum order validation
