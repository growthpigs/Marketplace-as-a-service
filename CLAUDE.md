# TurkEats - Project Instructions

**Codename:** TurkEats
**Type:** Food delivery marketplace (Uber Eats clone for Turkish/kebab restaurants)
**Phase:** D (Development) - Mobile MVP Complete, Demo Ready
**Confidence:** 8.5/10

---

## Quick Start

```bash
# Mobile app (Expo)
cd apps/mobile && npm run start

# API (NestJS)
cd apps/api && npm run start:dev

# Restaurant Dashboard (Next.js)
cd apps/restaurant-dashboard && npm run dev
```

**GitHub:** https://github.com/growthpigs/Marketplace-as-a-service
**Branches:** `main` (production), `staging` (current work)

---

## Architecture

### Monorepo Structure

```
marketplace-as-a-service/
├── apps/
│   ├── mobile/              # React Native + Expo Router (customer app)
│   ├── api/                 # NestJS backend
│   └── restaurant-dashboard/ # Next.js restaurant portal
├── docs/                    # PAI documentation (10-folder structure)
├── features/                # Feature specs (F0XX-*.md)
├── working/                 # Active session docs
└── supabase/                # Database migrations & config
```

### Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Mobile | Expo + React Native | Expo Router for navigation |
| State | React Context + useReducer | CartContext, CheckoutContext |
| Backend | NestJS | TypeScript, modular architecture |
| Database | Supabase (PostgreSQL) | RLS enabled |
| Dashboard | Next.js 14 | App router, TypeScript |
| Payments | Stripe (planned) | Currently 100% mocked |
| Maps | Google Maps API | For delivery address |

---

## Current Status: Demo Ready

### What Works (Verified 2026-01-13)

| Feature | Status | Notes |
|---------|--------|-------|
| Home Screen | ✅ | Restaurant listings, categories, search |
| Restaurant Detail | ✅ | Menu, ratings, delivery info |
| Cart Management | ✅ | Add/remove items, quantity, totals |
| Checkout Flow | ✅ | Address → Time → Payment → Review |
| Address Entry | ✅ | Manual + GPS location |
| Fee Calculations | ✅ | Service fee 2%, delivery, cashback 10% |
| Error Handling | ✅ | French user-friendly messages |
| Minimum Order | ✅ | Validation added (commit e8c191b) |

### What's Mocked (Expected for MVP)

- Payment processing (no real Stripe yet)
- Order submission to backend (uses **Demo Mode** - see below)
- Order tracking
- Wallet redemption
- Restaurant dashboard CRUD

### Demo Mode (CRITICAL - Don't Regress)

**Location:** `apps/mobile/app/checkout/review.tsx` lines 145-207

**Behavior:** When `EXPO_PUBLIC_ENV=development` or `demo`, order submission:
- Skips the real API call to `POST /api/orders`
- Simulates 1.5s network delay
- Generates mock order ID: `demo-order-{timestamp}`
- Logs `[DEMO MODE]` to console
- Proceeds to confirmation screen

**Why:** Allows full checkout flow testing without running the API backend.

**To enable real API:** Set `EXPO_PUBLIC_ENV=production` and ensure API is running on port 3000.

```typescript
// Demo mode detection (review.tsx:147-149)
const isDemoMode = process.env.EXPO_PUBLIC_ENV === 'demo' ||
                   process.env.EXPO_PUBLIC_ENV === 'development' ||
                   !process.env.EXPO_PUBLIC_API_URL;
```

---

## Key Business Rules

```
Customer pays:     Order + 2% service fee + delivery
Restaurant keeps:  95% of order value
Platform gets:     5% commission + 2% service fee
Cashback:          10% to customer wallet (after delivery)
```

### Fee Calculation Example
```
Assiette Grec:     €12.90
Service (2%):      €0.26
Delivery:          €0.49
Total:             €13.65
Cashback (10%):    €1.29 → wallet
```

---

## Critical Files

### Mobile App (`apps/mobile/`)

| File | Purpose |
|------|---------|
| `context/CartContext.tsx` | Cart state, meetsMinOrder, fee calculations |
| `context/CheckoutContext.tsx` | Checkout flow state machine |
| `app/checkout/review.tsx` | Order review + submission handler |
| `app/checkout/payment.tsx` | Mock payment selection |
| `app/checkout/confirmation.tsx` | Success screen with animation |
| `app/(tabs)/index.tsx` | Home screen with restaurants |
| `app/restaurant/[id].tsx` | Restaurant detail + menu |

### API (`apps/api/`)

| File | Purpose |
|------|---------|
| `src/orders/orders.controller.ts` | Order endpoints |
| `src/orders/dto/create-order.dto.ts` | Order schema validation |
| `src/lib/supabase.ts` | Database client + mock auth |

---

## Known Issues & Limitations

### Critical (Must Fix Before Real Payments)

1. **No idempotency key** - Risk of duplicate orders on retry
2. **Mock auth token hardcoded** - `'mock-jwt-token-placeholder'` in multiple files

### Medium Priority

3. **Address parsing** - Manual entry as single string doesn't extract postalCode
4. **Fee calculations duplicated** - In both CartContext and review.tsx

### Low Priority (Expected for MVP)

5. **Context resets on URL navigation** - React state is in-memory only
6. **Scheduled delivery not implemented** - UI shows "Bientôt disponible"

---

## Development Conventions

### Code Standards
- TypeScript everywhere (strict mode)
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- Pre-commit hooks run: secrets check, TypeScript, lint, build

### File Naming
- Components: PascalCase (`RestaurantCard.tsx`)
- Hooks: camelCase with `use` prefix (`useCart.ts`)
- Utils: camelCase (`calculateFees.ts`)

### Context Pattern
```typescript
// State + reducer for complex state
const [state, dispatch] = useReducer(cartReducer, initialState);

// Computed values derived from state
const subtotal = useMemo(() => calculateSubtotal(state.items), [state.items]);
const meetsMinOrder = subtotal >= state.minOrder;

// Return both state and computed
return { state, subtotal, total, meetsMinOrder, addItem, removeItem };
```

---

## Architecture Standards (MANDATORY)

### Multi-Tenant & Agnostic Design
- **No hardcoded dynamic values** - restaurant IDs, user IDs, URLs must be configurable
- **Environment variables for all configs** - never hardcode secrets, API keys, or URLs
- **Use `process.env.*` everywhere** - no `localhost:3000` or similar literals

### Versioned Nomenclature
- **Feature branches:** `alpha-featureX`, `bravo-featureY`, `charlie-featureZ`
- **Task versions:** `V1.3_report`, `V2.0_checkout`
- **Prefix iterations:** alpha → bravo → charlie → delta for major revisions

### Mock Data Policy
- **Avoid mocks unless absolutely necessary** for MVP demo
- **Document all mocks** with `// TODO: Replace mock with real data`
- **Current MVP mocks (to remove post-MVP):**
  - `mock-jwt-token-placeholder` in auth
  - Mock restaurant data in `restaurant/[id].tsx`
  - Mock payment methods in `checkout/payment.tsx`
  - Mock cashback in `checkout/confirmation.tsx`

### Backend Change Protocol
1. **Explicit communication** before deploy
2. **Push to staging first** - staging is stable anchor
3. **Test on staging** before main
4. **Document in runlog** with date and changes

### API Requirements
- **Return correct data types** - no implicit coercion
- **Handle errors explicitly** - no silent failures
- **Verify routes don't serve static assets** by mistake

### Monitoring & Logging
- **Health check scripts** for API monitoring
- **Dated runlog entries** in Notion nuggets
- **No "works on my machine"** - verify in staging

---

## Current Tech Debt (from standards audit)

| Issue | Location | Priority |
|-------|----------|----------|
| `localhost:3000` hardcoded | `payment.tsx:71`, `review.tsx:208` | High |
| `mock-jwt-token-placeholder` | Multiple files | High |
| Mock restaurant data | `restaurant/[id].tsx:53` | Medium |
| Mock user data | `loyalty.tsx:52` | Medium |
| Mock cashback value | `confirmation.tsx:142` | Low |

---

## Living Documents (CRITICAL)

- **Feature specs live in `/features/F0XX-*.md`** - Source of truth
- **Never create orphan plan files** - Add "Implementation Plan" to feature file
- **Update `features/INDEX.md`** when starting/completing features
- **Active tasks in `working/active-tasks.md`** - Links to living docs

---

## Session Protocol

### Start of Session
1. Read `working/handover.md` (if exists)
2. Check `features/INDEX.md` for current work
3. Run `git status` to see pending changes
4. Start Expo: `cd apps/mobile && npm run start`

### End of Session
1. Update `working/handover.md` with progress
2. Update feature status in `features/INDEX.md`
3. Commit and push: `git push origin staging`
4. Kill Expo if running: `pkill -f expo`

---

## Demo Script

1. **Home** → Show restaurant listings (Kebab Palace, Le Roi du Döner)
2. **Select restaurant** → Show menu with prices
3. **Add item** → Assiette Grec (€12.90) - shows cart bar
4. **Checkout** → Use GPS for address (avoids manual parsing issue)
5. **Delivery time** → ASAP selected by default
6. **Payment** → Point out "Mode démo" yellow banner
7. **Review** → Show fee breakdown and cashback
8. **Talk track:** "This is the full checkout flow. Payment integration is phase 2."

---

## Quick Links

| Doc | Location |
|-----|----------|
| **Verification Report** | `working/CHECKOUT-FLOW-VERIFIED-2026-01-13.md` |
| **Audit Report** | `working/AUDIT-EXPERT-REVIEW-2026-01-13.md` |
| Vision | `docs/01-product/VISION.md` |
| MVP PRD | `docs/01-product/MVP-PRD.md` |
| Data Model | `docs/04-technical/DATA-MODEL.md` |
| API Contracts | `docs/04-technical/API-CONTRACTS.md` |
| Features | `features/INDEX.md` |
| Runbook | `docs/06-reference/RUNBOOK.md` |

---

## Team

| Partner | Role |
|---------|------|
| Roderic | Tech, Product, Marketing, Design |
| Daniel | Sales, BizDev, Operations |
| Stéphane | Market Access (revenue share) |

**Legal entity:** Badaboost LLC (Delaware)

---

## Related PAI Docs

- Global CLAUDE.md: `~/.claude/CLAUDE.md`
- PAI Reference: `~/.claude/skills/PAI/REF.md`
- Feature Workflow: `~/.claude/skills/CORE/FEATURE-WORKFLOW.md`
