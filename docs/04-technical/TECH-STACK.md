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

### Mobile Apps

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | **React Native** or **Flutter** | TBD - evaluate |
| Platform | iOS first (design), Android second (production) | Both ship together |
| State | Redux/Zustand or Riverpod | Depends on framework |
| Maps | Google Maps SDK | Standard, well-documented |

**Platform Strategy:** iOS establishes design patterns → Android builds for target market → Both launch simultaneously.

**Decision needed:** React Native vs Flutter

### Backend

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Runtime | **Node.js** or **Python** | TBD - evaluate Daniel's PHP |
| Framework | Express/NestJS or FastAPI | |
| Database | **Supabase** (PostgreSQL) | Default choice, auth + realtime + storage |
| Cache | Redis (Upstash) | Sessions, real-time |
| File Storage | Supabase Storage or Cloudflare R2 | Cost-effective |

**Note:** Need to evaluate Daniel's existing PHP/WordPress system to decide if we extend or rebuild.

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

## Open Decisions

| Decision | Options | Status |
|----------|---------|--------|
| Mobile framework | React Native vs Flutter | **Pending** |
| Backend language | Node.js vs Python vs extend PHP | **Pending** |
| Hosting | Render vs Vercel vs Fly.io | **Pending** |
| Evaluate Daniel's system | Keep/extend vs rebuild | **Pending** |

---

## Related Documents

- [DATA-MODEL.md](DATA-MODEL.md) - Database schema
- [API-CONTRACTS.md](API-CONTRACTS.md) - API specifications
- [../01-product/MVP-PRD.md](../01-product/MVP-PRD.md) - Requirements
