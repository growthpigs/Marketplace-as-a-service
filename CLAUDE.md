# TurkEats - Project Instructions

**Codename:** TurkEats (working title)
**Type:** Food delivery marketplace
**Phase:** A (Intake & Requirements)

---

## Project Overview

TurkEats is a specialized food delivery marketplace targeting the Turkish/kebab restaurant market in France. "Uber Eats for kebabs" with built-in viral mechanics (10% cashback + affiliate system).

**Key differentiators:**
- 5% restaurant commission (vs 15-30% competitors)
- Cash withdrawal from wallet (unique feature)
- Community-driven growth via Turkish restaurant network

---

## Team

| Partner | Role | Contact |
|---------|------|---------|
| Roderic | Tech, Product, Marketing, Design | (internal) |
| Daniel | Sales, BizDev, Operations, Finance | TBD |
| Stéphane | Market Access (revenue share) | TBD |

**Legal entity:** Badaboost LLC (Delaware)

---

## Quick Links

| Doc | Location |
|-----|----------|
| **Runbook** | [`docs/RUNBOOK.md`](docs/RUNBOOK.md) - How to implement features |
| Vision | `docs/01-product/VISION.md` |
| MVP PRD | `docs/01-product/MVP-PRD.md` |
| Scope | `docs/01-product/SCOPE.md` |
| Tech Stack | `docs/04-technical/TECH-STACK.md` |
| Data Model | `docs/04-technical/DATA-MODEL.md` |
| API Contracts | `docs/04-technical/API-CONTRACTS.md` |
| Risk Register | `docs/05-planning/RISK-REGISTER.md` |
| Features | `features/INDEX.md` |
| MOU (Daniel) | `docs/07-business/MOU-DANIEL.md` |
| Revenue Share (Stéphane) | `docs/07-business/REVENUE-SHARE-STEPHANE.md` |

---

## Development Rules

### Philosophy
- **Copy Uber Eats 90-95%** - Don't reinvent working patterns
- **Custom only where needed** - Cashback, affiliates, withdrawal
- **Android-first** - Target market is students on Android
- **AI-assisted development** - Use Claude Code for all coding

### Technical Decisions (Pending)
- [ ] Mobile framework: React Native vs Flutter
- [ ] Backend: Node.js vs Python vs extend Daniel's PHP
- [ ] Hosting: Render vs Vercel vs Fly.io

### Code Standards
- TypeScript everywhere
- Conventional commits
- Feature branches → PR → main
- Tests for business logic (wallet, payments, affiliates)

### Living Documents (CRITICAL)
- **Feature specs live in `/features/F0XX-*.md`** - These are the source of truth
- **Never create orphan plan files** like `docs/plans/YYYY-MM-DD-*.md`
- **Implementation plans go INSIDE feature specs** - Add "Implementation Plan" section to the feature file
- **Update feature status in `features/INDEX.md`** when starting implementation
- **Active tasks tracked in `working/active-tasks.md`** - Links to living feature docs, never standalone
- Reason: Single source of truth, easier to maintain, prevents documentation drift

---

## Session Protocol

### Start of Session
1. Read `working/handover.md` (if exists)
2. Check `features/INDEX.md` for current feature work
3. Review active PRs/issues

### End of Session
1. Update `working/handover.md` with progress
2. Update feature status in `features/INDEX.md`
3. Commit and push work

---

## Key Business Rules

### Commission Structure
```
Customer pays:     Order + 2% service fee
Restaurant keeps:  95% of order value
Platform gets:     5% commission + 2% service fee
Cashback:          10% to customer wallet
```

### Affiliate Model
- Referrer gets 10% of referred users' lifetime orders
- OR one-time 40% of first order (choice)
- Tracked via unique referral code/QR

### Wallet Rules
- Cashback credited after order delivered
- Can use wallet balance on any restaurant
- Cash withdrawal to bank (unique feature)
- Minimum withdrawal: €10

---

## Current Phase Tasks

### Phase A - Intake (Current)
- [x] Project brief created
- [x] MOU draft (Daniel)
- [x] Revenue share draft (Stéphane)
- [x] PAI structure setup
- [ ] Evaluate Daniel's existing PHP system
- [ ] Technical stack decision
- [ ] Mobile framework decision

### Next: Phase D - SpecKit Init
- Create detailed feature specs
- Finalize data model
- Set up development environment

---

## Related PAI Docs

- Global CLAUDE.md: `~/.claude/CLAUDE.md`
- PAI Reference: `~/.claude/skills/PAI/REF.md`
- Feature Workflow: `~/.claude/skills/CORE/FEATURE-WORKFLOW.md`
