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

### React Native Implementation

```typescript
// components/menu/MenuItemCard.tsx
import { View, Text, Image, Pressable } from 'react-native';
import { MenuItem } from '@/types';

interface MenuItemCardProps {
  item: MenuItem;
  onPress: () => void;
}

export function MenuItemCard({ item, onPress }: MenuItemCardProps) {
  return (
    <Pressable onPress={onPress} className="flex-row p-4 border-b border-gray-100">
      <View className="flex-1 pr-4">
        <Text className="font-semibold text-base">{item.name}</Text>
        <Text className="text-gray-500 text-sm" numberOfLines={2}>
          {item.description}
        </Text>
        <Text className="font-medium mt-2">€{item.price.toFixed(2)}</Text>
        {!item.is_available && (
          <View className="bg-gray-200 rounded px-2 py-1 mt-1 self-start">
            <Text className="text-gray-600 text-xs">Indisponible</Text>
          </View>
        )}
      </View>
      {item.image_url && (
        <Image
          source={{ uri: item.image_url }}
          className="w-20 h-20 rounded-lg"
          resizeMode="cover"
        />
      )}
    </Pressable>
  );
}

// components/menu/ItemCustomizationSheet.tsx
import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useCartStore } from '@/lib/stores/cart-store';

interface ItemCustomizationSheetProps {
  item: MenuItem;
  onClose: () => void;
}

export function ItemCustomizationSheet({ item, onClose }: ItemCustomizationSheetProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const totalPrice = useMemo(() => {
    let price = item.price * quantity;
    // Add option price modifiers
    Object.entries(selectedOptions).forEach(([optionId, choiceIds]) => {
      const option = item.options?.find((o) => o.id === optionId);
      choiceIds.forEach((choiceId) => {
        const choice = option?.choices.find((c) => c.id === choiceId);
        if (choice) price += choice.price_modifier * quantity;
      });
    });
    return price;
  }, [item, selectedOptions, quantity]);

  const handleAddToCart = () => {
    addItem(item, selectedOptions, quantity);
    onClose();
  };

  return (
    <View className="flex-1">
      <ScrollView>{/* Option selectors */}</ScrollView>
      <Pressable onPress={handleAddToCart} className="bg-green-600 p-4 m-4 rounded-lg">
        <Text className="text-white text-center font-semibold">
          Add to Cart - €{totalPrice.toFixed(2)}
        </Text>
      </Pressable>
    </View>
  );
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
