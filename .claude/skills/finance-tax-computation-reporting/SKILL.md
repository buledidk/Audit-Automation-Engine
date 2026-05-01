---
name: finance-tax-computation-reporting
description: |
  Full corporation tax computation and reporting process for UK companies. Covers
  accounting profit to taxable profit, capital allowances, trading losses, R&D tax
  credits, CT600, quarterly instalment payments, deferred tax (IAS 12/FRS 102 S29),
  temporary differences, DTA recoverability, tax rate changes, effective tax rate
  reconciliation, and transfer pricing. FS-specific: banking surcharge, insurance
  IPT, VAT partial exemption, withholding tax on cross-border.
  Trigger: 'corporation tax', 'tax computation', 'CT600', 'capital allowances',
  'R&D tax credits', 'deferred tax calculation', 'DTA recoverability',
  'tax provision', 'effective tax rate', 'ETR reconciliation', 'transfer pricing',
  'trading losses', 'quarterly instalment payments', 'banking surcharge', 'iXBRL'.
---

# Corporation Tax Computation and Reporting -- Full Process Guide

This skill covers the end-to-end UK corporation tax computation and reporting process, from accounting profit adjustments through CT600 filing, deferred tax, and FS-specific considerations.

---

## 1. Accounting Profit to Taxable Profit

### 1.1 Starting Point
- Start with profit before tax per the financial statements (IFRS or FRS 102)
- Adjust for items that are not allowable deductions or are not taxable income under tax law

### 1.2 Add-Backs (Disallowable Expenditure)
- Depreciation and amortisation (replaced by capital allowances)
- Entertaining costs (client and staff entertaining, unless qualifying staff events)
- Fines and penalties (not deductible)
- General provisions (only specific provisions deductible when liability is sufficiently certain)
- Amortisation of goodwill under IFRS (no tax deduction; FRS 102 goodwill amortisation may be deductible)
- Impairment losses (unless qualifying bad debt write-off)
- Donations (unless qualifying charitable donations with separate relief)
- Legal costs of a capital nature

### 1.3 Deductions (Non-Taxable Income and Additional Reliefs)
- Capital allowances (replacing depreciation)
- Patent box deduction (reduced rate on qualifying patent income)
- R&D enhanced deduction
- Dividend income from UK and most overseas companies (exempt under CTA 2009 Part 9A)
- Gains covered by the substantial shareholding exemption (SSE)

---

## 2. Capital Allowances

### 2.1 Annual Investment Allowance (AIA)
- 100% first-year allowance on qualifying plant and machinery up to GBP 1,000,000 per annum
- Applies to most plant and machinery (not cars with CO2 above threshold)

### 2.2 Writing Down Allowances (WDA)
- Main pool: 18% WDA on reducing balance (general plant and machinery)
- Special rate pool: 6% WDA (long-life assets, integral features, thermal insulation, cars CO2 > 50g/km)
- Structures and Buildings Allowance (SBA): 3% straight-line on qualifying commercial structures

### 2.3 First-Year Allowances
- Energy-saving and water-efficient plant: 100%
- Electric vehicle charge points: 100% (subject to sunset provisions)
- Full expensing: 100% FYA on qualifying main pool plant and machinery (from April 2023)
- Super-deduction legacy (130% for expenditure Apr 2021 - Mar 2023): expired but affects brought-forward pools

---

## 3. Trading Losses

### 3.1 Current Year Relief
- Offset trading losses against total profits of the same accounting period (CTA 2010 s37)

### 3.2 Carry Back
- 1 year carry back against total profits of preceding period (CTA 2010 s37)
- Terminal losses (final 12 months of trading): carry back 3 years against trading profits (CTA 2010 s39)

### 3.3 Carry Forward
- Carry forward indefinitely against total profits of subsequent periods
- Corporate loss restriction: losses carried forward shelter up to GBP 5,000,000 plus 50% of remaining profits above that threshold (CTA 2010 s269ZB)

---

## 4. R&D Tax Credits

### 4.1 Merged RDEC Scheme (from April 2024)
- Single merged scheme replacing old SME enhanced deduction and large company RDEC
- RDEC rate: 20% above-the-line credit on qualifying expenditure
- R&D-intensive SMEs: enhanced R&D intensive support (ERIS) at 27% payable credit rate

### 4.2 Qualifying Expenditure
- Staff costs (gross salaries, employer NIC, pension for staff directly engaged in R&D)
- Consumables and materials used in R&D
- Software directly used in R&D
- Sub-contracted R&D (restrictions based on connected/unconnected parties)
- Externally provided workers

### 4.3 Claim Process
- Include R&D claim in CT600 (boxes 660-695)
- Technical report describing qualifying projects, activities, and advances sought
- Cost analysis schedule supporting expenditure claimed

---

## 5. CT600 Preparation

### 5.1 CT600 Boxes and Schedules
- Box 145: total turnover; Box 155: trading profits; Box 235: total profits; Box 440: tax payable/repayable
- Supporting schedules: capital allowances computation, loss memorandum, R&D computation, group relief surrenders
- Self-assessment: company computes its own liability

### 5.2 iXBRL Tagging
- Accounts and computations filed in iXBRL format (Inline eXtensible Business Reporting Language)
- Tagging covers balance sheet, income statement, notes, and tax computation
- Use HMRC-approved taxonomies (FRS 101, FRS 102, IFRS, micro-entity, CT computation)

### 5.3 Filing Deadlines
- CT600: 12 months after end of accounting period
- Tax payment: 9 months and 1 day after end of accounting period (non-QIP companies)

---

## 6. Quarterly Instalment Payments (QIPs)

### 6.1 Large Companies
- Augmented profits exceed GBP 1,500,000 (divided by associated companies)
- Four instalments in months 7, 10, 13, and 16 of accounting period
- Based on estimated current year liability

### 6.2 Very Large Companies
- Augmented profits exceed GBP 20,000,000
- Four instalments in months 3, 6, 9, and 12 (earlier than large companies)

### 6.3 Estimation and True-Up
- Estimate liability based on current trading and forecasts
- Interest on underpayments (late payment interest) and overpayments (repayment interest)

---

## 7. Deferred Tax (IAS 12 / FRS 102 S29)

### 7.1 Temporary Differences Approach (Balance Sheet Method)
- DT arises on temporary differences between carrying amount and tax base
- Taxable temporary differences: deferred tax liabilities (DTL)
- Deductible temporary differences: deferred tax assets (DTA)
- Common examples: accelerated capital allowances (DTL), provisions not yet deductible (DTA), revaluations (DTL), tax losses carried forward (DTA), pension deficits (DTA), share-based payments timing (DTA)

### 7.2 Exceptions
- Initial recognition exemption: no DT on initial recognition of asset/liability not in a business combination that affects neither accounting nor taxable profit (IAS 12.15/24, narrowed by 2023 amendments)
- Goodwill: no DTL on non-tax-deductible goodwill (IAS 12.15(a))
- Investments in subsidiaries/associates: DT only when parent controls timing and probable reversal

---

## 8. DTA Recoverability

### 8.1 Recognition Criteria
- Recognise DTA only to extent probable (more likely than not) that future taxable profits available
- Sources: existing taxable temporary differences expected to reverse, forecast trading profits, tax planning strategies

### 8.2 Assessment
- Board-approved forecasts (typically 3-5 year business plans)
- Recent loss history (negative evidence); convincing evidence required (IAS 12.35)
- Tax planning opportunities and restrictions on loss utilisation

### 8.3 Disclosure
- Unrecognised DTAs: disclose amount and expiry of deductible temporary differences and tax losses
- Reassess at each reporting date

---

## 9. Tax Rate Changes

### 9.1 Measurement
- Deferred tax at enacted or substantively enacted rate expected when temporary difference reverses
- UK main rate: 25% (from April 2023); small profits rate: 19% (profits below GBP 50,000); marginal relief GBP 50,000-250,000

### 9.2 Re-Measurement
- Re-measure all DT balances when rate change substantively enacted
- Impact in P&L (unless underlying item in OCI or equity)

---

## 10. Financial Statement Tax Notes

### 10.1 Current Tax
- UK corporation tax charge, prior period adjustments, overseas tax

### 10.2 Deferred Tax
- DT charge/credit split by type of temporary difference

### 10.3 ETR Reconciliation
- Reconcile effective tax rate to statutory rate
- Explain differences: permanent disallowables, non-taxable income, rate differences, rate changes, prior year adjustments, unrecognised DTAs, R&D credits, banking surcharge

---

## 11. Transfer Pricing

### 11.1 Arm's Length Principle
- Connected party transactions at arm's length (TIOPA 2010 Part 4)
- Methods: CUP, resale price, cost plus, TNMM, profit split

### 11.2 Documentation
- Master file (group-wide), local file (entity-level), CbC reporting (revenue >= EUR 750m)

### 11.3 HMRC Compliance
- APAs for certainty; SAO obligations for large companies
- Contemporaneous documentation required

---

## 12. Financial Services Specific Considerations

### 12.1 Banking Surcharge
- 3% surcharge on profits exceeding GBP 100,000,000 for banking companies (from April 2023)
- Applies to UK banking groups, ring-fenced bodies, building societies
- Surcharge on trading profits only; separate DT calculation needed for surcharge portion

### 12.2 Insurance Premium Tax (IPT)
- Tax on general insurance premiums: standard 12%, higher 20% (travel, electrical appliance)
- Not deductible for CT purposes (passed to policyholders)

### 12.3 VAT Partial Exemption (Financial Services)
- FS supplies generally VAT-exempt (VATA 1994 Sch 9 Group 5)
- Partially exempt businesses: recover VAT only on inputs attributable to taxable supplies
- Partial exemption special method (PESM) agreed with HMRC
- Irrecoverable VAT is additional cost (P&L or capitalised)

### 12.4 Withholding Tax on Cross-Border
- Interest, royalties, certain payments to overseas entities subject to WHT
- UK WHT on interest: 20% (reduced by double tax treaties)
- Claim treaty relief or credit against UK CT for foreign WHT suffered

---

## 13. Key Standards and Legislation

| Topic | Standard/Legislation |
|---|---|
| Current tax computation | CTA 2009, CTA 2010, ITTOIA 2005 |
| Capital allowances | CAA 2001 |
| Trading losses | CTA 2010 Part 4, s37-45, s269ZB |
| R&D tax credits | CTA 2009 Part 13 (RDEC), Part 13 Ch 1A (ERIS) |
| Transfer pricing | TIOPA 2010 Part 4 |
| Deferred tax (IFRS) | IAS 12 |
| Deferred tax (UK GAAP) | FRS 102 S29 |
| Banking surcharge | CTA 2010 Part 7A |
| VAT | VATA 1994 |
| CT600 filing | FA 1998 Sch 18 |
