# TurkEats - Pixel-Perfect Uber Eats Copy Plan

**Branch:** `feature/pixel-perfect-uber-eats-copy`
**Date:** 2026-01-12
**Status:** COPY VERBATIM - Change Content ONLY

---

## 🚨 CRITICAL RULE

**COPY UBER EATS PIXEL-FOR-PIXEL. CHANGE CONTENT ONLY.**

- ✅ Exact layout, spacing, fonts, colors, animations
- ✅ Same components, same hierarchy, same interactions
- ❌ No creative interpretation, no "improvements"
- 🔄 Content adaptation: Turkish food, French language, EUR pricing

---

## 📱 CAPTURED SCREENS (Mobbin Reference)

| Screen | Purpose | Mobbin URL |
|--------|---------|------------|
| **Launch Screen** | App startup | Green background + "Uber Eats" logo |
| **Home Screen** | Restaurant discovery | Location picker + search + categories + feed |
| **Search/Browse** | Category filtering | Vertical list: Ramen, Pasta, Burgers, etc. |
| **Restaurant Detail** | Menu viewing | McDonald's example with hero image + menu |

**Screenshot IDs:** ss_1126xdqwd, ss_5875shdhc, ss_8695hfab4, ss_6288lodnq, ss_4929v7ume, ss_8706ulpzc

---

## 🎨 EXACT DESIGN TOKENS (From Screenshots)

### Colors (Pixel-Picked)
```scss
// Primary Uber Eats Green (from launch screen)
$primary-green: #00B04F;  // or #06C167 (exact match needed)

// Background & Text
$background-white: #FFFFFF;
$text-black: #000000;
$text-gray: #6B7280;  // subtitle text
$text-light: #9CA3AF;

// UI Elements
$search-bg: #F3F4F6;     // search bar background
$card-shadow: rgba(0,0,0,0.1);
$tab-active: #000000;    // bottom nav active
$tab-inactive: #6B7280;

// Rating/badges
$rating-star: #FFD700;   // gold star
$badge-green: #10B981;   // "most liked" badges
```

### Typography (System Fonts)
```scss
// iOS System Font Stack
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;

// Sizes (exact from screenshots)
$header-xl: 28px;     // Restaurant name
$header-lg: 20px;     // Section titles "Featured on Uber Eats"
$body-lg: 16px;       // Menu item names
$body-md: 14px;       // Descriptions, prices
$body-sm: 12px;       // Delivery time, distance
$caption: 10px;       // Badge text "#1 most liked"
```

### Spacing (Measured)
```scss
$space-xs: 4px;   // Icon padding
$space-sm: 8px;   // Button padding
$space-md: 16px;  // Card margins
$space-lg: 24px;  // Section spacing
$space-xl: 32px;  // Header top margin
```

---

## 🇹🇷 TURKISH CONTENT ADAPTATION

### 1. Launch Screen
```
VERBATIM COPY: Green background, centered logo, same animations
CHANGE ONLY: "Uber Eats" → "TurkEats"
```

### 2. Home Screen Layout (EXACT COPY)
```
┌─────────────────────────────────────┐
│ 9:41        [signal] [wifi] [bat]   │ ← Status bar (system)
├─────────────────────────────────────┤
│ Deliver now                      🔔 │ → "Livrer maintenant"
│ 1226 University Dr            ▼    │ → French addresses
├─────────────────────────────────────┤
│ 🔍 Search Uber Eats               │ → "🔍 Rechercher TurkEats"
├─────────────────────────────────────┤
│ 🍕  🍣  🥡  🍜  🍛              │ → Turkish categories (see below)
│Pizza Sushi Chinese Thai Indian      │
├─────────────────────────────────────┤
│ [Uber One] [Pick-up] [Offers] [Deliver] │ → [TurkEats+] [Retrait] [Offres] [Livraison]
├─────────────────────────────────────┤
│ Featured on Uber Eats            → │ → "À la une sur TurkEats"
│ ┌─────────┐ ┌─────────┐           │ → Turkish restaurant cards
│ │[IMG]    │ │[IMG]    │           │
│ │Amici's  │ │Galata   │           │ → Turkish restaurant names
│ └─────────┘ └─────────┘           │
├─────────────────────────────────────┤
│ More like Yolko*                → │ → "Plus comme {last_ordered}"
├─────────────────────────────────────┤
│  🏠    🛒    🔍    🛍️    👤     │ ← EXACT SAME ICONS
│ Home Grocery Browse Baskets Account │ → Accueil Épicerie Parcourir Panier Compte
└─────────────────────────────────────┘
```

### 3. Category Adaptation (EXACT POSITIONS)
```
UBER EATS CATEGORIES → TURKEATS CATEGORIES

🍕 Pizza      → 🥙 Assiette     (Turkish mixed plate)
🍣 Sushi      → 🥪 Sandwich     (Döner sandwich)
🥡 Chinese    → 🍲 Soup         (Turkish soups)
🍜 Thai       → 🫓 Pide         (Turkish pizza)
🍛 Indian     → 🍢 Kebab        (Grilled meats)
🍝 Pasta      → 🧁 Desserts     (Baklava, Turkish delights)
🍗 Wings      → ☕ Turkish Tea  (Çay & coffee)
🥙 Mediterranean → 🫓 Lahmacun  (Turkish flatbread)
```

### 4. Restaurant Cards (EXACT LAYOUT)
```
┌─────────────────────────────────────┐
│ [TURKISH FOOD IMAGE - same size]   │ ← 320x180px (exact)
│                                     │
│ Kebab Palace              ★ 4.5    │ ← Turkish restaurant name
│ 15-25 min • Min €10 • 1.2km       │ ← EUR pricing, French text
│                                     │
│ [Top offer • 2 offres disponibles] │ ← French promotions
└─────────────────────────────────────┘

CONTENT CHANGES:
- "Amici's East Coast Pizzeria" → "Kebab Palace"
- "Galata Bistro" → "Istanbul Grill"
- "$0.49 Delivery Fee" → "€0.49 Frais de livraison"
- "US$0 Delivery Fee" → "€0 Frais de livraison"
- "10-25 min" → same format, localized times
```

---

## 📸 TURKISH FOOD IMAGES NEEDED

**High-Priority Restaurant Photos (Same dimensions as Uber Eats):**

### Hero Images (Restaurant Cards - 320x180px)
1. **Döner Kebab Plate** - Mixed döner with rice, salad, sauce
2. **Turkish Mixed Grill** - Assorted kebabs on wooden board
3. **Pide with Meat** - Boat-shaped Turkish flatbread
4. **Turkish Breakfast** - Cheese, olives, bread, tea spread
5. **Baklava Assortment** - Layered pastries with nuts

### Category Icons (60x60px)
1. **🥙 Assiette** - Turkish plate icon
2. **🥪 Sandwich** - Döner wrap icon
3. **🍲 Soup** - Turkish soup bowl
4. **🫓 Pide** - Turkish flatbread shape
5. **🍢 Kebab** - Grilled meat skewer
6. **🧁 Desserts** - Baklava/Turkish delight

### Menu Item Photos (80x80px square)
1. **Döner Sandwich** - Wrapped döner
2. **Assiette Grec** - Mixed plate with meat, rice, salad
3. **Turkish Soup** - Lentil or chicken soup
4. **Pide with Cheese** - Melted cheese on flatbread
5. **Baklava** - Individual pastry piece
6. **Turkish Tea** - Glass of çay

**Image Sources:**
- High-quality stock photos (Unsplash, Shutterstock)
- Turkish restaurant partners (with permission)
- Food photography session (if budget allows)

---

## 🏪 TURKISH RESTAURANT DATA

**Featured Restaurants (from seed data):**

1. **Kebab Palace**
   - Address: "123 Rue de la République, 75001 Paris"
   - Rating: 4.5 ★ (128 reviews)
   - Delivery: "15-25 min • Min €10 • 1.2km"
   - Specialty: Mixed döner plates

2. **Istanbul Grill**
   - Address: "456 Avenue des Champs-Élysées, 75008 Paris"
   - Rating: 4.7 ★ (256 reviews)
   - Delivery: "20-30 min • Min €8 • 0.8km"
   - Specialty: Authentic Turkish grills

3. **Döner King**
   - Address: "789 Boulevard Haussmann, 75009 Paris"
   - Rating: 4.6 ★ (189 reviews)
   - Delivery: "18-28 min • Min €12 • 1.5km"
   - Specialty: Premium döner & pide

**Menu Items (EUR pricing):**
- Döner Sandwich: €7.50
- Assiette Grec: €12.90
- Turkish Soup: €4.50
- Pide with Meat: €9.80
- Baklava (3 pieces): €5.20
- Turkish Tea: €2.50

---

## 💻 IMPLEMENTATION PLAN

### Phase 1: Install UI Framework (NativeWind)
```bash
npm install nativewind
npm install --save-dev tailwindcss
```

### Phase 2: Copy Uber Eats Components (Exact)
```typescript
// Components to recreate pixel-perfect:
- LaunchScreen.tsx       (Green + logo)
- HomeScreen.tsx         (Search + categories + feed)
- CategoryBrowser.tsx    (Vertical category list)
- RestaurantCard.tsx     (Image + info + rating)
- RestaurantDetail.tsx   (Hero + menu + items)
- MenuItem.tsx           (Image + name + price + add button)
- BottomTabBar.tsx       (5 tabs, exact icons)
```

### Phase 3: Turkish Content Integration
```typescript
// Replace content, keep layout:
- Turkish restaurant data from Supabase
- Turkish category mapping
- French language strings
- EUR pricing format
- Turkish food images
```

### Phase 4: Testing Against Screenshots
```typescript
// Pixel-perfect comparison:
- Side-by-side screenshots
- Spacing measurements
- Color hex verification
- Font size validation
```

---

## 🚨 SUCCESS CRITERIA

**PASS:** Side-by-side screenshots are indistinguishable except for:
- Text content (Turkish restaurants vs American)
- Language (French vs English)
- Currency (EUR vs USD)

**FAIL:** Any visual difference in:
- Layout, spacing, colors, fonts
- Component positioning
- Animation timing
- Touch targets

---

## 📋 NEXT STEPS

1. ✅ Screens captured from Mobbin
2. ✅ Adaptation plan documented
3. 🔄 Install NativeWind + setup design tokens
4. 🔄 Build launch screen (pixel-perfect)
5. 🔄 Build home screen layout
6. 🔄 Add Turkish restaurant data
7. 🔄 Add Turkish food images
8. 🔄 Test against Uber Eats screenshots

**Fallback:** If pixel-perfect copy fails, use Codia.ai for automated design-to-code conversion.

---

**REMEMBER: Copy everything. Change only content. Pixel-for-pixel perfection.**