---
name: audit-payroll-employee-benefits
description: "Audit payroll (occurrence, accuracy, completeness), PAYE/NI, pensions (IAS 19/FRS 102 S28), defined benefit obligations, and share-based payments (IFRS 2/FRS 102 S26). Covers bonus accruals, deferred compensation, and FS-specific: banking bonus pools, SMCR implications. Trigger on 'payroll audit', 'employee benefits', 'pensions audit', 'IAS 19', 'FRS 102 S28', 'defined benefit', 'defined contribution', 'share-based payments', 'IFRS 2', 'FRS 102 S26', 'bonus accrual', 'PAYE', 'national insurance', 'deferred compensation', 'SMCR', 'payroll occurrence', 'ghost employees', 'salary costs', 'pension deficit'."
---

# Payroll & Employee Benefits — Elevated Risk Area

Payroll is a **high-volume, recurring transaction cycle** with elevated risk of ghost employees and fictitious payments. Pension obligations (defined benefit) carry significant estimation uncertainty under ISA 540.

## Assertions and direction of testing

| Assertion | Risk level | Direction | Key procedures |
|-----------|-----------|-----------|---------------|
| **Occurrence** | Elevated | Records to source | Verify employees exist (HR records, starter/leaver docs, payroll to headcount) |
| **Accuracy** | Elevated | Recalculate | Gross to net calculation, tax/NI deductions, pension contributions |
| **Completeness** | Moderate | Source to records | Bank payments to payroll records, P11D benefits not processed |
| **Cut-off** | Moderate | Test around YE | Bonus accruals, holiday pay accrual, December/January payroll |
| **Classification** | Moderate | Review coding | Capitalised vs expensed, operating vs restructuring |

## Non-financial services entities

### Payroll occurrence and accuracy
- Select sample of employees across the year: agree to HR records, contracts, authorised pay rates
- Test joiners: starter documentation (right to work, contract, P45/P46)
- Test leavers: verify final pay calculation, P45 issued, removed from payroll
- Ghost employee controls: reconcile headcount (HR) to payroll run, investigate discrepancies
- Gross to net: recalculate tax (PAYE), NI (employer and employee), pension deduction, student loan

### PAYE and National Insurance
- Reconcile payroll records to RTI submissions (FPS filed with HMRC)
- Test PAYE/NI calculation for sample of employees across tax bands
- Verify employer NI rate, employment allowance (if applicable)
- P11D / P11D(b): benefits in kind — test to supporting records (car, medical, etc.)
- Reconcile PAYE liability at YE to amounts paid/payable to HMRC

### Overtime, commissions, and variable pay
- Test overtime claims to timesheets and supervisor authorisation
- Commission: test to underlying sales/targets and commission scheme documentation
- Verify correct treatment of variable pay in pension contributions

### Bonus accruals
- Obtain bonus scheme documentation: criteria, approval, payment date
- Test accrual calculation: eligible headcount x formula / approved amounts
- Verify year-end accrual for earned but unpaid bonuses
- Post-YE payment: compare actual payments to accrual, assess accuracy
- Discretionary vs contractual: timing of recognition

### Holiday pay accrual
- Verify calculation: days owed x daily rate at year-end
- Test holiday records for sample of employees
- FRS 102 S28.2: short-term compensated absences — accrue when services rendered

### Pensions — defined contribution
- Test contributions: percentage of qualifying earnings x actual gross pay
- Reconcile employer contributions to pension provider statements
- Auto-enrolment compliance: verify eligible employees enrolled, minimum contribution rates

### Pensions — defined benefit (IAS 19 / FRS 102 S28)
- Actuarial report: evaluate actuary competence, scope, objectivity (ISA 620)
- Key assumptions: discount rate, salary growth, inflation (RPI/CPI), mortality tables
- Discount rate: test to high-quality corporate bond yield of appropriate duration and currency
- Mortality: compare to standard tables (S3/CMI), consider scheme-specific adjustments
- Net pension asset/liability: fair value of plan assets less present value of DBO
- Remeasurements: actuarial gains/losses through OCI (IAS 19) or P&L (FRS 102 S28)
- Asset ceiling test (IFRIC 14): verify surplus recognition limited to economic benefit available
- Plan assets: confirm with trustees, test fair value of investments held

### Share-based payments (IFRS 2 / FRS 102 S26)
- Equity-settled: test grant date fair value using appropriate model (Black-Scholes, binomial)
- Model inputs: share price, exercise price, expected volatility, risk-free rate, expected life, dividends
- Vesting conditions: service and performance conditions — test probability of vesting
- Expense recognition: straight-line over vesting period, true-up for non-market conditions
- Cash-settled: remeasure at each reporting date to fair value
- Disclosure: number of options, weighted average exercise price, movement table

## Financial services entities

### Banking bonus pools
- Material area: bonuses can represent significant proportion of total compensation
- Bonus pool: test to profitability, risk-adjusted metrics, board/RemCo approval
- Deferred compensation: verify deferral periods, malus/clawback provisions
- Regulatory alignment: PRA Remuneration Code, proportionality level

### SMCR (Senior Managers and Certification Regime)
- Material risk takers: verify identification and bonus deferral compliance
- Guaranteed bonuses: test to regulatory restrictions (max 1 year for new hires)
- Buy-out awards: verify fair value and vesting conditions

### Deferred compensation schemes
- Long-term incentive plans (LTIPs): verify measurement, vesting, and disclosure
- Retention awards: test to contractual terms and service period
- Carried interest (asset management): verify calculation methodology and accrual

## Inputs

| Field | Required | Description |
|-------|----------|-------------|
| entityProfile | yes | Industry, headcount, remuneration structure |
| materialityLevels | yes | PM, TE, trivial |
| payrollSummary | yes | Gross pay, deductions, net pay by month |
| bonusSchemeDetails | conditional | Required where bonus accruals material |
| actuarialReport | conditional | Required where defined benefit scheme exists |
| shareOptionSchemes | conditional | Required where share-based payments material |

## Outputs

- Payroll occurrence and accuracy testing schedule
- Bonus accrual assessment with post-YE payment comparison
- Defined benefit pension obligation review (assumptions, movements, sensitivity)
- Share-based payment expense recalculation
- PAYE/NI reconciliation and compliance review
- Payroll and employee benefits completeness, accuracy, and cut-off conclusion
