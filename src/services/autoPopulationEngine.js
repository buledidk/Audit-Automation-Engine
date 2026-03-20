/**
 * Auto-Population Engine
 * Automatically populates audit procedures, test results, and findings
 * Based on extracted document data and external source enrichment
 */

import aiExtractionService from './aiExtractionService';
import companiesHouseConnector from './connectors/companiesHouseConnector';

export class AutoPopulationEngine {
  constructor() {
    this.populatedProcedures = [];
    this.autoTestResults = [];
    this.eventListeners = [];
  }

  /**
   * Auto-populate procedures and test results from extracted data
   * @param {Object} extractedData - Data from AI extraction service
   * @param {Object} auditContext - Audit engagement context
   * @returns {Promise<Object>} Populated procedures and test results
   */
  async autoPopulate(extractedData, auditContext) {
    console.log(`⚙️  Auto-populating procedures and test results...`);

    try {
      this.emit('population:started', { documentId: extractedData.documentId });

      const populated = {
        documentId: extractedData.documentId,
        procedures: [],
        testResults: [],
        findings: [],
        enrichmentSummary: {
          proceduresGenerated: 0,
          resultsPopulated: 0,
          findingsCreated: 0,
          estimatedCompletionRate: 0
        }
      };

      // 1. Auto-populate procedures from extracted procedures
      populated.procedures = await this.populateProcedures(extractedData.procedures, auditContext);
      populated.enrichmentSummary.proceduresGenerated = populated.procedures.length;

      // 2. Auto-populate test results
      populated.testResults = await this.populateTestResults(
        extractedData,
        populated.procedures,
        auditContext
      );
      populated.enrichmentSummary.resultsPopulated = populated.testResults.length;

      // 3. Convert findings to testable items
      populated.findings = await this.convertFindingsToTests(
        extractedData.findings,
        auditContext
      );
      populated.enrichmentSummary.findingsCreated = populated.findings.length;

      // 4. Enrich with external data
      populated.enrichedData = await this.enrichWithExternalData(
        extractedData,
        auditContext
      );

      // 5. Calculate completion rate
      const totalAvailable = extractedData.procedures.length + extractedData.findings.length;
      if (totalAvailable > 0) {
        populated.enrichmentSummary.estimatedCompletionRate =
          Math.round(
            (populated.procedures.length + populated.testResults.length) / (totalAvailable * 2) * 100
          );
      }

      this.populatedProcedures.push(...populated.procedures);
      this.autoTestResults.push(...populated.testResults);

      this.emit('population:completed', {
        documentId: extractedData.documentId,
        proceduresGenerated: populated.enrichmentSummary.proceduresGenerated,
        resultsPopulated: populated.enrichmentSummary.resultsPopulated,
        completionRate: populated.enrichmentSummary.estimatedCompletionRate
      });

      console.log(`✅ Auto-population complete: ${populated.procedures.length} procedures, ${populated.testResults.length} results`);

      return populated;
    } catch (error) {
      console.error('❌ Auto-population failed:', error);
      this.emit('population:error', { error: error.message });
      throw error;
    }
  }

  /**
   * Populate procedures with required details
   */
  async populateProcedures(extractedProcedures, auditContext) {
    return extractedProcedures.map((proc, index) => ({
      id: `proc-${Date.now()}-${index}`,
      name: proc.name,
      description: proc.description || `Audit procedure: ${proc.name}`,
      isA: proc.isA || 'ISA 500',
      fsli: proc.fsli || this.inferFSLI(proc.name),
      assertion: proc.assertion || this.inferAssertion(proc.name),
      sampleSize: proc.sampleSize || this.calculateSampleSize(auditContext, proc),
      testableItems: proc.testableItems || [],
      status: 'not_started',
      automatable: proc.automatable !== false,
      priority: proc.priority || 'medium',
      createdFrom: 'auto_extraction',
      createdAt: new Date().toISOString(),
      expectedDuration: this.estimateProcedureDuration(proc),
      evidenceExpected: this.defineEvidenceExpectations(proc)
    }));
  }

  /**
   * Populate test results
   */
  async populateTestResults(extractedData, populatedProcedures, auditContext) {
    const testResults = [];

    for (const procedure of populatedProcedures) {
      // Find related extracted findings
      const relatedFindings = extractedData.findings.filter(
        f => f.fsli === procedure.fsli || f.procedureName === procedure.name
      );

      if (relatedFindings.length > 0) {
        const result = {
          id: `result-${Date.now()}-${Math.random()}`,
          procedureId: procedure.id,
          procedureName: procedure.name,
          status: 'completed',
          itemsTested: relatedFindings.length,
          itemsPassed: relatedFindings.filter(f => f.severity === 'low').length,
          itemsFailed: relatedFindings.filter(f => f.severity !== 'low').length,
          exceptions: relatedFindings.filter(f => f.severity !== 'low').map(f => ({
            description: f.description,
            severity: f.severity,
            amount: f.amount,
            recommendation: f.recommendation || ''
          })),
          passRate: 0,
          conclusion: 'Needs professional judgment',
          completedAt: new Date().toISOString(),
          createdFrom: 'auto_extraction',
          auditorReviewRequired: true
        };

        // Calculate pass rate
        result.passRate = result.itemsTested > 0
          ? Math.round((result.itemsPassed / result.itemsTested) * 100)
          : 0;

        testResults.push(result);
      }
    }

    return testResults;
  }

  /**
   * Convert findings to tests
   */
  async convertFindingsToTests(extractedFindings, auditContext) {
    return extractedFindings.map((finding, index) => ({
      id: `finding-test-${Date.now()}-${index}`,
      description: finding.description,
      fsli: finding.fsli || 'Other',
      amount: finding.amount || 0,
      severity: finding.severity || 'medium',
      status: 'identified',
      testRequired: true,
      proposedProcedure: `Review ${finding.description}`,
      estimatedSampleSize: this.calculateTestSampleSize(finding, auditContext),
      createdFrom: 'auto_extraction',
      priorityLevel: this.mapSeverityToPriority(finding.severity),
      evidence: {
        available: true,
        location: finding.source || 'Document'
      }
    }));
  }

  /**
   * Enrich with external data sources
   */
  async enrichWithExternalData(extractedData, auditContext) {
    console.log(`🌐 Enriching with external data...`);

    const enrichment = {
      companiesHouse: null,
      compliance: null,
      regulatory: null
    };

    try {
      // Get Companies House data if entity name available
      if (auditContext.entityName) {
        const chData = await companiesHouseConnector.searchCompany(auditContext.entityName);
        if (chData.companies.length > 0) {
          const company = chData.companies[0];
          enrichment.companiesHouse = {
            companyNumber: company.companyNumber,
            status: company.status,
            incorporation: company.incorporation,
            details: await companiesHouseConnector.getCompanyDetails(company.companyNumber),
            filings: await companiesHouseConnector.getFilingHistory(company.companyNumber, 5)
          };

          console.log(`✅ Enriched with Companies House data`);
        }
      }

      // Determine applicable compliance frameworks
      enrichment.compliance = this.mapComplianceFrameworks(
        extractedData,
        auditContext,
        enrichment.companiesHouse
      );

      return enrichment;
    } catch (error) {
      console.error('External enrichment error:', error);
      return enrichment;
    }
  }

  /**
   * Infer FSLI from procedure name
   */
  inferFSLI(procedureName) {
    const mappings = {
      'cash': 'Cash',
      'bank': 'Cash',
      'confirmation': 'Cash',
      'receivable': 'Trade Receivables',
      'debtor': 'Trade Receivables',
      'inventory': 'Inventory',
      'stock': 'Inventory',
      'count': 'Inventory',
      'fixed asset': 'Fixed Assets',
      'tangible': 'Fixed Assets',
      'property': 'Fixed Assets',
      'payable': 'Trade Payables',
      'creditor': 'Trade Payables',
      'employee': 'Employee Benefits',
      'tax': 'Tax Liabilities',
      'equity': 'Equity',
      'share': 'Equity',
      'revenue': 'Revenue',
      'income': 'Revenue',
      'expense': 'Operating Expenses'
    };

    const lower = procedureName.toLowerCase();
    for (const [keyword, fsli] of Object.entries(mappings)) {
      if (lower.includes(keyword)) {
        return fsli;
      }
    }

    return 'Other';
  }

  /**
   * Infer assertion from procedure name
   */
  inferAssertion(procedureName) {
    const lower = procedureName.toLowerCase();

    if (lower.includes('exist') || lower.includes('confirm')) return 'Existence';
    if (lower.includes('complete') || lower.includes('cutoff')) return 'Completeness';
    if (lower.includes('accurate') || lower.includes('recompute')) return 'Accuracy';
    if (lower.includes('right') || lower.includes('obligation')) return 'Rights and Obligations';
    if (lower.includes('separate') || lower.includes('classify')) return 'Presentation';

    return 'Occurrence';
  }

  /**
   * Calculate sample size
   */
  calculateSampleSize(auditContext, procedure) {
    const baseSize = 30;
    let multiplier = 1;

    if (auditContext.riskLevel === 'high') multiplier = 1.5;
    if (auditContext.riskLevel === 'medium') multiplier = 1.0;
    if (auditContext.riskLevel === 'low') multiplier = 0.7;

    return Math.ceil(baseSize * multiplier);
  }

  /**
   * Calculate test sample size for findings
   */
  calculateTestSampleSize(finding, auditContext) {
    if (finding.severity === 'high') return 100; // Test everything high severity
    if (finding.severity === 'medium') return 50;
    return 30;
  }

  /**
   * Estimate procedure duration in minutes
   */
  estimateProcedureDuration(procedure) {
    const durationMap = {
      'confirmation': 45,
      'observation': 60,
      'reconciliation': 90,
      'recalculation': 120,
      'inspection': 60,
      'interview': 45,
      'analytical': 30
    };

    for (const [keyword, duration] of Object.entries(durationMap)) {
      if (procedure.name.toLowerCase().includes(keyword)) {
        return duration;
      }
    }

    return 60;
  }

  /**
   * Define evidence expectations
   */
  defineEvidenceExpectations(procedure) {
    return {
      types: this.getEvidenceTypes(procedure.name),
      minCount: procedure.sampleSize ? Math.ceil(procedure.sampleSize * 0.2) : 5,
      retentionRequired: true,
      photoRequired: procedure.name.toLowerCase().includes('observation')
    };
  }

  /**
   * Get expected evidence types
   */
  getEvidenceTypes(procedureName) {
    const lower = procedureName.toLowerCase();

    if (lower.includes('confirmation')) return ['Bank Confirmation', 'Written Reply'];
    if (lower.includes('observation')) return ['Photos', 'Video', 'Inspection Notes'];
    if (lower.includes('reconciliation')) return ['Reconciliation Workings', 'Supporting Detail'];
    if (lower.includes('interview')) return ['Meeting Notes', 'Signed Confirmation'];

    return ['Documentation', 'System Extract', 'Workings'];
  }

  /**
   * Map severity to priority
   */
  mapSeverityToPriority(severity) {
    const map = {
      'high': 'critical',
      'medium': 'high',
      'low': 'medium'
    };

    return map[severity] || 'medium';
  }

  /**
   * Map compliance frameworks based on extracted data
   */
  mapComplianceFrameworks(extractedData, auditContext, companiesHouseData) {
    const frameworks = ['ISA 200-700'];

    // Add UK frameworks
    if (auditContext.jurisdiction === 'UK' || !auditContext.jurisdiction) {
      frameworks.push('FRS 102');
      frameworks.push('Companies House Requirements');
    }

    // Add GDPR if personal data found
    if (this.hasPersonalData(extractedData)) {
      frameworks.push('GDPR');
    }

    // Add IFRS if large company
    if (companiesHouseData && companiesHouseData.details?.type?.includes('public')) {
      frameworks.push('IFRS');
    }

    // Add quality control
    frameworks.push('ISQM 1');

    return frameworks;
  }

  /**
   * Check if extracted data contains personal data
   */
  hasPersonalData(extractedData) {
    const personalDataKeywords = ['name', 'address', 'phone', 'email', 'ssn', 'national id'];
    const allText = JSON.stringify(extractedData).toLowerCase();

    return personalDataKeywords.some(keyword => allText.includes(keyword));
  }

  /**
   * Get populated procedures
   */
  getPopulatedProcedures() {
    return this.populatedProcedures;
  }

  /**
   * Get auto test results
   */
  getAutoTestResults() {
    return this.autoTestResults;
  }

  /**
   * Event system
   */
  on(event, callback) {
    this.eventListeners.push({ event, callback });
  }

  emit(event, data) {
    this.eventListeners.forEach(listener => {
      if (listener.event === event) {
        listener.callback(data);
      }
    });
  }
}

export default new AutoPopulationEngine();
