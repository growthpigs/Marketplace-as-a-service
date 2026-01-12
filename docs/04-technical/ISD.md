# Implementation Specification Document (ISD)

**Project:** TurkEats
**Version:** 0.2
**Created:** 2026-01-12
**Status:** Ready for Implementation

---

## 1. Introduction

### 1.1 Purpose
This document describes HOW TurkEats will be built technically.

### 1.2 Key Decisions Made
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | **Supabase** | PostgreSQL + Auth + Realtime + Storage in one |
| Mobile | **React Native** | Single codebase, JS ecosystem, Expo for speed |
| Backend | **Supabase Edge Functions** | Serverless, integrated with DB |
| Admin | **Next.js 14** | SSR, React ecosystem |
| Platform | iOS first, then Android | iOS for design, Android for market |

### 1.3 References
- [DATA-MODEL.md](DATA-MODEL.md) - Database design
- [API-CONTRACTS.md](API-CONTRACTS.md) - API specifications
- [TECH-STACK.md](TECH-STACK.md) - Technology choices

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Customer App   │  │ Restaurant App  │  │ Admin Dashboard │
│  (React Native) │  │ (React Native)  │  │   (Next.js)     │
│   iOS + Android │  │  Android/Web    │  │                 │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │     SUPABASE      │
                    │  ┌─────────────┐  │
                    │  │  PostgREST  │  │ ← Auto-generated REST API
                    │  ├─────────────┤  │
                    │  │  Auth       │  │ ← JWT + OAuth + Phone
                    │  ├─────────────┤  │
                    │  │  Realtime   │  │ ← WebSocket subscriptions
                    │  ├─────────────┤  │
                    │  │  Storage    │  │ ← Images, files
                    │  ├─────────────┤  │
                    │  │  Edge Func  │  │ ← Custom business logic
                    │  └─────────────┘  │
                    └─────────┬─────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
┌────────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│     Stripe      │  │    Firebase     │  │   Google Maps   │
│  (Payments)     │  │  (Push Notif)   │  │  (Geocoding)    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 2.2 Why Supabase?

| Feature | How We Use It |
|---------|---------------|
| **PostgREST** | Auto-REST API for CRUD - no backend code for basic ops |
| **Auth** | Email/phone signup, JWT tokens, RLS policies |
| **Realtime** | Order status → instant push to customer & restaurant |
| **Storage** | Restaurant logos, menu item images |
| **Edge Functions** | Complex business logic (payments, referral calcs) |
| **RLS** | Row-level security - users see only their data |

---

## 3. Implementation Details

### 3.1 Supabase Project Setup

```bash
# Create project
supabase init turkeats

# Local development
supabase start  # Starts local Supabase (Docker)

# Environment
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx  # Server-side only
```

### 3.2 Database Schema

Schema from [DATA-MODEL.md](DATA-MODEL.md) with RLS policies:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users see own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users see their own orders
CREATE POLICY "Users see own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can see active restaurants
CREATE POLICY "Public sees restaurants" ON restaurants
  FOR SELECT USING (status = 'active');

-- Restaurant owners manage their restaurant
CREATE POLICY "Owner manages restaurant" ON restaurants
  FOR ALL USING (auth.uid() = owner_id);
```

### 3.3 Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   App       │     │  Supabase   │     │   Result    │
│             │     │    Auth     │     │             │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │  signUp(email,pw) │                   │
       │──────────────────>│                   │
       │                   │                   │
       │   { user, session }                   │
       │<──────────────────│                   │
       │                   │                   │
       │  Insert user profile                  │
       │──────────────────>│                   │
       │                   │                   │
       │  Create wallet    │                   │
       │──────────────────>│                   │
       │                   │                   │
       │              JWT Token                │
       │<──────────────────│──────────────────>│
       │                   │                   │
```

**Supabase Auth Config:**
- Email/Password: Enabled
- Phone/OTP: Enabled (Twilio)
- Session expiry: 1 hour
- Refresh token: 7 days

### 3.4 Realtime Subscriptions

```typescript
// Customer subscribes to their order
const orderSubscription = supabase
  .channel('order-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `id=eq.${orderId}`
  }, (payload) => {
    setOrderStatus(payload.new.status)
  })
  .subscribe()

// Restaurant subscribes to new orders
const restaurantOrders = supabase
  .channel('restaurant-orders')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'orders',
    filter: `restaurant_id=eq.${restaurantId}`
  }, (payload) => {
    playNotificationSound()
    addNewOrder(payload.new)
  })
  .subscribe()
```

### 3.5 Edge Functions (Business Logic)

Located in `supabase/functions/`:

| Function | Purpose | Trigger |
|----------|---------|---------|
| `create-order` | Validate order, calc fees, create Stripe intent | HTTP POST |
| `complete-order` | Award cashback, referral commission | DB trigger |
| `process-withdrawal` | Validate, initiate bank transfer | HTTP POST |
| `calculate-delivery-fee` | Distance-based pricing | HTTP GET |

**Example: create-order function:**

```typescript
// supabase/functions/create-order/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

serve(async (req) => {
  const { restaurant_id, items, delivery_address, wallet_amount } = await req.json()

  // 1. Validate items exist and are available
  // 2. Calculate totals (subtotal + delivery + service fee - wallet)
  // 3. Create order record (status: pending)
  // 4. Create Stripe PaymentIntent
  // 5. Return order + client_secret

  return new Response(JSON.stringify({
    order,
    payment: { client_secret: paymentIntent.client_secret }
  }))
})
```

---

## 4. Mobile App Implementation

### 4.1 React Native + Expo Setup

```bash
npx create-expo-app turkeats-app --template tabs
cd turkeats-app
npx expo install @supabase/supabase-js
npx expo install react-native-url-polyfill
```

### 4.2 Project Structure

```
turkeats-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home/Restaurants
│   │   ├── search.tsx     # Search
│   │   ├── wallet.tsx     # Wallet
│   │   └── profile.tsx    # Profile
│   ├── restaurant/[id].tsx
│   ├── order/[id].tsx
│   └── checkout.tsx
├── components/
│   ├── RestaurantCard.tsx
│   ├── MenuItem.tsx
│   ├── CartButton.tsx
│   └── OrderStatus.tsx
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── stripe.ts          # Stripe setup
│   └── storage.ts         # AsyncStorage helpers
├── hooks/
│   ├── useAuth.ts
│   ├── useOrders.ts
│   └── useWallet.ts
└── types/
    └── database.ts        # Generated from Supabase
```

### 4.3 Type Generation

```bash
# Generate TypeScript types from Supabase schema
npx supabase gen types typescript --project-id xxx > types/database.ts
```

---

## 5. Payment Implementation (Stripe)

### 5.1 Flow

```
Customer places order
       │
       ▼
Edge Function creates PaymentIntent
       │
       ▼
App receives client_secret
       │
       ▼
Stripe SDK confirms payment
       │
       ▼
Webhook confirms → Update order status
       │
       ▼
Order flows to restaurant
```

### 5.2 Stripe Connect Setup

- **Platform Account:** TurkEats (receives all payments)
- **Connected Accounts:** Each restaurant
- **Payout:** Automatic weekly to restaurants

```typescript
// Creating connected account for restaurant
const account = await stripe.accounts.create({
  type: 'express',
  country: 'FR',
  email: restaurant.email,
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
})
```

---

## 6. Deployment

### 6.1 Environments

| Environment | Supabase | URL |
|-------------|----------|-----|
| Development | Local (Docker) | localhost:54321 |
| Staging | turkeats-staging | staging.turkeats.fr |
| Production | turkeats-prod | turkeats.fr |

### 6.2 CI/CD

```yaml
# GitHub Actions
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-functions:
    runs-on: ubuntu-latest
    steps:
      - uses: supabase/setup-cli@v1
      - run: supabase functions deploy --project-ref $PROJECT_REF

  deploy-migrations:
    runs-on: ubuntu-latest
    steps:
      - uses: supabase/setup-cli@v1
      - run: supabase db push --project-ref $PROJECT_REF
```

### 6.3 Mobile Deployment

| Platform | Method | Timeline |
|----------|--------|----------|
| iOS | TestFlight → App Store | Week 4-5 |
| Android | Internal → Play Store | Week 5-6 |

---

## 7. Testing Strategy

### 7.1 Database Tests

```sql
-- Test RLS policies
SET ROLE authenticated;
SET request.jwt.claims TO '{"sub": "user-uuid-1"}';

-- Should return only user's orders
SELECT * FROM orders;  -- Only user-uuid-1's orders

-- Should fail
INSERT INTO orders (user_id, ...) VALUES ('other-user-uuid', ...);  -- Denied
```

### 7.2 API Tests

```typescript
// Jest + Supabase test client
describe('Orders', () => {
  it('creates order with valid items', async () => {
    const { data, error } = await supabase.functions.invoke('create-order', {
      body: { restaurant_id: 'xxx', items: [...] }
    })
    expect(error).toBeNull()
    expect(data.order.status).toBe('pending')
  })
})
```

### 7.3 E2E Tests

Critical flows with Detox (mobile) or Playwright (web):
1. Register → Verify → Login
2. Search → Select restaurant → Add to cart → Checkout
3. Order tracking → Status updates
4. Wallet → View balance → Withdraw

---

## 8. Monitoring

### 8.1 Supabase Dashboard
- Query performance
- Auth events
- Realtime connections
- Storage usage

### 8.2 External Tools

| Tool | Purpose |
|------|---------|
| Sentry | Error tracking (app + functions) |
| PostHog | Product analytics |
| UptimeRobot | Availability monitoring |

---

## Related Documents

- [DATA-MODEL.md](DATA-MODEL.md) - Database schema
- [API-CONTRACTS.md](API-CONTRACTS.md) - API specs
- [TECH-STACK.md](TECH-STACK.md) - Technology choices
- [../05-planning/IMPLEMENTATION-PLAN.md](../05-planning/IMPLEMENTATION-PLAN.md) - Task sequence
