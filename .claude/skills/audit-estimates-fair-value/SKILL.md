---
name: audit-estimates-fair-value
description: "Audit accounting estimates and fair value measurements per ISA 540 (Revised), IFRS 13 fair value hierarchy (Level 1-3), management bias indicators, use of experts (ISA 620). Covers point estimates vs ranges, sensitivity analysis, and FS-specific: Level 3 instruments, loan loss provisions, insurance liabilities, pension obligations. Non-FS: impairment, provisions, share-based payments, deferred consideration. Trigger on 'ISA 540', 'accounting estimates', 'fair value audit', 'IFRS 13', 'Level 3 valuation', 'estimation uncertainty', 'management bias', 'auditor's range', 'sensitivity analysis', 'ISA 620 expert', 'point estimate', 'forward-looking information', 'model risk', 'valuation uncertainty', 'inherent risk factors'."
---

# Accounting Estimates & Fair Value — Significant Risk Area

ISA 540 (Revised) requires a **risk-based, granular approach** to auditing estimates, assessing inherent risk factors (estimation uncertainty, complexity, subjectivity) and evaluating management bias indicators.

## Assertions and direction of testing

| Assertion | Risk level | Direction | Key procedures |
|-----------|-----------|-----------|---------------|
| **Valuation** | Significant (primary) | Test methods, data, assumptions | Evaluate model, test inputs, develop independent estimate or range |
| **Accuracy** | Elevated | Recalculate | Verify arithmetic, formulae, data extraction |
| **Completeness of disclosure** | Elevated | Test to standards | IFRS 13 hierarchy, sensitivity disclosures, key assumptions |
| **Classification** | Moderate | Review categorisation | Fair value hierarchy level, current vs non-current |
| **Occurrence** | Moderate | Verify triggering event | Confirm event or condition giving rise to estimate exists |

## ISA 540 (Revised) framework

### Spectrum of inherent risk
- Assess three inherent risk factors for each estimate: estimation uncertainty, complexity, subjectivity
- Map each estimate to a point on the spectrum from low to significant risk
- Higher inherent risk = more persuasive audit evidence required

### Three permitted audit approaches (ISA 540.13)
1. **Test management's process**: evaluate method, assumptions, data
2. **Develop an independent estimate**: using auditor's own model or assumptions
3. **Review subsequent events**: use post-YE information to evaluate estimate (where available and relevant)

### Management bias indicators
- Consistent directional effect of estimates (always favourable)
- Changes in methods or assumptions without clear rationale
- Overly optimistic or pessimistic assumptions relative to market data
- Point estimate selection at extreme end of reasonable range
- Retrospective review: compare prior year estimates to actual outcomes

## Non-financial services entities

### Impairment estimates (IAS 36 / FRS 102 S27)
- Value in use: test discount rate (WACC), cash flow projections, growth rates, terminal value
- Challenge management's forecasting track record: compare prior projections to actuals
- Sensitivity: headroom analysis, break-even discount rate and growth rate

### Provisions and contingencies (IAS 37 / FRS 102 S21)
- Test probability assessment: more likely than not threshold
- Best estimate: most likely outcome for single obligation, expected value for population
- Discount rate for long-term provisions: pre-tax rate reflecting time value of money

### Share-based payments (IFRS 2 / FRS 102 S26)
- Option pricing model: Black-Scholes or binomial — test inputs (share price, exercise price, volatility, risk-free rate, expected life)
- Volatility: peer comparison, historical vs implied
- Vesting conditions: market vs non-market, probability of vesting

### Deferred consideration
- Test fair value of contingent consideration in business combinations
- Discount rate, probability weighting of scenarios
- Subsequent re-measurement: P&L (IFRS) or goodwill adjustment (FRS 102 S19.7A)

## Financial services entities

### Level 3 financial instruments
- Model validation: independent price verification (IPV) process
- Unobservable inputs: credit spreads, volatility surfaces, recovery rates, correlation
- Day-one profit/loss deferral (IFRS 9): verify amortisation methodology
- Expert involvement (ISA 620): consider auditor's valuation specialist for complex models

### Loan loss provisions (ECL models)
- PD models: test calibration, discriminatory power, through-the-cycle adjustments
- LGD assumptions: collateral values, cure rates, recovery timelines
- Macro-economic scenarios: base, upside, downside — verify probability weighting
- Management overlays: challenge rationale, test for bias, assess whether temporary or permanent

### Insurance liabilities
- Claims reserves: actuarial methods (chain ladder, Bornhuetter-Ferguson), test development factors
- IFRS 17 fulfilment cash flows: discount rate, risk adjustment, CSM
- Actuarial expert (ISA 620): evaluate competence, scope, and findings
- IBNR (incurred but not reported): test to historical emergence patterns

### Pension obligations (IAS 19 / FRS 102 S28)
- Discount rate: test to high-quality corporate bond yields of appropriate duration
- Mortality assumptions: compare to S3 tables or scheme-specific experience
- Salary growth, inflation (RPI/CPI): compare to market expectations
- Actuarial expert: evaluate independence, competence, reasonableness of assumptions

## Inputs

| Field | Required | Description |
|-------|----------|-------------|
| entityProfile | yes | Industry, material estimates, experts engaged |
| materialityLevels | yes | PM, TE, trivial |
| estimateRegister | yes | List of all material estimates with inherent risk assessment |
| priorYearEstimates | yes | For retrospective review (actual vs estimated) |
| expertReports | conditional | Valuation, actuarial, pension reports where relevant |

## Outputs

- Estimate-by-estimate risk assessment (ISA 540 inherent risk spectrum)
- Point estimate / auditor's range analysis for each significant estimate
- Management bias assessment with retrospective comparison
- Expert reliance documentation (ISA 620)
- Fair value hierarchy and disclosure adequacy conclusion
