# TurkEats - Runbook

**Project:** TurkEats (Marketplace-as-a-Service)
**Created:** 2026-01-12
**Last Updated:** 2026-01-23
**Status:** Demo Ready (Mobile MVP Complete)

---

## Verification Commands

**Rule:** Run these commands FIRST before assuming anything works.

### Expo Dev Server Health Check

```bash
# Check if Expo is running on expected port
lsof -i :8082 | head -3

# Expected: node or expo process on port 8082
# If empty: npx expo start --web --port 8082
```

### API Server Health Check

```bash
# Test API is responding
curl -s http://localhost:3000/health | jq .

# Expected: { "status": "ok" }
# If error: cd apps/api && npm run dev
```

### TypeScript Compilation Check

```bash
# Verify no type errors across monorepo
cd /Users/rodericandrews/_PAI/projects/personal/marketplace

# API
npx tsc --noEmit -p apps/api/tsconfig.json

# Mobile
npx tsc --noEmit -p apps/mobile/tsconfig.json

# Expected: No output (success) or specific errors to fix
```

### Startup Checklist

Before working on this project, verify:

```
□ 1. Git branch: main or feature branch? (git branch --show-current)
□ 2. Expo server running? (lsof -i :8082)
□ 3. API server running? (curl localhost:3000/health)
□ 4. .env files have REAL values (not placeholders)?
□ 5. TypeScript compiles? (npx tsc --noEmit)
□ 6. Last commit synced? (git status)
```

---

## Critical Patterns (DO NOT REGRESS)

### Browse → Home Navigation

The Browse tab navigates to Home with URL params. This pattern MUST be preserved:

```typescript
// browse.tsx - Navigating with params
router.push({
  pathname: '/',
  params: { collection: collectionId }
});

// index.tsx - Reading params and applying filters
const params = useLocalSearchParams<{ category?: string; collection?: string }>();

useEffect(() => {
  if (params.category) setSelectedCategory(params.category);
  if (params.collection) {
    // Apply appropriate filter based on collection
  }
}, [params.category, params.collection]);
```

### Demo Mode Checkout

The checkout flow works without backend in demo mode:

```typescript
// review.tsx - Demo mode detection
const isDemoMode = Constants.expoConfig?.extra?.ENV === 'development';

if (isDemoMode) {
  // Skip real API call, simulate success
  await new Promise(resolve => setTimeout(resolve, 1500));
  router.push({ pathname: '/checkout/confirmation', params: { orderId: mockOrderId } });
}
```

---

## Quick Reference

| Resource | URL/Location |
|----------|--------------|
| Repo | GitHub (TBD) |
| API | TBD |
| Dashboard | TBD |
| Database | Neon (TBD) |
| Monitoring | Sentry (TBD) |
| Analytics | PostHog (TBD) |

---

## Development Setup

### Prerequisites

```bash
# Node.js 20+
node --version

# pnpm (preferred)
pnpm --version

# Docker (for local services)
docker --version
```

### Local Setup

```bash
# Clone repo
git clone <repo-url>
cd turkeats

# Install dependencies
pnpm install

# Copy environment
cp .env.example .env.local

# Start database (Docker)
docker-compose up -d postgres redis

# Run migrations
pnpm db:migrate

# Start development
pnpm dev
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/turkeats

# Auth
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Maps
GOOGLE_MAPS_API_KEY=...

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...

# Twilio (SMS)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
```

---

## Deployment

### Staging

```bash
# Deploy to staging
git push origin main  # Auto-deploys via Render/Vercel
```

### Production

```bash
# Create release
git tag v1.0.0
git push --tags

# Manual deployment trigger (TBD)
```

---

## Operations

### Database

```bash
# Connect to production DB (via Neon)
npx neonctl connect

# Run migration
pnpm db:migrate:prod

# Backup (automatic via Neon)
```

### Monitoring

**Sentry Alerts:**
- Error rate > 1% - Slack notification
- New issue types - Email to team

**Uptime:**
- API health check: `GET /health`
- Expected response: `{ "status": "ok", "db": "connected" }`

---

## Incident Response

### Severity Levels

| Level | Definition | Response Time |
|-------|------------|---------------|
| P1 | Service down, payments failing | < 1 hour |
| P2 | Major feature broken | < 4 hours |
| P3 | Minor issue, workaround exists | < 24 hours |
| P4 | Cosmetic, non-urgent | Next sprint |

### On-Call Rotation

| Week | Primary | Backup |
|------|---------|--------|
| Current | Roderic | Daniel |

### Escalation

1. Check Sentry for errors
2. Check service status (Render/Neon dashboards)
3. Check recent deploys
4. Rollback if recent deploy suspected
5. Escalate to team Slack channel

---

## Common Tasks

### Add New Restaurant

```sql
-- Manual onboarding (admin dashboard preferred)
INSERT INTO restaurants (name, email, phone, address, latitude, longitude, category)
VALUES ('Restaurant Name', 'email@example.com', '+33...', 'Address', 48.8566, 2.3522, 'assiette_grec');
```

### Process Withdrawal

1. Check wallet balance in admin dashboard
2. Verify IBAN validity
3. Create Stripe transfer
4. Update withdrawal_requests status

### Debug Order Issues

```sql
-- Find order
SELECT * FROM orders WHERE order_number = 'TK-20260112-001';

-- Check status history
SELECT * FROM order_status_history WHERE order_id = '...';

-- Check wallet transaction
SELECT * FROM wallet_transactions WHERE reference_id = '...';
```

---

## API Rate Limits

| Endpoint | Limit |
|----------|-------|
| Auth (login/register) | 5/min per IP |
| Orders (create) | 10/min per user |
| General | 100/min per user |

---

## Scheduled Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| Process cashback | Every hour | Credit pending cashback |
| Process withdrawals | Daily 10:00 | Batch withdrawal payments |
| Send reminders | Daily 11:00 | Incomplete order reminders |
| Analytics sync | Daily 02:00 | Sync to PostHog |

---

## Common Issues & Fixes

### Port Already in Use

```bash
# Find and kill process on port
lsof -ti :8082 | xargs kill -9
```

### Expo Metro Bundler Stuck

```bash
# Clear Metro cache and restart
npx expo start --clear --port 8082
```

### Pre-commit Hook Failing (Secrets Detection)

The hook flags `SUPABASE.*KEY.*=.*ey` pattern. If it's a false positive:

```bash
git reset HEAD apps/api/src/lib/supabase.ts
git checkout apps/api/src/lib/supabase.ts
git commit  # Without the flagged file
```

---

## Contacts

| Role | Contact | Entity |
|------|---------|--------|
| Tech Lead | Roderic Andrews | Rive Gosh LLC (50%) |
| Operations | Daniel Amaury | Rive Gosh LLC (50%) |
| Market Access | Stéphane | Profit Share (10%) |
| Stripe Support | support@stripe.com | - |

**Legal Entity:** Rive Gosh LLC (Wyoming) - Formation pending
**Bank:** Revolut Business

---

## Related Documents

- [../04-technical/TECH-STACK.md](../04-technical/TECH-STACK.md) - Technology stack
- [../04-technical/API-CONTRACTS.md](../04-technical/API-CONTRACTS.md) - API documentation
- [../05-planning/RISK-REGISTER.md](../05-planning/RISK-REGISTER.md) - Risk management
