/**
 * Metrics API Routes
 * Provides endpoints for monitoring system health, agent performance,
 * metrics collection, and self-healing operations
 */

import express from 'express';
import agentMonitoringService from '../agents/agentMonitoringService.js';
import selfHealingService from '../services/selfHealingService.js';
import agentRecoveryService from '../agents/agentRecoveryService.js';
import systemMetricsService from '../services/systemMetricsService.js';

const router = express.Router();

/**
 * GET /api/metrics/system - System health and status
 */
router.get('/system', (req, res) => {
  try {
    const health = agentMonitoringService.getSystemHealth();
    const metrics = systemMetricsService.getLatestMetrics();
    const recovery = agentRecoveryService.getRecoverySummary();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      system: {
        health,
        metrics: metrics.metrics,
        recovery: {
          disabledAgents: recovery.summary.disabledCount,
          requiresAttention: recovery.summary.requiresAttention
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/metrics/agents - All agents status and metrics
 */
router.get('/agents', (req, res) => {
  try {
    const agents = agentMonitoringService.getAllAgentStatuses();
    const report = agentMonitoringService.getPerformanceReport();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      agents,
      summary: report.summary
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/metrics/agents/:name - Specific agent metrics
 */
router.get('/agents/:name', (req, res) => {
  try {
    const { name } = req.params;
    const agent = agentMonitoringService.getAgentStatus(name);

    if (!agent) {
      return res.status(404).json({ success: false, error: 'Agent not found' });
    }

    const history = agentMonitoringService.getAgentHistory(name, 50);
    const recovery = agentRecoveryService.getFailureHistory(name);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      agent,
      history,
      recoveryHistory: recovery,
      healingStatus: selfHealingService.getCircuitBreakerStatus(name)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/metrics/performance - Performance report
 */
router.get('/performance', (req, res) => {
  try {
    const report = agentMonitoringService.getPerformanceReport();
    const systemReport = systemMetricsService.getSystemReport();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      agentMetrics: report,
      systemMetrics: systemReport
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/metrics/health-check - Perform health check
 */
router.get('/health-check', async (req, res) => {
  try {
    const health = await agentMonitoringService.performHealthCheck();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      health
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/metrics/recovery - Recovery and self-healing status
 */
router.get('/recovery', (req, res) => {
  try {
    const healingStatus = selfHealingService.getStatus();
    const recoveryStats = selfHealingService.getRecoveryStatistics();
    const recoverySummary = agentRecoveryService.getRecoverySummary();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      healing: healingStatus,
      statistics: recoveryStats,
      summary: recoverySummary
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/metrics/alerts - System alerts
 */
router.get('/alerts', (req, res) => {
  try {
    const health = agentMonitoringService.getSystemHealth();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      alerts: health.alerts,
      count: health.alerts.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/metrics/alerts/:id/acknowledge - Acknowledge alert
 */
router.post('/alerts/:id/acknowledge', (req, res) => {
  try {
    const { id } = req.params;
    agentMonitoringService.acknowledgeAlert(id);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Alert acknowledged'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/metrics/recovery/:agent/reset - Reset recovery for agent
 */
router.post('/recovery/:agent/reset', (req, res) => {
  try {
    const { agent } = req.params;
    agentRecoveryService.resetFailureCount(agent);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: `Recovery reset for ${agent}`,
      agent: agentMonitoringService.getAgentStatus(agent)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/metrics/recovery/auto-recovery/:action - Enable/disable auto-recovery
 */
router.post('/recovery/auto-recovery/:action', (req, res) => {
  try {
    const { action } = req.params;
    const enabled = action === 'enable';

    selfHealingService.setAutoRecovery(enabled);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: `Auto-recovery ${enabled ? 'enabled' : 'disabled'}`,
      autoRecoveryEnabled: enabled
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/metrics/export - Export all monitoring data
 */
router.get('/export', (req, res) => {
  try {
    const monitoring = agentMonitoringService.exportMonitoringData();
    const metrics = systemMetricsService.exportMetricsData();
    const recovery = agentRecoveryService.exportRecoveryData();

    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      monitoring,
      metrics,
      recovery
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="monitoring-export.json"');
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/metrics/dashboard - Dashboard data (consolidated)
 */
router.get('/dashboard', (req, res) => {
  try {
    const agents = agentMonitoringService.getAllAgentStatuses();
    const systemHealth = agentMonitoringService.getSystemHealth();
    const systemMetrics = systemMetricsService.getLatestMetrics();
    const recovery = agentRecoveryService.getRecoverySummary();
    const performanceReport = agentMonitoringService.getPerformanceReport();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      dashboard: {
        systemHealth,
        metrics: systemMetrics.metrics,
        agents,
        recovery: recovery.summary,
        performance: performanceReport.summary
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
