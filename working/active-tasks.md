# Active Tasks - TurkEats

**Updated:** 2026-01-13
**Focus:** F005 - Payment Processing Implementation

---

## 🎉 MILESTONE: UI 100% Complete (2026-01-13)

**Commit:** `3841202` - All 5 tabs fully interactive for demo

| Tab | Status | What Works |
|-----|--------|------------|
| Accueil | ✅ | Category/filter chips, restaurant cards, URL param filtering |
| Parcourir | ✅ | Collections → filtered home, Categories → filtered home |
| Fidélité | ✅ | Retirer/Historique buttons, referral share |
| Panier | ✅ | Full checkout flow in demo mode |
| Compte | ✅ | Favorites menu, Settings/Notifications/Logout buttons |

**Key Pattern (DO NOT REGRESS):**
- `browse.tsx` navigates with `router.push({ pathname: '/', params: { category/collection } })`
- `index.tsx` reads params with `useLocalSearchParams()` and applies via `useEffect`

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
- [x] Task 2.1: Update payment.tsx to use real Stripe Payment Sheet
  - ✅ Added useEffect to fetch real payment methods from backend
  - ✅ Falls back gracefully to mock methods if backend unavailable
  - ✅ Shows loading state while fetching
  - ✅ Updated to use dynamic paymentMethods array
  - Status: COMPLETE (ready for real Stripe when client configures keys)

- [x] Task 2.2: Update review.tsx to call backend orders endpoint
  - ✅ Replaced mock 1500ms delay with real `POST /api/orders` call
  - ✅ Validates checkout state before submitting
  - ✅ Maps cart items to API schema (menu_item_id, unit_price, etc.)
  - ✅ Passes delivery address with full coordinates
  - ✅ Includes auth header with Bearer token (placeholder)
  - ✅ Handles API errors and displays to user
  - Status: COMPLETE

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
