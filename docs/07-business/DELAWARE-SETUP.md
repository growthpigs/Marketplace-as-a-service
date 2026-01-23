# Delaware Company Setup - Marketplace as a Service

**Status:** PLANNING
**Last Updated:** 2026-01-23
**Decision Required:** Fix Badaboost LLC vs Create New LLC

---

## 🚨 CRITICAL: Badaboost LLC Has Compliance Issues

Before adding Daniel and Stéphane as equity partners, we need to address these problems:

### Current Status (Verified Jan 18, 2026)

| Issue | Status | Risk |
|-------|--------|------|
| 2024 Annual Report | ❌ NOT FILED | OUT OF GOOD STANDING |
| 2025 Annual Report | ❓ UNKNOWN | Likely missed (Jun 1 deadline) |
| Registered Agent Switch | ❌ INCOMPLETE | Started Jul 2025, never finished |
| Firstbase Cancellation | ⏸️ BLOCKED | Can't cancel until agent switch done |
| Double-Paying Agents | ⚠️ YES | $149/yr + $49/yr = $198/yr |

### Estimated Back Taxes Owed

| Year | Tax | Late Fee | Interest | Total |
|------|-----|----------|----------|-------|
| 2024 | $300 | $200 | ~$86 | ~$586 |
| 2025 | $300 | $200 | ~$32 | ~$532 |
| **TOTAL** | $600 | $400 | ~$118 | **~$1,118** |

---

## Two Options

### Option A: Fix Badaboost LLC, Add Partners

**Pros:**
- LLC already exists (formed Apr 2023)
- No new formation fees
- Established entity

**Cons:**
- Must fix compliance first (~$1,118 + time)
- Need to update Operating Agreement
- Partners join an entity with history

**Steps:**
1. Pay back taxes (~$1,118) to restore good standing
2. Complete registered agent switch to Delaware Corp HQ
3. Cancel Firstbase subscription
4. Draft new Operating Agreement with:
   - Roderic: 50%
   - Daniel + Stéphane: 50% (their internal split)
5. File amendment with Delaware if needed

**Timeline:** 2-4 weeks

### Option B: Create New "Marketplace as a Service LLC"

**Pros:**
- Clean start, no compliance baggage
- Cap table correct from day one
- Clear separation from Roderic's solo work

**Cons:**
- Formation fee (~$90 Delaware + $49 registered agent)
- New EIN application
- Need to set up new bank account

**Steps:**
1. Form new Delaware LLC via Delaware Corporate HQ ($90)
2. Choose registered agent: Delaware Corp HQ ($49/yr)
3. Apply for EIN (free, online)
4. Draft Operating Agreement:
   - Roderic: 50%
   - Daniel + Stéphane: 50%
5. Open bank account (Mercury? Revolut Business?)
6. Badaboost LLC remains Roderic's solo entity (still needs compliance fix)

**Timeline:** 1-2 weeks

---

## My Recommendation: Option B (New LLC)

**Why:**
1. Cleaner partnership structure from day one
2. No compliance baggage for partners
3. Badaboost can stay as your solo consulting entity
4. Partners don't inherit unknown liabilities
5. Faster to set up than fixing compliance

**Badaboost Still Needs Fixing** - but you can do that separately without blocking the partnership.

---

## Formation Provider Options

| Provider | Cost | Notes |
|----------|------|-------|
| **Delaware Corporate HQ** | $49/yr agent + $90 filing | Already have relationship, started switch |
| **Firstbase** | ~$399 first year | Avoid - cancellation issues, dark patterns |
| **Northwest Registered Agent** | $39/yr agent + $100 filing | Good reputation |
| **Stripe Atlas** | $500 flat | Includes bank account setup, clean process |

**Recommendation:** Delaware Corporate HQ or Stripe Atlas

---

## What Daniel + Stéphane Need to Provide

For either option, we'll need:

| Person | Required Info |
|--------|--------------|
| **Daniel** | Full legal name, address, passport/ID copy, ownership % |
| **Stéphane** | Full legal name, address, passport/ID copy, ownership % |

**Note:** They need to decide how to split their 50% between themselves.

---

## Banking Options for New LLC

| Bank | Pros | Cons |
|------|------|------|
| **Mercury** | Free, easy setup, good UI | US-only, SWIFT transfers expensive |
| **Revolut Business** | French IBAN, free SEPA | Requires application (you had issues) |
| **Stripe Atlas** | Comes with SVB account | $500 upfront |
| **Wise Business** | Multi-currency, cheap transfers | Less features |

**For France-based partners:** Revolut Business or Wise would be easiest for SEPA transfers.

---

## Operating Agreement Structure

```
MARKETPLACE AS A SERVICE LLC

Ownership:
├── Roderic Andrews ─────────── 50%
│   └── Capital contribution: Technology, existing IP
│
└── Business Partners ────────── 50%
    ├── Daniel: [X]%
    └── Stéphane: [Y]%
    └── Capital contribution: Market access, operations, VIP Drivers

Governance:
- Major decisions (>$500): Unanimous
- Day-to-day operations: Each partner in their domain
- Profit distribution: Quarterly or as agreed

Roles:
- Roderic: Technical Lead, Product, Design
- Daniel: Business Development, Sales, Client Acquisition
- Stéphane: Operations, Market Access
```

---

## Action Items (Before Monday Meeting)

### Immediate (This Week)

| # | Task | Owner | Priority |
|---|------|-------|----------|
| 1 | Decide: Fix Badaboost vs New LLC | Roderic | HIGH |
| 2 | Get Daniel + Stéphane's full legal names | Daniel | HIGH |
| 3 | Ask how they want to split their 50% | Daniel + Stéphane | HIGH |

### If Option A (Fix Badaboost)

| # | Task | Owner | Cost |
|---|------|-------|------|
| 4 | Verify 2024 + 2025 report status | Roderic | $10 (Delaware portal) |
| 5 | Pay back taxes if needed | Roderic | ~$1,118 |
| 6 | Complete registered agent switch | Roderic | $0 (call 302-288-0670) |
| 7 | Draft new Operating Agreement | Chi | $0 (template) |

### If Option B (New LLC)

| # | Task | Owner | Cost |
|---|------|-------|------|
| 4 | Form new LLC via Delaware Corp HQ | Roderic | ~$140 |
| 5 | Apply for EIN | Roderic | $0 |
| 6 | Draft Operating Agreement | Chi | $0 (template) |
| 7 | Open bank account | Roderic | $0 |
| 8 | (Later) Fix Badaboost compliance | Roderic | ~$1,118 |

---

## Questions for Monday Meeting

1. **Daniel + Stéphane:** How do you want to split your 50%?
   - 25/25?
   - 30/20?
   - Other?

2. **Which ventures go under this LLC?**
   - TurkEats (yes)
   - VIP Drivers (yes, per call)
   - Hotel booking (yes, per call)
   - Future projects?

3. **Banking:**
   - Who handles the bank account?
   - Which bank (Mercury vs Revolut vs Wise)?
   - How are expenses approved?

4. **Existing VIP Drivers assets:**
   - Is there an existing company structure?
   - How does it get folded into MaaS?
   - Any liabilities to transfer?

---

## Related Documents

- [PARTNERSHIP.md](./PARTNERSHIP.md) - Umbrella partnership agreement
- [Badaboost Skill](~/.claude/skills/Badaboost/SKILL.md) - Full compliance status
- [Call Summary](../00-intake/2026-01-23-DANIEL-CALL-SUMMARY.md) - Original discussion

---

*Created: 2026-01-23*
