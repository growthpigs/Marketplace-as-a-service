# Product Requirements Document (PRD)

**Project:** TurkEats
**Version:** 0.1
**Created:** 2026-01-12
**Status:** Draft

---

## Executive Summary

TurkEats is a specialized food delivery marketplace targeting the Turkish/kebab restaurant market in France. The platform connects 35,000+ Turkish restaurants with customers through a mobile-first app with built-in viral mechanics (10% cashback + affiliate referral system).

---

## Problem Statement

- No specialized platform exists for Turkish food delivery in France
- Generic platforms (Uber Eats, Deliveroo) charge 15-30% commission
- Strong community networks exist but lack digital infrastructure
- Price-sensitive customers (students) need incentives

---

## Goals & Success Metrics

| Goal | Metric | Target (MVP) | Target (6mo) |
|------|--------|--------------|--------------|
| Restaurant adoption | Onboarded restaurants | 50 | 500 |
| User growth | Monthly active users | 500 | 10,000 |
| Order volume | Orders per day | 50 | 1,000 |
| Viral growth | Users via referral | - | 20% |

---

## User Personas

### Persona 1: Student Customer
- **Role:** University student, 18-25
- **Goals:** Affordable food, convenience, savings
- **Pain Points:** Limited budget, wants value for money

### Persona 2: Restaurant Owner
- **Role:** Turkish restaurant owner/operator
- **Goals:** More orders, lower fees, simple tools
- **Pain Points:** High platform fees, complex systems

### Persona 3: Community Influencer
- **Role:** Person with network in Turkish community
- **Goals:** Earn from referrals, help community
- **Pain Points:** No way to monetize influence

---

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR1 | Customer can search restaurants by location | P0 |
| FR2 | Customer can place and pay for orders | P0 |
| FR3 | Customer earns 10% cashback on orders | P0 |
| FR4 | Customer can create/join group orders | P0 |
| FR5 | Customer can withdraw wallet balance to bank | P1 |
| FR6 | Customer can refer others via QR code | P1 |
| FR7 | Restaurant receives and manages orders | P0 |
| FR8 | Restaurant manages menu and availability | P0 |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR1 | App loads in < 3 seconds | P0 |
| NFR2 | 99.9% uptime | P0 |
| NFR3 | Support 10,000 concurrent users | P1 |
| NFR4 | GDPR compliant | P0 |

---

## Out of Scope (MVP)

- iOS app (Android-first)
- Own delivery fleet
- Multiple cuisines
- Multi-country
- Advanced analytics

---

## Related Documents

- [VISION.md](VISION.md) - Product vision
- [SCOPE.md](SCOPE.md) - Scope boundaries
- [MVP-PRD.md](MVP-PRD.md) - MVP focus
- [../02-specs/USER-STORIES.md](../02-specs/USER-STORIES.md) - Detailed user stories
- [../02-specs/FSD.md](../02-specs/FSD.md) - Functional specification
