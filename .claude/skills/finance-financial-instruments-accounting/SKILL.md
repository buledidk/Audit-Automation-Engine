---
name: finance-financial-instruments-accounting
description: |
  Full lifecycle accounting for financial instruments under IFRS 9 and FRS 102
  S11/S12. Covers classification (SPPI test, business model), initial and subsequent
  measurement, impairment (ECL 3-stage model), derecognition, hedge accounting,
  presentation, and IFRS 7 disclosures. FS-specific: banking book classification,
  trading book FVTPL, insurance investment portfolios, CVA/DVA on derivatives.
  Trigger: 'IFRS 9', 'financial instruments accounting', 'ECL model',
  'expected credit loss accounting', 'SPPI test', 'business model test',
  'amortised cost', 'FVOCI', 'FVTPL', 'hedge accounting', 'FRS 102 S11',
  'FRS 102 S12', 'derecognition', 'provision matrix', 'EIR',
  'effective interest rate', 'IFRS 7 disclosures'.
---

# Financial Instruments Accounting -- Full Lifecycle Guide

This skill covers the end-to-end accounting for financial instruments under IFRS 9 and FRS 102 Sections 11 and 12, from classification through measurement, impairment, derecognition, hedge accounting, and disclosure.

---

## 1. IFRS 9 Classification

### 1.1 Classification Categories
- Amortised cost: passes SPPI test AND held within a hold-to-collect business model
- Fair value through other comprehensive income (FVOCI): passes SPPI test AND held within a hold-to-collect-and-sell business model
- Fair value through profit or loss (FVTPL): residual category for all instruments that do not qualify for amortised cost or FVOCI
- Irrevocable FVOCI election for equity instruments: available at initial recognition for equity instruments not held for trading; dividends in P&L, gains/losses in OCI (never recycled)

### 1.2 The SPPI Test (Solely Payments of Principal and Interest)
- Assess whether contractual cash flows are solely payments of principal and interest on the principal outstanding
- Principal: fair value of the financial asset at initial recognition
- Interest: consideration for time value of money, credit risk, other basic lending risks, and a profit margin
- Features that fail SPPI: leverage features, conversion options, contingent payments linked to equity performance, inverse floating rates
- Modified time value of money: benchmark test required (compare cash flows to a benchmark instrument)

### 1.3 Business Model Assessment
- Hold to collect: objective is to hold to collect contractual cash flows; sales are incidental (infrequent, individually and in aggregate insignificant)
- Hold to collect and sell: both collecting contractual cash flows and selling are integral to achieving the objective
- Other (trading): managed on a fair value basis; active and frequent buying/selling
- Assessment at portfolio level reflecting how groups of financial assets are managed together

---

## 2. Initial Recognition

### 2.1 Recognition and Measurement
- Recognise when entity becomes party to the contractual provisions (trade date or settlement date, applied consistently)
- Fair value plus transaction costs for instruments not at FVTPL
- Fair value only for FVTPL instruments (transaction costs expensed immediately)
- Trade receivables without significant financing component: initially at transaction price (IFRS 15)

---

## 3. Subsequent Measurement

### 3.1 Amortised Cost
- Effective interest rate (EIR) method: allocate interest income/expense over the life of the instrument
- EIR: rate that exactly discounts estimated future cash flows through expected life to gross carrying amount
- Carry at gross carrying amount less ECL allowance

### 3.2 FVOCI (Debt Instruments)
- Fair value on balance sheet; interest income (EIR), ECL impairment, and FX in P&L
- All other FV changes in OCI; recycled to P&L on derecognition

### 3.3 FVTPL
- Fair value; all changes (including interest element) in P&L
- No separate ECL calculation (impairment captured in FV movements)

### 3.4 FVOCI (Equity -- Irrevocable Election)
- Fair value; dividends in P&L; all FV changes in OCI (never recycled, even on disposal)

---

## 4. Impairment -- Expected Credit Loss (ECL) Model

### 4.1 Scope
- Financial assets at amortised cost, debt instruments at FVOCI, loan commitments, financial guarantee contracts, lease receivables, contract assets

### 4.2 Three-Stage Model
- Stage 1 (performing): 12-month ECL; no significant increase in credit risk (SICR) since initial recognition; interest on gross carrying amount
- Stage 2 (underperforming): lifetime ECL; SICR occurred but not credit-impaired; interest on gross carrying amount
- Stage 3 (non-performing): lifetime ECL; credit-impaired (objective evidence); interest on net carrying amount (amortised cost less allowance)

### 4.3 ECL Calculation
- ECL = PD x LGD x EAD, discounted at EIR
- PD: point-in-time, forward-looking, incorporating macroeconomic scenarios
- LGD: expected loss if default occurs, net of recoveries and collateral
- EAD: expected balance at time of default, including drawdowns on committed facilities
- Forward-looking information: multiple macroeconomic scenarios (base, upside, downside) probability-weighted

### 4.4 Significant Increase in Credit Risk (SICR)
- Compare risk of default at reporting date with risk at initial recognition
- Indicators: credit rating changes, adverse business/financial/economic conditions, operating results
- 30-day past due rebuttable presumption

### 4.5 Simplified Approach for Trade Receivables
- Provision matrix based on historical loss rates adjusted for forward-looking information
- Always recognise lifetime ECL (no SICR tracking)
- Segment by customer type, geography, product line, or ageing band

---

## 5. Derecognition

### 5.1 Financial Assets
- Derecognise when contractual rights expire or are transferred
- Transfer of risks and rewards: substantially all transferred = derecognise; substantially all retained = do not derecognise
- Pass-through arrangements: derecognise if no obligation to pay unless collected, cannot sell/pledge, remits without material delay
- Continuing involvement: recognise to extent of continuing involvement if neither transferred nor retained substantially all risks/rewards

### 5.2 Financial Liabilities
- Derecognise when obligation is discharged, cancelled, or expires
- Modification: substantially different terms (10% PV test) = derecognise old, recognise new; not substantially different = adjust carrying amount

---

## 6. Hedge Accounting

### 6.1 Types
- Fair value hedge: hedging FV exposure of recognised asset/liability or firm commitment; FV changes of both instrument and item in P&L
- Cash flow hedge: hedging cash flow variability; effective portion in OCI, recycled when hedged item affects P&L
- Net investment hedge: hedging FX on net investment in foreign operation; effective portion in OCI (FCTR), recycled on disposal

### 6.2 Qualifying Criteria
- Formal designation and documentation at inception
- Economic relationship between hedged item and hedging instrument
- Credit risk does not dominate value changes
- Hedge ratio consistent with risk management strategy

### 6.3 Effectiveness Testing
- Prospective: qualitative or quantitative assessment of economic relationship
- No fixed 80-125% bright-line test under IFRS 9 (that was IAS 39)
- Identify and measure sources of ineffectiveness

### 6.4 Discontinuation
- Mandatory: relationship no longer meets criteria, instrument expires/sold/terminated, hedged item no longer exists
- Voluntary: revoke designation prospectively (not retrospectively)

---

## 7. FRS 102 Section 11 -- Basic Financial Instruments

### 7.1 Scope and Measurement
- Basic instruments meeting S11.8 conditions: debt instruments (loans, receivables, payables, bonds with basic terms), deposits, loan commitments
- Measured at amortised cost using EIR method
- Concessionary loans: policy choice to measure at transaction price at initial recognition; subsequently at amortised cost using concessionary rate

### 7.2 Impairment (Incurred Loss Model)
- Recognise when objective evidence of impairment exists (not forward-looking ECL)
- Assess individually for significant assets, collectively for others
- Measure as difference between carrying amount and best estimate of cash flows (discounted at original EIR)

---

## 8. FRS 102 Section 12 -- Other Financial Instruments

### 8.1 Scope and Measurement
- Instruments not meeting S11 conditions: derivatives, complex debt, options, forwards, swaps, equity instruments held for trading
- All S12 instruments at FVTPL; no FVOCI category under FRS 102

### 8.2 Hedge Accounting under FRS 102
- Simplified model (S12.15-25): fair value hedge, cash flow hedge, net investment hedge
- Formal documentation and retrospective effectiveness assessment required

---

## 9. Presentation

### 9.1 Offsetting
- Offset financial asset and liability only when legally enforceable right to set off AND intent to settle net or simultaneously

### 9.2 Current/Non-Current
- Based on expected settlement: within 12 months = current; beyond = non-current

---

## 10. IFRS 7 Disclosures

### 10.1 Nature and Extent of Risks
- Credit risk: maximum exposure, credit quality, ECL reconciliation by stage, concentrations
- Liquidity risk: maturity analysis of financial liabilities (contractual undiscounted cash flows)
- Market risk: sensitivity analysis for interest rate, currency, equity price risk

### 10.2 Fair Value Hierarchy
- Level 1: quoted prices in active markets; Level 2: observable inputs; Level 3: unobservable inputs
- Transfers between levels, Level 3 reconciliation, valuation techniques, significant unobservable inputs

### 10.3 ECL Disclosures
- Reconciliation of ECL allowance by stage (opening, transfers, originations, derecognitions, write-offs, model changes, closing)
- Significant judgements: SICR determination, forward-looking scenarios and weightings

---

## 11. Financial Services Specific Considerations

### 11.1 Banking Book Classification
- Loans and advances: typically amortised cost (hold-to-collect, pass SPPI)
- Investment securities: amortised cost or FVOCI (liquidity management portfolio)
- Modified loans, interest rate floors/caps, prepayment features: careful SPPI assessment

### 11.2 Trading Book FVTPL
- All trading positions at FVTPL: bonds, equities, derivatives, repos, securities lending
- CVA (credit valuation adjustment) and DVA (debit valuation adjustment) on derivative portfolios in P&L

### 11.3 Insurance Investment Portfolios
- Classification depends on business model (ALM-driven)
- FVOCI common for debt portfolios; equity investments at FVTPL or irrevocable FVOCI election

### 11.4 Securitisation and Structured Products
- Originator: derecognition analysis (transfer of risks and rewards via SPV)
- Retained tranches: if not derecognised, remain on-balance-sheet
- Investor: classify by SPPI and business model; senior tranches may pass SPPI, subordinated may fail

---

## 12. Key Standards Reference

| Topic | IFRS | FRS 102 |
|---|---|---|
| Classification and measurement | IFRS 9.4 | S11, S12 |
| Impairment (ECL) | IFRS 9.5 | S11.21-26 (incurred loss) |
| Derecognition | IFRS 9.3 | S11.33-38 |
| Hedge accounting | IFRS 9.6 | S12.15-25 |
| Presentation | IAS 32 | S11, S12 |
| Disclosures | IFRS 7 | S11.40-48, S12.26-29 |
| Fair value measurement | IFRS 13 | S11.27-32 |
