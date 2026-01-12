# TurkEats - Design Research Findings

**Research Date:** 2026-01-12
**Primary Reference:** Uber Eats iOS via Mobbin.com
**Research Goal:** Extract proven UI/UX patterns for food delivery marketplace

---

## 🎯 DESIGN RESEARCH FINDINGS

Based on TurkEats vision ("Uber Eats for kebabs") and target market (French students, Turkish restaurants), analyzed primary competitor patterns.

---

## Primary Reference: Uber Eats iOS

**Link:** [https://mobbin.com/apps/uber-eats-ios-647bbce0-2eac-4b6f-a34b-3753263bf409/87c4d4a5-a9f9-41c2-9631-7b1928459fbf/screens](https://mobbin.com/apps/uber-eats-ios-647bbce0-2eac-4b6f-a34b-3753263bf409/87c4d4a5-a9f9-41c2-9631-7b1928459fbf/screens)

**Why relevant:** Market leader in food delivery, proven patterns at scale, exact same use case

**What to take:**
- **App Structure:** Bottom tab navigation (5 tabs: Home, Browse, Orders, Account, etc.)
- **Brand Identity:** Green primary color for food/freshness association
- **Search Pattern:** Prominent search bar + location selector at top
- **Category Navigation:** Horizontal scrolling icons (Pizza, Sushi, Chinese, Thai, etc.)
- **Restaurant Cards:** Image + rating + delivery time + distance layout
- **Item Customization:** Clean option selection with price updates
- **Cart Management:** Sticky "View basket" button with item count
- **Order Flow:** Address → Payment → Confirmation pattern

---

## Key UI Patterns Identified

For food delivery marketplace, these patterns work exceptionally well:

| Pattern | Example from Uber Eats | Why It Fits TurkEats |
|---------|------------------------|---------------------|
| **Location-First Home** | Address dropdown + search bar | Critical for delivery radius matching |
| **Category Icons** | Pizza/Sushi/Chinese horizontal scroll | Perfect for Turkish categories (Assiette/Sandwich/Soup) |
| **Restaurant Grid** | Card with image/rating/time | Proven conversion pattern |
| **Featured Sections** | "Featured on Uber Eats" carousel | Great for promoting Turkish restaurants |
| **Item Options UI** | Size/extras with price modifiers | Essential for kebab customization (sauce, extras) |
| **Group Ordering Indicator** | "Group order" button on restaurant page | TurkEats differentiator - make prominent |
| **Real-time Tracking** | Map + status timeline | Standard expectation |
| **Delivery Options** | Priority vs Standard with pricing | Can adapt for cashback messaging |

---

## Visual Style Observations

From Uber Eats analysis:

### Color Strategy
- **Primary Green** (#00B04F) - Food, freshness, go/success
- **Supporting Orange** - Promotions, highlights, CTAs
- **Clean whites/grays** - Content, backgrounds, text hierarchy

### Typography
- **Bold headers** for restaurant names, section titles
- **Regular body** for descriptions, details
- **Price emphasis** with different weight/color

### Layout Principles
- **Card-based design** for scannable content
- **Generous white space** for mobile readability
- **Sticky elements** for cart, search bar
- **Progressive disclosure** - more details on tap

---

## TurkEats Adaptations

### 1. Brand Color Adaptation
- **Primary:** Keep green (food association) but use Turkish-inspired shade
- **Secondary:** Warm red/orange (Turkish flag colors)
- **Accent:** Gold for premium feel (Turkish aesthetic)

### 2. Category Customization
Replace Uber Eats categories with Turkish-specific:
```
Pizza → Assiette Kebab
Sushi → Döner
Chinese → Lahmacun
Thai → Pide
Italian → Börek
Burgers → Sandwich Kebab
```

### 3. Cashback Integration
- **Prominent wallet icon** in top bar (like Uber Cash)
- **"Earn 10% back" badges** on restaurant cards
- **Cashback summary** in checkout flow
- **Withdrawal CTA** in profile/wallet section

### 4. Group Ordering Enhancement
- **Make group ordering more prominent** than Uber Eats
- **QR code sharing pattern** for viral growth
- **Split payment visualization**

### 5. Turkish Restaurant Optimization
- **"New Turkish Restaurant"** badges
- **Turkish language menu support** (secondary)
- **Halal indicators** where relevant

---

## Component Mapping

| TurkEats Feature | Uber Eats Reference | Adaptation Notes |
|------------------|---------------------|------------------|
| F001 Auth | Phone number entry screens | Copy exact pattern - works globally |
| F002 Discovery | Home screen + search | Replace categories, add Turkish filters |
| F003 Menu | Restaurant detail + menu | Add kebab-specific options (sauce types) |
| F004 Ordering | Cart + checkout flow | Add wallet balance integration |
| F005 Payments | Payment methods | Emphasize wallet option |
| F006 Tracking | Order status + map | Copy exactly - proven pattern |
| F007 Wallet | Uber Cash equivalent | Make more prominent, add withdrawal |
| F008 Group Orders | Basic group order flow | Enhance with QR codes, better UX |
| F011 Restaurant Dashboard | Not shown (restaurant-side) | Need separate research |

---

## Next Steps

### Immediate Actions:
1. **Create design system** based on Uber Eats foundation
2. **Turkish color palette** (green + red/gold)
3. **Category icon set** for Turkish food types
4. **Cashback UI components** (badges, wallet, etc.)

### Design System Foundation:
```
Colors:
- Primary Green: #00A651 (Turkish-inspired)
- Secondary Red: #E30613 (Turkish flag)
- Accent Gold: #FFD700 (premium)
- Grays: #F8F8F8, #E5E5E5, #666666

Typography:
- Headers: SF Pro Display Bold
- Body: SF Pro Text Regular
- Price: SF Pro Text Semibold

Spacing:
- 8px grid system
- 16px card padding
- 24px section margins
```

---

## Clickable References

All patterns documented above are from:

**Primary Source:** [Uber Eats iOS Screens on Mobbin](https://mobbin.com/apps/uber-eats-ios-647bbce0-2eac-4b6f-a34b-3753263bf409/87c4d4a5-a9f9-41c2-9631-7b1928459fbf/screens)

**Specific flows captured:**
- Onboarding + Splash screens
- Home/Discovery patterns
- Restaurant detail + menu browsing
- Item customization + cart
- Checkout + payment flow
- Order tracking + maps
- Authentication (phone entry)

---

✅ **RESEARCH COMPLETE**

## Summary
- **90-95% copy Uber Eats patterns** (per project vision)
- **Turkish visual identity** (colors, categories, language)
- **Cashback prominence** (wallet integration)
- **Group ordering enhancement** (viral mechanics)

**Ready for:** C-2 Creative Direction → Design System Creation

🚀 **Fast Track Option:** Use these findings to create design system in Figma or proceed to implementation with design tokens.