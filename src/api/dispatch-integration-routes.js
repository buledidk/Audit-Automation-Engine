/**
 * dispatch-integration-routes.js
 *
 * API routes for dispatch integration service
 * Enables multi-platform access: web, mobile, CLI, terminal
 * Handles offline operations, real-time sync, and device coordination
 *
 * Version: 1.0.0
 * Created: March 2026
 */

import express from 'express';
import dispatchIntegrationService from '../services/dispatchIntegrationService.js';

const router = express.Router();

/**
 * POST /api/dispatch/session/init
 * Initialize dispatch session from any platform
 */
router.post('/session/init', (req, res) => {
  try {
    const sessionData = req.body;

    console.log(`\n📱 API DISPATCH: Session init - ${sessionData.platform}`);

    const result = dispatchIntegrationService.initializeDispatchSession(sessionData);

    res.json({
      success: true,
      sessionId: result.sessionId,
      message: result.message,
      session: result.session
    });
  } catch (error) {
    console.error('Error initializing dispatch session:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/dispatch/operation/queue
 * Queue operation for dispatch (supports offline)
 */
router.post('/operation/queue', (req, res) => {
  try {
    const operationData = req.body;

    console.log(`\n📋 API DISPATCH: Operation queued - ${operationData.operationType}`);

    const result = dispatchIntegrationService.queueOperation(operationData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      operationId: result.operationId,
      status: result.status,
      message: result.message
    });
  } catch (error) {
    console.error('Error queueing operation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/dispatch/session/:sessionId/sync
 * Sync dispatch session - executes queued operations
 */
router.post('/session/:sessionId/sync', async (req, res) => {
  try {
    const { sessionId } = req.params;

    console.log(`\n🔄 API DISPATCH: Session sync - ${sessionId}`);

    const result = await dispatchIntegrationService.syncDispatchSession(sessionId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      syncData: result.syncData,
      message: result.message
    });
  } catch (error) {
    console.error('Error syncing dispatch session:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/dispatch/status
 * Get status of all dispatch sessions
 */
router.get('/status', (req, res) => {
  try {
    console.log('\n📊 API DISPATCH: Getting dispatch status');

    const statuses = dispatchIntegrationService.getDispatchStatus();

    res.json({
      success: true,
      activeSessions: statuses.length,
      sessions: statuses,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting dispatch status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/dispatch/engagement/:engagementId/updates
 * Get real-time engagement updates
 */
router.get('/engagement/:engagementId/updates', (req, res) => {
  try {
    const { engagementId } = req.params;

    console.log(`\n📡 API DISPATCH: Getting engagement updates - ${engagementId}`);

    const result = dispatchIntegrationService.getRealTimeEngagementUpdates(engagementId);

    res.json({
      success: true,
      data: result.engagement,
      pushTo: result.pushTo,
      timestamp: result.timestamp
    });
  } catch (error) {
    console.error('Error getting engagement updates:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/dispatch/session/:sessionId/command
 * Execute terminal command from dispatch
 */
router.post('/session/:sessionId/command', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { command } = req.body;

    console.log(`\n💻 API DISPATCH: Terminal command - ${command}`);

    const result = await dispatchIntegrationService.executeTerminalCommand(sessionId, command);

    res.json({
      success: result.success,
      command,
      result: result.result,
      timestamp: result.timestamp
    });
  } catch (error) {
    console.error('Error executing terminal command:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/dispatch/engagement/:engagementId/broadcast
 * Broadcast update to all dispatch sessions for engagement
 */
router.post('/engagement/:engagementId/broadcast', (req, res) => {
  try {
    const { engagementId } = req.params;
    const updateData = req.body;

    console.log(`\n📢 API DISPATCH: Broadcasting update - ${engagementId}`);

    const result = dispatchIntegrationService.broadcastUpdate(engagementId, updateData);

    res.json({
      success: true,
      affectedSessions: result.affectedSessions.length,
      details: result
    });
  } catch (error) {
    console.error('Error broadcasting update:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/dispatch/session/:sessionId
 * End dispatch session
 */
router.delete('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;

    console.log(`\n👋 API DISPATCH: Ending session - ${sessionId}`);

    const result = dispatchIntegrationService.endDispatchSession(sessionId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      sessionData: result.sessionData,
      message: result.message
    });
  } catch (error) {
    console.error('Error ending dispatch session:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/dispatch/info
 * Get dispatch service info and capabilities
 */
router.get('/info', (req, res) => {
  try {
    console.log('\n ℹ️ API DISPATCH: Getting service info');

    const info = dispatchIntegrationService.getServiceInfo();

    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    console.error('Error getting dispatch info:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/dispatch/health
 * Health check for dispatch service
 */
router.get('/health', (req, res) => {
  try {
    const info = dispatchIntegrationService.getServiceInfo();

    res.json({
      success: true,
      status: 'Dispatch Integration Service - Operational',
      activeSessions: info.activeSessions,
      queuedOperations: info.queuedOperations,
      platforms: info.platforms,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking dispatch health:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
