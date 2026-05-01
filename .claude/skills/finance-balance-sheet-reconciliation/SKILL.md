---
name: finance-balance-sheet-reconciliation
description: |
  Balance sheet reconciliation framework: golden rule (every BS line reconciled), standard format
  (opening + movements = closing agreed to GL), reconciliation by account type (bank, debtors,
  creditors, fixed assets, intercompany, payroll, VAT, tax, provisions, accruals), reconciling item
  investigation and escalation, three-way matching, reviewer sign-off, frequency, exception reporting.
  FS-specific: nostro/vostro, client money, premium trust fund, collateral.
  Trigger on 'balance sheet reconciliation', 'BS rec', 'account reconciliation', 'control account',
  'debtor reconciliation', 'creditor reconciliation', 'bank reconciliation monthly',
  'intercompany reconciliation', 'reconciling items', 'sub-ledger to GL', 'three-way match'.
---

# Balance Sheet Reconciliation Framework

Every balance sheet line must have a reconciliation, owned by a named preparer with independent reviewer sign-off. This skill covers the standard reconciliation format, account-type-specific procedures, reconciling item management, and FS-sector overlays.

---

## 1. The Golden Rule

Every balance sheet account must be reconciled at an agreed frequency. No exceptions. If the account cannot be reconciled, it signals a control failure that requires immediate investigation. The reconciliation is the primary detective control over the integrity of financial reporting.

---

## 2. Standard Reconciliation Format

Every reconciliation follows this structure:

1. **Opening balance** (prior period closing balance, agreed to prior period TB)
2. **Add: movements in the period** (debits and credits, individually identified or by category)
3. **Equals: closing balance** (calculated)
4. **Agreed to: GL balance** (from current period TB)
5. **Difference: reconciling items** (listed, explained, and aged)
6. **Sign-off: preparer and reviewer** (name, date, signature/electronic approval)

---

## 3. Reconciliation by Account Type

### 3.1 Bank Accounts
- Reconcile GL cash book balance to bank statement balance
- Identify: outstanding cheques (issued, not cleared), deposits in transit, bank charges not posted, direct debits/credits not posted, FX revaluation differences
- Stale cheques (older than 6 months): investigate and reverse if appropriate
- Foreign currency accounts: reconcile in both functional and foreign currency
- Frequency: monthly minimum; daily for treasury-intensive operations

### 3.2 Trade Debtors (Receivables)
- Reconcile debtors sub-ledger total to debtors control account in GL
- Prepare aged debtor analysis: current, 30 days, 60 days, 90 days, 120+ days
- Review bad debt provision / ECL allowance (IFRS 9 staging / FRS 102 S11 incurred loss)
- Write-off review: balances deemed irrecoverable require formal write-off approval
- Reconcile debtor circularisations (confirmations) where performed

### 3.3 Trade Creditors (Payables)
- Reconcile creditors sub-ledger total to creditors control account in GL
- Agree to supplier statements: reconcile differences (timing, disputed invoices, credit notes)
- Three-way matching: purchase order vs goods received note vs supplier invoice -- unmatched items investigated
- Aged creditor analysis: identify overdue balances and potential unrecorded liabilities

### 3.4 Fixed Assets
- Reconcile fixed asset register (FAR) to GL for each asset category
- Format: opening NBV + additions - disposals - depreciation = closing NBV; agree to GL
- Verify additions are properly capitalised (not expensed) and meet capitalisation threshold
- Verify disposals are fully removed (cost and accumulated depreciation)
- Capital commitments: contracted but not yet recognised (disclosure note)

### 3.5 Intercompany
- Bilateral confirmation: each entity confirms its balance with every counterparty
- Match receivable at Entity A to payable at Entity B (and vice versa)
- Investigate differences: cut-off, FX translation rates, disputed charges, unrecorded items
- Agree tolerance threshold (e.g., under GBP 1,000 per pair); allocate within-tolerance differences
- Frequency: monthly for material balances; quarterly minimum for all others

### 3.6 Payroll Control Accounts
- Reconcile: gross pay + employer NI + employer pension = total payroll cost in GL
- Net pay per payroll = bank payment to employees
- PAYE/NI creditor: payroll deductions accumulated = amount due to HMRC (per RTI submission)
- Pension creditor: employer + employee contributions = amount due to scheme
- Investigate: timing differences between payroll run date and GL posting date

### 3.7 VAT (UK)
- Input VAT: purchases with VAT reclaimed, per VAT return boxes
- Output VAT: sales VAT charged, per VAT return boxes
- Reconcile: VAT control account balance = net amount due to/from HMRC
- Cross-check to VAT return: Box 1 (output) - Box 4 (input) = Box 5 (net)
- Partial exemption: calculate recoverable proportion if applicable

### 3.8 Tax (Corporation Tax)
- Current tax creditor/debtor: opening balance + current year charge - payments on account = closing balance
- Reconcile to corporation tax computation (or estimated computation if not yet finalised)
- Prior year adjustments: under/over provisions settled or adjusted
- Deferred tax: reconcile opening to closing through P&L charge and OCI movements

### 3.9 Provisions
- Each provision has its own reconciliation: opening + new provisions + unwinding of discount - utilised - released = closing
- Document the nature and basis of each provision (legal, restructuring, dilapidation, onerous contract, warranty)
- Assess whether recognition criteria still met (IAS 37 / FRS 102 S21)
- Challenge adequacy: is the provision sufficient? Is it excessive?

### 3.10 Accruals
- Individual item listing: each accrual identified by nature, amount, preparer, basis, and age
- Reconcile: total of individual accruals = GL accruals balance
- Age analysis: accruals older than 3 months without a corresponding invoice require investigation
- Release stale accruals with documented approval

---

## 4. Reconciling Items: Investigation, Ageing, Escalation

- Every reconciling item must be explained with a root cause and expected clearance date
- Ageing bands: current (within month), 1-3 months, 3-6 months, over 6 months
- Escalation thresholds (set by FC/FD):
  - Items over GBP X or older than Y months escalated to Financial Controller
  - Recurring items require process fix, not just clearance
- Exception reporting: monthly summary of all reconciling items above threshold, circulated to FC

---

## 5. Controls Framework

| Control | Detail |
|---|---|
| Preparer/reviewer | Every reconciliation requires independent review (preparer cannot self-review) |
| Frequency | Monthly for material accounts; quarterly acceptable for low-risk/immaterial |
| Timeliness | Completed within the close timetable (typically by Day 6-8 of month-end close) |
| Completeness | 100% of BS accounts reconciled -- tracked via a reconciliation status matrix |
| Documentation | Standardised template; supporting evidence attached; filed in shared drive |
| Exception reporting | Unreconciled items and overdue reconciliations reported to FC weekly during close |

---

## 6. FS-Specific Reconciliations

**Nostro/Vostro Accounts (Banks)**: nostro (our account at another bank) reconciled to correspondent bank statements; vostro (their account at our bank) reconciled with counterparty confirmations. Unmatched items aged and escalated per prudential policy. SWIFT message matching for automated reconciliation.

**Client Money (FCA-regulated, CASS 5/6/7)**: daily client money reconciliation per CASS 7.15; internal client money reconciliation (individual client balances to total) and external (total to bank/custodian). Any shortfall must be topped up by start of next business day.

**Premium Trust Fund (Insurance Brokers)**: reconcile premiums collected on behalf of insurers; maintain trust account separate from own funds per IDD/CASS 5. Match client-by-client with insurer settlement statements.

**Collateral (Trading/Derivatives)**: reconcile collateral posted and received to counterparty margin calls (variation and initial margin). Agree to custodian/clearing house statements. Classify as asset or liability depending on direction.

---

## 7. Reference Standards

| Standard | Topic |
|---|---|
| FRS 102 S11 / IFRS 9 | Financial instruments (debtors, creditors, ECL) |
| FRS 102 S17 / IAS 16 | PPE reconciliation |
| FRS 102 S21 / IAS 37 | Provisions movements |
| FRS 102 S30 / IAS 21 | Foreign currency translation |
| CA 2006 s386 | Duty to keep adequate accounting records |
| CASS 5/6/7 | FCA client money and assets rules |
| CRR/CRD | Prudential reporting for banks |
