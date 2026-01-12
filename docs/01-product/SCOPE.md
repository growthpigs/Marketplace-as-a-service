# TurkEats - Scope Document

**Project:** TurkEats (Marketplace-as-a-Service)
**Created:** 2026-01-12
**Status:** Phase A - Intake

---

## Scope Summary

| Category | In Scope | Out of Scope |
|----------|----------|--------------|
| Platform | Android app (primary), Web (later) | iOS (phase 2) |
| Geography | France | Other countries (phase 3) |
| Cuisine | Turkish/Kebab | Other cuisines |
| Delivery | Restaurant self-delivery + courier partners | Own fleet |

---

## MVP Scope (Phase 1)

### Client App Features

| Feature | Priority | Notes |
|---------|----------|-------|
| Geolocation restaurant search | P0 | Core functionality |
| Category filtering | P0 | Assiette Grec, Sandwich, Soup, etc. |
| Restaurant detail view | P0 | Menu, hours, ratings |
| Individual ordering | P0 | Standard cart/checkout |
| Group ordering | P0 | Critical for viral model |
| Cashback wallet | P0 | 10% back on purchases |
| Cash withdrawal | P1 | Differentiator |
| QR code affiliate referral | P1 | Viral growth engine |
| Order tracking | P0 | Real-time status |
| Scheduled orders | P2 | Nice to have for MVP |

### Restaurant Dashboard Features

| Feature | Priority | Notes |
|---------|----------|-------|
| Order notifications | P0 | Push + sound alerts |
| Order management | P0 | Accept/reject/complete |
| Menu management | P0 | Items, prices, availability |
| Basic analytics | P1 | Sales, orders, ratings |
| Coupon creation | P2 | Self-managed promos |
| BOGO deals | P2 | Buy One Get One |

### Admin Features (Internal)

| Feature | Priority | Notes |
|---------|----------|-------|
| Restaurant onboarding | P0 | Approve/reject apps |
| User management | P1 | Support tools |
| Revenue reporting | P0 | Commission tracking |
| Payout management | P0 | Restaurant payments |

---

## Explicitly Out of Scope (MVP)

1. **Own delivery fleet** - Use restaurant self-delivery or partners
2. **iOS app** - Android first (target market)
3. **Multiple cuisines** - Turkish only for focus
4. **Loyalty programs beyond cashback** - Keep simple
5. **Restaurant POS integration** - Manual order management first
6. **Multi-language** - French only initially

---

## Technical Boundaries

### What We're Copying (Uber Eats patterns)
- Search/filter UI structure
- Restaurant detail page layout
- Menu/item selection flow
- Cart & checkout experience
- Order tracking UI
- Rating/review system

### Custom Development Required
- Cashback wallet system
- Cash withdrawal functionality
- QR code affiliate tracking
- Lifetime commission calculations
- Revenue share calculations (Stéphane)

---

## Phased Rollout

```
Phase 1 (MVP)     → Core ordering + cashback + affiliate
Phase 2 (Growth)  → iOS, advanced promos, analytics
Phase 3 (Scale)   → Geographic expansion, multi-cuisine
```

---

## Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| Restaurant partnerships | Daniel/Stéphane | Not started |
| Payment provider (Stripe) | Roderic | TBD |
| Courier partnership | Daniel | TBD |
| App store accounts | Roderic | TBD |

---

## Related Documents

- [VISION.md](VISION.md) - Product vision
- [MVP-PRD.md](MVP-PRD.md) - Detailed requirements
- [../04-technical/TECH-STACK.md](../04-technical/TECH-STACK.md) - Technical decisions
