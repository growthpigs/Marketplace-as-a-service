# TurkEats - Project Brief

**Project Codename:** TurkEats (working title - to be changed)
**Created:** January 11, 2026
**Partners:** 
- Roderic Andrews (Agentic Engineering, Product, Marketing & Design) 
- Daniel (Sales, Business Development, Operations, Finance)
- Stéphane (Market Access - Revenue Share)

---

## Executive Summary

TurkEats is a specialized food delivery marketplace targeting the Turkish/kebab restaurant market in France. Think "Uber Eats but exclusively for kebabs." The platform connects Turkish restaurants with customers through a mobile-first app with built-in viral mechanics (cashback + affiliate system).

**Why specialize?**
- No existing specialized platform for Turkish food
- 35,000 Turkish restaurants in France
- Strong community network = natural viral distribution
- Lower customer acquisition cost through community word-of-mouth

---

## Business Model

### Revenue Streams (Confirmed)

| Stream | Rate | Paid By |
|--------|------|---------|
| Transaction Commission | 5% per order | Restaurant |
| Service Fee | 2% per order | Customer |
| Monthly Subscription | TBD pricing tiers | Restaurant |
| Affiliate Commission to Referrers | 10% of referred orders | Platform margin |

### Unit Economics (Example €10 Order)

```
Customer pays:     €10.20 (€10 order + €0.20 service fee)
Restaurant gets:   €9.50  (€10 - 5% commission)
Platform gets:     €0.70  (€0.50 commission + €0.20 service fee)
Cashback (5-10%):  €0.50-€1.00 back to customer wallet
```

### Delivery Model
- Restaurant self-delivery (like many local kebab shops)
- Partner with couriers (Uber Eats/Deliveroo style) for restaurants without drivers

### The Virtuous Circle

```
Cashback (10%) → User orders more → Group ordering → Viral spread
     ↓
User becomes affiliate → Refers friends → Earns commission
     ↓
More users → More restaurants join → Network effect
```

---

## Core Features (MVP)

### Client App (Android-first)

1. **Search & Discovery**
   - Geolocation-based restaurant search
   - Category carousel: Assiette Grec, Sandwich, Soup, Shish Kebab, etc.
   - Sorting: Recommended, Rating, Earliest Arrival, Nearest

2. **Ordering**
   - Individual orders
   - **Group ordering** (critical for viral model)
   - Schedule orders for later
   - Delivery + Pickup options

3. **Rewards System**
   - 10% cashback on all purchases
   - Cashback can be used across ANY restaurant on platform
   - **Cash withdrawal option** (differentiator from Uber Eats)
   - Wallet with transaction history

4. **Affiliate System**
   - QR code referral
   - Two options: One-time payout (40%) or Lifetime commission (smaller %)
   - Commission on referred users' lifetime purchases

### Restaurant Dashboard

1. **Self-managed promotions**
   - Create/manage coupons
   - BOGO (Buy One Get One) deals
   - Featured placement (paid promotion)

2. **Order Management**
   - Incoming order notifications
   - Order status updates
   - Delivery tracking

3. **Analytics**
   - Sales reports
   - Customer insights
   - Performance metrics

---

## Technical Approach

### Philosophy
- Copy Uber Eats structure 90-95%
- Remove what we don't need (simpler = faster)
- Add custom features sparingly (cashback, affiliate - well-documented patterns)
- AI-assisted development with hardening/QA pipeline

### Stack Considerations
| Component | Approach |
|-----------|----------|
| Mobile | Android-first (student market) |
| Architecture | Standard marketplace patterns |
| Backend | TBD - need to evaluate Daniel's existing PHP work |
| Payments | Stripe or similar with wallet functionality |

### What We're Copying from Uber Eats
- Search/filter UI
- Restaurant detail pages
- Menu/item selection
- Cart & checkout flow
- Order tracking
- Rating system

### Custom Development Needed
- Cashback wallet system
- Cash withdrawal functionality
- QR code affiliate tracking
- Lifetime commission calculations
- Revenue share calculations

---

## Go-to-Market Strategy

### Phase 1: Seed (via Centralized Suppliers)
- Partner with Turkish butchers/suppliers
- They have relationships with ALL kebab shops
- Offer 20% affiliate commission on subscriptions
- "Puce à la base" - commission on each transaction they generate

### Phase 2: Network Effect
- Turkish community spreads word quickly
- Students (primary users) incentivized via cashback
- Group ordering creates viral loops
- Affiliate system rewards power users

### Phase 3: Geographic Expansion
- Start with France
- Expand to other countries with Turkish diaspora

---

## Legal Structure

### Confirmed
1. **Badaboost LLC (Delaware, USA)** - Operating entity
2. **Roderic + Daniel: 50/50 partnership** - MOU in place, formalize in 3-6 months
3. **Stéphane: Revenue share partner** - 5-10% of Turkish market revenue (to be negotiated)

### Role Split
| Partner | Responsibilities |
|---------|-----------------|
| Roderic | Agentic engineering, product management, UI/UX design, marketing & brand |
| Daniel | Sales, business development, operations, finance, legal coordination |
| Stéphane | Turkish market introductions, community relationships (revenue share only) |

### Why US Entity?
- Better credibility for B2B sales
- Lower corporate tax (Texas considered for future)
- Simpler for international expansion

---

## Open Questions

1. ~~**Delivery Model**~~ ✅ Self-delivery + partner couriers
2. ~~**Cashback Rate**~~ ✅ 5-10%
3. ~~**Affiliate Commission**~~ ✅ 10% lifetime
4. ~~**Service Fee**~~ ✅ 2% paid by customer
5. **App Name** - TurkEats is placeholder, need better branding
6. **Subscription Tiers** - Exact pricing for restaurant plans?
7. **Payment Processing** - Which provider? Stripe Connect?
8. **Daniel's Backend** - Evaluate existing PHP/WordPress system

---

## Next Steps

- [ ] Draft MOU for Daniel
- [ ] Draft Revenue Share Agreement for Stéphane  
- [ ] Create UI/UX prototype based on Uber Eats
- [ ] Define exact feature scope for MVP
- [ ] Technical architecture document
- [ ] Set up development environment

---

## Reference

**Competitors/Inspiration:**
- Uber Eats (primary model)
- Deliveroo (design inspiration)
- Alpha/The Warum (Daniel's previous marketplace work)

**Target Market Stats:**
- 35,000 Turkish restaurants in France
- Primary users: Students (price-sensitive, group orders)
- Android-dominant user base
