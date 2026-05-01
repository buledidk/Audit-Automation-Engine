# Quick Reference Guide - Audit Procedures by FSLI

**Fast lookup guide for auditors implementing procedures in the Audit Automation Engine**

---

## C1: TRIAL BALANCE & LEAD SCHEDULES

### Key Risk: Medium | Assertions: Completeness, Accuracy, Classification

**Critical Procedures (MUST DO)**:
1. ✓ Recalculate TB totals (100% - mathematical accuracy)
2. ✓ Reconcile TB to GL master (100% - completeness)
3. ✓ Link TB to FS (100% - classification and accuracy)
4. ✓ Test lead schedule accuracy for material accounts (sample by size)

**Sample Size**: 35 accounts covering 72% of total assets

**Key Exception Threshold**: Any variance in TB reconciliation >$2,500

**Working Paper**: C1.1 (TB Reconciliation), C1.2 (GL Reconciliation), C1.3 (FS Link)

**Red Flags**:
- TB doesn't match GL or FS
- Duplicate or suspense accounts
- Manual post-close entries not supported
- Unexplained variances between periods

---

## D3: REVENUE & RECEIVABLES

### Key Risk: HIGH (ISA 240 Presumed Fraud Risk) | Assertions: All 6

**Critical Procedures (MUST DO)**:
1. ✓ Revenue policy review (IFRS 15 compliance) - planning phase
2. ✓ Revenue cutoff testing ±10 days year-end (40-50 transactions)
3. ✓ AR confirmations (40+ confirmations covering 75% of AR)
4. ✓ Invoice accuracy testing (25-30 invoices)
5. ✓ AR aging analysis (100% for collectibility)
6. ✓ Allowance for doubtful debts adequacy (test specific reserves)

**Sample Sizes by Risk**:
| Risk Level | Cutoff Testing | AR Confirmations | Invoice Testing |
|---|---|---|---|
| High | 40-50 | 50+ covering 80% | 30-40 |
| Medium | 25-30 | 30-40 covering 70% | 20-25 |
| Low | 15-20 | 15-20 covering 60% | 10-15 |

**Fraud Risk Testing** (ISA 240):
- Side agreements and contingent terms
- Round-dollar transactions
- Large sales to related parties
- Post year-end credit memos
- Management override (unusual JEs in revenue)

**Key Exception Threshold**: Any cutoff error or AR confirmation exception >$25,000 (2.5x PM)

**Working Papers**: D3.1 (Policy Review), D3.2 (Cutoff), D3.3 (Confirmations), D3.4 (Allowance), D3.5 (Fraud Testing)

**Critical Red Flags**:
- Revenue growth spike near year-end (>20% of Q4 vs other quarters)
- High DSO vs payment terms (>50 days for 30-day terms)
- Significant post year-end credit memos
- Customer confirmation exceptions not previously known
- Related party revenue not properly evaluated

---

## D4: INVENTORY & WIP

### Key Risk: HIGH (Judgment; Fraud Risk) | Assertions: Existence, Completeness, Accuracy, Valuation

**Critical Procedures (MUST DO)**:
1. ✓ Attend physical inventory count (100% - observation)
2. ✓ Perform test counts (25+ items during count observation)
3. ✓ Cost allocation testing (35+ items covering 72% of value)
4. ✓ NRV testing (all slow-moving items + 25+ normal items)
5. ✓ Obsolescence assessment (items with >180 days no movement)
6. ✓ Cutoff testing (GRN matching ±5 days)

**Inventory Count Observation**:
- Document count procedures followed
- Record test counts independently
- Observe cutoff controls
- Review post-count procedures
- Verify count sheet sign-off

**NRV Calculation**:
```
Cost: $X
Less: Post-YE selling price estimation: $(Y)
Less: Estimated disposal costs: $(Z)
NRV: $X - $Y - $Z
Provision if NRV < Cost
```

**Inventory Turnover Red Flags** (Days inventory outstanding):
- Raw materials >120 days (normal ~60-90)
- WIP >90 days (normal ~30-60)
- Finished goods >180 days (normal ~45-90)

**Key Exception Threshold**: NRV < Cost by >10% on any item requires provision

**Working Papers**: D4.1 (Count Observation), D4.2 (Cost Testing), D4.3 (NRV), D4.4 (Cutoff)

**Fraud Indicators**:
- Phantom inventory (counted items don't exist)
- Double-counting through consignment schemes
- Obsolete items not written down
- Counts performed without auditor observation
- Fake count sheets

---

## D5: FIXED ASSETS & LEASES

### Key Risk: Medium-High (Estimates; IFRS 16 Complexity) | Assertions: Existence, Accuracy, Classification, Rights

**Critical Procedures (MUST DO)**:
1. ✓ FA additions testing (25-35 items covering 78% of capex)
2. ✓ Depreciation policy review and recalculation (sample testing)
3. ✓ Impairment indicators assessment (all material assets)
4. ✓ Lease classification per IFRS 16 (all leases)
5. ✓ ROU asset and liability accounting (finance/operating)
6. ✓ FA register reconciliation to GL

**Addition Testing**:
- Verify capitalization threshold met (>$X and >1 year life)
- Inspect supporting invoice and PO
- Verify ownership/title for significant items
- Trace to GL and asset register

**Depreciation Recalculation**:
```
Annual Depreciation = (Cost - Residual Value) / Useful Life (years)
Accumulated Depreciation = Annual × Years in Service
Net Book Value = Cost - Accumulated Depreciation
```

**Lease Classification (IFRS 16)**:
- ALL leases now recognized as ROU assets + liabilities
- No more "operating vs finance" distinction
- Initial measurement: PV of lease payments
- Subsequent: Depreciation of asset + interest on liability

**Impairment Testing**:
- Trigger indicators: Market value decline >20%, obsolescence, idle
- Test fair value < NBV → record impairment
- Document impairment assessment

**Key Exception Threshold**: Any capex >$25,000 without proper support

**Working Papers**: D5.1 (Additions), D5.2 (Depreciation), D5.3 (Impairment), D5.4 (Leases)

**Red Flags**:
- Significant capital items without clear business purpose
- Assets not located during observation
- High disposal losses
- Fully depreciated assets still in use
- Lease contracts unclear or missing documentation

---

## D6: PAYABLES & ACCRUALS

### Key Risk: Medium | Assertions: Completeness, Accuracy, Cutoff

**Critical Procedures (MUST DO)**:
1. ✓ AP aging analysis (100% - reconciliation to GL)
2. ✓ Payables cutoff testing (GRNs ±5 days year-end)
3. ✓ Sample invoice testing (25-30 invoices to PO/GRN)
4. ✓ Accrual adequacy testing (all material accruals >$5,000)
5. ✓ Unrecorded liabilities procedures (post-YE cash review)

**Three-Way Matching** (Invoice to PO to GRN):
- Verify PO approved before purchase
- Verify GRN matches goods received
- Verify invoice matches PO and GRN
- Check for pricing accuracy

**Accrual Testing**:
- Obtain supporting documentation (estimates, contracts, time records)
- Verify amount is reasonable estimate of obligation
- Trace subsequent payment to confirm validity
- Assess for completeness (any obligations not accrued?)

**Cutoff Procedures**:
- Last GRN in current period: goods included in AP/inventory
- First GRN in next period: goods NOT included
- Any timing discrepancy >5 days investigated

**Unrecorded Liabilities**:
- Review post-YE cash disbursements for current period obligations
- Identify any January invoices for December goods/services
- Inquiry of management regarding known unpaid obligations
- Review board minutes and commitments

**DPO Calculation** (Days Payable Outstanding):
```
DPO = (Average AP / Purchases or COGS) × 365
Normal range: 30-60 days (compare to payment terms)
Significantly higher DPO may indicate:
- Payment delays / cash flow issues
- Accounts in dispute
- Potential unrecorded liabilities
```

**Key Exception Threshold**: Any unrecorded item >$25,000

**Working Papers**: D6.1 (AP Aging), D6.2 (Cutoff), D6.3 (Accruals), D6.4 (Unrecorded Liabilities)

**Red Flags**:
- Large aged payables (>90 days)
- Vendor confirmation exceptions
- Minimal accruals when significant obligations exist
- Post-YE invoices for current period obligations
- Weak three-way matching controls

---

## D7: LOANS & COVENANTS

### Key Risk: HIGH (Going Concern; Fraud - concealed breach) | Assertions: Existence, Completeness, Rights

**Critical Procedures (MUST DO)**:
1. ✓ Loan confirmation requests (100% of loans - ISA 505)
2. ✓ Loan agreement review (all terms and conditions)
3. ✓ Covenant compliance testing (100% - calculate and compare)
4. ✓ Debt disclosure verification (completeness and accuracy)
5. ✓ Going concern implications assessment (if breach)

**Loan Confirmation** (ISA 505):
- Direct to lender (not through client)
- Request: Balance, interest rate, payment terms, covenants, security
- Investigate differences vs our records
- Non-response: perform alternative procedures

**Covenant Testing**:
```
Typical Covenants:
1. Debt-to-Equity Ratio: Total Debt / Total Equity
   - Requirement: <2.5x, Calculated: 2.1x ✓

2. Interest Coverage: EBIT / Interest Expense
   - Requirement: >2.0x, Calculated: 3.8x ✓

3. Working Capital: Current Assets - Current Liabilities
   - Requirement: >$200,000, Calculated: $450,000 ✓

4. Debt Service Coverage: Operating Cash Flow / Debt Service
   - Requirement: >1.25x, Calculated: 1.8x ✓

If ANY covenant breached → ISA 570 Going Concern assessment required
```

**Debt Schedule Verification**:
- Opening balance to prior year FS
- New borrowings to loan confirmations and board minutes
- Repayments to cash disbursements
- Closing balance to GL
- Recalculate interest expense
- Verify discount/premium amortization

**Key Exception Threshold**: Any breach of covenant = material going concern issue

**Working Papers**: D7.1 (Confirmations), D7.2 (Covenant Testing), D7.3 (Debt Schedule), D7.4 (GC Assessment)

**Critical Red Flags** (Going Concern Risk):
- Covenant breach (especially debt-to-equity or liquidity ratios)
- Negative cash flow from operations
- Debt covenant waivers required
- Refinancing risk (debt maturing within 12 months)
- Lender restrictions on distributions
- Cross-default clauses triggered

---

## D8: TAX & DEFERRED TAX

### Key Risk: HIGH (Significant Estimates; Tax Authority Risk) | Assertions: Accuracy, Valuation, Completeness

**Critical Procedures (MUST DO)**:
1. ✓ Tax provision recalculation (current and deferred)
2. ✓ Deferred tax temporary differences analysis
3. ✓ Tax loss carryforward testing (use limitations)
4. ✓ Uncertain tax position assessment
5. ✓ Tax return filing compliance review
6. ✓ Tax rate change verification

**Tax Provision Calculation**:
```
Current Tax Provision:
= (Taxable Profit or Loss) × Applicable Tax Rate
= Recalculate vs tax return filed

Deferred Tax:
= Calculate temporary differences (book vs tax basis)
= Multiply × future tax rate
= Test deferred tax asset/liability recorded
```

**Deferred Tax Testing** (ISA 540 - Accounting Estimate):
- Identify temporary differences (depreciation, provisions, accruals, losses)
- For each difference: calculate taxable/deductible amounts
- Apply expected future tax rate (not current rate)
- Verify DTA/DTL recorded at correct amounts
- Test valuation allowance for DTA (probability of realization)

**Tax Loss Carryforward**:
- Obtain tax authority letter confirming loss carryforwards
- Assess probability of future profitability for utilization
- Consider change of control limitations
- Verify statutory expiration periods

**Uncertain Tax Positions** (FRS 102, IAS 12):
- Identify positions where tax treatment uncertain (e.g., tax ruling pending)
- Assess probability of acceptance by tax authority (>50% threshold)
- If >50% probable: accrue at most likely amount
- Disclose if material contingency

**Tax Return Reconciliation**:
- Obtain copy of tax return filed
- Reconcile FS profit to taxable profit
- Verify tax rate applied is correct statutory rate
- Investigate all adjustments (permanent and temporary)

**Key Exception Threshold**: Any tax provision error >$25,000 or change in tax rate >1% point

**Working Papers**: D8.1 (Current Tax), D8.2 (Deferred Tax), D8.3 (Tax Losses), D8.4 (Uncertain Positions)

**Red Flags**:
- Prior-year tax adjustments by authorities
- Aggressive tax positions (transfer pricing, intercompany)
- Related party tax planning structures
- Large uncertain tax positions
- Loss of tax loss carryforwards (change of control)
- Deferred tax assets not realisable

---

## D9: PROVISIONS & CONTINGENCIES

### Key Risk: HIGH (Significant Judgment; Fraud - earnings manipulation) | Assertions: Completeness, Accuracy, Valuation

**Critical Procedures (MUST DO)**:
1. ✓ Legal letter from company's lawyers (ISA 501)
2. ✓ Provision review per FRS 102/IAS 37 criteria
3. ✓ Management's unrecorded liability assessment
4. ✓ Onerous contract identification and testing
5. ✓ Contingent liability disclosure adequacy
6. ✓ Provisions roll-forward reconciliation

**Provision Recognition Criteria** (Must meet ALL per FRS 102 s21):
1. **Present Obligation**: Past event created obligation (legal or constructive)
2. **Probable Outflow**: Outflow of resources probable (>50%)
3. **Reliable Estimate**: Amount can be reliably estimated

**Provision Testing**:
```
For each provision:
1. Identify triggering event (litigation, warranty, restructuring)
2. Assess probability of settlement (probable = >50%)
3. Estimate amount (most likely or expected value)
4. Verify discount rate applied (if long-term)
5. Document supporting evidence (legal counsel, expert estimates)
```

**Legal Letter** (ISA 501):
- Request directly from company's legal counsel
- Ask for:
  - Pending litigation and claims
  - Estimated amounts (probable vs possible)
  - Opinion on likelihood of loss
  - Undisclosed claims the lawyer knows of
- Evaluate timing and completeness of response

**Onerous Contracts**:
- Identify contracts where unavoidable costs exceed economic benefits
- Assess for loss provision required
- Examples: Loss-making contracts, lease commitments

**Contingent Liabilities** (Disclose but NOT provision if):
- Possible but not probable outflow, OR
- Amount cannot be reliably estimated

**Adequacy Assessment**:
- Compare provisions to prior years
- Test accuracy of prior-year estimates (actual outcomes vs estimates)
- Assess management's estimation process

**Key Exception Threshold**: Any provision >$25,000 improperly recorded or undisclosed contingency >$50,000

**Working Papers**: D9.1 (Legal Letter), D9.2 (Provision Testing), D9.3 (Onerous Contracts), D9.4 (Contingencies)

**Critical Red Flags**:
- No legal letter received (must assess risk)
- Provision significantly different from legal counsel estimate
- Undisclosed legal proceedings
- History of provisions overestimated (earnings management indicator)
- Provisions reversed post-year-end without explanation
- Onerous contracts not identified

---

## D10: EQUITY

### Key Risk: Medium | Assertions: Completeness, Accuracy, Classification

**Critical Procedures (MUST DO)**:
1. ✓ Equity roll-forward (opening to closing reconciliation)
2. ✓ Share capital movements (authorize vs issued testing)
3. ✓ Dividend testing (authorization and payment)
4. ✓ Earnings per share (EPS) calculation if disclosed
5. ✓ Constitutional compliance review

**Equity Components**:
- **Share Capital**: Authorized vs issued; treasury shares
- **Retained Earnings**: Opening balance from prior year FS
- **Reserves**: Revaluation, translation, other statutory

**Share Capital Testing**:
```
1. Authorized Share Capital:
   - Verify per constitutional documents (articles)
   - No need for year-end testing (static)

2. Issued Share Capital:
   - Opening balance per prior year FS
   - New share issues in year:
     - Verify authorization (board minutes or shareholders)
     - Verify consideration received (cash or assets)
     - Verify accounting (Dr Cash, Cr Share Capital)
   - Treasury shares (if any):
     - Verify repurchase authorization
     - Verify consideration paid
     - Verify accounting (treasury stock vs capital reduction)
   - Closing balance reconciliation
```

**Dividend Testing**:
- Identify all dividend declarations in year
- Verify authorization (board and shareholders as required)
- Trace to minutes showing approval date and amount
- Verify accounting (Dr Retained Earnings, Cr Payables)
- Test payment (post-YE to cash disbursements)
- Assess dividend capacity per statutory limits

**Retained Earnings**:
- Opening balance = prior year FS closing
- Add: Net income for current year (from FS)
- Less: Dividends paid
- Closing = Retained earnings balance in FS

**EPS Disclosure (if applicable)** (ISA 540 - Accounting Estimate):
```
Earnings Per Share (EPS) = Net Income / Weighted Average Shares Outstanding
Test:
1. Numerator (earnings): agree to audited net income
2. Denominator (weighted average shares):
   - Trace opening shares to prior year
   - Document share movements during year
   - Calculate weighted average (shares × months held / 12)
   - Recalculate EPS
```

**Key Exception Threshold**: Any dividend paid in excess of authorized amount >$25,000

**Working Papers**: D10.1 (Equity Roll-forward), D10.2 (Share Capital), D10.3 (Dividends), D10.4 (EPS if applicable)

**Red Flags**:
- Share issuances not properly authorized
- Dividends paid in excess of earnings or reserves
- Share repurchases for non-genuine business reasons
- Equity transactions not properly documented
- EPS calculation errors

---

## D11: CASH & EQUIVALENTS

### Key Risk: Medium (Critical Assertion - Existence; Fraud - misappropriation) | Assertions: Existence, Completeness, Accuracy

**Critical Procedures (MUST DO)**:
1. ✓ Bank confirmations (100% of bank accounts - ISA 505)
2. ✓ Bank reconciliations testing (100% - all accounts)
3. ✓ Cash reconciliation to FS (verification of completeness)
4. ✓ Restricted cash identification (disclosure verification)
5. ✓ Outstanding checks review (completeness of payables)

**Bank Confirmation** (ISA 505 - Direct to Bank):
- Send standard confirmation form directly to each bank
- Request: Balance, interest rate, overdraft facilities, pledged assets
- Investigate differences vs our records
- Non-response: perform alternative procedures (bank statements, cancelled checks)

**Bank Reconciliation Testing** (100% of accounts):
```
Reconciliation Template:
Book balance per bank statement (date): $X
Add:
  - Deposits in transit (YY): $A
Less:
  - Outstanding checks (list): $(B)
Book balance per GL: $(X + A - B)

Steps:
1. Obtain bank statement and reconciliation
2. Verify opening balance agrees to prior month
3. Trace deposits to bank statement and GL
4. Trace disbursements to bank statement and GL
5. Test reconciling items (deposits in transit, outstanding checks)
6. Verify outstanding checks cleared in Jan/Feb
7. Look for unusual timing or stale items
```

**Cash Cutoff Testing** (Last deposits and checks):
- Final deposit recorded pre-YE should appear on bank statement for YE
- Checks written pre-YE may clear post-YE (normal)
- Unusual delays (>2 weeks) in check clearing investigated

**Restricted Cash**:
- Identify if any cash restricted by lender covenant
- Verify proper classification (non-current vs current, disclosure)
- Confirm with lender via bank confirmation

**Cash Equivalents** (per FRS 102/IAS 7):
- Short-term investments with <3 months maturity
- Easily convertible to cash
- Verify classification and valuation at fair value

**Fraud Indicators**:
- Lapping schemes (older AR cleared with newer cash)
- Cash balance unexpectedly high
- Reconciling items very large or unusual
- Large post-YE reconciling items
- Evidence of override of controls

**Key Exception Threshold**: Any reconciling item >$25,000 unexplained

**Working Papers**: D11.1 (Bank Confirmations), D11.2 (Bank Reconciliations), D11.3 (Cash Roll-forward), D11.4 (Restricted Cash)

**Critical Red Flags**:
- Bank confirmation exceptions not previously known
- Large outstanding checks for extended period
- Deposits in transit not clearing shortly after YE
- Unusual cash balance fluctuations
- Evidence of post-close manipulation of bank reconciliation
- Lender covenant restrictions on cash use

---

## D12: JOURNAL ENTRIES & CONSOLIDATION

### Key Risk: HIGH (ISA 240 Fraud Risk - Manual JEs) | Assertions: Existence, Accuracy, Completeness

**Critical Procedures (MUST DO)**:
1. ✓ Unusual/Manual JE testing (all JEs >$25,000 or unusual)
2. ✓ Management JE review (especially CFO/Finance Director entries)
3. ✓ Supporting documentation verification (100% of tested JEs)
4. ✓ Consolidation elimination testing (intercompany transactions)
5. ✓ Intercompany balance reconciliation (100%)

**ISA 240 - Fraud in Journal Entries**:
Presumed fraud risk area per ISA 240.26 - test unusual/late entries

**Manual JE Testing Framework**:
```
Selection Criteria:
1. ALL JEs recorded in final month of year
2. ALL JEs by CFO/Finance Director
3. ALL JEs >$25,000 (5% PM)
4. ALL unusual/non-recurring JEs (non-standard GL codes)
5. ALL JEs to provision/estimate accounts
6. ALL reversals of prior-period entries

For each JE tested:
1. Verify authorization (preparer and approver sign-off)
2. Verify business purpose documented
3. Trace to supporting documentation (not just description)
4. Assess for management override indicators:
   - Unusual timing (final day of year)
   - Unusual amounts (round dollar amounts)
   - Reversal of prior estimates
   - Non-standard GL codes
   - No supporting documentation
5. Recalculate amounts
6. Verify correct GL coding and account impact
```

**Management Override Testing** (ISA 240):
- Focus on CFO and Finance Director entries
- Entries outside normal authority or process
- Large or unusual items
- Post-close entries
- Entries to estimates or provisions

**Consolidation Elimination Testing**:
- For group entities: test intercompany transactions eliminated
- Obtain separate entity trial balances
- Verify consolidation instructions properly applied
- Test elimination entries (intercompany sales, loans, dividends)
- Verify goodwill and fair value adjustments
- Reconcile consolidated TB to consolidated FS

**Intercompany Transactions**:
```
Test procedures:
1. Obtain list of intercompany transactions (sales, loans, dividends)
2. For each significant item:
   - Verify authorized (board approval)
   - Verify commercial substance (not just tax-driven)
   - Verify accurate recording (matching between entities)
   - Verify elimination in consolidation
   - Verify arm's-length pricing (related party testing)
3. Test for disputes or unresolved balances
```

**Key Exception Threshold**: Any JE >$25,000 without support or unusual authorization

**Working Papers**: D12.1 (JE Testing), D12.2 (Management Override), D12.3 (Consolidation), D12.4 (Intercompany)

**Critical Red Flags**:
- Manual JE without supporting documentation
- JE from unusual user (not standard approver)
- Timing suspicious (final day of period)
- Round-dollar JE amounts
- JE reverses prior-period judgmental entry
- Post-close JE that impacts FS materially
- Intercompany transactions at non-arm's length pricing

---

## D13: POST-BALANCE SHEET EVENTS

### Key Risk: Medium (Going Concern Risk; Disclosure Risk) | Assertions: Completeness, Classification

**Critical Procedures (MUST DO)**:
1. ✓ Post-YE event review (period through audit completion date - ISA 560)
2. ✓ Management representation regarding events
3. ✓ Board minutes review (post-YE items)
4. ✓ Loan covenant assessment (any breaches post-YE?)
5. ✓ Subsequent payment/receipt analysis
6. ✓ Going concern assessment (ISA 570)

**Post-Balance Sheet Event Framework** (ISA 560):

**Adjusting Events** (Before audit report date):
- Provide evidence of conditions at YE
- Require recognition in FS or disclosure
- Examples:
  - Settlement of litigation (provision basis)
  - Customer insolvency (AR obsolescence)
  - Inventory obsolescence (post-YE sale at loss)
  - Asset damage (impairment indicator)

**Non-Adjusting Events** (Disclosure only or no adjustment):
- Related to conditions after YE
- Disclose if material to users
- May affect going concern
- Examples:
  - Major customer loss
  - Significant facility damage
  - Dividend declaration (after YE)
  - Debt financing/refinancing

**Procedures**:
```
1. Review post-YE items for 4-6 weeks (until audit completion)
2. Identify all events from:
   - Board/committee minutes
   - Subsequent cash receipts/payments
   - Loan confirmations
   - Subsequent invoices
   - Management inquiries
   - Subsequent bank statements
   - News/announcements
3. For each event:
   - Determine if adjusting or non-adjusting
   - If adjusting: verify adjustment in FS or disclosure
   - If non-adjusting: verify disclosure or assess if should adjust
   - Assess going concern implications
4. Document in working paper
```

**Going Concern Assessment** (ISA 570):
If significant post-YE event identified:
- Reconsider going concern assessment
- Evaluate entity's ability to meet obligations
- Consider duration of assessment period (12+ months from FS date)
- May require opinion qualification or emphasis of matter paragraph

**Examples of Post-YE Events Requiring Assessment**:
- Major customer/supplier loss
- Litigation settlement (large amounts)
- Asset impairment (facility destruction)
- Debt covenant waiver required
- Refinancing of maturing debt
- Dividend cancellation
- Significant decline in profitability indicators
- Change in management/board
- Regulatory sanctions

**Key Exception Threshold**: Any adjusting event >$25,000 not properly reflected

**Working Papers**: D13.1 (Post-YE Event Review), D13.2 (GC Assessment), D13.3 (Disclosures)

**Critical Red Flags**:
- Major event not disclosed in FS notes
- Customer/supplier loss that affects going concern
- Litigation settlement at variance to provision
- Evidence of going concern issues not disclosed
- Post-YE events suggesting YE estimates inaccurate

---

## D14: RELATED PARTY TRANSACTIONS

### Key Risk: HIGH (ISA 550; Fraud Risk; Disclosure) | Assertions: Completeness, Accuracy, Classification, Rights

**Critical Procedures (MUST DO)**:
1. ✓ Related party identification (comprehensive list)
2. ✓ Related party transaction identification (all types)
3. ✓ Transaction testing (sample of RPT for business rationale)
4. ✓ Arm's length pricing testing (comparable prices)
5. ✓ Disclosure adequacy review (IAS 24/FRS 102 s33)
6. ✓ Management representation (related parties and transactions)

**Related Party Definition** (IAS 24/FRS 102 s33):

**Are Related If**:
- Direct or indirect control (>20% voting interest)
- Significant influence
- Joint control
- Family members of key management personnel
- Key management personnel (directors, CFO, etc.)
- Entities owned by KMP

**Common Related Parties**:
- Subsidiaries and associates
- Directors and their families
- Significant shareholders
- Entities owned by management
- Company pension schemes
- Other group entities

**Related Party Identification Procedures**:
```
1. Obtain management's list of related parties
2. Compare to prior year list
3. Inquire regarding:
   - New related parties during year
   - Nature of relationship (control, influence, ownership)
   - Any transactions with related parties
4. Search for indicators:
   - Large balances to/from unusual parties
   - Unusual pricing or terms
   - Off-balance sheet arrangements
   - Share ownership/changes
   - Key management changes
5. Review board minutes for related party discussions
```

**Related Party Transaction Testing**:
```
For each material RPT identified:
1. Verify business purpose:
   - Why did entity transact with RP vs. external party?
   - Economic rationale (cost savings, strategic)?
2. Test pricing reasonableness:
   - Compare to transactions with non-related parties
   - Compare to market rates (if observable)
   - Verify terms are not abnormal
3. Verify authorization:
   - Board approval for significant RPT
   - Absence of conflict of interest documentation
4. Test completeness:
   - Are all RPT identified?
   - Are all disclosed?
5. Assess for fraud indicators:
   - Transactions designed to conceal asset misappropriation
   - Price manipulation to shift profits
   - Disguised financing arrangements
```

**Arm's Length Testing** (ISA 550):
```
Procedure:
1. Identify comparable prices/terms from non-related parties
2. For RP transaction:
   - Document prices charged
   - Compare to comparable transactions
   - Assess if differences justified (volumes, terms, credit)
   - If significant difference: investigate business rationale
3. Document comparison and conclusion
```

**Disclosure Adequacy** (IAS 24/FRS 102 s33):
Must disclose:
- Identity of related parties and relationship
- Nature and amount of material transactions
- Outstanding balances
- Terms and conditions of transactions
- Any non-arm's-length pricing with justification
- Contingencies related to RPT

**Management Representation**:
Specific representations:
- Complete list of related parties provided
- All related party transactions disclosed
- All known related party transactions recorded
- No undisclosed commitments with related parties

**Key Exception Threshold**: Any RPT >$50,000 without proper support or disclosure

**Working Papers**: D14.1 (RP Identification), D14.2 (RP Transactions), D14.3 (Pricing Analysis), D14.4 (Disclosures)

**Critical Red Flags**:
- RPT at non-arm's-length pricing without justification
- Material RPT not disclosed
- Significant balances to/from related parties
- Complex structures designed to hide RP nature
- Related party transactions with high fraud risk (asset sales, financing)
- Related parties obtained during year without disclosure
- "Loan" to related party never repaid (disguised distribution?)

---

## 📊 Exception Handling Summary

### Materiality Thresholds by FSLI

| FSLI | Overall Threshold | Exception Threshold | Extend Testing If |
|---|---|---|---|
| C1 | >$2,500 | >$2,500 | TB/GL mismatch identified |
| D3 | >$5,000 | >$25,000 (revenue) | Cutoff error rate >1% of sample |
| D4 | >$5,000 | >$25,000 (cost) | NRV < Cost on >1 item |
| D5 | >$5,000 | >$25,000 (addition) | Impairment indicator >1 item |
| D6 | >$5,000 | >$25,000 (accrual) | Unrecorded liability found |
| D7 | >$5,000 | Any covenant breach | Breach identified = GC assessment |
| D8 | >$5,000 | >$25,000 (provision) | Tax uncertainty exists |
| D9 | >$5,000 | >$25,000 (provision) | Undisclosed contingency |
| D10 | >$5,000 | >$25,000 (dividend) | Unauthorized transaction |
| D11 | >$5,000 | >$25,000 (reconciling) | Stale reconciling item |
| D12 | >$5,000 | >$25,000 (JE) | Manual JE without support |
| D13 | >$5,000 | Adjusting event >$25k | Material event not disclosed |
| D14 | >$5,000 | >$50,000 (RPT) | Non-arm's-length pricing |

### Action Triggers
- **Quantitative**: Exception > threshold = Adjust
- **Qualitative**: Fraud indicator, disclosure issue, going concern = Escalate
- **Systematic**: >3 exceptions in sample = Extended testing + control weakness

---

## ✅ Procedure Completion Checklist

Use this checklist for each FSLI to ensure all procedures completed:

### FSLI: ___________ | Date: _______ | Auditor: _________

- [ ] Assertion mapping reviewed
- [ ] Risk assessment documented (High/Medium/Low)
- [ ] Materiality and thresholds set
- [ ] Analytical procedures completed
- [ ] Substantive procedures completed
- [ ] Control testing completed (if applicable)
- [ ] Sample size determination documented
- [ ] Sample items selected per methodology
- [ ] Testing results documented in WP
- [ ] All exceptions identified and categorized
- [ ] Exceptions reviewed for materiality
- [ ] Audit adjustments proposed (if required)
- [ ] Follow-up procedures completed (if required)
- [ ] Working papers reviewed and signed off
- [ ] Conclusion documented
- [ ] Results reported to management

---

**Version 1.0 | Last Updated: 13-Mar-2026 | Ready for Production Use**

