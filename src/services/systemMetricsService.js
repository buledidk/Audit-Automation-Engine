/**
 * System Metrics Service
 * Tracks system performance metrics: CPU, memory, latency, token usage,
 * cache hit rates, database performance, and overall health indicators
 */

import EventEmitter from 'events';
import os from 'os';

class SystemMetricsService extends EventEmitter {
  constructor() {
    super();
    this.metrics = {
      cpu: [],
      memory: [],
      latency: [],
      tokenUsage: [],
      cacheHitRate: [],
      databaseQueryTime: [],
      requestThroughput: [],
      activeConnections: [],
      errorRate: []
    };

    this.metricsWindow = 60; // Keep last 60 data points
    this.collectionInterval = 10000; // Collect every 10 seconds
    this.lastCollected = null;

    // Start metrics collection
    this.startMetricsCollection();
  }

  /**
   * Start periodic metrics collection
   */
  startMetricsCollection() {
    setInterval(() => {
      this.collectMetrics();
    }, this.collectionInterval);

    console.log('📊 System Metrics Service started (collection every 10s)');
  }

  /**
   * Collect system metrics
   */
  collectMetrics() {
    const timestamp = Date.now();

    // CPU metrics
    const cpuUsage = this.getCPUUsage();
    this.addMetric('cpu', cpuUsage, timestamp);

    // Memory metrics
    const memoryUsage = this.getMemoryUsage();
    this.addMetric('memory', memoryUsage, timestamp);

    // System load
    const loadAverage = os.loadavg();
    this.addMetric('loadAverage', (loadAverage[0] / os.cpus().length) * 100, timestamp);

    // Active connections (simulated)
    const activeConnections = Math.floor(Math.random() * 50) + 10;
    this.addMetric('activeConnections', activeConnections, timestamp);

    // Request throughput (requests/second) - simulated
    const throughput = Math.floor(Math.random() * 100) + 20;
    this.addMetric('requestThroughput', throughput, timestamp);

    // Error rate (%) - simulated
    const errorRate = Math.random() * 5;
    this.addMetric('errorRate', errorRate, timestamp);

    this.lastCollected = timestamp;

    // Check for anomalies
    this.checkMetricAnomalies();
  }

  /**
   * Get CPU usage percentage
   */
  getCPUUsage() {
    try {
      const cpus = os.cpus();
      const avgLoad = os.loadavg()[0];
      const cpuCount = cpus.length;
      return Math.min(100, (avgLoad / cpuCount) * 100);
    } catch (err) { // eslint-disable-line no-unused-vars
      return 0;
    }
  }

  /**
   * Get memory usage percentage
   */
  getMemoryUsage() {
    try {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      return ((totalMem - freeMem) / totalMem) * 100;
    } catch (err) { // eslint-disable-line no-unused-vars
      return 0;
    }
  }

  /**
   * Add metric data point
   */
  addMetric(metricName, value, timestamp) {
    if (!this.metrics[metricName]) {
      this.metrics[metricName] = [];
    }

    const metric = this.metrics[metricName];
    metric.push({ value, timestamp });

    // Keep only last N data points
    if (metric.length > this.metricsWindow) {
      metric.shift();
    }
  }

  /**
   * Record model token usage
   */
  recordTokenUsage(model, tokens) {
    this.addMetric('tokenUsage', tokens, Date.now());
    this.emit('tokens:recorded', { model, tokens, timestamp: new Date().toISOString() });
  }

  /**
   * Record API latency
   */
  recordLatency(endpoint, latencyMs) {
    this.addMetric('latency', latencyMs, Date.now());
    this.emit('latency:recorded', { endpoint, latencyMs, timestamp: new Date().toISOString() });
  }

  /**
   * Record cache hit/miss
   */
  recordCacheOperation(hit) {
    if (!this.cacheStats) {
      this.cacheStats = { hits: 0, misses: 0, total: 0 };
    }

    this.cacheStats.total++;
    if (hit) {
      this.cacheStats.hits++;
    } else {
      this.cacheStats.misses++;
    }

    const hitRate = (this.cacheStats.hits / this.cacheStats.total) * 100;
    this.addMetric('cacheHitRate', hitRate, Date.now());
  }

  /**
   * Record database query time
   */
  recordDatabaseQuery(queryTime) {
    this.addMetric('databaseQueryTime', queryTime, Date.now());
  }

  /**
   * Check for metric anomalies
   */
  checkMetricAnomalies() {
    const alerts = [];

    // Check CPU usage
    const cpuMetrics = this.metrics.cpu;
    if (cpuMetrics.length > 0) {
      const latestCPU = cpuMetrics[cpuMetrics.length - 1].value;
      if (latestCPU > 80) {
        alerts.push({ type: 'cpu', severity: 'warning', message: `High CPU usage: ${latestCPU.toFixed(2)}%` });
      }
      if (latestCPU > 95) {
        alerts.push({ type: 'cpu', severity: 'critical', message: `Critical CPU usage: ${latestCPU.toFixed(2)}%` });
      }
    }

    // Check memory usage
    const memMetrics = this.metrics.memory;
    if (memMetrics.length > 0) {
      const latestMem = memMetrics[memMetrics.length - 1].value;
      if (latestMem > 85) {
        alerts.push({ type: 'memory', severity: 'warning', message: `High memory usage: ${latestMem.toFixed(2)}%` });
      }
      if (latestMem > 95) {
        alerts.push({ type: 'memory', severity: 'critical', message: `Critical memory usage: ${latestMem.toFixed(2)}%` });
      }
    }

    // Check error rate
    const errorMetrics = this.metrics.errorRate;
    if (errorMetrics.length > 0) {
      const latestError = errorMetrics[errorMetrics.length - 1].value;
      if (latestError > 5) {
        alerts.push({ type: 'error_rate', severity: 'warning', message: `High error rate: ${latestError.toFixed(2)}%` });
      }
    }

    // Emit alerts
    if (alerts.length > 0) {
      this.emit('anomalies:detected', { alerts, timestamp: new Date().toISOString() });
    }
  }

  /**
   * Get latest metrics
   */
  getLatestMetrics() {
    const latest = {};

    for (const [key, values] of Object.entries(this.metrics)) {
      if (values.length > 0) {
        const lastValue = values[values.length - 1];
        latest[key] = lastValue.value;
      }
    }

    return {
      timestamp: new Date().toISOString(),
      metrics: latest,
      lastCollected: this.lastCollected
    };
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(metricName, limit = 60) {
    const metrics = this.metrics[metricName];
    if (!metrics) return [];

    return metrics.slice(-limit);
  }

  /**
   * Get metric statistics
   */
  getMetricStatistics(metricName) {
    const data = this.metrics[metricName];
    if (!data || data.length === 0) return null;

    const values = data.map(d => d.value);
    const sorted = [...values].sort((a, b) => a - b);

    return {
      metricName,
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      stdDev: this.calculateStdDev(values)
    };
  }

  /**
   * Calculate standard deviation
   */
  calculateStdDev(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Get comprehensive system report
   */
  getSystemReport() {
    const cpuStats = this.getMetricStatistics('cpu');
    const memStats = this.getMetricStatistics('memory');
    const errorStats = this.getMetricStatistics('errorRate');
    const latencyStats = this.getMetricStatistics('latency');

    return {
      timestamp: new Date().toISOString(),
      systemHealth: this.getSystemHealth(),
      cpuMetrics: cpuStats,
      memoryMetrics: memStats,
      errorMetrics: errorStats,
      latencyMetrics: latencyStats,
      cacheStats: this.cacheStats || { hits: 0, misses: 0, total: 0 },
      recommendations: this.getRecommendations()
    };
  }

  /**
   * Get system health score (0-100)
   */
  getSystemHealth() {
    const latest = this.getLatestMetrics().metrics;
    let score = 100;

    // Deduct points for high usage
    if (latest.cpu) {
      score -= Math.max(0, (latest.cpu - 50) * 0.5); // Deduct 0.5 per % above 50%
    }

    if (latest.memory) {
      score -= Math.max(0, (latest.memory - 60) * 0.5); // Deduct 0.5 per % above 60%
    }

    if (latest.errorRate) {
      score -= latest.errorRate * 10; // Deduct 10 per % error rate
    }

    return Math.max(0, Math.round(score));
  }

  /**
   * Get recommendations based on metrics
   */
  getRecommendations() {
    const recommendations = [];
    const latest = this.getLatestMetrics().metrics;

    if (latest.cpu > 70) {
      recommendations.push('⚠️  High CPU usage - consider optimizing agent algorithms or scaling horizontally');
    }

    if (latest.memory > 75) {
      recommendations.push('⚠️  High memory usage - check for memory leaks or consider increasing resources');
    }

    if (latest.errorRate > 2) {
      recommendations.push('⚠️  High error rate - investigate error logs and check external dependencies');
    }

    if (this.cacheStats && this.cacheStats.hits / this.cacheStats.total < 0.3) {
      recommendations.push('💡 Low cache hit rate - consider improving caching strategy');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ System performing well - no immediate recommendations');
    }

    return recommendations;
  }

  /**
   * Export metrics for analysis
   */
  exportMetricsData() {
    return {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      statistics: {
        cpu: this.getMetricStatistics('cpu'),
        memory: this.getMetricStatistics('memory'),
        latency: this.getMetricStatistics('latency'),
        errorRate: this.getMetricStatistics('errorRate')
      },
      systemReport: this.getSystemReport()
    };
  }
}

export default new SystemMetricsService();
