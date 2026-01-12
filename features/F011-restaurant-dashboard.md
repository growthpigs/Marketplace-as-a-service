# F011 - Restaurant Dashboard

**ID:** F011
**Priority:** P0 (MVP)
**Status:** Spec Complete
**Estimate:** 5 DU

---

## Overview

Web and mobile dashboard for restaurant owners to receive orders, manage menu, track performance, and handle payouts. Critical for restaurant adoption and retention.

---

## User Stories

### US-033: Receive Orders
```
As a restaurant owner
I want to receive order notifications
So I can prepare food promptly

Acceptance Criteria:
- [ ] Push notification for new orders
- [ ] Audio alert (configurable)
- [ ] Order details: items, quantities, special instructions
- [ ] Customer name and delivery address
- [ ] Accept order button
- [ ] Reject order with reason
- [ ] Auto-reject if not responded in X minutes (configurable)
```

### US-034: Manage Order Status
```
As a restaurant owner
I want to update order status
So customers know when food is ready

Acceptance Criteria:
- [ ] "Start Preparing" button → status: preparing
- [ ] "Ready for Pickup" button → status: ready
- [ ] "Handed to Driver" button → status: delivering
- [ ] "Mark Delivered" option (if self-delivery)
- [ ] Order history with filters
```

### US-035: Menu Management
```
As a restaurant owner
I want to manage my menu
So customers see accurate offerings

Acceptance Criteria:
- [ ] Add/edit/remove categories
- [ ] Add/edit/remove menu items
- [ ] Set prices and descriptions
- [ ] Upload item photos
- [ ] Toggle item availability (out of stock)
- [ ] Set item options (size, extras)
- [ ] Bulk enable/disable items
```

### US-036: Operating Hours
```
As a restaurant owner
I want to set my hours
So customers know when I'm open

Acceptance Criteria:
- [ ] Set hours per day of week
- [ ] Pause orders temporarily (busy period)
- [ ] Schedule closures (holidays)
- [ ] Delivery radius setting
- [ ] Minimum order amount
```

### US-037: View Analytics
```
As a restaurant owner
I want to see my performance
So I can improve my business

Acceptance Criteria:
- [ ] Daily/weekly/monthly revenue
- [ ] Order count and trends
- [ ] Average order value
- [ ] Popular items
- [ ] Customer ratings summary
- [ ] Peak hours analysis
```

### US-038: Manage Payouts
```
As a restaurant owner
I want to see my earnings
So I can track my income

Acceptance Criteria:
- [ ] View pending balance
- [ ] View payout history
- [ ] See commission breakdown
- [ ] Download financial reports
- [ ] Update bank account
```

---

## Technical Specification

### Architecture

Restaurant dashboard is available as:
1. **Web app** (primary) - Next.js, responsive, optimized for tablets/desktops
2. **Mobile companion** (secondary) - Restaurant owners can use the responsive web app on mobile devices; native app can be added in future if needed

### API Endpoints

```typescript
// Orders
// GET /restaurant/orders?status=pending|preparing|ready|completed|cancelled
Response: {
  orders: [{
    id: "uuid",
    order_number: "TK-2026-001234",
    customer_name: "Jean D.",
    items: [...],
    subtotal: 22.50,
    status: "pending",
    placed_at: "2026-01-12T14:00:00Z",
    delivery_address: {...}
  }]
}

// POST /restaurant/orders/:id/accept
Response: { status: "confirmed" }

// POST /restaurant/orders/:id/reject
Request: { reason: "Item unavailable" }
Response: { status: "rejected" }

// POST /restaurant/orders/:id/status
Request: { status: "preparing" | "ready" | "delivering" | "delivered" }
Response: { status: "..." }

// Menu
// GET /restaurant/menu
Response: { categories: [...] }

// POST /restaurant/menu/categories
Request: { name: "Desserts", sort_order: 5 }
Response: { id: "uuid", ... }

// POST /restaurant/menu/items
Request: {
  category_id: "uuid",
  name: "Baklava",
  description: "...",
  price: 5.00,
  image_url: "...",
  options: [...]
}
Response: { id: "uuid", ... }

// PATCH /restaurant/menu/items/:id
Request: { is_available: false }
Response: { ... }

// PATCH /restaurant/menu/items/:id/availability
Request: { is_available: false }
Response: { success: true }

// Settings
// GET /restaurant/settings
Response: {
  name: "Kebab Palace",
  address: "...",
  phone: "...",
  delivery_radius_km: 5,
  minimum_order: 10.00,
  delivery_fee: 2.50,
  delivery_time_min: 25,
  delivery_time_max: 40,
  auto_accept_orders: false,
  auto_reject_timeout: 10, // minutes
  notification_sound: "default"
}

// PATCH /restaurant/settings
Request: { delivery_radius_km: 7 }
Response: { ... }

// GET /restaurant/hours
Response: {
  hours: [
    { day: 0, is_closed: true },
    { day: 1, open: "11:00", close: "22:00" },
    ...
  ],
  temporary_closure: {
    is_paused: false,
    resume_at: null
  }
}

// Analytics
// GET /restaurant/analytics?period=day|week|month|year
Response: {
  revenue: 1234.50,
  order_count: 45,
  average_order: 27.43,
  revenue_trend: [{ date, amount }],
  popular_items: [{ name, count, revenue }],
  peak_hours: [{ hour, orders }],
  rating: 4.5,
  review_count: 89
}

// Payouts
// GET /restaurant/payouts
Response: {
  balance: 567.80,
  pending_balance: 123.45,
  next_payout_date: "2026-01-15",
  payouts: [{
    id: "uuid",
    amount: 456.00,
    status: "completed",
    paid_at: "2026-01-08"
  }]
}
```

### Database Schema

```sql
-- Restaurant is already defined in F002

-- Restaurant users (staff)
CREATE TABLE restaurant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(20) DEFAULT 'staff', -- owner, manager, staff
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Temporary closures
CREATE TABLE restaurant_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order auto-reject settings
ALTER TABLE restaurants
ADD COLUMN auto_accept_orders BOOLEAN DEFAULT false,
ADD COLUMN auto_reject_minutes INT DEFAULT 10,
ADD COLUMN notification_sound VARCHAR(50) DEFAULT 'default';

-- Payout tracking (Stripe is source of truth)
CREATE TABLE restaurant_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  stripe_payout_id VARCHAR(50),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  -- pending, in_transit, paid, failed
  period_start DATE,
  period_end DATE,
  order_count INT,
  gross_amount DECIMAL(10,2),
  commission_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);
```

### Web Dashboard (Next.js)

```typescript
// app/restaurant/layout.tsx
export default function RestaurantLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

// app/restaurant/orders/page.tsx
export default function OrdersPage() {
  const { data: orders } = useOrders();

  return (
    <div>
      <OrderTabs tabs={['Pending', 'Preparing', 'Ready', 'Completed']} />
      <OrderList orders={orders} />
    </div>
  );
}

// components/OrderCard.tsx
function OrderCard({ order }) {
  return (
    <Card>
      <CardHeader>
        <span>#{order.order_number}</span>
        <span>{formatTime(order.placed_at)}</span>
      </CardHeader>
      <CardBody>
        <OrderItems items={order.items} />
        <DeliveryAddress address={order.delivery_address} />
      </CardBody>
      <CardFooter>
        <Button onClick={() => acceptOrder(order.id)}>Accept</Button>
        <Button variant="outline" onClick={() => rejectOrder(order.id)}>Reject</Button>
      </CardFooter>
    </Card>
  );
}
```

### Push Notifications

```typescript
// Firebase Cloud Messaging for restaurant devices
interface OrderNotification {
  title: "New Order! 🔔",
  body: "Order #TK-2026-001234 - €22.50",
  data: {
    type: "new_order",
    order_id: "uuid",
    order_number: "TK-2026-001234"
  },
  android: {
    notification: {
      sound: "order_alert",
      channelId: "orders"
    }
  },
  apns: {
    payload: {
      aps: {
        sound: "order_alert.wav"
      }
    }
  }
}
```

---

## UI Screens (Web)

1. **Orders Dashboard** - Live order feed + tabs by status
2. **Order Detail** - Full order info + action buttons
3. **Menu Editor** - Categories + items + drag-drop sort
4. **Item Editor** - Form with image upload + options builder
5. **Settings** - Business hours, delivery, notifications
6. **Analytics** - Charts + metrics + date filters
7. **Payouts** - Balance + history + reports

---

## Mobile Experience (Responsive Web)

The Next.js dashboard is responsive and works well on mobile/tablet for on-the-go management:
1. **Orders** - Accept/reject, update status (PWA notifications)
2. **Quick Menu Toggle** - Enable/disable items
3. **Pause Orders** - Temporary closure
4. **Notifications** - Web push notifications with audio alerts

*Note: A dedicated React Native app for restaurant owners can be added as a future enhancement if needed.*

---

## Dependencies

- F001 (Auth) - Restaurant owner authentication
- F004 (Ordering) - Receive orders
- F005 (Payments) - Stripe Connect for payouts
- Firebase for push notifications
- Image upload (Supabase Storage)

---

## Onboarding Flow

1. Restaurant signs up (separate flow)
2. Admin approves restaurant
3. Restaurant completes Stripe Connect onboarding
4. Menu setup wizard
5. Test order flow
6. Go live

---

## Edge Cases

- Multiple devices logged in → All receive notifications
- Poor internet → Queue status updates, retry on reconnect
- Bulk item disable → Batch API call
- Image upload fails → Show error, allow retry
- Payout delayed → Show explanation, contact support link
- Order volume spike → Rate limiting protection

---

## Testing Checklist

- [ ] New order notification received
- [ ] Order accept works
- [ ] Order reject with reason
- [ ] Status updates flow through
- [ ] Menu category CRUD
- [ ] Menu item CRUD
- [ ] Image upload
- [ ] Item availability toggle
- [ ] Hours configuration
- [ ] Temporary pause orders
- [ ] Analytics display correctly
- [ ] Payout history accurate
