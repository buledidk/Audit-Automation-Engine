---
name: audit-tax-current-deferred
description: "Audit corporation tax (current) and deferred tax (IAS 12/FRS 102 S29). Covers DTA recoverability, temporary differences, tax rate changes, transfer pricing, tax losses, R&D tax credits, and FS-specific: banking surcharge, insurance premium tax, VAT on exempt supplies. Trigger on 'tax audit', 'corporation tax', 'deferred tax', 'IAS 12', 'FRS 102 S29', 'DTA recoverability', 'tax provision', 'temporary differences', 'tax losses', 'deferred tax asset', 'transfer pricing', 'R&D tax credits', 'banking surcharge', 'current tax', 'tax rate change', 'withholding tax', 'capital allowances'."
---

# Tax (Current & Deferred) — Elevated Risk Area

Tax provisions involve **inherent complexity** in calculating temporary differences and require judgement over deferred tax asset recoverability, engaging ISA 540 for estimation uncertainty.

## Assertions and direction of testing

| Assertion | Risk level | Direction | Key procedures |
|-----------|-----------|-----------|---------------|
| **Accuracy** | Elevated (primary) | Recalculate | Independent CT computation, DT calculation from temporary differences |
| **Completeness** | Elevated | Test all sources | Identify all taxable/deductible temporary differences, unused losses |
| **Valuation (DTA recoverability)** | Significant | Test forecasts | Future taxable profit forecasts supporting DTA recognition |
| **Classification** | Moderate | Current vs non-current | DT always non-current; CT due within 12 months |
| **Disclosure** | Moderate | Test to standards | Rate reconciliation, unrecognised DTAs, expiry of losses |

## Non-financial services entities

### Current tax computation
- Agree accounting profit to TB / financial statements
- Test adjustments: disallowable expenditure (entertaining, depreciation, fines)
- Capital allowances: AIA (Annual Investment Allowance), writing down allowances, FYA (first year)
- Verify tax rate applied: main rate, associated companies, marginal relief
- Prior year adjustments: compare prior year provision to actual CT600 filed
- Group relief: verify surrendering company has sufficient losses, formal claim documentation

### Deferred tax — temporary differences (IAS 12 / FRS 102 S29)
- Identify all temporary differences: PPE (CA vs NBV), provisions, share-based payments, pensions
- Taxable temporary differences = deferred tax liability (DTL)
- Deductible temporary differences = deferred tax asset (DTA, subject to recoverability)
- Verify rate: enacted or substantively enacted rate at balance sheet date
- Exceptions: initial recognition exemption (IAS 12.15/24), goodwill (no DT on non-deductible goodwill)

### DTA recoverability
- Management's forecasts of future taxable profits: test reasonableness, compare to actuals
- Reversal of existing DTLs: can DTAs be recovered against reversing DTLs?
- Tax planning opportunities: are there available strategies to generate taxable income?
- Time horizon: how far into the future are forecasts relied upon? Challenge if > 3-5 years
- History of losses: entity with recent losses carries higher burden of proof

### Transfer pricing
- Related party transactions: verify arm's length pricing
- Transfer pricing documentation: test to OECD guidelines
- Thin capitalisation: interest deductions on intercompany loans
- Country-by-country reporting (large groups)

### R&D tax credits
- Qualifying expenditure: staff costs, subcontractors, consumables, software
- SME vs RDEC (large company) scheme: verify correct scheme applied
- Above-the-line credit: test to HMRC claim documentation
- First-time claims: heightened risk of error in qualifying expenditure

### Tax losses
- Trading losses: carry forward indefinitely (post-April 2017 restrictions)
- Capital losses: carry forward against future capital gains only
- Loss restriction: 50% of profits above GBP 5m deduction allowance
- Verify HMRC correspondence for losses agreed or under enquiry

## Financial services entities

### Banking surcharge
- Corporation tax surcharge on banking profits exceeding GBP 100m allowance
- Surcharge rate: verify current applicable rate
- Surcharge profits calculation: separate from main CT calculation

### Insurance premium tax (IPT)
- Verify IPT rates applied correctly (standard vs higher rate)
- Test IPT returns to premium income records
- Reconcile IPT payable to returns filed

### VAT on exempt supplies
- Financial services: most supplies exempt (no input VAT recovery)
- Partial exemption: test annual adjustment calculation
- Capital goods scheme: monitor for significant capital purchases
- Verify de minimis limits and methods agreed with HMRC

### Withholding tax
- Cross-border interest and dividend payments: verify correct WHT rate applied
- Double taxation treaty relief: verify treaty rate, beneficial ownership
- Accrued WHT receivable: test recoverability from foreign tax authorities

## Inputs

| Field | Required | Description |
|-------|----------|-------------|
| entityProfile | yes | Industry, group structure, tax status |
| materialityLevels | yes | PM, TE, trivial |
| taxComputation | yes | Management's CT computation and DT workings |
| temporaryDifferences | yes | Schedule of all temporary differences with opening/closing |
| taxableProfitForecasts | conditional | Required where material DTAs recognised |
| priorYearTaxProvision | yes | For comparison to CT600 filed |

## Outputs

- Current tax computation review and independent recalculation
- Deferred tax temporary differences schedule with rate verification
- DTA recoverability assessment (forecasts, reversal pattern, history)
- Tax rate reconciliation (effective vs statutory) analysis
- Tax completeness, accuracy, and disclosure conclusion
