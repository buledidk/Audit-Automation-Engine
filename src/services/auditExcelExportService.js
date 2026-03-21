import XLSX from 'xlsx';

/**
 * Audit Excel Export Service
 * Generates Excel workbooks with audit procedures, working papers, and test results
 */
export class AuditExcelExportService {
  constructor() {
    this.workbook = null;
  }

  /**
   * Generate complete audit procedures workbook
   * @param {Object} engagement - Audit engagement data
   * @param {string} phaseId - Current audit phase
   * @returns {Buffer} Excel file buffer
   */
  generateAuditProceduresWorkbook(engagement, phaseId) {
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Summary
    this.addSummarySheet(workbook, engagement, phaseId);

    // Sheet 2: Procedures by FSLI
    this.addProceduresByFSLI(workbook, engagement);

    // Sheet 3: Testing Results
    this.addTestingResultsSheet(workbook, engagement);

    // Sheet 4: Audit Trail
    this.addAuditTrailSheet(workbook, engagement);

    // Sheet 5: Findings & Exceptions
    this.addFindingsSheet(workbook, engagement);

    // Sheet 6: Risk Assessment
    this.addRiskAssessmentSheet(workbook, engagement);

    // Sheet 7: Materiality Calculation
    this.addMaterialitySheet(workbook, engagement);

    // Write to file
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return wbout;
  }

  /**
   * Add Summary sheet to workbook
   */
  addSummarySheet(workbook, engagement, phaseId) {
    const summaryData = [
      ['AUDIT ENGAGEMENT SUMMARY', ''],
      ['', ''],
      ['Client Name:', engagement.clientName || 'N/A'],
      ['Engagement ID:', engagement.id || 'N/A'],
      ['Fiscal Year End:', engagement.auditPeriodEnd || 'N/A'],
      ['Audit Team Lead:', engagement.auditTeamLead || 'N/A'],
      ['', ''],
      ['OVERALL PROGRESS', ''],
      ['Current Phase:', phaseId || 'Planning'],
      ['Completion %:', `${engagement.overallProgress || 0}%`],
      ['Total Hours Budget:', engagement.totalHoursBudget || 'N/A'],
      ['Hours Spent:', engagement.hoursSpent || 0],
      ['Remaining Hours:', (engagement.totalHoursBudget - engagement.hoursSpent) || 'N/A'],
      ['', ''],
      ['FINANCIAL STATEMENT LINE ITEMS', 'Status'],
      ['Cash', engagement.fslis?.cash?.status || 'Pending'],
      ['Trade Receivables', engagement.fslis?.receivables?.status || 'Pending'],
      ['Inventory', engagement.fslis?.inventory?.status || 'Pending'],
      ['Fixed Assets', engagement.fslis?.fixedAssets?.status || 'Pending'],
      ['Trade Payables', engagement.fslis?.payables?.status || 'Pending'],
      ['Loans & Borrowings', engagement.fslis?.borrowings?.status || 'Pending'],
      ['Revenue', engagement.fslis?.revenue?.status || 'Pending'],
      ['', ''],
      ['MATERIALITY', ''],
      ['Overall Materiality:', engagement.materiality?.overall || 'N/A'],
      ['Performance Materiality:', engagement.materiality?.performance || 'N/A'],
      ['Clearly Trivial Threshold:', engagement.materiality?.trivial || 'N/A'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    ws['!cols'] = [{ wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, ws, 'Summary');
  }

  /**
   * Add detailed procedures by FSLI
   */
  addProceduresByFSLI(workbook, engagement) {
    const fslis = [
      { id: 'cash', name: 'Cash & Bank Balances' },
      { id: 'receivables', name: 'Trade Receivables' },
      { id: 'inventory', name: 'Inventory' },
      { id: 'fixedAssets', name: 'Fixed Assets' },
      { id: 'payables', name: 'Trade Payables' },
      { id: 'revenue', name: 'Revenue' },
      { id: 'borrowings', name: 'Loans & Borrowings' },
    ];

    const proceduresData = [
      ['FSLI', 'Procedure ID', 'Procedure Description', 'Assertion', 'Sample Size', 'Items Tested', 'Items Passed', 'Items Failed', 'Exception Rate %', 'Conclusion', 'Auditor'],
    ];

    // Add sample procedures for each FSLI
    fslis.forEach((fsli, idx) => {
      proceduresData.push([
        fsli.name,
        `AUD-${fsli.id.toUpperCase()}-001`,
        `Obtain bank confirmations for ${fsli.name}`,
        'Existence',
        3,
        3,
        3,
        0,
        '0%',
        'No exceptions',
        'Senior Auditor'
      ]);

      proceduresData.push([
        fsli.name,
        `AUD-${fsli.id.toUpperCase()}-002`,
        `Perform reconciliation testing for ${fsli.name}`,
        'Accuracy',
        fsli.id === 'cash' ? 5 : fsli.id === 'receivables' ? 50 : fsli.id === 'inventory' ? 30 : 10,
        fsli.id === 'cash' ? 5 : fsli.id === 'receivables' ? 50 : fsli.id === 'inventory' ? 30 : 10,
        fsli.id === 'cash' ? 5 : fsli.id === 'receivables' ? 49 : fsli.id === 'inventory' ? 29 : 10,
        fsli.id === 'cash' ? 0 : fsli.id === 'receivables' ? 1 : fsli.id === 'inventory' ? 1 : 0,
        fsli.id === 'cash' ? '0%' : fsli.id === 'receivables' ? '2%' : fsli.id === 'inventory' ? '3.3%' : '0%',
        fsli.id === 'cash' ? 'No exceptions' : 'Minor exceptions noted',
        'Manager'
      ]);

      proceduresData.push([
        fsli.name,
        `AUD-${fsli.id.toUpperCase()}-003`,
        `Evaluate accounting treatment for ${fsli.name}`,
        'Presentation',
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'N/A',
        'Compliant with FRS 102',
        'Partner'
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(proceduresData);
    ws['!cols'] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 35 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(workbook, ws, 'Procedures');
  }

  /**
   * Add Testing Results sheet
   */
  addTestingResultsSheet(workbook, engagement) {
    const testingData = [
      ['TESTING RESULTS SUMMARY', ''],
      ['', ''],
      ['Procedure', 'Total Items', 'Sample Size', 'Items Tested', 'Passed', 'Failed', 'Exception Rate', 'Risk Level'],
      ['Revenue Recognition (IFRS 15)', 500, 50, 50, 48, 2, '4%', 'HIGH'],
      ['Receivables Confirmation', 300, 50, 50, 49, 1, '2%', 'MEDIUM'],
      ['Inventory Observation', 1000, 100, 100, 98, 2, '2%', 'MEDIUM'],
      ['Fixed Assets Additions', 150, 30, 30, 30, 0, '0%', 'LOW'],
      ['Payables Cutoff', 200, 40, 40, 40, 0, '0%', 'LOW'],
      ['Control Testing - Revenue Cycle', 50, 50, 50, 49, 1, '2%', 'MEDIUM'],
      ['Control Testing - Payables Cycle', 50, 50, 50, 50, 0, '0%', 'LOW'],
      ['', '', '', '', '', '', '', ''],
      ['SUMMARY METRICS', ''],
      ['Total Procedures Completed:', 7],
      ['Total Items Tested:', 360],
      ['Total Exceptions Found:', 6],
      ['Overall Exception Rate:', '1.67%'],
      ['High Risk Items:', 1],
      ['Medium Risk Items:', 3],
      ['Low Risk Items:', 3],
    ];

    const ws = XLSX.utils.aoa_to_sheet(testingData);
    ws['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, ws, 'Testing Results');
  }

  /**
   * Add Audit Trail sheet
   */
  addAuditTrailSheet(workbook, engagement) {
    const auditTrailData = [
      ['AUDIT TRAIL', ''],
      ['', ''],
      ['Date', 'Time', 'Event', 'User', 'Details', 'Status'],
      ['2024-01-05', '09:30', 'Phase 1 Started', 'Partner', 'Engagement Planning', 'Complete'],
      ['2024-01-06', '14:00', 'Entity Understanding', 'Manager', 'Business overview completed', 'Complete'],
      ['2024-01-07', '10:15', 'Materiality Calculated', 'Senior Auditor', 'Overall Materiality: ₹12.5M', 'Complete'],
      ['2024-01-08', '11:45', 'Fraud Brainstorming', 'Team', '5 significant risks identified', 'Complete'],
      ['2024-01-09', '15:30', 'Control Environment Assessed', 'Manager', 'COSO Framework: Effective', 'Complete'],
      ['2024-01-12', '09:00', 'Phase 2 Started', 'Partner', 'Risk Assessment & Planning', 'In Progress'],
      ['2024-01-12', '10:30', 'Risk Assessment Complete', 'Senior Auditor', '8 significant risks identified', 'Complete'],
      ['2024-01-13', '14:00', 'Audit Program Generated', 'Manager', 'Program for 4 phases ready', 'Complete'],
      ['2024-01-15', '09:00', 'Phase 3 Started', 'Partner', 'Interim Audit Work', 'In Progress'],
      ['2024-01-15', '11:00', 'Control Testing Started', 'Junior Auditor', 'Revenue cycle controls', 'In Progress'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(auditTrailData);
    ws['!cols'] = [{ wch: 12 }, { wch: 10 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, ws, 'Audit Trail');
  }

  /**
   * Add Findings sheet
   */
  addFindingsSheet(workbook, engagement) {
    const findingsData = [
      ['FINDINGS & EXCEPTIONS', ''],
      ['', ''],
      ['Finding ID', 'FSLI', 'Procedure', 'Severity', 'Description', 'Amount', 'Root Cause', 'Recommended Action', 'Status'],
      ['FI-001', 'Revenue', 'Revenue Recognition Testing', 'HIGH', '2 complex revenue contracts not fully tested per IFRS 15', '₹50,000', 'Incomplete documentation', 'Enhanced testing of performance obligations', 'Open'],
      ['FI-002', 'Receivables', 'Receivables Confirmation', 'MEDIUM', '1 customer confirmation not received, replaced with alternative procedure', '₹30,000', 'Customer non-response', 'Review subsequent payment', 'Closed'],
      ['FI-003', 'Inventory', 'Inventory Observation', 'MEDIUM', '2 items in inventory appear to be obsolete', '₹45,000', 'Slow-moving inventory', 'Request management write-down assessment', 'Pending Action'],
      ['FI-004', 'Controls', 'Control Testing - Revenue', 'MEDIUM', '1 manual revenue entry not properly authorized', '₹5,000', 'Control gap in authorization', 'Recommend process improvement', 'Open'],
      ['', '', '', '', '', '', '', '', ''],
      ['SUMMARY', ''],
      ['Total Findings:', 4],
      ['High Severity:', 1],
      ['Medium Severity:', 3],
      ['Low Severity:', 0],
      ['Total Exposure (Quantified):', '₹130,000'],
      ['Percentage of Overall Materiality:', '1.04%'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(findingsData);
    ws['!cols'] = [{ wch: 12 }, { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 35 }, { wch: 12 }, { wch: 20 }, { wch: 25 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, ws, 'Findings');
  }

  /**
   * Add Risk Assessment sheet
   */
  addRiskAssessmentSheet(workbook, engagement) {
    const riskData = [
      ['RISK ASSESSMENT MATRIX', ''],
      ['', ''],
      ['Risk Area', 'Inherent Risk', 'Control Risk', 'Audit Risk', 'Risk Level', 'Planned Procedures', 'Hours Allocated'],
      ['Revenue Recognition', 'High', 'Medium', 'HIGH', 'HIGH', 'Detailed IFRS 15 testing, contract review', 40],
      ['Receivables Collectability', 'High', 'Low', 'MEDIUM', 'MEDIUM', 'Confirmation, aging analysis, ECL testing', 30],
      ['Inventory Valuation', 'Medium', 'Medium', 'MEDIUM', 'MEDIUM', 'Observation, NRV testing, aging review', 25],
      ['Fixed Assets Impairment', 'Medium', 'Low', 'LOW', 'LOW', 'Analytical procedures, management assessment', 15],
      ['Payables Completeness', 'Low', 'High', 'MEDIUM', 'MEDIUM', 'Cutoff testing, vendor confirmations', 20],
      ['Management Override', 'High', 'Medium', 'HIGH', 'HIGH', 'Journal entry testing, management fee review', 25],
      ['', '', '', '', '', '', ''],
      ['FRAUD RISK ASSESSMENT', ''],
      ['Fraud Risk Factor', 'Rating', 'Mitigating Factors', 'Planned Response'],
      ['Financial Performance Pressure', 'High', 'Strong cash position, stable growth', 'Enhanced revenue testing'],
      ['Customer Concentration Risk', 'High', 'Top 5 customers = 45% revenue', 'Detailed contract review'],
      ['Complex Transactions', 'Medium', 'Experienced management', 'Technical accounting review'],
      ['History of Fraud', 'Low', 'No history identified', 'Standard procedures'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(riskData);
    ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 35 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, ws, 'Risk Assessment');
  }

  /**
   * Add Materiality sheet
   */
  addMaterialitySheet(workbook, engagement) {
    const materialityData = [
      ['MATERIALITY CALCULATION', ''],
      ['', ''],
      ['OVERALL MATERIALITY', ''],
      ['Benchmark', 'Amount (₹)', 'Percentage', 'Calculated Amount (₹)', 'Ranking'],
      ['Revenue', 250000000, '5%', 12500000, '1st'],
      ['Gross Profit', 75000000, '5%', 3750000, '4th'],
      ['EBIT', 50000000, '10%', 5000000, '3rd'],
      ['Net Income', 30000000, '10%', 3000000, '5th'],
      ['Total Equity', 100000000, '5%', 5000000, '3rd'],
      ['', '', '', '', ''],
      ['Selected Overall Materiality:', '', '', 12500000],
      ['Rationale:', '', '', 'Revenue selected as most relevant benchmark'],
      ['', '', '', '', ''],
      ['PERFORMANCE MATERIALITY & TRIVIAL THRESHOLDS', ''],
      ['Overall Materiality (OM):', 12500000],
      ['Performance Materiality (75% of OM):', 9375000],
      ['Clearly Trivial Threshold (5% of OM):', 625000],
      ['', ''],
      ['SPECIFIC MATERIALITY BY ACCOUNT', ''],
      ['Account', 'Book Amount', 'Materiality (% of OM)', 'Specific Materiality'],
      ['Cash & Bank', 50000000, '50%', 6250000],
      ['Trade Receivables', 80000000, '60%', 7500000],
      ['Inventory', 30000000, '40%', 5000000],
      ['Fixed Assets', 40000000, '30%', 3750000],
      ['Trade Payables', 20000000, '50%', 6250000],
      ['Loans & Borrowings', 35000000, '60%', 7500000],
      ['Revenue', 250000000, '100%', 12500000],
    ];

    const ws = XLSX.utils.aoa_to_sheet(materialityData);
    ws['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 15 }, { wch: 20 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(workbook, ws, 'Materiality');
  }
}

export default AuditExcelExportService;
