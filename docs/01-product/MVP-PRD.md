# TurkEats - MVP Product Requirements Document

**Project:** TurkEats (Marketplace-as-a-Service)
**Version:** 0.1
**Created:** 2026-01-12
**Status:** Draft

---

## Executive Summary

Build a food delivery marketplace for Turkish restaurants in France with:
- **Core:** Browse restaurants, order food, track delivery
- **Viral mechanics:** 10% cashback + affiliate referral system
- **Differentiation:** Cash withdrawal from wallet

Target: 50 restaurants, 500 MAU in first 3 months.

---

## Business Model

### Revenue Streams

| Stream | Rate | Paid By |
|--------|------|---------|
| Transaction commission | 5% | Restaurant |
| Service fee | 2% | Customer |
| Monthly subscription | TBD | Restaurant |
| (Cost) Affiliate payout | 10% of order | Platform margin |

### Unit Economics (Per €10 Order)

```
Customer pays:     €10.20 (€10 order + €0.20 service fee)
Restaurant gets:   €9.50  (€10 - 5% commission)
Platform revenue:  €0.70  (€0.50 commission + €0.20 fee)
Cashback cost:     €0.50-€1.00 (5-10% to customer wallet)
```

---

## User Stories (MVP)

### Customer App

#### US-C1: Restaurant Discovery
```
As a customer
I want to find Turkish restaurants near me
So I can order food for delivery

Acceptance Criteria:
- Show restaurants within X km radius
- Filter by category (Assiette, Sandwich, Soup, etc.)
- Sort by: Rating, Distance, Delivery time
- Show estimated delivery time
- Show minimum order amount
```

#### US-C2: Place Order
```
As a customer
I want to add items to cart and checkout
So I can receive food at my location

Acceptance Criteria:
- View restaurant menu with photos, descriptions, prices
- Add/remove items from cart
- Add delivery address
- See order total with fees breakdown
- Pay via card (Stripe)
- Receive order confirmation
```

#### US-C3: Group Ordering
```
As a customer
I want to create a group order
So my friends can add their items to one delivery

Acceptance Criteria:
- Generate shareable order link/QR code
- Friends can add items to shared cart
- Each person pays for their portion
- Single delivery to one address
- All participants earn cashback
```

#### US-C4: Cashback & Wallet
```
As a customer
I want to see my cashback balance
So I can use it on future orders or withdraw

Acceptance Criteria:
- View wallet balance
- See cashback earned per order (10%)
- Apply wallet balance to new orders
- Request cash withdrawal (bank transfer)
- View transaction history
```

#### US-C5: Affiliate Referral
```
As a customer
I want to refer friends and earn commission
So I can make money from my network

Acceptance Criteria:
- Generate personal referral QR code
- Track referred users
- Choose: 40% one-time or lifetime % commission
- View earnings and payout history
```

#### US-C6: Order Tracking
```
As a customer
I want to track my order status
So I know when food will arrive

Acceptance Criteria:
- Real-time status updates
- Estimated arrival time
- Driver location (if available)
- Contact restaurant/driver option
```

### Restaurant Dashboard

#### US-R1: Receive Orders
```
As a restaurant owner
I want to receive order notifications
So I can prepare food promptly

Acceptance Criteria:
- Push notification for new orders
- Audio alert option
- See order details (items, address, notes)
- Accept/reject order
- Mark as preparing/ready/delivered
```

#### US-R2: Menu Management
```
As a restaurant owner
I want to manage my menu
So customers see accurate offerings

Acceptance Criteria:
- Add/edit/remove menu items
- Set prices and descriptions
- Upload item photos
- Mark items as unavailable
- Set opening hours
```

#### US-R3: View Analytics
```
As a restaurant owner
I want to see my sales data
So I can understand my performance

Acceptance Criteria:
- Daily/weekly/monthly sales
- Order count
- Average order value
- Customer ratings
```

---

## Data Model (High Level)

```
Users
├── id, email, phone, name
├── wallet_balance
├── referral_code
└── referred_by

Restaurants
├── id, name, address, location
├── category, cuisine_type
├── commission_rate
└── status (active/pending/suspended)

Orders
├── id, user_id, restaurant_id
├── items[], total, fees
├── status, delivery_address
├── group_order_id (nullable)
└── cashback_earned

Wallet_Transactions
├── id, user_id, type
├── amount, order_id
└── status (pending/completed)

Referrals
├── referrer_id, referred_id
├── commission_type (one-time/lifetime)
└── total_earned
```

---

## Technical Requirements

### Platform
- **Primary:** Android (React Native or Flutter)
- **Secondary:** Web admin dashboard
- **Future:** iOS

### Backend
- RESTful API
- Real-time updates (WebSocket for order tracking)
- PostgreSQL database

### Integrations
| Integration | Purpose |
|-------------|---------|
| Stripe Connect | Payments, restaurant payouts |
| Google Maps | Location, addresses |
| Firebase | Push notifications |
| Twilio | SMS verification |

---

## Success Metrics (MVP)

| Metric | Target |
|--------|--------|
| Time to first order | < 3 minutes |
| App crash rate | < 1% |
| Order completion rate | > 95% |
| Customer satisfaction | > 4.0/5 |
| Restaurant onboarding time | < 24 hours |

---

## Open Questions

1. **App name** - TurkEats is placeholder
2. **Subscription tiers** - Pricing for restaurant plans?
3. **Daniel's existing backend** - Evaluate PHP/WordPress system
4. **Delivery partner** - Which courier service to integrate?

---

## Related Documents

- [VISION.md](VISION.md) - Product vision
- [SCOPE.md](SCOPE.md) - Feature scope
- [../02-specs/USER-STORIES.md](../02-specs/USER-STORIES.md) - Detailed user stories
- [../04-technical/DATA-MODEL.md](../04-technical/DATA-MODEL.md) - Database schema
- [../04-technical/API-CONTRACTS.md](../04-technical/API-CONTRACTS.md) - API specs
