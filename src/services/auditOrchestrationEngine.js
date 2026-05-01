/**
 * auditOrchestrationEngine.js
 *
 * Master orchestrator that coordinates all audit services
 * Integrates compliance guidance, agent assignments, evidence linking,
 * sign-off workflow, and document generation into unified audit execution
 *
 * Version: 2.0.0
 * Created: March 2026
 */

import sectionOpenEventHandler from './sectionOpenEventHandler.js';
import agentAssignmentEngine from './agentAssignmentEngine.js';
import auditTrailService from './auditTrailService.js';
import evidenceLinkingService from './evidenceLinkingService.js';
import signOffChainService from './signOffChainService.js';
import enhancedAuditExcelExportService from './enhancedAuditExcelExportService.js';
import enhancedAuditWordExportService from './enhancedAuditWordExportService.js';
import enhancedWorkingPaperTemplateService from './enhancedWorkingPaperTemplateService.js';

export class AuditOrchestrationEngine {
  constructor() {
    this.activeEngagements = new Map();
    this.auditState = {};
    this.listeners = new Map();
  }

  /**
   * Initialize audit engagement with full orchestration
   * @param {object} engagementData - Complete engagement information
   * @returns {object} Initialized engagement with all systems ready
   */
  async initializeEngagement(engagementData) {
    console.log('\n🎯 INITIALIZING AUDIT ENGAGEMENT ORCHESTRATION');
    console.log(`   Engagement: ${engagementData.clientName}`);
    console.log(`   FSLIs: ${engagementData.fslis?.join(', ') || 'All'}`);

    const engagementId = `audit-${Date.now()}`;

    // Initialize audit state
    const auditState = {
      engagementId,
      engagementData,
      createdDate: new Date().toISOString(),
      phases: {
        planning: { status: 'not_started' },
        riskAssessment: { status: 'not_started' },
        interim: { status: 'not_started' },
        finalAudit: { status: 'not_started' },
        completion: { status: 'not_started' },
        reporting: { status: 'not_started' }
      },
      fsliStatus: {},
      agentAssignments: {},
      auditTrail: [],
      evidence: [],
      signOffs: {},
      workingPapers: {}
    };

    // Initialize FSLIs
    const fslis = engagementData.fslis || ['C1', 'D1', 'D3', 'D4', 'D5', 'D6'];
    for (const fsli of fslis) {
      auditState.fsliStatus[fsli] = 'not_started';
      auditState.agentAssignments[fsli] = agentAssignmentEngine.autoAssignAgents(fsli, engagementData);
    }

    // Generate all working paper templates
    console.log('\n📋 Generating Working Paper Templates...');
    auditState.workingPapers = enhancedWorkingPaperTemplateService.generateAllFSLITemplates(engagementData);
    console.log(`   ✓ ${fslis.length} working paper templates created`);

    // Store engagement
    this.activeEngagements.set(engagementId, auditState);
    this.auditState = auditState;

    console.log('\n✅ Engagement Initialized');
    console.log(`   Engagement ID: ${engagementId}`);
    console.log(`   Status: Ready for Execution`);

    return {
      success: true,
      engagementId,
      auditState,
      nextStep: 'Open first FSLI to begin audit procedures'
    };
  }

  /**
   * Execute section opening with full orchestration
   * Coordinates guidance loading, agent assignment, and workflow initiation
   * @param {object} sectionData - Section opening details
   * @returns {object} Complete section context ready for work
   */
  async executeSectionOpen(sectionData) {
    const { engagementId, sectionId, userId, userName } = sectionData;

    console.log(`\n📂 OPENING SECTION: ${sectionId}`);

    const engagement = this.activeEngagements.get(engagementId) || this.auditState;

    // Step 1: Trigger comprehensive event handler
    console.log('   1️⃣ Loading guidance and initiating workflows...');
    const guidanceResult = await sectionOpenEventHandler.handleSectionOpen({
      sectionId,
      userId,
      userName,
      engagementContext: engagement.engagementData
    });

    if (!guidanceResult.success) {
      return { success: false, message: guidanceResult.message };
    }

    const guidancePackage = guidanceResult.data;

    // Step 2: Create audit trail entry
    console.log('   2️⃣ Recording audit trail...');
    auditTrailService.recordAction({
      actionType: 'procedure_started',
      sectionId,
      agentId: userId,
      description: `Section ${sectionId} opened by ${userName}`,
      timestamp: new Date().toISOString(),
      status: 'in_progress'
    });

    // Step 3: Update engagement state
    engagement.fsliStatus[sectionId] = 'in_progress';
    engagement.agentAssignments[sectionId] = guidancePackage.agentAssignments;

    // Step 4: Create sign-off chain
    console.log('   3️⃣ Initiating sign-off workflow...');
    const signOffChain = signOffChainService.createSignOffChain({
      sectionId,
      preparerId: userId,
      preparerName: userName,
      reviewerId: 'reviewer-001',
      reviewerName: 'Assigned Reviewer',
      partnerId: 'partner-001',
      partnerName: 'Audit Partner'
    });

    // Step 5: Prepare comprehensive context
    const sectionContext = {
      sectionId,
      engagementId,
      guidance: guidancePackage,
      workingPaper: engagement.workingPapers.templates[sectionId],
      signOffChain: signOffChain.data,
      readyForWork: true,
      nextActions: [
        'Review guidance and procedures',
        'Execute audit procedures',
        'Link evidence to findings',
        'Document results and conclusions',
        'Submit for review'
      ]
    };

    console.log(`\n✅ Section ${sectionId} Ready for Work`);
    console.log(`   - Agents assigned: ${guidancePackage.agentAssignments.length}`);
    console.log(`   - Procedures: ${guidancePackage.procedures.length}`);
    console.log(`   - Sign-off chain initialized`);

    return {
      success: true,
      context: sectionContext
    };
  }

  /**
   * Execute procedure with agent coordination
   * @param {object} procedureData - Procedure execution details
   * @returns {object} Procedure execution result with audit trail
   */
  async executeProcedure(procedureData) {
    const { _engagementId, sectionId, procedureId, agentId, description, findings = {} } = procedureData;

    console.log(`\n⚙️ EXECUTING PROCEDURE: ${procedureId}`);

    // Record in audit trail
    const trailEntry = auditTrailService.recordProcedureExecution({
      sectionId,
      agentId,
      procedureId,
      procedureName: description,
      resultsDescription: findings.resultsDescription || 'Procedure executed',
      exceptionItemCount: findings.exceptionCount || 0,
      sampleSize: findings.sampleSize || 0,
      sampleTested: findings.sampleTested || 0,
      conclusionReached: findings.conclusion || 'Testing complete'
    });

    // If exceptions found, record them
    if (findings.exceptionCount > 0) {
      const exceptionTrail = auditTrailService.recordException({ // eslint-disable-line no-unused-vars
        sectionId,
        agentId,
        description: findings.exceptionDescription || `${findings.exceptionCount} exceptions found`,
        severity: findings.severity || 'Medium',
        impact: findings.impact || 'To be assessed',
        proposedResolution: findings.resolution || 'TBD',
        evidenceReference: findings.evidenceId || ''
      });

      console.log(`   ⚠️ ${findings.exceptionCount} exceptions recorded`);
    }

    console.log('   ✅ Procedure recorded in audit trail');

    return {
      success: true,
      trailEntry: trailEntry.data
    };
  }

  /**
   * Link evidence to procedures and findings
   * @param {object} evidenceData - Evidence linking details
   * @returns {object} Evidence link confirmation
   */
  async linkEvidence(evidenceData) {
    const { sectionId, evidenceId, evidenceType, evidenceTitle, linkedToAuditItem, agentId } = evidenceData;

    console.log(`\n🔗 LINKING EVIDENCE: ${evidenceTitle}`);

    const linkResult = evidenceLinkingService.linkEvidenceToFinding({
      evidenceId,
      evidenceType,
      evidenceLocation: evidenceData.location || '',
      evidenceTitle,
      sectionId,
      agentId,
      linkedToAuditItem,
      relevanceRating: evidenceData.relevance || 'High',
      description: evidenceData.description || '',
      amountInvolved: evidenceData.amount || 0
    });

    console.log('   ✅ Evidence linked to finding');

    return linkResult;
  }

  /**
   * Submit section for review
   * @param {object} submissionData - Submission details
   * @returns {object} Submission confirmation with review initiation
   */
  async submitForReview(submissionData) {
    const { _engagementId, sectionId, preparerId, notes } = submissionData;

    console.log(`\n📤 SUBMITTING SECTION FOR REVIEW: ${sectionId}`);

    // Mark work complete
    const completion = signOffChainService.markWorkComplete(sectionId, preparerId, notes);

    // Record in audit trail
    auditTrailService.recordAction({
      actionType: 'sign_off_requested',
      sectionId,
      agentId: preparerId,
      description: `Section ${sectionId} submitted for review`,
      status: 'pending_review'
    });

    console.log('   ✅ Section submitted to reviewer');
    console.log(`   Next: Awaiting reviewer approval`);

    return {
      success: true,
      submission: completion.data
    };
  }

  /**
   * Generate comprehensive audit export
   * @param {string} engagementId - Engagement to export
   * @param {string} exportFormat - 'excel', 'word', or 'both'
   * @returns {Promise<object>} Export buffers
   */
  async generateAuditExport(engagementId, exportFormat = 'both') {
    console.log(`\n📤 GENERATING AUDIT EXPORT`);

    const engagement = this.activeEngagements.get(engagementId) || this.auditState;

    const exports = {};

    // Generate Excel workbook
    if (exportFormat === 'excel' || exportFormat === 'both') {
      console.log('   📊 Generating Excel workbook...');
      exports.excel = enhancedAuditExcelExportService.generateComprehensiveAuditWorkbook(
        engagement.engagementData,
        'Final Audit'
      );
      console.log('   ✅ Excel workbook generated');
    }

    // Generate Word report
    if (exportFormat === 'word' || exportFormat === 'both') {
      console.log('   📄 Generating Word report...');
      exports.word = await enhancedAuditWordExportService.generateComprehensiveAuditReport(
        engagement.engagementData,
        'Final Audit'
      );
      console.log('   ✅ Word report generated');
    }

    console.log('\n✅ Audit Export Complete');

    return {
      success: true,
      exports,
      exportDate: new Date().toISOString(),
      readyForDownload: true
    };
  }

  /**
   * Get comprehensive engagement status
   * @param {string} engagementId - Engagement ID
   * @returns {object} Complete engagement status
   */
  getEngagementStatus(engagementId) {
    const engagement = this.activeEngagements.get(engagementId) || this.auditState;

    const fsliStatuses = Object.entries(engagement.fsliStatus).map(([fsli, status]) => ({
      fsli,
      status,
      agentCount: engagement.agentAssignments[fsli]?.length || 0,
      signOffStatus: engagement.signOffs[fsli]?.overallStatus || 'Not Started'
    }));

    const completedCount = fsliStatuses.filter(f => f.status === 'complete').length;
    const totalCount = fsliStatuses.length;
    const completionPercentage = (completedCount / totalCount * 100).toFixed(1);

    return {
      engagementId,
      engagementData: engagement.engagementData,
      createdDate: engagement.createdDate,
      completionPercentage,
      fsliStatuses,
      summary: {
        totalFSLIs: totalCount,
        completedFSLIs: completedCount,
        inProgressFSLIs: fsliStatuses.filter(f => f.status === 'in_progress').length,
        notStartedFSLIs: fsliStatuses.filter(f => f.status === 'not_started').length
      }
    };
  }

  /**
   * Get all active engagements summary
   * @returns {array} Summary of all active engagements
   */
  getActiveSummary() {
    const engagements = [];

    this.activeEngagements.forEach((engagement, engagementId) => {
      engagements.push({
        engagementId,
        clientName: engagement.engagementData.clientName,
        createdDate: engagement.createdDate,
        fsliCount: Object.keys(engagement.fsliStatus).length,
        status: this.getEngagementStatus(engagementId)
      });
    });

    return engagements;
  }

  /**
   * Register event listener
   */
  addEventListener(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);
  }

  /**
   * Emit event to all listeners
   */
  emitEvent(eventType, eventData) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => {
        try {
          callback(eventData);
        } catch (error) {
          console.error(`Error in listener for ${eventType}:`, error);
        }
      });
    }
  }
}

export default new AuditOrchestrationEngine();
