---
name: audit-receivables-credit-losses
description: "Audit trade receivables, expected credit losses, bad debt provisions, and debtor circularisation per ISA (UK) 505 (confirmations), IFRS 9 (ECL staging), FRS 102 S11. Covers ageing analysis, write-offs, credit risk assessment, and FS-specific: loan books, mortgage portfolios, insurance receivables, reinsurance recoverables. Trigger on 'receivables audit', 'trade debtors', 'ECL', 'expected credit loss', 'bad debt provision', 'debtor circularisation', 'IFRS 9 staging', 'FRS 102 S11', 'credit losses', 'ageing analysis', 'loan impairment', 'mortgage arrears', 'reinsurance recoverable', 'ISA 505 receivables', 'debtor confirmation'."
---

# Receivables & Credit Losses — Elevated Risk Area

Trade receivables and ECL provisions involve **significant estimation uncertainty** requiring judgement over forward-looking credit loss models under IFRS 9 / FRS 102 S11.

## Assertions and direction of testing

| Assertion | Risk level | Direction | Key procedures |
|-----------|-----------|-----------|---------------|
| **Existence** | Elevated | Records to source | Debtor circularisation (ISA 505), agree to invoices and delivery evidence |
| **Valuation (ECL)** | Significant | Test provision model | Verify staging (IFRS 9), test forward-looking information, historical loss rates |
| **Completeness** | Moderate | Source to records | Sales ledger to despatch records, unrecorded credit notes |
| **Rights & obligations** | Moderate | Confirm ownership | Factoring/discounting arrangements, assignment of receivables |
| **Cut-off** | Moderate | Test around YE | Last invoices/credit notes pre and post year-end, goods in transit |

## Non-financial services entities

### Debtor circularisation (ISA 505)
- Positive confirmations for material balances; negative for large populations of small balances
- Stratify population: select all balances > TE, random sample below TE
- Follow-up non-replies: second request, then alternative procedures (post-YE cash, invoices, delivery notes)
- Investigate discrepancies: disputed invoices, unapplied cash, timing differences

### Ageing analysis and provision
- Obtain and test ageing report accuracy (trace sample of invoices to correct ageing bucket)
- Test management's provision matrix: historical write-off rates by ageing bucket
- Under FRS 102 S11: incurred loss model — test for objective evidence of impairment
- Under IFRS 9: ECL model — verify staging (current, 30dpd, 90dpd) and forward-looking overlays
- Review post-YE cash receipts to assess recoverability of aged items

### Write-offs and credit notes
- Test authorisation of write-offs to delegated authority limits
- Post-YE credit note review: verify not relating to pre-YE revenue (cut-off)
- Investigate unusual patterns (large write-offs just before/after YE)

### Factoring and invoice discounting
- Recourse vs non-recourse: derecognition criteria under IFRS 9 / FRS 102 S11
- Verify continuing involvement disclosures
- Confirm arrangements with factor

## Financial services entities

### Loan books (banks, building societies)
- ECL model review: PD (probability of default) x LGD (loss given default) x EAD (exposure at default)
- Stage 1 (12-month ECL), Stage 2 (lifetime ECL, significant increase in credit risk), Stage 3 (credit-impaired)
- Test SICR (significant increase in credit risk) triggers and quantitative/qualitative criteria
- Forward-looking macro overlays: GDP, unemployment, house price scenarios
- Management overlay / post-model adjustments: challenge reasonableness

### Mortgage portfolios
- Test LTV ratios to property valuations (automated valuation models vs surveyor reports)
- Arrears analysis: months in arrears, forbearance measures, possession pipeline
- Collateral valuation: frequency, methodology, forced-sale discount

### Insurance receivables
- Premium debtors: ageing, test to policy records
- Salvage and subrogation recoverables: test valuation to historical recovery rates
- Reinsurance recoverables: confirm with reinsurers, test credit quality of reinsurance panel

### Reinsurance recoverables
- Confirm balances with reinsurers (ISA 505)
- Test reinsurer credit ratings and concentration risk
- Verify calculation of amounts recoverable under treaty and facultative arrangements

## Inputs

| Field | Required | Description |
|-------|----------|-------------|
| entityProfile | yes | Industry, receivable types, credit risk profile |
| materialityLevels | yes | PM, TE, trivial |
| debtorPopulation | yes | Ageing analysis, top debtors, concentration |
| eclModel | conditional | Required for IFRS 9 reporters — PD/LGD/EAD parameters |
| priorYearProvision | no | For analytical comparison and roll-forward |

## Outputs

- Debtor circularisation control schedule (sent, received, exceptions, alternative procedures)
- ECL / bad debt provision testing schedule with staging analysis
- Ageing analysis test results and recoverability conclusion
- Receivables existence, valuation, and completeness conclusion
