# Design Brief

**Project:** TurkEats
**Created:** 2026-01-12
**Status:** Skeleton - Needs design work

---

## Design Goals

1. **Familiar** - Copy Uber Eats patterns (90-95%)
2. **Fast** - Optimized for quick ordering
3. **Trust** - Community-focused, local feel
4. **Rewarding** - Cashback/earnings always visible

---

## Target Users

- **Primary:** Students (18-25) in France
- **Secondary:** Turkish community members
- **Device:** iOS first (design), Android primary (deployment)

---

## Brand Guidelines

### Colors
- Primary: TBD (suggest warm colors - orange/red tones)
- Secondary: TBD
- Accent: Gold/Yellow (for rewards/cashback)

### Typography
- Headings: TBD
- Body: TBD
- Numbers: Clear, easy to read (prices, balances)

### Tone
- Friendly, community-focused
- Simple, not corporate
- Rewarding, celebratory

---

## Design Inspiration

| Reference | What to Take |
|-----------|--------------|
| Uber Eats | Search, restaurant list, checkout flow |
| Deliveroo | Card-based design, category carousel |
| Cash App | Wallet UI, clean transaction history |
| Referral apps | QR code sharing, earnings display |

---

## ⚠️ MANDATORY: UberEats Design Research Process

**Before ANY design work, complete this research:**

### Step 1: Screenshot Capture
Use `mcp__chi-gateway__browser_screenshot` to capture:
- [ ] Home/discovery screen
- [ ] Restaurant detail page
- [ ] Menu item view
- [ ] Cart screen
- [ ] Checkout flow (each step)
- [ ] Order tracking screen
- [ ] Account/profile screen

### Step 2: Pattern Documentation
For each screen, document:
- Layout structure (header, body, footer)
- Navigation patterns
- Component types (cards, lists, buttons)
- Spacing and sizing patterns
- Color usage patterns

### Step 3: Adaptation Notes
Document what we:
- **Copy exactly** (proven UX patterns)
- **Adapt** (brand, colors, typography)
- **Add** (cashback wallet, affiliate, group orders)
- **Remove** (features we don't need)

**Store research in:** `docs/03-design/research/ubereats-analysis.md`

---

## Constraints

- iOS-first for design (Human Interface Guidelines), Android for deployment
- Must work on budget Android devices
- French language (LTR)
- Optimize for one-handed use

---

## Key Screens (Priority Order)

1. Home/Restaurant List
2. Restaurant Detail + Menu
3. Cart + Checkout
4. Order Tracking
5. Wallet/Cashback
6. Referral/Affiliate
7. Profile/Settings

---

---

## ⚠️ MANDATORY: ASCII Wireframes

**Every screen MUST have an ASCII wireframe before implementation.**

ASCII wireframes serve as:
1. Quick visual reference for developers
2. Layout blueprint without design tools
3. Stakeholder alignment check

See [SCREEN-SPECS.md](SCREEN-SPECS.md) for ASCII wireframe templates.

---

## Related Documents

- [SCREEN-SPECS.md](SCREEN-SPECS.md) - Screen specifications with ASCII wireframes
- [../02-specs/USER-STORIES.md](../02-specs/USER-STORIES.md) - User stories
- [research/ubereats-analysis.md](research/ubereats-analysis.md) - UberEats design research
