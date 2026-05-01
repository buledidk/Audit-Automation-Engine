---
name: audit-ppe-intangibles-impairment
description: "Audit PPE (IAS 16/FRS 102 S17), intangible assets (IAS 38/FRS 102 S18), goodwill (IFRS 3/FRS 102 S19), and impairment testing (IAS 36/FRS 102 S27). Covers capitalisation, componentisation, revaluation, useful life, depreciation/amortisation, and FS-specific: bank premises, capitalised IT, customer lists, brand values. Trigger on 'PPE audit', 'fixed assets', 'tangible assets', 'intangible assets', 'goodwill impairment', 'IAS 16', 'IAS 36', 'IAS 38', 'IFRS 3', 'FRS 102 S17', 'FRS 102 S18', 'depreciation testing', 'amortisation', 'impairment review', 'revaluation', 'componentisation', 'capital expenditure', 'CGU', 'useful life'."
---

# PPE, Intangibles & Impairment — Elevated Risk Area

Non-current assets require judgement over **useful lives, residual values, impairment indicators, and fair value** for revalued assets, engaging ISA 540 for estimation uncertainty.

## Assertions and direction of testing

| Assertion | Risk level | Direction | Key procedures |
|-----------|-----------|-----------|---------------|
| **Existence** | Moderate | Physical verification | Physical inspection of material assets, title deeds, registrations |
| **Valuation (depreciation/impairment)** | Elevated | Test estimates | Useful life review, impairment indicator assessment, CGU modelling |
| **Completeness** | Moderate | Source to records | Repair/maintenance account review for items to capitalise |
| **Rights & obligations** | Moderate | Title verification | Land registry, vehicle registration, lease vs buy analysis |
| **Classification** | Moderate | Capital vs revenue | Test capitalisation policy, verify items meet recognition criteria |

## Non-financial services entities

### PPE additions (IAS 16 / FRS 102 S17)
- Test additions to supporting documentation: supplier invoices, contracts, board approvals
- Capitalisation criteria: probable future economic benefits, reliable measurement
- Directly attributable costs: include installation, professional fees; exclude admin, training
- Self-constructed assets: test cost accumulation (materials, labour, overheads, borrowing costs if IAS 23)
- Capital commitments: verify disclosure of contracted but not provided for

### Depreciation and useful lives
- Test depreciation calculation: cost x rate x time (verify pro-rata for part-year additions/disposals)
- Review useful lives for reasonableness against physical condition and usage
- Componentisation: verify significant components depreciated separately (e.g. roof, lifts, plant)
- Residual values: test to disposal evidence, should not exceed carrying amount

### Revaluations (FRS 102 S17.15C / IAS 16.31)
- Valuer: assess competence, capability, objectivity (ISA 620)
- Valuation methodology: market approach, cost approach, income approach
- Revaluation surplus: verify OCI treatment and reserves movement
- Frequency: sufficiently regular that carrying amount not materially different from fair value

### Disposals
- Test proceeds to sale agreement, verify gain/loss calculation
- Derecognition: remove cost and accumulated depreciation
- Investigate assets with nil NBV still in use (fully depreciated but operational)

### Intangible assets (IAS 38 / FRS 102 S18)
- Purchased intangibles: test cost to acquisition documentation
- Internally generated: verify development costs meet recognition criteria (IAS 38.57 / FRS 102 S18.8H)
- Research costs: must be expensed, test no inappropriate capitalisation
- Software: distinguish between purchased licences, SaaS (expense), and internally developed

### Goodwill (IFRS 3 / FRS 102 S19)
- Verify acquisition accounting: fair value of consideration, identifiable net assets, residual goodwill
- FRS 102: amortise over useful life (max 5 years if cannot reliably estimate, max 10 years)
- IFRS: annual impairment test (no amortisation)

### Impairment testing (IAS 36 / FRS 102 S27)
- Impairment indicators: external (market decline, adverse changes) and internal (obsolescence, restructuring)
- CGU identification: smallest group of assets generating independent cash flows
- Value in use: test discount rate, cash flow projections, terminal value, growth rates
- Fair value less costs of disposal: test to market evidence
- Sensitivity analysis: key assumptions, headroom analysis
- Reversal of impairment (not permitted for goodwill under IFRS)

## Financial services entities

### Bank premises and branches
- Branch network rationalisation: impairment indicators where closures planned
- Right-of-use assets under IFRS 16 for leased branches
- Heritage properties: specialist valuations

### Capitalised IT systems
- Core banking systems, trading platforms: verify meets capitalisation criteria
- Useful life assessment: technology refresh cycles
- Impairment triggers: system replacement, migration to cloud (SaaS)

### Customer lists and brand values (insurance, asset management)
- Acquired through business combinations: test fair value at acquisition
- Amortisation over customer attrition period
- Impairment: test against customer retention data

## Inputs

| Field | Required | Description |
|-------|----------|-------------|
| entityProfile | yes | Industry, asset types, revaluation policy |
| materialityLevels | yes | PM, TE, trivial |
| fixedAssetRegister | yes | Additions, disposals, depreciation, NBV |
| impairmentIndicators | conditional | Required where indicators identified |
| valuationReports | conditional | Required where revaluation policy adopted |

## Outputs

- Additions and disposals testing schedule
- Depreciation/amortisation recalculation schedule
- Impairment indicator assessment and CGU analysis
- Revaluation review (where applicable)
- PPE/intangibles existence, valuation, and completeness conclusion
