---
name: finance-chart-of-accounts-gl
description: |
  Chart of Accounts design, General Ledger maintenance, Trial Balance extraction, and FSLI mapping for UK statutory and IFRS reporting.
  Trigger on 'chart of accounts', 'COA design', 'general ledger', 'GL maintenance', 'trial balance', 'TB extraction',
  'TB analysis', 'FSLI mapping', 'account hierarchy', 'nominal ledger', 'account codes', 'reporting pack mapping',
  'opening balances', 'account creation', 'account closure', 'statutory format mapping', 'Companies Act format',
  'regulatory capital accounts', 'CASS accounts', 'Solvency II mapping', 'COA restructure', 'GL reconciliation'.
---

# Chart of Accounts, General Ledger & Trial Balance

This skill covers the foundational data architecture of the financial reporting process: designing and maintaining the Chart of Accounts, operating the General Ledger, and extracting and analysing the Trial Balance that feeds every set of financial statements.

---

## 1. Chart of Accounts Design Principles

### 1.1 Purpose and Scope
The COA is the master coding structure that classifies every financial transaction. A well-designed COA enables accurate statutory reporting, management reporting, tax compliance, and regulatory returns from a single source of truth.

### 1.2 Design Hierarchy
- **Entity code** -- identifies the legal entity within a group (critical for consolidation)
- **Cost centre / department** -- organisational unit for management reporting
- **Nominal account code** -- the account itself (revenue, expense, asset, liability, equity)
- **Inter-company code** -- flags transactions between group entities
- **Project / activity code** -- optional, for project-based costing or grant tracking
- **Currency code** -- for multi-currency ledgers

### 1.3 Numbering Convention (Typical UK Scheme)
- 0000-0999: Fixed assets (PPE, intangibles, investments)
- 1000-1999: Current assets (debtors, stock, bank, cash, prepayments)
- 2000-2999: Current liabilities (creditors, accruals, tax, short-term borrowings)
- 3000-3999: Long-term liabilities (loans, provisions, deferred tax)
- 4000-4999: Share capital and reserves
- 5000-5999: Revenue / turnover
- 6000-7999: Cost of sales and operating expenses
- 8000-8999: Other income and finance costs
- 9000-9999: Tax and appropriations

### 1.4 FSLI Mapping
Every nominal account must map to a Financial Statement Line Item (FSLI). This mapping drives the automated production of:
- Statement of Financial Position (CA 2006 Format 1 or Format 2)
- Statement of Comprehensive Income (CA 2006 Format 1 profit and loss)
- Cash flow statement classifications (operating, investing, financing)
- Notes to the accounts (each note pulls tagged accounts)

### 1.5 FRS 102 Mapping Considerations
- Section 4 (Statement of Financial Position): map accounts to the line items prescribed by CA 2006 Sch 1 Format 1 or Format 2
- Section 5 (Statement of Comprehensive Income): single-statement or two-statement approach; map revenue, cost of sales, admin expenses, distribution costs, finance costs, tax
- Ensure separate mapping for items reported in Other Comprehensive Income (revaluation gains, hedging movements, actuarial gains/losses on defined benefit schemes)

### 1.6 IFRS Mapping Considerations
- IAS 1 requires current/non-current distinction on the balance sheet; COA must support this classification
- OCI items must be separately identifiable: FVOCI movements, foreign currency translation, hedging reserve, revaluation surplus
- Segment reporting (IFRS 8) requires account tagging by operating segment if the entity reports segments

---

## 2. General Ledger Maintenance

### 2.1 Opening Balances
- Brought forward from prior year closing TB after accounts are finalised
- Post audit adjustments first, then carry forward
- Verify opening balance agreement: closing TB of year N-1 must equal opening TB of year N exactly
- For new entities or first-year adoptions, opening balances are posted via journal from the transition balance sheet

### 2.2 Account Creation and Closure
- New account requests require: account name, account type (BS/PL), FSLI mapping, cost centre allocation, tax code, approval from Financial Controller
- Dormant accounts: review annually; if no postings for 12+ months, flag for closure
- Never delete an account with historical postings; mark as inactive/closed to preserve the audit trail
- Maintain an account creation log with date, requestor, approver, and reason

### 2.3 Mapping to Reporting Packs
- Group reporting packs require a secondary mapping layer from local COA to group COA
- Maintain a mapping table: local account code to group reporting line
- Reconcile the local TB to the group reporting pack submission at each reporting period
- Differences arise from: classification differences (local GAAP vs group IFRS), eliminated items (intercompany), currency translation

### 2.4 GL Integrity Controls
- Segregation of duties: journal preparers must not be journal approvers
- System-enforced controls: mandatory journal narration, supporting document attachment, dual authorisation above threshold
- Suspense account monitoring: clear suspense accounts within the reporting period; aged suspense items require escalation
- Prevent direct postings to control accounts (debtors control, creditors control, bank) -- these should only be updated via sub-ledger

---

## 3. Trial Balance Extraction and Analysis

### 3.1 TB Extraction Process
1. Run the TB from the ERP/accounting system as at the reporting date
2. Verify completeness: total debits must equal total credits
3. Export in a structured format (account code, account name, opening balance, period debits, period credits, closing balance)
4. Reconcile to sub-ledger totals (debtors ledger, creditors ledger, fixed asset register, bank)

### 3.2 TB Analysis Procedures
- **Analytical review**: compare closing balances to prior period, budget, and forecast; investigate variances exceeding materiality or a percentage threshold (typically 10%)
- **Unusual balances**: debit balances on normally-credit accounts (or vice versa) require investigation
- **Nil balances**: confirm that expected balances are present (e.g., accruals, prepayments, tax)
- **New accounts**: review any accounts created during the period for appropriateness
- **Large or unusual journals**: identify journals above a threshold, round-number journals, journals posted by senior management, journals with no narration

### 3.3 Mapping TB to Statutory Formats
- Apply the FSLI mapping to aggregate the TB into statutory line items
- Cross-check: each statutory line item should reconcile back to the underlying nominal accounts
- Prepare a lead schedule for each material balance sheet and P&L line item
- The mapped TB becomes the primary working document for financial statement preparation

---

## 4. Financial Services Considerations

### 4.1 Regulatory Capital Accounts
- Banks and investment firms must maintain accounts that feed regulatory capital calculations (CET1, AT1, Tier 2)
- Tag accounts that contribute to: Common Equity Tier 1 (share capital, share premium, retained earnings, less deductions), Additional Tier 1 (perpetual non-cumulative preference shares, AT1 instruments), Tier 2 (subordinated debt, collective provisions)
- Ensure the COA supports the extraction of risk-weighted assets by category

### 4.2 CASS Accounts (Client Assets Sourcebook)
- FCA-regulated firms holding client money must maintain separate client money bank accounts
- COA must clearly segregate: firm money accounts from client money accounts
- CASS 7 (client money): separate nominal accounts for client money held, client money receivable, client money payable
- CASS 6 (custody assets): off-balance-sheet records but the COA should include memorandum accounts for control purposes
- Daily client money reconciliation accounts

### 4.3 Solvency II Mapping (Insurance)
- Insurance entities must map their COA to Solvency II reporting templates (QRTs)
- Technical provisions accounts must be granularly coded by: line of business, best estimate vs risk margin, gross vs reinsurers' share
- Own Funds classification requires account-level tagging similar to banking capital

### 4.4 Fund Accounting
- Asset management entities require a COA per fund, with NAV-contributory accounts clearly identified
- Management fee, performance fee, and expense accounts must map to the fund's income statement
- Investor capital accounts (subscriptions, redemptions, distributions) require separate coding

---

## 5. Reference Standards

| Standard / Regulation | Relevance |
|---|---|
| FRS 102 Section 4 | Statement of Financial Position presentation |
| FRS 102 Section 5 | Statement of Comprehensive Income presentation |
| Companies Act 2006 Sch 1 | Prescribed balance sheet and P&L formats (Format 1 / Format 2) |
| IAS 1 | Presentation of Financial Statements (IFRS) |
| IFRS 8 | Operating Segments -- COA must support segment tagging |
| FCA CASS 6/7 | Client assets and client money segregation |
| CRD IV / CRR | Regulatory capital reporting for banks |
| Solvency II | Insurance regulatory reporting |

---

## 6. Deliverables Checklist

- [ ] COA master file with full hierarchy and FSLI mappings
- [ ] Account creation/closure log
- [ ] Group reporting pack mapping table (if group entity)
- [ ] Trial balance as at reporting date, verified and balanced
- [ ] TB analytical review with variance commentary
- [ ] Lead schedules for each material FSLI
- [ ] Suspense account clearance report
- [ ] Sub-ledger to GL reconciliation for each control account
- [ ] Regulatory mapping tables (CASS, capital, Solvency II) where applicable
