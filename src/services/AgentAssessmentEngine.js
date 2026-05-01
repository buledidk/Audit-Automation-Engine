/**
 * AgentAssessmentEngine - Comprehensive Agent Assessment & Scoring
 * Phase 8.5: Head Agent & Comprehensive Agent Assessment System
 *
 * Calculates comprehensive performance scores for all agents using
 * multiple metrics: success rate, latency, reliability, efficiency,
 * specialization, trustworthiness, and consistency.
 *
 * Features:
 * - Multi-dimensional scoring system
 * - Weighted metric calculation
 * - Percentile ranking
 * - Trend analysis
 * - Anomaly detection
 * - Recommendations generation
 */

const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class AgentAssessmentEngine extends EventEmitter {
  constructor(db) {
    super();
    this.db = db;
    this.assessments = new Map(); // agentId -> latest assessment
    this.historicalData = new Map(); // agentId -> array of assessments
    this.maxHistoricalSize = 1000; // Keep last 1000 assessments per agent

    // Weight configuration for overall score calculation
    this.scoreWeights = {
      successRate: 0.25,        // 25%
      reliability: 0.20,        // 20%
      efficiency: 0.15,         // 15%
      specialization: 0.15,     // 15%
      trustworthiness: 0.15,    // 15%
      consistency: 0.10         // 10%
    };

    // Thresholds for different score ranges
    this.scoreRanges = {
      excellent: { min: 90, max: 100 },
      good: { min: 80, max: 89 },
      acceptable: { min: 70, max: 79 },
      poor: { min: 50, max: 69 },
      critical: { min: 0, max: 49 }
    };
  }

  /**
   * Initialize assessment engine
   */
  initialize() {
    logger.info('Initializing AgentAssessmentEngine');

    logger.info('AgentAssessmentEngine initialized');
  }

  /**
   * Assess specific agent
   */
  async assessAgent(agentId, metrics) {
    logger.debug('Assessing agent', { agentId });

    const assessment = {
      id: uuidv4(),
      agentId,
      timestamp: new Date(),
      metrics: metrics || {},
      scores: {},
      overallScore: 0,
      scoreRange: '',
      trend: 'stable',
      recommendation: '',
      bottlenecks: []
    };

    // Calculate individual scores
    assessment.scores.successRate = this.calculateSuccessRate(metrics);
    assessment.scores.reliability = this.calculateReliability(metrics);
    assessment.scores.efficiency = this.calculateEfficiency(metrics);
    assessment.scores.specialization = this.calculateSpecialization(agentId, metrics);
    assessment.scores.trustworthiness = this.calculateTrustworthiness(metrics);
    assessment.scores.consistency = this.calculateConsistency(agentId, metrics);

    // Calculate weighted overall score
    assessment.overallScore = this.calculateOverallScore(assessment.scores);

    // Determine score range
    assessment.scoreRange = this.getScoreRange(assessment.overallScore);

    // Calculate trend
    assessment.trend = this.calculateTrend(agentId, assessment);

    // Generate recommendation
    assessment.recommendation = this.generateRecommendation(agentId, assessment);

    // Identify bottlenecks
    assessment.bottlenecks = this.identifyBottlenecks(assessment.scores);

    // Store assessment
    this.assessments.set(agentId, assessment);
    this.addToHistoricalData(agentId, assessment);

    // Save to database
    await this.saveAssessmentToDB(assessment);

    return assessment;
  }

  /**
   * Calculate success rate score
   */
  calculateSuccessRate(metrics) {
    if (!metrics || !metrics.tasksCompleted) {
      return 0;
    }

    const { tasksCompleted, tasksFailed } = metrics;
    const totalTasks = tasksCompleted + (tasksFailed || 0);

    if (totalTasks === 0) {
      return 100;
    }

    const successRate = (tasksCompleted / totalTasks) * 100;

    // Score calculation: map success rate (0-100%) to score (0-100)
    return Math.min(100, successRate);
  }

  /**
   * Calculate reliability score
   */
  calculateReliability(metrics) {
    if (!metrics) {
      return 0;
    }

    const {
      uptime = 0,
      consecutiveFailures = 0,
      lastFailureAt = null, // eslint-disable-line no-unused-vars
      recoverySuccessRate = 100
    } = metrics;

    let score = 0;

    // 40% based on uptime
    score += (uptime / 100) * 40;

    // 30% based on recovery success
    score += (recoverySuccessRate / 100) * 30;

    // 30% based on consecutive failures (lower is better)
    const failureFactor = Math.max(0, 100 - (consecutiveFailures * 10));
    score += (failureFactor / 100) * 30;

    return Math.min(100, score);
  }

  /**
   * Calculate efficiency score
   */
  calculateEfficiency(metrics) {
    if (!metrics || !metrics.latencyMs) {
      return 50;
    }

    const {
      latencyMs,
      tasksCompletedPerHour = 0,
      resourceUsage = { cpu: 50, memory: 50 }
    } = metrics;

    let score = 0;

    // 40% based on response time (lower latency = higher score)
    // Expect latency between 50ms (100 score) and 5000ms (0 score)
    const latencyScore = Math.max(0, 100 - (latencyMs / 50));
    score += Math.min(100, latencyScore) * 0.4;

    // 35% based on throughput (tasks per hour)
    // Expect 0-500 tasks/hour
    const throughputScore = Math.min(100, (tasksCompletedPerHour / 500) * 100);
    score += throughputScore * 0.35;

    // 25% based on resource efficiency
    const avgResourceUsage = (resourceUsage.cpu + resourceUsage.memory) / 2;
    const resourceScore = Math.max(0, 100 - avgResourceUsage);
    score += resourceScore * 0.25;

    return Math.min(100, score);
  }

  /**
   * Calculate specialization score
   */
  calculateSpecialization(agentId, metrics) {
    if (!metrics || !metrics.specialtyTasks) {
      return 50;
    }

    const {
      specialtyTasks = 0,
      specialtyTasksCompleted = 0,
      specialtyTasksFailed = 0 // eslint-disable-line no-unused-vars
    } = metrics;

    if (specialtyTasks === 0) {
      return 50;
    }

    const specialtySuccessRate = (specialtyTasksCompleted / specialtyTasks) * 100;

    // Specialization score is based on performance in specialty domain
    return Math.min(100, specialtySuccessRate);
  }

  /**
   * Calculate trustworthiness score
   */
  calculateTrustworthiness(metrics) {
    if (!metrics) {
      return 50;
    }

    const {
      errorRate = 0,
      incidentCount = 0,
      successRate = 100, // eslint-disable-line no-unused-vars
      consistencyScore = 100
    } = metrics;

    let score = 0;

    // 40% based on low error rate
    const errorScore = Math.max(0, 100 - errorRate);
    score += errorScore * 0.4;

    // 30% based on incident history
    // Expect 0-10 incidents for full score
    const incidentScore = Math.max(0, 100 - (incidentCount * 10));
    score += incidentScore * 0.3;

    // 30% based on consistency
    score += (consistencyScore / 100) * 0.3;

    return Math.min(100, score);
  }

  /**
   * Calculate consistency score
   */
  calculateConsistency(agentId, _metrics) {
    const history = this.historicalData.get(agentId) || [];

    if (history.length < 2) {
      return 100; // Perfect score if insufficient data
    }

    // Calculate variance in performance metrics
    const recentAssessments = history.slice(-10); // Last 10 assessments

    const scores = recentAssessments.map(a => {
      if (a.scores && a.scores.successRate) {
        return a.scores.successRate;
      }
      return 0;
    });

    if (scores.length === 0) {
      return 50;
    }

    // Calculate standard deviation
    const mean = scores.reduce((a, b) => a + b) / scores.length;
    const variance = scores.reduce((sum, score) => {
      return sum + Math.pow(score - mean, 2);
    }, 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation = higher consistency score
    // Max std dev of 20 = score of 0, std dev of 0 = score of 100
    const consistencyScore = Math.max(0, 100 - (stdDev * 5));

    return Math.min(100, consistencyScore);
  }

  /**
   * Calculate overall score from individual scores
   */
  calculateOverallScore(scores) {
    let weightedScore = 0;

    for (const [metric, weight] of Object.entries(this.scoreWeights)) {
      if (scores[metric] !== undefined) {
        weightedScore += scores[metric] * weight;
      }
    }

    return Math.round(weightedScore);
  }

  /**
   * Get score range category
   */
  getScoreRange(score) {
    for (const [range, { min, max }] of Object.entries(this.scoreRanges)) {
      if (score >= min && score <= max) {
        return range;
      }
    }

    return 'critical';
  }

  /**
   * Calculate trend (improving, stable, degrading)
   */
  calculateTrend(agentId, currentAssessment) {
    const history = this.historicalData.get(agentId) || [];

    if (history.length < 2) {
      return 'stable';
    }

    // Compare current score with average of last 5
    const recentAssessments = history.slice(-5);
    const previousScores = recentAssessments.map(a => a.overallScore);
    const previousAverage = previousScores.reduce((a, b) => a + b) / previousScores.length;

    const scoreDifference = currentAssessment.overallScore - previousAverage;

    if (scoreDifference > 2) {
      return 'improving';
    } else if (scoreDifference < -2) {
      return 'degrading';
    } else {
      return 'stable';
    }
  }

  /**
   * Generate recommendation
   */
  generateRecommendation(agentId, assessment) {
    const { _scores, scoreRange, bottlenecks } = assessment;

    if (scoreRange === 'excellent') {
      return 'Agent performing optimally. No action needed.';
    }

    if (scoreRange === 'good') {
      if (bottlenecks.length > 0) {
        return `Consider addressing: ${bottlenecks.join(', ')}`;
      }
      return 'Agent performing well. Monitor for improvements.';
    }

    if (scoreRange === 'acceptable') {
      return `Address low ${bottlenecks[0] || 'performance'}. Consider specialization or load balancing.`;
    }

    if (scoreRange === 'poor' || scoreRange === 'critical') {
      return `CRITICAL: Agent requires immediate attention. Bottlenecks: ${bottlenecks.join(', ')}. Recommend recovery or reassignment.`;
    }

    return 'Assessment incomplete.';
  }

  /**
   * Identify bottlenecks
   */
  identifyBottlenecks(scores) {
    const bottlenecks = [];
    const threshold = 70; // Scores below 70 are considered bottlenecks

    for (const [metric, score] of Object.entries(scores)) {
      if (score < threshold) {
        bottlenecks.push(metric);
      }
    }

    return bottlenecks.sort((a, b) => scores[a] - scores[b]); // Lowest first
  }

  /**
   * Add assessment to historical data
   */
  addToHistoricalData(agentId, assessment) {
    if (!this.historicalData.has(agentId)) {
      this.historicalData.set(agentId, []);
    }

    const history = this.historicalData.get(agentId);
    history.push(assessment);

    // Keep only recent assessments
    if (history.length > this.maxHistoricalSize) {
      history.shift();
    }
  }

  /**
   * Compare agents
   */
  compareAgents(agentId1, agentId2) {
    const assessment1 = this.assessments.get(agentId1);
    const assessment2 = this.assessments.get(agentId2);

    if (!assessment1 || !assessment2) {
      return null;
    }

    return {
      agent1: {
        id: agentId1,
        overallScore: assessment1.overallScore,
        scoreRange: assessment1.scoreRange
      },
      agent2: {
        id: agentId2,
        overallScore: assessment2.overallScore,
        scoreRange: assessment2.scoreRange
      },
      difference: assessment1.overallScore - assessment2.overallScore,
      winner: assessment1.overallScore > assessment2.overallScore ? agentId1 : agentId2,
      detailedComparison: {
        successRate: {
          agent1: assessment1.scores.successRate,
          agent2: assessment2.scores.successRate
        },
        reliability: {
          agent1: assessment1.scores.reliability,
          agent2: assessment2.scores.reliability
        },
        efficiency: {
          agent1: assessment1.scores.efficiency,
          agent2: assessment2.scores.efficiency
        },
        specialization: {
          agent1: assessment1.scores.specialization,
          agent2: assessment2.scores.specialization
        },
        trustworthiness: {
          agent1: assessment1.scores.trustworthiness,
          agent2: assessment2.scores.trustworthiness
        },
        consistency: {
          agent1: assessment1.scores.consistency,
          agent2: assessment2.scores.consistency
        }
      }
    };
  }

  /**
   * Get assessment
   */
  getAssessment(agentId) {
    return this.assessments.get(agentId) || null;
  }

  /**
   * Get all assessments
   */
  getAllAssessments() {
    return Array.from(this.assessments.values());
  }

  /**
   * Get agent rankings
   */
  getRankings() {
    const assessments = Array.from(this.assessments.values());

    const ranked = assessments
      .sort((a, b) => b.overallScore - a.overallScore)
      .map((assessment, index) => ({
        rank: index + 1,
        agentId: assessment.agentId,
        overallScore: assessment.overallScore,
        scoreRange: assessment.scoreRange,
        trend: assessment.trend,
        recommendation: assessment.recommendation
      }));

    return ranked;
  }

  /**
   * Save assessment to database
   */
  async saveAssessmentToDB(assessment) {
    try {
      const query = `
        INSERT INTO agent_rankings
        (agent_id, success_rate, reliability_score, efficiency_score,
         specialization_score, trustworthiness_score, overall_score)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      await this.db.query(query, [
        assessment.agentId,
        assessment.scores.successRate,
        assessment.scores.reliability,
        assessment.scores.efficiency,
        assessment.scores.specialization,
        assessment.scores.trustworthiness,
        assessment.overallScore
      ]);
    } catch (error) {
      logger.error('Failed to save assessment to database', { error });
    }
  }

  /**
   * Shutdown assessment engine
   */
  shutdown() {
    logger.info('Shutting down AgentAssessmentEngine');

    this.assessments.clear();
    this.historicalData.clear();
  }
}

module.exports = AgentAssessmentEngine;
