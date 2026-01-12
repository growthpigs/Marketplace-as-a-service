# TurkEats - Runbook

**Project:** TurkEats (Marketplace-as-a-Service)
**Created:** 2026-01-12
**Status:** Pre-Development

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

## Contacts

| Role | Contact |
|------|---------|
| Tech Lead | Roderic |
| Operations | Daniel |
| Market Access | Stéphane |
| Stripe Support | support@stripe.com |

---

## Related Documents

- [../04-technical/TECH-STACK.md](../04-technical/TECH-STACK.md) - Technology stack
- [../04-technical/API-CONTRACTS.md](../04-technical/API-CONTRACTS.md) - API documentation
- [../05-planning/RISK-REGISTER.md](../05-planning/RISK-REGISTER.md) - Risk management
