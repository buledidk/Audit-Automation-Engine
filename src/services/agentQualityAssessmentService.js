/**
 * AGENT QUALITY ASSESSMENT SERVICE
 * ================================
 * Multi-dimensional quality evaluation for all 9 AI agents
 * Tracks: accuracy, compliance, recommendation quality, speed, cost-effectiveness
 *
 * Features:
 * - Real-time quality scoring (0-100)
 * - ISA standard compliance tracking
 * - Performance benchmarking with trend analysis
 * - Automated alerts for quality degradation
 * - Historical tracking for auditing
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export class AgentQualityAssessmentService {
  constructor() {
    this.agents = {
      'AIProcedureEngine': { weight: 0.15, category: 'engine' },
      'ExceptionPredictionEngine': { weight: 0.15, category: 'engine' },
      'JurisdictionEngine': { weight: 0.10, category: 'engine' },
      'MaterialityEngine': { weight: 0.10, category: 'engine' },
      'ReportGenerationAgent': { weight: 0.15, category: 'agent' },
      'RiskAssessmentAgent': { weight: 0.15, category: 'agent' },
      'ComplianceAgent': { weight: 0.10, category: 'agent' },
      'EvidenceAnalysisAgent': { weight: 0.10, category: 'agent' },
      'WorkflowAssistantAgent': { weight: 0.05, category: 'agent' }
    };

    // Quality thresholds (ISA 220 - Quality Control)
    this.thresholds = {
      accuracy: { warning: 85, critical: 75 },
      compliance: { warning: 90, critical: 80 },
      speed: { warning: 5000, critical: 10000 }, // ms
      cost: { warning: 1.2, critical: 1.5 }, // cost ratio
      quality: { warning: 80, critical: 70 } // composite
    };

    this.executionMetrics = new Map();
    this.assessmentCache = new Map();
  }

  /**
   * RECORD AGENT EXECUTION
   * Called after every agent executes to track performance
   */
  async recordExecution(executionData) {
    const {
      agentName,
      engagementId,
      requestType,
      requestParams,
      responseData,
      duration,
      tokensUsed,
      costUsd,
      success,
      error
    } = executionData;

    try {
      // Calculate accuracy rating based on response quality
      const accuracyRating = await this._evaluateAccuracy(agentName, responseData, requestType);

      // Check compliance with ISA standards
      const complianceViolations = await this._checkISACompliance(agentName, responseData, requestType);

      // Quality of recommendation
      const recommendationQuality = await this._rateRecommendationQuality(responseData, agentName);

      // Persist to database if available
      if (supabase) {
        const { error: dbError } = await supabase
          .from('agent_execution_history')
          .insert({
            engagement_id: engagementId,
            agent_name: agentName,
            execution_id: this._generateExecutionId(agentName),
            request_type: requestType,
            request_params: requestParams,
            response_data: responseData,
            duration_ms: duration,
            tokens_used: tokensUsed,
            cost_usd: costUsd,
            accuracy_rating: accuracyRating,
            compliance_violations: complianceViolations,
            recommendation_quality_rating: recommendationQuality,
            status: success ? 'success' : 'failed',
            error_details: error
          });

        if (dbError) {
          console.warn('❌ Failed to record execution:', dbError);
        }
      }

      // Update in-memory metrics
      this._updateMetrics(agentName, {
        duration,
        tokensUsed,
        costUsd,
        accuracyRating,
        complianceViolations,
        recommendationQuality,
        success
      });

      return {
        success: true,
        accuracyRating,
        complianceViolations,
        recommendationQuality
      };
    } catch (err) {
      console.error('❌ Error recording execution:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * GET AGENT QUALITY SCORE
   * Returns real-time quality assessment (0-100)
   */
  async getAgentQualityScore(agentName, engagementId = null) {
    try {
      const cacheKey = `quality_${agentName}_${engagementId || 'all'}`;

      // Check cache (5-minute TTL)
      if (this.assessmentCache.has(cacheKey)) {
        const cached = this.assessmentCache.get(cacheKey);
        if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
          return cached.data;
        }
      }

      let query = supabase
        .from('agent_execution_history')
        .select('accuracy_rating, duration_ms, tokens_used, cost_usd, recommendation_quality_rating, status')
        .eq('agent_name', agentName);

      if (engagementId) {
        query = query.eq('engagement_id', engagementId);
      }

      const { data, error } = await query.order('created_at', { ascending: false }).limit(100);

      if (error) throw error;

      if (!data || data.length === 0) {
        return { score: 0, status: 'NO_DATA', metrics: {} };
      }

      // Calculate weighted score
      const score = this._calculateCompositeScore(data, agentName);

      // Cache result
      this.assessmentCache.set(cacheKey, {
        data: score,
        timestamp: Date.now()
      });

      return score;
    } catch (err) {
      console.error('❌ Error getting quality score:', err);
      return { score: 0, status: 'ERROR', error: err.message };
    }
  }

  /**
   * GENERATE AGENT QUALITY REPORT
   * Comprehensive assessment for auditing
   */
  async generateQualityReport(agentName, periodDays = 7) {
    try {
      const since = new Date();
      since.setDate(since.getDate() - periodDays);

      const { data, error } = await supabase
        .from('agent_execution_history')
        .select('*')
        .eq('agent_name', agentName)
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          agentName,
          period: `${periodDays} days`,
          status: 'NO_DATA',
          message: 'No executions in period'
        };
      }

      // Calculate metrics
      const totalExecutions = data.length;
      const successfulExecutions = data.filter(d => d.status === 'success').length;
      const failedExecutions = data.filter(d => d.status === 'failed').length;

      const accuracyScores = data.filter(d => d.accuracy_rating).map(d => d.accuracy_rating);
      const avgAccuracy = accuracyScores.length > 0
        ? (accuracyScores.reduce((a, b) => a + b, 0) / accuracyScores.length * 20)
        : 0;

      const durations = data.map(d => d.duration_ms);
      const avgLatency = durations.reduce((a, b) => a + b, 0) / durations.length;

      const costs = data.map(d => d.cost_usd || 0);
      const totalCost = costs.reduce((a, b) => a + b, 0);

      const qualityRatings = data.filter(d => d.recommendation_quality_rating).map(d => d.recommendation_quality_rating);
      const avgQuality = qualityRatings.length > 0
        ? (qualityRatings.reduce((a, b) => a + b, 0) / qualityRatings.length * 20)
        : 0;

      // Compliance violations
      const totalViolations = data.filter(d => d.compliance_violations).length;
      const complianceScore = totalViolations === 0 ? 100 : Math.max(0, 100 - (totalViolations * 5));

      // Cost efficiency (should be < 1.0 for efficient)
      const costEfficiency = totalCost / (totalExecutions || 1);

      // Composite score
      const compositeScore = (
        (avgAccuracy * 0.4) +
        (complianceScore * 0.35) +
        (Math.max(0, 100 - (avgLatency / 100)) * 0.15) +
        (Math.max(0, 100 - (costEfficiency * 50)) * 0.1)
      );

      return {
        agentName,
        period: `${periodDays} days`,
        reportDate: new Date().toISOString(),
        statistics: {
          totalExecutions,
          successfulExecutions,
          failedExecutions,
          successRate: ((successfulExecutions / totalExecutions) * 100).toFixed(2),
          complianceViolations: totalViolations
        },
        scores: {
          accuracy: avgAccuracy.toFixed(2),
          compliance: complianceScore.toFixed(2),
          speed: Math.max(0, 100 - (avgLatency / 100)).toFixed(2),
          costEfficiency: costEfficiency.toFixed(4),
          recommendationQuality: avgQuality.toFixed(2),
          composite: compositeScore.toFixed(2)
        },
        performance: {
          avgLatencyMs: Math.round(avgLatency),
          totalCostUsd: totalCost.toFixed(4),
          tokensUsed: data.reduce((sum, d) => sum + (d.tokens_used || 0), 0)
        },
        alerts: this._generateAlerts(compositeScore, avgAccuracy, complianceScore, costEfficiency)
      };
    } catch (err) {
      console.error('❌ Error generating quality report:', err);
      return {
        agentName,
        status: 'ERROR',
        error: err.message
      };
    }
  }

  /**
   * CHECK ISA STANDARD COMPLIANCE
   * Verify responses meet ISA 200-599 requirements
   */
  async _checkISACompliance(agentName, responseData, requestType) {
    const violations = [];

    // ISA 220 - Quality Control
    if (!responseData) {
      violations.push({
        standard: 'ISA 220',
        issue: 'No response data provided',
        severity: 'CRITICAL'
      });
      return violations;
    }

    // ISA 300 - Planning
    if (requestType === 'PLAN_AUDIT' && !responseData.auditPlan) {
      violations.push({
        standard: 'ISA 300',
        issue: 'Audit plan missing from response',
        severity: 'HIGH'
      });
    }

    // ISA 315 - Risk Assessment
    if (requestType === 'ASSESS_RISK' && !responseData.riskAssessment) {
      violations.push({
        standard: 'ISA 315',
        issue: 'Risk assessment missing from response',
        severity: 'HIGH'
      });
    }

    // ISA 500 - Evidence
    if (requestType === 'ANALYZE_EVIDENCE' && !responseData.evidenceQuality) {
      violations.push({
        standard: 'ISA 500',
        issue: 'Evidence quality assessment missing',
        severity: 'HIGH'
      });
    }

    // ISA 700 - Reporting
    if (requestType === 'GENERATE_REPORT' && !responseData.reportCompliance) {
      violations.push({
        standard: 'ISA 700',
        issue: 'Report compliance check missing',
        severity: 'HIGH'
      });
    }

    return violations.length > 0 ? JSON.stringify(violations) : null;
  }

  /**
   * EVALUATE ACCURACY
   * Rate accuracy on scale of 1-5
   */
  async _evaluateAccuracy(agentName, responseData, requestType) {
    // Simple heuristic: 5 = excellent, 1 = poor
    // In production, this would compare against human review

    if (!responseData) return 1;

    let score = 3; // default: average

    // Check for required fields
    const responseKeys = Object.keys(responseData).length;
    if (responseKeys > 5) score += 1; // More detail = higher confidence

    // Check for confidence scores in response
    if (responseData.confidence > 0.9) score += 1;
    else if (responseData.confidence < 0.5) score -= 1;

    // Check for error indicators
    if (responseData.errors || responseData.warnings) score -= 1;

    return Math.max(1, Math.min(5, score));
  }

  /**
   * RATE RECOMMENDATION QUALITY
   * Score quality of recommendations (1-5 scale)
   */
  async _rateRecommendationQuality(responseData, agentName) {
    if (!responseData || !responseData.recommendations) return 1;

    let score = 3; // default

    const recs = Array.isArray(responseData.recommendations)
      ? responseData.recommendations
      : [responseData.recommendations];

    // 3+ actionable recommendations = higher quality
    if (recs.length >= 3) score += 1;

    // All recs have impact estimates = higher quality
    if (recs.every(r => r.estimatedImpact)) score += 1;

    // No recs = low quality
    if (recs.length === 0) score = 1;

    return Math.max(1, Math.min(5, score));
  }

  /**
   * CALCULATE COMPOSITE SCORE
   * Weighted calculation: accuracy (40%), compliance (35%), speed (15%), cost (10%)
   */
  _calculateCompositeScore(executions, agentName) {
    if (!executions || executions.length === 0) {
      return { score: 0, status: 'NO_DATA' };
    }

    // Accuracy: 1-5 scale → convert to 0-100
    const avgAccuracy = (executions
      .filter(e => e.accuracy_rating)
      .reduce((sum, e) => sum + e.accuracy_rating, 0) / executions.length) * 20;

    // Compliance: count violations, convert to 0-100
    const violations = executions.filter(e => e.compliance_violations).length;
    const compliance = Math.max(0, 100 - (violations * 2));

    // Speed: average latency, convert to 0-100 (lower is better)
    const avgLatency = executions.reduce((sum, e) => sum + e.duration_ms, 0) / executions.length;
    const speedScore = Math.max(0, 100 - (avgLatency / 100));

    // Cost: average cost per execution
    const avgCost = executions.reduce((sum, e) => sum + (e.cost_usd || 0), 0) / executions.length;
    const costScore = Math.max(0, 100 - (avgCost * 100));

    // Recommendation quality: 1-5 scale → 0-100
    const avgQuality = (executions
      .filter(e => e.recommendation_quality_rating)
      .reduce((sum, e) => sum + e.recommendation_quality_rating, 0) / executions.length) * 20;

    // Composite: weighted sum
    const composite = (
      (avgAccuracy * 0.40) +
      (compliance * 0.35) +
      (speedScore * 0.15) +
      (costScore * 0.10)
    );

    // Determine alert status
    let status = 'GOOD';
    if (composite < this.thresholds.quality.critical) {
      status = 'CRITICAL';
    } else if (composite < this.thresholds.quality.warning) {
      status = 'WARNING';
    }

    return {
      score: Math.round(composite),
      status,
      breakdown: {
        accuracy: Math.round(avgAccuracy),
        compliance: Math.round(compliance),
        speed: Math.round(speedScore),
        costEfficiency: Math.round(costScore),
        recommendationQuality: Math.round(avgQuality)
      },
      metrics: {
        executionCount: executions.length,
        avgLatencyMs: Math.round(avgLatency),
        avgCostUsd: avgCost.toFixed(4),
        violations: violations
      }
    };
  }

  /**
   * GENERATE ALERTS
   * Alert when quality metrics fall below thresholds
   */
  _generateAlerts(composite, accuracy, compliance, cost) {
    const alerts = [];

    if (composite < this.thresholds.quality.critical) {
      alerts.push({
        level: 'CRITICAL',
        message: `Overall quality score (${composite.toFixed(0)}) below critical threshold`,
        action: 'REVIEW_IMMEDIATELY'
      });
    }

    if (accuracy < this.thresholds.accuracy.warning) {
      alerts.push({
        level: 'WARNING',
        message: `Accuracy score (${accuracy.toFixed(0)}) below target`,
        action: 'IMPROVE_PROCEDURES'
      });
    }

    if (compliance < this.thresholds.compliance.warning) {
      alerts.push({
        level: 'WARNING',
        message: `Compliance adherence (${compliance.toFixed(0)}) below target`,
        action: 'REVIEW_ISA_COMPLIANCE'
      });
    }

    if (cost > this.thresholds.cost.warning) {
      alerts.push({
        level: 'INFO',
        message: `Cost ratio (${cost.toFixed(2)}) elevated`,
        action: 'OPTIMIZE_EXECUTION'
      });
    }

    return alerts;
  }

  /**
   * UPDATE METRICS
   * In-memory metric updates for fast querying
   */
  _updateMetrics(agentName, metrics) {
    if (!this.executionMetrics.has(agentName)) {
      this.executionMetrics.set(agentName, []);
    }

    const agentMetrics = this.executionMetrics.get(agentName);
    agentMetrics.push({
      ...metrics,
      timestamp: Date.now()
    });

    // Keep last 1000 executions per agent
    if (agentMetrics.length > 1000) {
      agentMetrics.shift();
    }
  }

  /**
   * GENERATE EXECUTION ID
   * Unique identifier for tracking
   */
  _generateExecutionId(agentName) {
    return `exec_${agentName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const agentQualityAssessmentService = new AgentQualityAssessmentService();
