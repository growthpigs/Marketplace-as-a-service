# User Stories

**Project:** TurkEats
**Created:** 2026-01-12
**Status:** Draft - extracted from MVP-PRD

---

## Epic 1: Customer Registration & Discovery

### US-001: Register Account
As a customer
I want to create an account
So that I can order food and earn cashback

**Acceptance Criteria:**
- [ ] Can register with email/phone
- [ ] Email/SMS verification required
- [ ] Referral code optional at signup
- [ ] Auto-generate unique referral code for user

**Priority:** P0

### US-002: Find Restaurants
As a customer
I want to search restaurants near me
So that I can find food to order

**Acceptance Criteria:**
- [ ] Shows restaurants within 5km by default
- [ ] Can filter by category (Assiette, Sandwich, etc.)
- [ ] Can sort by distance, rating, delivery time
- [ ] Shows estimated delivery time

**Priority:** P0

---

## Epic 2: Ordering

### US-003: Place Individual Order
As a customer
I want to add items to cart and checkout
So that I can receive food at my location

**Acceptance Criteria:**
- [ ] Can browse menu with photos
- [ ] Can customize items (options, notes)
- [ ] Shows order total with fee breakdown
- [ ] Can pay via card (Stripe)

**Priority:** P0

### US-004: Create Group Order
As a customer
I want to create a group order
So my friends can add items to one delivery

**Acceptance Criteria:**
- [ ] Generate shareable link/QR
- [ ] Friends can add their items
- [ ] Each person pays their portion
- [ ] Single delivery, all earn cashback

**Priority:** P0

---

## Epic 3: Rewards

### US-005: Earn Cashback
As a customer
I want to earn cashback on orders
So that I save money

**Acceptance Criteria:**
- [ ] 10% cashback on order subtotal
- [ ] Credited after delivery complete
- [ ] Can use on any restaurant

**Priority:** P0

### US-006: Withdraw Cash
As a customer
I want to withdraw wallet balance
So that I can get real money

**Acceptance Criteria:**
- [ ] Minimum withdrawal €10
- [ ] Bank transfer within 3 days
- [ ] See withdrawal history

**Priority:** P1

---

## Epic 4: Referrals

### US-007: Refer Friends
As a customer
I want to refer friends via QR code
So that I earn commission

**Acceptance Criteria:**
- [ ] Generate personal QR code
- [ ] Track referred users
- [ ] Choose one-time (40%) or lifetime (10%)
- [ ] See earnings dashboard

**Priority:** P1

---

## Epic 5: Restaurant Management

### US-008: Receive Orders
As a restaurant owner
I want to receive order notifications
So that I can prepare food promptly

**Acceptance Criteria:**
- [ ] Push notification on new order
- [ ] Audio alert option
- [ ] Accept/reject within 5 mins
- [ ] Update order status

**Priority:** P0

### US-009: Manage Menu
As a restaurant owner
I want to manage my menu
So that customers see accurate offerings

**Acceptance Criteria:**
- [ ] Add/edit/remove items
- [ ] Set prices and descriptions
- [ ] Upload photos
- [ ] Mark items unavailable

**Priority:** P0

---

## Story Status

| ID | Title | Priority | Status |
|----|-------|----------|--------|
| US-001 | Register Account | P0 | Not Started |
| US-002 | Find Restaurants | P0 | Not Started |
| US-003 | Place Order | P0 | Not Started |
| US-004 | Group Order | P0 | Not Started |
| US-005 | Earn Cashback | P0 | Not Started |
| US-006 | Withdraw Cash | P1 | Not Started |
| US-007 | Refer Friends | P1 | Not Started |
| US-008 | Receive Orders | P0 | Not Started |
| US-009 | Manage Menu | P0 | Not Started |

---

## Related Documents

- [ACCEPTANCE-CRITERIA.md](ACCEPTANCE-CRITERIA.md)
- [FSD.md](FSD.md)
- [../01-product/MVP-PRD.md](../01-product/MVP-PRD.md)
