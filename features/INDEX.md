# TurkEats - Features Index

**Project:** TurkEats (Marketplace-as-a-Service)
**Created:** 2026-01-12

---

## Feature Catalog

| ID | Feature | Priority | Status | Spec | DU |
|----|---------|----------|--------|------|-----|
| F001 | Customer Registration & Auth | P0 | **Spec Complete** | [F001-auth.md](F001-auth.md) | 3 |
| F002 | Restaurant Discovery | P0 | **UI Implemented** | [F002-discovery.md](F002-discovery.md) | 4 |
| F003 | Menu Browsing | P0 | **Spec Complete** | [F003-menu.md](F003-menu.md) | 3 |
| F004 | Order Placement | P0 | **UI Implemented** | [F004-ordering.md](F004-ordering.md) | 4 |
| F005 | Payment Processing | P0 | **In Progress** | [F005-payments.md](F005-payments.md) | 5 |
| F006 | Order Tracking | P0 | **Spec Complete** | [F006-tracking.md](F006-tracking.md) | 3 |
| F007 | Cashback Wallet | P0 | **UI Implemented** | [F007-wallet.md](F007-wallet.md) | 4 |
| F008 | Group Ordering | P0 | **Spec Complete** | [F008-group-orders.md](F008-group-orders.md) | 5 |
| F009 | Affiliate Referrals | P1 | **UI Implemented** | [F007-wallet.md](F007-wallet.md) | TBD |
| F010 | Cash Withdrawal | P1 | **UI Implemented** | [F007-wallet.md](F007-wallet.md) | TBD |
| F011 | Restaurant Dashboard | P0 | **Spec Complete** | [F011-restaurant-dashboard.md](F011-restaurant-dashboard.md) | 5 |
| F012 | Admin Dashboard | P1 | Not Started | [F012-admin.md](F012-admin.md) | TBD |
| F013 | Ratings & Reviews | P1 | Not Started | [F013-reviews.md](F013-reviews.md) | TBD |
| F014 | Push Notifications | P1 | Not Started | [F014-notifications.md](F014-notifications.md) | TBD |
| F015 | Restaurant Promotions | P2 | Not Started | [F015-promotions.md](F015-promotions.md) | TBD |

**MVP Total: 36 DU** (9 features)

---

## MVP Features (Phase 1)

### Customer App
- [x] F001 - Authentication
- [x] F002 - Restaurant Discovery
- [x] F003 - Menu Browsing
- [x] F004 - Order Placement
- [x] F005 - Payment Processing
- [x] F006 - Order Tracking
- [x] F007 - Cashback Wallet
- [x] F008 - Group Ordering

### Restaurant
- [x] F011 - Restaurant Dashboard

---

## Phase 2 Features

- [ ] F009 - Affiliate Referrals (full)
- [ ] F010 - Cash Withdrawal
- [ ] F012 - Admin Dashboard (full)
- [ ] F013 - Ratings & Reviews
- [ ] F014 - Push Notifications
- [ ] F015 - Restaurant Promotions

---

## Feature Spec Template

When creating new feature specs, use this template:

```markdown
# Feature Name

**ID:** F0XX
**Priority:** P0/P1/P2
**Status:** Not Started / In Progress / Complete

## Overview
Brief description of the feature.

## User Stories
- As a [role], I want to [action] so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Technical Notes
Implementation considerations.

## Dependencies
- Other features or systems required

## Open Questions
- Questions to resolve
```

---

## Related Documents

- [../docs/01-product/MVP-PRD.md](../docs/01-product/MVP-PRD.md) - Product requirements
- [../docs/01-product/SCOPE.md](../docs/01-product/SCOPE.md) - Feature scope
