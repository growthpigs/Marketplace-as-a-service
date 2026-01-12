# TurkEats - Data Model

**Project:** TurkEats (Marketplace-as-a-Service)
**Created:** 2026-01-12
**Status:** Draft

---

## Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Users    │────<│   Orders    │>────│ Restaurants │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │            ┌──────┴──────┐            │
       │            │             │            │
       ▼            ▼             ▼            ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Wallets   │ │ OrderItems  │ │GroupOrders  │ │   Menus     │
└─────────────┘ └─────────────┘ └─────────────┘ └──────┬──────┘
                                                       │
                                                       ▼
                                               ┌─────────────┐
                                               │ MenuItems   │
                                               └─────────────┘
```

---

## Core Tables

### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,

  -- Referral system
  referral_code VARCHAR(10) UNIQUE NOT NULL,
  referred_by_id UUID REFERENCES users(id),
  referral_type VARCHAR(20), -- 'one_time' | 'lifetime'

  -- Profile
  default_address_id UUID,
  avatar_url VARCHAR(500),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

### restaurants

```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),

  -- Basic info
  name VARCHAR(200) NOT NULL,
  description TEXT,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),

  -- Location
  address VARCHAR(500) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  city VARCHAR(100),
  postal_code VARCHAR(10),

  -- Business
  category VARCHAR(50) NOT NULL, -- 'assiette_grec', 'sandwich', 'soup', etc.
  commission_rate DECIMAL(4, 2) DEFAULT 5.00,
  minimum_order DECIMAL(10, 2) DEFAULT 10.00,
  delivery_radius_km INTEGER DEFAULT 5,

  -- Operations
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'active' | 'suspended'
  accepts_cash BOOLEAN DEFAULT false,
  self_delivery BOOLEAN DEFAULT true,

  -- Branding
  logo_url VARCHAR(500),
  cover_image_url VARCHAR(500),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### menu_categories

```sql
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### menu_items

```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id),

  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),

  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  -- Options (JSON for flexibility)
  options JSONB, -- [{name: "Sauce", choices: [{name: "Harissa", price: 0.50}]}]

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### orders

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL, -- TK-20260112-001

  user_id UUID REFERENCES users(id),
  restaurant_id UUID REFERENCES restaurants(id),
  group_order_id UUID REFERENCES group_orders(id),

  -- Status
  status VARCHAR(30) DEFAULT 'pending',
  -- 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'

  -- Delivery
  delivery_type VARCHAR(20) NOT NULL, -- 'delivery' | 'pickup'
  delivery_address TEXT,
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  delivery_instructions TEXT,
  estimated_delivery_at TIMESTAMP,
  delivered_at TIMESTAMP,

  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  service_fee DECIMAL(10, 2) NOT NULL, -- 2% service fee
  tip DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,

  -- Cashback
  cashback_earned DECIMAL(10, 2) DEFAULT 0,
  wallet_applied DECIMAL(10, 2) DEFAULT 0,

  -- Payment
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(30),
  stripe_payment_id VARCHAR(100),

  -- Notes
  customer_notes TEXT,
  restaurant_notes TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### order_items

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),

  name VARCHAR(200) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,

  options_selected JSONB, -- [{name: "Sauce", choice: "Harissa", price: 0.50}]
  special_instructions TEXT,

  -- For group orders: who ordered this item
  ordered_by_user_id UUID REFERENCES users(id),

  created_at TIMESTAMP DEFAULT NOW()
);
```

### group_orders

```sql
CREATE TABLE group_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_user_id UUID REFERENCES users(id),
  restaurant_id UUID REFERENCES restaurants(id),

  share_code VARCHAR(10) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'open', -- 'open' | 'locked' | 'ordered' | 'cancelled'

  delivery_address TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);
```

### wallets

```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id),
  balance DECIMAL(10, 2) DEFAULT 0,
  total_earned DECIMAL(10, 2) DEFAULT 0,
  total_withdrawn DECIMAL(10, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### wallet_transactions

```sql
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES wallets(id),

  type VARCHAR(30) NOT NULL,
  -- 'cashback' | 'referral_bonus' | 'order_payment' | 'withdrawal' | 'adjustment'

  amount DECIMAL(10, 2) NOT NULL, -- Positive = credit, negative = debit
  balance_after DECIMAL(10, 2) NOT NULL,

  reference_type VARCHAR(30), -- 'order' | 'referral' | 'withdrawal_request'
  reference_id UUID,

  description TEXT,

  status VARCHAR(20) DEFAULT 'completed', -- 'pending' | 'completed' | 'failed'

  created_at TIMESTAMP DEFAULT NOW()
);
```

### referrals

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id),
  referred_id UUID REFERENCES users(id),

  commission_type VARCHAR(20) NOT NULL, -- 'one_time' | 'lifetime'
  one_time_payout_percentage DECIMAL(4, 2), -- 40%
  lifetime_percentage DECIMAL(4, 2), -- e.g., 2%

  total_orders INTEGER DEFAULT 0,
  total_earned DECIMAL(10, 2) DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW()
);
```

### withdrawal_requests

```sql
CREATE TABLE withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),

  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'processing' | 'completed' | 'rejected'

  bank_name VARCHAR(100),
  iban VARCHAR(34),

  processed_at TIMESTAMP,
  payout_reference VARCHAR(100),

  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Indexes

```sql
-- Users
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by_id);

-- Restaurants
CREATE INDEX idx_restaurants_location ON restaurants USING GIST (
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_restaurants_status ON restaurants(status);
CREATE INDEX idx_restaurants_category ON restaurants(category);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Wallet Transactions
CREATE INDEX idx_wallet_tx_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_tx_created ON wallet_transactions(created_at DESC);
```

---

## Related Documents

- [API-CONTRACTS.md](API-CONTRACTS.md) - API specifications
- [TECH-STACK.md](TECH-STACK.md) - Technology choices
- [../01-product/MVP-PRD.md](../01-product/MVP-PRD.md) - Requirements
