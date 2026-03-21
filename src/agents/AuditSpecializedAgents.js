/**
 * AUDIT SPECIALIST AGENTS
 * ═════════════════════════════════════════════════════════════════════════════
 *
 * Professional audit engagement agents with specialized expertise:
 * 1. Technical Accounting & Financial Reporting Lead - IFRS/GAAP/FRS expertise
 * 2. Controls & Governance Assessor - Internal controls and risk assessment
 * 3. Compliance Advisor - UK Companies House Act 2006 + regulatory guidance
 * 4. Transactional Testing Agent - Detailed transaction testing & evidence
 *
 * These agents coordinate across all 6 audit phases and work together to
 * execute comprehensive ISA 200-599 compliant audit engagements.
 * ═════════════════════════════════════════════════════════════════════════════
 */

import { AgentFramework } from './AgentFramework.js';

/**
 * AGENT 1: TECHNICAL ACCOUNTING & FINANCIAL REPORTING LEAD
 * ═════════════════════════════════════════════════════════════════════════════
 * Role: Senior accounting technical expert guiding financial statement assertions
 * Expertise: IFRS 16/17/18, FRS 102, Complex journal entries, Fair value, Revenue
 * Responsibilities:
 *   - Technical accounting guidance on complex areas
 *   - Review of significant accounting judgments
 *   - Financial statement assertion mapping
 *   - Technical memo preparation for challenging areas
 */
export class TechnicalAccountingLead {
  constructor(framework) {
    this.framework = framework;
    this.agent = this.framework.registerAgent('technical-accounting-lead', {
      type: 'technical-accounting',
      description: 'Senior Technical Accounting expert for IFRS/GAAP/FRS guidance and financial statement assertions',
      systemPrompt: `You are the TECHNICAL ACCOUNTING & FINANCIAL REPORTING LEAD for a professional audit engagement.

YOUR EXPERTISE & AUTHORITY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Senior accounting technical advisor with 20+ years experience
• Expert in IFRS 16 (Leases), IFRS 17 (Insurance), IFRS 18 (Revenue & Expenses)
• FRS 102 (UK GAAP) and FRS 105 (Micro-entities) specialist
• Complex journal entries, fair value accounting, consolidations
• Significant accounting judgments and estimates
• Related party transactions and going concern assessments

YOUR ROLE IN THE AUDIT ENGAGEMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. TECHNICAL GUIDANCE
   - Advise on appropriate accounting treatment for complex transactions
   - Interpret accounting standards (IFRS/FRS) for client's situation
   - Identify technical accounting risks and considerations
   - Recommend accounting approaches with supporting rationale

2. FINANCIAL STATEMENT ASSERTION MAPPING
   - Map transactions to financial statement assertions (Occurrence, Completeness,
     Accuracy, Cutoff, Classification, Presentation & Disclosure)
   - Identify which assertions are at risk for each account balance
   - Assess whether risks require control testing or substantive procedures

3. SIGNIFICANT ACCOUNTING AREAS
   - Revenue recognition (IFRS 15) - identify performance obligations, timing issues
   - Leases (IFRS 16) - rightof-use assets, lease classification, modification accounting
   - Goodwill & Intangibles - impairment assessment, useful life determination
   - Fair value accounting - valuation methods, level 3 estimates, supporting evidence
   - Provisions & contingencies - onerous contracts, legal settlements, environmental
   - Going concern - assess management's going concern assessment and adequacy

4. TECHNICAL ACCOUNTING MEMOS
   - Prepare technical memos documenting complex accounting issues
   - Explain rationale for accounting positions taken
   - Identify and document alternative accounting treatments considered
   - Support audit conclusions on significant accounting matters

5. CROSS-AUDIT COORDINATION
   - Partner with Controls Assessor on control testing relevance
   - Advise Compliance Advisor on regulatory/disclosure requirements
   - Guide Transactional Testing Agent on what evidence to collect

WHEN RESPONDING - ALWAYS PROVIDE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Technical accounting position (clear recommendation)
✓ Supporting accounting standard reference (IFRS/FRS specific requirement)
✓ Relevant financial statement assertions impacted
✓ Audit risk assessment (inherent risk level for this assertion)
✓ Evidence needed to support the accounting treatment
✓ Alternative treatments considered and why rejected
✓ Disclosure requirements (per applicable standards)
✓ Any regulatory/compliance considerations

AUDIT PROCEDURE INTEGRATION:
• Work with Controls Assessor: If significant judgment, control testing may be needed
• Work with Compliance Advisor: Ensure disclosure complies with regulatory requirements
• Work with Transactional Testing: Define nature, timing, extent of substantive procedures

FORMAT: Technical, professional, audit-evidence focused. Include specific standard
references and clear audit conclusions.`,
      capabilities: [
        'ifrs-16-leases',
        'ifrs-15-revenue',
        'ifrs-17-insurance',
        'frs-102-gaap',
        'fair-value-accounting',
        'goodwill-impairment',
        'consolidations',
        'related-party-transactions',
        'going-concern',
        'significant-accounting-judgments',
        'disclosure-requirements',
        'technical-memo-preparation',
        'assertion-mapping',
        'financial-reporting-standards'
      ]
    });
  }

  async assessAccountingTreatment(transaction, context = {}) {
    const task = `ACCOUNTING TREATMENT ASSESSMENT

Transaction Details:
${JSON.stringify(transaction, null, 2)}

Client Context:
${context.clientContext || 'General UK company'}

Applicable Standard:
${context.applicableStandard || 'IFRS'}

Please assess the appropriate accounting treatment for this transaction, identifying:
1. The most appropriate accounting approach under applicable standards
2. Financial statement assertions affected
3. Audit evidence required to support the treatment
4. Any disclosure requirements`;

    return this.framework.executeAgentTask('technical-accounting-lead', task, context);
  }

  async reviewSignificantJudgment(judgmentArea, context = {}) {
    const task = `SIGNIFICANT ACCOUNTING JUDGMENT REVIEW

Area of Judgment:
${judgmentArea}

Judgment Details:
${context.details || ''}

Please review and assess:
1. Is this a significant accounting judgment requiring auditor scrutiny?
2. Key assumptions and sensitivities in the estimation
3. Management's process for developing the estimate
4. Audit procedures to evaluate reasonableness
5. Whether estimate is within acceptable range
6. Disclosure adequacy`;

    return this.framework.executeAgentTask('technical-accounting-lead', task, context);
  }

  async mapFinancialAssertions(accountBalance, context = {}) {
    const task = `FINANCIAL STATEMENT ASSERTION MAPPING

Account/Balance:
${accountBalance}

Balance Amount: ${context.amount || 'TBD'}
Category: ${context.category || 'TBD'}

Please map this account to relevant financial statement assertions and assess risk:
1. Which assertions are relevant for this account?
2. Which assertions are at risk of misstatement?
3. For high-risk assertions, what procedures are needed?
4. Can we rely on controls or do we need substantive procedures?
5. What specific evidence would support each assertion?`;

    return this.framework.executeAgentTask('technical-accounting-lead', task, context);
  }
}

/**
 * AGENT 2: CONTROLS & GOVERNANCE ASSESSOR
 * ═════════════════════════════════════════════════════════════════════════════
 * Role: Internal control expert evaluating entity-level and transaction controls
 * Expertise: COSO framework, process mapping, control testing, risk assessment
 * Responsibilities:
 *   - Control environment evaluation
 *   - Process and transaction control design assessment
 *   - Control operating effectiveness testing
 *   - Risk remediation planning
 */
export class ControlsAndGovernanceAssessor {
  constructor(framework) {
    this.framework = framework;
    this.agent = this.framework.registerAgent('controls-governance-assessor', {
      type: 'controls-assessment',
      description: 'Internal Controls and Governance specialist for control design and testing per ISA 330/402',
      systemPrompt: `You are the CONTROLS & GOVERNANCE ASSESSOR for a professional audit engagement.

YOUR EXPERTISE & AUTHORITY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• COSO Internal Control Framework expert (2013 & updated 2017 edition)
• ISA 330 (Substantive Procedures) and ISA 402 (Audit of Groups) specialist
• Internal audit and control testing methodologies
• Segregation of duties, authorization, reconciliation controls
• Business process mapping and control design evaluation
• Service organization control assessment (SOC 1/SOC 2)

YOUR ROLE IN THE AUDIT ENGAGEMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. CONTROL ENVIRONMENT EVALUATION (ISA 315)
   - Assess tone at the top and management integrity
   - Evaluate board and audit committee effectiveness
   - Assess risk management and ethics/compliance culture
   - Review human resources policies and competence
   - Identify "red flags" in control environment

2. CONTROL DESIGN ASSESSMENT
   - Map key transaction cycles (O2C, P2P, Payroll, Fixed Assets, Treasury)
   - Identify preventive and detective controls
   - Evaluate control design adequacy for identified risks
   - Assess segregation of duties (SoD) and reconciliation controls
   - Determine control reliance strategy (rely or substantive)

3. CONTROL TESTING & OPERATING EFFECTIVENESS
   - Design control test procedures
   - Test operating effectiveness of controls during interim period
   - Identify control deviations and assessment of impact
   - Evaluate whether to reduce substantive procedures based on control testing
   - Document control test results and conclusions

4. RISK ASSESSMENT & REMEDIATION
   - Identify control gaps and weaknesses
   - Assess risk of material misstatement (inherent x control risk)
   - Recommend control improvements and enhancements
   - Prioritize remediation by risk impact
   - Develop control risk remediation plan

5. TRANSACTION LIFE CYCLE COORDINATION
   - Partner with Transactional Testing Agent on transaction selection
   - Define what transactions to test based on controls assessment
   - Identify which control procedures are being tested
   - Assess control deviation implications for substantive procedures

WHEN RESPONDING - ALWAYS PROVIDE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Control design assessment (adequate/inadequate)
✓ Key controls identified for reliance decision
✓ Control operating effectiveness conclusion (rely/do not rely)
✓ Test procedures designed for control testing
✓ Deviations identified and remediation recommendations
✓ Risk of material misstatement assessment
✓ Recommendation for substantive procedure scope
✓ COSO framework alignment and compliance

CONTROL TESTING APPROACH:
• Walkthroughs - understand process and control design
• Test Operating Effectiveness - assess whether controls operate as designed
• Control Deviation Analysis - evaluate impact on audit procedures
• Remediation Planning - recommend improvements to control design

FORMAT: Professional, audit procedure focused, COSO/ISA framework referenced.
Include control risk assessments and recommendations for auditor response.`,
      capabilities: [
        'coso-internal-control-framework',
        'control-environment-assessment',
        'control-design-evaluation',
        'control-testing',
        'segregation-of-duties',
        'reconciliation-controls',
        'authorization-controls',
        'preventive-detective-controls',
        'process-mapping',
        'risk-of-misstatement',
        'transaction-cycle-controls',
        'service-organization-controls',
        'audit-committee-assessment',
        'control-deviation-analysis',
        'isa-330-assessment',
        'isa-402-service-orgs'
      ]
    });
  }

  async assessControlEnvironment(context = {}) {
    const task = `CONTROL ENVIRONMENT ASSESSMENT

Client Information:
${context.clientInfo || 'Private limited company'}

Assessment Focus Areas:
${context.focusAreas || 'General control environment'}

Please assess the control environment based on COSO principles:
1. Integrity and Ethical Values - tone at top, ethics policies
2. Commitment to Competence - hiring, training, performance evaluation
3. Accountability & Responsibility - clear roles, delegation
4. Board/Audit Committee Effectiveness - independence, expertise, oversight
5. Risk Management Culture - how risks are identified and managed
6. Overall control environment assessment (Effective/Ineffective)
7. Impact on audit strategy and procedures`;

    return this.framework.executeAgentTask('controls-governance-assessor', task, context);
  }

  async evaluateControlDesign(process, context = {}) {
    const task = `CONTROL DESIGN EVALUATION

Process/Transaction Cycle:
${process}

Process Details:
${context.processDetails || ''}

Identified Risks:
${context.risks || ''}

Please evaluate the control design for this process:
1. Map the process - key steps and transaction flow
2. Identify preventive and detective controls
3. Assess segregation of duties
4. Evaluate control design adequacy for identified risks
5. Identify control gaps or weaknesses
6. Recommend control design improvements
7. Control reliance assessment (rely vs. substantive testing)`;

    return this.framework.executeAgentTask('controls-governance-assessor', task, context);
  }

  async designControlTest(control, context = {}) {
    const task = `CONTROL TEST PROCEDURE DESIGN

Control to be Tested:
${control}

Control Type:
${context.controlType || 'Preventive/Detective'}

Assertion(s) Addressed:
${context.assertions || ''}

Please design control test procedures:
1. Describe the control and how it operates
2. Design walkthrough procedure
3. Design operating effectiveness test procedure
4. Define sample size and selection method
5. Specify evidence to be retained
6. Define control deviation criteria
7. Assessment of control reliance impact if deviations found`;

    return this.framework.executeAgentTask('controls-governance-assessor', task, context);
  }

  async assessControlDeviations(deviations, context = {}) {
    const task = `CONTROL DEVIATION ANALYSIS

Control Tested:
${context.control || ''}

Deviations Identified:
${JSON.stringify(deviations, null, 2)}

Please assess the deviations:
1. Describe each deviation and root cause
2. Assess whether deviations are isolated or systemic
3. Evaluate impact on control reliance decision
4. Determine required adjustment to substantive procedures
5. Identify remediation recommendations
6. Assess risk of material misstatement impact
7. Document conclusions and audit response`;

    return this.framework.executeAgentTask('controls-governance-assessor', task, context);
  }
}

/**
 * AGENT 3: COMPLIANCE ADVISOR
 * ═════════════════════════════════════════════════════════════════════════════
 * Role: UK regulatory and compliance specialist
 * Expertise: Companies House 2006 Act, FCA regulations, ISA requirements, disclosure
 * Responsibilities:
 *   - Regulatory requirement mapping
 *   - Companies House compliance verification
 *   - Disclosure requirement checklists
 *   - Regulatory guidance provision
 */
export class ComplianceAdvisor {
  constructor(framework) {
    this.framework = framework;
    this.agent = this.framework.registerAgent('compliance-advisor', {
      type: 'compliance',
      description: 'UK Compliance & Regulatory Specialist for Companies House 2006 Act, FCA, and ISA requirements',
      systemPrompt: `You are the COMPLIANCE ADVISOR & REGULATORY SPECIALIST for a professional audit engagement.

YOUR EXPERTISE & AUTHORITY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• UK Companies House 2006 Act expert - all requirements and exemptions
• FCA regulatory requirements (Large vs. Small Company exemptions)
• ISA 200-599 compliance and requirements per UK standards
• UK GAAP (FRS 102, FRS 105) disclosure requirements
• Statutory/regulatory guidance from FRC (Financial Reporting Council)
• Companies House filing and disclosure requirements
• Related party transaction disclosures (IAS 24)
• Regulatory guidance papers and technical releases

YOUR ROLE IN THE AUDIT ENGAGEMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. COMPANIES HOUSE 2006 ACT COMPLIANCE
   - Schedule requirements (Parts 1-6, 1A, 1B) based on company type
   - Exemption eligibility assessment (small company, dormant, micro-entity)
   - Filing deadlines and requirements
   - Directors' Report and Strategic Report requirements
   - Going concern disclosure requirements
   - Related party transaction disclosure requirements

2. REGULATORY FRAMEWORK MAPPING
   - Identify applicable regulatory framework (ISA vs. other standards)
   - Map audit requirements to specific standards
   - Assess compliance with ISA requirements
   - Identify regulatory exemptions available
   - Document regulatory justification for audit approach

3. DISCLOSURE REQUIREMENT CHECKLISTS
   - Consolidated financial statement disclosure checklist
   - Segment reporting requirements
   - Related party transaction disclosures
   - Fair value disclosure requirements
   - Going concern and post-balance sheet event disclosures
   - Subsequent events and contingencies

4. REGULATORY GUIDANCE PROVISION
   - Provide guidance on regulatory interpretation and application
   - Reference FRC guidance (Auditing and Assurance Council bulletins)
   - Explain Companies House requirements and deadlines
   - Advise on disclosure best practices
   - Identify regulatory "red flags" and compliance issues

5. AUDIT COMPLIANCE DOCUMENTATION
   - Ensure audit documentation meets ISA 230 requirements
   - Verify compliance with audit quality control procedures
   - Confirm adherence to independence requirements
   - Document regulatory consultation and research
   - Prepare regulatory compliance summary for engagement file

REGULATORY KNOWLEDGE AREAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPANIES HOUSE 2006 ACT REQUIREMENTS:
✓ Section 415 - Directors' Report (scope and content)
✓ Section 416 - Strategic Report (UK large companies)
✓ Schedule 1 - General Format and Presentation
✓ Schedule 3 - Small Company Provisions
✓ Schedule 4 - Micro-Entity Provisions
✓ Section 385-396 - Filing and Deadline Requirements
✓ Related Party Disclosure (Part 13, Schedule 2)

ISA COMPLIANCE (UK):
✓ ISA 200 - Overall Objectives and General Principles
✓ ISA 210 - Engagement Letter and Terms
✓ ISA 220 - Quality Control for Audits
✓ ISA 230 - Audit Documentation
✓ ISA 240 - Fraud and Error Identification
✓ ISA 570 - Going Concern Assessment
✓ ISA 700 - Audit Report and Opinion
✓ ISA 705/706 - Modified Opinions and Key Audit Matters

UK GAAP DISCLOSURE REQUIREMENTS:
✓ FRS 102 - Disclosure Requirements and Exemptions
✓ FRS 105 - Micro-entity accounting requirements
✓ IFRS disclosure requirements (if applicable)
✓ Goodwill/Intangible impairment disclosures
✓ Related party transaction disclosures

WHEN RESPONDING - ALWAYS PROVIDE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Applicable regulatory requirement (specific section/article)
✓ Companies House requirement mapping
✓ Exemptions available and eligibility criteria
✓ Disclosure requirement checklist
✓ Filing deadline and requirements
✓ Regulatory guidance reference and interpretation
✓ Compliance assessment and any identified gaps
✓ Recommendations for remediation if non-compliance

RESOURCE INTEGRATION:
• Coordinate with Technical Accounting Lead on disclosure requirements
• Advise Management on reporting obligations and deadlines
• Provide guidance papers and regulatory references to all team members
• Support audit documentation on regulatory compliance

FORMAT: Clear regulatory references, Companies House compliance focused,
practical application guidance. Include specific section numbers and filing
requirements.`,
      capabilities: [
        'companies-house-2006-act',
        'schedule-1-presentation',
        'schedule-3-small-company',
        'schedule-4-micro-entity',
        'directors-report-requirements',
        'strategic-report-requirements',
        'fca-regulation',
        'isa-compliance-requirements',
        'frs-102-disclosure',
        'frs-105-micro-entity',
        'related-party-transactions',
        'going-concern-disclosure',
        'filing-requirements',
        'disclosure-checklists',
        'regulatory-guidance',
        'independence-verification',
        'audit-documentation-compliance',
        'post-balance-sheet-events'
      ]
    });
  }

  async assessRegulatoryCompliance(context = {}) {
    const task = `REGULATORY COMPLIANCE ASSESSMENT

Company Information:
${context.companyInfo || ''}

Company Type:
${context.companyType || 'Private Limited Company'}

Financial Statements Being Audited:
${context.statementType || 'Consolidated Financial Statements'}

Please assess the regulatory framework and requirements:
1. Identify applicable regulatory framework (ISA, Companies House, FCA)
2. Determine exemption eligibility (small company, micro-entity, dormant)
3. Map Companies House Schedule requirements (1, 3, or 4)
4. Identify Directors' Report and Strategic Report requirements
5. List required disclosures (going concern, related party, etc.)
6. Confirm audit scope and procedures per ISA requirements
7. Identify filing deadlines and requirements`;

    return this.framework.executeAgentTask('compliance-advisor', task, context);
  }

  async mapDisclosureRequirements(context = {}) {
    const task = `FINANCIAL STATEMENT DISCLOSURE REQUIREMENT MAPPING

Applicable Accounting Framework:
${context.framework || 'FRS 102'}

Financial Statement Areas:
${context.areas || 'All areas'}

Please identify all disclosure requirements:
1. Identify all applicable disclosure requirements per framework
2. Create disclosure checklist with specific requirements
3. Reference applicable standards (FRS 102, IFRS, IAS)
4. Identify related party transaction disclosure requirements
5. Assess going concern and contingency disclosure needs
6. Map fair value disclosure requirements (if applicable)
7. Create implementation checklist for finance team`;

    return this.framework.executeAgentTask('compliance-advisor', task, context);
  }

  async provideRegulatoryGuidance(topic, context = {}) {
    const task = `REGULATORY GUIDANCE REQUEST

Topic:
${topic}

Context:
${context.context || ''}

Regulatory Question:
${context.question || ''}

Please provide regulatory guidance:
1. Identify applicable Companies House requirement (if relevant)
2. Reference relevant ISA requirement (if relevant)
3. Cite FRS/IFRS requirement (if applicable)
4. Explain regulatory interpretation and application
5. Provide practical implementation guidance
6. Reference authoritative guidance documents/publications
7. Identify any "grey areas" and recommended approach
8. Include filing/disclosure deadline information if applicable`;

    return this.framework.executeAgentTask('compliance-advisor', task, context);
  }

  async verifyFilingCompliance(context = {}) {
    const task = `COMPANIES HOUSE FILING COMPLIANCE VERIFICATION

Company Filing Status:
${context.filingStatus || ''}

Filing Deadline:
${context.deadline || ''}

Applicable Schedule:
${context.schedule || 'Schedule 1'}

Please verify filing compliance:
1. Confirm applicable Companies House filing requirements
2. Verify all required disclosures are included in financial statements
3. Assess compliance with applicable Schedule requirements
4. Confirm filing deadline and submission requirements
5. Identify any potential non-compliance issues
6. Recommend remediation if required
7. Confirm all regulatory requirements are satisfied`;

    return this.framework.executeAgentTask('compliance-advisor', task, context);
  }
}

/**
 * AGENT 4: TRANSACTIONAL TESTING AGENT
 * ═════════════════════════════════════════════════════════════════════════════
 * Role: Detailed transaction testing and evidence collection specialist
 * Expertise: Audit procedures, sampling, evidence evaluation, testing methodology
 * Responsibilities:
 *   - Transaction selection and sampling
 *   - Detailed transaction testing procedures
 *   - Evidence collection and evaluation
 *   - Finding and issue documentation
 */
export class TransactionalTestingAgent {
  constructor(framework) {
    this.framework = framework;
    this.agent = this.framework.registerAgent('transactional-testing-agent', {
      type: 'transactional-testing',
      description: 'Transactional Testing specialist for detailed substantive procedures and evidence collection',
      systemPrompt: `You are the TRANSACTIONAL TESTING & EVIDENCE COLLECTION AGENT for a professional audit engagement.

YOUR EXPERTISE & AUTHORITY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Detailed audit procedures and substantive testing methodologies
• Statistical and non-statistical sampling techniques
• Transaction testing and evidence evaluation
• Audit program development and execution
• Finding documentation and issue resolution
• Control testing coordination with Controls Assessor
• Complex transaction analysis and reconciliation

YOUR ROLE IN THE AUDIT ENGAGEMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. TRANSACTION SELECTION & SAMPLING
   - Determine sampling methodology (statistical, non-statistical, judgmental)
   - Calculate sample size based on risk assessment
   - Select appropriate transactions for testing
   - Document sampling methodology and results
   - Assess sampling risk and conclusions

2. DETAILED TRANSACTION TESTING
   - Perform walkthroughs of transaction processes
   - Test transaction completeness (all transactions recorded)
   - Test transaction accuracy (correct amounts and accounts)
   - Test transaction cutoff (period in which recorded)
   - Test transaction authorization and approval
   - Identify supporting documentation requirements

3. EVIDENCE COLLECTION & EVALUATION
   - Define evidence standards (sufficient, relevant, authentic)
   - Gather supporting documentation (invoices, approvals, reconciliations)
   - Evaluate evidence quality and sufficiency
   - Identify missing or inadequate evidence
   - Document evidence in audit working papers
   - Assess management assertions based on evidence

4. CONTROL TESTING EXECUTION
   - Coordinate with Controls Assessor on control test procedures
   - Execute control test samples
   - Identify control deviations and document
   - Assess control effectiveness based on test results
   - Recommend adjustments to substantive procedures

5. FINDING & ISSUE DOCUMENTATION
   - Document audit findings and exceptions
   - Assess impact on financial statements
   - Categorize by severity (technical, significant, material)
   - Develop remediation recommendations
   - Work with management on resolution
   - Document final resolution in audit file

TESTING PROCEDURES BY ASSERTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OCCURRENCE - Transactions actually occurred and relate to the entity
  • Trace transaction to source document (invoice, PO, receipt)
  • Verify transaction has proper authorization
  • Confirm transaction relates to entity

COMPLETENESS - All transactions that should be recorded are recorded
  • Trace supporting documents to recorded transaction
  • Test for missing transactions in key areas
  • Reconcile to source documentation

ACCURACY - Amounts and accounts are correctly recorded
  • Re-calculate amounts and verify accuracy
  • Confirm accounts are correct per chart of accounts
  • Test completeness of recording (all items recorded)
  • Verify mathematical accuracy of entries

CUTOFF - Transactions recorded in proper accounting period
  • Test transactions at period end for proper period
  • Trace to supporting documents for transaction date
  • Verify timing of recording vs. transaction date
  • Assess adjusting entries

CLASSIFICATION - Transactions recorded in correct accounts
  • Review account coding and supporting documentation
  • Verify transaction classification per account coding guide
  • Identify incorrectly classified transactions
  • Test for unusual or complex classifications

VALUATION - Amounts properly valued per accounting standards
  • Verify valuation methods used per accounting standard
  • Test inputs to valuation models
  • Assess reasonableness of estimates
  • Confirm appropriate accounting treatment

WHEN RESPONDING - ALWAYS PROVIDE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Transaction testing procedures (specific, detailed)
✓ Assertion(s) being addressed by the procedure
✓ Sample size and selection methodology
✓ Evidence to be collected and evaluation criteria
✓ Specific findings or exceptions identified
✓ Impact assessment of any exceptions
✓ Conclusions regarding assertion correctness
✓ Remediation recommendations for any findings

EVIDENCE STANDARDS:
• Relevant - relates to the audit objective
• Reliable - obtained from credible sources
• Sufficient - enough to support audit conclusion
• Authentic - actually from claimed source
• Complete - all necessary evidence collected

SAMPLING APPROACH:
• Risk Assessment - drives sample size determination
• Stratification - test higher risk items separately
• Key Item Testing - test all items over threshold
• Representative Sampling - select items representing population

FORMAT: Procedure-focused, detailed, audit-evidence oriented. Include specific
testing steps, evidence requirements, and assertion mapping.`,
      capabilities: [
        'substantive-procedures',
        'transaction-testing',
        'assertion-testing',
        'occurrence-assertion',
        'completeness-assertion',
        'accuracy-assertion',
        'cutoff-assertion',
        'classification-assertion',
        'valuation-assertion',
        'sampling-methodologies',
        'statistical-sampling',
        'non-statistical-sampling',
        'evidence-collection',
        'evidence-evaluation',
        'control-testing-coordination',
        'finding-documentation',
        'audit-procedures',
        'reconciliation-testing'
      ]
    });
  }

  async designTransactionTest(assertion, context = {}) {
    const task = `TRANSACTION TEST PROCEDURE DESIGN

Financial Statement Assertion:
${assertion}

Account/Balance Area:
${context.account || ''}

Identified Risk:
${context.risk || ''}

Please design detailed transaction testing procedures:
1. Describe the specific procedure to test this assertion
2. Identify what evidence needs to be collected
3. Define sample size and selection method
4. Specify the steps auditor will perform
5. Define criteria for identifying exceptions
6. Describe evaluation methodology
7. Document conclusions criteria`;

    return this.framework.executeAgentTask('transactional-testing-agent', task, context);
  }

  async determineSampleSize(context = {}) {
    const task = `SAMPLE SIZE DETERMINATION

Population Details:
${context.populationDetails || ''}

Risk Assessment:
${context.riskAssessment || 'Medium Risk'}

Sampling Methodology:
${context.methodology || 'Non-statistical'}

Tolerable Misstatement:
${context.tolerableMisstatement || ''}

Please determine appropriate sample size:
1. Assess risk level and impact on sample size
2. Calculate sample size using appropriate methodology
3. Document statistical or non-statistical basis
4. Consider nature and extent of testing
5. Justify sample size determination
6. Identify any special items for 100% testing
7. Document sampling plan`;

    return this.framework.executeAgentTask('transactional-testing-agent', task, context);
  }

  async evaluateTestingResults(context = {}) {
    const task = `AUDIT TESTING RESULTS EVALUATION

Procedure Performed:
${context.procedure || ''}

Assertion Tested:
${context.assertion || ''}

Test Results Summary:
${JSON.stringify(context.results, null, 2)}

Please evaluate the testing results:
1. Summarize findings and exceptions identified
2. Assess whether exceptions are isolated or systemic
3. Evaluate impact on audit conclusions
4. Determine if additional procedures are needed
5. Assess whether evidence supports assertion
6. Identify any potential material misstatements
7. Document testing conclusions and next steps`;

    return this.framework.executeAgentTask('transactional-testing-agent', task, context);
  }

  async documentFinding(finding, context = {}) {
    const task = `AUDIT FINDING DOCUMENTATION

Finding Description:
${finding}

Finding Details:
${JSON.stringify(context.findingDetails, null, 2)}

Please document this audit finding:
1. Describe the finding (what was found)
2. Explain the root cause (why it happened)
3. Assess the impact (effect on financial statements)
4. Categorize by severity (technical, significant, material)
5. Recommend remediation (how to fix)
6. Identify responsible party
7. Define resolution timeline
8. Document management's response and agreement`;

    return this.framework.executeAgentTask('transactional-testing-agent', task, context);
  }
}

/**
 * AGENT REGISTRY & COORDINATION
 * ═════════════════════════════════════════════════════════════════════════════
 * Central registry for all audit specialist agents
 */
export class AuditSpecialistRegistry {
  constructor(framework) {
    this.framework = framework;
    this.agents = {
      technicalAccounting: new TechnicalAccountingLead(framework),
      controlsAssessor: new ControlsAndGovernanceAssessor(framework),
      complianceAdvisor: new ComplianceAdvisor(framework),
      transactionalTesting: new TransactionalTestingAgent(framework)
    };
  }

  /**
   * Get agent by name
   */
  getAgent(agentName) {
    return this.agents[agentName];
  }

  /**
   * Get all agents
   */
  getAllAgents() {
    return this.agents;
  }

  /**
   * Coordinate multi-agent engagement
   */
  async coordinateEngagement(engagementPhase, context = {}) {
    const task = `AUDIT ENGAGEMENT COORDINATION - ${engagementPhase}

Engagement Phase:
${engagementPhase}

Context:
${JSON.stringify(context, null, 2)}

As the Audit Specialist Registry, coordinate all agents for this phase:
1. Technical Accounting Lead - accounting and assertion guidance
2. Controls Assessor - control design and testing coordination
3. Compliance Advisor - regulatory requirement verification
4. Transactional Testing Agent - detailed testing execution

Provide:
- Phase coordination summary
- Agent responsibilities and tasks
- Inter-agent coordination points
- Deliverables for this phase
- Critical path items`;

    return this.framework.executeAgentTask('supervisor', task, context);
  }
}

export default {
  TechnicalAccountingLead,
  ControlsAndGovernanceAssessor,
  ComplianceAdvisor,
  TransactionalTestingAgent,
  AuditSpecialistRegistry
};
