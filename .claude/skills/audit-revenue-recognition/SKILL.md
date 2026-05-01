---
name: audit-revenue-recognition
description: "Audit revenue recognition across all entity types per ISA (UK) 240 (presumed fraud risk), ISA 315/330, IFRS 15 / FRS 102 S23. Covers non-FS (product sales, services, construction contracts, licences) and FS entities (interest income NII/NIM, fee/commission, premium income, fund management fees, trading gains). Assertion-level testing for occurrence, accuracy, cut-off, classification, and completeness. Trigger on 'revenue recognition', 'revenue testing', 'ISA 240 revenue', 'presumed risk revenue', 'cut-off testing revenue', 'interest income audit', 'fee income', 'premium income', 'IFRS 15', 'FRS 102 S23', 'five-step model', 'contract revenue', 'deferred income', 'accrued income', 'bill-and-hold', 'channel stuffing', 'revenue fraud'."
---

# Revenue Recognition — Significant Risk

Revenue recognition carries a **presumed risk of fraud** under ISA (UK) 240 para 26. This presumption can only be rebutted with documented rationale approved by the engagement partner.

## Assertions and direction of testing

| Assertion | Risk level | Direction | Key procedures |
|-----------|-----------|-----------|---------------|
| **Occurrence** | Significant (ISA 240) | Records → source docs | Vouch sales to contracts, delivery notes, customer acceptance |
| **Accuracy** | Elevated | Recalculate, agree to source | Recalculate invoice pricing to contracts, verify FX rates |
| **Cut-off** | Significant | Test transactions around YE | Last delivery notes pre/post YE, credit notes post-YE |
| **Classification** | Moderate | Review coding | Correct revenue stream mapping, capital vs revenue |
| **Completeness** | Lower (fraud focus is overstatement) | Source → records | Delivery notes not matched to invoices, contract backlogs |

## Non-financial services entities

### Product sales (FRS 102 S23.10 / IFRS 15)
- Five-step model: identify contract → performance obligations → transaction price → allocate → recognise
- Test: bill-and-hold arrangements (goods not shipped), consignment sales, volume rebates/retrospective discounts
- Cut-off: match despatch records to revenue recognition date
- Channel stuffing indicators: spike in sales last month of period, unusual credit terms

### Service revenue (FRS 102 S23.14)
- Stage of completion method: verify % complete to project records
- Test milestone-based recognition to evidence of delivery
- Deferred income: verify services not yet delivered are deferred

### Construction contracts (FRS 102 S23.17)
- Input method (cost-to-cost) or output method
- Test estimated costs to complete, contract modifications
- Onerous contracts: provision required if expected loss

### Licence revenue
- Right-to-use (point in time) vs right-to-access (over time)
- Test classification to contract terms

## Financial services entities

### Interest income (NII/NIM)
- Effective interest rate method (IFRS 9 / FRS 102 S11)
- Recalculate using loan balances × contractual rate, verify EIR adjustments for fees/costs
- Suspended interest on Stage 3 / non-performing loans
- NIM analysis: compare to prior period, peer benchmarks

### Fee and commission income
- Performance obligation timing: upfront fees (amortise) vs ongoing fees (as earned)
- Trail commission: verify to AUM/fund NAV × fee rate
- Clawback provisions: test for reversal triggers

### Insurance premium income
- Earned vs unearned: verify UPR (unearned premium reserve) calculation
- Test premium allocation approach under IFRS 17 / FRS 103
- Reinsurance: gross vs net presentation

### Trading revenue / gains
- Fair value through P&L: verify mark-to-market to market data
- Day-one gains: test to IFRS 9 requirements
- Realised vs unrealised split

### Fund management fees
- Test fee calculation: AUM × management fee rate × period
- Performance fees: verify crystallisation date and hurdle rate
- Rebates to institutional investors

## Fraud indicators (ISA 240)

- Revenue growth inconsistent with industry/economy
- Unusual journal entries to revenue accounts (especially manual, month-end, round amounts)
- Unusually high proportion of revenue recognised in last weeks of period
- Side agreements altering contract terms
- Related party revenue without commercial substance
- Credit notes issued post year-end reversing prior period sales

## Substantive analytical procedures

For entities with predictable, stable revenue:
- Monthly revenue × average selling price × volume = independent expectation
- Compare to recorded revenue, investigate variances > PM
- Gross margin analysis by product/service/segment
- Revenue per employee, per square foot, per unit (industry-specific)

## Inputs

| Field | Required | Description |
|-------|----------|-------------|
| entityProfile | yes | Industry, revenue streams, contracts |
| materialityLevels | yes | PM, TE, trivial |
| revenueStreams | yes | Breakdown by type (products, services, interest, fees) |
| priorYearRevenue | no | For analytical comparison |
| contractsSample | no | Key contracts for detailed testing |

## Outputs

- Revenue testing programme by assertion and revenue stream
- Cut-off testing schedule (pre/post YE transactions)
- Fraud indicator checklist with findings
- ISA 240 presumed risk response documentation
