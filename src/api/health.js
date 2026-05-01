/**
 * Health Check Endpoints
 * Full system health monitoring for production
 * Integrates with all monitoring services
 */

import modelSelectionService from '../services/modelSelectionService.js';
import connectorManager from '../services/connectorManager.js';
import agentMonitoringService from '../agents/agentMonitoringService.js';
import selfHealingService from '../services/selfHealingService.js';
import systemMetricsService from '../services/systemMetricsService.js';

export async function healthCheck(req, res) {
  return res.json({
    status: 'healthy',
    component: 'api-gateway',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
}

export async function fullHealthCheck(req, res) {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      version: '3.0.0',
      components: {
        database: { status: 'checking...' },
        cache: { status: 'checking...' },
        models: {},
        connectors: {},
        agents: {},
        monitoring: {},
        selfHealing: {},
      },
    };

    // Check AI Models
    const models = modelSelectionService.getAvailableModels();
    health.components.models = models;

    if (!models.claude?.available && !models.openai?.available && !models.ollama?.available) {
      health.status = 'degraded';
    }

    // Check Connectors
    const connectorStatus = connectorManager.getHealthSummary();
    health.components.connectors = connectorStatus.connectors;

    if (!connectorStatus.healthy) {
      health.status = 'degraded';
    }

    // Check Agent Monitoring
    const agentHealth = agentMonitoringService.getSystemHealth();
    health.components.agents = {
      total: agentHealth.totalAgents,
      healthy: agentHealth.healthyAgents,
      running: agentHealth.runningAgents,
      failed: agentHealth.failedAgents,
      systemHealth: agentHealth.systemHealth,
    };

    if (agentHealth.systemHealth !== 'healthy') {
      health.status = 'degraded';
    }

    // Check Self-Healing
    const healingStatus = selfHealingService.getStatus();
    health.components.selfHealing = {
      autoRecoveryEnabled: healingStatus.autoRecoveryEnabled,
      activeRecoveries: healingStatus.activeRecoveries.length,
      openCircuitBreakers: healingStatus.openCircuitBreakers.length,
      openEscalations: healingStatus.openEscalations,
    };

    // Check Monitoring / System Metrics
    const systemHealth = systemMetricsService.getSystemHealth();
    const latestMetrics = systemMetricsService.getLatestMetrics();
    health.components.monitoring = {
      healthScore: systemHealth,
      metrics: latestMetrics.metrics,
    };

    if (systemHealth < 50) {
      health.status = 'unhealthy';
    } else if (systemHealth < 70) {
      health.status = 'degraded';
    }

    // Check Database (mock - in production connect to actual DB)
    health.components.database = {
      status: 'online',
      latency: Math.random() * 50,
    };

    // Check Cache (mock - in production connect to Redis)
    health.components.cache = {
      status: 'online',
      latency: Math.random() * 20,
    };

    // Overall status logic
    const componentStatuses = Object.values(health.components);
    const unhealthyCount = componentStatuses.filter(c =>
      c.status === 'unhealthy' || c.status === 'offline'
    ).length;

    if (unhealthyCount >= 2) {
      health.status = 'unhealthy';
    }

    return res.json(health);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date(),
    });
  }
}

export async function readiness(req, res) {
  const models = modelSelectionService.getAvailableModels();
  const agentHealth = agentMonitoringService.getSystemHealth();

  const ready =
    (models.claude?.available || models.openai?.available || models.ollama?.available) &&
    agentHealth.systemHealth !== 'unhealthy';

  return res.status(ready ? 200 : 503).json({
    ready,
    reason: ready ? 'All systems operational' : 'Some systems unavailable',
    agents: {
      total: agentHealth.totalAgents,
      healthy: agentHealth.healthyAgents,
    },
    models: {
      claude: models.claude?.available || false,
      openai: models.openai?.available || false,
      ollama: models.ollama?.available || false,
    },
  });
}

export async function liveness(req, res) {
  return res.json({ alive: true, timestamp: new Date() });
}
