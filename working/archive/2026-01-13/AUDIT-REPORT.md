# 🔴 CRITICAL AUDIT REPORT - Payment Flow Implementation

**Date:** 2026-01-13
**Session:** Payment Processing Implementation (F005)
**Status:** ⚠️ **BLOCKERS IDENTIFIED - DO NOT DEPLOY TO PRODUCTION**

---

## Executive Summary

The payment flow implementation has **7 critical issues** that must be fixed before any real payments are processed. These are NOT MVP limitations—they are security vulnerabilities and data integrity flaws that could cause financial loss or fraud.

**Confidence Level:** 85-100% on all critical issues
**Risk Level:** 🔴 **CRITICAL**
**Recommendation:** Fix all 7 blockers before Phase 2.3 implementation

---

## Critical Issues (Must Fix)

### 🔴 Issue #1: Wallet Balance Bypass (Security Vulnerability)

**Severity:** CRITICAL - Allows fraud
**Location:** `apps/api/src/orders/orders.service.ts:121-125`
**Confidence:** 95%

**What's Wrong:**
Client sends `wallet_amount_to_apply: 1000` and the backend accepts it without checking if the user actually has €1000 in their wallet.

```typescript
const walletAmountToApply = request.wallet_amount_to_apply || 0;
const walletCreditUsed = Math.min(
  walletAmountToApply,
  subtotal + deliveryFee,  // Only validates against order total, not wallet balance!
);
```

**Attack Scenario:**
1. User has €5 in wallet
2. User places €50 order, claims `wallet_amount_to_apply: 50`
3. Backend reduces order total to €0
4. User gets free meal

**Fix:** Query user's actual wallet balance from database before accepting amount.

---

### 🔴 Issue #2: Race Condition - Orphaned Orders (Data Integrity)

**Severity:** CRITICAL - Data corruption
**Location:** `apps/api/src/orders/orders.service.ts:133-231`
**Confidence:** 85%

**What's Wrong:**
Order is created in database BEFORE Stripe payment setup. If Stripe fails:
- Order exists with `payment_status: 'pending'`
- No `stripe_payment_intent_id` stored
- Order can never be completed
- Database is polluted with broken records

**Flow:**
```
1. Create order in DB (lines 133-152)  ✅ Success
2. Create order_items (lines 176-183)  ✅ Success
3. Create Stripe PaymentIntent (208)    ❌ FAILS - network error
→ Order now orphaned with no payment intent
```

**Impact:** Broken orders accumulate, metrics are wrong, users can't complete purchases.

**Fix:** Wrap entire operation in transaction OR reverse order: create PaymentIntent first, then order.

---

### 🔴 Issue #3: Missing Input Validation (Business Logic)

**Severity:** CRITICAL - Price manipulation
**Location:** `apps/api/src/orders/orders.service.ts:99-103`
**Confidence:** 90%

**What's Wrong:**
Items from client are used directly in price calculations without validation:

```typescript
const subtotal = request.items.reduce((sum, item) => {
  return (
    sum + (item.unit_price + (item.options_price || 0)) * item.quantity
  );
}, 0);
```

**Missing Validations:**
- `quantity ≤ 0` (could be -1, -100)
- `unit_price < 0` (negative prices)
- `options_price < 0` (negative add-ons)
- Items don't exist in menu
- Client sends wrong prices for menu items (€1 instead of €15)

**Attack Scenario:**
Client sends: `{ menu_item_id: 1, unit_price: -10, quantity: 1 }`
→ Subtotal is negative
→ Backend pays user money

**Fix:** Fetch real prices from `menu_items` table, validate each item against database, reject if mismatch.

---

### 🔴 Issue #4: Cashback Calculated But Never Credited (Business Logic)

**Severity:** CRITICAL - Unkept promises
**Location:** `apps/api/src/orders/orders.service.ts:115-118`
**Confidence:** 100%

**What's Wrong:**
Cashback is calculated and stored in order:

```typescript
const cashbackAmount = Math.round(subtotal * (cashbackRate / 100) * 100) / 100;
// Stored in database:
cashback_amount: cashbackAmount,
```

But there's **no code that credits it to user's wallet**.

**Impact:**
- Marketing promise: "Get 10% cashback on every order!"
- Reality: Cashback sits in database forever
- Users see balance never increases
- Massive customer support complaints

**Fix:** Add webhook handler that credits cashback when order status becomes `'delivered'`.

---

### 🔴 Issue #5: Wrong Commission Calculation (Math Error)

**Severity:** CRITICAL - Financial loss
**Location:** `apps/api/src/lib/stripe.ts:47, 66`
**Confidence:** 95%

**What's Wrong:**
Commission is calculated as 5% of **total amount including fees**, not just the food order:

```typescript
const amountCents = Math.round(total * 100);  // Includes delivery + service fee
const platformFeeCents = Math.round(amountCents * 0.05);  // 5% of EVERYTHING
```

**Example:**
- Food order: €20
- Service fee: €0.40 (2%)
- Delivery fee: €2
- **Total: €22.40**
- Commission charged: €1.12 (5% of €22.40)
- **Should be:** €1.00 (5% of €20)
- **Difference: Platform loses €0.12 per order**

At scale: 1000 orders/month × €0.12 = €120/month in lost revenue

**Business Rules:**
> "5% platform commission on order subtotal only"

**Fix:** Pass `orderSubtotal` separately to Stripe service, calculate commission on that, not total.

---

### 🔴 Issue #6: No Authorization Validation (Security)

**Severity:** CRITICAL - User impersonation
**Location:** `apps/mobile/app/checkout/review.tsx:125`, `apps/mobile/app/checkout/payment.tsx:70`
**Confidence:** 100%

**What's Wrong:**
Frontend uses mock auth token:

```typescript
const mockAuthToken = 'mock-jwt-token-placeholder';
```

Backend extracts `userId` from this token but **doesn't verify the token matches the user**:

```typescript
const user = await supabaseService.verifyUser(mockAuthToken);  // Returns any user
// No check that token actually contains this userId!
```

**Attack Scenario:**
1. User A creates order with their address
2. User A intercepts network request, changes `userId` in request body to "user-B-id"
3. Backend creates order for User B at User A's address
4. User B's account is charged

**Fix:** Extract `userId` from JWT token itself, reject requests where `userId` in body ≠ `userId` in token.

---

### 🔴 Issue #7: No Transaction Rollback (Data Consistency)

**Severity:** CRITICAL - Data pollution
**Location:** `apps/api/src/orders/orders.service.ts:220-231`
**Confidence:** 85%

**What's Wrong:**
If Stripe payment setup fails, order is already in database. There's no cleanup:

```typescript
try {
  // ... order already created (lines 133-183)
  const paymentData = await this.stripeService.createPaymentIntent(...);
} catch (stripeError) {
  // Order is stuck in database with payment_status: 'pending'
  // But no stripe_payment_intent_id!
  throw new Error(/* ... */);
}
```

**Impact:**
- Orders accumulate with incomplete data
- Database consistency violated
- Reporting queries return wrong numbers
- Customer support nightmare

**Fix:** Wrap entire operation in transaction, OR implement manual cleanup on Stripe failure.

---

## Medium-Priority Issues

### 🟡 Issue #8: Missing Network Timeout

**Severity:** MEDIUM
**Location:** `apps/mobile/app/checkout/review.tsx:128`, `apps/mobile/app/checkout/payment.tsx:73`

Fetch calls have no timeout. If backend is slow, spinner spins forever.

**Fix:** Add 30-second AbortController timeout.

---

### 🟡 Issue #9: Incomplete Error Handling

**Severity:** MEDIUM
**Location:** `apps/mobile/app/checkout/review.tsx:138-149`

Error response might not be JSON (500 error), causing secondary exception.

**Fix:** Check Content-Type before parsing, or wrap in try-catch.

---

## Testing Conducted

### Test 1: Wallet Balance Bypass
```
Input: wallet_amount_to_apply: 9999 (user has €0)
Expected: Error - insufficient wallet balance
Actual: ❌ FAILS - order created with zero payment due
```

### Test 2: Negative Item Price
```
Input: items[0].unit_price: -50, quantity: 1
Expected: Error - invalid price
Actual: ❌ FAILS - subtotal becomes negative
```

### Test 3: Race Condition
```
Scenario: Stripe API timeout during order creation
Result: ❌ FAILS - order orphaned in DB with no payment intent
```

---

## Impact Assessment

| Issue | Impact | Revenue Risk | Customer Risk |
|-------|--------|--------------|---------------|
| Wallet bypass | Users get free meals | High fraud | Bankruptcy |
| Race condition | Broken orders | Medium | Poor UX |
| Input validation | Price manipulation | High | Fraud |
| Cashback not credited | Unkept promises | Medium | Churn |
| Commission calculation | Lost revenue | Low | - |
| No authorization | Account takeover | High | Fraud |
| No rollback | Data corruption | Low | Data loss |

---

## Recommendations

### Immediate (Before Phase 2.3)
1. ✅ Fix wallet balance verification (CRITICAL)
2. ✅ Add input validation for items/prices (CRITICAL)
3. ✅ Implement transaction handling (CRITICAL)
4. ✅ Fix authorization validation (CRITICAL)
5. ✅ Correct commission calculation (CRITICAL)

### Before Real Payments
6. ✅ Implement cashback webhook (CRITICAL)
7. ✅ Add transaction rollback logic (CRITICAL)

### Before Production
8. ✅ Add network timeout (MEDIUM)
9. ✅ Improve error handling (MEDIUM)

---

## Sign-Off

**Audit Conducted By:** Code Review Agent (Confidence 85-100%)
**Status:** ⚠️ **DO NOT PROCEED** until all 7 critical issues are resolved
**Next Step:** Fix blockers, then re-audit before Phase 2.3

