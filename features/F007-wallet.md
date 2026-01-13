# F007 - Cashback Wallet

**ID:** F007
**Priority:** P0 (MVP)
**Status:** UI Implemented (Mobile)
**Estimate:** 4 DU

---

## Implementation Status

### Mobile App (apps/mobile)

**Implemented:**
- [x] Loyalty tab in bottom navigation (`app/(tabs)/loyalty.tsx`)
- [x] Wallet balance card with prominent display
- [x] "Retirer" (withdraw) button with confirmation dialog
- [x] "Historique" button with onPress handler (shows info alert)
- [x] Cashback summary showing total earned (10% rate)
- [x] Referral program section with QR code placeholder
- [x] Personal referral code display (TURK-XXXXXX format)
- [x] Commission type toggle (40% one-time vs 10% lifetime)
- [x] Share button using React Native Share API
- [x] Referral stats (friends referred, total earnings)
- [x] Transaction history list (cashback, referrals, withdrawals)
- [x] Transaction type icons and color coding

**Tab Configuration:**
- Tab name: "Fidélité" (star icon)
- Replaced "Épicerie" in tab bar
- Location: `app/(tabs)/_layout.tsx`

**Components:**
- `app/(tabs)/loyalty.tsx` - Complete loyalty screen (530 lines)

**Mock Data:**
- Wallet balance: €24.50
- Total cashback: €156.80
- Referral code: TURK-ABC123
- 3 referred users, €45.00 in referral earnings
- 5 mock transactions (cashback, referral, withdrawal)

**Not Yet Implemented:**
- [ ] Supabase integration for real wallet data
- [ ] Real QR code generation
- [ ] Bank account management for withdrawals
- [ ] Stripe Connect payout integration
- [ ] Transaction pagination
- [ ] Deep link handling for referral codes

---

## Overview

Digital wallet that accumulates cashback from orders. Users can apply balance to future orders or withdraw cash to their bank account (unique differentiator).

---

## User Stories

### US-024: View Wallet Balance
```
As a customer
I want to see my wallet balance
So I know how much credit I have

Acceptance Criteria:
- [ ] Display current balance prominently
- [ ] Show pending cashback (from in-progress orders)
- [ ] Display available vs total balance
- [ ] Quick access from profile and checkout
```

### US-025: Earn Cashback
```
As a customer
I want to earn cashback on orders
So I save money on future orders

Acceptance Criteria:
- [ ] 10% cashback on order subtotal
- [ ] Cashback credited after delivery confirmed
- [ ] Show cashback earned on order confirmation
- [ ] Pending cashback visible in wallet
```

### US-026: Use Wallet Balance
```
As a customer
I want to use my wallet balance
So I can pay less for orders

Acceptance Criteria:
- [ ] Toggle to apply wallet at checkout
- [ ] Partial application (use €5 of €10 balance)
- [ ] Auto-apply option in settings
- [ ] Show amount applied and remaining total
```

### US-027: View Transaction History
```
As a customer
I want to see my wallet transactions
So I can track my credits and spending

Acceptance Criteria:
- [ ] List all transactions (cashback, usage, withdrawal)
- [ ] Filter by type
- [ ] Show date, amount, description
- [ ] Link to related order
```

### US-028: Withdraw to Bank
```
As a customer
I want to withdraw my balance
So I can get real money

Acceptance Criteria:
- [ ] Minimum withdrawal: €10
- [ ] Add bank account (IBAN)
- [ ] Request withdrawal
- [ ] Processing time: 2-5 business days
- [ ] Transaction fee (if any) clearly shown
```

---

## Technical Specification

### Cashback Rules

| Scenario | Cashback Rate | Notes |
|----------|---------------|-------|
| Standard order | 10% | Of subtotal (before fees) |
| Promo order | Varies | May be higher/lower |
| Group order | 10% | Per participant's portion |
| Cancelled order | 0% | No cashback |
| Refunded order | Reversed | Cashback deducted |

### API Endpoints

```typescript
// GET /wallet
Response: {
  balance: 45.50,
  available_balance: 40.50, // After pending holds
  pending_cashback: 5.00,
  lifetime_earned: 250.00,
  lifetime_withdrawn: 100.00
}

// GET /wallet/transactions
Query: ?type=all|cashback|usage|withdrawal&page=1&limit=20
Response: {
  transactions: [{
    id: "uuid",
    type: "cashback", // cashback, usage, withdrawal, refund, adjustment
    amount: 2.25, // positive = credit, negative = debit
    balance_after: 45.50,
    description: "Cashback from order TK-2026-001234",
    order_id: "uuid",
    status: "completed", // pending, completed, failed
    created_at: "2026-01-12T14:35:00Z"
  }],
  pagination: {...}
}

// POST /wallet/withdraw
Request: {
  amount: 25.00,
  bank_account_id: "uuid"
}
Response: {
  withdrawal_id: "uuid",
  amount: 25.00,
  fee: 0.00,
  net_amount: 25.00,
  estimated_arrival: "2026-01-17",
  status: "processing"
}

// GET /wallet/bank-accounts
Response: {
  accounts: [{
    id: "uuid",
    bank_name: "BNP Paribas",
    iban_last4: "1234",
    is_default: true,
    status: "verified"
  }]
}

// POST /wallet/bank-accounts
Request: {
  iban: "FR7630006000011234567890189",
  account_holder_name: "Jean Dupont"
}
Response: {
  id: "uuid",
  status: "pending_verification"
}
```

### Database Schema

```sql
-- wallet_balance is on user_profiles (denormalized for performance)
-- wallet_transactions is source of truth

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),

  type VARCHAR(20) NOT NULL,
  -- cashback: earned from order
  -- usage: spent on order
  -- withdrawal: transferred to bank
  -- refund: returned from cancelled order
  -- adjustment: manual admin adjustment

  amount DECIMAL(10,2) NOT NULL, -- positive = credit, negative = debit
  balance_after DECIMAL(10,2) NOT NULL,

  -- References
  order_id UUID REFERENCES orders(id),
  withdrawal_id UUID REFERENCES withdrawals(id),

  description TEXT,
  status VARCHAR(20) DEFAULT 'completed',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user's transaction history
CREATE INDEX idx_wallet_transactions_user ON wallet_transactions(user_id, created_at DESC);

CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  iban VARCHAR(34) NOT NULL,
  iban_last4 VARCHAR(4) NOT NULL,
  bank_name VARCHAR(100),
  account_holder_name VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending_verification',
  -- pending_verification, verified, failed

  -- Stripe Connect payout destination
  stripe_bank_account_id VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  bank_account_id UUID REFERENCES bank_accounts(id),

  amount DECIMAL(10,2) NOT NULL,
  fee DECIMAL(6,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,

  status VARCHAR(20) DEFAULT 'pending',
  -- pending, processing, completed, failed

  stripe_payout_id VARCHAR(50),

  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failure_reason TEXT
);

-- Function to credit cashback
CREATE OR REPLACE FUNCTION credit_cashback(
  p_order_id UUID,
  p_user_id UUID,
  p_amount DECIMAL(10,2)
) RETURNS VOID AS $$
DECLARE
  new_balance DECIMAL(10,2);
BEGIN
  -- Update user balance
  UPDATE user_profiles
  SET wallet_balance = wallet_balance + p_amount
  WHERE id = p_user_id
  RETURNING wallet_balance INTO new_balance;

  -- Record transaction
  INSERT INTO wallet_transactions (user_id, type, amount, balance_after, order_id, description)
  VALUES (p_user_id, 'cashback', p_amount, new_balance, p_order_id,
          'Cashback from order ' || (SELECT order_number FROM orders WHERE id = p_order_id));
END;
$$ LANGUAGE plpgsql;

-- Function to debit wallet
CREATE OR REPLACE FUNCTION debit_wallet(
  p_order_id UUID,
  p_user_id UUID,
  p_amount DECIMAL(10,2)
) RETURNS BOOLEAN AS $$
DECLARE
  current_balance DECIMAL(10,2);
  new_balance DECIMAL(10,2);
BEGIN
  -- Check sufficient balance
  SELECT wallet_balance INTO current_balance
  FROM user_profiles WHERE id = p_user_id FOR UPDATE;

  IF current_balance < p_amount THEN
    RETURN FALSE;
  END IF;

  -- Debit balance
  UPDATE user_profiles
  SET wallet_balance = wallet_balance - p_amount
  WHERE id = p_user_id
  RETURNING wallet_balance INTO new_balance;

  -- Record transaction
  INSERT INTO wallet_transactions (user_id, type, amount, balance_after, order_id, description)
  VALUES (p_user_id, 'usage', -p_amount, new_balance, p_order_id,
          'Applied to order ' || (SELECT order_number FROM orders WHERE id = p_order_id));

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

### React Native Implementation

```typescript
// lib/stores/wallet-store.ts
import { create } from 'zustand';
import { api } from '../api';

interface Wallet {
  balance: number;
  pendingCashback: number;
  availableBalance: number;
}

interface WalletTransaction {
  id: string;
  type: 'cashback' | 'usage' | 'withdrawal' | 'refund';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

interface WalletState {
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  loading: boolean;
  fetchWallet: () => Promise<void>;
  fetchTransactions: (type?: string, page?: number) => Promise<void>;
  requestWithdrawal: (amount: number, bankAccountId: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  transactions: [],
  loading: false,

  fetchWallet: async () => {
    set({ loading: true });
    const { data } = await api.get('/wallet');
    set({ wallet: data, loading: false });
  },

  fetchTransactions: async (type = 'all', page = 1) => {
    const { data } = await api.get('/wallet/transactions', {
      params: { type, page },
    });
    set({ transactions: data.transactions });
  },

  requestWithdrawal: async (amount, bankAccountId) => {
    await api.post('/wallet/withdraw', { amount, bank_account_id: bankAccountId });
    // Refetch wallet after withdrawal request
    const { data } = await api.get('/wallet');
    set({ wallet: data });
  },
}));

// hooks/useWallet.ts (React Query version)
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data } = await api.get('/wallet');
      return data;
    },
  });
}

export function useWalletTransactions(type: string = 'all', page: number = 1) {
  return useQuery({
    queryKey: ['wallet', 'transactions', type, page],
    queryFn: async () => {
      const { data } = await api.get('/wallet/transactions', {
        params: { type, page },
      });
      return data.transactions;
    },
  });
}
```

---

## UI Screens

1. **Wallet Home** - Balance display + quick actions
2. **Transaction History** - Filterable list
3. **Withdraw Flow** - Amount → Bank account → Confirm
4. **Add Bank Account** - IBAN entry + verification
5. **Checkout Wallet Toggle** - Apply balance to order

---

## Dependencies

- F001 (Auth) - User must be logged in
- F004 (Ordering) - Cashback from orders
- F005 (Payments) - Wallet as payment method
- Stripe Connect for payouts

---

## Withdrawal Processing

1. User requests withdrawal (min €10)
2. System creates pending withdrawal
3. Background job processes via Stripe Payout
4. Stripe transfers to user's bank
5. Webhook confirms completion
6. Update withdrawal status + notify user

### Payout Schedule
- Withdrawals processed daily at 6 PM CET
- Stripe payouts: 2-5 business days to bank
- Weekend requests processed Monday

---

## Edge Cases

- Insufficient balance for withdrawal → Disable button, show minimum
- Bank account verification fails → Retry or enter new account
- Withdrawal fails → Refund to wallet, notify user
- Order refunded after cashback → Deduct from balance (can go negative)
- Negative balance → Block withdrawals until positive

---

## Testing Checklist

- [ ] Balance displays correctly
- [ ] Cashback credited after delivery
- [ ] Pending cashback shown for active orders
- [ ] Wallet applied at checkout
- [ ] Partial wallet usage
- [ ] Transaction history filters work
- [ ] Add bank account
- [ ] Request withdrawal
- [ ] Withdrawal processing
- [ ] Cancelled order reverses cashback
