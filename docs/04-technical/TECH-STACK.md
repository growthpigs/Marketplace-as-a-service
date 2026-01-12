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

### Mobile Apps (Flutter)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | **Flutter 3.x** | Single codebase, native performance |
| Language | **Dart** | Strong typing, hot reload |
| State | **Riverpod** | Modern, testable, provider-based |
| Maps | **google_maps_flutter** | Official Google SDK |
| HTTP | **Dio** | Interceptors, retry logic |
| Local Storage | **Hive** | Fast NoSQL for offline |

**Platform Strategy:** iOS establishes design patterns → Android builds for target market → Both ship together.

### Backend (Node.js/TypeScript)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Runtime | **Node.js 20 LTS** | Stable, long-term support |
| Language | **TypeScript 5.x** | Type safety, better DX |
| Framework | **NestJS** | Structured, testable, enterprise patterns |
| Database | **Supabase** (PostgreSQL) | Auth + realtime + storage + edge functions |
| Cache | **Upstash Redis** | Serverless, sessions, rate limiting |
| File Storage | **Supabase Storage** | Integrated with auth, CDN included |
| Validation | **Zod** | Runtime type validation |
| ORM | **Prisma** | Type-safe queries, migrations |

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
| Mobile framework | **Flutter** | Single codebase, better perf, strong Maps SDK, hot reload |
| Backend language | **Node.js/TypeScript** | Consistent with Next.js admin, Claude Code excels at TS |
| Hosting | **Render** | Simple, startup-friendly, good Node support |
| Daniel's PHP system | **Skip - Greenfield** | Legacy = no AI speed gain, clean slate better |

### Why Flutter over React Native
- **Performance**: Native ARM compilation vs JS bridge
- **UI consistency**: Pixel-perfect across iOS/Android
- **Google Maps**: First-party SDK support (critical for delivery)
- **Developer velocity**: Hot reload + single codebase
- **Claude Code**: Excellent Dart support

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
