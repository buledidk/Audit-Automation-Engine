---
name: finance-intercompany
description: |
  Intercompany reconciliation, matching, elimination, and policy management for group
  reporting. Covers trading balances, loan balances, management charges, dividends,
  recharges, unrealised profit, transfer pricing, IC matrices, and dispute resolution.
  FS-specific: intra-group large exposures (banking), intra-group reinsurance,
  intra-group derivatives, intra-group funding.
  Trigger: 'intercompany', 'IC reconciliation', 'intercompany elimination',
  'IC matching', 'transfer pricing', 'management charges', 'cost allocation',
  'IC loan', 'unrealised profit', 'intra-group', 'IC matrix', 'intercompany balance'.
---

# Intercompany Reconciliation and Elimination -- Full Process Guide

This skill covers the end-to-end intercompany (IC) process from transaction origination through reconciliation, elimination, and reporting, for both IFRS and FRS 102 groups.

---

## 1. IC Transaction Types

### 1.1 Trading Balances
- Sales of goods and services between group entities (IC revenue and cost of sales)
- Must be invoiced, recorded in both entities' ledgers, and subject to the same credit control as third-party transactions

### 1.2 Loan Balances
- Intra-group loans: parent to subsidiary, subsidiary to parent, or between fellow subsidiaries
- May be interest-bearing (arm's length rate) or interest-free (concessionary loan treatment under FRS 102 S11/S34)
- Classify as current or non-current; FX on IC loans generates exchange differences to track separately

### 1.3 Management Charges and Recharges
- Central costs allocated to subsidiaries: shared service centre, IT, HR, corporate overhead
- Must be supported by a cost allocation methodology; cross-border charges require transfer pricing documentation
- Recharges for specific costs incurred on behalf of another entity (insurance premiums, property costs)

### 1.4 Dividends
- Dividends declared by subsidiaries and received by the parent or fellow group entities
- Timing mismatches arise when one entity recognises before the other at period-end

### 1.5 Royalties and Licence Fees
- Payments for use of group IP (brands, technology, patents)
- Subject to transfer pricing rules and potentially withholding tax on cross-border payments

### 1.6 Capital Contributions and Equity
- Parent injecting capital into a subsidiary (recognised as investment in parent, share capital/premium in subsidiary)
- No P&L effect; eliminated by cancelling investment against subsidiary equity on consolidation

---

## 2. IC Matching Process

### 2.1 Bilateral Confirmation
- Each entity confirms its IC balance with the counterparty at period-end
- Standardised IC confirmation template: entity names, balance date, currency, gross balance, breakdown by transaction type
- Both debit and credit sides must agree before the balance is deemed reconciled

### 2.2 Tolerance Thresholds
- Set a materiality threshold for IC differences (e.g., lesser of GBP 5,000 or 1% of the IC balance)
- Differences within threshold accepted without further investigation (subject to group policy)
- Differences exceeding threshold must be investigated and resolved before consolidation close

### 2.3 Dispute Escalation and Resolution
- Step 1: Entities exchange transaction-level detail to identify mismatched items
- Step 2: Investigate root cause -- timing differences, FX rate differences, mispostings, unrecorded transactions
- Step 3: One or both entities post correcting journals
- Step 4: Re-confirm corrected balances
- Step 5: Escalate unresolved items to group finance with a deadline tied to the reporting timetable

### 2.4 Resolution Deadline
- Pre-close: preliminary IC reconciliation 2-3 weeks before period-end
- Period-end: final IC reconciliation within 3-5 business days of month/year-end
- Hard lock: IC balances locked for consolidation; post-lock adjustments require group finance approval

---

## 3. Elimination Journals

### 3.1 Balance Sheet Eliminations
- Eliminate all IC receivables against IC payables (IC debtors vs IC creditors)
- Eliminate IC loan receivables against IC loan payables
- Eliminate IC dividend receivable against IC dividend payable
- Residual after elimination is a reconciliation difference to investigate

### 3.2 P&L Eliminations
- Eliminate IC revenue against IC cost of sales (IC sales vs IC purchases)
- Eliminate IC management charge income against IC management charge expense
- Eliminate IC interest income against IC interest expense
- Eliminate IC royalty income against IC royalty expense
- Eliminate IC dividend income against IC dividends paid (retained earnings movement)

### 3.3 Journal Documentation
- Each elimination journal: numbered, described, cross-referenced to IC reconciliation, prepared and reviewed by separate individuals
- Master elimination journal schedule carried forward period-to-period
- Distinguish between automated eliminations (system-generated) and manual eliminations

---

## 4. Unrealised Profit Elimination

### 4.1 Inventory Held at Intercompany Margin
- If Entity A sells goods to Entity B at a profit and Entity B still holds those goods at year-end, unrealised profit must be eliminated
- Calculation: inventory held from IC purchases x gross margin percentage on IC sales
- Journal: Dr Cost of sales (or retained earnings for prior year element) / Cr Inventory
- Deferred tax effect: recognise DTA on eliminated profit (tax paid when inventory sold to third parties)

### 4.2 Fixed Assets Transferred Intra-Group
- If Entity A transfers a fixed asset to Entity B above (or below) carrying amount, unrealised profit/loss must be eliminated
- Restate asset to original group carrying amount
- Adjust depreciation in subsequent periods to reflect group cost, not transfer price
- Journal at transfer: Dr Gain on disposal / Cr PPE
- Journal in subsequent periods: Dr PPE (accumulated depreciation) / Cr Depreciation expense

### 4.3 Upstream vs Downstream
- Downstream (parent to sub): full elimination against parent's profit; NCI unaffected
- Upstream (sub to parent): eliminate against subsidiary's profit; NCI bears proportionate share of the unrealised profit adjustment

---

## 5. IC Loans

### 5.1 Interest Accrual Alignment
- Both entities must accrue interest on the same basis (same rate, same day count convention, same accrual period)
- FX on IC loan balances: each entity recognises FX gains/losses in P&L in individual accounts (IAS 21.28)
- On consolidation, if the IC balance is part of the net investment in a foreign operation, FX may be recognised in OCI (IAS 21.32)

### 5.2 Eliminate Interest Income/Expense
- IC interest income in the lending entity eliminated against IC interest expense in the borrowing entity
- Any mismatch due to timing or rate differences must be resolved before consolidation

---

## 6. Transfer Pricing

### 6.1 Arm's Length Principle
- IC transactions must be priced as if the parties were independent (OECD TP Guidelines, UK TIOPA 2010 Part 4)
- Methods: comparable uncontrolled price (CUP), resale price, cost plus, transactional net margin (TNMM), profit split

### 6.2 Documentation
- Master file: group-wide TP documentation (OECD BEPS Action 13)
- Local file: entity-level TP documentation for each country
- Country-by-country (CbC) reporting: for groups with consolidated revenue >= EUR 750m
- UK: SAO (Senior Accounting Officer) obligations for large companies (FA 2009 Schedule 46)

### 6.3 HMRC Compliance
- HMRC may challenge IC pricing if it results in a UK tax disadvantage
- Advance Pricing Agreements (APAs) provide certainty for material IC arrangements
- Maintain contemporaneous documentation; do not prepare retrospectively

---

## 7. IC Matrix for Large Groups

### 7.1 N x N Matrix Design
- Rows = entities, columns = counterparty entities, cells = net IC balance
- Matrix should be zero-sum (total debits = total credits across the group)
- Use matrix to identify: largest IC exposures, entities with the most IC relationships, chronic mismatches

### 7.2 Automated Matching and Exception Reporting
- ERP-based IC modules: SAP ICM, Oracle Intercompany, Workiva, BlackLine
- Automated matching at transaction level reduces manual reconciliation
- Workflow tools route unmatched items to responsible parties with escalation
- Exception reporting highlights items beyond tolerance thresholds

---

## 8. Common IC Issues

### 8.1 Timing Differences (Month-End Cutoff)
- One entity records a transaction before the counterparty (goods shipped but not received)
- Resolution: identify cut-off differences and agree which entity adjusts

### 8.2 FX on IC Balances
- IC balances in a currency other than one or both entities' functional currency generate FX gains/losses
- Mismatches when entities use different FX rates; standardise rate sources

### 8.3 Unmatched Items
- Items recorded by one entity but not the counterparty: mispostings, contra errors, wrong IC account
- Resolution: transaction-level matching, ageing analysis, regular purge of stale items

### 8.4 Different Accounting Periods
- Entities with non-coterminous year-ends require alignment (IFRS 10: subsidiary period-end must be within 3 months)

---

## 9. IC Policy

### 9.1 Netting Frequency and Settlement Terms
- Group policy: netting frequency (monthly, quarterly), settlement terms (e.g., 30 days after netting statement)
- Multilateral netting: central treasury nets all IC balances and instructs net payments
- Benefits: reduces cross-border payments, FX exposure, and banking costs

### 9.2 Interest on IC Loans
- Policy specifying whether IC loans bear interest and at what rate
- Arm's length rate required on cross-border IC loans (transfer pricing)
- Domestic IC loans: interest-free may be acceptable but consider thin capitalisation rules

### 9.3 Recharge Methodology
- Formal IC agreements for material arrangements: loan agreements, service level agreements, licence agreements
- Agreements executed before transactions commence (not retrospectively)
- Annual review and renewal of IC agreements

---

## 10. Financial Services Specific Considerations

### 10.1 Intra-Group Large Exposures (CRD/CRR)
- CRR Article 395: large exposure limits (25% of eligible capital) apply to intra-group exposures unless exempted under Article 400(2)
- Exemptions require PRA application and are subject to conditions
- Even where exempt, intra-group large exposures must be reported (COREP C28/C29)
- Ring-fencing: additional restrictions between ring-fenced bodies and non-ring-fenced entities

### 10.2 Intra-Group Reinsurance
- Intra-group reinsurance on arm's length terms (Solvency II Article 265)
- Reported as intra-group transaction to the group supervisor
- Elimination on consolidation: ceded premiums, claims recoveries, reinsurance assets/liabilities
- Risk transfer assessment: ensure genuine risk transfer (not a financing arrangement)

### 10.3 Intra-Group Derivatives
- Internal derivatives for centralised risk management (subsidiary hedges FX with group treasury, group treasury hedges externally)
- On consolidation, internal derivative eliminated; only external hedge remains
- Internal derivative does not qualify for hedge accounting in consolidated accounts
- Transfer pricing: intra-group derivative pricing must reflect arm's length terms

### 10.4 Intra-Group Funding
- Central treasury funding model: parent raises external debt and on-lends to subsidiaries
- IC funding must comply with regulatory capital requirements (CRR large exposures, ring-fencing)
- Eliminate IC interest income/expense and IC loan balances on consolidation

---

## 11. Key Standards and Legislation Reference

| Topic | IFRS | FRS 102 | Legislation/Regulation |
|---|---|---|---|
| IC elimination (consolidation) | IFRS 10.B86 | S9.16-17 | -- |
| Unrealised profits | IFRS 10.B86(c) | S9.17(c) | -- |
| Currency on IC balances | IAS 21.28, 21.32 | S30 | -- |
| Transfer pricing | -- | -- | TIOPA 2010 Part 4, OECD Guidelines |
| Large exposures (banking) | -- | -- | CRR Art 395, 400 |
| Intra-group reinsurance | -- | -- | Solvency II Art 265 |
| CbC reporting | -- | -- | TIOPA 2010 Part 4, FA 2015 |
