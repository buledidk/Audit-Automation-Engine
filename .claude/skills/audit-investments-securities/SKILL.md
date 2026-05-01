---
name: audit-investments-securities
description: "Audit investment portfolios, financial instruments (complex and basic), derivatives, and hedge accounting per IFRS 9/13, FRS 102 S11/S12, ISA 540 (estimates), ISA 620 (experts). Covers fair value hierarchy, impairment, classification, and FS-specific: trading book, AFS, HTM, fund holdings, securitisations, structured products. Non-FS: equity investments, subsidiaries, associates (FRS 102 S14/15), joint ventures. Trigger on 'investments audit', 'financial instruments', 'derivatives audit', 'hedge accounting', 'IFRS 9 classification', 'IFRS 13', 'fair value hierarchy', 'Level 3', 'FRS 102 S12', 'trading book', 'securitisation', 'structured products', 'fund holdings', 'investment impairment', 'ISA 540 investments', 'ISA 620 experts'."
---

# Investments & Securities — Significant Risk Area

Financial instruments involve **significant estimation uncertainty** particularly for Level 2/3 valuations and require consideration of ISA 540 (estimates) and ISA 620 (use of experts).

## Assertions and direction of testing

| Assertion | Risk level | Direction | Key procedures |
|-----------|-----------|-----------|---------------|
| **Existence** | Elevated | Confirm with custodian | Custodian confirmations, broker statements, registrar records |
| **Valuation (fair value/impairment)** | Significant | Independent pricing | Test to market data, evaluate models for Level 2/3 |
| **Rights & obligations** | Elevated | Confirm title | Verify legal ownership, pledged/encumbered securities |
| **Classification** | Elevated | Test to business model | IFRS 9 classification: amortised cost, FVOCI, FVTPL |
| **Completeness** | Moderate | Reconcile to custodian | Custodian records to GL, investigate breaks |
| **Disclosure** | Elevated | Verify IFRS 7/13 | Fair value hierarchy, risk disclosures, sensitivity |

## Non-financial services entities

### Equity investments in subsidiaries, associates, JVs
- FRS 102 S14 (subsidiaries): cost less impairment in individual accounts
- FRS 102 S15 (associates/JVs): cost, equity method, or fair value
- Impairment indicators: losses, net assets below carrying value, dividend capacity
- Confirm share certificates or registrar records for existence

### Basic financial instruments (FRS 102 S11)
- Listed investments: confirm to custodian, price to market data at YE
- Unlisted investments: test valuation methodology, review for impairment triggers
- Loans to group companies: confirm, test recoverability, arm's length terms

### Complex financial instruments (FRS 102 S12)
- Derivatives: confirm with counterparty, test fair value to market data
- Options, swaps, forwards: verify valuation models, inputs, counterparty credit risk
- Hedge accounting (S12.23): test designation, effectiveness, documentation

### Impairment of investments
- Review indicators: significant financial difficulty, breach of contract, probability of bankruptcy
- FRS 102: incurred loss model — test for objective evidence
- IFRS 9: ECL model for debt instruments at amortised cost or FVOCI

## Financial services entities

### Trading book (banks, broker-dealers)
- Daily mark-to-market: test sample of positions to independent market data
- P&L attribution: verify trading gains/losses to position movements
- VaR back-testing: review exceptions
- Segregation: verify trading vs banking book classification

### Available for sale / FVOCI portfolios
- Test fair value to market prices (Level 1) or broker quotes (Level 2)
- Recycling of gains/losses on disposal (IFRS 9: no recycling for equity FVOCI)
- OCI movements reconciliation

### Held to maturity / Amortised cost
- Test business model assessment: hold to collect vs hold to collect and sell
- Verify effective interest rate amortisation
- ECL on amortised cost debt: test staging, provision adequacy

### Fund holdings (asset managers)
- Confirm holdings with custodian/administrator
- NAV pricing: test to fund administrator reports, verify pricing methodology
- Side pockets, illiquid funds: heightened valuation risk

### Securitisations and structured products
- Derecognition: test whether risk and rewards transferred (IFRS 9.3.2)
- Continuing involvement: verify retained tranches valued correctly
- SPV consolidation assessment (IFRS 10)

### Use of experts (ISA 620)
- Where management uses pricing services or valuation experts: evaluate competence, objectivity
- Auditor's expert: consider need for independent valuation of Level 3 instruments
- Document reliance, scope, and findings

## Inputs

| Field | Required | Description |
|-------|----------|-------------|
| entityProfile | yes | Industry, instrument types, portfolios |
| materialityLevels | yes | PM, TE, trivial |
| investmentRegister | yes | Holdings list with classification and fair values |
| fairValueHierarchy | conditional | Required for IFRS reporters — Level 1/2/3 split |
| custodianDetails | yes | Names and contact for confirmation |

## Outputs

- Custodian confirmation and reconciliation schedule
- Fair value testing schedule by hierarchy level
- Classification assessment (IFRS 9 business model test)
- Impairment review and ECL calculation (where applicable)
- Investments existence, valuation, classification, and disclosure conclusion
