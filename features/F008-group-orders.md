# F008 - Group Ordering

**ID:** F008
**Priority:** P0 (MVP)
**Status:** Spec Complete
**Estimate:** 5 DU

---

## Overview

Collaborative ordering feature where one person initiates a group order and shares a link. Friends add their items and pay their portion. Single delivery to one address. All participants earn cashback.

---

## User Stories

### US-029: Create Group Order
```
As a customer
I want to start a group order
So my friends can add their items

Acceptance Criteria:
- [ ] "Start Group Order" button on restaurant page
- [ ] Set deadline for adding items
- [ ] Generate shareable link and QR code
- [ ] Share via WhatsApp, SMS, copy link
- [ ] See participants joining in real-time
```

### US-030: Join Group Order
```
As a friend
I want to join a group order
So I can add my items

Acceptance Criteria:
- [ ] Open shared link (deep link or web)
- [ ] See restaurant and deadline
- [ ] Browse menu and add items
- [ ] See other participants' items
- [ ] Pay for my portion
```

### US-031: Manage Group Order
```
As the order host
I want to manage the group order
So I can finalize and submit it

Acceptance Criteria:
- [ ] See all participants and their items
- [ ] Remove participant if needed
- [ ] Extend deadline
- [ ] Cancel group order
- [ ] Submit order when everyone paid
```

### US-032: Group Payment
```
As a participant
I want to pay for my portion
So the order can proceed

Acceptance Criteria:
- [ ] See my items and subtotal
- [ ] See my share of delivery fee (split equally)
- [ ] Pay via card or wallet
- [ ] See "Paid" status after payment
- [ ] Earn cashback on my portion
```

---

## Technical Specification

### Group Order Flow

```
1. Host creates group order → gets share link
2. Friends join via link → browse menu, add items
3. Each participant pays their portion
4. Host submits when all paid (or deadline)
5. Single order sent to restaurant
6. Everyone gets cashback on their portion
```

### Fee Structure

| Fee Type | Calculation |
|----------|-------------|
| Subtotal | Each pays their items |
| Delivery fee | Split equally among participants |
| Service fee (2%) | Applied to each person's subtotal |
| Cashback (10%) | Each earns on their subtotal |

**Example (3 participants, €3 delivery):**
```
Alice:  Items €15 + Delivery €1 + Service €0.30 = €16.30 → Cashback €1.50
Bob:    Items €10 + Delivery €1 + Service €0.20 = €11.20 → Cashback €1.00
Carol:  Items €12 + Delivery €1 + Service €0.24 = €13.24 → Cashback €1.20
Total:  €40.74 → Restaurant receives €35.15 (95% of €37)
```

### API Endpoints

```typescript
// POST /group-orders
// Create new group order
Request: {
  restaurant_id: "uuid",
  deadline: "2026-01-12T18:00:00Z", // Optional, default 2 hours
  delivery_address: {...}
}
Response: {
  id: "uuid",
  code: "ABC123", // Short code for joining
  share_url: "https://turkeats.app/g/ABC123",
  qr_code_url: "https://...",
  deadline: "2026-01-12T18:00:00Z",
  host_id: "uuid"
}

// GET /group-orders/:code
// Get group order details (for joining)
Response: {
  id: "uuid",
  restaurant: {...},
  deadline: "...",
  host: { id, name, avatar },
  participants: [{
    id: "uuid",
    user: { name, avatar },
    items: [...],
    subtotal: 15.00,
    status: "paid" // pending, paid
  }],
  delivery_address: {...},
  status: "open" // open, closed, submitted, cancelled
}

// POST /group-orders/:id/join
Request: {} // Auth token identifies user
Response: { participant_id: "uuid" }

// POST /group-orders/:id/items
// Add items to my portion
Request: {
  items: [{
    menu_item_id: "uuid",
    quantity: 1,
    options: {...},
    special_instructions: "..."
  }]
}
Response: { participant_items: [...] }

// DELETE /group-orders/:id/items/:itemId
Response: { success: true }

// POST /group-orders/:id/pay
// Pay for my portion
Request: {
  payment_method_id: "pm_...",
  use_wallet: true
}
Response: {
  status: "paid",
  amount_charged: 16.30,
  cashback_pending: 1.50
}

// POST /group-orders/:id/submit
// Host submits the order (all must be paid)
Request: {}
Response: {
  order_id: "uuid",
  order_number: "TK-2026-001234"
}

// WebSocket: wss://api.turkeats.com/group-orders/:id/live
// Real-time updates
Messages:
- { type: "participant_joined", user: {...} }
- { type: "items_updated", participant_id, items: [...] }
- { type: "participant_paid", participant_id }
- { type: "order_submitted", order_id }
```

### Database Schema

```sql
CREATE TABLE group_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL,
  host_id UUID REFERENCES auth.users(id),
  restaurant_id UUID REFERENCES restaurants(id),

  delivery_address JSONB NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,

  status VARCHAR(20) DEFAULT 'open',
  -- open, closed, submitted, cancelled

  -- After submission
  order_id UUID REFERENCES orders(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate short code
CREATE OR REPLACE FUNCTION generate_group_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code := UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_group_code
BEFORE INSERT ON group_orders
FOR EACH ROW EXECUTE FUNCTION generate_group_code();

CREATE TABLE group_order_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_order_id UUID REFERENCES group_orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),

  subtotal DECIMAL(10,2) DEFAULT 0,
  delivery_share DECIMAL(6,2) DEFAULT 0,
  service_fee DECIMAL(6,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,

  status VARCHAR(20) DEFAULT 'pending',
  -- pending, paid, removed

  -- Payment
  stripe_payment_intent_id VARCHAR(50),
  paid_at TIMESTAMPTZ,

  -- Cashback
  cashback_amount DECIMAL(10,2) DEFAULT 0,

  joined_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(group_order_id, user_id)
);

CREATE TABLE group_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES group_order_participants(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),

  name VARCHAR(150) NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(8,2) NOT NULL,
  options JSONB,
  options_price DECIMAL(8,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calculate participant totals
CREATE OR REPLACE FUNCTION calculate_participant_totals()
RETURNS TRIGGER AS $$
DECLARE
  participant_subtotal DECIMAL(10,2);
  participant_count INT;
  delivery_fee DECIMAL(6,2);
  service_fee DECIMAL(6,2);
BEGIN
  -- Get subtotal from items
  SELECT COALESCE(SUM(total_price), 0) INTO participant_subtotal
  FROM group_order_items WHERE participant_id = NEW.participant_id;

  -- Get delivery fee and participant count
  SELECT r.delivery_fee, COUNT(gop.id)
  INTO delivery_fee, participant_count
  FROM group_orders go
  JOIN restaurants r ON r.id = go.restaurant_id
  JOIN group_order_participants gop ON gop.group_order_id = go.id
  WHERE go.id = (SELECT group_order_id FROM group_order_participants WHERE id = NEW.participant_id);

  -- Calculate fees
  service_fee := participant_subtotal * 0.02;

  -- Update participant
  UPDATE group_order_participants
  SET
    subtotal = participant_subtotal,
    delivery_share = delivery_fee / participant_count,
    service_fee = service_fee,
    total = participant_subtotal + (delivery_fee / participant_count) + service_fee,
    cashback_amount = participant_subtotal * 0.10
  WHERE id = NEW.participant_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recalculate_participant
AFTER INSERT OR UPDATE OR DELETE ON group_order_items
FOR EACH ROW EXECUTE FUNCTION calculate_participant_totals();
```

### React Native Implementation

```typescript
// hooks/useGroupOrder.ts
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

interface GroupOrder {
  id: string;
  code: string;
  hostId: string;
  restaurant: Restaurant;
  participants: Participant[];
  status: string;
  deadline: string;
}

export function useGroupOrder(code: string) {
  const queryClient = useQueryClient();

  // Initial fetch
  const { data: groupOrder, isLoading, error } = useQuery({
    queryKey: ['group-order', code],
    queryFn: async () => {
      const { data } = await api.get(`/group-orders/${code}`);
      return data;
    },
  });

  // Supabase Realtime for live updates
  useEffect(() => {
    if (!groupOrder?.id) return;

    const channel = supabase
      .channel(`group-order:${groupOrder.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'group_orders',
        filter: `id=eq.${groupOrder.id}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['group-order', code] });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'group_order_participants',
        filter: `group_order_id=eq.${groupOrder.id}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['group-order', code] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupOrder?.id, code, queryClient]);

  return { groupOrder, isLoading, error };
}

// lib/stores/group-order-store.ts
import { create } from 'zustand';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';

interface GroupOrderState {
  createGroupOrder: (restaurantId: string, deadline: Date, address: Address) => Promise<string>;
  joinGroupOrder: (code: string) => Promise<void>;
  shareGroupOrder: (code: string) => Promise<void>;
}

export const useGroupOrderStore = create<GroupOrderState>((set) => ({
  createGroupOrder: async (restaurantId, deadline, address) => {
    const { data } = await api.post('/group-orders', {
      restaurant_id: restaurantId,
      deadline: deadline.toISOString(),
      delivery_address: address,
    });
    return data.code;
  },

  joinGroupOrder: async (code) => {
    await api.post(`/group-orders/${code}/join`);
  },

  shareGroupOrder: async (code) => {
    const url = `https://turkeats.app/g/${code}`;
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(url);
    } else {
      await Clipboard.setStringAsync(url);
    }
  },
}));
```

### Deep Linking (Expo Router)

```typescript
// app.config.ts
export default {
  expo: {
    scheme: 'turkeats',
    web: {
      bundler: 'metro',
    },
  },
};

// app/(app)/g/[code].tsx - Deep link handler
import { useLocalSearchParams, Redirect } from 'expo-router';

export default function GroupOrderDeepLink() {
  const { code } = useLocalSearchParams<{ code: string }>();
  // Redirect to the group order join screen
  return <Redirect href={`/group-order/${code}`} />;
}
```

---

## UI Screens

1. **Create Group Order** - Set deadline + address
2. **Share Screen** - QR code + share options
3. **Group Lobby** - Participants + items + status
4. **Add Items** - Menu browsing in group context
5. **Pay My Portion** - Checkout for participant
6. **Order Submitted** - Confirmation for all

---

## Dependencies

- F001 (Auth) - All participants must be logged in
- F003 (Menu) - Menu browsing
- F004 (Ordering) - Final order submission
- F005 (Payments) - Each participant pays
- F007 (Wallet) - Wallet as payment option
- Deep linking configured (iOS Universal Links, Android App Links)

---

## Edge Cases

- Deadline passes with unpaid participants → Auto-exclude, proceed with paid
- All participants remove items → Cancel group order
- Host leaves → Transfer to next participant or cancel
- Restaurant closes before deadline → Notify all, cancel
- Participant adds item after paying → Charge difference or block
- Single participant group → Still works, just normal order

---

## Testing Checklist

- [ ] Create group order
- [ ] Generate shareable link
- [ ] QR code works
- [ ] Deep link opens app/web
- [ ] Join as participant
- [ ] Add items as participant
- [ ] Real-time updates (new participant, items added)
- [ ] Pay for portion
- [ ] Delivery fee split correctly
- [ ] Host can submit when all paid
- [ ] Order created correctly
- [ ] Cashback credited to all participants
