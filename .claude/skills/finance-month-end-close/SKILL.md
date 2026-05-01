---
name: finance-month-end-close
description: |
  Full month-end close process: close timetable (Day 1-10), revenue cut-off, accruals (salaries, rent,
  utilities, professional fees, interest, bonuses), prepayments (insurance, rent, licences), depreciation,
  bank reconciliation, intercompany matching/netting, management accounts (P&L, BS, cash flow, KPIs),
  variance analysis (actual vs budget, prior month, prior year), close checklist with sign-off gates.
  FS-specific: daily P&L (trading desks), NAV calc (funds), premium earned (insurance).
  Trigger on 'month-end close', 'monthly close', 'close timetable', 'management accounts',
  'month end accruals', 'monthly reporting', 'variance analysis', 'budget vs actual',
  'close checklist', 'monthly reconciliation'.
---

# Month-End Close Process

Comprehensive month-end close covering the full cycle from sub-ledger cut-off through management accounts delivery and period lock. Dual-framework coverage for FRS 102 and IFRS throughout.

---

## 1. Close Timetable (Day 1-10)

### Day 1 -- Pre-Close and Data Capture (Finance Systems / AP / AR / Payroll)
- Cut off sub-ledgers: freeze sales ledger, purchase ledger, payroll for the period
- Confirm all bank transactions for the final day are posted; import bank feeds
- Post standing journals (recurring accruals, lease payments, depreciation)
- Run pre-close trial balance and distribute to the close team

### Day 2 -- Revenue Recognition and Cut-Off (Revenue Accountant)
- Recognise revenue per IFRS 15 five-step model / FRS 102 S23 (goods: transfer of risks and rewards; services: stage of completion)
- Post deferred revenue releases and accrued income journals
- Calculate and post cost of sales; reconcile revenue sub-ledger to GL
- Revenue cut-off: confirm last delivery/despatch note matches last sales invoice in period

### Day 3 -- Accruals and Prepayments (Management Accountant)
- Post all accruals (see Section 2); release prepayments for the period (see Section 3)
- Review prior month accruals: reverse or adjust as invoices received
- Post new prepayment journals for payments made in advance during the month

### Day 4 -- Payroll and Employee Costs (Payroll / Finance)
- Confirm payroll processed and posted to GL; reconcile payroll control account
- Post bonus accruals (monthly estimate of annual pool), holiday pay accrual, share-based payment charges (IFRS 2 / FRS 102 S26)

### Day 5 -- Fixed Asset Depreciation (Fixed Asset Accountant)
- Run depreciation/amortisation (see Section 4); capitalise additions from capex register
- Post disposals (remove cost and accumulated depreciation, recognise gain/loss); reconcile FAR to GL

### Day 6 -- Bank Reconciliation and Cash (Treasury / Finance)
- Complete bank reconciliation for every account (see Section 5)
- Investigate reconciling items older than 30 days; post bank charges, interest, FX gains/losses

### Day 7 -- Intercompany (Group Accountant)
- Submit intercompany invoices/charges; match balances with counterparties (see Section 6)
- Investigate and resolve differences; post netting journals; confirm within group tolerance

### Day 8 -- Tax and Other Provisions (Tax / Finance)
- Post monthly corporation tax charge (estimated ETR x PBT); update deferred tax if quarterly
- Post VAT journals and reconcile VAT control account; review other provisions

### Day 9 -- Management Accounts Preparation (Financial Reporting)
- Run final TB; prepare management accounts pack (see Section 7); perform variance analysis (see Section 8)

### Day 10 -- Review and Sign-Off (Financial Controller)
- FC reviews pack and commentary; resolve queries; post final adjustments
- Lock period in accounting system; distribute to FD, CEO, Board; file close checklist (see Section 9)

---

## 2. Accruals

| Type | Calculation basis | Journal |
|---|---|---|
| Salaries/wages | Unpaid days at month-end (e.g., payroll cuts off 25th, accrue 5-6 days) | Dr Staff costs / Cr Accruals |
| Rent | Quarterly-in-arrears contracts: accrue monthly portion | Dr Property costs / Cr Accruals |
| Utilities | Estimate from prior bills, adjust for seasonality | Dr Utility costs / Cr Accruals |
| Professional fees | Legal, audit, consulting incurred but not invoiced | Dr Professional fees / Cr Accruals |
| Interest | Principal x rate x days/365 on borrowings | Dr Interest expense / Cr Accrued interest |
| Bonuses | Monthly build-up of estimated annual pool | Dr Staff costs / Cr Bonus accrual |
| GRNI | Goods received, purchase invoice not yet received | Dr Inventory/expense / Cr GRNI accrual |

Controls: maintain accruals schedule with amount, preparer, basis; age accruals monthly; investigate any item older than 3 months without an invoice and consider release.

---

## 3. Prepayments: Amortisation and Release

Prepayments arise when payment precedes the expense period -- insurance premiums, rent in advance, software licences. On payment: Dr Prepayment (BS) / Cr Bank. Monthly release: Dr Expense (P&L) / Cr Prepayment (BS). Straight-line amortisation unless benefit pattern is uneven. Maintain a prepayment register with expiry dates; review recoverability (cancelled contracts require write-off); reconcile GL to register monthly.

---

## 4. Fixed Asset Depreciation/Amortisation Run

1. Confirm FAR up to date (additions, disposals, transfers posted)
2. Run depreciation using approved rates: buildings 2% SL, plant 10-20% SL/RB, fixtures 15-25% SL, vehicles 25% RB, IT 25-33% SL, ROU assets over lease term (IFRS 16/FRS 102 S20)
3. Review output for anomalies (negative balances, fully depreciated assets)
4. Post journal: Dr Depreciation / Cr Accumulated depreciation; reconcile FAR NBV to GL

---

## 5. Bank Reconciliation as Close Procedure

Reconcile GL cash book to bank statement for every account. Format: GL balance +/- reconciling items = bank statement balance. Identify outstanding cheques, deposits in transit, unposted bank charges/DDs. Foreign currency accounts: reconcile in local and foreign currency, post FX revaluation. Segregation of duties: poster of bank transactions must not prepare the reconciliation.

---

## 6. Intercompany Matching and Netting

Each entity submits IC receivables and payables. Match each receivable to the counterparty payable. Common differences: cut-off timing, FX rates (align on group month-end rate), classification errors, disputed management fees. Agree tolerance (e.g., under GBP 1,000 allocated); post netting journals where group operates a netting arrangement; confirm agreed balances for consolidation elimination.

---

## 7. Management Accounts: P&L, BS, Cash Flow Summary, KPIs

Standard pack: P&L (actual, budget, variance, prior year), Balance Sheet (current vs prior month with movements), Cash Flow summary (direct or indirect), KPI dashboard (revenue per head, gross margin %, EBITDA margin %, debtor days, creditor days, headcount). Commentary must explain each significant variance with cause, expected trend, and required actions. Optional supplements: departmental P&L, product-line analysis, covenant compliance, rolling forecast.

---

## 8. Variance Analysis

**Actual vs Budget**: calculate favourable/adverse variance per P&L line (absolute and %). Threshold for commentary: typically 5-10% or a minimum absolute amount. Decompose where possible into volume vs price/rate variances.

**Actual vs Prior Month**: trend analysis; identify seasonal effects and one-offs.

**Actual vs Prior Year**: structural changes, acquisitions/disposals, FX impact.

Commentary standards: what happened, why, expected forward trend, actions required. Avoid vague language ("timing differences") -- be specific.

---

## 9. Close Checklist with Sign-Off Gates

| Step | Owner | Deadline | Sign-off |
|---|---|---|---|
| Sub-ledger cut-off confirmed | AP/AR/Payroll | Day 1 | [ ] |
| Revenue recognised and cut-off tested | Revenue Accountant | Day 2 | [ ] |
| Accruals posted, prepayments released | Management Accountant | Day 3 | [ ] |
| Payroll reconciled | Payroll / Finance | Day 4 | [ ] |
| Depreciation posted, FAR reconciled | Fixed Asset Accountant | Day 5 | [ ] |
| Bank reconciliations completed | Treasury / Finance | Day 6 | [ ] |
| Intercompany matched and confirmed | Group Accountant | Day 7 | [ ] |
| Tax journals posted | Tax / Finance | Day 8 | [ ] |
| Management accounts drafted | Financial Reporting | Day 9 | [ ] |
| FC review and sign-off; period locked | Financial Controller | Day 10 | [ ] |

---

## 10. FS-Specific Considerations

**Daily P&L (Trading Desks)**: mark-to-market all positions end of day; flash P&L to front office and risk by 07:00 next business day; reconcile daily P&L to monthly at month-end.

**NAV Calculation (Funds)**: NAV = total assets - total liabilities / units in issue. Requires mark-to-market of portfolio, accrued income (dividends, coupons), accrued expenses (management fees, custody). Independently verified by administrator or depositary. Frequency: daily, weekly, or monthly by fund type.

**Premium Earned (Insurance)**: written premiums recognised over coverage period (straight-line for short-tail, risk-adjusted for long-tail). Monthly: Dr UPR / Cr Earned Premium. Reconcile: opening UPR + written - earned = closing UPR.

---

## 11. Reference Standards

| Standard | Topic |
|---|---|
| FRS 102 S2 / IAS 1 | Accruals basis, going concern |
| FRS 102 S23 / IFRS 15 | Revenue recognition |
| FRS 102 S17 / IAS 16 | PPE and depreciation |
| FRS 102 S20 / IFRS 16 | Leases and ROU assets |
| FRS 102 S21 / IAS 37 | Provisions |
| FRS 102 S30 / IAS 21 | Foreign currency |
| IFRS 2 / FRS 102 S26 | Share-based payments |
