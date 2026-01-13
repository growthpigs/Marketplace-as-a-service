# Active Tasks - TurkEats

**Updated:** 2026-01-13
**Focus:** F005 - Payment Processing Implementation

---

## Current Phase

**F005 - Payment Processing** - In Progress (Living Document: [`features/F005-payments.md`](../features/F005-payments.md))

**Current State:** Frontend payment UI mocked (100% fake). Backend orders endpoint missing.

**Goal:** Implement real Stripe Payment Sheet integration + backend payment processing.

---

## Implementation Roadmap

### Phase 1: Backend Orders Service (1.5 DU)
- [ ] Task 1.1: Create orders database schema
- [ ] Task 1.2: Create POST /api/orders endpoint
- [ ] Task 1.3: Integrate Stripe payment setup in orders endpoint

**Estimated:** 2-3 hours

### Phase 2: Frontend Stripe Integration (1.5 DU)
- [ ] Task 2.1: Update payment.tsx to use real Stripe Payment Sheet
- [ ] Task 2.2: Update review.tsx to call backend orders endpoint
- [ ] Task 2.3: Implement payment processing after order creation

**Estimated:** 2-3 hours

### Phase 3: Wallet Integration (0.5 DU)
- [ ] Task 3.1: Add wallet balance to payment options

**Estimated:** 1 hour

### Phase 4: Testing & Cleanup (1 DU)
- [ ] Task 4.1: End-to-end payment flow test
- [ ] Task 4.2: Error handling and edge cases
- [ ] Task 4.3: Clean up mock code

**Estimated:** 1.5-2 hours

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
