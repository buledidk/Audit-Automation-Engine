/**
 * RECONCILIATION MODULE (ISA 500)
 * Hybrid: computational matching + AI for unmatched investigation.
 * Performs automated matching, three-way match, difference analysis,
 * and variance projection for audit substantive procedures.
 */

import claudeClient, { MODELS } from '../claudeClient.js';

export class ReconciliationModule {
  constructor() {
    this.claude = claudeClient;
    this.checksPerformed = 0;
  }

  /**
   * Automated matching between two data sources based on rules.
   * @param {Array<Object>} sourceA - First data source (e.g., GL entries)
   * @param {Array<Object>} sourceB - Second data source (e.g., bank statements)
   * @param {{matchFields: Array<{a: string, b: string}>, tolerance?: number}} rules
   * @returns {{matched: Array, unmatched: {sourceA: Array, sourceB: Array}, matchRate: number}}
   */
  automatedMatching(sourceA, sourceB, rules = {}) {
    this.checksPerformed++;

    if (!Array.isArray(sourceA) || !Array.isArray(sourceB)) {
      return { matched: [], unmatched: { sourceA: [], sourceB: [] }, matchRate: 0 };
    }

    const matchFields = rules.matchFields || [];
    const tolerance = rules.tolerance || 0.01;
    const matched = [];
    const usedB = new Set();

    for (let i = 0; i < sourceA.length; i++) {
      const a = sourceA[i];
      let bestMatch = null;
      let bestScore = 0;

      for (let j = 0; j < sourceB.length; j++) {
        if (usedB.has(j)) continue;
        const b = sourceB[j];

        let fieldMatches = 0;
        for (const field of matchFields) {
          const valA = a[field.a];
          const valB = b[field.b];

          if (typeof valA === 'number' && typeof valB === 'number') {
            if (Math.abs(valA - valB) <= tolerance) fieldMatches++;
          } else if (String(valA).toLowerCase() === String(valB).toLowerCase()) {
            fieldMatches++;
          }
        }

        const score = matchFields.length > 0 ? fieldMatches / matchFields.length : 0;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = { index: j, item: b, score };
        }
      }

      if (bestMatch && bestScore >= 0.8) {
        matched.push({
          sourceA: { index: i, item: a },
          sourceB: { index: bestMatch.index, item: bestMatch.item },
          matchScore: Math.round(bestScore * 100) / 100,
        });
        usedB.add(bestMatch.index);
      }
    }

    const unmatchedA = sourceA.filter((_, i) => !matched.some(m => m.sourceA.index === i));
    const unmatchedB = sourceB.filter((_, j) => !usedB.has(j));
    const total = Math.max(sourceA.length, sourceB.length);

    return {
      matched,
      unmatched: {
        sourceA: unmatchedA,
        sourceB: unmatchedB,
      },
      matchRate: total > 0 ? Math.round((matched.length / total) * 10000) / 100 : 0,
      totalSourceA: sourceA.length,
      totalSourceB: sourceB.length,
      matchedCount: matched.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Perform three-way match between invoices, purchase orders, and goods received notes.
   * @param {Array<{id: string, amount: number, vendor: string, date: string}>} invoices
   * @param {Array<{id: string, amount: number, vendor: string, poNumber: string}>} purchaseOrders
   * @param {Array<{id: string, quantity: number, vendor: string, poNumber: string}>} goodsReceived
   * @returns {{fullyMatched: Array, partial: Array, unmatched: Array}}
   */
  performThreeWayMatch(invoices, purchaseOrders, goodsReceived) {
    this.checksPerformed++;

    if (!Array.isArray(invoices)) {
      return { fullyMatched: [], partial: [], unmatched: [] };
    }

    const fullyMatched = [];
    const partial = [];
    const unmatched = [];

    for (const invoice of invoices) {
      const vendor = (invoice.vendor || '').toLowerCase();
      const matchedPO = (purchaseOrders || []).find(
        po => (po.vendor || '').toLowerCase() === vendor && Math.abs((Number(po.amount) || 0) - (Number(invoice.amount) || 0)) < 0.01
      );
      const matchedGRN = (goodsReceived || []).find(
        grn => (grn.vendor || '').toLowerCase() === vendor && matchedPO && grn.poNumber === matchedPO.poNumber
      );

      if (matchedPO && matchedGRN) {
        fullyMatched.push({
          invoice,
          purchaseOrder: matchedPO,
          goodsReceived: matchedGRN,
          matchType: 'full',
        });
      } else if (matchedPO || matchedGRN) {
        partial.push({
          invoice,
          purchaseOrder: matchedPO || null,
          goodsReceived: matchedGRN || null,
          matchType: 'partial',
          missing: !matchedPO ? 'purchaseOrder' : 'goodsReceived',
        });
      } else {
        unmatched.push({ invoice, matchType: 'none' });
      }
    }

    return {
      fullyMatched,
      partial,
      unmatched,
      summary: {
        totalInvoices: invoices.length,
        fullyMatchedCount: fullyMatched.length,
        partialCount: partial.length,
        unmatchedCount: unmatched.length,
        fullMatchRate: invoices.length > 0 ? Math.round((fullyMatched.length / invoices.length) * 10000) / 100 : 0,
      },
      isaReference: 'ISA 500',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Analyze and categorize differences between two data sets.
   * @param {Array<{description: string, amount: number, type?: string, date?: string}>} differences
   * @returns {{categorized: Object, materialDiffs: Array}}
   */
  analyzeDifferences(differences) {
    this.checksPerformed++;

    if (!Array.isArray(differences) || differences.length === 0) {
      return { categorized: { timing: [], permanent: [], error: [] }, materialDiffs: [] };
    }

    const categorized = { timing: [], permanent: [], error: [] };
    const materialDiffs = [];

    for (const diff of differences) {
      const amount = Math.abs(Number(diff.amount) || 0);
      const type = (diff.type || '').toLowerCase();

      // Categorize
      if (type.includes('timing') || type.includes('cutoff') || type.includes('transit')) {
        categorized.timing.push(diff);
      } else if (type.includes('permanent') || type.includes('write-off') || type.includes('adjustment')) {
        categorized.permanent.push(diff);
      } else {
        categorized.error.push(diff);
      }

      // Flag material differences (> 1000 as a simple threshold)
      if (amount > 1000) {
        materialDiffs.push({
          ...diff,
          absoluteAmount: amount,
          severity: amount > 10000 ? 'HIGH' : amount > 5000 ? 'MEDIUM' : 'LOW',
        });
      }
    }

    return {
      categorized,
      materialDiffs,
      summary: {
        totalDifferences: differences.length,
        timingCount: categorized.timing.length,
        permanentCount: categorized.permanent.length,
        errorCount: categorized.error.length,
        materialCount: materialDiffs.length,
        netDifference: Math.round(differences.reduce((s, d) => s + (Number(d.amount) || 0), 0) * 100) / 100,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Project total variance from a sample of differences.
   * @param {Array<{amount: number}>} sampleDiffs - Sampled differences
   * @param {number} populationSize - Total population size
   * @param {number} [confidence=0.95] - Confidence level
   * @returns {{projectedMisstatement: number, bounds: Object}}
   */
  projectVariance(sampleDiffs, populationSize, confidence = 0.95) {
    this.checksPerformed++;

    if (!Array.isArray(sampleDiffs) || sampleDiffs.length === 0 || !populationSize) {
      return { projectedMisstatement: 0, bounds: { lower: 0, upper: 0 } };
    }

    const amounts = sampleDiffs.map(d => Number(d.amount) || 0);
    const n = amounts.length;
    const mean = amounts.reduce((s, v) => s + v, 0) / n;
    const stdDev = Math.sqrt(amounts.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1 || 1));

    // Z-score for confidence level
    const zScores = { 0.9: 1.645, 0.95: 1.96, 0.99: 2.576 };
    const z = zScores[confidence] || 1.96;

    const projectedMisstatement = Math.round(mean * populationSize * 100) / 100;
    const marginOfError = Math.round(z * (stdDev / Math.sqrt(n)) * populationSize * 100) / 100;

    return {
      projectedMisstatement,
      bounds: {
        lower: Math.round((projectedMisstatement - marginOfError) * 100) / 100,
        upper: Math.round((projectedMisstatement + marginOfError) * 100) / 100,
      },
      sampleSize: n,
      populationSize,
      confidence,
      sampleMean: Math.round(mean * 100) / 100,
      sampleStdDev: Math.round(stdDev * 100) / 100,
      isaReference: 'ISA 530',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * AI: Investigate unmatched items and suggest explanations (SONNET).
   * @param {Array<Object>} items - Unmatched items to investigate
   * @param {Object} ctx - Engagement context
   * @returns {Promise<{investigations: Array}>}
   */
  async investigateUnmatched(items, ctx = {}) {
    this.checksPerformed++;

    if (!Array.isArray(items) || items.length === 0) {
      return { investigations: [] };
    }

    const prompt = `You are an experienced auditor investigating unmatched reconciliation items under ISA 500.

Context:
- Industry: ${ctx.industry || 'Not specified'}
- Entity type: ${ctx.entityType || 'Not specified'}
- Reconciliation type: ${ctx.reconciliationType || 'General'}
- Materiality: ${ctx.materiality || 'Not specified'}

Unmatched items requiring investigation:
${JSON.stringify(items.slice(0, 20), null, 2)}

For each item (or group of similar items), provide:
1. Most likely explanation
2. Risk assessment
3. Recommended follow-up procedure
4. Whether it could indicate a material misstatement

Return JSON: {
  "investigations": [
    {
      "items": [<item descriptions>],
      "likelyExplanation": "<explanation>",
      "riskLevel": "HIGH|MEDIUM|LOW",
      "followUpProcedure": "<recommended action>",
      "potentialMisstatement": true|false,
      "estimatedImpact": "<monetary impact assessment>",
      "isaReference": "ISA 500"
    }
  ]
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.SONNET,
      maxTokens: 2048,
      thinking: false,
      system: 'You are an ISA 500 reconciliation specialist. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  getMetrics() {
    return {
      module: 'Reconciliation',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      isaReference: 'ISA 500',
      aiRequired: true,
      model: MODELS.SONNET,
    };
  }
}

export default new ReconciliationModule();
