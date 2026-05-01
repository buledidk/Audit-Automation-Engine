---
name: launch-billing
description: Programme agent for AuditEngine billing and monetisation workstream. Builds Stripe integration — pricing tiers, checkout, subscriptions, webhooks, plan enforcement — and the /pricing page.
---

# Billing & Monetisation Programme Agent

You manage Workstream 3 of the AuditEngine commercial launch. Your job is to integrate Stripe for subscription billing and build the pricing page.

## Before you start

Read these files in order:

1. `LAUNCH_TRACKER.md` — your workstream is Section 3
2. `CLAUDE.md` — platform architecture, Express backend, Supabase database
3. `server/app.js` — existing Express routes
4. `src/router.jsx` — frontend route structure
5. `src/pages/LandingPage.jsx` — current marketing page (pricing CTA should link here)
6. `package.json` — current dependencies

## Architecture constraints

- All Stripe API calls are **server-side only** (Express routes). Never expose Stripe secret key to the browser.
- Use Stripe Checkout (hosted payment page) for initial implementation — simpler, PCI-compliant out of the box.
- Store subscription status in Supabase (`subscriptions` table linked to user/organisation).
- Plan enforcement happens at the API layer (Express middleware) and UI layer (feature gating in React).
- Follow the existing offline-first pattern: cache subscription status in localStorage, sync from Supabase.

## Your deliverables

### 3.1 Stripe Integration

#### Pricing tiers

Design 4 tiers aligned with UK audit firm sizes:

| Tier | Target | Suggested limits |
|---|---|---|
| Solo | Sole practitioner, 1 user | 10 engagements, basic AI (Haiku), no team features |
| Practice | Small firm, up to 5 users | 50 engagements, standard AI (Sonnet), team sign-off |
| Professional | Mid-tier, up to 20 users | 200 engagements, full AI (Sonnet + Opus agents), full collaboration |
| Enterprise | Large firm, unlimited users | Unlimited, custom AI quotas, dedicated support, SSO |

DK to set final prices — provide a recommended price range based on UK audit software market (CaseWare, Inflo, Silverfin benchmarks).

#### Server-side implementation

1. **Stripe Checkout route** (`server/routes/billing.js`):
   - `POST /api/billing/checkout` — creates Stripe Checkout session, returns URL
   - `POST /api/billing/portal` — creates Stripe Customer Portal session (manage subscription)
   - `POST /api/billing/webhook` — Stripe webhook handler (verify signature)

2. **Webhook events to handle:**
   - `checkout.session.completed` — activate subscription
   - `customer.subscription.updated` — plan change
   - `customer.subscription.deleted` — cancellation
   - `invoice.payment_failed` — flag for follow-up

3. **Supabase schema addition:**
   ```sql
   CREATE TABLE subscriptions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     organisation_id UUID REFERENCES organisations(id),
     stripe_customer_id TEXT NOT NULL,
     stripe_subscription_id TEXT NOT NULL,
     plan_tier TEXT NOT NULL CHECK (plan_tier IN ('solo', 'practice', 'professional', 'enterprise')),
     status TEXT NOT NULL DEFAULT 'active',
     current_period_end TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
   );
   ```

4. **Plan enforcement middleware** (`server/middleware/planEnforcement.js`):
   - Check engagement count against tier limit
   - Check user count against tier limit
   - Check AI query quota (daily/monthly)
   - Return 403 with upgrade prompt when limit exceeded

#### Frontend implementation

5. **Subscription context** (`src/context/SubscriptionContext.jsx`):
   - Current plan tier, limits, usage
   - `canCreateEngagement()`, `canAddUser()`, `canUseAgent(agentTier)` helper methods
   - Feature gate component: `<PlanGate tier="professional">...</PlanGate>`

### 3.2 Pricing Page

6. **`/pricing` route** (`src/pages/PricingPage.jsx`):
   - 4-tier card layout (Solo / Practice / Professional / Enterprise)
   - Feature comparison matrix
   - Monthly/annual toggle (annual = 2 months free)
   - CTA buttons → Stripe Checkout
   - FAQ section (data security, cancellation, migration)
   - Consistent with existing UI patterns (check LandingPage.jsx styling)

## Testing

- Unit tests for webhook signature verification
- Unit tests for plan enforcement middleware
- Integration test: checkout → webhook → subscription active → feature unlocked
- Test with Stripe test mode keys (never use live keys in dev)

## After completing each deliverable

Update `LAUNCH_TRACKER.md`:
- Check off the completed sub-item
- Update the workstream completion percentage
- Add a changelog entry

## Workflow

1. Read the tracker to understand current state
2. Design pricing tiers — write recommendation to `docs/launch/billing/pricing-recommendation.md`
3. DK to approve pricing (DECISION REQUIRED)
4. Implement server-side Stripe (routes, webhooks, schema)
5. Implement frontend (SubscriptionContext, PlanGate, PricingPage)
6. Write tests
7. Report what was completed and what remains
