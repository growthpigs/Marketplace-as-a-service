-- Add Stripe fields for payment processing
-- This migration adds Stripe integration fields to support F005-payments

-- Add stripe_customer_id to user_profiles for Stripe payment method storage
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(50);

-- Add stripe_account_status to restaurants (stripe_account_id already exists)
-- Status: pending, enabled, disabled
ALTER TABLE public.restaurants
ADD COLUMN IF NOT EXISTS stripe_account_status VARCHAR(20) DEFAULT 'pending';

-- Index for quick Stripe customer lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer_id
ON public.user_profiles(stripe_customer_id);

-- Index for quick Stripe account lookup
CREATE INDEX IF NOT EXISTS idx_restaurants_stripe_account_id
ON public.restaurants(stripe_account_id);
