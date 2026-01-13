# 🚨 Critical UX Issue: Missing Button Interactions

**Date:** 2026-01-13
**Severity:** HIGH - Core UI feedback missing
**Status:** IDENTIFIED - Ready for fixes

---

## Executive Summary

**All interactive buttons are missing visual feedback.** Buttons log to console but don't:
- Change visual state
- Open menus/dialogs
- Trigger navigation
- Show expandable content

This creates a broken UX where users click buttons expecting changes, but see nothing.

---

## Issue 1: ❤️ Favorite Heart Button

**Location:** `apps/mobile/components/restaurant/RestaurantHero.tsx:77`

**Current Behavior:**
- Always shows outline heart (`heart-o`)
- Clicking logs "Favorite pressed" to console
- No visual state change
- No favorite tracking

**Expected Behavior:**
- Show filled heart when favorited
- Show outline heart when not favorited
- Toggle between states on click
- Persist favorite status

**Code Problem:**
```typescript
// Line 77 - ALWAYS shows outline heart, no state
<FontAwesome name="heart-o" size={16} color="#000000" />

// Line 444 in [id].tsx - Handler only logs
onFavoritePress={() => console.log('Favorite pressed')}
```

**What's Needed:**
- useState for `isFavorited` state
- Conditional icon: `isFavorited ? 'heart' : 'heart-o'`
- Toggle handler that updates state
- Visual feedback (color change or fill)

---

## Issue 2: ⋯ Ellipsis Menu Button

**Location:** `apps/mobile/components/restaurant/RestaurantHero.tsx:84`

**Current Behavior:**
- Clicking logs "More pressed" to console
- No menu appears
- No visible action

**Expected Behavior:**
- Open dropdown menu with options like:
  - Share restaurant
  - Report restaurant
  - View details
  - etc.

**Code Problem:**
```typescript
// Line 445 in [id].tsx - Handler only logs
onMorePress={() => console.log('More pressed')}
```

**What's Needed:**
- Modal or ActionSheetMenu component
- Menu options with handlers
- Visual indication menu is open (e.g., icon highlight)

---

## Issue 3: ⭐ Rating Badge Click Handler

**Location:** `apps/mobile/components/restaurant/RestaurantInfo.tsx:51`

**Current Behavior:**
- Pressable wrapper exists but NO onPress handler
- Clicking does nothing at all
- Not clickable even visually

**Expected Behavior:**
- Navigate to reviews screen OR
- Show reviews in modal OR
- Highlight/visual feedback on press

**Code Problem:**
```typescript
// Line 51 - Pressable with no handler
<Pressable style={styles.ratingBadge}>
  {/* No onPress handler! */}
```

**What's Needed:**
- Add `onPress` handler to Pressable
- Navigate to reviews screen or show reviews modal
- Visual feedback (opacity change, etc.)

---

## Issue 4: ℹ️ Plus d'infos (More Info) Button

**Location:** `apps/mobile/components/restaurant/RestaurantInfo.tsx:77`

**Current Behavior:**
- Pressable exists with `onMoreInfoPress` handler prop
- Handler is NOT passed from parent [id].tsx
- Clicking does nothing

**Expected Behavior:**
- Expand/collapse restaurant details (hours, policies, etc.)
- OR navigate to details screen
- OR show details in modal

**Code Problem:**
```typescript
// Line 77 in RestaurantInfo - Has handler prop
<Pressable style={styles.moreInfoButton} onPress={onMoreInfoPress}>

// Line 449 in [id].tsx - Handler not passed!
<RestaurantInfo
  name={restaurant.name}
  rating={restaurant.rating}
  reviewCount={restaurant.reviewCount}
  priceLevel={restaurant.priceLevel}
  cuisine={restaurant.cuisine}
  distance={restaurant.distance}
  deliveryTime={restaurant.deliveryTime}
  deliveryFee={restaurant.deliveryFee}
  // Missing: onMoreInfoPress handler!
/>
```

**What's Needed:**
- Pass `onMoreInfoPress` handler from [id].tsx to RestaurantInfo
- Implement action: toggle info expansion or navigate

---

## Issue 5: Restaurant Name/Rating Should Be Clickable

**Location:** `apps/mobile/components/restaurant/RestaurantInfo.tsx:50-54`

**Current Behavior:**
- Restaurant name is just Text, not pressable
- Rating is Pressable but has no handler
- User expects clicking name/rating to show details

**Expected Behavior:**
- Click name or rating to view restaurant details
- Visual feedback on press

**Code Problem:**
- No Pressable wrapper around name
- Rating Pressable has no onPress handler

---

## Summary Table

| Button | Current | Should Do | Status |
|--------|---------|-----------|--------|
| ❤️ Heart | Log only | Toggle fill state | ❌ MISSING |
| ⋯ Ellipsis | Log only | Open menu | ❌ MISSING |
| ⭐ Rating | Nothing | Show reviews | ❌ NO HANDLER |
| ℹ️ Plus d'infos | Nothing (no prop) | Expand details | ❌ NOT WIRED |
| Menu Items (+) | ✅ Works | Add to cart | ✅ WORKING |
| Name/Rating | Not clickable | Show details | ❌ NOT INTERACTIVE |

---

## Fix Priority

1. **HIGH:** Heart button (most basic interaction)
2. **HIGH:** Plus d'infos button (wiring fix)
3. **HIGH:** Rating badge handler (quick add)
4. **MEDIUM:** Ellipsis menu (more complex)
5. **NICE:** Additional interactivity enhancements

---

## Implementation Files Needed

**Modify:**
- `apps/mobile/app/restaurant/[id].tsx` - Add state & handlers
- `apps/mobile/components/restaurant/RestaurantHero.tsx` - Add heart state
- `apps/mobile/components/restaurant/RestaurantInfo.tsx` - Pass handler
- Potentially create: `apps/mobile/components/restaurant/RestaurantMenu.tsx` - Ellipsis menu

**New components (optional):**
- ActionSheetMenu for ellipsis options
- ReviewsModal or ReviewsScreen
- RestaurantDetailsModal or DetailsSheet

---

## User Impact

**Current State:** Users see buttons but nothing happens → Broken UX
**After Fix:** All buttons provide visual/navigation feedback → Professional UX

This is a **critical blocker** for production readiness.
