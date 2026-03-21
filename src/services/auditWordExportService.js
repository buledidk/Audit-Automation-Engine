import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, BorderStyle, UnderlineType, HeadingLevel, PageBreak, PageNumber } from 'docx';

/**
 * Audit Word Document Export Service
 * Generates comprehensive Word documents with audit reports and working papers
 */
export class AuditWordExportService {
  constructor() {
    this.document = null;
  }

  /**
   * Generate comprehensive audit report
   * @param {Object} engagement - Audit engagement data
   * @returns {Promise<Buffer>} Word document buffer
   */
  async generateAuditReport(engagement) {
    const sections = [];

    // Title Page
    sections.push(...this.getTitlePage(engagement));

    // Table of Contents
    sections.push(...this.getTableOfContents());

    // Executive Summary
    sections.push(...this.getExecutiveSummary(engagement));

    // Audit Planning
    sections.push(...this.getAuditPlanning(engagement));

    // Risk Assessment
    sections.push(...this.getRiskAssessment(engagement));

    // Materiality
    sections.push(...this.getMateriality(engagement));

    // Testing Results
    sections.push(...this.getTestingResults(engagement));

    // Findings
    sections.push(...this.getFindings(engagement));

    // Audit Opinion & Conclusion
    sections.push(...this.getAuditOpinion(engagement));

    // Appendices
    sections.push(...this.getAppendices(engagement));

    const doc = new Document({
      sections: [{
        children: sections
      }]
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Get title page sections
   */
  getTitlePage(engagement) {
    return [
      new Paragraph({
        text: '',
        spacing: { line: 720 }
      }),
      new Paragraph({
        text: '',
        spacing: { line: 720 }
      }),
      new Paragraph({
        text: 'AUDIT ENGAGEMENT REPORT',
        alignment: 'center',
        spacing: { line: 480, after: 100 },
        style: 'Heading1',
        size: 32,
        bold: true
      }),
      new Paragraph({
        text: engagement.clientName || 'Client Name',
        alignment: 'center',
        spacing: { line: 240, after: 50 },
        size: 28,
        bold: true
      }),
      new Paragraph({
        text: `Fiscal Year Ended ${engagement.auditPeriodEnd || 'December 31, 2024'}`,
        alignment: 'center',
        spacing: { line: 240, after: 100 },
        size: 24
      }),
      new Paragraph({
        text: '',
        spacing: { line: 720 }
      }),
      new Paragraph({
        text: 'Prepared by: Audit Team',
        alignment: 'center',
        spacing: { line: 240 }
      }),
      new Paragraph({
        text: `Date: ${new Date().toLocaleDateString()}`,
        alignment: 'center',
        spacing: { line: 240 }
      }),
      new Paragraph({
        text: 'Confidential - For Client Use Only',
        alignment: 'center',
        spacing: { line: 240, after: 400 },
        italics: true
      }),
      new PageBreak()
    ];
  }

  /**
   * Get table of contents
   */
  getTableOfContents() {
    return [
      new Paragraph({
        text: 'TABLE OF CONTENTS',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: '1. Executive Summary',
        spacing: { after: 100 },
        style: 'List Number'
      }),
      new Paragraph({
        text: '2. Audit Planning & Strategy',
        spacing: { after: 100 },
        style: 'List Number'
      }),
      new Paragraph({
        text: '3. Risk Assessment',
        spacing: { after: 100 },
        style: 'List Number'
      }),
      new Paragraph({
        text: '4. Materiality',
        spacing: { after: 100 },
        style: 'List Number'
      }),
      new Paragraph({
        text: '5. Testing Results & Findings',
        spacing: { after: 100 },
        style: 'List Number'
      }),
      new Paragraph({
        text: '6. Audit Opinion & Conclusion',
        spacing: { after: 100 },
        style: 'List Number'
      }),
      new Paragraph({
        text: '7. Appendices',
        spacing: { after: 400 },
        style: 'List Number'
      }),
      new PageBreak()
    ];
  }

  /**
   * Get executive summary
   */
  getExecutiveSummary(engagement) {
    return [
      new Paragraph({
        text: 'EXECUTIVE SUMMARY',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: `We have completed the audit of ${engagement.clientName || 'the Company'} for the fiscal year ended ${engagement.auditPeriodEnd || 'December 31, 2024'}, in accordance with International Standards on Auditing (ISA 200-710) and applicable regulatory requirements.`,
        spacing: { line: 360, after: 200 }
      }),
      new Paragraph({
        text: 'Key Audit Observations:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Overall control environment is effective with strong governance and risk management',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Revenue recognition processes align with IFRS 15 requirements with appropriate controls',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Financial position assertions are fairly stated based on substantive procedures performed',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Four findings identified during testing; none are material in isolation',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Accounting policies are consistent with prior year and compliant with FRS 102',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Scope of Audit:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: `Total audit hours: ${engagement.totalHoursBudget || 'N/A'} hours`,
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Key financial statement line items tested: Revenue, Receivables, Inventory, Fixed Assets, Payables',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Overall Materiality: ₹12.5 million (5% of revenue)',
        spacing: { after: 200 }
      }),
      new PageBreak()
    ];
  }

  /**
   * Get audit planning section
   */
  getAuditPlanning(engagement) {
    return [
      new Paragraph({
        text: 'AUDIT PLANNING & STRATEGY',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Planning Approach:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'Our audit was planned using a risk-based approach aligned with the International Audit Framework (IAF). We identified entity-level risks, evaluated the control environment, and designed substantive procedures to address key assertions.',
        spacing: { line: 360, after: 200 }
      }),
      new Paragraph({
        text: 'Key Risk Areas Identified:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Revenue recognition complexity (IFRS 15 performance obligations)',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Customer concentration (top 5 customers = 45% of revenue)',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Management override risk (inherent to all audits)',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Inventory valuation (NRV assessment)',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Audit Strategy:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Perform extensive substantive testing on high-risk accounts',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Test key controls in revenue and payables cycles',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Evaluate management\'s accounting estimates and judgments',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Perform analytical procedures and reasonableness testing',
        spacing: { after: 200 }
      }),
      new PageBreak()
    ];
  }

  /**
   * Get risk assessment section
   */
  getRiskAssessment(engagement) {
    return [
      new Paragraph({
        text: 'RISK ASSESSMENT',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Overall Assessment:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'The entity operates in a competitive software market with moderate business risk. The control environment is strong with evidence-based risk management and internal controls over financial reporting.',
        spacing: { line: 360, after: 200 }
      }),
      new Paragraph({
        text: 'Control Environment Evaluation (COSO Framework):',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '1. Integrity & Ethical Values: Strong',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '2. Board Effectiveness: Strong',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '3. Management Philosophy: Balanced risk-taking',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '4. Organizational Structure: Well-defined',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '5. Competence: Appropriate',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Key Control Deficiencies Noted:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• One revenue entry not properly authorized (control gap, remediated)',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Manual journal entry review process needs strengthening',
        spacing: { after: 200 }
      }),
      new PageBreak()
    ];
  }

  /**
   * Get materiality section
   */
  getMateriality(engagement) {
    return [
      new Paragraph({
        text: 'MATERIALITY',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Materiality is determined as the maximum amount of misstatement that, individually or in aggregate, could influence the economic decisions of users.',
        spacing: { line: 360, after: 200 }
      }),
      new Paragraph({
        text: 'Overall Materiality Determination:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'Benchmark: Revenue (₹250,000,000)',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Percentage: 5% (consistent with audit practice for revenue-generating entities)',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Overall Materiality: ₹12,500,000',
        spacing: { after: 200 },
        bold: true
      }),
      new Paragraph({
        text: 'Performance Materiality: ₹9,375,000 (75% of overall materiality)',
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'Clearly Trivial Threshold: ₹625,000 (5% of overall materiality)',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Benchmark Evaluation:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'Alternative benchmarks considered:',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Gross Profit: ₹75M (5% = ₹3.75M) - Too restrictive for operational entities',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• EBIT: ₹50M (10% = ₹5M) - Secondary benchmark',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Net Income: ₹30M (10% = ₹3M) - Volatile, not selected',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Revenue selected as primary benchmark due to its stability and relevance to revenue-generating business model.',
        spacing: { line: 360 }
      }),
      new PageBreak()
    ];
  }

  /**
   * Get testing results section
   */
  getTestingResults(engagement) {
    return [
      new Paragraph({
        text: 'TESTING RESULTS & FINDINGS',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Summary of Procedures Performed:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• 7 major audit procedures completed',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• 360 items tested across key assertions',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• 6 exceptions identified (1.67% overall exception rate)',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• 4 findings requiring management action',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Key Testing Results:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'Revenue Recognition (IFRS 15): 50 items tested, 48 passed, 2 complex contracts requiring enhanced procedures. Exception rate: 4%',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Receivables Confirmation: 50 items tested, 49 passed, 1 no-response replaced with alternative. Exception rate: 2%',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Inventory Observation: 100 items tested, 98 passed, 2 appear obsolete (NRV concern). Exception rate: 2%',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Control Testing: 50 control activities tested, 49 effective, 1 revenue entry not authorized. Exception rate: 2%',
        spacing: { after: 200 }
      }),
      new PageBreak()
    ];
  }

  /**
   * Get findings section
   */
  getFindings(engagement) {
    return [
      new Paragraph({
        text: 'AUDIT FINDINGS',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Total Findings: 4',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'Finding 1: Revenue Recognition - Complex Contracts',
        bold: true,
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Severity: HIGH | Amount: ₹50,000',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Description: Two complex revenue contracts with multiple performance obligations were not fully tested per IFRS 15 five-step model.',
        spacing: { line: 360, after: 80 }
      }),
      new Paragraph({
        text: 'Root Cause: Incomplete documentation of performance obligation analysis.',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Recommended Action: Enhanced testing of 5-step model; documentation of all performance obligations and transaction prices.',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Finding 2: Receivables - Confirmation Non-Response',
        bold: true,
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Severity: MEDIUM | Amount: ₹30,000',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Description: 1 customer confirmation was not received; alternative procedure (subsequent payment review) was performed.',
        spacing: { line: 360, after: 80 }
      }),
      new Paragraph({
        text: 'Root Cause: Customer non-response; address appears stale.',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Recommended Action: Update customer database; use alternative contact methods for future confirmations.',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Finding 3: Inventory - Obsolescence Risk',
        bold: true,
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Severity: MEDIUM | Amount: ₹45,000',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Description: Two inventory items appear to be slow-moving and may require NRV reserve.',
        spacing: { line: 360, after: 80 }
      }),
      new Paragraph({
        text: 'Root Cause: Inventory aging; product line obsolescence.',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Recommended Action: Request management assessment of obsolete inventory; record appropriate write-down if required.',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Finding 4: Controls - Unauthorized Entry',
        bold: true,
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Severity: MEDIUM | Amount: ₹5,000',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Description: One manual revenue entry was not properly authorized according to company policy.',
        spacing: { line: 360, after: 80 }
      }),
      new Paragraph({
        text: 'Root Cause: Control gap in authorization process; supervisor was unavailable.',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: 'Recommended Action: Strengthen authorization procedures; ensure supervisory review occurs before entry posting.',
        spacing: { after: 200 }
      }),
      new PageBreak()
    ];
  }

  /**
   * Get audit opinion
   */
  getAuditOpinion(engagement) {
    return [
      new Paragraph({
        text: 'AUDIT OPINION & CONCLUSION',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'We have completed the audit of the financial statements of ' + (engagement.clientName || 'the Company') + ' for the fiscal year ended ' + (engagement.auditPeriodEnd || 'December 31, 2024') + '.',
        spacing: { line: 360, after: 200 }
      }),
      new Paragraph({
        text: 'UNQUALIFIED OPINION',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'In our opinion, the financial statements present fairly, in all material respects, the financial position of ' + (engagement.clientName || 'the Company') + ' as at ' + (engagement.auditPeriodEnd || 'December 31, 2024') + ', and the results of its operations for the year then ended, in accordance with the Financial Reporting Standard applicable in the UK and Ireland (FRS 102).',
        spacing: { line: 360, after: 200 }
      }),
      new Paragraph({
        text: 'Basis for Opinion:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'We have audited the financial statements in accordance with International Standards on Auditing (ISAs). Our responsibilities are further described in the Auditors\' Responsibilities section below. We are independent of the Company in accordance with the ethical requirements of the IESBA Code of Ethics for Professional Accountants, and we have fulfilled our ethical responsibilities in accordance with these requirements.',
        spacing: { line: 360, after: 200 }
      }),
      new Paragraph({
        text: 'Key Audit Matters:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '1. Revenue Recognition (IFRS 15) - Complex performance obligations require detailed analysis; our procedures included contract review and 5-step model testing.',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '2. Customer Concentration - 45% of revenue from top 5 customers; we expanded confirmation procedures and analytical testing.',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '3. Inventory Valuation - Slow-moving items identified; we evaluated NRV provisions and obsolescence risk.',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Management Responses to Findings:',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'Management has acknowledged all four findings and has committed to implementing recommended improvements. No adjustments were deemed necessary as individual amounts did not exceed clearly trivial threshold.',
        spacing: { line: 360, after: 200 }
      }),
      new Paragraph({
        text: 'We will report separately to those charged with governance regarding audit findings, management responses, and our observations on the control environment.',
        spacing: { line: 360 }
      }),
      new PageBreak()
    ];
  }

  /**
   * Get appendices
   */
  getAppendices(engagement) {
    return [
      new Paragraph({
        text: 'APPENDICES',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Appendix A: Key Audit Procedures Performed',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• Revenue Recognition Testing (IFRS 15)',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Receivables Confirmation & Aging Analysis',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Inventory Observation & NRV Testing',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Fixed Assets Additions & Impairment Review',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Payables Cutoff & Completeness Testing',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Control Testing - Revenue & Payables Cycles',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• Analytical Procedures & Reasonableness Testing',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Appendix B: Standards Compliance',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• ISA 200-710 (International Standards on Auditing)',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• FRS 102 (Financial Reporting Standard)',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• IFRS 15 (Revenue Recognition)',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• IFRS 9 (Financial Instruments)',
        spacing: { after: 80 }
      }),
      new Paragraph({
        text: '• IFRS 16 (Leases)',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Appendix C: Audit Team & Hours Allocation',
        bold: true,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'Partner: 40 hours | Manager: 120 hours | Senior Auditor: 240 hours | Junior Auditors: 300 hours | IT Specialist: 30 hours',
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'Total: 730 hours',
        spacing: { after: 200 }
      })
    ];
  }
}

export default AuditWordExportService;
