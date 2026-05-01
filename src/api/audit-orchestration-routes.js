/**
 * audit-orchestration-routes.js
 *
 * API routes for audit orchestration engine
 * Exposes all orchestration, execution, export, and management endpoints
 * Enables multi-platform access from web, mobile, dispatch, and terminal
 *
 * Version: 1.0.0
 * Created: March 2026
 */

import express from 'express';
import auditOrchestrationEngine from '../services/auditOrchestrationEngine.js';
import enhancedWorkingPaperTemplateService from '../services/enhancedWorkingPaperTemplateService.js';

const router = express.Router();

/**
 * POST /api/orchestration/init
 * Initialize new audit engagement with full orchestration
 */
router.post('/init', async (req, res) => {
  try {
    const engagementData = req.body;

    console.log(`\n📋 API: Initializing engagement - ${engagementData.clientName}`);

    const result = await auditOrchestrationEngine.initializeEngagement(engagementData);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({
      success: true,
      engagementId: result.engagementId,
      message: 'Engagement initialized successfully',
      details: result
    });
  } catch (error) {
    console.error('Error initializing engagement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/orchestration/section/open
 * Execute section opening with full orchestration
 */
router.post('/section/open', async (req, res) => {
  try {
    const sectionData = req.body;

    console.log(`\n📂 API: Opening section - ${sectionData.sectionId}`);

    const result = await auditOrchestrationEngine.executeSectionOpen(sectionData);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({
      success: true,
      context: result.context,
      message: 'Section opened and ready for work'
    });
  } catch (error) {
    console.error('Error opening section:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/orchestration/procedure/execute
 * Execute audit procedure with agent coordination
 */
router.post('/procedure/execute', async (req, res) => {
  try {
    const procedureData = req.body;

    console.log(`\n⚙️ API: Executing procedure - ${procedureData.procedureId}`);

    const result = await auditOrchestrationEngine.executeProcedure(procedureData);

    res.json({
      success: true,
      data: result.trailEntry,
      message: 'Procedure executed and recorded'
    });
  } catch (error) {
    console.error('Error executing procedure:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/orchestration/evidence/link
 * Link evidence to procedures and findings
 */
router.post('/evidence/link', async (req, res) => {
  try {
    const evidenceData = req.body;

    console.log(`\n🔗 API: Linking evidence - ${evidenceData.evidenceTitle}`);

    const result = await auditOrchestrationEngine.linkEvidence(evidenceData);

    res.json({
      success: true,
      data: result.data,
      message: 'Evidence linked successfully'
    });
  } catch (error) {
    console.error('Error linking evidence:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/orchestration/section/submit
 * Submit section for review
 */
router.post('/section/submit', async (req, res) => {
  try {
    const submissionData = req.body;

    console.log(`\n📤 API: Submitting section - ${submissionData.sectionId}`);

    const result = await auditOrchestrationEngine.submitForReview(submissionData);

    res.json({
      success: true,
      data: result.submission,
      message: 'Section submitted for review'
    });
  } catch (error) {
    console.error('Error submitting section:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/orchestration/export/:engagementId
 * Generate comprehensive audit export
 * Query params: format (excel|word|both)
 */
router.get('/export/:engagementId', async (req, res) => {
  try {
    const { engagementId } = req.params;
    const { format = 'both' } = req.query;

    console.log(`\n📤 API: Generating export - Format: ${format}`);

    const result = await auditOrchestrationEngine.generateAuditExport(engagementId, format);

    if (!result.success) {
      return res.status(400).json({ success: false, message: 'Export generation failed' });
    }

    // Send appropriate response based on format
    if (format === 'excel' && result.exports.excel) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="audit-${engagementId}.xlsx"`);
      res.send(result.exports.excel);
    } else if (format === 'word' && result.exports.word) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="audit-report-${engagementId}.docx"`);
      res.send(result.exports.word);
    } else {
      res.json({
        success: true,
        message: 'Export metadata',
        data: result
      });
    }
  } catch (error) {
    console.error('Error generating export:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/orchestration/status/:engagementId
 * Get comprehensive engagement status
 */
router.get('/status/:engagementId', (req, res) => {
  try {
    const { engagementId } = req.params;

    console.log(`\n📊 API: Getting status - ${engagementId}`);

    const status = auditOrchestrationEngine.getEngagementStatus(engagementId);

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/orchestration/engagements
 * Get all active engagements summary
 */
router.get('/engagements', (req, res) => {
  try {
    console.log('\n📋 API: Getting all engagements');

    const summary = auditOrchestrationEngine.getActiveSummary();

    res.json({
      success: true,
      data: summary,
      count: summary.length
    });
  } catch (error) {
    console.error('Error getting engagements:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/orchestration/template/generate
 * Generate working paper template for specific FSLI
 */
router.post('/template/generate', (req, res) => {
  try {
    const { fsliId, engagementContext } = req.body;

    console.log(`\n📋 API: Generating template - ${fsliId}`);

    const template = enhancedWorkingPaperTemplateService.generateWorkingPaperTemplate(
      fsliId,
      engagementContext
    );

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/orchestration/templates/all
 * Generate all FSLI templates
 */
router.post('/templates/all', (req, res) => {
  try {
    const { engagementContext } = req.body;

    console.log('\n📋 API: Generating all templates');

    const templates = enhancedWorkingPaperTemplateService.generateAllFSLITemplates(
      engagementContext
    );

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error generating templates:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/orchestration/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'Audit Orchestration Engine - Running',
    timestamp: new Date().toISOString(),
    services: {
      orchestration: 'Ready',
      excelExport: 'Ready',
      wordExport: 'Ready',
      templates: 'Ready'
    }
  });
});

/**
 * POST /api/orchestration/event/listen
 * Setup event listener for real-time updates
 */
router.post('/event/listen', (req, res) => {
  try {
    const { eventType } = req.body;

    console.log(`\n👂 API: Event listener - ${eventType}`);

    // This would typically setup WebSocket connection in production
    res.json({
      success: true,
      message: `Listening for ${eventType} events`,
      note: 'WebSocket connection recommended for production'
    });
  } catch (error) {
    console.error('Error setting up listener:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
