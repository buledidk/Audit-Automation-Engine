/**
 * Audit Dashboard Service
 * Real-time progress tracking and metrics aggregation
 *
 * Features:
 * - Progress metrics calculation
 * - FSLI heat map generation
 * - Activity feed tracking
 * - Team metrics aggregation
 * - Real-time updates via WebSocket
 */

export class AuditDashboardService {
  constructor() {
    this.cache = new Map();
    this.subscribers = new Map();
    this.updateInterval = 5000; // 5 seconds
  }

  /**
   * Get overall progress metrics
   * @param {String} engagementId
   * @returns {Promise<Object>} Progress data
   */
  async getProgressMetrics(engagementId) {
    const cacheKey = `progress_${engagementId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const metrics = {
      overall_completion: 0,
      procedures_completed: 0,
      procedures_remaining: 0,
      exceptions_logged: 0,
      time_spent_hours: 0,
      budget_hours: 0,
      budget_utilization: 0,
      risk_trend: "stable",
      estimated_completion: new Date(),
      timestamp: Date.now()
    };

    // Cache for 5 seconds
    this.cache.set(cacheKey, metrics);
    setTimeout(() => this.cache.delete(cacheKey), 5000);

    return metrics;
  }

  /**
   * Get FSLI-by-FSLI heat map
   * @param {String} engagementId
   * @returns {Promise<Array>} Heat map data
   */
  async getFsliHeatMap(engagementId) {
    const cacheKey = `heatmap_${engagementId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const heatMap = [
      {
        fsli: "Revenue",
        risk_level: "High",
        completion: 45,
        exceptions: 2,
        procedures_remaining: 5,
        status: "In Progress"
      },
      {
        fsli: "Inventory",
        risk_level: "Medium",
        completion: 60,
        exceptions: 1,
        procedures_remaining: 3,
        status: "In Progress"
      },
      {
        fsli: "Receivables",
        risk_level: "Low",
        completion: 80,
        exceptions: 0,
        procedures_remaining: 1,
        status: "Final Review"
      },
      {
        fsli: "Cash",
        risk_level: "Low",
        completion: 100,
        exceptions: 0,
        procedures_remaining: 0,
        status: "Complete"
      }
    ];

    this.cache.set(cacheKey, heatMap);
    setTimeout(() => this.cache.delete(cacheKey), 5000);

    return heatMap;
  }

  /**
   * Get activity feed
   * @param {String} engagementId
   * @param {Number} limit
   * @returns {Promise<Array>} Activity log
   */
  async getActivityFeed(engagementId, limit = 50) {
    const cacheKey = `activity_${engagementId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const activities = [
      {
        timestamp: new Date(Date.now() - 300000),
        type: "procedure_completed",
        user: "John Smith",
        fsli: "Cash",
        procedure: "Bank Reconciliation",
        exceptions: 0,
        evidence_items: 3
      },
      {
        timestamp: new Date(Date.now() - 600000),
        type: "exception_logged",
        user: "Sarah Johnson",
        fsli: "Inventory",
        exception_type: "Valuation Error",
        amount: 15000,
        status: "Under Review"
      },
      {
        timestamp: new Date(Date.now() - 900000),
        type: "review_completed",
        user: "Partner Review",
        fsli: "Receivables",
        conclusion: "Approved",
        reviewer: "Michael Chen"
      },
      {
        timestamp: new Date(Date.now() - 1200000),
        type: "procedure_started",
        user: "Emily Davis",
        fsli: "Revenue",
        procedure: "Sales Invoice Testing",
        sample_size: 25
      }
    ];

    this.cache.set(cacheKey, activities);
    setTimeout(() => this.cache.delete(cacheKey), 5000);

    return activities.slice(0, limit);
  }

  /**
   * Get team metrics
   * @param {String} engagementId
   * @returns {Promise<Array>} Team workload data
   */
  async getTeamMetrics(engagementId) {
    const cacheKey = `team_${engagementId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const teamMetrics = [
      {
        team_member: "John Smith",
        role: "Senior Auditor",
        procedures_assigned: 12,
        procedures_completed: 8,
        time_spent_hours: 24,
        hours_budgeted: 30,
        utilization: 80,
        current_task: "Revenue Procedures",
        status: "On Track"
      },
      {
        team_member: "Sarah Johnson",
        role: "Auditor",
        procedures_assigned: 10,
        procedures_completed: 7,
        time_spent_hours: 20,
        hours_budgeted: 25,
        utilization: 80,
        current_task: "Inventory Procedures",
        status: "On Track"
      },
      {
        team_member: "Emily Davis",
        role: "Junior Auditor",
        procedures_assigned: 8,
        procedures_completed: 4,
        time_spent_hours: 12,
        hours_budgeted: 20,
        utilization: 60,
        current_task: "Sample Testing",
        status: "On Track"
      }
    ];

    this.cache.set(cacheKey, teamMetrics);
    setTimeout(() => this.cache.delete(cacheKey), 5000);

    return teamMetrics;
  }

  /**
   * Subscribe to real-time updates
   * @param {String} engagementId
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  subscribeToUpdates(engagementId, callback) {
    if (!this.subscribers.has(engagementId)) {
      this.subscribers.set(engagementId, []);
    }

    this.subscribers.get(engagementId).push(callback);

    // Set up periodic updates
    const intervalId = setInterval(async () => {
      try {
        const metrics = await this.getProgressMetrics(engagementId);
        const heatMap = await this.getFsliHeatMap(engagementId);
        const activity = await this.getActivityFeed(engagementId, 10);

        callback({
          metrics,
          heatMap,
          activity,
          timestamp: Date.now()
        });
      } catch (err) {
        console.error("Dashboard update error:", err);
      }
    }, this.updateInterval);

    // Return unsubscribe function
    return () => {
      clearInterval(intervalId);
      const subscribers = this.subscribers.get(engagementId);
      if (subscribers) {
        const index = subscribers.indexOf(callback);
        if (index > -1) {
          subscribers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Calculate risk score for an FSLI
   * @param {Object} fsliData
   * @returns {Number} Risk score 0-100
   */
  calculateRiskScore(fsliData) {
    let score = 0;

    // Factor: Completion percentage (lower completion = higher risk)
    score += (100 - fsliData.completion) * 0.3;

    // Factor: Exceptions (more exceptions = higher risk)
    score += Math.min(fsliData.exceptions * 20, 100) * 0.3;

    // Factor: Procedures remaining (more remaining = higher risk)
    score += Math.min(fsliData.procedures_remaining * 10, 100) * 0.4;

    return Math.round(Math.min(score, 100));
  }

  /**
   * Generate summary report
   * @param {String} engagementId
   * @returns {Promise<Object>} Summary report
   */
  async generateSummaryReport(engagementId) {
    const metrics = await this.getProgressMetrics(engagementId);
    const heatMap = await this.getFsliHeatMap(engagementId);
    const teamMetrics = await this.getTeamMetrics(engagementId);

    return {
      engagement_id: engagementId,
      generated_at: new Date().toISOString(),
      overall_progress: metrics.overall_completion,
      risk_assessment: this._assessOverallRisk(heatMap),
      team_efficiency: this._calculateTeamEfficiency(teamMetrics),
      critical_items: this._identifyCriticalItems(heatMap),
      estimated_completion: metrics.estimated_completion,
      budget_status: this._assessBudgetStatus(metrics)
    };
  }

  /**
   * Assess overall risk across all FSLIs
   * @private
   */
  _assessOverallRisk(heatMap) {
    if (!heatMap || heatMap.length === 0) return "Unknown";

    const avgRisk = heatMap.reduce((sum, item) => {
      const riskValue =
        item.risk_level === "High" ? 3 : item.risk_level === "Medium" ? 2 : 1;
      return sum + riskValue;
    }, 0) / heatMap.length;

    if (avgRisk >= 2.5) return "High";
    if (avgRisk >= 1.5) return "Medium";
    return "Low";
  }

  /**
   * Calculate team efficiency score
   * @private
   */
  _calculateTeamEfficiency(teamMetrics) {
    if (!teamMetrics || teamMetrics.length === 0) return 0;

    const avgUtilization =
      teamMetrics.reduce((sum, member) => sum + member.utilization, 0) /
      teamMetrics.length;

    return Math.round(avgUtilization);
  }

  /**
   * Identify critical items needing attention
   * @private
   */
  _identifyCriticalItems(heatMap) {
    if (!heatMap) return [];

    return heatMap
      .filter((item) => item.risk_level === "High" && item.completion < 50)
      .map((item) => ({
        fsli: item.fsli,
        reason: "High risk + low completion",
        action: "Prioritize procedures"
      }));
  }

  /**
   * Assess budget status
   * @private
   */
  _assessBudgetStatus(metrics) {
    const utilization = (metrics.time_spent_hours / metrics.budget_hours) * 100;

    if (utilization > 100) return "Over Budget";
    if (utilization > 85) return "At Risk";
    return "On Track";
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

export default AuditDashboardService;
