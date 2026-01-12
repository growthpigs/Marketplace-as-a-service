# F003 - Menu Browsing

**ID:** F003
**Priority:** P0 (MVP)
**Status:** Spec Complete
**Estimate:** 3 DU

---

## Overview

Display restaurant menus with categories, item details, photos, and prices. Support for item customization (extras, sauces, sizes).

---

## User Stories

### US-009: View Menu
```
As a customer
I want to browse a restaurant's menu
So I can see what's available

Acceptance Criteria:
- [ ] Menu organized by categories (Entrées, Plats, Desserts, Boissons)
- [ ] Sticky category tabs for navigation
- [ ] Item shows: name, description, price, image
- [ ] "Unavailable" badge for out-of-stock items
- [ ] Popular items highlighted
```

### US-010: Item Details
```
As a customer
I want to see item details
So I can decide what to order

Acceptance Criteria:
- [ ] Full item image
- [ ] Complete description
- [ ] Allergen information
- [ ] Nutritional info (optional)
- [ ] "Add to Cart" button
```

### US-011: Item Customization
```
As a customer
I want to customize my order
So I can get exactly what I want

Acceptance Criteria:
- [ ] Size selection (where applicable)
- [ ] Required options (e.g., meat choice)
- [ ] Optional extras (e.g., cheese +1€)
- [ ] Sauces selection
- [ ] Special instructions text field
- [ ] Real-time price update
```

---

## Technical Specification

### API Endpoints

```typescript
// GET /restaurants/:id/menu
Response: {
  categories: [{
    id: "uuid",
    name: "Assiettes",
    description: "Nos plats principaux",
    items: [{
      id: "uuid",
      name: "Assiette Kebab",
      description: "Viande de kebab, frites, salade, sauce au choix",
      price: 9.50,
      image_url: "https://...",
      is_available: true,
      is_popular: true,
      allergens: ["gluten", "dairy"],
      options: [
        {
          id: "size",
          name: "Taille",
          type: "single", // single | multiple
          required: true,
          choices: [
            { id: "normal", name: "Normal", price_modifier: 0 },
            { id: "xl", name: "XL", price_modifier: 2.00 }
          ]
        },
        {
          id: "sauce",
          name: "Sauce",
          type: "single",
          required: true,
          choices: [
            { id: "blanche", name: "Sauce Blanche", price_modifier: 0 },
            { id: "harissa", name: "Harissa", price_modifier: 0 },
            { id: "samourai", name: "Samouraï", price_modifier: 0 }
          ]
        },
        {
          id: "extras",
          name: "Suppléments",
          type: "multiple",
          required: false,
          choices: [
            { id: "cheese", name: "Fromage", price_modifier: 1.00 },
            { id: "egg", name: "Oeuf", price_modifier: 1.00 }
          ]
        }
      ]
    }]
  }]
}

// GET /menu-items/:id
Response: { ...fullItemDetails }
```

### Database Schema

```sql
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(8,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  allergens TEXT[], -- array of allergen codes
  nutritional_info JSONB, -- { calories, protein, carbs, fat }
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE menu_item_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) DEFAULT 'single', -- single, multiple
  is_required BOOLEAN DEFAULT false,
  min_selections INT DEFAULT 0,
  max_selections INT,
  sort_order INT DEFAULT 0
);

CREATE TABLE menu_item_option_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_id UUID REFERENCES menu_item_options(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  price_modifier DECIMAL(6,2) DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);
```

### Flutter Implementation

```dart
// lib/features/menu/widgets/menu_item_card.dart
class MenuItemCard extends ConsumerWidget {
  final MenuItem item;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return GestureDetector(
      onTap: () => _showItemSheet(context, item),
      child: Card(
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item.name, style: TextStyles.itemTitle),
                  Text(item.description, maxLines: 2),
                  Text('€${item.price.toStringAsFixed(2)}'),
                  if (!item.isAvailable)
                    Badge(label: 'Indisponible', color: Colors.grey),
                ],
              ),
            ),
            if (item.imageUrl != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: CachedNetworkImage(
                  imageUrl: item.imageUrl!,
                  width: 80,
                  height: 80,
                  fit: BoxFit.cover,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// lib/features/menu/widgets/item_customization_sheet.dart
class ItemCustomizationSheet extends ConsumerStatefulWidget {
  final MenuItem item;

  // Handles option selection, quantity, special instructions
  // Calculates total price in real-time
  // Validates required options before add to cart
}
```

---

## UI Screens

1. **Menu Screen** - Category tabs + scrolling item list
2. **Item Detail Sheet** - Bottom sheet with customization options
3. **Image Gallery** - Full-screen item photos (if multiple)

---

## Dependencies

- F002 (Discovery) - Navigate from restaurant detail
- Menu data seeded for restaurants

---

## Edge Cases

- Empty category → Hide category tab
- All items unavailable → Show "Menu not available" message
- No image → Show placeholder
- Long item names → Truncate with ellipsis
- Complex options → Validate min/max selections

---

## Testing Checklist

- [ ] Menu categories load correctly
- [ ] Category tab navigation works
- [ ] Item details display correctly
- [ ] Option selection works (single/multiple)
- [ ] Price updates in real-time
- [ ] Required options enforced
- [ ] Unavailable items not selectable
- [ ] Special instructions saved
