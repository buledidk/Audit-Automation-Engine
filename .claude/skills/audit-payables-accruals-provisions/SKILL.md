---
name: audit-payables-accruals-provisions
description: "Audit trade payables, accruals, provisions (IAS 37/FRS 102 S21), and contingent liabilities. Covers search for unrecorded liabilities, supplier statement reconciliation, and FS-specific: insurance claims reserves, regulatory fines. Non-FS: legal provisions, environmental, onerous contracts, dilapidations. Trigger on 'payables audit', 'trade creditors', 'accruals testing', 'provisions audit', 'IAS 37', 'FRS 102 S21', 'contingent liabilities', 'unrecorded liabilities', 'supplier reconciliation', 'claims reserves', 'dilapidations', 'onerous contracts', 'restructuring provision', 'warranty provision', 'legal provision', 'SURL', 'search for unrecorded liabilities'."
---

# Payables, Accruals & Provisions — Elevated Risk Area

Payables and provisions are primarily tested for **completeness** (understatement risk), requiring a search for unrecorded liabilities and careful evaluation of provision recognition criteria under IAS 37 / FRS 102 S21.

## Assertions and direction of testing

| Assertion | Risk level | Direction | Key procedures |
|-----------|-----------|-----------|---------------|
| **Completeness** | Elevated (primary) | Source to records | SURL, supplier statements, post-YE payments, unmatched GRNs |
| **Accuracy** | Moderate | Recalculate | Test accrual calculations, supplier invoice matching |
| **Cut-off** | Elevated | Test around YE | Last GRNs/invoices pre and post YE, goods in transit |
| **Classification** | Moderate | Review coding | Current vs non-current, trade vs other, provisions vs accruals |
| **Disclosure** | Elevated (provisions) | Test to IAS 37 | Nature, timing, uncertainty, contingent liabilities |

## Non-financial services entities

### Trade payables
- Supplier statement reconciliations: obtain statements for major suppliers, reconcile to purchase ledger
- Investigate reconciling items: unrecorded invoices, disputed amounts, timing differences
- Test ageing: investigate debit balances (potential prepayments or duplicate payments)
- Confirm material balances where statements unavailable

### Search for unrecorded liabilities (SURL)
- Review post-YE payments: test sample of payments after year-end back to pre-YE invoices/goods receipt
- Unmatched GRNs at year-end: goods received but no invoice — verify accrued
- Review post-YE invoices: identify those relating to pre-YE goods/services
- Board minutes, contracts, legal correspondence: identify commitments not yet recorded
- Inquiry of management: outstanding purchase orders, disputes, claims

### Accruals
- Test material accruals to supporting calculation and underlying data
- Recalculate utility accruals, rent accruals, bonus accruals
- Compare to prior year: investigate large movements or items no longer accrued
- Post-YE settlement: compare actual invoice to accrual amount, assess estimation accuracy

### Provisions (IAS 37 / FRS 102 S21)
- Three recognition criteria: present obligation, probable outflow, reliable estimate
- Legal provisions: obtain lawyer's letter (ISA 501), assess probability and quantum
- Warranty provisions: test to historical claims data, product defect rates
- Restructuring: verify detailed formal plan announced to those affected before YE
- Onerous contracts: test unavoidable costs exceed expected economic benefits
- Dilapidations: test to lease obligations, surveyor reports, discount rate

### Contingent liabilities
- Possible but not probable obligations: disclosure only (not recognised)
- Review legal correspondence, board minutes, inquiry of management
- Evaluate completeness: no incentive for management to disclose potential liabilities

## Financial services entities

### Insurance claims reserves
- Outstanding claims: case-by-case review for large claims, statistical methods for attritional
- IBNR (incurred but not reported): actuarial methods, test development factors
- Claims handling expense reserves
- Reinsurance recoveries: net vs gross presentation, bad debt on reinsurance
- Adequacy test: liability adequacy test under IFRS 17 / IFRS 4

### Regulatory fines and levies
- FCA fines, PRA levies: verify provision or disclose as contingent
- FSCS (Financial Services Compensation Scheme) levy: test calculation
- PPI provisions (legacy): verify adequacy, run-off assumptions

### Restructuring provisions (banking)
- Branch closure programmes: test to detailed formal plan
- Redundancy costs: verify crystallised obligations vs future restructuring
- Onerous lease provisions on vacated properties

## Inputs

| Field | Required | Description |
|-------|----------|-------------|
| entityProfile | yes | Industry, payable types, provision categories |
| materialityLevels | yes | PM, TE, trivial |
| supplierPopulation | yes | Top suppliers, statement availability |
| provisionsSchedule | yes | List of provisions with nature, amount, basis |
| lawyerLetterResponses | conditional | Required where legal provisions exist |

## Outputs

- Supplier statement reconciliation schedule
- Search for unrecorded liabilities testing schedule
- Provisions assessment (recognition criteria, measurement, movement)
- Contingent liabilities completeness review
- Payables/accruals/provisions completeness and accuracy conclusion
