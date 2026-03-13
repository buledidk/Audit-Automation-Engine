import React, { useState } from 'react';
import WorksheetHeader from './WorksheetTemplates';

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * C1 WORKSHEET - TRIAL BALANCE & LEAD SCHEDULES
 * Complete, production-quality audit workpaper
 * ISA 500 - Audit Evidence
 * ═════════════════════════════════════════════════════════════════════════════
 *
 * Purpose: Reconcile the trial balance to the general ledger and financial
 * statements. Test lead schedule completeness and accuracy. Ensure all
 * accounts are properly identified, classified, and reconciled.
 *
 * Key Assertions Tested:
 * - Existence: All accounts in TB exist in GL
 * - Completeness: All GL accounts included in TB
 * - Accuracy: TB cast is correct, accounts reconcile to FS
 * - Cutoff: Accounts properly recorded in correct period
 */

const COLORS = {
  bg: '#0A0E17',
  sidebar: '#0F1622',
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  accent: '#F5A623',
  text: '#F8F8F8',
  dim: 'rgba(255,255,255,0.6)',
  faint: 'rgba(255,255,255,0.3)',
  green: '#66BB6A',
  red: '#EF5350',
  orange: '#FFA726',
  blue: '#42A5F5',
  yellow: '#FFD54F',
  purple: '#CE93D8'
};

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * C1 WORKSHEET COMPONENT
 * ═════════════════════════════════════════════════════════════════════════════
 */

export function C1_TrialBalance() {
  const [wsData, setWsData] = useState({
    // Header
    entityName: 'ABC Manufacturing Ltd',
    yearEnd: '2024-12-31',
    period: '12 months ended 31 December 2024',
    wpRef: 'C1',
    wsTitle: 'Trial Balance & Lead Schedules Reconciliation',
    riskLevel: 'Medium',
    preparer: { name: 'Sarah Johnson', initials: 'SJ', date: '2025-01-20' },
    reviewer: { name: 'John Davis', initials: 'JD', date: '' },
    assertion: 'Accuracy',
    partnerApproval: '',

    // Objective & Scope
    objective: 'To verify that the trial balance as at 31 December 2024 is accurately cast, properly reconciles to the general ledger and financial statements, and that all material GL accounts are included with appropriate classification.',
    glAccounts: '1000-1999 (Assets), 2000-2999 (Liabilities), 3000-3999 (Equity), 4000-4999 (Revenue), 5000-5999 (Expenses)',
    bsDescription: 'All balance sheet accounts per trial balance',
    assertionsTested: 'Existence - all TB accounts exist in GL; Completeness - all GL accounts included in TB; Accuracy - TB cast correct, trace to FS; Classification - accounts properly classified as assets/liabilities/equity',
    overallMateriality: '£500,000',
    performanceMateriality: '£375,000',
    trivialThreshold: '£25,000',
    reliedOnControls: 'Yes',
    keyControls: 'Monthly trial balance reconciliation by finance team; GL reconciliation process; Account reviews by finance manager',
    testingApproach: '100% Testing',

    // Procedures
    procedures: [
      {
        id: 'C1.1',
        description: 'Cast trial balance - verify mathematical accuracy of debit and credit columns',
        assertion: 'Accuracy',
        plannedSampleSize: '1',
        actualSampleSize: '1',
        selectionMethod: 'N/A - Full Balance',
        populationTotal: '285 accounts',
        populationValue: '£8,750,000',
        evidenceReference: 'Excel file: TB_31Dec2024_Final.xlsx; WP reference C1.1',
        exceptionsFound: 0,
        exceptionTypes: 'None',
        conclusion: 'Y'
      },
      {
        id: 'C1.2',
        description: 'Trace trial balance accounts to general ledger and verify existence of all accounts',
        assertion: 'Existence, Accuracy',
        plannedSampleSize: '285',
        actualSampleSize: '285',
        selectionMethod: 'Full population',
        populationTotal: '285 GL accounts',
        populationValue: 'All',
        evidenceReference: 'GL trial balance listing vs system export; spot checks on 10 material accounts',
        exceptionsFound: 0,
        exceptionTypes: 'None',
        conclusion: 'Y'
      },
      {
        id: 'C1.3',
        description: 'Reconcile trial balance to financial statements - debit/credit columns and opening/closing balances',
        assertion: 'Completeness, Accuracy',
        plannedSampleSize: '1',
        actualSampleSize: '1',
        selectionMethod: 'N/A',
        populationTotal: 'Trial balance as a whole',
        populationValue: '£8,750,000',
        evidenceReference: 'TB reconciliation working paper; FS extract; Movement schedule',
        exceptionsFound: 0,
        exceptionTypes: 'None',
        conclusion: 'Y'
      },
      {
        id: 'C1.4',
        description: 'Review unusual accounts - identify and question non-standard GL accounts; verify classification',
        assertion: 'Classification, Existence',
        plannedSampleSize: '15',
        actualSampleSize: '15',
        selectionMethod: 'Judgmental - all accounts with unusual names or balances',
        populationTotal: '~15 unusual accounts identified',
        populationValue: '£125,000',
        evidenceReference: 'Unusual accounts list; management inquiry summary; Account coding review',
        exceptionsFound: 0,
        exceptionTypes: 'None',
        conclusion: 'Y'
      },
      {
        id: 'C1.5',
        description: 'Movement analysis - verify opening balances (tie to prior year FS) and closing balances (tie to current year)',
        assertion: 'Completeness, Accuracy, Cutoff',
        plannedSampleSize: '50',
        actualSampleSize: '50',
        selectionMethod: 'Risk-based - material accounts, high turnover, unusual items',
        populationTotal: '285 accounts',
        populationValue: '£8,750,000',
        evidenceReference: 'Movement schedule by account; Prior year FS tie-off; GL movement verification',
        exceptionsFound: 0,
        exceptionTypes: 'None',
        conclusion: 'Y'
      }
    ],

    // Results
    populationItems: '285',
    populationValue: '£8,750,000',
    selectionMethod: 'Full and sample testing per procedure',
    samplingTool: 'Excel - stratified by materiality',
    testedBy: 'Sarah Johnson, 20 Jan 2025',
    exceptionDetails: 'No exceptions identified. All procedures performed with satisfactory results. Trial balance is accurate and properly reconciles to the financial statements.',

    // Assertion Matrix
    assertionMatrix: [
      {
        assertion: 'Existence',
        procedures: 'C1.2',
        evidence: 'GL export compared to TB; All 285 accounts traced to GL with no unmatched items',
        risk: 'Risk that TB includes accounts that do not exist in GL (data entry error, duplicate accounts)',
        conclusion: 'Y'
      },
      {
        assertion: 'Completeness',
        procedures: 'C1.2, C1.3, C1.5',
        evidence: 'Full TB cast verified; opening/closing reconciliation complete; GL to FS tie-off confirmed',
        risk: 'Risk that material GL accounts are excluded from TB (completeness of reporting)',
        conclusion: 'Y'
      },
      {
        assertion: 'Accuracy',
        procedures: 'C1.1, C1.3, C1.4',
        evidence: 'TB cast verified; account balances reconcile to GL and FS; sample of unusual accounts reviewed',
        risk: 'Risk that TB contains mathematical errors or incorrect amounts (data quality)',
        conclusion: 'Y'
      },
      {
        assertion: 'Cutoff',
        procedures: 'C1.5',
        evidence: 'Opening balances reconciled to prior year FS (31 Dec 2023); Closing balances to current FS (31 Dec 2024)',
        risk: 'Risk that transactions recorded in wrong period affecting year-end balances',
        conclusion: 'Y'
      }
    ],

    // Evidence
    evidence: [
      {
        type: 'Document Review',
        source: 'Trial Balance Extract - 31 Dec 2024',
        summary: 'Complete trial balance with 285 accounts, total debits £8,500,000, total credits £8,250,000. Debit less credit = Net £250,000 equity balance.',
        dateObtained: '2025-01-15',
        reliability: 'Reliable',
        fileRef: 'H:\\Audit\\ABC_Ltd\\2024\\TB_31Dec2024_Final.xlsx'
      },
      {
        type: 'Document Review',
        source: 'General Ledger Listing',
        summary: 'Complete GL extract showing all 285 accounts with opening balance, movements during year, and closing balance. Tie-off to TB successful.',
        dateObtained: '2025-01-15',
        reliability: 'Reliable',
        fileRef: 'H:\\Audit\\ABC_Ltd\\2024\\GL_Listing_31Dec2024.xlsx'
      },
      {
        type: 'Document Review',
        source: 'Financial Statements',
        summary: 'Draft FS as at 31 Dec 2024. Tested reconciliation of key balance sheet lines to TB. All amounts agreed without variance.',
        dateObtained: '2025-01-20',
        reliability: 'Reliable',
        fileRef: 'H:\\Audit\\ABC_Ltd\\2024\\Draft_FS_31Dec2024.pdf'
      },
      {
        type: 'Recalculation',
        source: 'TB Cast Verification',
        summary: 'Re-performed the mathematical casting of trial balance - total debits and credits. Debits: £8,500,000 (confirmed); Credits: £8,250,000 (confirmed); Balancing figure correct.',
        dateObtained: '2025-01-20',
        reliability: 'Reliable',
        fileRef: 'H:\\Audit\\ABC_Ltd\\2024\\C1.1_TB_Cast_Verification.xlsx'
      },
      {
        type: 'Inquiry',
        source: 'Management - Finance Manager',
        summary: 'Inquired regarding unusual accounts and significant year-end adjustments. Management confirmed all accounts are standard and recurring. No unusual items identified.',
        dateObtained: '2025-01-18',
        reliability: 'Conditional',
        fileRef: 'H:\\Audit\\ABC_Ltd\\2024\\C1.4_Management_Inquiry_Notes.docx'
      }
    ],

    // Sensitive Areas
    keyJudgments: 'Assessment that 100% testing of TB accounts is appropriate due to the control environment (strong - monthly reconciliations performed by finance team with management review). The risk of misstatement is assessed as Medium due to the volume of accounts and complexity of GL coding, but this is mitigated by the strong control environment.',
    assumptions: 'Assumed that the GL system is the source of truth and is properly maintained. Assumed that the TB is a direct export from the GL with no manual adjustments (or all manual adjustments are properly documented and approved).',
    alternativeApproaches: 'Considered using a risk-based sample approach (testing 50 material accounts by value), but determined that 100% testing is appropriate given the control reliance and the significance of TB accuracy to the overall audit. The cost/benefit ratio is favorable given the criticality of this area.',
    challengePoints: 'No significant challenge points. Management confirmed all accounts are standard and recurring. No unusual or contentious items identified. Management was fully cooperative with our inquiries.',

    // Controls
    keyControls: 'Key controls include: (1) Monthly TB reconciliation performed by finance team; (2) GL account master list maintained and reviewed by finance manager; (3) Unusual accounts reviewed by finance manager before inclusion in TB; (4) Opening balances reconciled to prior year FS by finance team.',
    controlGaps: 'No significant control gaps identified. There is strong segregation of duties between transaction processing and reconciliation. Regular management oversight of the GL and TB process.',
    designEffectiveness: 'Yes',
    operatingEffectiveness: 'Yes',
    relianceDecision: 'Yes',

    // Conclusion
    conclusionText: 'Based on our comprehensive audit procedures, including (1) verification of TB mathematical accuracy, (2) reconciliation to GL and FS, (3) 100% account existence testing, (4) review of unusual accounts, and (5) movement analysis, we are satisfied that the Trial Balance as at 31 December 2024 is accurate, complete, and properly reflects the financial position of ABC Manufacturing Ltd. All material assertions have been tested and satisfied.',
    nextSteps: 'None. This worksheet is complete and ready for review. Lead schedules by account category should be completed in separate worksheets (C2-Asset Lead Schedule, C3-Liability Lead Schedule, etc.)',
    status: 'Complete',
    signOff: 'JD, 22/01/2025',

    // Comments
    comments: {
      objective: [
        {
          author: 'John Davis (Reviewer)',
          date: '2025-01-22',
          text: 'Good scope definition. Clear linkage to the risk assessment. Materiality levels appropriately set.'
        }
      ],
      procedures: [
        {
          author: 'Sarah Johnson (Preparer)',
          date: '2025-01-20',
          text: 'All procedures performed efficiently. Testing completed within estimated hours.'
        }
      ],
      results: [
        {
          author: 'John Davis (Reviewer)',
          date: '2025-01-22',
          text: 'Zero exceptions identified. Results are very clean. Conclusion is well supported by the evidence.'
        }
      ]
    }
  });

  const updateWS = (field, value) => {
    setWsData({ ...wsData, [field]: value });
  };

  return (
    <div style={{
      background: COLORS.bg,
      color: COLORS.text,
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: '1.5'
    }}>
      {/* Page Header */}
      <div style={{
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: `2px solid ${COLORS.accent}`
      }}>
        <h1 style={{
          color: COLORS.accent,
          margin: '0 0 8px 0',
          fontSize: '24px',
          fontWeight: 700
        }}>
          C1 - Trial Balance & Lead Schedules
        </h1>
        <p style={{ color: COLORS.dim, margin: '0', fontSize: '12px' }}>
          ISA 500 (Audit Evidence) | Reconciliation of TB to GL and Financial Statements
        </p>
      </div>

      {/* 1. WORKSHEET HEADER */}
      <C1Header wsData={wsData} updateWS={updateWS} />

      {/* 2. OBJECTIVE & SCOPE */}
      <C1ObjectiveScope wsData={wsData} updateWS={updateWS} />

      {/* 3. PROCEDURE EXECUTION */}
      <C1ProcedureExecution wsData={wsData} updateWS={updateWS} />

      {/* 4. TESTING RESULTS SUMMARY */}
      <C1ResultsSummary wsData={wsData} updateWS={updateWS} />

      {/* 5. ASSERTION TESTING MATRIX */}
      <C1AssertionMatrix wsData={wsData} updateWS={updateWS} />

      {/* 6. EVIDENCE DOCUMENTATION */}
      <C1EvidenceDocumentation wsData={wsData} updateWS={updateWS} />

      {/* 7. SENSITIVE AREAS & JUDGMENTS */}
      <C1SensitiveAreas wsData={wsData} updateWS={updateWS} />

      {/* 8. RISKS & CONTROLS */}
      <C1RisksAndControls wsData={wsData} updateWS={updateWS} />

      {/* 9. WORKPAPER CONCLUSION */}
      <C1Conclusion wsData={wsData} updateWS={updateWS} />

      {/* Export Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginTop: '24px'
      }}>
        <ExportButton format="PDF" color={COLORS.red} wsData={wsData} />
        <ExportButton format="Excel" color={COLORS.green} wsData={wsData} />
        <ExportButton format="Word" color={COLORS.blue} wsData={wsData} />
        <ExportButton format="Print" color={COLORS.orange} wsData={wsData} />
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// C1 SPECIFIC COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

function C1Header({ wsData, updateWS }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `2px solid ${COLORS.accent}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{
        color: COLORS.accent,
        margin: '0 0 16px 0',
        fontSize: '13px',
        textTransform: 'uppercase',
        fontWeight: 700
      }}>
        1. WORKSHEET HEADER
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <ReadOnlyField label="Entity Name" value={wsData.entityName} />
        <ReadOnlyField label="Year End" value={wsData.yearEnd} />
        <ReadOnlyField label="Reporting Period" value={wsData.period} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '16px',
        marginBottom: '16px',
        paddingTop: '16px',
        borderTop: `1px solid ${COLORS.border}`
      }}>
        <ReadOnlyField label="WP Reference" value={wsData.wpRef} />
        <ReadOnlyField label="Title" value={wsData.wsTitle} />
        <ReadOnlyField label="Risk Level" value={wsData.riskLevel} />
      </div>

      {/* Sign-off */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        paddingTop: '16px',
        borderTop: `1px solid ${COLORS.border}`
      }}>
        <div style={{ paddingRight: '16px', borderRight: `1px solid ${COLORS.border}` }}>
          <p style={{ color: COLORS.dim, fontSize: '10px', margin: '0 0 8px 0', fontWeight: 600 }}>PREPARED BY</p>
          <p style={{ color: COLORS.text, margin: '4px 0', fontSize: '11px' }}><strong>{wsData.preparer.name}</strong></p>
          <p style={{ color: COLORS.dim, margin: '0', fontSize: '10px' }}>{wsData.preparer.initials} | {wsData.preparer.date}</p>
        </div>

        <div style={{ paddingRight: '16px', borderRight: `1px solid ${COLORS.border}` }}>
          <p style={{ color: COLORS.dim, fontSize: '10px', margin: '0 0 8px 0', fontWeight: 600 }}>REVIEWED BY</p>
          <p style={{ color: COLORS.text, margin: '4px 0', fontSize: '11px' }}><strong>{wsData.reviewer.name || 'Pending'}</strong></p>
          <p style={{ color: COLORS.dim, margin: '0', fontSize: '10px' }}>{wsData.reviewer.initials || '-- '} | {wsData.reviewer.date || '-- '}</p>
        </div>

        <div>
          <p style={{ color: COLORS.dim, fontSize: '10px', margin: '0 0 8px 0', fontWeight: 600 }}>ASSERTION TESTED</p>
          <p style={{ color: COLORS.accent, margin: '4px 0', fontSize: '11px', fontWeight: 600 }}>{wsData.assertion}</p>
          <p style={{ color: COLORS.green, margin: '0', fontSize: '10px' }}>Primary focus of testing</p>
        </div>
      </div>
    </div>
  );
}

function C1ObjectiveScope({ wsData, updateWS }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        2. OBJECTIVE & SCOPE
      </h3>

      <div style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
        <div>
          <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>AUDIT OBJECTIVE</p>
          <div style={{
            background: COLORS.bg,
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text,
            fontSize: '11px',
            lineHeight: '1.6'
          }}>
            {wsData.objective}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>GL ACCOUNTS</p>
            <div style={{
              background: COLORS.bg,
              padding: '8px',
              borderRadius: '4px',
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
              fontSize: '11px'
            }}>
              {wsData.glAccounts}
            </div>
          </div>

          <div>
            <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>BALANCE SHEET DESC</p>
            <div style={{
              background: COLORS.bg,
              padding: '8px',
              borderRadius: '4px',
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
              fontSize: '11px'
            }}>
              {wsData.bsDescription}
            </div>
          </div>
        </div>

        <div>
          <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>ASSERTIONS TESTED</p>
          <div style={{
            background: COLORS.bg,
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text,
            fontSize: '11px',
            lineHeight: '1.6'
          }}>
            {wsData.assertionsTested}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div>
            <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>OVERALL MATERIALITY</p>
            <div style={{ color: COLORS.accent, fontSize: '12px', fontWeight: 700 }}>{wsData.overallMateriality}</div>
          </div>
          <div>
            <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>PERFORMANCE MATERIALITY (75%)</p>
            <div style={{ color: COLORS.yellow, fontSize: '12px', fontWeight: 700 }}>{wsData.performanceMateriality}</div>
          </div>
          <div>
            <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>TRIVIAL THRESHOLD (5%)</p>
            <div style={{ color: COLORS.orange, fontSize: '12px', fontWeight: 700 }}>{wsData.trivialThreshold}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function C1ProcedureExecution({ wsData, updateWS }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        3. PROCEDURE EXECUTION
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '10px',
          background: COLORS.bg,
          borderRadius: '6px'
        }}>
          <thead>
            <tr style={{ background: COLORS.sidebar, borderBottom: `2px solid ${COLORS.accent}` }}>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 700 }}>Procedure</th>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 700 }}>Description</th>
              <th style={{ padding: '8px', textAlign: 'center', color: COLORS.accent, fontWeight: 700 }}>Planned</th>
              <th style={{ padding: '8px', textAlign: 'center', color: COLORS.accent, fontWeight: 700 }}>Actual</th>
              <th style={{ padding: '8px', textAlign: 'center', color: COLORS.accent, fontWeight: 700 }}>Exceptions</th>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 700 }}>Conclusion</th>
            </tr>
          </thead>
          <tbody>
            {wsData.procedures.map((proc, idx) => (
              <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '8px', color: COLORS.accent, fontWeight: 600 }}>{proc.id}</td>
                <td style={{ padding: '8px', color: COLORS.dim, fontSize: '9px' }}>{proc.description}</td>
                <td style={{ padding: '8px', textAlign: 'center', color: COLORS.text }}>{proc.plannedSampleSize}</td>
                <td style={{ padding: '8px', textAlign: 'center', color: COLORS.text }}>{proc.actualSampleSize}</td>
                <td style={{
                  padding: '8px',
                  textAlign: 'center',
                  color: proc.exceptionsFound > 0 ? COLORS.red : COLORS.green,
                  fontWeight: 600
                }}>
                  {proc.exceptionsFound}
                </td>
                <td style={{
                  padding: '8px',
                  color: proc.conclusion === 'Y' ? COLORS.green : COLORS.red,
                  fontWeight: 600
                }}>
                  {proc.conclusion === 'Y' ? '✓ PASS' : '✗ FAIL'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${COLORS.border}` }}>
        <p style={{ color: COLORS.dim, fontSize: '10px', margin: 0 }}>
          <strong>Evidence Reference:</strong> {wsData.testedBy}
        </p>
      </div>
    </div>
  );
}

function C1ResultsSummary({ wsData, updateWS }) {
  const totalExceptions = wsData.procedures.reduce((sum, p) => sum + (p.exceptionsFound || 0), 0);
  const totalProcedures = wsData.procedures.length;
  const passedProcedures = wsData.procedures.filter(p => p.conclusion === 'Y').length;

  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        4. TESTING RESULTS SUMMARY
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <SummaryBox label="Total Procedures" value={totalProcedures} color={COLORS.blue} />
        <SummaryBox label="Procedures Passed" value={passedProcedures} color={COLORS.green} />
        <SummaryBox label="Exceptions Found" value={totalExceptions} color={totalExceptions > 0 ? COLORS.red : COLORS.green} />
        <SummaryBox label="Exception Rate" value={totalExceptions > 0 ? ((totalExceptions / totalProcedures) * 100).toFixed(1) + '%' : '0.0%'} color={totalExceptions > 0 ? COLORS.red : COLORS.green} />
      </div>

      <div style={{
        background: COLORS.bg,
        padding: '12px',
        borderRadius: '6px',
        border: `1px solid ${COLORS.border}`,
        color: COLORS.text,
        fontSize: '11px',
        lineHeight: '1.6'
      }}>
        <strong>Exception Details:</strong> {wsData.exceptionDetails || 'No exceptions identified.'}
      </div>
    </div>
  );
}

function C1AssertionMatrix({ wsData, updateWS }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        5. ASSERTION TESTING MATRIX
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '9px',
          background: COLORS.bg,
          borderRadius: '6px'
        }}>
          <thead>
            <tr style={{ background: COLORS.sidebar, borderBottom: `2px solid ${COLORS.accent}` }}>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 700, width: '15%' }}>Assertion</th>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 700, width: '20%' }}>Procedures</th>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 700, width: '25%' }}>Evidence</th>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 700, width: '25%' }}>Risk Addressed</th>
              <th style={{ padding: '8px', textAlign: 'center', color: COLORS.accent, fontWeight: 700, width: '8%' }}>Conclusion</th>
            </tr>
          </thead>
          <tbody>
            {wsData.assertionMatrix.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '8px', color: COLORS.accent, fontWeight: 600 }}>{row.assertion}</td>
                <td style={{ padding: '8px', color: COLORS.text }}>{row.procedures}</td>
                <td style={{ padding: '8px', color: COLORS.dim, lineHeight: '1.4 ' }}>{row.evidence}</td>
                <td style={{ padding: '8px', color: COLORS.dim, fontSize: '8px', lineHeight: '1.4' }}>{row.risk}</td>
                <td style={{
                  padding: '8px',
                  textAlign: 'center',
                  color: row.conclusion === 'Y' ? COLORS.green : COLORS.red,
                  fontWeight: 700
                }}>
                  {row.conclusion === 'Y' ? '✓' : '✗'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function C1EvidenceDocumentation({ wsData, updateWS }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        6. EVIDENCE DOCUMENTATION (ISA 500)
      </h3>

      {wsData.evidence.map((ev, idx) => (
        <div key={idx} style={{
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '8px' }}>
            <div>
              <p style={{ color: COLORS.dim, fontSize: '9px', fontWeight: 600, margin: '0 0 2px 0' }}>Type</p>
              <p style={{ color: COLORS.accent, fontSize: '10px', margin: 0, fontWeight: 600 }}>{ev.type}</p>
            </div>
            <div>
              <p style={{ color: COLORS.dim, fontSize: '9px', fontWeight: 600, margin: '0 0 2px 0' }}>Source</p>
              <p style={{ color: COLORS.text, fontSize: '10px', margin: 0 }}>{ev.source}</p>
            </div>
            <div>
              <p style={{ color: COLORS.dim, fontSize: '9px', fontWeight: 600, margin: '0 0 2px 0' }}>Date Obtained</p>
              <p style={{ color: COLORS.text, fontSize: '10px', margin: 0 }}>{ev.dateObtained}</p>
            </div>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <p style={{ color: COLORS.dim, fontSize: '9px', fontWeight: 600, margin: '0 0 2px 0' }}>Summary</p>
            <p style={{ color: COLORS.text, fontSize: '10px', margin: '0', lineHeight: '1.4' }}>{ev.summary}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '9px' }}>
            <div>
              <span style={{ color: COLORS.dim, fontWeight: 600 }}>Reliability: </span>
              <span style={{
                color: ev.reliability === 'Reliable' ? COLORS.green : COLORS.yellow,
                fontWeight: 600
              }}>
                {ev.reliability}
              </span>
            </div>
            <div style={{ color: COLORS.faint }}>
              <span style={{ fontWeight: 600 }}>File Ref: </span>{ev.fileRef}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function C1SensitiveAreas({ wsData, updateWS }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        7. SENSITIVE AREAS & KEY JUDGMENTS
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
        <div>
          <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>KEY JUDGMENTS</p>
          <div style={{
            background: COLORS.bg,
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text,
            fontSize: '10px',
            lineHeight: '1.5'
          }}>
            {wsData.keyJudgments}
          </div>
        </div>

        <div>
          <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>ASSUMPTIONS</p>
          <div style={{
            background: COLORS.bg,
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text,
            fontSize: '10px',
            lineHeight: '1.5'
          }}>
            {wsData.assumptions}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>ALTERNATIVE APPROACHES</p>
          <div style={{
            background: COLORS.bg,
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text,
            fontSize: '10px',
            lineHeight: '1.5'
          }}>
            {wsData.alternativeApproaches}
          </div>
        </div>

        <div>
          <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>CHALLENGE POINTS</p>
          <div style={{
            background: COLORS.bg,
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text,
            fontSize: '10px',
            lineHeight: '1.5'
          }}>
            {wsData.challengePoints}
          </div>
        </div>
      </div>
    </div>
  );
}

function C1RisksAndControls({ wsData, updateWS }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        8. RISKS & CONTROLS ASSESSMENT
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>KEY CONTROLS</p>
          <div style={{
            background: COLORS.bg,
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text,
            fontSize: '10px',
            lineHeight: '1.5'
          }}>
            {wsData.keyControls}
          </div>
        </div>

        <div>
          <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>CONTROL GAPS</p>
          <div style={{
            background: COLORS.bg,
            padding: '8px',
            borderRadius: '4px',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text,
            fontSize: '10px',
            lineHeight: '1.5'
          }}>
            {wsData.controlGaps}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <StatusBox label="Design Effectiveness" value={wsData.designEffectiveness} />
        <StatusBox label="Operating Effectiveness" value={wsData.operatingEffectiveness} />
        <StatusBox label="Reliance Decision" value={wsData.relianceDecision} />
      </div>
    </div>
  );
}

function C1Conclusion({ wsData, updateWS }) {
  const allAssertionsSatisfied = wsData.assertionMatrix?.every(m => m.conclusion === 'Y');

  return (
    <div style={{
      background: COLORS.card,
      border: `2px solid ${allAssertionsSatisfied ? COLORS.green : COLORS.red}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{
        color: allAssertionsSatisfied ? COLORS.green : COLORS.red,
        margin: '0 0 16px 0',
        fontSize: '13px',
        fontWeight: 600
      }}>
        9. WORKPAPER CONCLUSION
      </h3>

      <div style={{
        background: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
        fontFamily: 'monospace',
        fontSize: '10px',
        lineHeight: '1.6',
        color: COLORS.text
      }}>
        <p style={{ margin: '0 0 8px 0' }}><strong>Conclusion:</strong></p>
        <p style={{ margin: '0', whiteSpace: 'pre-wrap' }}>{wsData.conclusionText}</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '16px',
        paddingTop: '16px',
        borderTop: `1px solid ${COLORS.border}`
      }}>
        <div>
          <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>NEXT STEPS</p>
          <p style={{ color: COLORS.text, fontSize: '10px', margin: 0, lineHeight: '1.5' }}>{wsData.nextSteps}</p>
        </div>

        <div>
          <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>STATUS & SIGN-OFF</p>
          <p style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 600, margin: '2px 0' }}>{wsData.status}</p>
          <p style={{ color: COLORS.text, fontSize: '10px', margin: '0' }}>{wsData.signOff}</p>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, margin: '0 0 4px 0' }}>{label}</p>
      <p style={{ color: COLORS.text, fontSize: '11px', margin: 0 }}><strong>{value}</strong></p>
    </div>
  );
}

function SummaryBox({ label, value, color }) {
  return (
    <div style={{
      background: COLORS.bg,
      border: `2px solid ${color}`,
      borderRadius: '8px',
      padding: '12px',
      textAlign: 'center'
    }}>
      <p style={{ color: COLORS.dim, fontSize: '10px', margin: '0 0 4px 0' }}>{label}</p>
      <p style={{ color: color, fontSize: '18px', fontWeight: 700, margin: 0 }}>{value}</p>
    </div>
  );
}

function StatusBox({ label, value }) {
  return (
    <div style={{
      background: COLORS.bg,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '8px',
      padding: '12px',
      textAlign: 'center'
    }}>
      <p style={{ color: COLORS.dim, fontSize: '9px', fontWeight: 600, margin: '0 0 4px 0' }}>{label}</p>
      <p style={{
        color: value === 'Yes' ? COLORS.green : COLORS.red,
        fontSize: '14px',
        fontWeight: 700,
        margin: 0
      }}>
        {value === 'Yes' ? '✓' : '✗'} {value}
      </p>
    </div>
  );
}

function ExportButton({ format, color, wsData }) {
  const handleExport = () => {
    alert(`Export to ${format} - Feature to be implemented. Would generate professional audit workpaper document.`);
  };

  return (
    <button onClick={handleExport} style={{
      padding: '12px 16px',
      background: color + '20',
      border: `2px solid ${color}`,
      borderRadius: '8px',
      color: color,
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'uppercase',
      transition: 'all 0.2s'
    }} onMouseOver={(e) => {
      e.target.style.background = color + '40';
    }} onMouseOut={(e) => {
      e.target.style.background = color + '20';
    }}>
      📄 Export {format}
    </button>
  );
}

export default C1_TrialBalance;
