# TurkEats - Risk Register

**Project:** TurkEats (Marketplace-as-a-Service)
**Created:** 2026-01-12
**Last Updated:** 2026-01-12

---

## Risk Summary

| ID | Risk | Impact | Likelihood | Severity | Status |
|----|------|--------|------------|----------|--------|
| R1 | Restaurant adoption | High | Medium | **High** | Open |
| R2 | Payment processing | High | Low | Medium | Open |
| R3 | Delivery logistics | Medium | High | **High** | Open |
| R4 | Technical complexity | Medium | Medium | Medium | Open |
| R5 | Competition response | Medium | Medium | Medium | Open |
| R6 | Partnership dynamics | High | Low | Medium | Open |

---

## Detailed Risks

### R1: Restaurant Adoption

**Risk:** Turkish restaurants may be skeptical of new platform or already satisfied with existing solutions.

| Factor | Value |
|--------|-------|
| Impact | High - No restaurants = no business |
| Likelihood | Medium |
| Owner | Daniel/Stéphane |

**Mitigations:**
1. ✅ Stéphane as market access partner (community trust)
2. Offer significantly lower commission (5% vs 15-30%)
3. Personal onboarding via Daniel's sales efforts
4. Start with restaurants in Stéphane's direct network
5. Free trial period for early adopters

**Contingency:** If adoption <20 restaurants in 2 months, pivot to different community or model.

---

### R2: Payment Processing

**Risk:** Stripe Connect setup complexity, French banking regulations, withdrawal feature challenges.

| Factor | Value |
|--------|-------|
| Impact | High - Core functionality |
| Likelihood | Low |
| Owner | Roderic |

**Mitigations:**
1. Use established Stripe Connect patterns
2. Research French marketplace payment regulations early
3. Start with card-only, add cash withdrawal post-MVP
4. Consult accountant on French VAT implications

**Contingency:** Partner with local payment provider if Stripe proves problematic.

---

### R3: Delivery Logistics

**Risk:** Restaurants without own delivery, unreliable third-party couriers, delivery radius limitations.

| Factor | Value |
|--------|-------|
| Impact | Medium |
| Likelihood | High |
| Owner | Daniel |

**Mitigations:**
1. Start with restaurants that self-deliver
2. Offer pickup option as backup
3. Research courier partnerships (Stuart, local services)
4. Limit initial geography to manageable delivery zones

**Contingency:** Pivot to pickup-only or partner with established delivery service.

---

### R4: Technical Complexity

**Risk:** Building marketplace features (real-time tracking, wallets, affiliate) may take longer than expected.

| Factor | Value |
|--------|-------|
| Impact | Medium |
| Likelihood | Medium |
| Owner | Roderic |

**Mitigations:**
1. Copy proven Uber Eats patterns (90-95%)
2. Use AI-assisted development (Claude Code)
3. Prioritize ruthlessly - MVP first
4. Evaluate if Daniel's existing PHP can accelerate

**Contingency:** Cut features from MVP, extend timeline, hire contract help.

---

### R5: Competition Response

**Risk:** Uber Eats/Deliveroo could launch Turkish-focused campaigns if we gain traction.

| Factor | Value |
|--------|-------|
| Impact | Medium |
| Likelihood | Medium (if successful) |
| Owner | Team |

**Mitigations:**
1. Build community loyalty before they notice
2. Commission advantage (5% vs 15-30%) hard to match
3. Focus on features majors won't build (cash withdrawal, community features)
4. Move fast - first mover advantage in niche

**Contingency:** Accept competition as validation, focus on loyal base.

---

### R6: Partnership Dynamics

**Risk:** 50/50 split with Daniel may create decision deadlocks, unclear role boundaries.

| Factor | Value |
|--------|-------|
| Impact | High |
| Likelihood | Low |
| Owner | Roderic/Daniel |

**Mitigations:**
1. ✅ MOU clearly defines responsibilities
2. Weekly sync calls to align
3. Clear domain ownership (tech vs business)
4. 6-month trial period before formalization

**Contingency:** Clear exit terms in MOU, mediation clause.

---

## Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| Stéphane's restaurant introductions | External | Stéphane | Pending |
| Stripe Connect approval | External | Roderic | Not started |
| App store approval | External | Roderic | Not started |
| Daniel's PHP system evaluation | Internal | Roderic | Not started |
| Courier partner agreement | External | Daniel | Not started |

---

## Risk Review Schedule

- Weekly: Quick status check in team sync
- Monthly: Full risk register review
- Trigger: Immediate review if any risk materializes

---

## Related Documents

- [../01-product/SCOPE.md](../01-product/SCOPE.md) - Project scope
- [../00-intake/MOU_Daniel_DRAFT.md](../00-intake/MOU_Daniel_DRAFT.md) - Partnership terms
- [ROADMAP.md](ROADMAP.md) - Project timeline
