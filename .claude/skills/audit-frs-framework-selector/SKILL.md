---
name: audit-frs-framework-selector
description: Select the correct UK/Irish financial reporting framework for a statutory audit. Triggers on "which framework", "FRS 102 or IFRS", "reporting framework", "applicable standards", or when audit-engagement-scope delegates framework selection. Walks the decision tree from entity type through to applicable GAAP, including sector-specific SORPs and recent amendments (FRS 102 January 2026 amendments, IFRS 18).
---

## When to use

- User asks which reporting framework applies to an entity
- User asks about FRS 102 vs FRS 101 vs IFRS vs FRS 105
- Delegated from `audit-engagement-scope` skill
- User mentions SORP, Charities SORP, Housing SORP, or Academy Accounts Direction
- User asks about framework transition or first-time adoption

## Actions

1. **Determine entity type** — collect: listed/AIM/private, group parent or subsidiary, public interest entity (PIE), charity, pension scheme, LLP, public sector.
2. **Walk the framework decision tree:**

   ```
   Listed / AIM parent → EU-adopted IFRS (mandatory per IAS Regulation)
   │
   Qualifying subsidiary of IFRS group → FRS 101 (reduced disclosure)
   │   └─ Must meet FRS 101 para 5-6 conditions (shareholder notification, consolidated accounts available)
   │
   Charity → FRS 102 + Charities SORP (FRS 102) — NEVER FRS 105
   │
   Micro-entity (CA06 s384A) → FRS 105 (if directors elect)
   │   └─ Excluded: charities, LLPs with corporate members, PIEs, financial institutions
   │
   Small entity (CA06 s382) → FRS 102 Section 1A (small entities regime)
   │
   All others → FRS 102 (full)
   │
   Voluntary IFRS adoption → permitted for any entity, but irrevocable for groups
   ```

3. **Check sector-specific overlays:**
   - Banks/building societies → FRS 102 + bank-specific disclosure requirements
   - Insurance → FRS 102 / FRS 103 (Insurance Contracts) or IFRS 17
   - Pension schemes → FRS 102 Section 34 + SORP
   - Housing associations → FRS 102 + Housing SORP 2018
   - Academies → Academies Accounts Direction (ESFA)
   - Public sector → FReM / Whole of Government Accounts Manual

4. **Flag recent amendments:**
   - FRS 102 January 2026 amendments (revenue, leases, financial instruments alignment)
   - IFRS 18 (Presentation and Disclosure) replacing IAS 1 — effective 1 Jan 2027
   - FRS 101 consequential amendments from FRS 102 revision
   - Charities SORP 2024 update

5. **Output framework recommendation** with:
   - Selected framework and edition
   - Legal basis (Companies Act 2006 section / Charities Act 2011 / relevant regulations)
   - Applicable SORPs
   - Key disclosure differences from alternative frameworks
   - Transition requirements if changing framework

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| entityType | enum | yes | listed, AIM, private, subsidiary, charity, pension, LLP, publicSector |
| isPIE | boolean | yes | Public Interest Entity status |
| parentFramework | string | no | Framework used by parent (for subsidiary analysis) |
| sector | string | no | Specific sector for SORP determination |
| currentFramework | string | no | Existing framework if transitioning |
| yearEnd | YYYY-MM-DD | yes | Year-end for amendment applicability |

## Outputs

- Framework recommendation with legal basis
- Decision tree path taken (for working paper documentation)
- Applicable SORPs and sector overlays
- Amendment impact summary
- Transition checklist (if framework change)

## Codebase references

- `src/FRSEncyclopaedia.js` — FRS 100-105 with 2026 amendments
- `src/IFRSEncyclopaedia.js` — Full IFRS standards
- `src/StandardsLibrary.js` — ISA (UK) cross-references to framework requirements
- `src/RegulatoryData.js` — Companies Act 2006, Charities Act
