# F006 - Order Tracking

**ID:** F006
**Priority:** P0 (MVP)
**Status:** Spec Complete
**Estimate:** 3 DU

---

## Overview

Real-time order status tracking from placement to delivery. WebSocket-based updates with push notifications at key milestones.

---

## User Stories

### US-020: View Order Status
```
As a customer
I want to see my order status
So I know when my food will arrive

Acceptance Criteria:
- [ ] Status timeline showing progress
- [ ] Current status highlighted
- [ ] Estimated delivery time (updates dynamically)
- [ ] Restaurant name and order number
- [ ] Order items summary
```

### US-021: Real-time Updates
```
As a customer
I want live updates on my order
So I stay informed without refreshing

Acceptance Criteria:
- [ ] Automatic status updates via WebSocket
- [ ] Push notification on status change
- [ ] Sound/vibration for new status
- [ ] "Preparing", "Ready", "On the way" stages
```

### US-022: Contact Options
```
As a customer
I want to contact the restaurant
So I can ask about my order

Acceptance Criteria:
- [ ] Call restaurant button
- [ ] In-app chat (future)
- [ ] Report issue button
```

### US-023: Order History
```
As a customer
I want to see my past orders
So I can reorder or track spending

Acceptance Criteria:
- [ ] List of all orders (newest first)
- [ ] Show status, date, restaurant, total
- [ ] Tap to view full details
- [ ] "Reorder" button for past orders
```

---

## Technical Specification

### Order Status Flow

```
pending → confirmed → preparing → ready → delivering → delivered
    ↓          ↓           ↓         ↓          ↓
cancelled   rejected                          failed
```

| Status | Triggered By | Push Notification |
|--------|--------------|-------------------|
| `pending` | Customer places order | "Order placed!" |
| `confirmed` | Restaurant accepts | "Order confirmed!" |
| `preparing` | Restaurant starts cooking | "Being prepared" |
| `ready` | Food ready for pickup | "Food is ready!" |
| `delivering` | Driver picks up | "On the way!" |
| `delivered` | Driver confirms delivery | "Enjoy your meal!" |
| `cancelled` | Customer cancels | "Order cancelled" |
| `rejected` | Restaurant rejects | "Order couldn't be fulfilled" |

### API Endpoints

```typescript
// GET /orders/:id/track
Response: {
  order_id: "uuid",
  order_number: "TK-2026-001234",
  status: "preparing",
  restaurant: {
    name: "Kebab Palace",
    phone: "+33...",
  },
  timeline: [
    { status: "pending", at: "2026-01-12T14:00:00Z" },
    { status: "confirmed", at: "2026-01-12T14:01:30Z" },
    { status: "preparing", at: "2026-01-12T14:05:00Z" },
  ],
  estimated_delivery: "2026-01-12T14:30:00Z",
  items: [...],
  delivery_address: {...}
}

// WebSocket: wss://api.turkeats.com/orders/:id/live
// Sends real-time status updates
Message: {
  type: "status_update",
  status: "ready",
  timestamp: "2026-01-12T14:20:00Z",
  estimated_delivery: "2026-01-12T14:35:00Z"
}

// GET /orders
// User's order history
Query: ?status=all|active|completed&page=1&limit=20
Response: {
  orders: [{
    id: "uuid",
    order_number: "TK-2026-001234",
    restaurant_name: "Kebab Palace",
    restaurant_image: "https://...",
    status: "delivered",
    total: 22.50,
    item_count: 3,
    placed_at: "2026-01-12T14:00:00Z",
    delivered_at: "2026-01-12T14:35:00Z"
  }],
  pagination: { page: 1, total_pages: 5 }
}
```

### Database Schema

```sql
-- Order status is in orders table
-- Add tracking-specific fields

ALTER TABLE orders
ADD COLUMN driver_id UUID REFERENCES drivers(id),
ADD COLUMN driver_location GEOGRAPHY(POINT, 4326),
ADD COLUMN driver_location_updated_at TIMESTAMPTZ;

-- Status history for timeline
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL,
  notes TEXT, -- e.g., "Customer requested no onions"
  created_by VARCHAR(20), -- system, restaurant, driver, customer
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to log status changes
CREATE OR REPLACE FUNCTION log_order_status()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, status, created_by)
    VALUES (NEW.id, NEW.status, 'system');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_changed
AFTER UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION log_order_status();
```

### WebSocket Implementation (Backend)

```typescript
// NestJS WebSocket Gateway
@WebSocketGateway({ namespace: 'orders' })
export class OrdersGateway {
  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, orderId: string) {
    // Verify user owns this order
    client.join(`order:${orderId}`);
  }

  async broadcastStatusUpdate(orderId: string, status: string) {
    this.server.to(`order:${orderId}`).emit('status_update', {
      type: 'status_update',
      status,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Flutter Implementation

```dart
// lib/features/tracking/providers/order_tracking_provider.dart
@riverpod
class OrderTracking extends _$OrderTracking {
  WebSocketChannel? _channel;

  @override
  Stream<OrderStatus> build(String orderId) async* {
    // Initial fetch
    final order = await ref.read(apiProvider).get('/orders/$orderId/track');
    yield OrderStatus.fromJson(order);

    // WebSocket connection
    _channel = WebSocketChannel.connect(
      Uri.parse('wss://api.turkeats.com/orders/$orderId/live'),
    );

    await for (final message in _channel!.stream) {
      final data = jsonDecode(message);
      if (data['type'] == 'status_update') {
        yield OrderStatus(
          status: data['status'],
          timestamp: DateTime.parse(data['timestamp']),
        );
      }
    }
  }

  @override
  void dispose() {
    _channel?.sink.close();
    super.dispose();
  }
}

// lib/features/tracking/screens/tracking_screen.dart
class TrackingScreen extends ConsumerWidget {
  final String orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tracking = ref.watch(orderTrackingProvider(orderId));

    return tracking.when(
      data: (status) => Column(
        children: [
          OrderTimeline(currentStatus: status),
          DeliveryEstimate(eta: status.estimatedDelivery),
          OrderSummary(items: status.items),
          ContactRestaurantButton(phone: status.restaurant.phone),
        ],
      ),
      loading: () => LoadingIndicator(),
      error: (e, _) => ErrorWidget(e),
    );
  }
}
```

---

## UI Screens

1. **Tracking Screen** - Status timeline + ETA + order summary
2. **Order History** - List of past orders
3. **Order Detail** - Full order info + receipt
4. **Reorder Confirmation** - Add past order to cart

---

## Push Notifications

```dart
// lib/services/push_notifications.dart
final notifications = {
  'confirmed': NotificationConfig(
    title: 'Order Confirmed! 🎉',
    body: 'Your order from {restaurant} has been confirmed',
    sound: 'order_confirmed.wav',
  ),
  'preparing': NotificationConfig(
    title: 'Cooking Your Food 👨‍🍳',
    body: 'The chef is preparing your order',
  ),
  'ready': NotificationConfig(
    title: 'Food is Ready! 📦',
    body: 'Your order is packed and ready',
  ),
  'delivering': NotificationConfig(
    title: 'On the Way! 🚗',
    body: 'Your food is being delivered',
    sound: 'driver_assigned.wav',
  ),
  'delivered': NotificationConfig(
    title: 'Enjoy Your Meal! 🍽️',
    body: 'Your order has been delivered',
  ),
};
```

---

## Dependencies

- F001 (Auth) - User must be logged in
- F004 (Ordering) - Order must be placed
- Firebase Cloud Messaging configured
- WebSocket server (NestJS gateway)

---

## Edge Cases

- WebSocket disconnects → Auto-reconnect with exponential backoff
- Push notification permission denied → Show in-app banners
- Order cancelled mid-preparation → Show cancellation reason
- App backgrounded → Push notifications still work
- Multiple active orders → Show list, tap to track each

---

## Testing Checklist

- [ ] Order status displays correctly
- [ ] Timeline shows history
- [ ] WebSocket connects and receives updates
- [ ] Push notifications fire on status change
- [ ] Call restaurant works
- [ ] Order history loads
- [ ] Reorder adds items to cart
- [ ] WebSocket reconnects after disconnect
