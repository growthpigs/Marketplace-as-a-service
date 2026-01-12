# TurkEats - Technical Stack

**Project:** TurkEats (Marketplace-as-a-Service)
**Created:** 2026-01-12
**Status:** Decision Phase

---

## Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT APPS                            │
├─────────────────┬───────────────────┬───────────────────────┤
│ Customer App    │ Restaurant App    │ Admin Dashboard       │
│ (Android)       │ (Android/Web)     │ (Web)                 │
└────────┬────────┴─────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                       API GATEWAY                            │
│                  (REST + WebSocket)                          │
└─────────────────────────────┬───────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Core Services  │  │  Payment Svc    │  │  Notification   │
│  (Orders, Menu) │  │  (Stripe)       │  │  (Push, SMS)    │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                       PostgreSQL                             │
│                  (Primary Database)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Choices

### Mobile Apps (React Native + Expo)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | **Expo SDK 52** | Managed workflow, instant device testing |
| Language | **TypeScript** | Type safety, consistent with backend |
| State | **Zustand** | Lightweight, simple, TS-first |
| Navigation | **Expo Router** | File-based routing (like Next.js) |
| Maps | **react-native-maps** | Google Maps + Apple Maps support |
| HTTP | **Axios** + **React Query** | Caching, retry, optimistic updates |
| Local Storage | **expo-secure-store** | Secure token storage |
| Forms | **React Hook Form** + **Zod** | Type-safe form validation |

**Why Expo over Flutter:**
- TypeScript everywhere (backend + dashboard + mobile)
- Expo Go for instant device testing (no native builds)
- Zero setup friction (Node.js only)
- Excellent Claude Code support for TypeScript

**Platform Strategy:** iOS establishes design patterns → Android builds for target market → Both ship together.

### Backend (Node.js/TypeScript)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Runtime | **Node.js 20 LTS** | Stable, long-term support |
| Language | **TypeScript 5.x** | Type safety, better DX |
| Framework | **NestJS** | Structured, testable, enterprise patterns |
| Database | **Supabase** (PostgreSQL) | Auth + realtime + storage included |
| DB Client | **@supabase/supabase-js** | Direct queries, RPC functions, realtime |
| Cache | **Upstash Redis** | Serverless, sessions, rate limiting |
| File Storage | **Supabase Storage** | Integrated with auth, CDN included |
| Validation | **Zod** | Runtime type validation |

### Frontend (Admin Dashboard)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | Next.js 14 | SSR, React ecosystem |
| UI | Tailwind + shadcn/ui | Rapid development |
| State | React Query | API data management |

### Infrastructure

| Service | Provider | Purpose |
|---------|----------|---------|
| Hosting | **Render** or **Vercel** | API + Dashboard |
| Database | **Supabase** | PostgreSQL + Auth + Realtime + Storage |
| CDN | Cloudflare | Static assets, edge |
| Monitoring | Sentry | Error tracking |
| Analytics | PostHog | Product analytics |

### External Services

| Service | Provider | Purpose |
|---------|----------|---------|
| Payments | **Stripe Connect** | Marketplace payments |
| Maps | Google Maps API | Location, geocoding |
| Push | Firebase Cloud Messaging | Notifications |
| SMS | Twilio | Verification codes |
| Email | Resend | Transactional email |

---

## Integration Architecture

### Payment Flow (Stripe Connect)

```
Customer → Platform → Restaurant
    │          │           │
    │   Order  │           │
    │   €10.20 │           │
    │──────────>│           │
    │          │           │
    │          │  Transfer │
    │          │  €9.50    │
    │          │──────────>│
    │          │           │
    │          │  Keep     │
    │          │  €0.70    │
    │          │ (commission)
```

### Real-time Updates (WebSocket)

```
Events:
- order:new       → Restaurant receives new order
- order:status    → Customer sees status change
- driver:location → Customer sees driver position
```

---

## Development Tools

| Tool | Purpose |
|------|---------|
| GitHub | Source control |
| Linear | Project management |
| Figma | Design |
| Postman | API testing |
| Claude Code | AI-assisted development |

---

## Security Considerations

| Area | Approach |
|------|----------|
| Auth | JWT + refresh tokens (Supabase Auth) |
| API | Rate limiting, input validation |
| Data | Encryption at rest (Supabase default) |
| Payments | PCI-compliant via Stripe |
| GDPR | Data deletion, export APIs |

---

## Technical Decisions (FINAL)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Mobile framework | **React Native + Expo** | TypeScript everywhere, Expo Go for instant testing |
| Backend language | **Node.js/TypeScript** | Consistent with Next.js admin, Claude Code excels at TS |
| Hosting | **Render** | Simple, startup-friendly, good Node support |
| Daniel's PHP system | **Skip - Greenfield** | Legacy = no AI speed gain, clean slate better |

### Architecture: NestJS + Supabase (Clarified)

**NestJS handles:**
- All API endpoints (`/api/*`)
- Stripe webhook processing
- Complex business logic (orders, payments, wallet)
- Background jobs (if needed)
- Rate limiting, middleware

**Supabase provides:**
- PostgreSQL database (accessed via Supabase JS client, NOT Prisma)
- Auth (phone, social login)
- Realtime subscriptions (order tracking)
- Storage (images, receipts)
- Row-level security (RLS)

**NOT using:**
- Supabase Edge Functions (NestJS handles all API logic)
- Prisma ORM (using Supabase JS client directly for simpler setup)

**Why this split:**
- NestJS = Full control over business logic, easier debugging, structured architecture
- Supabase = Managed Postgres + auth + realtime without DevOps overhead
- No Edge Functions = Avoid function cold starts, keep logic centralized

### Why Expo over Flutter
- **TypeScript everywhere**: Mobile + Backend + Dashboard = one language
- **Expo Go**: Test on phone instantly via QR code, no native builds
- **Zero setup**: Node.js only (no Flutter SDK installation)
- **AI-assisted dev**: Claude Code exceptional at TypeScript
- **Ecosystem**: npm packages, larger hiring pool

### Why Node.js over Python
- **TypeScript everywhere**: Backend + Admin Dashboard + consistent types
- **Real-time**: Native WebSocket support for order tracking
- **Ecosystem**: Express/NestJS mature for marketplaces
- **Supabase**: JS client is first-class

---

## Related Documents

- [DATA-MODEL.md](DATA-MODEL.md) - Database schema
- [API-CONTRACTS.md](API-CONTRACTS.md) - API specifications
- [../01-product/MVP-PRD.md](../01-product/MVP-PRD.md) - Requirements
