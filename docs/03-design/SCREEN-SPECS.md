# Screen Specifications

**Project:** TurkEats
**Created:** 2026-01-12
**Status:** Skeleton - Needs design work

---

## Screen Inventory

| Screen | Purpose | Priority |
|--------|---------|----------|
| Splash | App loading | P0 |
| Login/Register | Authentication | P0 |
| Home | Restaurant discovery | P0 |
| Restaurant Detail | Menu viewing | P0 |
| Cart | Order review | P0 |
| Checkout | Payment | P0 |
| Order Tracking | Live status | P0 |
| Wallet | Cashback balance | P0 |
| Referral | Share & earn | P1 |
| Profile | Account settings | P1 |
| Group Order | Shared ordering | P0 |

---

## Screen: Home

### Purpose
Main screen - discover restaurants

### Components
- Search bar (top)
- Category carousel (horizontal scroll)
- Restaurant cards (vertical list)
- Bottom navigation

### User Actions
- Search by name
- Filter by category
- Tap restaurant to view
- Pull to refresh

### Data Displayed
- Restaurant name, image, rating
- Estimated delivery time
- Minimum order, delivery fee
- Distance

### Navigation
- From: Splash (after login)
- To: Restaurant Detail, Search, Profile

---

## Screen: Restaurant Detail

### Purpose
View menu, add items to cart

### Components
- Hero image
- Restaurant info (name, rating, time)
- Menu categories (sticky tabs)
- Menu items (cards)
- Floating cart button

### User Actions
- Scroll menu
- Tap category to jump
- Add item to cart
- View cart

### Data Displayed
- Menu items with photos, prices
- Item options (if any)
- Cart total (floating)

---

## Screen: Wallet

### Purpose
View cashback balance, transactions

### Components
- Balance display (large)
- Action buttons (Withdraw, Add)
- Transaction list
- Pending cashback section

### User Actions
- Tap Withdraw
- View transaction details
- See pending cashback

### Data Displayed
- Current balance
- Pending amount
- Transaction history

---

## Related Documents

- [DESIGN-BRIEF.md](DESIGN-BRIEF.md) - Design guidelines
- [../02-specs/USER-STORIES.md](../02-specs/USER-STORIES.md) - User requirements
