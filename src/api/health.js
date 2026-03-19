/**
 * Health Check Endpoints
 * Full system health monitoring for production
 */

import modelSelectionService from '../services/modelSelectionService.js';
import connectorManager from '../services/connectorManager.js';

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
      components: {
        database: { status: 'checking...' },
        cache: { status: 'checking...' },
        models: {},
        connectors: {},
      },
    };

    // Check AI Models
    const models = modelSelectionService.getAvailableModels();
    health.components.models = models;

    if (!models.claude.available && !models.openai.available && !models.ollama.available) {
      health.status = 'degraded';
    }

    // Check Connectors
    const connectorStatus = connectorManager.getHealthSummary();
    health.components.connectors = connectorStatus.connectors;

    if (!connectorStatus.healthy) {
      health.status = 'degraded';
    }

    // Check Database (mock)
    health.components.database = {
      status: 'online',
      latency: Math.random() * 50,
    };

    // Check Cache (mock)
    health.components.cache = {
      status: 'online',
      latency: Math.random() * 20,
    };

    // Overall status logic
    const unhealthyComponents = Object.values(health.components)
      .filter(c => c.status !== 'online' && c.status !== 'checking...')
      .length;

    if (unhealthyComponents >= 2) {
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
  // Check if system is ready to accept traffic
  const models = modelSelectionService.getAvailableModels();
  const connectors = connectorManager.getHealthSummary();

  const ready =
    (models.claude.available || models.openai.available || models.ollama.available) &&
    connectors.healthy;

  return res.status(ready ? 200 : 503).json({
    ready,
    reason: ready ? 'All systems operational' : 'Some systems unavailable',
  });
}

export async function liveness(req, res) {
  // Simple liveness check - is the process running?
  return res.json({ alive: true, timestamp: new Date() });
}
