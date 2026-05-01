# ULTRAPLAN — AuditEngine v10 AURA Commercial Launch

> **Granular execution plan.** Day-by-day milestones, dependencies, owners.
> Created: 2026-04-23. Target launch: 2026-06-02 (6 weeks).
> Owner: DK Buledi. Agents: 5 programme agents + Claude Code.

---

## Timeline Overview

```
Week 1  (24-30 Apr)  ██████████  DEMO MODULE + LEGAL DRAFTING
Week 2  (01-07 May)  ██████████  DEMO POLISH + INFRASTRUCTURE RESEARCH
Week 3  (08-14 May)  ██████████  BILLING BUILD + LEGAL REVIEW
Week 4  (15-21 May)  ██████████  INTEGRATION TESTING + ARCHIVE IMPLEMENTATION
Week 5  (22-28 May)  ██████████  BETA HARDENING + COMPLIANCE SIGN-OFF
Week 6  (29 May-04 Jun) ████████  LAUNCH PREP + GO-LIVE
```

---

## Critical Path

The longest dependency chain determines launch date:

```
DPIA Draft (W1) → DK Review (W2) → Legal Review (W3) → ICO Registration (W3) → Processor DPAs (W4) → LAUNCH
                                                                                                    ↑
Demo Module (W1-W2) → Beta Testing (W3) → Polish (W4) ─────────────────────────────────────────────┘
                                                                                                    ↑
Archive Decision Memo (W2) → DK Decides (W2) → Implementation (W3-W4) → Verification (W5) ─────────┘
                                                                                                    ↑
Pricing Design (W2) → DK Approves (W3) → Stripe Build (W3-W4) → Test Mode (W5) ───────────────────┘
```

**Critical path bottleneck:** Legal review of DPIA and DPAs. If DK secures legal review by Week 3, everything fits. If legal review slips to Week 4+, launch slides.

---

## Week 1: 24-30 April — FOUNDATION SPRINT

### Thursday 24 Apr
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Enhance demo data — add customItems.risks (3 construction risks) | `launch-demo-showcase` | Updated `demoSeed.js` | — |
| AM | Draft management letter points as structured data | `launch-demo-showcase` | Management letter data in demo | — |
| PM | Build DemoTour component — spotlight + tooltip mechanics | `launch-demo-showcase` | `DemoTour.jsx`, `TourStep.jsx` | — |
| PM | Start DPIA draft — processing description + data flow map | `launch-legal-compliance` | `docs/launch/legal/DPIA_draft.md` (partial) | — |

### Friday 25 Apr
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Build tour step definitions (8-10 stops) | `launch-demo-showcase` | `tourSteps.js` | DemoTour component |
| AM | Continue DPIA — risk assessment matrix | `launch-legal-compliance` | DPIA risk section | DPIA start |
| PM | Build DemoPage (`/demo` route) — hero + industry selector | `launch-demo-showcase` | `DemoPage.jsx`, router update | — |
| PM | Complete DPIA draft | `launch-legal-compliance` | Full DPIA draft | Risk section |

### Saturday 26 Apr
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Build AI agent showcase — simulated mode with typewriter effect | `launch-demo-showcase` | `AgentShowcase.jsx` | Tour component |
| AM | Create pre-recorded agent session data | `launch-demo-showcase` | `demoAgentRecording.js` | — |
| PM | Wire export showcase into DemoPage | `launch-demo-showcase` | Download buttons for Word/Excel/PDF | DemoPage |
| PM | Draft Client DPA template | `launch-legal-compliance` | `docs/launch/legal/Client_DPA_template.md` | — |

### Sunday 27 Apr
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Integration test: full demo tour end-to-end | `launch-demo-showcase` | Tour working across all stops | All demo components |
| AM | Draft breach notification runbook | `launch-legal-compliance` | `docs/launch/legal/Breach_Runbook.md` | — |
| PM | Write tests for DemoTour, DemoPage, AgentShowcase | `launch-demo-showcase` | 10-15 new tests passing | Demo components |
| PM | Draft processor DPA review checklists | `launch-legal-compliance` | 5 processor checklists | — |

### Milestone: WEEK 1 CHECKPOINT (Sun 27 Apr evening)
- [ ] `/demo` route live with guided tour (8-10 stops)
- [ ] AI agent showcase working in simulated mode
- [ ] Export samples downloadable from demo page
- [ ] DPIA draft complete (pending DK + legal review)
- [ ] Client DPA template drafted
- [ ] Breach notification runbook drafted
- [ ] All tests still passing (305+ tests)
- [ ] Build still 0 errors

---

## Week 2: 01-07 May — INFRASTRUCTURE + POLISH

### Monday 01 May (Bank Holiday)
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| — | Light day. DK reviews DPIA draft. | DK | DPIA review notes | DPIA draft |
| PM | Demo tour polish — animations, responsive layout | `launch-demo-showcase` | Polished tour | W1 demo |

### Tuesday 02 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Research 7-year archive providers — S3 vs R2 vs Supabase | `launch-infrastructure` | Research notes | — |
| AM | DK: schedule legal review for DPIA + DPA templates | DK (HUMAN) | Legal reviewer booked | DPIA draft |
| PM | Write archive decision memo | `launch-infrastructure` | `docs/launch/infrastructure/archive-decision-memo.md` | Research |
| PM | Fix F500 Skill Pack critique items (1-4) | Manual | Updated skill files | — |

### Wednesday 03 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Domain strategy recommendation | `launch-infrastructure` | `docs/launch/infrastructure/domain-strategy.md` | — |
| AM | Design pricing tiers — research UK audit software market | `launch-billing` | `docs/launch/billing/pricing-recommendation.md` | — |
| PM | DK reviews archive decision memo and chooses provider | DK (DECISION) | Provider chosen | Decision memo |
| PM | Demo: add live agent mode (if API key present) | `launch-demo-showcase` | Live mode in AgentShowcase | Simulated mode |

### Thursday 04 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | DK reviews pricing recommendation | DK (DECISION) | Pricing approved | Pricing memo |
| AM | Draft ISQM 1 quality management framework | `launch-legal-compliance` | `docs/launch/legal/ISQM1_framework.md` | — |
| PM | Draft ICO registration briefing note | `launch-legal-compliance` | `docs/launch/legal/ICO_registration_brief.md` | — |
| PM | Install F500 skills in Console | DK (HUMAN) | Skills live in Console | Critique fixes |

### Friday 05 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Demo: Financial Services demo data upgrade to 100% | `launch-demo-showcase` | Enhanced FS demo | — |
| PM | Demo: Charity demo data upgrade to 100% | `launch-demo-showcase` | Enhanced Charity demo | — |

### Milestone: WEEK 2 CHECKPOINT (Fri 05 May)
- [ ] Archive provider chosen by DK
- [ ] Pricing tiers approved by DK
- [ ] DPIA sent for legal review
- [ ] ISQM 1 framework drafted
- [ ] ICO registration brief ready for DK
- [ ] F500 skills installed
- [ ] All 3 demo industries at 100% data completeness
- [ ] Demo live mode working (if API key configured)

---

## Week 3: 08-14 May — BUILD SPRINT

### Monday 08 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Start Stripe integration — schema + server routes | `launch-billing` | `server/routes/billing.js`, schema migration | Pricing approved |
| AM | Start archive service implementation | `launch-infrastructure` | `src/services/ArchiveService.js` (scaffold) | Provider chosen |
| PM | Stripe webhook handler | `launch-billing` | Webhook events handled | Stripe routes |
| PM | Archive write path — audit_trail → immutable store | `launch-infrastructure` | Write path working | Archive scaffold |

### Tuesday 09 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Stripe Checkout flow — end-to-end in test mode | `launch-billing` | Checkout working | Webhook handler |
| AM | Archive retention policy enforcement | `launch-infrastructure` | 7-year lock logic | Write path |
| PM | SubscriptionContext + PlanGate component | `launch-billing` | Frontend plan enforcement | Stripe backend |
| PM | DK: submit ICO registration | DK (HUMAN) | ICO reference number | ICO brief |

### Wednesday 10 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | PricingPage — 4-tier cards, feature matrix | `launch-billing` | `/pricing` route | SubscriptionContext |
| AM | Archive verification endpoint — hash-chain validation | `launch-infrastructure` | Verification working | Write path |
| PM | Legal review feedback on DPIA (target date) | External lawyer | DPIA comments | Legal scheduled W2 |
| PM | Express route for archive retrieval | `launch-infrastructure` | `server/routes/archive.js` | Archive service |

### Thursday 11 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Address DPIA legal review comments | `launch-legal-compliance` | Revised DPIA | Legal feedback |
| AM | Billing tests — webhook signature, plan enforcement | `launch-billing` | Tests passing | Billing components |
| PM | Archive tests — write, lock, verify, retrieve | `launch-infrastructure` | Tests passing | Archive service |
| PM | DK: execute Anthropic processor DPA | DK (HUMAN) | Signed DPA | DPA template |

### Friday 12 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | DK: execute Supabase processor DPA | DK (HUMAN) | Signed DPA | DPA template |
| AM | DK: execute Vercel processor DPA | DK (HUMAN) | Signed DPA | DPA template |
| PM | Integration: billing + demo + archive all working together | All agents | Full integration test | All W3 builds |
| PM | Legal review feedback on Client DPA (target) | External lawyer | DPA comments | Legal scheduled |

### Milestone: WEEK 3 CHECKPOINT (Fri 12 May)
- [ ] Stripe integration working in test mode (checkout → webhook → subscription active)
- [ ] /pricing page live
- [ ] Archive service writing and locking evidence
- [ ] Hash-chain verification working
- [ ] DPIA revised after legal review
- [ ] ICO registration submitted
- [ ] 2+ processor DPAs executed
- [ ] All tests passing (320+ expected)
- [ ] Build still 0 errors

---

## Week 4: 15-21 May — INTEGRATION + HARDENING

### Monday 15 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | End-to-end test: new user → pricing → checkout → engagement → demo tour | All | E2E flow working | All builds |
| AM | DK: execute GitHub processor DPA | DK (HUMAN) | Signed DPA | — |
| PM | DK: execute Stripe processor DPA | DK (HUMAN) | Signed DPA | — |
| PM | Address Client DPA legal review comments | `launch-legal-compliance` | Final Client DPA | Legal feedback |

### Tuesday 16 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Security review — all new endpoints (billing, archive) | `launch-infrastructure` | Security report | All endpoints |
| PM | Performance test — demo tour load time, archive write latency | `launch-infrastructure` | Performance report | All builds |

### Wednesday 17 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Fix any issues from security + performance reviews | All agents | Issues resolved | Reviews |
| PM | Update CLAUDE.md with new architecture (billing, archive, demo) | Manual | Updated CLAUDE.md | All builds |

### Thursday 18 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Disaster recovery documentation for archive | `launch-infrastructure` | DR docs | Archive service |
| PM | Beta invite list — identify 3-5 pilot firms | DK (HUMAN) | Beta list | — |

### Friday 19 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| ALL | Full regression test — all features, all routes, all exports | All | Regression clean | All builds |

### Milestone: WEEK 4 CHECKPOINT (Fri 19 May)
- [ ] End-to-end flow working (signup → pay → audit → archive)
- [ ] All 5 processor DPAs executed
- [ ] Client DPA finalised after legal review
- [ ] Security review clean
- [ ] Performance acceptable (< 3s page loads, < 5s archive writes)
- [ ] CLAUDE.md updated
- [ ] Beta invite list ready
- [ ] All tests passing (330+ expected)

---

## Week 5: 22-28 May — BETA + COMPLIANCE

### Monday 22 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Deploy beta build to production | Manual | auditengine.agency updated | All W4 |
| PM | Send beta invites to 3-5 pilot firms | DK (HUMAN) | Invites sent | Beta list |

### Tuesday-Thursday 23-25 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| Ongoing | Monitor beta usage — fix bugs as reported | All agents | Bug fixes | Beta deploy |
| Ongoing | DK: gather beta feedback from pilot firms | DK (HUMAN) | Feedback log | Beta invites |
| Wed | Finalise DPIA with legal sign-off | DK (HUMAN) + lawyer | Signed DPIA | All legal |

### Friday 26 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Address beta feedback — critical issues only | All agents | Fixes deployed | Feedback |
| PM | Final compliance checklist — all legal items confirmed | `launch-legal-compliance` | Compliance sign-off | All legal |

### Milestone: WEEK 5 CHECKPOINT (Fri 26 May)
- [ ] Beta live with 3-5 firms testing
- [ ] Critical beta bugs fixed
- [ ] DPIA signed off by legal
- [ ] All processor DPAs executed
- [ ] ICO registration confirmed
- [ ] Compliance checklist 100% green

---

## Week 6: 29 May - 04 Jun — LAUNCH

### Monday 29 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Final build + deploy | Manual | Production deploy | All W5 |
| PM | Verify all routes, demo, billing, archive in production | All | Production verification | Deploy |

### Tuesday 30 May
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Prepare launch communications — LinkedIn post, email to contacts | DK (HUMAN) | Launch content | — |
| PM | Final programme report | `launch-programme-reporter` | Launch readiness report | All |

### Wednesday-Thursday 31 May - 01 Jun
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| Buffer | Contingency days for any remaining items | — | — | — |

### Monday 02 Jun — LAUNCH DAY
| Time | Task | Owner | Deliverable | Depends on |
|---|---|---|---|---|
| AM | Go live — enable Stripe live mode | DK (HUMAN) | Payments active | All |
| AM | Publish launch announcement | DK (HUMAN) | Public launch | Content ready |
| PM | Monitor first-day signups and usage | All | Day-1 report | Launch |

---

## Milestone Summary

| # | Milestone | Target Date | Gate |
|---|---|---|---|
| M1 | Demo module complete | Sun 27 Apr | Tour, AI showcase, exports all working |
| M2 | All drafts complete | Fri 05 May | DPIA, DPAs, breach runbook, ISQM 1, pricing, archive memo |
| M3 | Key decisions made | Wed 03 May | Archive provider + pricing tiers approved |
| M4 | Build sprint complete | Fri 12 May | Stripe + archive + demo all integrated |
| M5 | All legal executed | Fri 19 May | ICO registered, all DPAs signed, DPIA reviewed |
| M6 | Beta deployed | Mon 22 May | Production build with billing active (test mode) |
| M7 | Compliance sign-off | Fri 26 May | All legal items green |
| M8 | LAUNCH | Mon 02 Jun | Stripe live mode, public announcement |

---

## Dependencies Matrix

```
Task                          Blocks                           Blocked by
─────────────────────────────────────────────────────────────────────────
DPIA Draft                    Legal review, ICO registration   —
Legal Review (external)       DPIA sign-off                    DPIA draft
ICO Registration              Launch                           DPIA + ICO brief
Processor DPAs                Launch                           DPA templates + legal review
Archive Decision Memo         Archive implementation           —
DK Chooses Provider           Archive implementation           Decision memo
Archive Implementation        E2E testing                      Provider chosen
Pricing Recommendation        Stripe build                     —
DK Approves Pricing           Stripe build                     Pricing recommendation
Stripe Build                  E2E testing, launch              Pricing approved
Demo Module                   Beta testing                     —
Demo Data Enhancement         Demo tour                        —
Demo Tour                     Beta testing                     Demo data
AI Agent Showcase             Beta testing                     Demo tour
Beta Deploy                   Beta feedback                    All builds complete
Beta Feedback                 Launch fixes                     Beta deploy
Compliance Sign-off           Launch                           All legal items
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Legal review delayed beyond W3 | MEDIUM | HIGH — blocks launch | Book lawyer immediately; have backup reviewer |
| Processor DPA negotiation stalls (Anthropic/Supabase) | LOW | MEDIUM | Standard DPAs usually sign-as-is; escalate early |
| Stripe integration complexity | LOW | MEDIUM | Use Checkout (hosted) not Elements; simpler |
| Archive provider doesn't support true WORM | MEDIUM | HIGH | S3 Object Lock Compliance mode is proven; avoid Supabase WORM-emulation |
| Beta firms don't engage | MEDIUM | LOW — launch not blocked | Personal outreach; offer free 6-month tier |
| Demo tour breaks on route changes | LOW | LOW | Component tests catch this |
| ICO registration delayed | LOW | MEDIUM | Submit early W3; typical turnaround < 5 days |

---

## Daily Standup Template

Use `launch-programme-reporter` agent to generate:

```
What was completed yesterday?
What's planned for today?
Are there any blockers?
Which decisions are pending from DK?
```

Invoke: `claude "run launch-programme-reporter"` (reads LAUNCH_TRACKER.md, generates report).

---

## Budget Estimate (Monthly Recurring)

| Item | Est. Monthly Cost | Notes |
|---|---|---|
| Supabase Pro | £20 | Current plan |
| Vercel Pro | £16 | Current plan |
| Anthropic API (Claude) | £50-200 | Depends on usage; prompt caching reduces 90% |
| AWS S3 (archive) | £5-15 | 50 engagements/yr × 500MB, growing over 7 years |
| Stripe fees | 1.4% + 20p/txn | UK card rate |
| Domain (auditengine.agency) | £3 | Annual, amortised |
| ICO registration | £3 (Tier 1) | Annual fee for small org |
| **Total (excl. Stripe fees)** | **£97-257/month** | |

---

## How to Use This Plan

1. **Each morning:** Read today's row in the plan. Invoke the relevant agent.
2. **Each evening:** Run `launch-programme-reporter` for a status report.
3. **When a decision is needed:** The plan marks these as "DK (DECISION)". Make the call, then the agent proceeds.
4. **When a human action is needed:** The plan marks these as "DK (HUMAN)". No agent can do these for you.
5. **If something slips:** The buffer days in Week 6 absorb 2-3 days of slip. Beyond that, push launch date.

---

*This is a living document. Update it as dates shift and items complete.*
