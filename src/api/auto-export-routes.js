/**
 * AUTO-EXPORT API ROUTES
 * ========================
 * REST API endpoints for triggering automatic worksheet generation and export
 * When audit sections are populated, these endpoints orchestrate the generation
 * of Excel/Word/PDF working papers with FSLI, risks, controls, and test data
 */

import express from 'express';
import WorksheetAutopopulationService from '../services/WorksheetAutopopulationService.js';

const router = express.Router();

/**
 * POST /api/auto-export/trigger
 * Trigger automatic export generation for all configured formats
 *
 * Body: {
 *   engagementId: string,
 *   formats: string[] (optional: ['excel', 'word', 'pdf']),
 *   includeFSLI: boolean (optional: true)
 * }
 */
router.post('/api/auto-export/trigger', async (req, res) => {
  try {
    const { engagementId, formats = ['excel', 'word'], includeFSLI = true } = req.body;

    if (!engagementId) {
      return res.status(400).json({
        error: 'engagementId is required',
        code: 'MISSING_ENGAGEMENT_ID'
      });
    }

    console.log(`📤 Auto-export triggered for engagement: ${engagementId}`);
    console.log(`   Formats: ${formats.join(', ')}`);
    console.log(`   Include FSLI worksheets: ${includeFSLI}`);

    // Trigger export with specified formats
    await WorksheetAutopopulationService.triggerAutomaticExport(engagementId, formats);

    // Return job info
    const worksheets = WorksheetAutopopulationService.getGeneratedWorksheets(engagementId);

    res.json({
      success: true,
      message: 'Auto-export triggered successfully',
      engagementId,
      formats,
      queued: true,
      worksheetsGenerated: Object.keys(worksheets).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Auto-export trigger failed:', error);
    res.status(500).json({
      error: 'Auto-export trigger failed',
      message: error.message,
      code: 'AUTO_EXPORT_FAILED'
    });
  }
});

/**
 * GET /api/auto-export/status/:engagementId
 * Get status of generated worksheets for an engagement
 */
router.get('/api/auto-export/status/:engagementId', (req, res) => {
  try {
    const { engagementId } = req.params;

    const worksheets = WorksheetAutopopulationService.getGeneratedWorksheets(engagementId);

    // Build response
    const status = {
      engagementId,
      worksheetsGenerated: {},
      ready: false,
      generatedAt: null,
      totalSize: 0
    };

    // Check each format
    if (worksheets.excel) {
      status.worksheetsGenerated.excel = {
        filename: worksheets.excel.filename,
        size: worksheets.excel.size,
        generatedAt: worksheets.excel.generatedAt,
        ready: true
      };
      status.totalSize += worksheets.excel.size;
    }

    if (worksheets.word) {
      status.worksheetsGenerated.word = {
        filename: worksheets.word.filename,
        size: worksheets.word.size,
        generatedAt: worksheets.word.generatedAt,
        ready: true
      };
      status.totalSize += worksheets.word.size;
    }

    // FSLI worksheets
    if (worksheets.fslis && Object.keys(worksheets.fslis).length > 0) {
      status.worksheetsGenerated.fslis = {};
      for (const [fsliId, fsliWs] of Object.entries(worksheets.fslis)) {
        status.worksheetsGenerated.fslis[fsliId] = {
          name: fsliWs.fsliName,
          riskLevel: fsliWs.riskLevel,
          generatedAt: fsliWs.generatedAt,
          ready: true
        };
      }
    }

    status.ready = Object.keys(status.worksheetsGenerated).length > 0;

    res.json(status);
  } catch (error) {
    console.error('❌ Failed to get export status:', error);
    res.status(500).json({
      error: 'Failed to get export status',
      message: error.message
    });
  }
});

/**
 * GET /api/auto-export/download/:engagementId/:format
 * Download generated worksheet in specified format
 *
 * Formats: excel, word, pdf
 */
router.get('/api/auto-export/download/:engagementId/:format', (req, res) => {
  try {
    const { engagementId, format } = req.params;

    // Validate format
    if (!['excel', 'word', 'pdf'].includes(format)) {
      return res.status(400).json({
        error: 'Invalid format',
        message: `Format must be 'excel', 'word', or 'pdf'`,
        received: format
      });
    }

    // Get worksheet
    const worksheet = WorksheetAutopopulationService.getGeneratedWorksheet(engagementId, format);

    if (!worksheet || !worksheet.buffer) {
      return res.status(404).json({
        error: 'Worksheet not found',
        message: `No ${format} worksheet found for engagement: ${engagementId}`,
        code: 'WORKSHEET_NOT_FOUND'
      });
    }

    // Set response headers
    const mimeTypes = {
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      pdf: 'application/pdf'
    };

    res.setHeader('Content-Type', mimeTypes[format]);
    res.setHeader('Content-Disposition', `attachment; filename="${worksheet.filename}"`);
    res.setHeader('Content-Length', worksheet.size);

    // Send buffer
    res.send(worksheet.buffer);

    console.log(`✅ Downloaded ${format} worksheet for engagement: ${engagementId}`);
  } catch (error) {
    console.error(`❌ Download failed:`, error);
    res.status(500).json({
      error: 'Download failed',
      message: error.message
    });
  }
});

/**
 * GET /api/auto-export/download-all/:engagementId
 * Download all generated worksheets as ZIP archive
 * (Requires 'zip' library)
 */
router.get('/api/auto-export/download-all/:engagementId', (req, res) => {
  try {
    const { engagementId } = req.params;

    const worksheets = WorksheetAutopopulationService.getGeneratedWorksheets(engagementId);

    if (Object.keys(worksheets).length === 0) {
      return res.status(404).json({
        error: 'No worksheets found',
        message: `No worksheets generated for engagement: ${engagementId}`
      });
    }

    // Build download info for client-side selection
    const files = [];

    if (worksheets.excel) {
      files.push({
        format: 'excel',
        filename: worksheets.excel.filename,
        size: worksheets.excel.size,
        downloadUrl: `/api/auto-export/download/${engagementId}/excel`
      });
    }

    if (worksheets.word) {
      files.push({
        format: 'word',
        filename: worksheets.word.filename,
        size: worksheets.word.size,
        downloadUrl: `/api/auto-export/download/${engagementId}/word`
      });
    }

    if (worksheets.fslis) {
      for (const [fsliId, fsliWs] of Object.entries(worksheets.fslis)) {
        files.push({
          format: `fsli_${fsliId}`,
          filename: `FSLI_${fsliWs.fsliName}.json`,
          size: JSON.stringify(fsliWs).length,
          type: 'embedded'
        });
      }
    }

    res.json({
      engagementId,
      worksheetCount: files.length,
      totalSize: worksheets.excel?.size + worksheets.word?.size || 0,
      files,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to list downloads:', error);
    res.status(500).json({
      error: 'Failed to list downloads',
      message: error.message
    });
  }
});

/**
 * POST /api/auto-export/enable
 * Enable automatic export on section population
 */
router.post('/api/auto-export/enable', (req, res) => {
  try {
    const { _engagementId, formats = ['excel', 'word'] } = req.body;

    WorksheetAutopopulationService.setAutoExportEnabled(true);
    WorksheetAutopopulationService.setExportFormats(formats);

    console.log(`✅ Auto-export enabled for formats: ${formats.join(', ')}`);

    res.json({
      success: true,
      message: 'Auto-export enabled',
      formats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to enable auto-export',
      message: error.message
    });
  }
});

/**
 * POST /api/auto-export/disable
 * Disable automatic export
 */
router.post('/api/auto-export/disable', (req, res) => {
  try {
    WorksheetAutopopulationService.setAutoExportEnabled(false);

    console.log(`⏸️  Auto-export disabled`);

    res.json({
      success: true,
      message: 'Auto-export disabled',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to disable auto-export',
      message: error.message
    });
  }
});

/**
 * GET /api/auto-export/config
 * Get current auto-export configuration
 */
router.get('/api/auto-export/config', (req, res) => {
  try {
    const config = {
      autoExportEnabled: WorksheetAutopopulationService.autoExportEnabled,
      exportFormats: WorksheetAutopopulationService.exportFormats,
      configuration: WorksheetAutopopulationService.config,
      timestamp: new Date().toISOString()
    };

    res.json(config);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get configuration',
      message: error.message
    });
  }
});

/**
 * POST /api/auto-export/config
 * Update auto-export configuration
 */
router.post('/api/auto-export/config', (req, res) => {
  try {
    const configUpdates = req.body;

    WorksheetAutopopulationService.updateConfig(configUpdates);

    console.log(`🔧 Auto-export configuration updated:`, configUpdates);

    res.json({
      success: true,
      message: 'Configuration updated',
      configuration: WorksheetAutopopulationService.config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update configuration',
      message: error.message
    });
  }
});

/**
 * POST /api/auto-export/fsli/:engagementId/:fsliId
 * Trigger FSLI-specific worksheet generation
 */
router.post('/api/auto-export/fsli/:engagementId/:fsliId', async (req, res) => {
  try {
    const { engagementId, fsliId } = req.params;
    const fsliData = req.body;

    console.log(`📋 Generating FSLI worksheet for: ${fsliData.fsliName}`);

    const fsliWorksheet = await WorksheetAutopopulationService.generateFSLIWorksheet(
      engagementId,
      {
        fsliId,
        ...fsliData
      }
    );

    res.json({
      success: true,
      message: `FSLI worksheet generated: ${fsliData.fsliName}`,
      fsli: {
        id: fsliId,
        name: fsliData.fsliName,
        generatedAt: fsliWorksheet.generatedAt,
        riskLevel: fsliWorksheet.riskLevel
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`❌ FSLI worksheet generation failed:`, error);
    res.status(500).json({
      error: 'FSLI worksheet generation failed',
      message: error.message
    });
  }
});

export default router;
