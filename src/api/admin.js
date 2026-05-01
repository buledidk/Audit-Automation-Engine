/**
 * Admin Control Panel API
 * Endpoints for administrative control of agents, services, and recovery operations
 */

import express from 'express';
import agentMonitoringService from '../agents/agentMonitoringService.js';
import selfHealingService from '../services/selfHealingService.js';
import agentRecoveryService from '../agents/agentRecoveryService.js';

const router = express.Router();

/**
 * POST /api/admin/agents/restart-all - Restart all agents
 */
router.post('/agents/restart-all', (req, res) => {
  try {
    console.log('🔄 Admin: Restarting all agents...');

    const agents = Array.from(agentMonitoringService.agents.keys());
    const results = [];

    agents.forEach(agentName => {
      results.push({
        agent: agentName,
        status: 'restarting',
        timestamp: new Date().toISOString()
      });
    });

    agentMonitoringService.emit('admin:restart-all', {
      agents,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Restart initiated for ${agents.length} agents`,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/agents/:name/restart - Restart specific agent
 */
router.post('/agents/:name/restart', (req, res) => {
  try {
    const { name } = req.params;
    const agent = agentMonitoringService.agents.get(name);

    if (!agent) {
      return res.status(404).json({ success: false, error: `Agent ${name} not found` });
    }

    console.log(`🔄 Admin: Restarting agent ${name}...`);

    agent.status = 'restarting';
    agentMonitoringService.emit('admin:restart-agent', { agent: name, timestamp: new Date().toISOString() });

    res.json({
      success: true,
      message: `Restart initiated for ${name}`,
      agent: {
        name,
        status: 'restarting',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/agents/:name/enable - Enable disabled agent
 */
router.post('/agents/:name/enable', (req, res) => {
  try {
    const { name } = req.params;
    const agent = agentMonitoringService.agents.get(name);

    if (!agent) {
      return res.status(404).json({ success: false, error: `Agent ${name} not found` });
    }

    console.log(`✅ Admin: Enabling agent ${name}...`);

    agent.status = 'idle';
    agent.healthy = true;
    agentRecoveryService.resetFailureCount(name);
    selfHealingService.resetCircuitBreaker(name);

    res.json({
      success: true,
      message: `Agent ${name} enabled`,
      agent: agentMonitoringService.getAgentStatus(name)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/agents/:name/disable - Disable agent
 */
router.post('/agents/:name/disable', (req, res) => {
  try {
    const { name } = req.params;
    const agent = agentMonitoringService.agents.get(name);

    if (!agent) {
      return res.status(404).json({ success: false, error: `Agent ${name} not found` });
    }

    console.log(`❌ Admin: Disabling agent ${name}...`);

    agent.status = 'disabled';
    agent.healthy = false;

    agentMonitoringService.createAlert('info', `Agent ${name} disabled by admin`);

    res.json({
      success: true,
      message: `Agent ${name} disabled`,
      agent: agentMonitoringService.getAgentStatus(name)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/cache/clear - Clear system cache
 */
router.post('/cache/clear', (req, res) => {
  try {
    console.log('🗑️  Admin: Clearing cache...');

    // In production, would clear actual cache (Redis, etc.)
    // For now, just log and respond

    agentMonitoringService.emit('admin:cache-cleared', { timestamp: new Date().toISOString() });

    res.json({
      success: true,
      message: 'Cache cleared',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/recovery/escalations/:id/resolve - Resolve escalation
 */
router.post('/recovery/escalations/:id/resolve', (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    const escalation = selfHealingService.resolveEscalation(id, resolution);

    if (!escalation) {
      return res.status(404).json({ success: false, error: 'Escalation not found' });
    }

    console.log(`✅ Admin: Resolved escalation ${id}`);

    res.json({
      success: true,
      message: 'Escalation resolved',
      escalation
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/status - Complete admin dashboard
 */
router.get('/status', (req, res) => {
  try {
    const agents = agentMonitoringService.getAllAgentStatuses();
    const systemHealth = agentMonitoringService.getSystemHealth();
    const recovery = agentRecoveryService.getRecoverySummary();
    const healing = selfHealingService.getStatus();
    const alerts = systemHealth.alerts;
    const escalations = selfHealingService.getEscalationQueue();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      admin: {
        systemHealth,
        agents: agents.map(a => ({
          name: a.name,
          status: a.status,
          healthy: a.healthy,
          executionCount: a.executionCount,
          failureCount: a.failureCount
        })),
        recovery: recovery.summary,
        healing: {
          autoRecoveryEnabled: healing.autoRecoveryEnabled,
          activeRecoveries: healing.activeRecoveries.length,
          openCircuitBreakers: healing.openCircuitBreakers.length,
          openEscalations: healing.openEscalations
        },
        alerts: {
          total: alerts.length,
          recent: alerts.slice(-5)
        },
        escalations: {
          total: escalations.length,
          open: escalations.filter(e => e.status === 'open').length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/health-check - Trigger system health check
 */
router.post('/health-check', async (req, res) => {
  try {
    console.log('🏥 Admin: Triggering health check...');

    const health = await agentMonitoringService.performHealthCheck();

    res.json({
      success: true,
      message: 'Health check completed',
      health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/logs/alerts - Get recent alerts
 */
router.get('/logs/alerts', (req, res) => {
  try {
    const health = agentMonitoringService.getSystemHealth();
    const { limit = 50 } = req.query;

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      alerts: health.alerts.slice(-limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/logs/escalations - Get escalations
 */
router.get('/logs/escalations', (req, res) => {
  try {
    const escalations = selfHealingService.getEscalationQueue();
    const { status, limit = 50 } = req.query;

    let filtered = escalations;
    if (status) {
      filtered = escalations.filter(e => e.status === status);
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      escalations: filtered.slice(-limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
