# Functional Specification Document (FSD)

**Project:** TurkEats
**Version:** 0.1
**Created:** 2026-01-12
**Status:** Draft

---

## 1. Introduction

### 1.1 Purpose
TurkEats is a food delivery marketplace connecting Turkish restaurants in France with customers, featuring cashback rewards and affiliate referrals.

### 1.2 Scope
This FSD covers the MVP: customer app, restaurant dashboard, admin functions.

### 1.3 Definitions
| Term | Definition |
|------|------------|
| Cashback | 10% of order value returned to customer wallet |
| Affiliate | User who refers others and earns commission |
| Group Order | Multiple users ordering together for single delivery |

---

## 2. Overall Description

### 2.1 Product Perspective
Standalone marketplace platform - "Uber Eats for Turkish food"

### 2.2 User Classes
| User Type | Description | Key Needs |
|-----------|-------------|-----------|
| Customer | Orders food via app | Find food, earn rewards |
| Restaurant | Receives and fulfills orders | Manage orders, menu |
| Affiliate | Refers users, earns commission | Track referrals, earnings |
| Admin | Platform management | Onboard restaurants, support |

### 2.3 Operating Environment
- Android 8.0+ (primary)
- Web browsers (restaurant dashboard)
- iOS (future)

### 2.4 Constraints
- France only (MVP)
- Turkish cuisine only (MVP)
- French language (MVP)

---

## 3. Functional Requirements

### 3.1 Customer App

**FR-001:** Location-based restaurant discovery
- Input: GPS location or manual address
- Output: List of restaurants within radius
- Rules: Default 5km, max 15km

**FR-002:** Menu browsing
- Input: Restaurant selection
- Output: Menu categories, items, prices, photos
- Rules: Real-time availability from restaurant

**FR-003:** Order placement
- Input: Cart items, delivery address, payment
- Output: Order confirmation, tracking
- Rules: Minimum order check, delivery fee calculation

**FR-004:** Cashback system
- Input: Completed order
- Output: 10% credited to wallet
- Rules: Credit after delivery confirmed, usable anywhere

**FR-005:** Group ordering
- Input: Host creates, shares link
- Output: Combined order, split payment
- Rules: Expires after 2 hours, host finalizes

**FR-006:** Affiliate referrals
- Input: Referral code/QR scan
- Output: Linked accounts, commission tracking
- Rules: Choose one-time (40%) or lifetime (10%)

### 3.2 Restaurant Dashboard

**FR-007:** Order management
- Input: New order notification
- Output: Accept/reject, status updates
- Rules: 5-minute accept timeout

**FR-008:** Menu management
- Input: Item details, photos
- Output: Live menu on platform
- Rules: Instant availability toggle

**FR-009:** Analytics
- Input: Date range
- Output: Sales, orders, ratings
- Rules: Daily/weekly/monthly views

---

## 4. Use Cases

### UC-001: Customer Orders Food
| Field | Value |
|-------|-------|
| **Actor** | Customer |
| **Preconditions** | Registered, logged in |
| **Main Flow** | 1. Search restaurants 2. Browse menu 3. Add to cart 4. Checkout 5. Pay 6. Track |
| **Postconditions** | Order placed, cashback pending |

### UC-002: Restaurant Fulfills Order
| Field | Value |
|-------|-------|
| **Actor** | Restaurant Owner |
| **Preconditions** | Registered, dashboard open |
| **Main Flow** | 1. Receive notification 2. Accept order 3. Prepare food 4. Mark ready 5. Hand to delivery |
| **Postconditions** | Order completed, payment pending |

---

## 5. Data Requirements

See [../04-technical/DATA-MODEL.md](../04-technical/DATA-MODEL.md) for full schema.

### 5.1 Core Entities
| Entity | Description |
|--------|-------------|
| User | Customer accounts |
| Restaurant | Restaurant profiles |
| Order | Order records |
| Wallet | Cashback balances |
| Referral | Referral relationships |

---

## 6. External Interfaces

### 6.1 User Interfaces
See [../03-design/SCREEN-SPECS.md](../03-design/SCREEN-SPECS.md)

### 6.2 API Interfaces
See [../04-technical/API-CONTRACTS.md](../04-technical/API-CONTRACTS.md)

### 6.3 Third-Party Integrations
| Integration | Purpose |
|-------------|---------|
| Stripe Connect | Payments, payouts |
| Google Maps | Location, geocoding |
| Firebase | Push notifications |
| Twilio | SMS verification |

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Page load < 3s
- Search results < 1s
- Order confirmation < 5s

### 7.2 Security
- HTTPS everywhere
- JWT authentication
- PCI-compliant payments (via Stripe)

### 7.3 Scalability
- Support 10,000 concurrent users
- Handle 1,000 orders/hour peak

---

## Related Documents

- [USER-STORIES.md](USER-STORIES.md)
- [ACCEPTANCE-CRITERIA.md](ACCEPTANCE-CRITERIA.md)
- [../04-technical/ISD.md](../04-technical/ISD.md)
