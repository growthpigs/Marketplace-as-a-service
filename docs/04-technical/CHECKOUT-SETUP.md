# Checkout Flow Setup Guide

## Overview

This guide documents the external services and API keys required for the TurkEats checkout flow.

---

## Required API Keys

### 1. Stripe (Payment Processing)

**Purpose:** Process payments via Payment Sheet (cards, Apple Pay, Google Pay)

**Get Keys:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create account or log in
3. Navigate to Developers → API Keys
4. Copy the **Publishable key** (starts with `pk_test_` or `pk_live_`)
5. Copy the **Secret key** (starts with `sk_test_` or `sk_live_`)

**Environment Variables:**

```bash
# Mobile (.env)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# API (.env)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # From webhook setup
```

**Additional Stripe Setup:**
- [ ] Enable Stripe Connect (for restaurant payouts)
- [ ] Create Connect account: Settings → Connect → Get started
- [ ] Copy `STRIPE_CONNECT_CLIENT_ID` from Connect settings

### 2. Google Maps Platform (Address Autocomplete)

**Purpose:** Address autocomplete and geocoding for delivery locations

**Get Keys:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project or select existing
3. Enable APIs:
   - Places API
   - Geocoding API
   - Maps SDK for Android
   - Maps SDK for iOS
4. Create credentials → API Key
5. Restrict key to:
   - Android apps (add package name)
   - iOS apps (add bundle ID)
   - Enabled APIs only

**Environment Variables:**

```bash
# Mobile (.env)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...

# API (.env)
GOOGLE_MAPS_API_KEY=AIza...  # Server-side geocoding
```

---

## Dependencies Installed

### Mobile App (`apps/mobile/package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| `@stripe/stripe-react-native` | ^0.41.0 | Payment Sheet UI |
| `react-native-google-places-autocomplete` | ^2.5.6 | Address input |
| `react-native-maps` | ^1.26.20 | Map display |
| `expo-location` | ^19.0.8 | User location |

### API (`apps/api/package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| `stripe` | ^20.1.2 | Payment processing backend |

---

## Stripe Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Customer taps "Pay"                                      │
│     └─> Mobile calls API: POST /checkout/create-intent      │
│                                                              │
│  2. API creates PaymentIntent                                │
│     └─> Stripe returns client_secret + ephemeralKey         │
│                                                              │
│  3. Mobile shows Payment Sheet                               │
│     └─> Customer enters card / Apple Pay / Google Pay       │
│                                                              │
│  4. Stripe confirms payment                                  │
│     └─> Webhook fires: payment_intent.succeeded              │
│                                                              │
│  5. API receives webhook                                     │
│     └─> Create order in Supabase                            │
│     └─> Calculate cashback                                   │
│     └─> Queue restaurant notification                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Supabase Schema (Already Created)

The following tables support checkout:

| Table | Purpose |
|-------|---------|
| `orders` | Order records with delivery address, totals |
| `order_items` | Line items with price snapshots |
| `payments` | Stripe payment references |
| `wallet_transactions` | Cashback credits/debits |

Key functions:
- `calculate_order_cashback()` - 10% cashback calculation
- `process_order_cashback()` - Credit wallet after delivery

---

## Testing Checklist

Before going live:

- [ ] Test card payments (use Stripe test cards)
- [ ] Test Apple Pay (requires sandbox account)
- [ ] Test Google Pay (requires test account)
- [ ] Test address autocomplete with French addresses
- [ ] Test order creation in Supabase
- [ ] Test webhook delivery locally (use Stripe CLI)
- [ ] Test cashback calculation

### Stripe Test Cards

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Declined (insufficient funds) |
| 4000 0025 0000 3155 | Requires 3D Secure |

---

## Quick Start

```bash
# 1. Install dependencies
cd apps/mobile && npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 3. Run mobile app
npm start

# 4. Test on device (Payment Sheet requires real device)
```

---

## Stripe Sync Engine (Optional)

For querying payment data directly in Supabase:
- [Supabase Blog: Stripe Sync Engine](https://supabase.com/blog/stripe-sync-engine-integration)
- One-click setup syncs Stripe data to PostgreSQL
- Useful for dashboards, analytics, reconciliation
