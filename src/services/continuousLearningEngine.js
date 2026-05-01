// ═══════════════════════════════════════════════════════════════
// CONTINUOUS LEARNING ENGINE — Adaptive Intelligence Architecture
// AuditEngine v10 AURA
// Learns from audit patterns, user behavior, and outcomes
// ═══════════════════════════════════════════════════════════════

class ContinuousLearningEngine {
    constructor() {
          this.patterns = new Map();
          this.feedbackLog = [];
          this.modelVersion = '1.0.0';
          this.learningRate = 0.1;
          this.confidenceThreshold = 0.75;
          this.riskPatterns = new Map();
          this.procedureEffectiveness = new Map();
          this.userPreferences = new Map();
          this._loadPersistedData();
    }

  _loadPersistedData() {
        try {
                const saved = localStorage.getItem('ae_learning_engine');
                if (saved) {
                          const data = JSON.parse(saved);
                          if (data.patterns) this.patterns = new Map(Object.entries(data.patterns));
                          if (data.riskPatterns) this.riskPatterns = new Map(Object.entries(data.riskPatterns));
                          if (data.feedbackLog) this.feedbackLog = data.feedbackLog.slice(-500);
                }
        } catch (e) { /* fresh start */ } // eslint-disable-line no-unused-vars
  }

  _persist() {
        try {
                const data = {
                          patterns: Object.fromEntries(this.patterns),
                          riskPatterns: Object.fromEntries(this.riskPatterns),
                          feedbackLog: this.feedbackLog.slice(-500),
                          modelVersion: this.modelVersion,
                          savedAt: new Date().toISOString()
                };
                localStorage.setItem('ae_learning_engine', JSON.stringify(data));
        } catch (e) { /* quota exceeded, skip */ } // eslint-disable-line no-unused-vars
  }

  // Record an audit event for pattern learning
  recordEvent(eventType, context = {}) {
        const event = {
                type: eventType,
                context,
                timestamp: new Date().toISOString(),
                engagementId: context.engagementId || null
        };

      const key = `${eventType}:${context.category || 'general'}`;
        const existing = this.patterns.get(key) || { count: 0, contexts: [], lastSeen: null };
        existing.count++;
        existing.lastSeen = event.timestamp;
        existing.contexts = [...existing.contexts.slice(-10), context];
        this.patterns.set(key, existing);

      this._persist();
        return event;
  }

  // Record user feedback on AI suggestions
  recordFeedback(suggestionId, accepted, context = {}) {
        const feedback = {
                suggestionId,
                accepted,
                context,
                timestamp: new Date().toISOString()
        };

      this.feedbackLog.push(feedback);
        this._updateConfidence(context.category, accepted);
        this._persist();
        return feedback;
  }

  _updateConfidence(category, positive) {
        const key = `confidence:${category || 'general'}`;
        const current = this.patterns.get(key) || { positive: 0, total: 0 };
        current.total++;
        if (positive) current.positive++;
        current.rate = current.total > 0 ? current.positive / current.total : 0;
        this.patterns.set(key, current);
  }

  // Learn risk patterns from completed engagements
  learnFromEngagement(engagement) {
        if (!engagement?.id) return;

      const patterns = {
              sector: engagement.sector || 'general',
              riskLevel: engagement.riskLevel || 'medium',
              findingsCount: engagement.findings?.length || 0,
              materialMisstatements: engagement.findings?.filter(f => f.material).length || 0,
              completionTime: engagement.completionTime || null,
              adjustmentsRequired: engagement.adjustments?.length || 0
      };

      const sectorKey = `sector:${patterns.sector}`;
        const existing = this.riskPatterns.get(sectorKey) || {
                engagementCount: 0,
                avgFindings: 0,
                avgMaterialFindings: 0,
                riskDistribution: { low: 0, medium: 0, high: 0 }
        };

      existing.engagementCount++;
        existing.avgFindings = ((existing.avgFindings * (existing.engagementCount - 1)) + patterns.findingsCount) / existing.engagementCount;
        existing.avgMaterialFindings = ((existing.avgMaterialFindings * (existing.engagementCount - 1)) + patterns.materialMisstatements) / existing.engagementCount;
        existing.riskDistribution[patterns.riskLevel] = (existing.riskDistribution[patterns.riskLevel] || 0) + 1;

      this.riskPatterns.set(sectorKey, existing);
        this._persist();

      return patterns;
  }

  // Track procedure effectiveness
  recordProcedureOutcome(procedureId, outcome) {
        const existing = this.procedureEffectiveness.get(procedureId) || {
                timesUsed: 0, findingsDetected: 0, falsePositives: 0, avgTimeMinutes: 0
        };

      existing.timesUsed++;
        if (outcome.findingDetected) existing.findingsDetected++;
        if (outcome.falsePositive) existing.falsePositives++;
        existing.avgTimeMinutes = ((existing.avgTimeMinutes * (existing.timesUsed - 1)) + (outcome.timeMinutes || 0)) / existing.timesUsed;
        existing.effectiveness = existing.timesUsed > 0 ? existing.findingsDetected / existing.timesUsed : 0;

      this.procedureEffectiveness.set(procedureId, existing);
        return existing;
  }

  // Get risk prediction for a new engagement
  predictRisk(engagementContext) {
        const sector = engagementContext.sector || 'general';
        const sectorData = this.riskPatterns.get(`sector:${sector}`);

      if (!sectorData || sectorData.engagementCount < 3) {
              return {
                        predictedRisk: 'medium',
                        confidence: 0.5,
                        basis: 'insufficient_data',
                        recommendation: 'Apply standard risk assessment procedures'
              };
      }

      const totalDist = Object.values(sectorData.riskDistribution).reduce((a, b) => a + b, 0);
        const highRatio = (sectorData.riskDistribution.high || 0) / totalDist;
        const avgFindings = sectorData.avgFindings;

      let predictedRisk = 'medium';
        let confidence = 0.6;

      if (highRatio > 0.4 || avgFindings > 5) {
              predictedRisk = 'high';
              confidence = Math.min(0.95, 0.6 + (sectorData.engagementCount * 0.02));
      } else if (highRatio < 0.15 && avgFindings < 2) {
              predictedRisk = 'low';
              confidence = Math.min(0.9, 0.6 + (sectorData.engagementCount * 0.02));
      }

      return {
              predictedRisk,
              confidence: Math.round(confidence * 100) / 100,
              basis: `${sectorData.engagementCount} prior ${sector} engagements`,
              sectorAvgFindings: Math.round(avgFindings * 10) / 10,
              recommendation: predictedRisk === 'high'
                ? 'Increase sample sizes and assign experienced team members'
                        : predictedRisk === 'low'
                  ? 'Standard procedures appropriate, consider efficiency gains'
                          : 'Apply balanced approach with focused testing on key areas'
      };
  }

  // Suggest procedures based on learned patterns
  suggestProcedures(_context) {
        const suggestions = [];
        const effectiveness = [...this.procedureEffectiveness.entries()]
          .filter(([, data]) => data.effectiveness > 0.3 && data.timesUsed >= 3)
          .sort((a, b) => b[1].effectiveness - a[1].effectiveness);

      effectiveness.slice(0, 5).forEach(([procId, data]) => {
              suggestions.push({
                        procedureId: procId,
                        confidence: Math.round(data.effectiveness * 100) / 100,
                        timesUsed: data.timesUsed,
                        avgTimeMinutes: Math.round(data.avgTimeMinutes),
                        reason: `${Math.round(data.effectiveness * 100)}% detection rate across ${data.timesUsed} uses`
              });
      });

      return suggestions;
  }

  // Get learning metrics
  getMetrics() {
        const totalEvents = [...this.patterns.values()].reduce((sum, p) => sum + (p.count || 0), 0);
        const totalFeedback = this.feedbackLog.length;
        const positiveFeedback = this.feedbackLog.filter(f => f.accepted).length;
        const sectorCount = this.riskPatterns.size;

      return {
              modelVersion: this.modelVersion,
              totalEventsProcessed: totalEvents,
              totalFeedbackReceived: totalFeedback,
              feedbackAcceptanceRate: totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 0,
              sectorsAnalyzed: sectorCount,
              proceduresTracked: this.procedureEffectiveness.size,
              patternsLearned: this.patterns.size,
              lastUpdated: new Date().toISOString()
      };
  }

  // Reset learning data
  reset() {
        this.patterns.clear();
        this.feedbackLog = [];
        this.riskPatterns.clear();
        this.procedureEffectiveness.clear();
        this.userPreferences.clear();
        localStorage.removeItem('ae_learning_engine');
  }
}

export const continuousLearningEngine = new ContinuousLearningEngine();
export default ContinuousLearningEngine;
