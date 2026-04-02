/**
 * Enhanced Audit Excel Export Service
 * Generates per-FSLI working paper Excel files
 * Sheets: Lead Schedule, Risk Assessment, Procedures & Results, Sample Selection, Findings, Sign-Off Log
 */

import * as XLSX from 'xlsx';

export class EnhancedAuditExcelExportService {
  /**
   * Generate a per-FSLI working paper as an Excel Blob
   */
  generateFSLIWorkPaperExcel(engData, fsliId) {
    const engagement = engData || {};
    const fye = engagement.financialYearEnd || 'N/A';
    const entityName = engagement.entityName || 'Entity';
    const fsliLabel = fsliId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const signOffs = engagement.signOffs || {};
    const fsliSignOff = signOffs[fsliId] || {};
    const findings = (engagement.findings || []).filter(f => f.fsli === fsliId);
    const risks = engagement.risks?.[fsliId] || [];

    const wb = XLSX.utils.book_new();

    // Sheet 1: Lead Schedule
    const leadData = [
      ['Working Paper — Lead Schedule'],
      ['Entity:', entityName, '', 'FYE:', fye],
      ['FSLI:', fsliLabel, '', 'Date:', new Date().toISOString().split('T')[0]],
      [],
      ['Account', 'CY Balance', 'PY Balance', 'Movement', 'Movement %', 'Materiality Flag'],
      [fsliLabel, '', '', '', '', '']
    ];
    const wsLead = XLSX.utils.aoa_to_sheet(leadData);
    wsLead['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, wsLead, 'Lead Schedule');

    // Sheet 2: Risk Assessment
    const riskData = [
      ['Risk Assessment — ' + fsliLabel],
      [],
      ['Risk', 'Level', 'Assertion', 'Response', 'ISA Reference'],
      ...(risks.length > 0
        ? risks.map(r => [r.risk || String(r), r.level || 'Medium', r.assertion || 'E/C/V', r.response || 'Substantive', r.isaRef || 'ISA 315'])
        : [['No significant risks identified', 'Low', 'All', 'Standard', 'ISA 315']])
    ];
    const wsRisk = XLSX.utils.aoa_to_sheet(riskData);
    wsRisk['!cols'] = [{ wch: 35 }, { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsRisk, 'Risk Assessment');

    // Sheet 3: Procedures & Results
    const procData = [
      ['Procedures & Results — ' + fsliLabel],
      [],
      ['#', 'Procedure', 'ISA Ref', 'Sample Size', 'Items Tested', 'Exceptions', 'Result', 'Conclusion'],
      ['1', 'Substantive testing of balances', 'ISA 500', '25', '25', '0', 'Satisfactory', 'No issues'],
      ['2', 'Analytical review', 'ISA 520', 'N/A', 'N/A', '0', 'Satisfactory', 'Consistent with expectations']
    ];
    const wsProc = XLSX.utils.aoa_to_sheet(procData);
    wsProc['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, wsProc, 'Procedures & Results');

    // Sheet 4: Sample Selection
    const sampleData = [
      ['Sample Selection — ' + fsliLabel],
      [],
      ['Sampling Method:', 'Monetary Unit Sampling (MUS)'],
      ['Population:', ''],
      ['Materiality:', engagement.materiality?.overall_materiality || ''],
      ['Performance Materiality:', engagement.materiality?.performance_materiality || ''],
      ['Confidence Level:', '95%'],
      ['Expected Error Rate:', '1%'],
      ['Sample Size:', '25'],
      [],
      ['#', 'Item ID', 'Amount', 'Selected By', 'Tested', 'Result']
    ];
    const wsSample = XLSX.utils.aoa_to_sheet(sampleData);
    wsSample['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsSample, 'Sample Selection');

    // Sheet 5: Findings
    const findingsData = [
      ['Findings Log — ' + fsliLabel],
      [],
      ['#', 'Description', 'Severity', 'ISA Reference', 'Recommendation', 'Management Response', 'Status'],
      ...(findings.length > 0
        ? findings.map((f, i) => [i + 1, f.description || String(f), f.severity || 'Medium', f.isaRef || '', f.recommendation || '', f.managementResponse || '', f.status || 'Open'])
        : [['—', 'No findings identified', '—', '—', '—', '—', '—']])
    ];
    const wsFinding = XLSX.utils.aoa_to_sheet(findingsData);
    wsFinding['!cols'] = [{ wch: 5 }, { wch: 40 }, { wch: 10 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsFinding, 'Findings');

    // Sheet 6: Sign-Off Log
    const signOffData = [
      ['Sign-Off Log — ' + fsliLabel],
      [],
      ['Role', 'Name', 'Date', 'Status'],
      ['Preparer', fsliSignOff.preparedBy || '', fsliSignOff.preparedDate || '', fsliSignOff.status || 'Pending'],
      ['Reviewer', fsliSignOff.reviewedBy || '', fsliSignOff.reviewedDate || '', fsliSignOff.reviewedBy ? 'Reviewed' : 'Pending'],
      ['Partner', engagement.partner || '', '', 'Pending']
    ];
    const wsSign = XLSX.utils.aoa_to_sheet(signOffData);
    wsSign['!cols'] = [{ wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsSign, 'Sign-Off Log');

    // Generate buffer
    const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}

export default new EnhancedAuditExcelExportService();
