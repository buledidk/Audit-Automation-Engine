---
name: audit-borrowings-covenants
description: "Audit loans, overdrafts, bonds, loan notes, lease liabilities (IFRS 16/FRS 102 S20), and covenant compliance. Covers current/non-current classification, interest accrual, refinancing, going concern linkage, and FS-specific: interbank borrowings, repos, covered bonds, subordinated debt, Tier 1/2 capital instruments. Trigger on 'borrowings audit', 'debt audit', 'loans payable', 'bank loans', 'covenant compliance', 'IFRS 16 leases', 'FRS 102 S20', 'bond audit', 'loan notes', 'overdraft', 'subordinated debt', 'Tier 1 capital', 'Tier 2 capital', 'repos', 'covered bonds', 'lease liabilities', 'covenant breach', 'refinancing', 'debt classification'."
---

# Borrowings & Covenants — Elevated Risk Area

Borrowings require careful assessment of **covenant compliance and classification** (current vs non-current), with direct implications for going concern under ISA 570 where breaches exist or are anticipated.

## Assertions and direction of testing

| Assertion | Risk level | Direction | Key procedures |
|-----------|-----------|-----------|---------------|
| **Completeness** | Elevated (primary) | Source to records | Bank confirmations, facility letters, board minutes for new borrowings |
| **Classification** | Elevated | Test covenants | Current vs non-current based on covenant compliance and repayment terms |
| **Accuracy (interest)** | Moderate | Recalculate | Interest accrual, effective interest rate, capitalised borrowing costs |
| **Disclosure** | Elevated | Test to standards | Maturity analysis, security, covenant requirements, fair value |
| **Rights & obligations** | Moderate | Confirm terms | Verify entity is the obligor, personal guarantees, cross-guarantees |

## Non-financial services entities

### Loans and overdrafts
- Confirm with lender: outstanding balance, facility limit, interest rate, maturity, covenants, security
- Agree to bank confirmation letter (ISA 505) and facility agreements
- Test drawdowns and repayments to bank statements and cash book
- Verify bank overdraft classification: repayable on demand = current liability

### Interest accrual and expense
- Recalculate interest: principal x rate x time, verify day-count convention
- Effective interest rate (EIR): verify amortisation of arrangement fees, discount/premium
- Capitalised borrowing costs (IAS 23 / FRS 102 S25): test qualifying assets, capitalisation rate

### Covenant compliance testing
- Identify all financial covenants: leverage, interest cover, net worth, DSCR
- Independently recalculate covenant ratios using audited figures
- Assess compliance at year-end and at any interim testing dates
- Breach consequences: waiver obtained (test to letter), reclassification to current
- Prospective breach: assess management's plans, going concern implications (ISA 570)

### Current vs non-current classification
- IAS 1.69-76 / FRS 102 S4.7: classify as current if due within 12 months of reporting date
- Covenant breach at YE without waiver before YE: classify as current (IAS 1.74)
- Waiver received before YE: non-current only if waiver > 12 months and no breach likely
- Refinancing after YE: does not affect classification at YE (non-adjusting event)

### Lease liabilities (IFRS 16 / FRS 102 S20)
- IFRS 16: right-of-use asset and lease liability for all leases (except short-term/low-value)
- FRS 102 S20: finance lease = substantially all risks and rewards transfer; operating lease = expense
- Test lease liability calculation: present value of future payments, discount rate (incremental borrowing rate)
- Verify completeness: review contracts for embedded leases
- Modifications: reassess liability on change in lease term, payments, or scope

### Bonds and loan notes
- Confirm with trustee/registrar: outstanding nominal, coupon, maturity
- Verify amortised cost calculation (EIR method) including premium/discount
- Early redemption: test to call provisions, verify derecognition accounting

## Financial services entities

### Interbank borrowings
- Confirm with counterparty banks: amount, rate, maturity
- Overnight, term, and repo funding: verify classification and maturity profile
- Liquidity coverage ratio (LCR) and net stable funding ratio (NSFR) implications

### Repurchase agreements (repos)
- Repo: sale with obligation to repurchase — does NOT derecognise underlying asset
- Reverse repo: purchase with obligation to resell — recognise as loan receivable
- Verify accounting treatment: secured borrowing, not sale
- Haircut analysis: test collateral valuation

### Covered bonds
- Dual recourse: investor has claim on issuer and cover pool
- Verify cover pool adequacy: asset coverage test
- SPV consolidation (IFRS 10) for cover pool entity

### Subordinated debt and capital instruments
- Tier 1 (CET1, AT1): verify classification as equity vs liability (IAS 32)
- AT1 instruments: discretionary coupon, perpetual, write-down/conversion triggers
- Tier 2 subordinated debt: verify subordination terms, maturity
- Regulatory capital adequacy: CET1 ratio, leverage ratio compliance

## Inputs

| Field | Required | Description |
|-------|----------|-------------|
| entityProfile | yes | Industry, borrowing types, covenant framework |
| materialityLevels | yes | PM, TE, trivial |
| facilityAgreements | yes | All loan/facility documentation |
| covenantSchedule | yes | List of covenants with compliance calculations |
| bankConfirmations | yes | ISA 505 confirmation responses |

## Outputs

- Borrowings confirmation and reconciliation schedule
- Covenant compliance testing schedule with independent recalculation
- Interest accrual recalculation schedule
- Current/non-current classification assessment
- Lease liability completeness and measurement review (IFRS 16 / FRS 102 S20)
- Borrowings completeness, classification, and disclosure conclusion
