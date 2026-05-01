/**
 * WORKSHEET AUTO-POPULATION SERVICE
 * =====================================
 * Core Automation Service: Automatically generates and populates Excel/Word/PDF worksheets
 * whenever audit sections are populated with data (FSLI, risks, controls, test results)
 *
 * This is the KEY SERVICE that ties together:
 * - FSLI population → Automatic Excel workbook generation
 * - Risk assessment → Automatic worksheet update with risk details
 * - Control testing → Automatic worksheet update with control evidence
 * - Test results → Automatic worksheet update with findings
 *
 * Architecture:
 * 1. Listens for section:populated events from autoPopulationEngine
 * 2. Watches for FSLI completion or data changes
 * 3. Generates/updates Excel/Word/PDF working papers in real-time
 * 4. Stores generated files in engagement document cache
 * 5. Emits export:ready events for UI notification
 */

import { AuditExcelExportService } from './auditExcelExportService.js';
import { AuditWordExportService } from './auditWordExportService.js';
import { FSLINarrativeService } from './fsliNarrativeService.js';

export class WorksheetAutopopulationService {
  constructor() {
    this.exportServices = {
      excel: new AuditExcelExportService(),
      word: new AuditWordExportService(),
      pdf: null // Will be initialized if needed
    };

    this.eventListeners = new Map();
    this.generatedWorksheets = new Map(); // engagementId -> { excel, word, pdf, generatedAt }
    this.exportQueue = [];
    this.isProcessing = false;
    this.autoExportEnabled = true;
    this.exportFormats = ['excel', 'word']; // Default formats

    // Configuration
    this.config = {
      autoExportOnSectionComplete: true,
      autoExportOnFSLIComplete: true,
      autoExportOnRiskUpdate: true,
      autoExportOnTestComplete: true,
      exportDelay: 100, // ms - debounce multiple changes
      maxConcurrentExports: 2,
      retryOnFailure: 3
    };

    this.debounceTimers = new Map();
  }

  /**
   * Initialize service and attach event listeners
   * Call this when engagement starts
   */
  initialize(engagement, eventBus) {
    this.engagement = engagement;
    this.eventBus = eventBus;

    // Listen for population events
    if (eventBus) {
      eventBus.on('section:populated', (data) => this.onSectionPopulated(data));
      eventBus.on('fsli:completed', (data) => this.onFSLICompleted(data));
      eventBus.on('risk:assessed', (data) => this.onRiskAssessed(data));
      eventBus.on('test:completed', (data) => this.onTestCompleted(data));
      eventBus.on('control:tested', (data) => this.onControlTested(data));
    }

    console.log(`✅ WorksheetAutopopulationService initialized for engagement: ${engagement.id}`);
  }

  /**
   * TRIGGER 1: Section Population
   * Auto-generates working papers when any audit section is populated
   */
  async onSectionPopulated(data) {
    const { sectionId, sectionType, engagementId, _procedures, _findings, _content } = data;

    console.log(`📄 Section populated: ${sectionType} (${sectionId})`);

    if (this.config.autoExportOnSectionComplete) {
      // Debounce rapid changes (multiple sections in quick succession)
      this.debounceExport(engagementId, 'section', this.config.exportDelay);
    }

    // Emit event for UI notification
    this.emit('section:populated:detected', {
      engagementId,
      sectionId,
      sectionType,
      message: `📄 ${sectionType} populated - generating worksheets...`
    });
  }

  /**
   * TRIGGER 2: FSLI Completion
   * Auto-generates FSLI-specific worksheets with narrative, risk, and controls
   */
  async onFSLICompleted(data) {
    const { fsliId, fsliName, engagementId, amount, riskLevel, procedures, controls } = data;

    console.log(`📊 FSLI completed: ${fsliName} (Risk: ${riskLevel})`);

    if (this.config.autoExportOnFSLIComplete) {
      // Generate FSLI-specific worksheet
      await this.generateFSLIWorksheet(engagementId, {
        fsliId,
        fsliName,
        amount,
        riskLevel,
        procedures,
        controls
      });

      // Queue for export
      this.debounceExport(engagementId, 'fsli', this.config.exportDelay);
    }

    this.emit('fsli:worksheet:ready', {
      engagementId,
      fsliId,
      fsliName,
      message: `✓ FSLI worksheet generated for ${fsliName}`
    });
  }

  /**
   * TRIGGER 3: Risk Assessment
   * Auto-updates worksheets with risk assessment details
   */
  async onRiskAssessed(data) {
    const { engagementId, riskSummary, _fsliRisks } = data;

    console.log(`⚠️  Risk assessment updated for engagement: ${engagementId}`);

    if (this.config.autoExportOnRiskUpdate) {
      this.debounceExport(engagementId, 'risk', this.config.exportDelay);
    }

    this.emit('risk:worksheet:ready', {
      engagementId,
      riskLevel: riskSummary?.overallRisk,
      message: `✓ Risk assessment worksheet updated`
    });
  }

  /**
   * TRIGGER 4: Test Completion
   * Auto-updates worksheets with test results and exceptions
   */
  async onTestCompleted(data) {
    const { engagementId, procedureId, fsliId, testResults, exceptions } = data;

    console.log(`✓ Test completed: Procedure ${procedureId}`);

    if (this.config.autoExportOnTestComplete) {
      this.debounceExport(engagementId, 'test', this.config.exportDelay);
    }

    this.emit('test:worksheet:ready', {
      engagementId,
      procedureId,
      fsliId,
      testsPassed: testResults?.passed,
      exceptions: exceptions?.length || 0,
      message: `✓ Test results worksheet updated`
    });
  }

  /**
   * TRIGGER 5: Control Testing
   * Auto-updates worksheets with control effectiveness
   */
  async onControlTested(data) {
    const { engagementId, controlId, controlName, effectiveness, testResults } = data;

    console.log(`🔒 Control tested: ${controlName}`);

    // Update existing worksheets with control results
    await this.updateWorksheetWithControlResults(engagementId, {
      controlId,
      controlName,
      effectiveness,
      testResults
    });

    this.emit('control:worksheet:ready', {
      engagementId,
      controlId,
      effectiveness,
      message: `✓ Control testing results added to worksheet`
    });
  }

  /**
   * AUTO-GENERATION: Generate Excel workbook with all FSLI data
   */
  async generateExcelWorksheet(engagementId, engagement) {
    try {
      console.log(`📊 Generating Excel workbook for engagement: ${engagementId}`);

      const excelBuffer = this.exportServices.excel.generateAuditProceduresWorkbook(
        engagement,
        engagement.currentPhase || 'planning'
      );

      // Store generated worksheet
      if (!this.generatedWorksheets.has(engagementId)) {
        this.generatedWorksheets.set(engagementId, {});
      }
      this.generatedWorksheets.get(engagementId).excel = {
        buffer: excelBuffer,
        filename: `AuditWorkingPapers_${engagement.clientName}_${new Date().toISOString().split('T')[0]}.xlsx`,
        generatedAt: new Date().toISOString(),
        size: excelBuffer.length
      };

      console.log(`✅ Excel workbook generated: ${excelBuffer.length} bytes`);
      return excelBuffer;
    } catch (error) {
      console.error('❌ Failed to generate Excel workbook:', error);
      this.emit('export:error', {
        engagementId,
        format: 'excel',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * AUTO-GENERATION: Generate Word document with narratives and findings
   */
  async generateWordWorksheet(engagementId, engagement) {
    try {
      console.log(`📝 Generating Word document for engagement: ${engagementId}`);

      const wordBuffer = await this.exportServices.word.generateAuditReport(engagement);

      // Store generated worksheet
      if (!this.generatedWorksheets.has(engagementId)) {
        this.generatedWorksheets.set(engagementId, {});
      }
      this.generatedWorksheets.get(engagementId).word = {
        buffer: wordBuffer,
        filename: `AuditReport_${engagement.clientName}_${new Date().toISOString().split('T')[0]}.docx`,
        generatedAt: new Date().toISOString(),
        size: wordBuffer.length
      };

      console.log(`✅ Word document generated: ${wordBuffer.length} bytes`);
      return wordBuffer;
    } catch (error) {
      console.error('❌ Failed to generate Word document:', error);
      this.emit('export:error', {
        engagementId,
        format: 'word',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * FSLI-SPECIFIC: Generate focused worksheet for single FSLI
   * Includes: Narrative + Risk + Procedures + Test Results + Controls
   */
  async generateFSLIWorksheet(engagementId, fsliData) {
    try {
      const { fsliId, fsliName, amount, riskLevel, procedures, controls } = fsliData;

      console.log(`📋 Generating FSLI worksheet for: ${fsliName}`);

      // Generate narrative using FSLINarrativeService
      const narrative = FSLINarrativeService.generateNarrative(fsliId, {
        amount,
        sampleSize: procedures?.length || 30,
        bankCount: fsliId === 'cash' ? 3 : null,
        countDate: new Date().toISOString().split('T')[0]
      });

      // Create FSLI worksheet data structure
      const fsliWorksheet = {
        fsliId,
        fsliName,
        riskLevel,
        amount,
        narrative: narrative.narrative,
        procedures: procedures || [],
        controls: controls || [],
        generatedAt: new Date().toISOString(),
        automatedGeneration: true
      };

      // Store in engagement document cache
      if (!this.generatedWorksheets.has(engagementId)) {
        this.generatedWorksheets.set(engagementId, {});
      }
      if (!this.generatedWorksheets.get(engagementId).fslis) {
        this.generatedWorksheets.get(engagementId).fslis = {};
      }
      this.generatedWorksheets.get(engagementId).fslis[fsliId] = fsliWorksheet;

      console.log(`✅ FSLI worksheet generated for ${fsliName}`);
      return fsliWorksheet;
    } catch (error) {
      console.error(`❌ Failed to generate FSLI worksheet for ${fsliData.fsliName}:`, error);
      throw error;
    }
  }

  /**
   * UPDATE: Add control testing results to existing worksheet
   */
  async updateWorksheetWithControlResults(engagementId, controlData) {
    try {
      const worksheets = this.generatedWorksheets.get(engagementId);
      if (!worksheets) {
        console.warn(`⚠️  No worksheets found for engagement: ${engagementId}`);
        return;
      }

      // Add control results to FSLI worksheets if applicable
      if (worksheets.fslis) {
        for (const [fsliId, fsliWorksheet] of Object.entries(worksheets.fslis)) { // eslint-disable-line no-unused-vars
          if (fsliWorksheet.controls) {
            const controlIndex = fsliWorksheet.controls.findIndex(
              c => c.controlId === controlData.controlId
            );
            if (controlIndex >= 0) {
              fsliWorksheet.controls[controlIndex].testResults = controlData.testResults;
              fsliWorksheet.controls[controlIndex].effectiveness = controlData.effectiveness;
              fsliWorksheet.controls[controlIndex].testedAt = new Date().toISOString();
            }
          }
        }
      }

      console.log(`✅ Control results added to worksheet for engagement: ${engagementId}`);
    } catch (error) {
      console.error('❌ Failed to update worksheet with control results:', error);
      throw error;
    }
  }

  /**
   * DEBOUNCING: Prevent excessive export generation
   * Multiple section updates within debounceDelay trigger single export
   */
  debounceExport(engagementId, trigger, delay) {
    const key = `export_${engagementId}_${trigger}`;

    // Clear existing timer
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }

    // Set new timer
    const timer = setTimeout(async () => {
      await this.triggerAutomaticExport(engagementId);
      this.debounceTimers.delete(key);
    }, delay);

    this.debounceTimers.set(key, timer);
  }

  /**
   * ORCHESTRATION: Main export triggering logic
   * Generates all configured export formats in sequence
   */
  async triggerAutomaticExport(engagementId, formats = null) {
    if (!this.autoExportEnabled) {
      console.log(`⚠️  Auto-export disabled for engagement: ${engagementId}`);
      return;
    }

    const exportFormats = formats || this.exportFormats;
    const job = {
      engagementId,
      formats: exportFormats,
      status: 'queued',
      createdAt: new Date().toISOString()
    };

    this.exportQueue.push(job);
    this.emit('export:queued', job);

    // Process queue
    if (!this.isProcessing) {
      await this.processExportQueue();
    }
  }

  /**
   * QUEUE PROCESSING: Execute exports in FIFO order with concurrency control
   */
  async processExportQueue() {
    if (this.isProcessing || this.exportQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.exportQueue.length > 0) {
      const job = this.exportQueue.shift();
      job.status = 'processing';

      try {
        console.log(`⏳ Processing export job for engagement: ${job.engagementId}`);
        this.emit('export:started', job);

        // Get engagement data (would come from store or API)
        const engagement = this.engagement;

        // Generate all requested formats
        const results = {};

        if (job.formats.includes('excel')) {
          results.excel = await this.generateExcelWorksheet(job.engagementId, engagement);
          console.log(`✅ Excel export completed for ${job.engagementId}`);
        }

        if (job.formats.includes('word')) {
          results.word = await this.generateWordWorksheet(job.engagementId, engagement);
          console.log(`✅ Word export completed for ${job.engagementId}`);
        }

        job.status = 'completed';
        job.completedAt = new Date().toISOString();
        job.results = results;

        this.emit('export:completed', job);
      } catch (error) {
        job.status = 'failed';
        job.error = error.message;
        job.failedAt = new Date().toISOString();

        // Retry logic
        if ((job.retries || 0) < this.config.retryOnFailure) {
          job.retries = (job.retries || 0) + 1;
          console.log(`🔄 Retrying export job (attempt ${job.retries}/${this.config.retryOnFailure})`);
          this.exportQueue.unshift(job); // Re-queue at front
        } else {
          console.error(`❌ Export job failed after ${this.config.retryOnFailure} retries:`, error);
          this.emit('export:failed', job);
        }
      }
    }

    this.isProcessing = false;
    console.log(`✅ Export queue processing completed`);
  }

  /**
   * UTILITY: Get generated worksheet by format
   */
  getGeneratedWorksheet(engagementId, format = 'excel') {
    const worksheets = this.generatedWorksheets.get(engagementId);
    if (!worksheets || !worksheets[format]) {
      return null;
    }
    return worksheets[format];
  }

  /**
   * UTILITY: Get all generated worksheets for engagement
   */
  getGeneratedWorksheets(engagementId) {
    return this.generatedWorksheets.get(engagementId) || {};
  }

  /**
   * CONFIGURATION: Enable/disable auto-export
   */
  setAutoExportEnabled(enabled) {
    this.autoExportEnabled = enabled;
    console.log(`🔧 Auto-export ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * CONFIGURATION: Set export formats
   */
  setExportFormats(formats) {
    this.exportFormats = formats;
    console.log(`🔧 Export formats set to: ${formats.join(', ')}`);
  }

  /**
   * CONFIGURATION: Update export config
   */
  updateConfig(configUpdates) {
    this.config = { ...this.config, ...configUpdates };
    console.log(`🔧 Configuration updated:`, this.config);
  }

  /**
   * EVENT SYSTEM: Register listeners
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * EVENT SYSTEM: Emit events
   */
  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * CLEANUP: Clear all timers and state
   */
  cleanup() {
    // Clear all debounce timers
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();

    // Clear worksheets
    this.generatedWorksheets.clear();

    // Clear queue
    this.exportQueue = [];

    console.log(`✅ WorksheetAutopopulationService cleaned up`);
  }
}

export default new WorksheetAutopopulationService();
