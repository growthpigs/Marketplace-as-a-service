# TurkEats Development Runbook

**Last Updated:** 2026-01-13

---

## Quick Start

1. **Start Session:** Read `working/handover.md` + check `features/INDEX.md`
2. **Work:** Implement feature per living doc in `/features/`
3. **End Session:** Update `working/handover.md` + commit

---

## How to Implement a Feature

### Step 1: Identify the Feature Spec
- Go to [`features/INDEX.md`](../features/INDEX.md)
- Find your feature (e.g., F005 - Payment Processing)
- Open the living doc (e.g., [`features/F005-payments.md`](../features/F005-payments.md))

### Step 2: Update Feature Status
- In `features/INDEX.md`, change status from "Spec Complete" → **"In Progress"**
- Example: `| F005 | Payment Processing | P0 | **In Progress** |`

### Step 3: Add Implementation Plan to Living Doc
- Open the feature file (e.g., `features/F005-payments.md`)
- Add "## Implementation Plan" section with bite-sized tasks
- Each task should be 2-5 minutes of work (write test, run test, implement, commit)
- Reference existing API contracts and data model docs

### Step 4: Create working/active-tasks.md
- Copy the roadmap from the feature spec
- Link back to the living doc
- Track which tasks are done (checkboxes)

### Step 5: Execute & Commit
- Work through tasks in the implementation plan
- Commit after each small task
- Update checkboxes in `working/active-tasks.md`
- Update `features/INDEX.md` status when complete

---

## Living Documents Pattern

### The Problem We Solve
- ❌ Before: Orphan plan files (`docs/plans/2026-01-13-feature-x.md`) → drift, confusion, duplicate docs
- ✅ After: Single source of truth in feature spec

### The Rule
**Feature implementation plans live INSIDE the feature spec file, never as separate files.**

### Where Implementation Plans Go

| Document | Purpose | Status |
|----------|---------|--------|
| `/features/F0XX-*.md` | Feature spec + implementation plan | **SINGLE SOURCE OF TRUTH** |
| `/features/INDEX.md` | Feature catalog with status | Update when starting work |
| `/working/active-tasks.md` | Quick reference for current work | Links to F0XX file, never standalone |
| ~~`/docs/plans/YYYY-MM-DD-*.md`~~ | ❌ ORPHAN - DO NOT CREATE | Delete if found |

### How to Structure a Feature Spec

```markdown
# FXX - Feature Name

**Status:** Spec Complete | In Progress | Done

---

## Overview
Brief description.

---

## User Stories
...

---

## Technical Specification
...

---

## Dependencies
...

---

## Implementation Plan          ← ADD THIS WHEN STARTING WORK

**Current State:** What's done/mocked/missing.

**Approach:** High-level strategy.

### Phase 1: Component A (X DU)

**Task 1.1: Subtask**
- What to do
- Files to modify
- Expected result

**Task 1.2: Subtask**
...

### Phase 2: Component B (Y DU)
...

---

## Security Considerations
...
```

---

## Session Checklist

### Start of Session
- [ ] Read `working/handover.md` (if exists)
- [ ] Check `features/INDEX.md` for current work
- [ ] Open feature spec living doc (e.g., `features/F005-payments.md`)
- [ ] Verify implementation plan exists in the spec

### During Session
- [ ] Work through tasks from implementation plan (in living doc)
- [ ] Commit after each task
- [ ] Update `working/active-tasks.md` checkboxes

### End of Session
- [ ] Update `working/handover.md` with progress
- [ ] Update feature status in `features/INDEX.md` (if complete)
- [ ] Verify all changes committed and pushed
- [ ] Check for orphan files (delete if found)

---

## Common Mistakes

### ❌ Mistake 1: Creating Orphan Plan Files
```
docs/plans/2026-01-13-payment-flow.md  ← WRONG
```
**Fix:** Add implementation plan to `features/F005-payments.md` instead

### ❌ Mistake 2: Not Updating Feature Status
```
features/INDEX.md: F005 | Spec Complete  ← WRONG when starting work
```
**Fix:** Change to `**In Progress**` when implementation starts

### ❌ Mistake 3: Separate Implementation Docs
```
docs/plans/implementation-tasks.md  ← WRONG (orphan)
docs/implementation/phase-1.md      ← WRONG (scattered)
```
**Fix:** Put everything in the feature spec file

---

## File Structure Reference

```
TurkEats/
├── features/
│   ├── INDEX.md                      ← Feature catalog + status
│   ├── F001-auth.md                  ← Feature spec + plan
│   ├── F002-discovery.md
│   ├── F005-payments.md              ← Example: Includes impl plan
│   └── ...
├── docs/
│   ├── 01-product/
│   ├── 04-technical/
│   │   ├── API-CONTRACTS.md          ← Reference in your plan
│   │   └── DATA-MODEL.md             ← Reference in your plan
│   └── RUNBOOK.md                    ← This file
├── working/
│   ├── handover.md                   ← Session context (temporary)
│   └── active-tasks.md               ← Current work (links to living doc)
└── apps/
    ├── mobile/
    ├── api/
    └── dashboard/
```

---

## Key Principles

1. **LIVING DOCS ONLY** - Feature specs are the source of truth, never plan files
2. **SINGLE LOCATION** - Implementation plan lives inside the feature spec
3. **STATUS TRACKING** - Update `features/INDEX.md` status when work starts/completes
4. **ACTIVE TASKS** - Quick reference in `working/active-tasks.md`, but linked to living doc
5. **NO ORPHANS** - If a doc doesn't have a permanent home, don't create it

---

## Examples

### ✅ Example 1: F005 - Correct Pattern

**File:** `features/F005-payments.md`
- Status: In Progress
- Contains full spec
- **Includes:** Implementation Plan section with phases and tasks
- **Linked from:** `features/INDEX.md` (status = In Progress)
- **Tracked in:** `working/active-tasks.md` (links back to F005)

### ✅ Example 2: F002 - Different Status

**File:** `features/F002-discovery.md`
- Status: UI Implemented
- Contains full spec
- Implementation plan exists but not actively being worked
- **Tracked in:** Not in active-tasks.md (not current work)

### ❌ Example 3: Orphan File (AVOID)

**File:** `docs/plans/2026-01-13-real-payment-flow.md` ← DELETE
- Why bad: Separate from spec, will drift, causes confusion
- What to do: Merge content into `features/F005-payments.md`

---

## Verification Commands (Runtime Tests)

**CRITICAL:** Never verify by file existence alone. Use these runtime tests.

### Mobile App Verification

```bash
# TypeScript compiles (not just "file exists")
cd apps/mobile && npx tsc --noEmit && echo "✅ TypeScript: PASS"

# Actually builds (not just "packages installed")
cd apps/mobile && npx expo export --platform ios && echo "✅ Build: PASS"

# Dev server starts
cd apps/mobile && npx expo start --tunnel  # Must see QR code
```

### API Verification

```bash
# API actually starts
cd apps/api && npm run start:dev
# Should see: "Nest application successfully started"

# Health check endpoint responds
curl http://localhost:3000/health && echo "✅ API: PASS"

# Auth token validation (demo mode)
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer mock-jwt-token-placeholder" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
# Should return 400 (validation error), not 401 (auth error)
```

### Environment Verification

```bash
# Env vars actually load (not just "file exists")
cd apps/mobile && node -e "
  require('dotenv').config();
  const required = ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_ENV'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) throw new Error('Missing: ' + missing.join(', '));
  console.log('✅ Env vars: PASS');
"
```

### Git Status Verification

```bash
# Clean working tree (not just "committed")
git status | grep "nothing to commit" && echo "✅ Git: CLEAN"

# Pushed to remote (not just "committed locally")
git status | grep "Your branch is up to date" && echo "✅ Remote: SYNCED"
```

### Pre-Commit Verification (Automatic)

The pre-commit hook runs these checks automatically:
1. Secrets detection
2. TypeScript (all apps)
3. Linting (API, Dashboard)
4. Build verification (Dashboard)
5. Dependency audit

If any fail, commit is rejected.

---

## Questions?

- **"Where do I put the implementation tasks?"** → In the feature spec file (`features/F0XX-*.md`)
- **"Should I create a new plan file?"** → No. Add to existing feature spec.
- **"How do I track progress?"** → Update `working/active-tasks.md` (which links to the spec)
- **"What if the spec needs updating?"** → Update it directly (it's a living doc!)

---

## Changelog

### 2026-01-19 - Restaurateur Dashboard PRD + Wireframe Tooling

**Documentation:**
- Created `docs/00-intake/COMPETITIVE-RESEARCH-MERCHANT-DASHBOARDS.md` - Uber Eats + Deliveroo analysis
- Created `docs/01-product/RESTAURATEUR-DASHBOARD-PRD.md` - Full PRD with 26 user stories
- Created `docs/03-design/wireframes/screens.json` - 15-screen config for batch generation

**Tooling:**
- Created NanoBanana Pro skill (`~/.claude/skills/NanoBananaPro/`)
- Fixed SDK issues (google-genai, not google-generativeai)
- Fixed model name (gemini-2.0-flash-exp)

**Platform Strategy:** 90% mobile, 10% web for restaurateur dashboard

### 2026-01-13 - Consumer App UI 100% Complete

- All 5 tabs fully interactive for demo
- Browse → Home navigation with URL params
- Account settings dialogs implemented
- Commit: `3841202`

