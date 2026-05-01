// ═══════════════════════════════════════════════════════════════════════════════
// AdditionalWPs.js — Data structures for Working Papers missing from the
// main WPS array in AuditEngine_AURA.jsx
//
// Missing WPs identified:
//   B4  — Entity-Level Controls Assessment (ISA 315.14–21, COSO framework)
//   D17 — Journal Entry Testing (ISA 240.32(a)) — standalone WP
//   D18 — Analytical Procedures — Substantive (ISA 520)
//   F3  — Engagement Completion Letter to Management
//   F4  — Audit Committee Report (ISA 260)
//
// Already covered (NOT duplicated):
//   A3  — Audit Strategy (ISA 300) — exists; independence is part of A2 acceptance
//   A5  — Understanding the Entity (ISA 315) — exists
//   A8  — Analytical Review Planning (ISA 520) — exists
//   A9  — Laws & Regulations (ISA 250) — exists, covers both 250A and 250B
//   B3  — Significant Risks (ISA 315.28) — exists
//   E2  — Final Analytical Review (ISA 520.6) — exists
//   E3  — Subsequent Events (ISA 560) — exists
//   E5  — Summary of Adjustments (ISA 450) — exists
// ═══════════════════════════════════════════════════════════════════════════════

// ─── B4: Entity-Level Controls Assessment ────────────────────────────────────

export const ENTITY_LEVEL_CONTROLS = [
  {
    item: "Control environment — tone at the top",
    isa: "ISA 315.14(a); COSO Principle 1–5",
    guidance: "Evaluate whether management and those charged with governance demonstrate integrity and ethical values. Consider the entity's code of conduct, whistleblowing policy, and disciplinary procedures. Assess whether the control environment creates the discipline and structure for all other components of internal control.",
    evidence: "Board minutes; code of conduct / ethics policy; whistleblowing records; organisational chart; HR policies and disciplinary procedures"
  },
  {
    item: "Governance structure and oversight responsibilities",
    isa: "ISA 315.14(a); ISA 260.A1",
    guidance: "Assess the composition and effectiveness of those charged with governance (TCWG). Consider independence of non-executive directors, frequency of board and committee meetings, and whether TCWG exercise effective oversight of financial reporting and internal controls.",
    evidence: "Board composition and terms of reference; meeting attendance records; minutes of board and audit committee meetings"
  },
  {
    item: "Commitment to competence and human resources policies",
    isa: "ISA 315.14(a); COSO Principle 4",
    guidance: "Evaluate whether the entity has appropriate policies for recruitment, training, mentoring, and retention of competent personnel in financial reporting roles. Consider whether job descriptions define requisite competencies and whether performance evaluations address internal control responsibilities.",
    evidence: "Organisational chart for finance function; job descriptions; training records; staff qualifications; performance appraisal documentation"
  },
  {
    item: "Assignment of authority and responsibility",
    isa: "ISA 315.14(a); COSO Principle 3",
    guidance: "Consider how the entity assigns authority and responsibility for operating activities and how reporting relationships and authorisation hierarchies are established. Assess whether there is appropriate segregation of duties and clearly defined delegation of authority limits.",
    evidence: "Delegation of authority matrix; authorisation limits schedule; segregation of duties matrix; bank mandate signatories"
  },
  {
    item: "Risk assessment process — entity's own process",
    isa: "ISA 315.15–16; COSO Principle 6–9",
    guidance: "Evaluate whether management has a process for identifying business risks relevant to financial reporting, estimating the significance of those risks, assessing the likelihood of their occurrence, and deciding upon actions to address them. For entities without a formal process, enquire of management whether business risks have been identified and how they have been addressed.",
    evidence: "Risk register / risk matrix; board risk assessment papers; strategic plan identifying key risks; insurance schedule"
  },
  {
    item: "Fraud risk assessment by the entity",
    isa: "ISA 315.16; ISA 240.15–17",
    guidance: "Determine whether management has a process for identifying and responding to the risks of fraud in the entity, including specific risks of fraud it has identified or account balances, classes of transactions, or disclosures for which a risk of fraud is likely to exist. Consider the entity's anti-fraud programme and controls.",
    evidence: "Fraud risk assessment documentation; anti-fraud policy; fraud reporting log; management override controls documentation"
  },
  {
    item: "Information system and communication relevant to financial reporting",
    isa: "ISA 315.18–19; COSO Principle 13–15",
    guidance: "Obtain an understanding of the information system including business processes relevant to financial reporting, accounting records and supporting information, and how the information system captures events and conditions significant to the financial statements. Assess the IT environment and its impact on internal control.",
    evidence: "System documentation; chart of accounts; accounting procedures manual; month-end close process documentation; IT environment summary"
  },
  {
    item: "General IT controls (GITC)",
    isa: "ISA 315.21; ISA 315.A116–A122",
    guidance: "Evaluate general IT controls that support the continued proper functioning of the information system. Assess access security (logical and physical), programme change management, programme development, and computer operations. Consider whether deficiencies in GITCs undermine the effectiveness of application controls.",
    evidence: "IT access control policies; user access reviews; change management logs; system administrator access listing; backup and recovery procedures; disaster recovery plan"
  },
  {
    item: "Access controls — user authentication and authorisation",
    isa: "ISA 315.A117–A118",
    guidance: "Assess whether access to systems and data is appropriately restricted to authorised individuals. Consider password policies, multi-factor authentication, periodic user access reviews, process for granting and removing access (joiners/movers/leavers), and privileged access management.",
    evidence: "User access listing for key systems; password policy; user access review documentation; privileged access log; joiners/movers/leavers process documentation"
  },
  {
    item: "Segregation of duties — system-enforced and manual",
    isa: "ISA 315.14(a); ISA 315.A100",
    guidance: "Evaluate whether segregation of duties is maintained between authorising transactions, recording transactions, and maintaining custody of assets. Consider whether the entity's IT systems enforce segregation through role-based access controls, and identify any potential conflicts of interest or incompatible duties.",
    evidence: "Segregation of duties matrix; role-based access control documentation; conflicting access report from ERP/accounting system; compensating controls documentation"
  },
  {
    item: "Monitoring of controls",
    isa: "ISA 315.22–23; COSO Principle 16–17",
    guidance: "Evaluate how the entity monitors the quality of internal control performance over time, including whether there is an internal audit function or equivalent monitoring activity. Consider management's process for evaluating control deficiencies identified and remediating them on a timely basis.",
    evidence: "Internal audit reports and management responses; management self-assessment of controls; control deficiency tracking log; remediation action plans"
  },
  {
    item: "Period-end financial reporting process",
    isa: "ISA 315.A106–A108",
    guidance: "Understand the period-end financial reporting process including procedures for entering transaction totals into the general ledger, procedures for making adjusting journal entries, procedures for preparing the financial statements and related disclosures, and controls over non-standard journal entries.",
    evidence: "Month-end / year-end close checklist; journal entry authorisation process; management review of financial statements; reconciliation procedures"
  },
  {
    item: "Anti-money laundering (AML) controls",
    isa: "ISA 250B; Proceeds of Crime Act 2002; Money Laundering Regulations 2017",
    guidance: "Assess the entity's anti-money laundering controls including customer due diligence procedures, suspicious activity reporting, staff training, and compliance with the Money Laundering, Terrorist Financing and Transfer of Funds Regulations 2017. Consider the adequacy of the entity's nominated officer arrangements.",
    evidence: "AML policy and procedures; customer due diligence records; suspicious activity reports (SARs) log; AML training records; nominated officer appointment"
  },
  {
    item: "Related party controls",
    isa: "ISA 550.14; ISA 315.14",
    guidance: "Evaluate the entity's controls over identifying, accounting for, and disclosing related party relationships and transactions. Consider whether the entity maintains a register of related parties, whether related party transactions require specific authorisation, and whether disclosures are complete.",
    evidence: "Related party register; board minutes approving related party transactions; related party policy; directors' interests declarations"
  },
  {
    item: "Accounting estimates controls",
    isa: "ISA 540.8(c); ISA 315.14",
    guidance: "Understand the entity's process for making accounting estimates including the methods, assumptions, and data used. Evaluate the controls over the estimation process and whether management has assessed the degree of estimation uncertainty. Consider whether management has used an expert.",
    evidence: "Estimation methodology documentation; data sources for key assumptions; management expert reports; sensitivity analysis documentation; historical accuracy of prior estimates"
  }
];


// ─── D17: Journal Entry Testing (ISA 240.32(a)) ─────────────────────────────

export const JOURNAL_ENTRY_TESTING_WP = {
  introduction: "ISA 240.32(a) requires the auditor to design and perform audit procedures to test the appropriateness of journal entries recorded in the general ledger and other adjustments made in the preparation of the financial statements. This working paper provides a structured approach to journal entry testing as a standalone substantive procedure addressing the risk of management override of controls.",

  selection_criteria: [
    {
      item: "Entries made at unusual times (e.g. weekends, holidays, late at night, year-end)",
      isa: "ISA 240.32(a)(i)",
      guidance: "Identify journal entries posted outside normal business hours, at weekends, on public holidays, or late at night. These may indicate entries posted without normal supervisory oversight. Obtain a complete listing of entries by timestamp and filter for entries outside core hours.",
      evidence: "System-generated report of journal entries by posting date/time; analysis of out-of-hours entries; explanations from preparers"
    },
    {
      item: "Entries made by unexpected or unusual individuals",
      isa: "ISA 240.32(a)(ii)",
      guidance: "Identify journal entries posted by individuals who would not normally make such entries (e.g. senior management posting entries normally prepared by bookkeepers, IT staff posting financial entries). Consider whether the preparer has an appropriate level of authority.",
      evidence: "Journal entry listing by preparer/user ID; user role analysis; explanations for entries by unexpected individuals"
    },
    {
      item: "Entries with little or no explanation or description",
      isa: "ISA 240.32(a)(iii)",
      guidance: "Identify journal entries with blank, vague, or generic descriptions. Adequate narration is a key control over journal entries. Entries without adequate description may lack proper authorisation or business purpose.",
      evidence: "Analysis of journal entries with blank or minimal descriptions; sample testing to supporting documentation"
    },
    {
      item: "Entries to unusual or rarely used accounts",
      isa: "ISA 240.32(a)(iv)",
      guidance: "Identify journal entries to suspense accounts, dormant accounts, intercompany accounts, or accounts not used in the normal course of business. Consider entries to revenue, provision, or reserve accounts that may be used to manipulate results.",
      evidence: "Trial balance analysis showing rarely used accounts with year-end entries; explanation of account purpose and journal entry rationale"
    },
    {
      item: "Entries that contain round numbers or consistent ending numbers",
      isa: "ISA 240.A49",
      guidance: "Analyse journal entries for round-number amounts or amounts with repeating patterns. While some legitimate entries may be round numbers (e.g. accruals), a pattern of round-number adjustments may indicate estimation bias or fabricated entries.",
      evidence: "Data analytics output showing round-number entries above materiality threshold; Benford's Law analysis; sample testing of round-number entries"
    },
    {
      item: "Entries to accounts containing significant estimates or period-end adjustments",
      isa: "ISA 240.32(a); ISA 540",
      guidance: "Focus on journal entries to accounts involving significant accounting estimates (provisions, impairment, fair values, depreciation adjustments). Management override risk is heightened for estimates due to inherent subjectivity. Test that entries reflect supportable assumptions.",
      evidence: "Schedule of estimate-related journal entries; supporting calculations; management assumptions documentation; comparison to independent expectations"
    },
    {
      item: "Consolidation adjustments and entries not processed through normal workflows",
      isa: "ISA 240.32(a); ISA 600.33",
      guidance: "Test consolidation journal entries including elimination entries, fair value adjustments, and top-side adjustments. These entries bypass normal transaction processing controls and present elevated risk of management override. Verify mathematical accuracy and appropriateness.",
      evidence: "Consolidation journal listing; working papers supporting elimination entries; intercompany reconciliations; top-side adjustment authorisation"
    },
    {
      item: "Entries affecting revenue recognition near period end",
      isa: "ISA 240.26–27; ISA 240.A32–A34",
      guidance: "Test journal entries to revenue accounts in the last month of the reporting period and first month of the subsequent period. Revenue recognition is a presumed fraud risk per ISA 240.26. Consider entries that increase revenue or reverse deferred revenue near year-end.",
      evidence: "Revenue journal entries in final month; credit notes and reversals post year-end; cut-off testing results; supporting contracts and delivery evidence"
    },
    {
      item: "Manual entries overriding automated/system-generated entries",
      isa: "ISA 240.32(a)",
      guidance: "Identify instances where system-generated entries (e.g. automated accruals, depreciation, cost allocations) have been manually overridden or reversed and re-posted with different amounts. These override entries circumvent the controls embedded in automated processing.",
      evidence: "System log of overridden automated entries; comparison of original and replacement amounts; authorisation for the override"
    },
    {
      item: "Entries with debits and credits that do not logically correspond",
      isa: "ISA 240.A49",
      guidance: "Identify journal entries where the account combination is unusual or where the debit and credit accounts do not have an obvious business relationship (e.g. debit to revenue, credit to fixed assets). Use data analytics to identify atypical account pairings.",
      evidence: "Data analytics output showing unusual account combinations; stratification analysis; sample testing with supporting documentation"
    }
  ],

  testing_approach: [
    {
      item: "Obtain complete journal entry population from the general ledger",
      isa: "ISA 240.32(a)",
      guidance: "Request a complete download of all journal entries for the period under audit, including the posting date, effective date, preparer, authoriser, amount, account codes, and description. Verify completeness by reconciling the total of journal entries to the movement in the trial balance. Ensure the population includes manual journals, automatic journals, and top-side adjustments.",
      evidence: "Complete journal entry listing; reconciliation to trial balance movement; confirmation from management that listing is complete"
    },
    {
      item: "Evaluate the design and implementation of controls over journal entries",
      isa: "ISA 240.32(a); ISA 315.14",
      guidance: "Understand the entity's controls over journal entry processing including authorisation requirements, segregation between preparation and posting, system access controls, and management review. Consider whether controls operate differently for manual vs automated entries. Document any control deficiencies identified.",
      evidence: "Journal entry policy documentation; authorisation matrix; system access controls review; walkthrough of journal entry process"
    },
    {
      item: "Apply data analytics to identify entries meeting risk-based selection criteria",
      isa: "ISA 240.32(a); ISA 520",
      guidance: "Use computer-assisted audit techniques (CAATs) or data analytics to filter the journal entry population for entries matching the risk-based selection criteria. Consider using stratification, Benford's Law analysis, duplicate detection, and keyword searches. Document the criteria applied and the number of entries selected from each criterion.",
      evidence: "Data analytics methodology and scripts; output reports by criterion; population and sample statistics; rationale for any criteria not applied"
    },
    {
      item: "Select and test a sample of journal entries",
      isa: "ISA 240.32(a); ISA 530",
      guidance: "From the entries identified through the selection criteria, select a sample for detailed testing. For each entry, verify to supporting documentation, confirm the entry was appropriately authorised, assess the business rationale, and evaluate whether the accounting treatment is appropriate. Consider increasing sample size for higher-risk criteria.",
      evidence: "Sample selection methodology; testing matrix showing each entry tested; supporting documentation for each sampled entry; conclusion on each entry"
    },
    {
      item: "Conclude on results and identify any fraud indicators",
      isa: "ISA 240.35–37",
      guidance: "Evaluate the results of journal entry testing. Consider whether any exceptions identified indicate a risk of material misstatement due to fraud. If fraud or suspected fraud is identified, consider the implications for other aspects of the audit (ISA 240.35), communicate to management and TCWG as appropriate (ISA 240.40–42), and consider reporting obligations under the Proceeds of Crime Act 2002.",
      evidence: "Summary of exceptions and management explanations; fraud assessment conclusion; communication to TCWG if applicable; impact on audit opinion"
    }
  ]
};


// ─── D18: Substantive Analytical Procedures (ISA 520) ────────────────────────

export const SUBSTANTIVE_ANALYTICAL_PROCEDURES = [
  {
    item: "Determine suitability of substantive analytical procedures for the assertion",
    isa: "ISA 520.5(a)",
    guidance: "Assess whether substantive analytical procedures are appropriate for the particular assertion being tested. Consider whether the relationship between data items is sufficiently predictable to provide relevant audit evidence. Analytical procedures are generally more applicable to large volumes of transactions that tend to be predictable over time. They are less suitable where there is significant estimation uncertainty or where the relationship between variables is complex or unstable.",
    evidence: "Documentation of rationale for using analytical procedures for each assertion; risk assessment for relevant assertions; nature of the account balance or transaction class"
  },
  {
    item: "Develop an independent expectation of the recorded amount",
    isa: "ISA 520.5(b)",
    guidance: "Develop an expectation of the recorded amount or ratio that is sufficiently precise to identify a misstatement that, individually or when aggregated with other misstatements, may cause the financial statements to be materially misstated. Use reliable data (both internal and external) to form the expectation. Consider using prior year amounts, budgets, industry data, or non-financial data. The expectation must be developed independently of the amount being tested.",
    evidence: "Expectation calculation showing data sources, method, and assumptions; source data reliability assessment; precision of the expectation"
  },
  {
    item: "Determine the acceptable threshold for differences",
    isa: "ISA 520.5(c); ISA 320",
    guidance: "Determine the amount of difference from the expectation that can be accepted without further investigation. This threshold should be consistent with the desired level of assurance and should consider materiality and the assessed risk of material misstatement. A lower threshold provides greater assurance. Typically set at performance materiality or a proportion thereof, depending on the assessed risk.",
    evidence: "Documented threshold amount with rationale; linkage to materiality and risk assessment; basis for the threshold level (e.g. percentage of performance materiality)"
  },
  {
    item: "Compare recorded amounts to expectations and identify significant differences",
    isa: "ISA 520.5(d)",
    guidance: "Compare the recorded amount to the developed expectation. Where the difference exceeds the acceptable threshold, this constitutes a significant difference requiring investigation. Document the comparison including the expected amount, recorded amount, difference in both absolute and percentage terms, and whether the difference exceeds the threshold.",
    evidence: "Comparison schedule showing expected vs recorded amounts; differences in absolute and percentage terms; identification of differences exceeding the threshold"
  },
  {
    item: "Investigate significant differences — obtain management explanations",
    isa: "ISA 520.7",
    guidance: "For each significant difference identified, enquire of management and obtain appropriate explanations and corroborating audit evidence. Do not accept management's explanations at face value — corroborate with independent evidence. Consider whether the unexplained difference represents a misstatement and evaluate its effect individually and in aggregate. If management cannot provide an adequate explanation, consider the implications for the risk assessment.",
    evidence: "Management explanations for each significant difference; corroborating evidence obtained; assessment of whether explanations are consistent with understanding of the entity; conclusion on each difference"
  },
  {
    item: "Revenue analytical procedure — predictive model",
    isa: "ISA 520.5; ISA 240.26",
    guidance: "Develop a predictive model for revenue using operational data (e.g. volume x price, occupancy x room rate, headcount x average fee). Consider seasonal patterns, price changes, volume trends, and known one-off items. Given revenue recognition is a presumed fraud risk (ISA 240.26), ensure the precision of the expectation is appropriate for the risk level.",
    evidence: "Revenue prediction model with clearly identified inputs; source of operational data; comparison to recorded revenue; investigation of differences; linkage to ISA 240 fraud risk response"
  },
  {
    item: "Payroll analytical procedure — proof in total",
    isa: "ISA 520.5",
    guidance: "Perform a payroll proof-in-total by calculating expected payroll costs using average headcount, known salary/wage rates, pay rises effective during the year, NIC and pension contributions, and bonus/commission payments. Reconcile the expected total to the recorded amount. This procedure is particularly effective for payroll given the predictable nature of salary costs.",
    evidence: "Payroll proof-in-total calculation; headcount data by month; salary rates and effective dates of changes; employer NIC and pension rates applied; comparison to recorded payroll; investigation of differences"
  },
  {
    item: "Depreciation analytical procedure — recalculation",
    isa: "ISA 520.5; ISA 540",
    guidance: "Recalculate the expected depreciation charge using the opening net book value, additions (time-apportioned), disposals (time-apportioned), and applicable depreciation rates for each asset category. Compare the expected charge to the recorded amount. This is an effective analytical procedure given the formulaic nature of depreciation calculations.",
    evidence: "Depreciation expectation calculation by asset category; depreciation rates used; opening NBV, additions and disposals data; comparison to recorded charge; investigation of differences"
  },
  {
    item: "Interest expense analytical procedure — recalculation",
    isa: "ISA 520.5",
    guidance: "Recalculate expected interest expense using average borrowings outstanding during the period and the applicable interest rates (fixed and variable). Consider drawdowns and repayments during the period, arrangement fees, and any interest rate swaps. Compare the expected charge to the recorded amount.",
    evidence: "Interest recalculation showing average borrowings, applicable rates, and time periods; loan facility agreements; comparison to recorded interest expense; investigation of differences"
  },
  {
    item: "Ratio analysis — key financial ratios and trend analysis",
    isa: "ISA 520.5; ISA 315.6(b)",
    guidance: "Calculate and compare key financial ratios over multiple periods and against industry benchmarks. Key ratios include: gross margin, operating margin, current ratio, quick ratio, debtor days, creditor days, stock days, gearing ratio, interest cover, and return on capital employed. Identify unexpected trends or movements requiring investigation.",
    evidence: "Ratio analysis schedule with current year, prior year(s), and industry comparatives; trend analysis graphs or tables; identification of unexpected movements; investigation and management explanations"
  },
  {
    item: "Evaluate overall reliability and conclude",
    isa: "ISA 520.6; ISA 330.26",
    guidance: "Evaluate the overall results of substantive analytical procedures performed. Consider the reliability of the data used, the precision of the expectations developed, and whether sufficient appropriate audit evidence has been obtained to reduce the risk of material misstatement to an acceptably low level. Document the overall conclusion on whether the analytical procedures achieve the audit objective for each relevant assertion.",
    evidence: "Summary of all analytical procedures performed; overall assessment of reliability; conclusion on sufficiency of evidence; any additional procedures required; cross-reference to other testing programmes"
  }
];


// ─── F3: Engagement Completion Letter to Management ──────────────────────────

export const ENGAGEMENT_COMPLETION_LETTER = [
  {
    item: "Confirmation of scope and any changes from the engagement letter",
    isa: "ISA 210.13; ISA 700.10",
    guidance: "Confirm the scope of the audit as set out in the original engagement letter (ISA 210). Identify any changes to the scope agreed during the audit, including additional procedures requested by management or TCWG, any scope limitations encountered, and any changes to the financial reporting framework. Reference the original engagement letter date and any supplementary correspondence.",
    evidence: "Original engagement letter; any supplementary engagement correspondence; record of scope changes and approvals"
  },
  {
    item: "Summary of significant audit findings",
    isa: "ISA 260.16(a); ISA 450.12",
    guidance: "Provide a summary of significant audit findings including material misstatements identified and corrected, unadjusted misstatements and their aggregate effect (ISA 450.12), material uncertainties, significant accounting judgements and estimates, and any significant difficulties encountered during the audit. Present findings factually and in order of significance.",
    evidence: "Schedule of audit adjustments (corrected); summary of unadjusted differences (E5); significant judgement memoranda"
  },
  {
    item: "Significant deficiencies in internal control communicated",
    isa: "ISA 265.9–11",
    guidance: "Cross-reference to the management letter (F1 / ISA 265) for detailed internal control deficiencies identified during the audit. Confirm the number and severity of deficiencies communicated, highlight any repeat findings from prior periods, and note any deficiencies that management has committed to remediate with agreed timescales.",
    evidence: "Management letter (WP F1); prior year management letter for comparison; management responses and remediation plans"
  },
  {
    item: "Confirmation of independence maintained throughout the engagement",
    isa: "ISA 260.17; Ethical Standard (2019) s1.60–1.63",
    guidance: "Confirm that the engagement team has maintained independence throughout the period of the engagement in accordance with the FRC Ethical Standard (2019). Disclose any relationships, services, or circumstances that may reasonably be thought to bear on independence, including non-audit services provided, fees, and any safeguards applied. For PIE audits, provide the additional disclosures required by the Ethical Standard.",
    evidence: "Independence declarations from all team members; non-audit services schedule; fee analysis; safeguards documentation; Ethical Standard compliance assessment"
  },
  {
    item: "Representations required from management and TCWG",
    isa: "ISA 580.10–11; ISA 580.13",
    guidance: "List the specific written representations required from management and those charged with governance as a condition of completing the audit. Cross-reference to the representation letter (E4 / ISA 580). Highlight any entity-specific representations required beyond the standard ISA 580 requirements, and confirm the required signatories and timing of the representation letter.",
    evidence: "Draft representation letter; list of required signatories; cross-reference to WP E4"
  },
  {
    item: "Expected form of audit report and any modifications",
    isa: "ISA 700; ISA 705; ISA 706; ISA 570.22",
    guidance: "Communicate the expected form of the audit report including whether the opinion will be unmodified or modified (qualified/adverse/disclaimer per ISA 705), whether an Emphasis of Matter or Other Matter paragraph is expected (ISA 706), whether a Material Uncertainty related to Going Concern paragraph is required (ISA 570.22), and whether Key Audit Matters will be reported (ISA 701 — for PIE audits). Provide draft report wording if material modifications are expected.",
    evidence: "Draft audit report; rationale for any expected modifications; communication with TCWG regarding report modifications"
  },
  {
    item: "Outstanding matters requiring resolution before sign-off",
    isa: "ISA 220.18–20; ISA 230.14",
    guidance: "Identify any outstanding matters that must be resolved before the audit report can be signed. This may include receipt of solicitor's confirmation letters, final bank confirmations, management representation letter, resolution of disagreements with management, completion of subsequent events review to date of signing, and partner/EQCR review. Provide a clear timeline for resolution.",
    evidence: "Outstanding items tracker; target dates for resolution; responsibility assignments; status updates"
  },
  {
    item: "Fee summary and any variations from the original quotation",
    isa: "ISA 260.17; Ethical Standard (2019) s4",
    guidance: "Provide a summary of actual audit fees compared to the original fee quotation. Explain any significant variations, including the reasons for additional work (e.g. audit adjustments requiring additional testing, control weaknesses necessitating extended substantive work, group audit considerations). Confirm that the fee arrangement does not create a self-interest threat to independence.",
    evidence: "Fee breakdown analysis (budgeted vs actual); time analysis by grade; explanation of variances; independence assessment of fee level"
  },
  {
    item: "Timetable for completion and statutory filing deadlines",
    isa: "CA 2006 s442–444; ISA 560",
    guidance: "Set out the agreed timetable for completion of the audit including: expected date of audit report signing, date of approval of financial statements by the board, filing deadline at Companies House (9 months for private companies, 6 months for public companies per CA 2006 s442–444), and filing deadline at HMRC for the corporation tax return. Note any risks of late filing.",
    evidence: "Completion timetable; statutory filing deadline calculations; confirmation of board meeting date for approval"
  }
];


// ─── F4: Audit Committee Report (ISA 260) ────────────────────────────────────

export const AUDIT_COMMITTEE_REPORT = [
  {
    item: "Auditor's responsibilities under ISAs (UK)",
    isa: "ISA 260.14",
    guidance: "Communicate the auditor's responsibilities in relation to the financial statements audit, including that the auditor is responsible for forming and expressing an opinion on the financial statements prepared by management with the oversight of TCWG. Clarify that the audit does not relieve management or TCWG of their responsibilities. Reference the engagement letter terms and ISA 200 overall objectives.",
    evidence: "Engagement letter; ISA 200 overall objectives statement; terms of reference of audit committee"
  },
  {
    item: "Planned scope and timing of the audit",
    isa: "ISA 260.15; ISA 300",
    guidance: "Communicate the planned scope and timing of the audit to assist TCWG in understanding the consequences of the auditor's work. Include: the overall audit strategy, the significant risks identified, areas of higher assessed risk, the nature and extent of specialised skill or expertise needed, the planned use of internal audit work, the approach to internal control testing, and materiality levels applied. For group audits, include the scope of work over components.",
    evidence: "Audit strategy document (A3); risk assessment (B1); materiality calculations (A4); group audit scoping (A10 if applicable); audit timeline"
  },
  {
    item: "Significant qualitative aspects of the entity's accounting practices",
    isa: "ISA 260.16(a)(i)",
    guidance: "Communicate views about significant qualitative aspects of the entity's accounting practices including accounting policies, accounting estimates and financial statement disclosures. Where applicable, explain why the auditor considers a significant accounting practice that is acceptable under the applicable financial reporting framework not to be most appropriate to the particular circumstances of the entity.",
    evidence: "Accounting policies review; significant estimates assessment (ISA 540); disclosure review; comparison to industry practice"
  },
  {
    item: "Significant difficulties encountered during the audit",
    isa: "ISA 260.16(b)",
    guidance: "Communicate any significant difficulties encountered during the audit including: significant delays by management in providing required information; an unnecessarily brief timetable; unavailability of expected information; restrictions on audit procedures; management's unwillingness to provide information about known or suspected fraud. Consider whether difficulties constitute scope limitations requiring report modification.",
    evidence: "Audit progress notes; correspondence with management regarding delays; time analysis showing impact of difficulties; assessment of impact on audit opinion"
  },
  {
    item: "Significant matters arising from the audit discussed or communicated with management",
    isa: "ISA 260.16(c)",
    guidance: "Communicate significant matters arising from the audit that were discussed with or the subject of correspondence with management. Include any significant events or transactions during the period, business conditions affecting the entity, and matters that required significant auditor judgement. Also communicate matters that required consultation outside the engagement team.",
    evidence: "Meeting notes with management; significant correspondence; engagement team consultation records; technical consultation records"
  },
  {
    item: "Material corrected and uncorrected misstatements",
    isa: "ISA 260.16(a)(ii); ISA 450.12–13",
    guidance: "Report all corrected material misstatements identified during the audit and request correction of uncorrected misstatements. Provide the schedule of unadjusted differences (ISA 450.12) and explain why each uncorrected misstatement is judged to be immaterial both individually and in aggregate. Obtain written representations from TCWG that they believe the effects of uncorrected misstatements are immaterial (ISA 450.14).",
    evidence: "Schedule of corrected misstatements; schedule of unadjusted differences (E5); management representations regarding uncorrected misstatements; aggregate assessment"
  },
  {
    item: "Circumstances affecting the form and content of the auditor's report",
    isa: "ISA 260.16(a)(iii); ISA 700–706",
    guidance: "Communicate any circumstances that affect the form and content of the auditor's report including: expected modifications to the auditor's opinion (ISA 705), Emphasis of Matter or Other Matter paragraphs (ISA 706), Material Uncertainty related to Going Concern paragraph (ISA 570.22), Key Audit Matters to be reported (ISA 701 — for PIEs), and any other reporting responsibilities under the entity's regulatory framework.",
    evidence: "Draft audit report; rationale for report modifications; going concern assessment conclusion (A7); KAM determination and drafts (for PIEs)"
  },
  {
    item: "Independence confirmation and non-audit services disclosure",
    isa: "ISA 260.17; Ethical Standard (2019) s1.60–1.63; s5",
    guidance: "Provide a written disclosure to TCWG of: all relationships between the firm, network firms, and the entity that may reasonably be thought to bear on independence; all non-audit services provided and related fees; the total fees for audit and non-audit services as a ratio; and safeguards applied to eliminate or reduce threats to independence. For PIE audits, provide the additional disclosures required by the Ethical Standard including compliance with the fee cap.",
    evidence: "Independence declaration; non-audit services schedule; fee analysis (audit vs non-audit); safeguards documentation; Ethical Standard compliance assessment; PIE fee cap calculation (if applicable)"
  },
  {
    item: "Fraud and non-compliance with laws and regulations",
    isa: "ISA 240.40–42; ISA 250.22–28",
    guidance: "Communicate any fraud identified or suspected fraud involving management, employees with significant roles in internal control, or fraud resulting in material misstatement of the financial statements (ISA 240.40). Communicate any non-compliance with laws and regulations identified during the audit (ISA 250.22). Consider the auditor's obligations under the Proceeds of Crime Act 2002 and whether a Suspicious Activity Report (SAR) is required.",
    evidence: "Fraud risk assessment (A6); non-compliance assessment; communication records; SAR filing (if applicable); legal advice obtained"
  },
  {
    item: "Going concern assessment communication",
    isa: "ISA 570.25; ISA 260.16(a)",
    guidance: "Communicate the auditor's conclusions regarding the appropriateness of the going concern basis of accounting and whether a material uncertainty exists. If a material uncertainty has been identified, communicate whether adequate disclosure has been made in the financial statements. Explain the impact on the auditor's report (MUCGC paragraph, qualification, or adverse opinion).",
    evidence: "Going concern assessment working paper (A7); management's going concern assessment; cash flow forecasts evaluation; covenant compliance testing; auditor's conclusion on going concern"
  },
  {
    item: "Key Audit Matters (PIE audits only — ISA 701)",
    isa: "ISA 701; ISA 260.16(a)",
    guidance: "For audits of public interest entities, communicate the Key Audit Matters (KAMs) that the auditor has determined to be of most significance in the audit of the current period financial statements. Provide draft KAM descriptions for review by TCWG. Consider whether KAM communication is appropriate for non-PIE audits on a voluntary basis (ISA 701.5).",
    evidence: "KAM determination documentation; draft KAM descriptions; communication with TCWG regarding KAM content; comparison to prior year KAMs"
  },
  {
    item: "Other matters required by TCWG or agreed terms of engagement",
    isa: "ISA 260.16(d); ISA 210",
    guidance: "Communicate any other matters agreed with TCWG or required by the audit committee's terms of reference. This may include: internal control observations beyond ISA 265 significant deficiencies, regulatory compliance matters, recommendations for business process improvement, tax matters identified during the audit, or matters raised by the audit committee for specific consideration.",
    evidence: "Audit committee terms of reference; prior year communication for comparison; additional matters agreed in the engagement letter or during planning"
  }
];


// ═══════════════════════════════════════════════════════════════════════════════
// ADDITIONAL_WPS — Sidebar entries for missing WPs to be merged into the main
// WPS array in AuditEngine_AURA.jsx
// ═══════════════════════════════════════════════════════════════════════════════

export const ADDITIONAL_WPS = [
  // B4 — insert after B3 in the RISK ASSESSMENT section
  {
    id: "b4",
    label: "Entity-Level Controls",
    icon: "🏛️",
    ref: "B4",
    type: "risk",
    isa: "ISA 315.14–21"
  },

  // D17 — insert after D16 in the TESTING PROGRAMMES section
  {
    id: "d17",
    label: "Journal Entry Testing",
    icon: "🔢",
    ref: "D17",
    type: "testing",
    isa: "ISA 240.32(a)"
  },

  // D18 — insert after D17 in the TESTING PROGRAMMES section
  {
    id: "d18",
    label: "Substantive Analytical Procedures",
    icon: "📐",
    ref: "D18",
    type: "testing",
    isa: "ISA 520"
  },

  // F3 — insert after F2 in the REPORTING section
  {
    id: "f3",
    label: "Completion Letter to Management",
    icon: "📨",
    ref: "F3",
    type: "reporting",
    isa: "ISA 260/265"
  },

  // F4 — insert after F3 in the REPORTING section
  {
    id: "f4",
    label: "Audit Committee Report",
    icon: "📊",
    ref: "F4",
    type: "reporting",
    isa: "ISA 260"
  }
];
