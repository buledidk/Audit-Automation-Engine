/**
 * REAL-TIME MONITORING MODULE
 * Pure computation — no AI calls.
 * Maintains in-memory accuracy state per engagement, records events,
 * computes scores, and generates discrepancy alerts.
 */

export class RealTimeMonitoringModule {
  constructor() {
    this.monitors = new Map(); // engagementId -> monitor state
    this.checksPerformed = 0;
  }

  /**
   * Initialize a monitor for an engagement.
   * @param {string} engagementId
   * @param {Object} [config] - { thresholds?: Object, alertSeverities?: string[] }
   * @returns {{monitorId: string, status: string}}
   */
  initializeMonitor(engagementId, config = {}) {
    this.checksPerformed++;

    const monitorId = `mon_${engagementId}_${Date.now()}`;
    this.monitors.set(engagementId, {
      monitorId,
      engagementId,
      status: 'active',
      createdAt: new Date().toISOString(),
      config: {
        scoreThreshold: config.thresholds?.score ?? 70,
        alertSeverities: config.alertSeverities || ['HIGH', 'MEDIUM', 'LOW'],
        ...config,
      },
      events: [],
      alerts: [],
      scores: {
        mathematical: null,
        dataQuality: null,
        crossAccount: null,
        estimates: null,
        reconciliation: null,
        sampling: null,
      },
      checksCompleted: 0,
    });

    return { monitorId, status: 'active', engagementId };
  }

  /**
   * Record an accuracy event for a monitored engagement.
   * @param {string} engagementId
   * @param {{type: string, module: string, score?: number, result?: Object, severity?: string, message?: string}} event
   */
  recordAccuracyEvent(engagementId, event) {
    this.checksPerformed++;
    const monitor = this.monitors.get(engagementId);
    if (!monitor) return;

    const timestamped = {
      ...event,
      timestamp: new Date().toISOString(),
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    };

    monitor.events.push(timestamped);
    monitor.checksCompleted++;

    // Update module score if provided
    if (event.module && event.score !== undefined && monitor.scores[event.module] !== undefined) {
      monitor.scores[event.module] = event.score;
    }

    // Generate alert if score is below threshold or severity is HIGH
    if (event.severity === 'HIGH' || (event.score !== undefined && event.score < monitor.config.scoreThreshold)) {
      monitor.alerts.push({
        alertId: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        type: 'accuracy_threshold',
        module: event.module,
        severity: event.severity || (event.score < 50 ? 'HIGH' : 'MEDIUM'),
        message: event.message || `Accuracy score ${event.score} below threshold ${monitor.config.scoreThreshold}`,
        score: event.score,
        timestamp: new Date().toISOString(),
        acknowledged: false,
      });
    }
  }

  /**
   * Get the accuracy score for an engagement.
   * @param {string} engagementId
   * @returns {{overall: number, dimensions: Object, trend: string}}
   */
  getAccuracyScore(engagementId) {
    this.checksPerformed++;
    const monitor = this.monitors.get(engagementId);
    if (!monitor) {
      return { overall: 0, dimensions: {}, trend: 'unknown' };
    }

    const dimensions = { ...monitor.scores };
    const activeScores = Object.values(dimensions).filter(s => s !== null);
    const overall = activeScores.length > 0
      ? Math.round(activeScores.reduce((a, b) => a + b, 0) / activeScores.length * 100) / 100
      : 0;

    // Determine trend from recent events
    const recentEvents = monitor.events.slice(-10);
    const recentScores = recentEvents.filter(e => e.score !== undefined).map(e => e.score);
    let trend = 'stable';
    if (recentScores.length >= 3) {
      const first = recentScores.slice(0, Math.floor(recentScores.length / 2));
      const second = recentScores.slice(Math.floor(recentScores.length / 2));
      const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
      const avgSecond = second.reduce((a, b) => a + b, 0) / second.length;
      if (avgSecond > avgFirst + 2) trend = 'improving';
      else if (avgSecond < avgFirst - 2) trend = 'declining';
    }

    return { overall, dimensions, trend, timestamp: new Date().toISOString() };
  }

  /**
   * Get discrepancy alerts for an engagement.
   * @param {string} engagementId
   * @param {string} [severity] - Filter by severity: 'HIGH', 'MEDIUM', 'LOW'
   * @returns {{alerts: Array}}
   */
  getDiscrepancyAlerts(engagementId, severity) {
    this.checksPerformed++;
    const monitor = this.monitors.get(engagementId);
    if (!monitor) return { alerts: [] };

    let alerts = monitor.alerts;
    if (severity) {
      alerts = alerts.filter(a => a.severity === severity);
    }

    return {
      alerts,
      totalAlerts: monitor.alerts.length,
      unacknowledged: monitor.alerts.filter(a => !a.acknowledged).length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get full monitoring dashboard for an engagement.
   * @param {string} engagementId
   * @returns {{score: Object, alerts: Object, trends: Object, checksCompleted: number}}
   */
  getMonitoringDashboard(engagementId) {
    this.checksPerformed++;
    const monitor = this.monitors.get(engagementId);
    if (!monitor) {
      return {
        score: { overall: 0, dimensions: {} },
        alerts: { alerts: [], totalAlerts: 0 },
        trends: {},
        checksCompleted: 0,
        status: 'not_initialized',
      };
    }

    const score = this.getAccuracyScore(engagementId);
    const alerts = this.getDiscrepancyAlerts(engagementId);

    // Module-level trends
    const trends = {};
    for (const module of Object.keys(monitor.scores)) {
      const moduleEvents = monitor.events.filter(e => e.module === module && e.score !== undefined);
      if (moduleEvents.length >= 2) {
        const latest = moduleEvents[moduleEvents.length - 1].score;
        const previous = moduleEvents[moduleEvents.length - 2].score;
        trends[module] = {
          current: latest,
          previous,
          change: Math.round((latest - previous) * 100) / 100,
          direction: latest > previous ? 'up' : latest < previous ? 'down' : 'stable',
        };
      }
    }

    return {
      score,
      alerts,
      trends,
      checksCompleted: monitor.checksCompleted,
      eventsRecorded: monitor.events.length,
      status: monitor.status,
      monitorId: monitor.monitorId,
      timestamp: new Date().toISOString(),
    };
  }

  getMetrics() {
    return {
      module: 'RealTimeMonitoring',
      status: 'READY',
      activeMonitors: this.monitors.size,
      checksPerformed: this.checksPerformed,
      aiRequired: false,
    };
  }
}

export default new RealTimeMonitoringModule();
