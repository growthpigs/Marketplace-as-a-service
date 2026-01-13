# Active Tasks - TurkEats

**Updated:** 2026-01-13
**Focus:** F005 - Payment Processing Implementation

---

## Current Phase

**F005 - Payment Processing** - In Progress (Living Document: [`features/F005-payments.md`](../features/F005-payments.md))

**Current State:** ✅ Backend complete. Frontend in progress.

**Goal:** Implement real Stripe Payment Sheet integration + backend payment processing.

---

## Implementation Progress

### ✅ Phase 1: Backend Orders Service (COMPLETE - 1.5 DU)
- [x] Task 1.1: Create orders database schema
  - Created migration: `supabase/migrations/00002_add_stripe_fields.sql`
  - Added `stripe_customer_id` to user_profiles
  - Added `stripe_account_status` to restaurants

- [x] Task 1.2: Create POST /api/orders endpoint
  - Created `apps/api/src/orders/orders.controller.ts`
  - Created `apps/api/src/orders/orders.service.ts`
  - Validates restaurant, calculates fees (5% commission + 2% service)
  - Calculates wallet credit and cashback (10%)
  - Creates orders and order_items in database

- [x] Task 1.3: Integrate Stripe payment setup
  - Created `apps/api/src/lib/stripe.ts` with PaymentIntent creation
  - Stripe Connect: 5% platform fee + automatic restaurant transfer
  - Creates/stores Stripe customer ID for user
  - Returns client_secret for frontend Payment Sheet

### 🔄 Phase 2: Frontend Stripe Integration (IN PROGRESS - 1.5 DU)
- [ ] Task 2.1: Update payment.tsx to use real Stripe Payment Sheet
  - Starting to replace mock payment methods with real Stripe integration
  - Will fetch saved cards from `GET /api/payments/methods` (needs implementation)
  - Will use Stripe Payment Sheet for card selection/addition

- [ ] Task 2.2: Update review.tsx to call backend orders endpoint
  - Currently generates fake order, will call `POST /api/orders`
  - Will pass restaurant_id, items, delivery_address, wallet_amount_to_apply
  - Will receive order_id and payment client_secret

- [ ] Task 2.3: Implement payment processing after order creation
  - Will call `POST /orders/:id/pay` to process Stripe payment
  - Handle 3D Secure if required
  - Navigate to confirmation on success

### ⏳ Phase 3: Wallet Integration (0.5 DU)
- [ ] Task 3.1: Add wallet balance to payment options

### ⏳ Phase 4: Testing & Cleanup (1 DU)
- [ ] Task 4.1: End-to-end payment flow test
- [ ] Task 4.2: Error handling and edge cases
- [ ] Task 4.3: Clean up mock code

---

## Related Files

**Living Documents:**
- [`features/F005-payments.md`](../features/F005-payments.md) - Full spec with implementation plan
- [`features/INDEX.md`](../features/INDEX.md) - Feature catalog

**Source Code (to modify):**
- `apps/mobile/app/checkout/payment.tsx` - Mock payment methods (lines 35-100)
- `apps/mobile/app/checkout/review.tsx` - Fake order creation (lines 87-91)
- `apps/api/src/app.controller.ts` - Currently only "Hello World" endpoint

**API Contracts:**
- [`docs/04-technical/API-CONTRACTS.md`](../docs/04-technical/API-CONTRACTS.md) - POST /orders endpoint spec
- [`docs/04-technical/DATA-MODEL.md`](../docs/04-technical/DATA-MODEL.md) - Database schema

---

## Next Actions

**Immediate:** Start Phase 1 with database schema migrations.

See [`features/F005-payments.md`](../features/F005-payments.md) for complete implementation plan with bite-sized tasks.
