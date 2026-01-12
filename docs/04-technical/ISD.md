# Implementation Specification Document (ISD)

**Project:** TurkEats
**Version:** 0.1
**Created:** 2026-01-12
**Status:** Draft - Decisions pending

---

## 1. Introduction

### 1.1 Purpose
This document describes HOW TurkEats will be built technically.

### 1.2 References
- [../02-specs/FSD.md](../02-specs/FSD.md) - What we're building
- [TECH-STACK.md](TECH-STACK.md) - Technology choices
- [DATA-MODEL.md](DATA-MODEL.md) - Database design
- [API-CONTRACTS.md](API-CONTRACTS.md) - API specifications

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Customer App   │  │ Restaurant App  │  │ Admin Dashboard │
│   (Android)     │  │  (Android/Web)  │  │     (Web)       │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    API Gateway    │
                    │  (REST + WebSocket)│
                    └─────────┬─────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
┌────────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│  Core Services  │  │ Payment Service │  │ Notification Svc│
│ (Orders, Menu)  │  │   (Stripe)      │  │ (Push, SMS)     │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    PostgreSQL     │
                    │      (Neon)       │
                    └───────────────────┘
```

### 2.2 Component Breakdown

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| Customer App | User-facing mobile | TBD (RN/Flutter) |
| Restaurant App | Order management | TBD |
| Admin Dashboard | Platform admin | Next.js |
| API | Business logic | TBD (Node/Python) |
| Database | Data persistence | PostgreSQL (Neon) |
| Cache | Sessions, real-time | Redis (Upstash) |

---

## 3. Open Technical Decisions

| Decision | Options | Recommendation | Status |
|----------|---------|----------------|--------|
| Mobile framework | React Native vs Flutter | TBD | **PENDING** |
| Backend language | Node.js vs Python | TBD | **PENDING** |
| Evaluate Daniel's PHP | Keep vs Rebuild | TBD | **PENDING** |
| Hosting | Render vs Vercel | TBD | **PENDING** |

---

## 4. Database Implementation

### 4.1 Schema Overview
See [DATA-MODEL.md](DATA-MODEL.md) for full schema.

Key tables: users, restaurants, orders, wallets, referrals

### 4.2 Migration Strategy
- Use database migration tool (Prisma/Drizzle)
- Version all migrations
- Apply in sequence

### 4.3 Indexing Strategy
- Index on foreign keys
- Geospatial index on restaurant locations
- Index on order status, created_at

---

## 5. API Implementation

### 5.1 API Architecture
RESTful API with WebSocket for real-time updates.
See [API-CONTRACTS.md](API-CONTRACTS.md) for full specs.

### 5.2 Authentication Flow
```
Register → Verify Email/Phone → Login → JWT Access Token
                                              ↓
                                    Refresh Token (7d)
```

### 5.3 Rate Limiting
| Endpoint Type | Limit |
|---------------|-------|
| Auth | 5/min per IP |
| Orders | 10/min per user |
| General | 100/min per user |

---

## 6. Integration Implementation

### 6.1 Stripe Connect
- Platform account receives payments
- Connected accounts for restaurants
- Automatic payouts to restaurants

### 6.2 Firebase (Push)
- FCM for Android notifications
- Topics for order status updates

### 6.3 Google Maps
- Geocoding for addresses
- Distance calculation

---

## 7. Security Implementation

### 7.1 Authentication
- JWT with short expiry (15min)
- Refresh token rotation
- Phone/email verification

### 7.2 Data Protection
- HTTPS everywhere
- Encryption at rest (Neon default)
- GDPR data deletion support

---

## 8. Testing Strategy

### 8.1 Unit Testing
- Target: 80% coverage on business logic
- Framework: Jest/Pytest (TBD)

### 8.2 Integration Testing
- API endpoint tests
- Database transaction tests

### 8.3 E2E Testing
- Critical flows: Register → Order → Pay
- Tool: TBD

---

## Related Documents

- [../02-specs/FSD.md](../02-specs/FSD.md) - Functional specification
- [TECH-STACK.md](TECH-STACK.md) - Technology choices
- [DATA-MODEL.md](DATA-MODEL.md) - Database schema
- [../05-planning/IMPLEMENTATION-PLAN.md](../05-planning/IMPLEMENTATION-PLAN.md) - Task sequence
