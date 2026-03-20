/**
 * AI Extraction Service
 * Uses Claude API to intelligently extract and structure data from documents
 * Automatically populates audit procedures, findings, and compliance mappings
 */

import Anthropic from '@anthropic-ai/sdk';

export class AIExtractionService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.extractionHistory = [];
    this.eventListeners = [];
  }

  /**
   * Extract audit-relevant data from document chunks
   * Maps to audit procedures, ISA standards, and compliance requirements
   */
  async extractAuditData(documentChunks, documentMetadata, auditContext) {
    console.log(`🤖 Extracting audit data from ${documentChunks.length} chunks`);

    try {
      this.emit('extraction:started', { documentId: documentMetadata.documentId });

      const extractedData = {
        documentId: documentMetadata.documentId,
        extractedAt: new Date().toISOString(),
        findings: [],
        entities: [],
        procedures: [],
        complianceGaps: [],
        riskIndicators: [],
        testableAssertions: []
      };

      // Process each chunk
      for (let i = 0; i < documentChunks.length; i++) {
        const chunk = documentChunks[i];
        console.log(`⏳ Processing chunk ${i + 1}/${documentChunks.length}...`);

        const chunkExtraction = await this.extractFromChunk(
          chunk,
          auditContext,
          i,
          documentChunks.length
        );

        // Merge chunk results
        extractedData.findings.push(...(chunkExtraction.findings || []));
        extractedData.entities.push(...(chunkExtraction.entities || []));
        extractedData.procedures.push(...(chunkExtraction.procedures || []));
        extractedData.complianceGaps.push(...(chunkExtraction.complianceGaps || []));
        extractedData.riskIndicators.push(...(chunkExtraction.riskIndicators || []));
        extractedData.testableAssertions.push(...(chunkExtraction.testableAssertions || []));

        this.emit('extraction:progress', {
          documentId: documentMetadata.documentId,
          progress: Math.round((i + 1) / documentChunks.length * 100),
          currentChunk: i + 1,
          totalChunks: documentChunks.length
        });
      }

      // Deduplicate and enhance
      extractedData.findings = this.deduplicateAndEnhance(extractedData.findings);
      extractedData.procedures = this.mapToProcedures(extractedData.procedures, auditContext);
      extractedData.complianceGaps = this.mapToFrameworks(extractedData.complianceGaps, auditContext);

      this.emit('extraction:completed', {
        documentId: documentMetadata.documentId,
        findingsCount: extractedData.findings.length,
        proceduresCount: extractedData.procedures.length,
        complianceGapsCount: extractedData.complianceGaps.length
      });

      console.log(`✅ Extraction complete: ${extractedData.findings.length} findings, ${extractedData.procedures.length} procedures`);

      return extractedData;
    } catch (error) {
      console.error('❌ Extraction failed:', error);
      this.emit('extraction:error', { error: error.message });
      throw error;
    }
  }

  /**
   * Extract from individual chunk using Claude
   */
  async extractFromChunk(chunk, auditContext, chunkIndex, totalChunks) {
    const systemPrompt = `You are an expert audit AI assistant specialized in extracting audit-relevant data from documents.

Your task is to analyze document content and extract:
1. Key findings and exceptions
2. Financial/operational entities and their characteristics
3. Applicable audit procedures for each finding
4. Compliance gaps relative to frameworks (ISA, FRS 102, IFRS, GDPR)
5. Risk indicators that suggest control failures
6. Testable assertions that should be validated

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "findings": [{"description": "", "severity": "high|medium|low", "fsli": "", "amount": 0}],
  "entities": [{"name": "", "type": "", "classification": "", "riskLevel": ""}],
  "procedures": [{"name": "", "isA": "ISA 500", "assertion": "", "sampleSize": 0}],
  "complianceGaps": [{"framework": "ISA|FRS|IFRS|GDPR", "requirement": "", "gap": "", "remediationNeeded": true}],
  "riskIndicators": [{"indicator": "", "likelihood": "high|medium|low", "potentialImpact": ""}],
  "testableAssertions": [{"assertion": "", "relatedProcedure": "", "evidence": ""}]
}`;

    const userPrompt = `Analyze this document chunk (${chunkIndex + 1}/${totalChunks}) for an audit of "${auditContext.entityName}" (${auditContext.industry}):

Document content:
${chunk.text}

Extraction context:
- Audit standards in scope: ${auditContext.standards?.join(', ') || 'ISA 200-700, FRS 102'}
- FSLI areas: ${auditContext.fslis?.join(', ') || 'Cash, Receivables, Inventory, Fixed Assets'}
- Risk level: ${auditContext.riskLevel || 'medium'}

Extract all audit-relevant data with high accuracy. Focus on:
1. Specific amounts and dates
2. Internal control observations
3. Compliance violations or gaps
4. Evidence of assertions being tested`;

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const content = response.content[0].text;

      // Parse JSON response
      try {
        const extracted = JSON.parse(content);
        return extracted;
      } catch (parseError) {
        console.error('Failed to parse Claude response:', parseError);
        return {
          findings: [],
          entities: [],
          procedures: [],
          complianceGaps: [],
          riskIndicators: [],
          testableAssertions: []
        };
      }
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  /**
   * Deduplicate and enhance findings
   */
  deduplicateAndEnhance(findings) {
    const unique = new Map();

    findings.forEach(finding => {
      const key = `${finding.description.substring(0, 50)}`;
      if (!unique.has(key)) {
        unique.set(key, {
          ...finding,
          occurrenceCount: 1,
          sources: [finding.source || 'extracted']
        });
      } else {
        const existing = unique.get(key);
        existing.occurrenceCount++;
        if (finding.source && !existing.sources.includes(finding.source)) {
          existing.sources.push(finding.source);
        }
        // Update severity if new finding is higher
        if (['high', 'medium', 'low'].indexOf(finding.severity) <
            ['high', 'medium', 'low'].indexOf(existing.severity)) {
          existing.severity = finding.severity;
        }
      }
    });

    return Array.from(unique.values());
  }

  /**
   * Map extracted procedures to ISA standards
   */
  mapToProcedures(procedures, auditContext) {
    const standardProcedures = {
      'bank confirmation': 'ISA 505',
      'confirmation': 'ISA 505',
      'receivables confirmation': 'ISA 505',
      'inventory count': 'ISA 501',
      'observation': 'ISA 501',
      'reconciliation': 'ISA 500',
      'recalculation': 'ISA 500',
      'inspection': 'ISA 500',
      'analytical procedures': 'ISA 520',
      'cutoff testing': 'ISA 500'
    };

    return procedures.map(proc => {
      const lowerName = proc.name.toLowerCase();
      let mappedISA = proc.isA || 'ISA 500';

      Object.entries(standardProcedures).forEach(([keyword, isa]) => {
        if (lowerName.includes(keyword)) {
          mappedISA = isa;
        }
      });

      return {
        ...proc,
        isA: mappedISA,
        automatable: this.isProcedureAutomatable(proc.name),
        priority: this.calculateProcedurePriority(proc)
      };
    });
  }

  /**
   * Map compliance gaps to frameworks
   */
  mapToFrameworks(gaps, auditContext) {
    return gaps.map(gap => {
      let framework = gap.framework || 'ISA 200';

      // Auto-detect framework from requirement text
      const requirementLower = gap.requirement.toLowerCase();
      if (requirementLower.includes('gdpr') || requirementLower.includes('data protection')) {
        framework = 'GDPR';
      } else if (requirementLower.includes('frs 102')) {
        framework = 'FRS 102';
      } else if (requirementLower.includes('ifrs')) {
        framework = 'IFRS';
      } else if (requirementLower.includes('quality') || requirementLower.includes('control')) {
        framework = 'ISQM 1';
      }

      return {
        ...gap,
        framework,
        priority: gap.remediationNeeded ? 'high' : 'medium',
        remediationDeadline: this.calculateRemediationDeadline(framework)
      };
    });
  }

  /**
   * Check if procedure is automatable
   */
  isProcedureAutomatable(procedureName) {
    const automatable = ['reconciliation', 'recalculation', 'analytical', 'cutoff'];
    return automatable.some(word => procedureName.toLowerCase().includes(word));
  }

  /**
   * Calculate procedure priority based on severity
   */
  calculateProcedurePriority(procedure) {
    if (procedure.severity === 'high') return 'critical';
    if (procedure.severity === 'medium') return 'high';
    return 'medium';
  }

  /**
   * Calculate remediation deadline based on framework
   */
  calculateRemediationDeadline(framework) {
    const today = new Date();
    const deadlineMap = {
      'GDPR': 30,
      'ISA 200': 14,
      'FRS 102': 7,
      'IFRS': 7,
      'ISQM 1': 21
    };

    const days = deadlineMap[framework] || 14;
    const deadline = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    return deadline.toISOString();
  }

  /**
   * Event system
   */
  on(event, callback) {
    if (!this.eventListeners) this.eventListeners = [];
    this.eventListeners.push({ event, callback });
  }

  emit(event, data) {
    if (this.eventListeners) {
      this.eventListeners.forEach(listener => {
        if (listener.event === event) {
          listener.callback(data);
        }
      });
    }
  }

  /**
   * Get extraction history
   */
  getHistory() {
    return this.extractionHistory;
  }
}

export default new AIExtractionService();
