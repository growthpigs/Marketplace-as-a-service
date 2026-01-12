# F007 - Cashback Wallet

**ID:** F007
**Priority:** P0 (MVP)
**Status:** Spec Complete
**Estimate:** 4 DU

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

### Flutter Implementation

```dart
// lib/features/wallet/providers/wallet_provider.dart
@riverpod
Future<Wallet> wallet(WalletRef ref) async {
  final response = await ref.read(apiProvider).get('/wallet');
  return Wallet.fromJson(response);
}

@riverpod
Future<List<WalletTransaction>> walletTransactions(
  WalletTransactionsRef ref, {
  String? type,
  int page = 1,
}) async {
  final response = await ref.read(apiProvider).get(
    '/wallet/transactions',
    queryParams: {'type': type ?? 'all', 'page': page},
  );
  return (response['transactions'] as List)
      .map((t) => WalletTransaction.fromJson(t))
      .toList();
}

// lib/features/wallet/screens/wallet_screen.dart
class WalletScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final wallet = ref.watch(walletProvider);

    return Scaffold(
      body: wallet.when(
        data: (w) => Column(
          children: [
            BalanceCard(
              balance: w.balance,
              pending: w.pendingCashback,
            ),
            WithdrawButton(
              enabled: w.availableBalance >= 10,
              onTap: () => Navigator.push(...),
            ),
            TransactionsList(),
          ],
        ),
        ...
      ),
    );
  }
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
