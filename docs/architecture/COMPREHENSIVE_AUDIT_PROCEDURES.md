# Comprehensive Audit Procedures Library
## Advanced Audit Automation System - FSLI Testing Framework

**Version**: 1.0.0  
**Last Updated**: 13 March 2026  
**Status**: Production-Ready  
**Purpose**: Complete audit procedures for all 13 FSLI with assertion mapping, detailed procedures, sample testing guidance, working paper templates, and risk indicators

---

## 📋 Overview

This document provides comprehensive audit procedures for the 13 Financial Statement Line Items (FSLI) in the Audit Automation Engine. Each FSLI includes:

1. **Assertion Mapping** - All 6 audit assertions for each FSLI
2. **Detailed Audit Procedures** - Analytical, substantive, and control testing procedures
3. **Sample Testing Approach** - Population definition, sample sizing, and exception handling
4. **Working Paper Templates** - Ready-to-use templates for documentation
5. **Risk Indicators** - High-risk characteristics, red flags, fraud considerations, going concern implications

---

## 🎯 13 FSLI Areas Covered

### C1: Trial Balance & Lead Schedules (ISA 500, 320)
- **Description**: TB reconciliation and financial statement link
- **Objective**: Verify TB accuracy and completeness; confirm link to FS
- **Risk Level**: Medium
- **Key Assertions**: Completeness, Accuracy, Classification

### D3: Revenue & Receivables (ISA 240, 500, 501, 505)
- **Description**: Revenue recognition, AR aging, confirmations
- **Objective**: Test revenue completeness and cutoff; verify AR existence and valuation
- **Risk Level**: HIGH (presumed fraud risk per ISA 240)
- **Key Assertions**: Existence, Completeness, Accuracy, Cutoff

### D4: Inventory & WIP (ISA 501, 540)
- **Description**: Inventory attendance, NRV testing, cost allocation
- **Objective**: Verify inventory existence, accuracy, and valuation
- **Risk Level**: HIGH (significant judgment; fraud risk)
- **Key Assertions**: Existence, Completeness, Accuracy, Valuation

### D5: Fixed Assets & Leases (ISA 500, 540)
- **Description**: Additions, depreciation, impairment, lease classification (IFRS 16)
- **Objective**: Test FA additions/disposals, depreciation, impairment; verify lease accounting
- **Risk Level**: Medium-High
- **Key Assertions**: Existence, Accuracy, Classification, Rights/Obligations

### D6: Payables & Accruals (ISA 500, 501)
- **Description**: Payables confirmation, cut-off, accrual testing
- **Objective**: Verify AP accuracy and completeness; test accrual adequacy
- **Risk Level**: Medium
- **Key Assertions**: Completeness, Accuracy, Cutoff

### D7: Loans & Covenants (ISA 500, 505)
- **Description**: Loan confirmations, covenant compliance, debt disclosure
- **Objective**: Verify loans existence and completeness; test covenant compliance
- **Risk Level**: HIGH (going concern risk)
- **Key Assertions**: Existence, Completeness, Rights/Obligations

### D8: Tax & Deferred Tax (ISA 500, 540)
- **Description**: Current tax provision, deferred tax (temporary differences), losses
- **Objective**: Test tax provision adequacy; verify deferred tax calculations
- **Risk Level**: HIGH (significant estimates)
- **Key Assertions**: Accuracy, Valuation

### D9: Provisions & Contingencies (ISA 540, 501)
- **Description**: Legal provisions, warranty, onerous contracts, contingent liabilities
- **Objective**: Evaluate provision adequacy; identify unrecorded contingencies
- **Risk Level**: HIGH (significant judgment; fraud risk)
- **Key Assertions**: Completeness, Accuracy, Valuation

### D10: Equity (ISA 500)
- **Description**: Share capital, retained earnings, dividends, equity movements
- **Objective**: Verify equity transactions and statutory compliance
- **Risk Level**: Medium
- **Key Assertions**: Completeness, Accuracy, Classification

### D11: Cash & Equivalents (ISA 500, 505)
- **Description**: Bank confirmations, cash reconciliations, restricted cash
- **Objective**: Verify cash existence and completeness; test bank reconciliations
- **Risk Level**: Medium (critical assertion - existence)
- **Key Assertions**: Existence, Completeness, Accuracy

### D12: Journal Entries & Consolidation (ISA 240, 500)
- **Description**: JE testing (especially manual entries), consolidation, intercompany
- **Objective**: Test JE validity and authorization; verify consolidation completeness
- **Risk Level**: HIGH (fraud risk per ISA 240)
- **Key Assertions**: Existence, Accuracy, Completeness

### D13: Post-Balance Sheet Events (ISA 560)
- **Description**: Post year-end events, adjusting vs non-adjusting, going concern
- **Objective**: Identify subsequent events; verify proper disclosure
- **Risk Level**: Medium (going concern implications)
- **Key Assertions**: Completeness, Classification

### D14: Related Party Transactions (ISA 550)
- **Description**: Related party identification, transaction testing, disclosure per IAS 24/FRS 102 s33
- **Objective**: Test RPT validity; verify disclosure adequacy
- **Risk Level**: HIGH (fraud risk; disclosure complexity)
- **Key Assertions**: Completeness, Accuracy, Classification

---

## 🔍 The 6 Audit Assertions (Applied to Each FSLI)

All audit procedures map to one or more of these 6 assertions:

### 1. **Existence/Occurrence**
*Assertion*: All transactions and balances included in FS actually occurred and are genuine  
*Testing Approach*: External confirmations, inspection of assets, observation, inspection of documents  
*Common Procedures*: Bank confirmations, AR confirmations, inventory observation, asset inspection

### 2. **Completeness**
*Assertion*: All transactions and balances that should be recorded are included in FS  
*Testing Approach*: Analytical procedures, review of subsequent events, testing for unrecorded items  
*Common Procedures*: Analytical review, post-year-end procedures, accrual testing, unrecorded liability procedures

### 3. **Accuracy/Valuation**
*Assertion*: Amounts are accurately measured and recorded  
*Testing Approach*: Recalculation, substantive re-performance, comparison to source documents  
*Common Procedures*: Recalculation of accruals, depreciation testing, NRV testing, invoice verification

### 4. **Cutoff**
*Assertion*: Transactions are recorded in correct accounting period  
*Testing Approach*: Testing of period-end transactions and related documentation  
*Common Procedures*: Revenue/purchases cutoff testing, GRN matching, period-end transaction review

### 5. **Classification**
*Assertion*: Transactions are classified correctly in FS  
*Testing Approach*: Review of accounts and GL coding; verification of presentation  
*Common Procedures*: TB to FS reconciliation, account classification testing, disclosure review

### 6. **Rights and Obligations**
*Assertion*: Entity has enforceable rights to assets; liabilities are entity's obligations  
*Testing Approach*: Review of contracts, title documents, legal letters  
*Common Procedures*: Lease contract review, ownership verification, contingency legal letters

---

## 📊 Audit Procedures Classification

### A. Analytical Procedures
*Definition*: Evaluation of financial information through comparison to other data  
*Timing*: Planning, interim, and final phases  
*Nature*: Calculate ratios, trends, variance analysis  
*Extent*: Often all material amounts

**Examples by FSLI**:
- **D3 (Revenue)**: Revenue growth rates, gross margin analysis, DSO calculation
- **D4 (Inventory)**: Inventory turnover, COGS ratios, inventory buildup analysis
- **D5 (FA)**: Asset turnover, depreciation rate trend
- **D6 (Payables)**: DPO calculation, accrual reasonableness
- **D11 (Cash)**: Cash flow analysis, bank reconciliation review

### B. Substantive Procedures

#### 1. Substantive Analytical Procedures (SAP)
*Nature*: Analytical procedures used as substantive test  
*Timing*: Final audit phase typically  
*Extent*: All material amounts unless multiple tests

**Examples**:
- Revenue reasonableness testing (estimate expected revenue)
- Depreciation trend analysis
- Accrual percentage of revenue consistency

#### 2. Substantive Tests of Details (STD)
*Nature*: Sample testing of transactions and balances  
*Timing*: Final audit phase  
*Extent*: Sample based on risk and materiality

**Testing Methods**:
- Inspection (examining documents, physical assets)
- Observation (watching process or count)
- Inquiry (asking questions)
- Confirmation (obtaining external evidence)
- Recalculation (verifying arithmetic)
- Re-performance (redoing control or procedure)

**Examples**:
- Invoice verification (D3)
- Inventory test counts (D4)
- Asset disposal testing (D5)
- AP invoice matching (D6)

### C. Control Testing Procedures
*Objective*: Test design and operating effectiveness of controls  
*Timing*: Interim phase typically  
*Extent*: Based on control reliance decision

**Testing Steps**:
1. **Design Effectiveness**: Is control designed to prevent/detect misstatement?
2. **Operating Effectiveness**: Did control operate as designed throughout period?

**Methods**:
- Observation of control operation
- Inquiry of control performer
- Inspection of evidence of control operation
- Re-performance of control

---

## 💡 Key Audit Concepts Applied to Each FSLI

### Risk-Based Audit Approach
Each FSLI is assessed for:
- **Inherent Risk**: Susceptibility to material misstatement before controls
- **Control Risk**: Risk controls don't prevent/detect misstatement
- **Detection Risk**: Risk audit procedures don't detect misstatement

**Response to Risk**:
- **High Risk FSLI** (D3, D4, D7-9, D12, D14): Detailed substantive testing, possibly 100%, specialist involvement
- **Medium Risk FSLI** (C1, D5, D6, D10, D11, D13): Balanced control/substantive testing
- **Low Risk FSLI**: Limited substantive analytics, sample testing

### Materiality Application
- **Overall Materiality (OM)**: Typically 5% PBT or 2% Revenue
- **Performance Materiality (PM)**: 75% of OM - threshold for detailed testing
- **Trivial Threshold**: 5% of OM - items below not evaluated
- **FSLI-Specific Thresholds**: Can be set lower for high-risk areas

---

## 🎓 Detailed Procedure Examples by Category

### Example 1: Revenue Cutoff Testing (D3)

**Objective**: Verify revenue recorded in correct period (IFRS 15 - performance obligations satisfied when)

**Risk Addressed**: Cutoff, Existence, Accuracy

**Timing**: Final audit phase

**Extent**: Sample size per risk level:
- High risk: 40-50 transactions ±10 days year-end
- Medium risk: 25-30 transactions
- Low risk: 15-20 transactions

**Procedures**:
1. Identify all revenue transactions recorded in final 10 days of year and first 10 days of next period
2. For each sample item:
   - Obtain sales invoice
   - Locate bill of lading or shipping document
   - Verify shipping date and invoice date
   - Confirm customer acceptance documented
   - Review for side agreements or returns
3. Investigate exceptions: shipping date differs from invoice date by >3 days
4. Calculate error rate; if >1% of sample has exceptions, expand testing

**Exception Handling**: Any cutoff error >$25,000 (5% PM) = adjustment required

---

### Example 2: Inventory NRV Testing (D4)

**Objective**: Verify inventory valued at lower of cost or NRV per FRS 102 s13

**Risk Addressed**: Valuation, Completeness (for provisions)

**Timing**: Final audit phase

**Extent**: All slow-moving items + sample of normal items

**Procedures**:
1. Obtain inventory aging report (items by last sale date)
2. Identify items with >180 days since last sale (slow-moving)
3. For each slow-moving item:
   - Obtain post year-end selling price/quote (if not sold)
   - Estimate selling price less disposal costs = NRV
   - Compare NRV to inventory cost
   - If NRV < cost, calculate required provision

**Calculation Example**:
```
Item: Obsolete Equipment
Inventory Cost: $50,000
Estimated Selling Price (60% closeout): $30,000
Estimated Disposal Costs: $2,000
NRV: $28,000
Provision Required: $22,000 ($50,000 - $28,000)
```

---

### Example 3: Loan Covenant Compliance Testing (D7)

**Objective**: Verify entity complies with loan covenants per ISA 570 (going concern)

**Risk Addressed**: Going concern, Rights/Obligations, Completeness

**Timing**: Final audit phase and completion phase

**Extent**: All loan agreements

**Procedures**:
1. Obtain copies of all loan agreements
2. For each loan, identify covenant requirements:
   - Debt-to-equity ratios (e.g., <2.5x)
   - Interest coverage ratios (e.g., >2.0x)
   - Minimum working capital
   - Asset pledges and restrictions
   - Financial reporting requirements
3. Calculate covenant metrics using FS:
   - Debt/Equity = Total Debt / Total Equity
   - Interest Coverage = EBIT / Interest Expense
   - Working Capital = Current Assets - Current Liabilities
4. Compare results to covenant thresholds
5. If covenant breached: evaluate going concern implications
6. Review loan agreement for consequences of breach (default, acceleration)

**Covenant Testing Matrix**:
| Covenant | Requirement | 31-Dec-2024 | Status | Action |
|----------|-------------|-------------|--------|--------|
| Debt-to-Equity | <2.5x | 2.1x | ✓ Pass | Monitor |
| Interest Coverage | >2.0x | 3.8x | ✓ Pass | Monitor |
| Working Capital | >$200k | $450k | ✓ Pass | Monitor |
| Debt Service Coverage | >1.25x | 1.8x | ✓ Pass | Monitor |

---

## 📋 Working Paper Template Structure

All working papers follow this standard structure:

### Header Section
```
Audit Engagement: [Client Name & Year]
Financial Statement Year Ended: 31 December 2024
Audit Area: [FSLI Area - e.g., D3-Revenue]
ISA References: [Applicable standards]
Prepared by: [Auditor Name] | Date: [DD/MM/YYYY]
Reviewed by: [Senior/Manager] | Date: [DD/MM/YYYY]
Working Paper Reference: [e.g., D3.1, D3.2, D3.3]
```

### Objective
Clear statement of what is being tested:
- Assert you're testing
- Why (required by ISA or high-risk area)
- What you're trying to conclude

### Scope
- **Population Definition**: What universe are you testing (e.g., "All revenue transactions")
- **Sample Size**: How many items (e.g., "35 of 450 transactions = 8%")
- **Sampling Method**: How selected (random, stratified, all items >threshold)
- **Materiality**: OM, PM, threshold for this area

### Procedures Performed
Step-by-step description of what was done and results:
1. Step 1: [What was done]
   - Result: [What was found]
2. Step 2: [What was done]
   - Result: [What was found]
3. Etc.

### Results/Exceptions
Summary of findings:
- **No. of Exceptions**: [0, 1, >1]
- **Details**: Description of each exception
- **Materiality Assessment**: Impact on FS
- **Adjustments**: Any audit adjustments proposed

### Conclusion
Professional conclusion on assertion being tested:
- "Based on procedures performed, we are satisfied that [assertion] is fairly stated"
- OR "Based on procedures performed, we identified [issue] which requires [action]"

---

## 🎯 Sample Size Guidance by Risk Level

### HIGH RISK FSLI (D3, D4, D7, D8, D9, D12, D14)
*Approach*: Extensive substantive testing, possibly 100%, specialist involvement, detailed controls testing

| Procedure Type | Sample Size |
|---|---|
| Revenue cutoff testing | 40-50 transactions |
| Inventory cost testing | 50+ items covering 80% of value |
| AP/AR confirmations | 50+ confirmations covering 80% |
| JE testing | 30-50 unusual/manual entries |
| Loan covenants | 100% of loan agreements |

### MEDIUM RISK FSLI (C1, D5, D6, D10, D11, D13)
*Approach*: Balanced control and substantive testing, standard sample sizes

| Procedure Type | Sample Size |
|---|---|
| Substantive testing | 20-30 items covering 70% |
| Control effectiveness | 10-15 control instances |
| Analytical procedures | All material items |

### LOW RISK FSLI (if any)
*Approach*: Substantive analytics, limited detail testing, monitoring controls

| Procedure Type | Sample Size |
|---|---|
| Analytical procedures | All |
| Sample testing | 5-10 items or targeted high-risk |

---

## ⚠️ Risk Indicators Framework

For each FSLI, evaluate:

### 1. High-Risk Characteristics (Inherent Risk)
Factors increasing susceptibility to material misstatement:
- Significant management judgment required
- Prior-period issues
- Complexity of transactions
- New accounting standards
- Related party involvement

### 2. Red Flags During Fieldwork (Control Risk)
Issues observed suggesting controls aren't operating:
- Lack of documentation
- Unusual transactions
- Weak approval evidence
- Difficulty getting information
- Changes to processes

### 3. Going Concern Implications (ISA 570)
Areas that affect going concern assessment:
- Covenant breaches
- Negative cash flow
- Liquidity concerns
- Loss of major customer
- Loan defaults

### 4. Fraud Risk Considerations (ISA 240)
Fraud risk areas requiring specialized procedures:
- Revenue manipulation
- Inventory obsolescence concealment
- Understated liabilities
- Phantom assets
- Management override

---

## 📈 Materiality Application Example

**Overall Materiality Calculation**:
```
Benchmark: 5% of Profit Before Tax (PBT)
PBT = $1,000,000
Overall Materiality = $50,000

Performance Materiality (75%):
$50,000 × 75% = $37,500

Trivial Threshold (5%):
$50,000 × 5% = $2,500

FSL-Specific Thresholds (if higher risk):
- D3 (Revenue) - High Risk: $25,000
- D4 (Inventory) - High Risk: $25,000
- D7 (Loans) - High Risk: $20,000 (any breach or covenant issue)
```

**Application**:
- Items >$50,000: MUST adjust
- Items $37,500-$50,000: Consider qualitative factors
- Items $2,500-$37,500: Evaluate individually
- Items <$2,500: Not evaluated (trivial)

---

## 🔗 ISA to FSLI Mapping

### ISA 240: Fraud
Applies to: D3, D4, D9, D12, D14 (higher fraud risk areas)

### ISA 500: Audit Evidence
Applies to: All FSLI (general evidence gathering)

### ISA 501: Specific Areas
Applies to: D3 (AR confirmation), D4 (inventory), D6 (AP), D11 (cash)

### ISA 505: External Confirmations
Applies to: D3 (AR), D6 (AP), D7 (loans), D11 (cash)

### ISA 540: Accounting Estimates
Applies to: D4 (NRV), D5 (depreciation, impairment), D8 (deferred tax), D9 (provisions)

### ISA 550: Related Parties
Applies to: D14 (RPT testing)

### ISA 560: Subsequent Events
Applies to: D13 (post year-end events)

### ISA 570: Going Concern
Applies to: D7 (loans/covenants), D9 (provisions related to GC)

---

## 💼 Implementation in Code

The `auditProceduresLibrary.json` file structure:

```json
{
  "auditProceduresLibrary": {
    "FSLI_REF": {
      "fsliRef": "D3",
      "label": "Revenue & Receivables",
      "isaReferences": ["ISA 240", "ISA 500", "ISA 501", "ISA 505"],
      "assertionMapping": {
        "existence": { ... },
        "completeness": { ... },
        ...
      },
      "analyticalProcedures": { ... },
      "substantiveProcedures": { ... },
      "controlTestingProcedures": { ... },
      "sampleTestingApproach": { ... },
      "workingPaperTemplate": { ... },
      "riskIndicators": { ... }
    }
  }
}
```

**Using in React Components**:
```javascript
import auditProceduresLibrary from './data/auditProceduresLibrary.json';

const fsliProcedures = auditProceduresLibrary.auditProceduresLibrary['D3'];
const assertionMethods = fsliProcedures.assertionMapping;
const samples = fsliProcedures.sampleTestingApproach;
```

---

## 📚 Cross-Reference Guide

### By ISA Standard
- **ISA 240**: D3, D4, D9, D12, D14
- **ISA 500**: All (foundation)
- **ISA 501**: D3, D4, D6, D11
- **ISA 505**: D3, D6, D7, D11
- **ISA 540**: D4, D5, D8, D9
- **ISA 550**: D14
- **ISA 560**: D13
- **ISA 570**: D7, D9, D13

### By Risk Level
- **High Risk** (Extensive testing): D3, D4, D7, D8, D9, D12, D14
- **Medium Risk** (Balanced): C1, D5, D6, D10, D11, D13
- **Low Risk** (Limited): (typically none at final audit)

### By Assertion Risk
- **Existence Risk** (High): D3, D4, D7, D11
- **Completeness Risk** (High): D3, D4, D6, D9, D13
- **Accuracy Risk** (High): All areas
- **Cutoff Risk** (High): D3, D4, D6, D12
- **Classification Risk** (Medium): C1, D5, D10
- **Rights Risk** (Medium): D5, D7, D14

---

## 🚀 Quick Start: Testing an FSLI

1. **Identify FSLI**: Determine which area to audit (e.g., D3-Revenue)
2. **Review Risk**: Assess inherent and control risk levels
3. **Set Materiality**: Determine FSLI-specific threshold
4. **Analytical Procedures**: Perform trend analysis and reasonableness tests
5. **Sampling**: Determine sample size based on risk level
6. **Substantive Testing**: Test sample per procedures documented
7. **Control Testing**: Assess control effectiveness (if relying on controls)
8. **Documentation**: Complete working paper with findings and conclusion
9. **Exception Handling**: Investigate and document all exceptions
10. **Sign-Off**: Obtain supervisory review and approval

---

## 📖 References & Standards

- **ISA 200-700**: International Standards on Auditing
- **FRS 102**: Financial Reporting Standard for Smaller Entities
- **IFRS 15**: Revenue from Contracts with Customers
- **IFRS 16**: Leases
- **IAS 24**: Related Party Disclosures
- **Companies Act 2006** (UK): Key sections on financial reporting and auditor responsibilities
- **PwC UK Audit Manual**: Professional guidance on audit methodology

---

## ✅ Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 13-Mar-2026 | Initial comprehensive procedures library created - all 13 FSLI with full assertion mapping, procedures, templates, and risk framework |

---

**Document Status**: PRODUCTION-READY  
**Last Reviewed**: 13 March 2026  
**Next Review**: Quarterly with major ISA/IFRS updates  
**Custodian**: Audit Automation Engine Development Team

