---
name: audit-workpaper-engine
description: Generate ISA-compliant audit workpapers, risk assessments, materiality calculations, analytical procedures, and audit conclusions as polished documents. Trigger whenever the user mentions audit workpapers, ISA standards, materiality, risk assessment, analytical review, going concern, audit opinions, planning memos, completion memos, control testing, or any statutory audit documentation. Also trigger for casual phrasing like "write up the risk assessment", "document the testing", "prepare the audit file", "draft the completion memo", "group audit consolidation", "bank confirmation", "bank statement review", or "build the audit file". Covers UK statutory audit (FRS 102, Companies Act 2006), IFRS, ISA (UK), SOX/ICFR documentation, internal audit workpapers, financial controls testing, group audit and consolidation (ISA 600), and bank statement analysis. Also trigger for integrated workbook requests like "V12 workbook", "all in one audit file", or "full audit Excel".
---

# Audit Workpaper Engine

Generate professional, ISA compliant audit workpapers and documentation that are ready for review and sign off. All outputs use generic demo entities only (never real client or firm names).

## Core Principles

1. **ISA Compliance First**: Every workpaper references the specific ISA standard it addresses (ISA 315 for risk assessment, ISA 320 for materiality, ISA 520 for analytical procedures, ISA 570 for going concern, ISA 600 for group audits, ISA 240 for fraud). Include the standard reference in the document header.

2. **Professional Judgement Trail**: Audit documentation exists to evidence professional judgement. Every conclusion must have a clear "because" with the reasoning chain from evidence to conclusion explicit and traceable.

3. **Generic Entities Only**: Use "Indus Nexus Limited" as the primary demo entity and "ABC Company" as the secondary fallback. Never use real client names, firm names, or any identifying information from actual engagements. Christiansons, EIM Learning UK Ltd, and Huge UK Ltd must never appear in any output.

4. **UK Statutory Audit Default**: Unless specified otherwise, assume UK statutory audit under FRS 102 / Companies Act 2006 / ISA (UK). For small entities, default to FRS 102 Section 1A. Adapt for full IFRS or US GAAP only when explicitly requested.

5. **No Setup Required**: All outputs must be usable immediately with no developer knowledge, no configuration, and no dependencies. Deliver as .docx, .xlsx, or rendered React/.html artifacts.

6. **Cross Reference Integrity**: Every workpaper must reference related workpapers where applicable (materiality feeds into risk assessment, risk assessment drives audit response, completion memo references all prior workpapers).

## Workpaper Types

When the user requests audit documentation, identify which workpaper type they need and follow the corresponding template structure. If ambiguous, default to the most likely match based on context.

### 1. Planning and Materiality (ISA 300, ISA 320)

**Trigger phrases**: "materiality calculation", "planning memo", "audit strategy", "overall materiality", "performance materiality", "trivial threshold"

**Structure**:
```
HEADER: [Entity] | [Period End] | ISA 300/320 | Prepared by: [Initials] | Date: [Date]

1. ENGAGEMENT OVERVIEW
   - Entity background (nature, size, industry, ownership)
   - Reporting framework (FRS 102 / FRS 102 Section 1A / IFRS)
   - Statutory requirements (Companies Act 2006 s.475, s.495 to s.497)
   - Ethical and independence confirmation (ICAEW/ACCA Code)
   - Engagement letter reference and terms

2. MATERIALITY DETERMINATION
   - Benchmark selected (revenue / total assets / PBT / net assets / gross profit)
   - Justification for benchmark choice
   - Percentage applied with reasoning
   - Overall materiality calculation
   - Performance materiality (typically 60 to 85% of overall, state reasoning for % chosen)
   - Clearly trivial threshold (typically 5% of overall)
   - Prior year comparison and movement analysis
   - Revision considerations (interim vs final materiality)

3. KEY AUDIT MATTERS
   - Significant risks identified at planning
   - Areas requiring special audit consideration
   - Related party considerations (ISA 550)
   - Accounting estimates requiring judgement (ISA 540)

4. AUDIT APPROACH
   - Combined / substantive approach rationale
   - Reliance on controls (if any, link to ISA 330)
   - Group audit considerations (if applicable, link to ISA 600)
   - Use of experts (ISA 620)
   - Technology and data analytics planned

5. CONCLUSION
   - Sign off: Prepared by / Reviewed by / Date
```

### 2. Risk Assessment (ISA 315 Revised 2019)

**Trigger phrases**: "risk assessment", "risk matrix", "significant risk", "risk of material misstatement", "inherent risk", "control risk", "spectrum of inherent risk"

**Structure**:
```
HEADER: [Entity] | [Period End] | ISA 315 (Revised 2019) | Prepared by: [Initials] | Date: [Date]

1. UNDERSTANDING THE ENTITY AND ITS ENVIRONMENT
   - Industry and regulatory environment
   - Nature of the entity (ownership, governance, structure)
   - Applicable financial reporting framework
   - Accounting policies and their application
   - Entity objectives, strategies, and business risks
   - Performance measures and review

2. UNDERSTANDING THE ENTITY'S SYSTEM OF INTERNAL CONTROL
   - Control environment assessment
   - Entity's risk assessment process
   - Entity's process to monitor the system of internal control
   - Information system and communication
   - Control activities relevant to the audit
   - Identification of controls relevant to the audit (ISA 315.26)
   - IT environment and general IT controls

3. INHERENT RISK ASSESSMENT (using spectrum of inherent risk)
   For each financial statement area and assertion:
   - Inherent risk factors: complexity, subjectivity, change, uncertainty, susceptibility to misstatement
   - Assessment on the spectrum (higher end / lower end)
   - Whether the assessed risk is a significant risk
   - Rationale documented for each assessment

4. CONTROL RISK ASSESSMENT
   - Whether controls are to be tested
   - If yes, preliminary assessment of control risk
   - If no, rationale for purely substantive approach

5. FRAUD RISK ASSESSMENT (ISA 240)
   - Revenue recognition presumption (rebutted? with reasoning)
   - Management override of controls (cannot be rebutted)
   - Other identified fraud risks
   - Fraud risk factors (incentive/pressure, opportunity, rationalisation)
   - Fraud discussion minutes reference

6. RESPONSE TO ASSESSED RISKS (ISA 330)
   - Overall audit response to assessed risks at financial statement level
   - Further audit procedures mapped to each significant risk
   - Nature, timing, and extent of procedures
   - Link to audit programme sections

7. CONCLUSION
   - Sign off block
```

### 3. Analytical Procedures (ISA 520)

**Trigger phrases**: "analytical review", "analytical procedures", "trend analysis", "ratio analysis", "substantive analytics", "flux analysis"

**Structure**:
```
HEADER: [Entity] | [Period End] | ISA 520 | Prepared by: [Initials] | Date: [Date]

1. PURPOSE AND SCOPE
   - Stage of audit (planning / substantive / overall review)
   - Financial statement areas covered

2. EXPECTATION DEVELOPMENT
   - Data sources used (prior year, budgets, industry data, management accounts)
   - Method of developing expectation (trend, ratio, regression, proof in total)
   - Threshold for investigation (link to materiality / performance materiality)
   - Reliability of data underlying the expectation

3. COMPARISON AND ANALYSIS
   For each line item / area:
   - Current year balance
   - Expected balance and basis
   - Difference (absolute and %)
   - Whether difference exceeds threshold
   - Investigation findings (if applicable)
   - Corroborating evidence obtained
   - Conclusion on whether the balance is consistent with expectation

4. RATIO ANALYSIS
   - Profitability ratios (gross margin, net margin, ROCE)
   - Liquidity ratios (current ratio, quick ratio)
   - Gearing ratios (debt to equity, interest cover)
   - Efficiency ratios (receivable days, payable days, inventory days)
   - Year on year movement analysis
   - Industry comparison (if available)

5. OVERALL ANALYTICAL REVIEW (ISA 520.6, completion stage)
   - Whether the financial statements are consistent with the auditor's understanding
   - Identification of any previously unrecognised risks of material misstatement
   - Need for additional procedures

6. CONCLUSION
   - Whether analytical procedures identify risks of material misstatement
   - Impact on further audit procedures
   - Sign off block
```

### 4. Going Concern Assessment (ISA 570 Revised)

**Trigger phrases**: "going concern", "ISA 570", "viability", "cash flow forecast", "material uncertainty", "MURGC", "basis of preparation"

**Structure**:
```
HEADER: [Entity] | [Period End] | ISA 570 (Revised) | Prepared by: [Initials] | Date: [Date]

1. MANAGEMENT'S ASSESSMENT
   - Has management made a going concern assessment?
   - Period covered by management's assessment (minimum 12 months from balance sheet date)
   - Basis for management's conclusion
   - Quality and completeness of information relied upon
   - Forecasts/projections reviewed (cash flow, P&L, balance sheet)
   - Key assumptions underpinning the assessment

2. EVENTS AND CONDITIONS INDICATING DOUBT
   Financial indicators:
   - Net liability/current liability position
   - Adverse key financial ratios
   - Inability to pay creditors on due dates
   - Borrowing facility approaching expiry without realistic prospect of renewal
   - Significant losses from operations
   Operating indicators:
   - Loss of key management/staff/customers/suppliers
   - Labour difficulties or shortages of key inputs
   - Emergence of successful competitor
   Other indicators:
   - Non compliance with capital or regulatory requirements
   - Pending legal or regulatory proceedings
   - Changes in legislation or government policy

3. AUDITOR'S EVALUATION
   - Evaluation of management's assessment: adequate or inadequate
   - Period beyond management's assessment considered
   - Additional audit procedures performed
   - Sensitivity analysis on key assumptions
   - Subsequent events review (ISA 560)
   - Written representations obtained (ISA 580)

4. CONCLUSION AND REPORTING IMPACT
   - Going concern basis appropriate: Yes / No
   - Material uncertainty exists: Yes / No
   - If material uncertainty: adequate disclosure in financial statements?
   - Impact on auditor's report:
     a) No material uncertainty: unmodified, no emphasis of matter
     b) Material uncertainty, adequately disclosed: unmodified with "Material Uncertainty Related to Going Concern" section
     c) Material uncertainty, inadequately disclosed: qualified or adverse opinion
     d) Going concern basis inappropriate: adverse opinion
   - Sign off block
```

### 5. Audit Completion Memo

**Trigger phrases**: "completion memo", "audit summary", "wrap up", "final review", "opinion memo", "clearance meeting"

**Structure**:
```
HEADER: [Entity] | [Period End] | Completion Memo | Prepared by: [Initials] | Date: [Date]

1. ENGAGEMENT SUMMARY
   - Entity and period
   - Audit team and key contacts
   - Dates: fieldwork start, fieldwork end, clearance meeting, signing date
   - Reporting framework and applicable standards

2. MATERIALITY
   - Final materiality (confirm or revise from planning)
   - Performance materiality
   - Trivial threshold
   - Summary of unadjusted misstatements vs trivial and materiality thresholds

3. SIGNIFICANT RISKS AND CONCLUSIONS
   For each significant risk identified at planning:
   - Risk description
   - Procedures performed
   - Evidence obtained
   - Conclusion

4. KEY AREAS OF JUDGEMENT
   - Revenue recognition
   - Accounting estimates
   - Going concern (cross reference ISA 570 workpaper)
   - Related party transactions
   - Subsequent events (ISA 560)

5. MISSTATEMENTS
   - Adjusted misstatements (schedule)
   - Unadjusted misstatements (schedule with management response)
   - Effect of unadjusted misstatements individually and in aggregate
   - Management representation on unadjusted misstatements

6. INDEPENDENCE AND ETHICS
   - Confirmation of independence throughout engagement
   - Any threats identified and safeguards applied
   - Fee arrangements

7. COMMUNICATION WITH THOSE CHARGED WITH GOVERNANCE (ISA 260)
   - Matters communicated
   - Method and timing of communication
   - Management letter points (if any)

8. AUDIT OPINION
   - Proposed opinion: unmodified / qualified / adverse / disclaimer
   - Basis for opinion
   - Emphasis of matter / other matter paragraphs (if any)
   - Key audit matters (if applicable, PIE entities)

9. CONCLUSION AND SIGN OFF
   - Engagement partner review and approval
   - Prepared by / Reviewed by / Engagement Partner / Date
```

### 6. SOX / ICFR Documentation

**Trigger phrases**: "SOX testing", "ICFR", "control testing", "walkthrough", "design effectiveness", "operating effectiveness", "test of controls", "PCAOB", "material weakness", "significant deficiency"

**Structure**:
```
HEADER: [Entity] | [Period End] | SOX/ICFR | Control: [Control ID] | Prepared by: [Initials]

1. CONTROL DESCRIPTION
   - Control ID and title
   - Control objective
   - Process / sub process
   - Control frequency (daily/weekly/monthly/quarterly/annual)
   - Control type (preventive/detective)
   - Nature: manual / automated / IT dependent manual
   - Control owner and performer
   - Relevant financial statement assertion(s)

2. WALKTHROUGH DOCUMENTATION
   - Date of walkthrough
   - Personnel interviewed (name, title)
   - Transaction traced end to end
   - Information Processing Controls (IPCs) identified
   - Inputs, processing, outputs verified
   - Control points within the process confirmed
   - Walkthrough conclusion: control exists and is placed in operation

3. DESIGN EFFECTIVENESS (PCAOB AS 2201)
   - Control design adequately addresses the assessed risk: Yes / No
   - Evidence of design (screenshots, policy docs, system configurations)
   - Precision of the control (exact match, threshold, reasonableness)
   - Complementary controls identified
   - Gaps or design deficiencies identified

4. OPERATING EFFECTIVENESS
   - Testing methodology: inquiry, observation, inspection, re performance
   - Sample size determination and basis (PCAOB guidance: annual = 1, quarterly = 2, monthly = 2 to 3, weekly = 5, daily = 15 to 25)
   - Population description and completeness
   - Sample selection method (random, systematic, haphazard)
   - Test results (pass/fail for each sample item)
   - Exceptions identified and evaluated

5. DEFICIENCY EVALUATION
   - Deficiency description (if any)
   - Likelihood of misstatement (remote, reasonably possible, probable)
   - Magnitude of potential misstatement
   - Classification: deficiency / significant deficiency / material weakness
   - Compensating controls evaluation
   - Aggregation with other deficiencies

6. REMEDIATION TRACKING (if deficiency identified)
   - Remediation owner and timeline
   - Remediation action plan
   - Re testing date and approach
   - Status: open / in progress / closed

7. CONCLUSION
   - Control operating effectively: Yes / No / Partial
   - Sign off block
```

### 7. Group Audit and Consolidation (ISA 600 Revised)

**Trigger phrases**: "group audit", "consolidation", "component auditor", "ISA 600", "IFRS 10", "FRS 102 Section 9", "intercompany", "elimination", "group instructions"

**Structure**:
```
HEADER: [Group Entity] | [Period End] | ISA 600 (Revised) | Prepared by: [Initials] | Date: [Date]

1. GROUP STRUCTURE AND SCOPING
   - Group structure chart (parent, subsidiaries, associates, JVs)
   - Consolidation framework (IFRS 10 / FRS 102 Section 9)
   - List of components with classification:
     a) Significant components (full scope audit)
     b) Significant components (specific procedures)
     c) Non significant components (analytical procedures)
     d) Components not requiring further procedures
   - Basis for component significance assessment (% of group revenue, assets, PBT)
   - Group materiality and component materiality allocation

2. COMPONENT AUDITOR INVOLVEMENT
   - Component auditor firms identified
   - Competence, capabilities, and independence confirmed
   - Group instructions issued (date and scope)
   - Communication requirements (ISA 600.40 to .41)
   - Access to component auditor workpapers
   - Direction, supervision, and review plan

3. CONSOLIDATION PROCEDURES
   - Consolidation method (acquisition/merger)
   - Intercompany transactions: identification, reconciliation, and elimination
   - Intercompany balances at period end
   - Unrealised profit elimination
   - Goodwill and fair value adjustments
   - Foreign currency translation (closing rate method, functional currency)
   - Minority interest / non controlling interest calculation
   - Consistency of accounting policies across components
   - Alignment of reporting periods

4. GROUP LEVEL ANALYTICS
   - Consolidated vs aggregated component results
   - Intercompany elimination journals verified
   - Minority interest cross check
   - Group level journal entries review
   - Subsequent events across components

5. CONCLUSION
   - Whether sufficient appropriate audit evidence obtained for the group opinion
   - Unresolved matters from component auditors
   - Impact on group audit opinion
   - Sign off block
```

### 8. Bank Statement Analysis and Confirmation

**Trigger phrases**: "bank statement review", "bank confirmation", "bank analysis", "cash audit", "bank reconciliation", "bank letter"

**Structure**:
```
HEADER: [Entity] | [Period End] | Bank Procedures | Prepared by: [Initials] | Date: [Date]

1. BANK CONFIRMATION (ISA 505)
   - Bank(s) confirmed (name, account numbers, sort codes)
   - Confirmation sent date and method
   - Response received date
   - Balances confirmed vs balance per TB
   - Facilities confirmed (overdrafts, loans, charges, guarantees)
   - Discrepancies identified and resolved

2. BANK RECONCILIATION REVIEW
   - Period end bank reconciliation obtained from management
   - Reconciling items tested:
     a) Outstanding lodgements (cleared post year end?)
     b) Unpresented cheques (cleared post year end?)
     c) Other reconciling items (nature and validity)
   - Arithmetical accuracy confirmed
   - Agreed to cash book and nominal ledger

3. BANK STATEMENT ANALYSIS
   - Period covered (usually final month plus subsequent period)
   - Large or unusual transactions identified
   - Round sum transfers investigated
   - Related party payments identified
   - Cash flow patterns consistent with business operations
   - Payments to unknown or unusual counterparties flagged

4. SUBSEQUENT RECEIPTS AND PAYMENTS
   - Post year end receipts supporting receivable balances
   - Post year end payments supporting payable balances / accruals
   - Evidence of going concern (continued trading activity)

5. CONCLUSION
   - Bank balances correctly stated and complete
   - No undisclosed facilities or commitments
   - Sign off block
```

## Integrated Workbook Approach (V12 Model)

When the user requests a full audit file or "V12 workbook" or "integrated audit Excel", build a single Excel workbook with the following tab structure covering all ISA stages:

```
Tab 1:  MASTER INDEX (hyperlinked to all tabs)
Tab 2:  ENGAGEMENT ACCEPTANCE (ISA 210, ISA 220)
Tab 3:  PLANNING AND MATERIALITY (ISA 300, ISA 320)
Tab 4:  RISK ASSESSMENT (ISA 315, ISA 240)
Tab 5:  AUDIT PROGRAMME AND RESPONSE (ISA 330)
Tab 6:  SUBSTANTIVE TESTING SUMMARY
Tab 7:  ANALYTICAL PROCEDURES (ISA 520)
Tab 8:  GOING CONCERN (ISA 570)
Tab 9:  SUBSEQUENT EVENTS (ISA 560)
Tab 10: MISSTATEMENTS SCHEDULE
Tab 11: COMPLETION MEMO
Tab 12: OPINION AND REPORTING
```

Each tab must include: entity name, period end, ISA reference, preparer initials, review initials, and date fields. Materiality figures auto populate from Tab 3 across all subsequent tabs. Risk assessments on Tab 4 link to audit procedures on Tab 5.

## Output Format Rules

1. **For .docx outputs**: Use the docx skill. Include a professional header on every page with entity name, period end, ISA reference, and preparer initials. Use a table of contents for documents longer than 3 pages. Apply consistent formatting (Calibri 11pt body, Calibri 14pt bold headings).

2. **For React/HTML outputs**: Build interactive workpapers with input fields, auto calculations (materiality percentages, sample sizes), and a print/export function. Use clean professional styling with CSS variables for theming.

3. **For .xlsx outputs**: Use the xlsx skill. Include a summary sheet, detailed calculation sheets, and cross references. Lock formula cells and protect structure. Use conditional formatting for risk ratings (red = high, amber = medium, green = low).

## Quality Checklist

Before finalising any workpaper, verify:
- ISA standard reference in header
- Generic entity names only (Indus Nexus Limited / ABC Company)
- Clear conclusion with professional judgement rationale
- Prepared by / Reviewed by / Date sign off block
- Cross references to other workpapers where relevant
- No real client or firm names anywhere in the output
- Materiality figures are internally consistent across documents
- Risk assessments link to planned audit responses
- FRS 102 section references cited where applicable (Section 1A for small entities)
- Going concern conclusion explicitly stated

## Working with Multiple Workpapers

When the user requests a full audit file or multiple workpapers:
1. Establish the entity profile first (industry, size, period end, framework)
2. Set materiality as the anchor: all other workpapers reference this
3. Build risk assessment next: this drives the audit approach
4. Generate remaining workpapers with consistent cross references
5. Deliver as a structured set with a master index

## Adapting to Frameworks

| Framework | Key Differences |
|-----------|----------------|
| FRS 102 (UK) | Reduced disclosure, Section 1A for small entities, no OCI recycling for some items, s.444 to s.447 filing requirements |
| FRS 102 Section 1A | Micro and small entity regime, abridged accounts option, reduced notes, s.477 audit exemption threshold |
| IFRS | Full disclosure, IFRS 9 expected credit loss, IFRS 15 revenue, IFRS 16 leases, IAS 1 presentation |
| US GAAP | ASC codification, different lease classification (ASC 842), CECL model (ASC 326), revenue (ASC 606) |
| SOX/ICFR | Control focused, top down risk assessment, PCAOB AS 2201, material weakness vs significant deficiency classification |

## Example Interaction

**User says**: "Generate a materiality workpaper for a mid size UK retail company with £12m revenue"

**Skill does**:
1. Creates a .docx (or interactive React artifact) with ISA 320 header
2. Uses "Indus Nexus Limited" as entity name
3. Selects revenue as benchmark (appropriate for retail where profitability varies)
4. Applies 1.5% = £180,000 overall materiality (mid range for established retail)
5. Sets performance materiality at 75% = £135,000 (no prior year misstatements, stable entity)
6. Sets trivial threshold at 5% = £9,000
7. Includes prior year comparison section (left blank for user to complete)
8. Notes FRS 102 as reporting framework, flags Section 1A eligibility check
9. Adds sign off block
10. Delivers as polished, print ready document
