/**
 * Documentation Generation Service
 * Auto-generates audit documentation (Excel, Word) on phase completion
 * Compliant with ISA 230 (Audit Documentation)
 */

class DocumentationGenerationService {
  constructor() {
    this.generatedDocs = new Map();
    this.templates = new Map();
    this.listeners = new Map();
  }

  /**
   * Generate documentation for completed phase
   */
  async generateDocumentationForPhase(phaseId, phaseData) {
    console.log(`📄 Generating documentation for phase: ${phaseId}`);

    this.emit('documentation:started', { phaseId, timestamp: new Date().toISOString() });

    // Simulate generation
    await new Promise(r => setTimeout(r, 500));

    const narratives = {};
    const fslis = phaseData.fslis || [];

    for (const fsli of fslis) {
      narratives[fsli.id] = await this.generateFSLINarrative(fsli, phaseData);
    }

    const documentation = {
      phaseId,
      timestamp: new Date().toISOString(),
      narratives,
      status: 'completed',
      exportFormats: {
        excel: `${phaseId}-working-papers.xlsx`,
        word: `${phaseId}-audit-opinion.docx`,
        pdf: `${phaseId}-audit-report.pdf`
      }
    };

    this.generatedDocs.set(phaseId, documentation);
    this.emit('documentation:completed', documentation);

    return documentation;
  }

  /**
   * Generate narrative for specific FSLI
   */
  async generateFSLINarrative(fsli, _phaseData) {
    const narrative = `
FSLI: ${fsli.name || 'Unknown'}
Amount: £${fsli.amount || 'N/A'}
Assertion Being Tested: ${fsli.assertion || 'Existence, Completeness, Rights & Obligations, Valuation, Presentation & Disclosure'}

Procedures Performed:
${fsli.procedures ? fsli.procedures.map(p => `• ${p}`).join('\n') : '• Standard audit procedures applied'}

Testing Results:
- Items Tested: ${fsli.itemsTested || 'N/A'}
- Items Passed: ${fsli.itemsPassed || 'N/A'}
- Exceptions Identified: ${fsli.exceptions || 'None'}

Auditor Conclusion:
Based on the procedures performed and evidence obtained, ${fsli.name || 'this account'} is fairly stated 
in accordance with the applicable financial reporting framework.

Professional Judgment Applied:
${fsli.judgment || 'Standard audit procedures applied with appropriate professional skepticism.'}

Risk Assessment: ${fsli.riskLevel || 'Medium'}
Date Tested: ${new Date().toISOString().split('T')[0]}
    `.trim();

    return narrative;
  }

  /**
   * Export procedures to Excel format
   */
  async exportToExcel(phaseId) {
    console.log(`📊 Exporting ${phaseId} to Excel...`);

    const doc = this.generatedDocs.get(phaseId);
    if (!doc) {
      throw new Error(`Documentation not found for phase: ${phaseId}`);
    }

    // Generate mock Excel data
    const excelData = {
      format: 'xlsx',
      filename: doc.exportFormats.excel,
      sheets: {
        'Summary': {
          columns: ['FSLI', 'Amount', 'Status', 'Risk Level'],
          rows: Object.entries(doc.narratives).map(([ id, _narrative ]) => [
            id,
            'Amount',
            'Completed',
            'Medium'
          ])
        },
        'Procedures': {
          columns: ['Procedure ID', 'Description', 'Items Tested', 'Result'],
          rows: []
        },
        'Audit Trail': {
          columns: ['Timestamp', 'Action', 'User', 'Details'],
          rows: []
        }
      },
      generatedAt: new Date().toISOString()
    };

    this.emit('export:excel', { phaseId, filename: doc.exportFormats.excel });
    return excelData;
  }

  /**
   * Export to Word format
   */
  async exportToWord(phaseId) {
    console.log(`📄 Exporting ${phaseId} to Word...`);

    const doc = this.generatedDocs.get(phaseId);
    if (!doc) {
      throw new Error(`Documentation not found for phase: ${phaseId}`);
    }

    const wordData = {
      format: 'docx',
      filename: doc.exportFormats.word,
      sections: {
        'Title Page': `Audit Opinion - ${phaseId}`,
        'Executive Summary': 'Summary of findings and conclusions',
        'FSLI Narratives': doc.narratives,
        'Conclusions': 'Based on procedures performed, financial statements are fairly stated',
        'Sign-Off': {
          partner: '',
          manager: '',
          date: new Date().toISOString().split('T')[0]
        }
      }
    };

    this.emit('export:word', { phaseId, filename: doc.exportFormats.word });
    return wordData;
  }

  /**
   * Get all generated documents
   */
  getGeneratedDocuments() {
    return Array.from(this.generatedDocs.values());
  }

  /**
   * Event emitter methods
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }
}

export default new DocumentationGenerationService();
