# Excel & Word Output Samples

This document shows the exact structure and content produced by each export method, so developers and auditors can verify output before integrating.

---

## 1. Excel — Full Engagement Export

### `auditExcelExportService.exportEngagement(engagement)`

**Input:**
```javascript
const engagement = {
  clientName: 'Phoenix Manufacturing Ltd',
  engagementName: 'Statutory Audit FY2026',
  yearEnd: '31 March 2026',
  preparedBy: 'Sarah Chen, ACA',
  reviewedBy: 'James Walker, FCA',
  planning: {
    engagementLetter: true,
    materialityLevel: 250000,
    performanceMateriality: 187500,
    trivialThreshold: 12500,
    decisions: [
      { area: 'Revenue Recognition', decision: 'Extended procedures', rationale: 'New contract types in FY2026' },
      { area: 'Going Concern', decision: 'Standard procedures', rationale: 'Strong cash position' },
      { area: 'Related Parties', decision: 'Enhanced scrutiny', rationale: 'New subsidiary acquired Q2' },
    ],
  },
  riskAssessment: {
    risks: [
      { area: 'Revenue', inherentRisk: 'High', controlRisk: 'Medium', detectionRisk: 'Low', combinedRisk: 'Medium', response: 'Extended substantive testing' },
      { area: 'Trade Receivables', inherentRisk: 'Medium', controlRisk: 'Low', detectionRisk: 'Medium', combinedRisk: 'Low', response: 'Standard procedures' },
      { area: 'Inventory', inherentRisk: 'High', controlRisk: 'High', detectionRisk: 'Low', combinedRisk: 'High', response: 'Attend stock count, extended testing' },
      { area: 'Trade Payables', inherentRisk: 'Low', controlRisk: 'Low', detectionRisk: 'High', combinedRisk: 'Low', response: 'Analytical review' },
      { area: 'Fixed Assets', inherentRisk: 'Medium', controlRisk: 'Medium', detectionRisk: 'Medium', combinedRisk: 'Medium', response: 'Verify additions, test depreciation' },
      { area: 'Payroll', inherentRisk: 'Low', controlRisk: 'Low', detectionRisk: 'High', combinedRisk: 'Low', response: 'Analytical procedures' },
    ],
  },
  materiality: {
    revenue: 15000000,
    revenuePercent: '1%',
    totalAssets: 8500000,
    assetsPercent: '2%',
    pbt: 2200000,
    pbtPercent: '5%',
    selectedBenchmark: 'Revenue',
    overallMateriality: 250000,
    performanceMateriality: 187500,
    trivialThreshold: 12500,
  },
  procedures: [
    { id: 'R1.1', fsli: 'Revenue', description: 'Cutoff testing — last 5 days sales', approach: 'Substantive', sampleSize: 25, itemsTested: 25, exceptions: 1, status: 'Complete', conclusion: 'Satisfactory — exception immaterial' },
    { id: 'R1.2', fsli: 'Revenue', description: 'Contract review — new contract types', approach: 'Substantive', sampleSize: 15, itemsTested: 15, exceptions: 0, status: 'Complete', conclusion: 'Satisfactory' },
    { id: 'R2.1', fsli: 'Trade Receivables', description: 'Circularisation — positive confirmations', approach: 'Substantive', sampleSize: 30, itemsTested: 28, exceptions: 2, status: 'Complete', conclusion: 'Satisfactory — replies agree' },
    { id: 'I1.1', fsli: 'Inventory', description: 'Stock count attendance', approach: 'Observation', sampleSize: 50, itemsTested: 50, exceptions: 3, status: 'Complete', conclusion: 'Minor count differences — immaterial' },
    { id: 'I1.2', fsli: 'Inventory', description: 'NRV testing — slow-moving items', approach: 'Substantive', sampleSize: 20, itemsTested: 20, exceptions: 1, status: 'Complete', conclusion: 'Write-down required £8,200' },
    { id: 'FA1.1', fsli: 'Fixed Assets', description: 'Additions — vouch to invoice', approach: 'Substantive', sampleSize: 10, itemsTested: 10, exceptions: 0, status: 'Complete', conclusion: 'Satisfactory' },
  ],
  findings: [
    { ref: 'F1', severity: 'Medium', description: 'Revenue cutoff: 1 invoice dated 2 April recorded in March', impact: '£42,000 overstatement', rootCause: 'Manual posting error', recommendation: 'Implement automated cutoff controls', managementResponse: 'Agreed — implementing in Q1 FY2027', status: 'Open' },
    { ref: 'F2', severity: 'Low', description: 'Inventory count sheet unsigned by supervisor', impact: 'Documentation gap', rootCause: 'Oversight during count', recommendation: 'Add supervisor sign-off to count procedures', managementResponse: 'Accepted', status: 'Closed' },
    { ref: 'F3', severity: 'Medium', description: 'NRV write-down required for obsolete inventory', impact: '£8,200 misstatement', rootCause: 'No periodic NRV review', recommendation: 'Implement quarterly NRV review process', managementResponse: 'Will implement from April 2026', status: 'Open' },
  ],
  trialBalance: [
    { code: '1000', name: 'Cash and Bank', openingBalance: 850000, adjustments: 120000, closingBalance: 970000 },
    { code: '1100', name: 'Trade Receivables', openingBalance: 1200000, adjustments: -50000, closingBalance: 1150000 },
    { code: '1200', name: 'Inventory', openingBalance: 680000, adjustments: -8200, closingBalance: 671800 },
    { code: '1300', name: 'Prepayments', openingBalance: 45000, adjustments: 5000, closingBalance: 50000 },
    { code: '2000', name: 'Trade Payables', openingBalance: -520000, adjustments: -30000, closingBalance: -550000 },
    { code: '2100', name: 'Accruals', openingBalance: -180000, adjustments: -15000, closingBalance: -195000 },
    { code: '2200', name: 'Tax Payable', openingBalance: -320000, adjustments: -40000, closingBalance: -360000 },
    { code: '3000', name: 'Share Capital', openingBalance: -100000, adjustments: 0, closingBalance: -100000 },
    { code: '3100', name: 'Retained Earnings', openingBalance: -1655000, adjustments: -18200, closingBalance: -1636800 },
  ],
};
```

### Output — Sheet Structure

```
┌──────────────────────────────────────────────────────────────┐
│ Sheet 1: COVER                                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  AUDIT WORKING PAPERS                                        │
│                                                              │
│  Client:       Phoenix Manufacturing Ltd                     │
│  Engagement:   Statutory Audit FY2026                        │
│  Year End:     31 March 2026                                 │
│  Prepared By:  Sarah Chen, ACA                               │
│  Date:         20/03/2026                                    │
│  Reviewed By:  James Walker, FCA                             │
│                                                              │
│  CONFIDENTIAL — This document contains privileged audit      │
│  working papers                                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Sheet 2: PLANNING                                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PLANNING WORKING PAPER                                      │
│                                                              │
│  Engagement Letter    Signed                                 │
│  Materiality Level    250000                                 │
│  Perf. Materiality    187500                                 │
│  Trivial Threshold    12500                                  │
│                                                              │
│  KEY PLANNING DECISIONS                                      │
│  ─────────────────────────────────────────────────           │
│  Revenue Recognition  │ Extended procedures  │ New contract  │
│  Going Concern        │ Standard procedures  │ Strong cash   │
│  Related Parties      │ Enhanced scrutiny    │ New sub Q2    │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Sheet 3: RISK ASSESSMENT                                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  RISK ASSESSMENT MATRIX                                                      │
│                                                                              │
│  FSLI / Area        │ Inherent │ Control │ Detection │ Combined │ Response   │
│  ───────────────────┼──────────┼─────────┼───────────┼──────────┼────────────│
│  Revenue            │ High     │ Medium  │ Low       │ Medium   │ Extended   │
│  Trade Receivables  │ Medium   │ Low     │ Medium    │ Low      │ Standard   │
│  Inventory          │ High     │ High    │ Low       │ High     │ Attend +   │
│  Trade Payables     │ Low      │ Low     │ High      │ Low      │ Analytical │
│  Fixed Assets       │ Medium   │ Medium  │ Medium    │ Medium   │ Verify     │
│  Payroll            │ Low      │ Low     │ High      │ Low      │ Analytical │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Sheet 4: MATERIALITY                                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  MATERIALITY CALCULATION                                     │
│                                                              │
│  Benchmark            │ Value      │ %   │ Materiality      │
│  ─────────────────────┼────────────┼─────┼──────────        │
│  Revenue              │ 15,000,000 │ 1%  │                  │
│  Total Assets         │ 8,500,000  │ 2%  │                  │
│  Profit Before Tax    │ 2,200,000  │ 5%  │                  │
│                                                              │
│  Selected Benchmark:       Revenue                           │
│  Overall Materiality:      250,000                           │
│  Performance Materiality:  187,500                           │
│  Trivial Threshold:        12,500                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Sheet 5: PROCEDURES                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  AUDIT PROCEDURES                                                                            │
│                                                                                              │
│  Ref   │ FSLI            │ Description           │ Approach    │ Sample │ Tested │ Exc │ ... │
│  ──────┼─────────────────┼───────────────────────┼─────────────┼────────┼────────┼─────┼─────│
│  R1.1  │ Revenue         │ Cutoff testing        │ Substantive │ 25     │ 25     │ 1   │ ... │
│  R1.2  │ Revenue         │ Contract review       │ Substantive │ 15     │ 15     │ 0   │ ... │
│  R2.1  │ Trade Recv.     │ Circularisation       │ Substantive │ 30     │ 28     │ 2   │ ... │
│  I1.1  │ Inventory       │ Stock count           │ Observation │ 50     │ 50     │ 3   │ ... │
│  I1.2  │ Inventory       │ NRV testing           │ Substantive │ 20     │ 20     │ 1   │ ... │
│  FA1.1 │ Fixed Assets    │ Additions vouch       │ Substantive │ 10     │ 10     │ 0   │ ... │
│                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Sheet 6: FINDINGS                                                                                  │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                    │
│  AUDIT FINDINGS                                                                                    │
│                                                                                                    │
│  Ref │ Severity │ Description            │ Impact         │ Root Cause  │ Recommendation │ Status  │
│  ────┼──────────┼────────────────────────┼────────────────┼─────────────┼────────────────┼─────────│
│  F1  │ Medium   │ Revenue cutoff: 1 inv  │ £42k overstate │ Manual err  │ Auto cutoff    │ Open    │
│  F2  │ Low      │ Count sheet unsigned   │ Doc gap        │ Oversight   │ Add sign-off   │ Closed  │
│  F3  │ Medium   │ NRV write-down needed  │ £8.2k misstat  │ No NRV rev  │ Quarterly rev  │ Open    │
│                                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Sheet 7: TRIAL BALANCE                                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TRIAL BALANCE SUMMARY                                                       │
│                                                                              │
│  Account Code │ Account Name        │ Debit      │ Credit     │ Notes        │
│  ─────────────┼─────────────────────┼────────────┼────────────┼──────        │
│  1000         │ Cash and Bank       │ 970,000    │ 0          │              │
│  1100         │ Trade Receivables   │ 1,150,000  │ 0          │              │
│  1200         │ Inventory           │ 671,800    │ 0          │              │
│  1300         │ Prepayments         │ 50,000     │ 0          │              │
│  2000         │ Trade Payables      │ 0          │ 550,000    │              │
│  2100         │ Accruals            │ 0          │ 195,000    │              │
│  2200         │ Tax Payable         │ 0          │ 360,000    │              │
│  3000         │ Share Capital       │ 0          │ 100,000    │              │
│  3100         │ Retained Earnings   │ 0          │ 1,636,800  │              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Excel — Phase Export

### `auditExcelExportService.exportPhase('interim', interimData, engagement)`

**Input:**
```javascript
const interimData = {
  controls: [
    { name: 'Sales order approval', objective: 'Authorisation of sales', designEffective: true, operatingEffective: true, exceptions: 0, conclusion: 'Effective' },
    { name: 'Bank reconciliation', objective: 'Completeness of cash', designEffective: true, operatingEffective: true, exceptions: 0, conclusion: 'Effective' },
    { name: 'Goods received notes', objective: 'Completeness of payables', designEffective: true, operatingEffective: false, exceptions: 2, conclusion: 'Ineffective — extend substantive' },
    { name: 'Access controls — ERP', objective: 'Integrity of data', designEffective: true, operatingEffective: true, exceptions: 0, conclusion: 'Effective' },
    { name: 'Journal entry approval', objective: 'Prevent unauthorised entries', designEffective: true, operatingEffective: true, exceptions: 1, conclusion: 'Effective — exception immaterial' },
  ],
};
```

### Output

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Sheet: CONTROL TESTING RESULTS                                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  Control              │ Objective          │ Design │ Operating │ Exceptions │ Conclusion     │
│  ─────────────────────┼────────────────────┼────────┼───────────┼────────────┼────────────    │
│  Sales order approval │ Auth of sales      │ Yes    │ Yes       │ 0          │ Effective      │
│  Bank reconciliation  │ Completeness cash  │ Yes    │ Yes       │ 0          │ Effective      │
│  Goods received notes │ Completeness AP    │ Yes    │ No        │ 2          │ Ineffective    │
│  Access controls ERP  │ Integrity of data  │ Yes    │ Yes       │ 0          │ Effective      │
│  Journal approval     │ Prevent unauth     │ Yes    │ Yes       │ 1          │ Effective      │
│                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Excel — Trial Balance Export

### `auditExcelExportService.exportTrialBalance(trialBalance, engagement)`

**Output — with variance column:**

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ TRIAL BALANCE                                                                        │
│ Client: Phoenix Manufacturing Ltd          Year End: 31 March 2026                   │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  Account Code │ Account Name       │ Opening     │ Adjustments │ Closing     │ Var   │
│  ─────────────┼────────────────────┼─────────────┼─────────────┼─────────────┼───────│
│  1000         │ Cash and Bank      │ 850,000     │ 120,000     │ 970,000     │ +120k │
│  1100         │ Trade Receivables  │ 1,200,000   │ (50,000)    │ 1,150,000   │ -50k  │
│  1200         │ Inventory          │ 680,000     │ (8,200)     │ 671,800     │ -8.2k │
│  1300         │ Prepayments        │ 45,000      │ 5,000       │ 50,000      │ +5k   │
│  2000         │ Trade Payables     │ (520,000)   │ (30,000)    │ (550,000)   │ -30k  │
│  2100         │ Accruals           │ (180,000)   │ (15,000)    │ (195,000)   │ -15k  │
│  2200         │ Tax Payable        │ (320,000)   │ (40,000)    │ (360,000)   │ -40k  │
│  3000         │ Share Capital      │ (100,000)   │ 0           │ (100,000)   │ 0     │
│  3100         │ Retained Earnings  │ (1,655,000) │ (18,200)    │ (1,636,800) │ +18.2k│
│  ─────────────┼────────────────────┼─────────────┼─────────────┼─────────────┼───────│
│               │ TOTAL              │ 0           │ (36,400)    │ 0           │       │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Word — Audit Report

### `auditWordExportService.exportAuditReport(engagement, reportData)`

**Input:**
```javascript
const reportData = {
  opinionType: 'Unmodified',
  opinion: 'In our opinion, the financial statements give a true and fair view of the state of Phoenix Manufacturing Ltd\'s affairs as at 31 March 2026 and of its profit for the year then ended.',
  basisForOpinion: 'We conducted our audit in accordance with ISAs (UK). We are independent per the FRC Ethical Standard.',
  goingConcern: 'No material uncertainty identified',
  materialMisstatements: 'None',
  keyAuditMatters: [
    {
      title: 'Revenue Recognition — New Contract Types',
      description: 'Phoenix introduced three new contract types in FY2026 with variable consideration elements. Revenue from these contracts totalled £3.2m (21% of revenue).',
      response: 'We tested a sample of 15 contracts against IFRS 15 step model, verified variable consideration estimates, and tested cutoff at year end.',
    },
    {
      title: 'Inventory Valuation — Obsolescence',
      description: 'Inventory of £671,800 includes £52,000 of slow-moving items over 12 months old. Management applies a provisioning policy based on ageing.',
      response: 'We tested the ageing analysis, verified NRV for a sample of 20 slow-moving items, and assessed the adequacy of the £8,200 write-down.',
    },
  ],
  findings: [
    { ref: 'F1', severity: 'Medium', description: 'Revenue cutoff misstatement (£42,000)', recommendation: 'Implement automated cutoff controls' },
    { ref: 'F3', severity: 'Medium', description: 'NRV write-down (£8,200) not booked until audit', recommendation: 'Quarterly NRV review process' },
  ],
  conclusion: 'Based on procedures performed, we obtained sufficient appropriate audit evidence to form our unmodified opinion.',
};
```

### Output — Document Structure

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              INDEPENDENT AUDITOR'S REPORT                    │
│                                                              │
│             Phoenix Manufacturing Ltd                        │
│         For the Year Ended 31 March 2026                     │
│                                                              │
│           Prepared by: [Firm Name]                           │
│              Date: 20/03/2026                                │
│                                                              │
│                  CONFIDENTIAL                                │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Table of Contents                                           │
│  1. Executive Summary                                        │
│  2. Audit Opinion                                            │
│  3. Key Audit Matters                                        │
│  4. Findings & Recommendations                               │
│  5. Conclusion                                               │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. EXECUTIVE SUMMARY                                        │
│                                                              │
│  This report presents the results of our audit of            │
│  Phoenix Manufacturing Ltd for the financial year ended      │
│  31 March 2026.                                              │
│                                                              │
│  Opinion Type: Unmodified                                    │
│  Material Misstatements: None                                │
│  Going Concern: No material uncertainty identified           │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  2. AUDIT OPINION                                            │
│                                                              │
│  In our opinion, the financial statements give a true        │
│  and fair view of the state of Phoenix Manufacturing         │
│  Ltd's affairs as at 31 March 2026 and of its profit         │
│  for the year then ended.                                    │
│                                                              │
│  Basis for Opinion                                           │
│  We conducted our audit in accordance with ISAs (UK).        │
│  We are independent per the FRC Ethical Standard.            │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  3. KEY AUDIT MATTERS                                        │
│                                                              │
│  Key audit matters are those matters that, in our            │
│  professional judgment, were of most significance.           │
│                                                              │
│  3.1 Revenue Recognition — New Contract Types                │
│  Phoenix introduced three new contract types in              │
│  FY2026 with variable consideration elements.                │
│  Revenue from these contracts totalled £3.2m.                │
│                                                              │
│  Our Response: We tested a sample of 15 contracts            │
│  against IFRS 15 step model, verified variable               │
│  consideration estimates, and tested cutoff.                 │
│                                                              │
│  3.2 Inventory Valuation — Obsolescence                      │
│  Inventory of £671,800 includes £52,000 of                   │
│  slow-moving items over 12 months old.                       │
│                                                              │
│  Our Response: We tested the ageing analysis,                │
│  verified NRV for 20 slow-moving items, and                  │
│  assessed the £8,200 write-down adequacy.                    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  4. FINDINGS & RECOMMENDATIONS                               │
│                                                              │
│  ┌─────┬──────────┬────────────────────┬─────────────────┐   │
│  │ Ref │ Severity │ Finding            │ Recommendation  │   │
│  ├─────┼──────────┼────────────────────┼─────────────────┤   │
│  │ F1  │ Medium   │ Revenue cutoff     │ Auto cutoff     │   │
│  │     │          │ misstatement £42k  │ controls        │   │
│  ├─────┼──────────┼────────────────────┼─────────────────┤   │
│  │ F3  │ Medium   │ NRV write-down     │ Quarterly NRV   │   │
│  │     │          │ £8,200 not booked  │ review process  │   │
│  └─────┴──────────┴────────────────────┴─────────────────┘   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  5. CONCLUSION                                               │
│                                                              │
│  Based on procedures performed, we obtained sufficient       │
│  appropriate audit evidence to form our unmodified           │
│  opinion.                                                    │
│                                                              │
│  This report is made solely to the company's members,        │
│  as a body, in accordance with applicable legislation.       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Output filename:** `Phoenix Manufacturing Ltd_Report_20260320.docx`

---

## 5. Word — Engagement Letter

### `auditWordExportService.exportEngagementLetter(engagement)`

### Output — Document Structure

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ENGAGEMENT LETTER                                           │
│                                                              │
│  Date: 20/03/2026                                            │
│  To: The Board of Directors                                  │
│  Phoenix Manufacturing Ltd                                   │
│                                                              │
│  Re: Audit Engagement for the Year Ended 31 March 2026       │
│                                                              │
│  Dear Sirs/Madams,                                           │
│                                                              │
│  We are pleased to confirm our acceptance and                │
│  understanding of the terms of the audit engagement          │
│  for Phoenix Manufacturing Ltd for the financial year        │
│  ended 31 March 2026.                                        │
│                                                              │
│  OBJECTIVE AND SCOPE                                         │
│  We will conduct our audit in accordance with                │
│  International Standards on Auditing (UK) (ISAs (UK)).       │
│  Those standards require that we comply with ethical          │
│  requirements and plan and perform the audit to obtain       │
│  reasonable assurance about whether the financial            │
│  statements are free from material misstatement.             │
│                                                              │
│  RESPONSIBILITIES                                            │
│  An audit involves performing procedures to obtain           │
│  audit evidence about the amounts and disclosures            │
│  in the financial statements.                                │
│                                                              │
│  FEES                                                        │
│  The estimated fees for this engagement are                  │
│  [To be agreed].                                             │
│                                                              │
│  Yours faithfully,                                           │
│  [Firm Name]                                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Output filename:** `Phoenix Manufacturing Ltd_Engagement_Letter_20260320.docx`

---

## 6. Word — Management Letter

### `auditWordExportService.exportManagementLetter(engagement, findings)`

### Output — Document Structure

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  MANAGEMENT LETTER                                           │
│                                                              │
│  Client: Phoenix Manufacturing Ltd                           │
│  Year End: 31 March 2026                                     │
│  Date: 20/03/2026                                            │
│                                                              │
│  INTRODUCTION                                                │
│  During the course of our audit, we identified               │
│  certain matters that we wish to bring to your               │
│  attention.                                                  │
│                                                              │
│  Finding 1: Revenue cutoff: 1 invoice dated 2 April          │
│  recorded in March                                           │
│  Severity: Medium                                            │
│  ...                                                         │
│  Impact: £42,000 overstatement                               │
│  Recommendation: Implement automated cutoff controls         │
│  Management Response: Agreed — implementing Q1 FY2027        │
│                                                              │
│  Finding 2: Inventory count sheet unsigned                    │
│  Severity: Low                                               │
│  ...                                                         │
│                                                              │
│  Finding 3: NRV write-down required                          │
│  Severity: Medium                                            │
│  ...                                                         │
│                                                              │
│  CONCLUSION                                                  │
│  We would be pleased to discuss any of the matters           │
│  raised in this letter at your convenience.                  │
│                                                              │
│  Yours faithfully,                                           │
│  [Firm Name]                                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Output filename:** `Phoenix Manufacturing Ltd_Management_Letter_20260320.docx`

---

## 7. Word — Phase Narrative

### `auditWordExportService.exportPhaseNarrative('final', phaseData, engagement)`

### Output — Document Structure

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  FINAL — WORKING PAPER NARRATIVE                             │
│                                                              │
│  Client: Phoenix Manufacturing Ltd                           │
│  Year End: 31 March 2026                                     │
│  Phase: final                                                │
│  Prepared: 20/03/2026                                        │
│                                                              │
│  OBJECTIVE                                                   │
│  Complete final audit phase procedures per ISA               │
│  requirements. Obtain sufficient appropriate audit           │
│  evidence for each material FSLI.                            │
│                                                              │
│  WORK PERFORMED                                              │
│  • Revenue cutoff testing — last 5 days                      │
│  • Contract review — new types                               │
│  • Trade receivables circularisation                         │
│  • Stock count attendance                                    │
│  • NRV testing — slow-moving items                           │
│  • Fixed asset additions — vouch to invoice                  │
│                                                              │
│  CONCLUSION                                                  │
│  Based on the procedures performed, no material              │
│  issues were identified.                                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Output filename:** `Phoenix Manufacturing Ltd_final_WP_20260320.docx`

---

## UI Component — AuditExportControls

### Visual Layout

```
┌──────────────────────────────────────────────┐
│  Export Working Papers                        │
│  Generate ISA-compliant audit documents       │
│                                               │
│  EXCEL EXPORTS                                │
│  ┌──────────────────────────────────────────┐ │
│  │ 📊  Full Working Papers                  │ │
│  │     All phases in one workbook            │ │
│  ├──────────────────────────────────────────┤ │
│  │ 📋  Phase Working Paper                  │ │
│  │     Current phase only                    │ │
│  ├──────────────────────────────────────────┤ │
│  │ 📈  Trial Balance                        │ │
│  │     TB with adjustments                   │ │
│  └──────────────────────────────────────────┘ │
│                                               │
│  WORD EXPORTS                                 │
│  ┌──────────────────────────────────────────┐ │
│  │ 📄  Audit Report                         │ │
│  │     ISA 700 audit opinion                 │ │
│  ├──────────────────────────────────────────┤ │
│  │ ✉️  Engagement Letter                    │ │
│  │     ISA 210 engagement terms              │ │
│  ├──────────────────────────────────────────┤ │
│  │ 📝  Management Letter                    │ │
│  │     Findings & recommendations            │ │
│  ├──────────────────────────────────────────┤ │
│  │ 📃  Phase Narrative                      │ │
│  │     Phase working paper narrative         │ │
│  └──────────────────────────────────────────┘ │
│                                               │
│  ┌──────────────────────────────────────────┐ │
│  │ ✓ Exported: Phoenix_Report_20260320.docx │ │
│  │   at 14:32:15                             │ │
│  └──────────────────────────────────────────┘ │
│                                               │
└──────────────────────────────────────────────┘
```

### States

**During export:**
```
│  │ ⏳  Exporting...                         │ │
│  │     ISA 700 audit opinion                 │ │
```
All other buttons disabled.

**On error:**
```
│  ┌──────────────────────────────────────────┐ │
│  │ Export failed: Cannot read properties     │ │
│  │ of undefined (reading 'clientName')       │ │
│  └──────────────────────────────────────────┘ │
```
