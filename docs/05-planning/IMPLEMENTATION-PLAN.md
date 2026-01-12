# Implementation Plan

**Project:** TurkEats
**Created:** 2026-01-12
**Status:** Draft - Pending tech decisions

---

## Overview

Sequential task list for building TurkEats MVP.
**Dependencies flow top to bottom** - complete each before starting dependents.

---

## Pre-Development Setup

| # | Task | Dependencies | Owner | Status |
|---|------|--------------|-------|--------|
| 0.1 | Decide tech stack (mobile framework) | None | Roderic | Not Started |
| 0.2 | Decide tech stack (backend) | None | Roderic | Not Started |
| 0.3 | Evaluate Daniel's PHP system | None | Roderic | Not Started |
| 0.4 | Set up code repository | 0.1, 0.2 | Roderic | Not Started |
| 0.5 | Configure dev environment | 0.4 | Roderic | Not Started |
| 0.6 | Provision database (Neon) | 0.4 | Roderic | Not Started |
| 0.7 | Set up CI/CD | 0.4 | Roderic | Not Started |

---

## Phase 1: Foundation (Week 1-2)

| # | Task | Dependencies | Owner | Status |
|---|------|--------------|-------|--------|
| 1.1 | Create database schema | 0.6 | Roderic | Not Started |
| 1.2 | Run initial migrations | 1.1 | Roderic | Not Started |
| 1.3 | Set up API project structure | 0.5 | Roderic | Not Started |
| 1.4 | Implement user authentication | 1.2, 1.3 | Roderic | Not Started |
| 1.5 | Implement restaurant CRUD | 1.4 | Roderic | Not Started |
| 1.6 | Implement menu CRUD | 1.5 | Roderic | Not Started |
| 1.7 | Set up mobile app project | 0.5 | Roderic | Not Started |

---

## Phase 2: Core Features (Week 3-5)

| # | Task | Dependencies | Owner | Status |
|---|------|--------------|-------|--------|
| 2.1 | Restaurant search API | 1.5 | Roderic | Not Started |
| 2.2 | Restaurant search UI | 1.7, 2.1 | Roderic | Not Started |
| 2.3 | Menu browsing API | 1.6 | Roderic | Not Started |
| 2.4 | Menu browsing UI | 2.2, 2.3 | Roderic | Not Started |
| 2.5 | Cart functionality | 2.4 | Roderic | Not Started |
| 2.6 | Order creation API | 2.3 | Roderic | Not Started |
| 2.7 | Stripe integration | 1.4 | Roderic | Not Started |
| 2.8 | Checkout flow | 2.5, 2.6, 2.7 | Roderic | Not Started |
| 2.9 | Order tracking API | 2.6 | Roderic | Not Started |
| 2.10 | Order tracking UI | 2.8, 2.9 | Roderic | Not Started |

---

## Phase 3: Rewards System (Week 6-7)

| # | Task | Dependencies | Owner | Status |
|---|------|--------------|-------|--------|
| 3.1 | Wallet schema & API | 1.4 | Roderic | Not Started |
| 3.2 | Cashback calculation logic | 2.6, 3.1 | Roderic | Not Started |
| 3.3 | Wallet UI | 3.2 | Roderic | Not Started |
| 3.4 | Referral schema & API | 1.4 | Roderic | Not Started |
| 3.5 | QR code generation | 3.4 | Roderic | Not Started |
| 3.6 | Referral tracking | 3.5 | Roderic | Not Started |
| 3.7 | Referral UI | 3.6 | Roderic | Not Started |

---

## Phase 4: Restaurant Dashboard (Week 8-9)

| # | Task | Dependencies | Owner | Status |
|---|------|--------------|-------|--------|
| 4.1 | Dashboard project setup | 0.5 | Roderic | Not Started |
| 4.2 | Restaurant auth | 1.4, 4.1 | Roderic | Not Started |
| 4.3 | Order management UI | 4.2, 2.6 | Roderic | Not Started |
| 4.4 | Menu management UI | 4.2, 1.6 | Roderic | Not Started |
| 4.5 | Push notifications | 4.3 | Roderic | Not Started |

---

## Phase 5: Group Orders (Week 10)

| # | Task | Dependencies | Owner | Status |
|---|------|--------------|-------|--------|
| 5.1 | Group order schema | 2.6 | Roderic | Not Started |
| 5.2 | Group order API | 5.1 | Roderic | Not Started |
| 5.3 | Share link generation | 5.2 | Roderic | Not Started |
| 5.4 | Group order UI | 5.3 | Roderic | Not Started |
| 5.5 | Split payment logic | 5.4, 2.7 | Roderic | Not Started |

---

## Phase 6: Launch Prep (Week 11-12)

| # | Task | Dependencies | Owner | Status |
|---|------|--------------|-------|--------|
| 6.1 | End-to-end testing | 5.5 | Roderic | Not Started |
| 6.2 | Performance optimization | 6.1 | Roderic | Not Started |
| 6.3 | Security audit | 6.1 | Roderic | Not Started |
| 6.4 | Production environment | 6.3 | Roderic | Not Started |
| 6.5 | App store submission | 6.4 | Roderic | Not Started |
| 6.6 | Soft launch | 6.5 | Roderic | Not Started |

---

## Progress Tracking

| Phase | Total Tasks | Completed | % Done |
|-------|-------------|-----------|--------|
| Pre-Dev | 7 | 0 | 0% |
| Phase 1 | 7 | 0 | 0% |
| Phase 2 | 10 | 0 | 0% |
| Phase 3 | 7 | 0 | 0% |
| Phase 4 | 5 | 0 | 0% |
| Phase 5 | 5 | 0 | 0% |
| Phase 6 | 6 | 0 | 0% |
| **Total** | **47** | **0** | **0%** |

### Current Focus

**Now:** 0.1 - Decide tech stack (mobile)
**Next:** 0.2 - Decide tech stack (backend)
**Blocked:** None

---

## Related Documents

- [ROADMAP.md](ROADMAP.md) - High-level phases
- [RISK-REGISTER.md](RISK-REGISTER.md) - Risk tracking
- [../02-specs/FSD.md](../02-specs/FSD.md) - What we're building
- [../04-technical/ISD.md](../04-technical/ISD.md) - How we're building it
