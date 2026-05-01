---
name: finance-lease-accounting
description: |
  Full lifecycle lease accounting under IFRS 16 and FRS 102 S20. Covers lease
  identification, ROU asset and lease liability measurement, discount rates,
  modifications, variable payments, short-term and low-value exemptions, sale and
  leaseback, lessor accounting, transition, presentation, and disclosure.
  FS-specific: bank branch lease portfolios, insurance office portfolios, fund leases.
  Trigger: 'IFRS 16', 'lease accounting', 'right of use', 'ROU asset',
  'lease liability', 'incremental borrowing rate', 'IBR', 'lease modification',
  'sale and leaseback', 'FRS 102 S20', 'operating lease', 'finance lease',
  'lease transition', 'short-term lease', 'low-value lease'.
---

# Lease Accounting -- Full Lifecycle Guide

This skill covers the end-to-end lease accounting process for both lessees and lessors under IFRS 16 and FRS 102 Section 20, including transition from legacy standards.

---

## 1. Lease Identification -- IFRS 16

### 1.1 Definition (IFRS 16.9)
- A contract is, or contains, a lease if it conveys the right to control the use of an identified asset for a period of time in exchange for consideration
- Two criteria: (a) identified asset (explicitly or implicitly specified, supplier does not have substantive substitution right), and (b) right to control use (right to obtain substantially all economic benefits + right to direct the use)

### 1.2 Key Judgements
- Substitution rights: is the supplier's right substantive? (consider practical ability and economic benefit)
- Right to direct use: who decides how and for what purpose the asset is used?
- Separating lease and non-lease components: allocate based on relative stand-alone prices; practical expedient to not separate available

---

## 2. Initial Measurement (Lessee -- IFRS 16)

### 2.1 ROU Asset
- ROU asset = lease liability + prepaid lease payments + initial direct costs - lease incentives received + estimated dismantling/restoration costs

### 2.2 Lease Liability
- PV of future lease payments, discounted at the rate implicit in the lease (if readily determinable) or the lessee's incremental borrowing rate (IBR)
- Lease payments include: fixed payments (less incentives), variable payments based on index/rate (e.g., CPI), amounts under residual value guarantees, purchase option exercise price (if reasonably certain), termination penalties (if lease term reflects exercise)

---

## 3. Discount Rate

### 3.1 Implicit Rate vs IBR
- Rate implicit in the lease: rate that causes PV of lease payments plus unguaranteed residual value to equal FV of asset plus lessor's initial direct costs
- IBR: rate the lessee would pay to borrow over similar term, with similar security, for a similar asset in a similar economic environment
- Use implicit rate if determinable; otherwise use IBR

### 3.2 Determining the IBR
- Start with a reference rate (SONIA, gilt rate), adjust for credit spread, term, currency, and collateral
- IBR is entity-specific and lease-specific (portfolio approaches permitted for similar leases)

---

## 4. Subsequent Measurement

### 4.1 ROU Asset
- Cost model (default): cost less accumulated depreciation and impairment
- Depreciation: shorter of lease term and useful life (unless title transfers or purchase option reasonably certain, then useful life)
- Revaluation model: permitted if lessee applies IAS 16 revaluation to that class of PPE
- Investment property model: if ROU meets IAS 40 definition, may apply FV model

### 4.2 Lease Liability
- Accrete interest: Dr Interest expense / Cr Lease liability (at discount rate)
- Reduce by payments: Dr Lease liability / Cr Cash
- Remeasure for modifications, reassessments, or revised payments

---

## 5. Modifications

### 5.1 Modification as a Separate Lease
- Treat as separate if: (a) modification increases scope by adding right to use additional assets, AND (b) consideration increases commensurate with stand-alone price

### 5.2 Modification Not a Separate Lease
- Change in scope: decrease ROU asset, recognise gain/loss in P&L; adjust lease liability
- Change in consideration only: adjust lease liability with corresponding adjustment to ROU asset (no P&L)
- Partial termination: derecognise portion of ROU asset, adjust lease liability, recognise gain/loss
- Remeasure using revised discount rate

---

## 6. Variable Lease Payments

### 6.1 Index or Rate Linked
- Included in lease liability using index/rate at commencement date
- Remeasured when cash flows change due to index/rate change
- Remeasurement uses revised payments at unchanged discount rate (unless lease term also changes)

### 6.2 Performance or Usage Based
- Not included in lease liability; recognised as expense when triggering event occurs
- Example: turnover-based rent in retail leases

---

## 7. Short-Term and Low-Value Exemptions

### 7.1 Short-Term Leases (IFRS 16.5(a))
- Lease term of 12 months or less at commencement (after considering extension options)
- Must not contain a purchase option; election by class of underlying asset
- Straight-line expense recognition

### 7.2 Low-Value Assets (IFRS 16.5(b))
- Underlying asset has low value when new (IASB guidance: approximately USD 5,000)
- Absolute basis (not relative to entity size); election lease-by-lease
- Examples: tablets, personal computers, small office furniture, telephones

---

## 8. Sale and Leaseback

### 8.1 Assessment
- Determine whether transfer is a sale under IFRS 15 (transfer of control)
- If sale: derecognise asset, recognise ROU at proportion of previous carrying amount relating to right retained, gain/loss only on rights transferred
- If not a sale: continue recognising asset, recognise financial liability for proceeds (financing arrangement)

### 8.2 Subsequent Measurement
- Seller-lessee: normal IFRS 16 lessee accounting for the leaseback
- Buyer-lessor: purchase under relevant asset standard (IAS 16, IAS 40), leaseback as lessor lease

---

## 9. Lessor Accounting

### 9.1 Classification (IFRS 16.62-66)
- Finance lease: transfers substantially all risks and rewards of ownership
- Operating lease: all other leases
- Indicators of finance lease: transfer of ownership, bargain purchase option, lease term = major part of economic life, PV of payments = substantially all of FV, specialised asset

### 9.2 Finance Lease -- Lessor
- Derecognise underlying asset; recognise net investment in the lease (PV of lease payments + unguaranteed residual value)
- Recognise finance income over lease term (effective interest method)

### 9.3 Operating Lease -- Lessor
- Continue recognising asset on BS; depreciate per normal policy
- Recognise lease income straight-line over lease term

---

## 10. FRS 102 Section 20

### 10.1 Classification Model (Old IAS 17 Model)
- Operating vs finance lease classification at inception
- Finance lease (risks and rewards transferred): recognise asset and liability at lower of FV and PV of minimum lease payments
- Operating lease: straight-line expense over lease term (including rent-free periods and stepped rents)
- No ROU concept for operating leases; operating leases are off-balance-sheet

### 10.2 Key Differences from IFRS 16
- No lease liability for operating leases
- Operating lease commitments disclosed in notes (within 1 year, 2-5 years, over 5 years)
- Lease incentives spread over shorter of lease term and period to next rent review

---

## 11. Transition from FRS 102 S20 to IFRS 16

### 11.1 Modified Retrospective (Most Common)
- Do not restate comparatives
- Lease liability at PV of remaining payments, discounted at IBR at date of initial application
- ROU asset: option to measure at amount equal to lease liability (adjusted for prepaid/accrued) or as if IFRS 16 had always applied (using IBR at commencement)
- Practical expedients: use hindsight for lease term, exclude leases ending within 12 months, single discount rate for portfolios, rely on onerous lease assessments

### 11.2 Full Retrospective
- Restate comparatives as if IFRS 16 had always applied
- Requires historical lease-by-lease data; rarely used in practice

---

## 12. Presentation

### 12.1 Balance Sheet
- ROU assets: present separately or within PPE (disclose which line items include ROU assets)
- Lease liabilities: present separately or disclose within borrowings; split current/non-current

### 12.2 P&L
- IFRS 16: depreciation of ROU asset (operating/admin expense) + interest on lease liability (finance cost)
- Replaces single "rent expense" under IAS 17 operating leases
- Effect: EBITDA improves; interest expense increases; total charge front-loaded

### 12.3 Cash Flow
- Principal portion of lease payments: financing activities
- Interest portion: financing or operating (consistent with entity's policy for interest paid)
- Short-term and low-value lease payments: operating activities
- Variable payments not in liability: operating activities

---

## 13. Disclosures (IFRS 16.51-60)

### 13.1 Quantitative
- Depreciation by class of asset, interest expense, short-term lease expense, low-value lease expense, variable payment expense, total cash outflow
- Maturity analysis of lease liabilities (undiscounted): within 1 year, 1-2, 2-3, 3-4, 4-5, over 5, total, less discounting effect, PV

### 13.2 Qualitative
- Nature of leasing activities, extension/termination options, residual value guarantees, restrictions/covenants, sale and leaseback transactions

---

## 14. Financial Services Specific Considerations

### 14.1 Banking -- Branch Portfolios
- Banks typically have hundreds of branch leases; IFRS 16 transition required significant data collection and systems
- Portfolio approach to IBR: group leases by currency, term band, credit quality; single IBR per portfolio
- Regulatory capital: ROU assets risk-weighted at 100% (standardised approach); lease liabilities do not reduce capital
- Leverage ratio: ROU assets in exposure measure; no netting against lease liability

### 14.2 Insurance -- Office Portfolios
- Large property portfolios requiring systematic lease data management
- Solvency II: ROU assets valued at Solvency II basis (may differ from IFRS); lease liabilities in technical provisions or other liabilities

### 14.3 Fund Management -- Leases
- Fund vehicles rarely hold leases (property funds excepted)
- Fund management companies apply IFRS 16 or FRS 102 S20 to office and IT equipment leases
- Property funds: investment property under IAS 40, not IFRS 16; headleases where fund is lessee may fall under IFRS 16
- Fleet leases common in larger FS groups

---

## 15. Key Standards Reference

| Topic | IFRS | FRS 102 | IAS 17 (Legacy) |
|---|---|---|---|
| Lease definition | IFRS 16.9 | S20.2 | IAS 17.4 |
| Lessee recognition | IFRS 16.22-28 | S20.9 (finance), S20.15 (operating) | IAS 17.20, 33 |
| Lessor classification | IFRS 16.62-66 | S20.4-5 | IAS 17.7-19 |
| Discount rate | IFRS 16.26 | S20.9 | IAS 17.20 |
| Modifications | IFRS 16.44-46 | -- | -- |
| Transition | IFRS 16.C1-C19 | -- | -- |
| Disclosure | IFRS 16.51-60 | S20.13, S20.16 | IAS 17.31, 35 |
