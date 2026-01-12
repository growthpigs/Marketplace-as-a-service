-- TurkEats Initial Database Schema
-- Run this migration to set up the core database structure

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================
-- F001: USER PROFILES
-- =====================================================

CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20) UNIQUE,
  display_name VARCHAR(100),
  email VARCHAR(255),
  avatar_url TEXT,
  referral_code VARCHAR(10) UNIQUE NOT NULL,
  referred_by UUID REFERENCES public.user_profiles(id),
  wallet_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate unique referral code on insert
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code := UPPER(SUBSTR(MD5(NEW.id::text || NOW()::text), 1, 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code
BEFORE INSERT ON user_profiles
FOR EACH ROW
WHEN (NEW.referral_code IS NULL)
EXECUTE FUNCTION generate_referral_code();

-- =====================================================
-- F002: RESTAURANTS
-- =====================================================

CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  address TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),

  -- Delivery settings
  delivery_radius_km DECIMAL(4,1) DEFAULT 5.0,
  delivery_fee DECIMAL(5,2) DEFAULT 0,
  minimum_order DECIMAL(6,2) DEFAULT 0,
  delivery_time_min INT DEFAULT 30,
  delivery_time_max INT DEFAULT 45,

  -- Platform settings
  commission_rate DECIMAL(4,2) DEFAULT 5.00,
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, suspended

  -- Stripe Connect
  stripe_account_id VARCHAR(50),
  stripe_onboarded BOOLEAN DEFAULT false,

  -- Computed (updated by triggers)
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for location queries
CREATE INDEX idx_restaurants_location ON restaurants USING GIST(location);

-- Full-text search index
CREATE INDEX idx_restaurants_name_search ON restaurants USING GIN(to_tsvector('french', name));

-- Slug index
CREATE INDEX idx_restaurants_slug ON restaurants(slug);

-- Restaurant categories
CREATE TABLE public.restaurant_categories (
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category VARCHAR(50),
  PRIMARY KEY (restaurant_id, category)
);

-- Restaurant opening hours
CREATE TABLE public.restaurant_hours (
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  day_of_week INT, -- 0=Sunday, 6=Saturday
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT false,
  PRIMARY KEY (restaurant_id, day_of_week)
);

-- Function to get nearby restaurants
CREATE OR REPLACE FUNCTION get_nearby_restaurants(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  max_distance INT DEFAULT 5000
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  slug VARCHAR,
  image_url TEXT,
  rating DECIMAL,
  review_count INT,
  delivery_time_min INT,
  delivery_time_max INT,
  delivery_fee DECIMAL,
  minimum_order DECIMAL,
  distance_km DECIMAL,
  is_open BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.name,
    r.slug,
    r.image_url,
    r.rating,
    r.review_count,
    r.delivery_time_min,
    r.delivery_time_max,
    r.delivery_fee,
    r.minimum_order,
    ROUND((ST_Distance(r.location, ST_MakePoint(user_lng, user_lat)::geography) / 1000)::numeric, 2) as distance_km,
    -- Simple open check (can be enhanced)
    true as is_open
  FROM restaurants r
  WHERE r.status = 'active'
    AND ST_DWithin(r.location, ST_MakePoint(user_lng, user_lat)::geography, max_distance)
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- F003: MENU
-- =====================================================

CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.menu_items (
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

CREATE TABLE public.menu_item_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) DEFAULT 'single', -- single, multiple
  is_required BOOLEAN DEFAULT false,
  min_selections INT DEFAULT 0,
  max_selections INT,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.menu_item_option_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_id UUID REFERENCES menu_item_options(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  price_modifier DECIMAL(6,2) DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

-- Indexes
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);

-- =====================================================
-- F004 & F005: ORDERS & PAYMENTS
-- =====================================================

CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL, -- percentage, fixed
  discount_value DECIMAL(6,2) NOT NULL,
  min_order_value DECIMAL(6,2) DEFAULT 0,
  max_discount DECIMAL(6,2),
  max_uses INT,
  current_uses INT DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  restaurant_id UUID REFERENCES restaurants(id),

  -- Delivery
  delivery_address JSONB NOT NULL,
  delivery_instructions TEXT,

  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(6,2) DEFAULT 0,
  service_fee DECIMAL(6,2) DEFAULT 0,
  promo_discount DECIMAL(6,2) DEFAULT 0,
  wallet_credit_used DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Cashback
  cashback_rate DECIMAL(4,2) DEFAULT 10.00,
  cashback_amount DECIMAL(10,2) DEFAULT 0,

  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  -- pending -> confirmed -> preparing -> ready -> delivering -> delivered
  -- cancelled, refunded

  -- Timestamps
  placed_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  preparing_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  delivering_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  -- Payment
  payment_method VARCHAR(20), -- card, wallet, cash
  payment_status VARCHAR(20) DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(100),

  -- Promo
  promo_code_id UUID REFERENCES promo_codes(id),

  estimated_delivery_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  name VARCHAR(150) NOT NULL, -- Snapshot at order time
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(8,2) NOT NULL,
  options_price DECIMAL(8,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  options JSONB, -- Selected options snapshot
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  seq INT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 9) AS INT)), 0) + 1
  INTO seq
  FROM orders
  WHERE order_number LIKE 'TK-' || TO_CHAR(NOW(), 'YYYY') || '-%';

  NEW.order_number := 'TK-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_placed_at ON orders(placed_at DESC);

-- =====================================================
-- F005: PAYMENTS
-- =====================================================

CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id VARCHAR(50) NOT NULL,
  card_brand VARCHAR(20),
  card_last4 VARCHAR(4),
  card_exp_month INT,
  card_exp_year INT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  stripe_payment_intent_id VARCHAR(100),
  stripe_charge_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- F007: WALLET
-- =====================================================

CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- cashback, usage, withdrawal, refund
  amount DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  order_id UUID REFERENCES orders(id),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  iban VARCHAR(34) NOT NULL,
  bic VARCHAR(11),
  holder_name VARCHAR(100) NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES bank_accounts(id),
  amount DECIMAL(10,2) NOT NULL,
  fee DECIMAL(6,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  stripe_payout_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to credit cashback
CREATE OR REPLACE FUNCTION credit_cashback(
  p_user_id UUID,
  p_amount DECIMAL,
  p_order_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  new_balance DECIMAL;
BEGIN
  UPDATE user_profiles
  SET wallet_balance = wallet_balance + p_amount,
      updated_at = NOW()
  WHERE id = p_user_id
  RETURNING wallet_balance INTO new_balance;

  INSERT INTO wallet_transactions (user_id, type, amount, balance_after, order_id, description)
  VALUES (p_user_id, 'cashback', p_amount, new_balance, p_order_id,
          'Cashback from order ' || (SELECT order_number FROM orders WHERE id = p_order_id));

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to use wallet balance
CREATE OR REPLACE FUNCTION use_wallet_balance(
  p_user_id UUID,
  p_amount DECIMAL,
  p_order_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance DECIMAL;
  new_balance DECIMAL;
BEGIN
  SELECT wallet_balance INTO current_balance
  FROM user_profiles WHERE id = p_user_id FOR UPDATE;

  IF current_balance < p_amount THEN
    RETURN FALSE;
  END IF;

  new_balance := current_balance - p_amount;

  UPDATE user_profiles
  SET wallet_balance = new_balance, updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO wallet_transactions (user_id, type, amount, balance_after, order_id, description)
  VALUES (p_user_id, 'usage', -p_amount, new_balance, p_order_id,
          'Applied to order ' || (SELECT order_number FROM orders WHERE id = p_order_id));

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Indexes
CREATE INDEX idx_wallet_transactions_user ON wallet_transactions(user_id);
CREATE INDEX idx_withdrawal_requests_user ON withdrawal_requests(user_id);

-- =====================================================
-- F008: GROUP ORDERS
-- =====================================================

CREATE TABLE public.group_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(8) UNIQUE NOT NULL,
  host_id UUID REFERENCES auth.users(id),
  restaurant_id UUID REFERENCES restaurants(id),
  delivery_address JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  deadline TIMESTAMPTZ NOT NULL,
  submitted_order_id UUID REFERENCES orders(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.group_order_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_order_id UUID REFERENCES group_orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  display_name VARCHAR(100),
  payment_status VARCHAR(20) DEFAULT 'pending',
  subtotal DECIMAL(10,2) DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.group_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_order_id UUID REFERENCES group_orders(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES group_order_participants(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  name VARCHAR(150) NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(8,2) NOT NULL,
  options_price DECIMAL(8,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  options JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate group order code
CREATE OR REPLACE FUNCTION generate_group_order_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code := UPPER(SUBSTR(MD5(RANDOM()::TEXT || NOW()::TEXT), 1, 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_group_order_code
BEFORE INSERT ON group_orders
FOR EACH ROW
WHEN (NEW.code IS NULL)
EXECUTE FUNCTION generate_group_order_code();

-- Indexes
CREATE INDEX idx_group_orders_code ON group_orders(code);
CREATE INDEX idx_group_orders_host ON group_orders(host_id);

-- =====================================================
-- REVIEWS
-- =====================================================

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  restaurant_id UUID REFERENCES restaurants(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update restaurant rating on new review
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restaurants
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM reviews
    WHERE restaurant_id = NEW.restaurant_id AND is_public = true
  ),
  review_count = (
    SELECT COUNT(*)
    FROM reviews
    WHERE restaurant_id = NEW.restaurant_id AND is_public = true
  ),
  updated_at = NOW()
  WHERE id = NEW.restaurant_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();

CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- User profiles: users can read/update their own
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Orders: users can read their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Restaurants can view their orders
CREATE POLICY "Restaurants can view their orders"
  ON orders FOR SELECT
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Wallet: users can view their own transactions
CREATE POLICY "Users can view own wallet transactions"
  ON wallet_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Public read for restaurants
CREATE POLICY "Anyone can view active restaurants"
  ON restaurants FOR SELECT
  USING (status = 'active');

-- Public read for menu
CREATE POLICY "Anyone can view menu categories"
  ON menu_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view menu items"
  ON menu_items FOR SELECT
  USING (is_available = true OR is_available = false);

CREATE POLICY "Anyone can view menu options"
  ON menu_item_options FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view option choices"
  ON menu_item_option_choices FOR SELECT
  USING (true);

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON restaurants
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON menu_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
