/**
 * enhancedWorkingPaperTemplateService.js
 *
 * Enhanced working paper template generation with integrated compliance guidance,
 * procedures, and assessment templates
 * Provides accurate, professional templates for all 6 core FSLIs
 * Includes ISA, FRS, IFRS requirements embedded in templates
 *
 * Version: 2.0.0
 * Created: March 2026
 */

import complianceContentService from './complianceContentService.js';
import agentAssignmentEngine from './agentAssignmentEngine.js';

export class EnhancedWorkingPaperTemplateService {
  /**
   * Generate comprehensive working paper template for an FSLI
   * @param {string} fsliId - FSLI identifier (C1, D1, D3, D4, D5, D6)
   * @param {object} engagementContext - Engagement details
   * @returns {object} Complete working paper template
   */
  generateWorkingPaperTemplate(fsliId, engagementContext = {}) {
    const compliance = complianceContentService.getComprehensiveGuidancePackage(fsliId, engagementContext);

    if (!compliance.success) {
      return { success: false, message: 'Failed to generate template' };
    }

    const assignments = agentAssignmentEngine.autoAssignAgents(fsliId, engagementContext);

    const template = {
      success: true,
      fsliId,
      label: compliance.data.label,
      generatedDate: new Date().toISOString(),
      workingPaperReference: fsliId,
      structure: {
        // Section 1: Header Information
        header: this.generateHeaderSection(fsliId, engagementContext),

        // Section 2: Objective & Scope
        objectiveAndScope: this.generateObjectiveSection(fsliId, compliance.data),

        // Section 3: Assigned Team & Roles
        assignedTeam: this.generateAssignedTeamSection(fsliId, assignments),

        // Section 4: ISA Standards & Guidance
        isaGuidance: this.generateISAGuidanceSection(fsliId, compliance.data),

        // Section 5: Compliance Requirements (FRS/IFRS)
        complianceRequirements: this.generateComplianceRequirementsSection(fsliId, compliance.data),

        // Section 6: Key Audit Matters
        keyAuditMatters: this.generateKeyAuditMattersSection(fsliId, compliance.data),

        // Section 7: Common Risks Assessment
        commonRisks: this.generateCommonRisksSection(fsliId, compliance.data),

        // Section 8: Procedures Checklist
        proceduresChecklist: this.generateProceduresChecklistSection(fsliId, compliance.data),

        // Section 9: Assertion Testing Matrix
        assertionMatrix: this.generateAssertionMatrixSection(fsliId),

        // Section 10: Results & Conclusion
        resultsAndConclusion: this.generateResultsSection(fsliId),

        // Section 11: Exception Summary
        exceptionSummary: this.generateExceptionSummarySection(),

        // Section 12: Evidence Index
        evidenceIndex: this.generateEvidenceIndexSection(fsliId),

        // Section 13: Sign-Off & Approvals
        signOff: this.generateSignOffSection(fsliId)
      }
    };

    return template;
  }

  /**
   * Generate header section template
   */
  generateHeaderSection(fsliId, engagementContext) {
    return {
      title: `WORKING PAPER: ${fsliId}`,
      fields: {
        clientName: {
          label: 'Client Name',
          value: engagementContext.clientName || '___________________',
          required: true
        },
        fiscalYearEnd: {
          label: 'Fiscal Year Ended',
          value: engagementContext.fiscalYearEnd || '___________________',
          required: true
        },
        workingPaperRef: {
          label: 'Working Paper Reference',
          value: fsliId,
          required: true
        },
        preparedBy: {
          label: 'Prepared By',
          value: '___________________',
          required: true
        },
        preparedDate: {
          label: 'Date Prepared',
          value: '___________________',
          required: true
        },
        reviewedBy: {
          label: 'Reviewed By',
          value: '___________________',
          required: true
        },
        reviewDate: {
          label: 'Date Reviewed',
          value: '___________________',
          required: true
        },
        riskLevel: {
          label: 'Risk Level',
          value: 'High / Medium / Low',
          required: true
        },
        materiality: {
          label: 'Materiality Threshold',
          value: engagementContext.materiality || '___________________',
          required: true
        }
      }
    };
  }

  /**
   * Generate objective & scope section
   */
  generateObjectiveSection(fsliId, complianceData) {
    return {
      title: 'OBJECTIVE & SCOPE',
      objective: `To obtain sufficient, appropriate audit evidence regarding the completeness, accuracy, and presentation of ${complianceData.label} in accordance with ISA 500 and related standards.`,
      scope: [
        `Testing in accordance with ISA standards: ${complianceData.isaStandards.join(', ')}`,
        `Compliance framework: ${Object.keys(complianceData.frsRequirements).join(', ')} and IFRS standards`,
        'All material transactions and balances as of year-end',
        'Proper cutoff procedures for period-end transactions',
        'Appropriate account classifications per financial reporting framework'
      ],
      materiality: 'As per materiality schedule on Summary sheet',
      riskAssessment: 'Risk assessment completed and documented in Risk Matrix'
    };
  }

  /**
   * Generate assigned team section
   */
  generateAssignedTeamSection(fsliId, assignments) {
    return {
      title: 'ASSIGNED TEAM & RESPONSIBILITIES',
      agents: assignments.map(agent => ({
        agentName: agent.agentName,
        role: agent.role,
        required: agent.required,
        specialties: agent.specialties,
        rationale: agent.rationale,
        status: agent.status,
        signOffRequired: agent.required || agent.role === 'Primary'
      }))
    };
  }

  /**
   * Generate ISA guidance section
   */
  generateISAGuidanceSection(fsliId, complianceData) {
    const guidance = {};

    complianceData.isaStandards.forEach(isa => {
      const isaData = complianceData.isaGuidance[isa];
      if (isaData) {
        guidance[isa] = {
          title: isaData.title,
          guidance: isaData.guidance,
          keyRequirements: isaData.keyRequirements,
          documentationRequired: isaData.documentationRequirements
        };
      }
    });

    return {
      title: 'ISA STANDARDS & GUIDANCE',
      standards: guidance,
      instruction: 'Review guidance for each ISA standard and ensure procedures address all key requirements'
    };
  }

  /**
   * Generate compliance requirements section
   */
  generateComplianceRequirementsSection(fsliId, complianceData) {
    return {
      title: 'COMPLIANCE REQUIREMENTS (FRS 102 / IFRS)',
      frsRequirements: complianceData.frsRequirements,
      ifrsRequirements: complianceData.ifrsRequirements,
      keyPoints: [
        'Verify compliance with applicable financial reporting framework',
        'Assess accounting treatments against FRS 102 and IFRS standards',
        'Document any non-compliance or areas of judgment'
      ]
    };
  }

  /**
   * Generate key audit matters section
   */
  generateKeyAuditMattersSection(fsliId, complianceData) {
    return {
      title: 'KEY AUDIT MATTERS',
      matters: complianceData.keyAuditMatters.map(matter => ({
        description: matter,
        status: 'Not Yet Addressed',
        conclusion: ''
      })),
      instruction: 'Address each key audit matter in the procedures section and document conclusion'
    };
  }

  /**
   * Generate common risks section
   */
  generateCommonRisksSection(fsliId, complianceData) {
    return {
      title: 'COMMON AUDIT RISKS - ASSESSMENT',
      risks: complianceData.commonRisks.map(risk => ({
        risk: risk,
        identified: 'Yes / No',
        mitigatingControls: '',
        proceduresDesigned: ''
      })),
      instruction: 'Assess each identified risk and design specific audit procedures to address it'
    };
  }

  /**
   * Generate procedures checklist section
   */
  generateProceduresChecklistSection(fsliId, complianceData) {
    return {
      title: 'PROCEDURES CHECKLIST',
      procedures: complianceData.proceduresChecklist.map(proc => ({
        procedure: proc.procedure,
        priority: proc.priority,
        phase: proc.phase,
        complete: '☐',
        executionDate: '',
        notes: '',
        exceptionItemCount: 0,
        conclusion: ''
      })),
      totalProcedures: complianceData.proceduresChecklist.length,
      completedCount: 0,
      instruction: 'Check off each procedure as completed. Document any exceptions or findings.'
    };
  }

  /**
   * Generate assertion testing matrix (6 fundamental assertions)
   */
  generateAssertionMatrixSection(_fsliId) {
    const assertions = [
      { name: 'Existence/Occurrence', description: 'Assets, liabilities, and equity recorded actually exist' },
      { name: 'Completeness', description: 'All transactions are recorded; none are omitted' },
      { name: 'Accuracy/Valuation', description: 'Amounts are accurate and properly valued' },
      { name: 'Cutoff', description: 'Transactions recorded in correct accounting period' },
      { name: 'Classification', description: 'Transactions properly classified' },
      { name: 'Presentation/Disclosure', description: 'Proper disclosure in financial statements' }
    ];

    return {
      title: 'ASSERTION TESTING MATRIX (ISA 500)',
      assertions: assertions.map(assertion => ({
        assertion: assertion.name,
        description: assertion.description,
        riskAssessment: 'High / Medium / Low',
        procedureDesigned: '',
        testingPerformed: '',
        exceptionsFound: 'Yes / No',
        conclusion: ''
      })),
      instruction: 'For each assertion, document risk assessment, procedures designed, testing performed, and conclusion'
    };
  }

  /**
   * Generate results and conclusion section
   */
  generateResultsSection(_fsliId) {
    return {
      title: 'RESULTS & CONCLUSION',
      overallTesting: {
        proceduresCompleted: 'Yes / No',
        exceptionsIdentified: 'Yes / No',
        exceptionCount: 0,
        exceptionRate: '0%',
        materialityThresholdExceeded: 'No',
        adjustmentRequired: 'No'
      },
      professionalJudgment: {
        judgementsApplied: '',
        alternativesConsidered: '',
        reasoningForConclusion: ''
      },
      conclusion: {
        overallConclusion: '',
        supportingEvidence: '',
        followUpRequired: 'Yes / No',
        recommendations: ''
      }
    };
  }

  /**
   * Generate exception summary section
   */
  generateExceptionSummarySection() {
    return {
      title: 'EXCEPTION SUMMARY',
      exceptions: [
        {
          number: 1,
          description: '',
          amount: 0,
          severity: 'Critical / High / Medium / Low',
          resolution: '',
          managementResponse: '',
          auditConclusion: ''
        }
      ],
      totalExceptions: 0,
      totalExceptionAmount: 0,
      materiality: 'Within / Exceeds Tolerance',
      instruction: 'Document all exceptions with severity assessment and resolution'
    };
  }

  /**
   * Generate evidence index section
   */
  generateEvidenceIndexSection(_fsliId) {
    return {
      title: 'EVIDENCE INDEX',
      instruction: 'List all evidence files and cross-references to supporting audit procedures',
      evidenceItems: [
        {
          number: '',
          evidenceId: '',
          title: '',
          type: '',
          relevance: 'Critical / High / Medium / Low',
          linkedProcedure: '',
          location: '',
          linkedDate: ''
        }
      ],
      totalEvidence: 0,
      criticalItems: 0,
      summaryNote: ''
    };
  }

  /**
   * Generate sign-off section
   */
  generateSignOffSection(_fsliId) {
    return {
      title: 'SIGN-OFF & APPROVALS (ISA 220 & ISA 230)',
      preparerSignOff: {
        role: 'Auditor - Preparer',
        name: '___________________',
        signature: '___________________',
        date: '___________________',
        conclusion: 'All procedures completed and documented per ISA 230'
      },
      reviewerSignOff: {
        role: 'Manager/Supervisor - Reviewer',
        name: '___________________',
        signature: '___________________',
        date: '___________________',
        comments: '',
        approval: 'Approved / Approved with Conditions / Needs Revision'
      },
      partnerSignOff: {
        role: 'Audit Partner - Final Approval',
        name: '___________________',
        signature: '___________________',
        date: '___________________',
        comments: '',
        approval: 'Approved / Not Approved'
      }
    };
  }

  /**
   * Generate template validation checklist
   */
  generateValidationChecklist(_fsliId) {
    return {
      title: 'WORKING PAPER VALIDATION CHECKLIST (ISA 230)',
      items: [
        { item: 'Header section complete with all required fields', complete: '☐' },
        { item: 'Objective and scope clearly stated', complete: '☐' },
        { item: 'All assigned team members documented', complete: '☐' },
        { item: 'ISA standards and guidance reviewed', complete: '☐' },
        { item: 'Compliance requirements assessed', complete: '☐' },
        { item: 'Key audit matters addressed', complete: '☐' },
        { item: 'Common risks evaluated', complete: '☐' },
        { item: 'All procedures in checklist executed', complete: '☐' },
        { item: 'Assertion testing matrix completed', complete: '☐' },
        { item: 'Exceptions identified and resolved', complete: '☐' },
        { item: 'All evidence linked and indexed', complete: '☐' },
        { item: 'Preparer sign-off completed', complete: '☐' },
        { item: 'Reviewer comments addressed', complete: '☐' },
        { item: 'Partner final approval obtained', complete: '☐' },
        { item: 'ISA 230 documentation complete', complete: '☐' }
      ],
      instruction: 'Complete all items before finalizing working paper'
    };
  }

  /**
   * Generate summary of all FSLIs templates
   */
  generateAllFSLITemplates(engagementContext = {}) {
    const fslis = ['C1', 'D1', 'D3', 'D4', 'D5', 'D6'];
    const templates = {};

    fslis.forEach(fsli => {
      templates[fsli] = this.generateWorkingPaperTemplate(fsli, engagementContext);
    });

    return {
      success: true,
      engagementContext,
      generatedDate: new Date().toISOString(),
      totalTemplates: fslis.length,
      templates,
      note: 'All templates are pre-populated with ISA, FRS, and IFRS guidance. Customization may be required based on engagement-specific factors.'
    };
  }
}

export default new EnhancedWorkingPaperTemplateService();
