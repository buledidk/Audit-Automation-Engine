/**
 * Dispatch API Routes - Phase 8: Mobile Dispatch & Remote Operations
 * Handles dispatch operations, command queue, push notifications,
 * mobile sessions, and WebSocket connections
 */
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://mbvjtondgunckgzrmyhq.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || ''
);

// ============================================================================
// DISPATCH OPERATIONS
// ============================================================================

// GET /api/dispatch/operations - List all dispatch operations
router.get('/operations', async (req, res) => {
  try {
    const { status, operation_type, device_id, limit = 50, offset = 0 } = req.query;
    let query = supabase
      .from('dispatch_operations')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);
    if (operation_type) query = query.eq('operation_type', operation_type);
    if (device_id) query = query.eq('device_id', device_id);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ success: true, operations: data, count: data?.length || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dispatch/operations/:id - Get single operation
router.get('/operations/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('dispatch_operations').select('*').eq('id', req.params.id).single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Operation not found' });

    res.json({ success: true, operation: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/dispatch/operations - Create new dispatch operation
router.post('/operations', async (req, res) => {
  try {
    const {
      operation_type,
      command,
      arguments: args,
      triggered_by,
      device_id,
      device_type,
      session_id,
      environment,
      branch,
    } = req.body;

    if (!operation_type || !command) {
      return res.status(400).json({ error: 'operation_type and command are required' });
    }

    const { data, error } = await supabase
      .from('dispatch_operations')
      .insert({
        operation_type,
        command,
        arguments: args,
        status: 'pending',
        triggered_by: triggered_by || 'api',
        triggered_at: new Date().toISOString(),
        device_id,
        device_type,
        session_id,
        environment,
        branch,
      })
      .select()
      .single();

    if (error) throw error;

    // Also log to audit
    await supabase.from('dispatch_audit_log').insert({
      dispatch_operation_id: data.id,
      operation_type,
      action: 'created',
      previous_status: null,
      new_status: 'pending',
      triggered_by: triggered_by || 'api',
    });

    res.status(201).json({ success: true, operation: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/dispatch/operations/:id - Update operation status
router.patch('/operations/:id', async (req, res) => {
  try {
    const { status, output, result, error_message, exit_code, duration_ms } = req.body;

    // Get current status for audit log
    const { data: current } = await supabase
      .from('dispatch_operations')
      .select('status')
      .eq('id', req.params.id)
      .single();

    const updates = { status, updated_at: new Date().toISOString() };
    if (output !== undefined) updates.output = output;
    if (result !== undefined) updates.result = result;
    if (error_message !== undefined) updates.error_message = error_message;
    if (exit_code !== undefined) updates.exit_code = exit_code;
    if (duration_ms !== undefined) updates.duration_ms = duration_ms;
    if (status === 'running') updates.started_at = new Date().toISOString();
    if (['success', 'failed', 'cancelled'].includes(status)) {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('dispatch_operations')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // Audit log
    await supabase.from('dispatch_audit_log').insert({
      dispatch_operation_id: req.params.id,
      operation_type: data.operation_type,
      action: status,
      previous_status: current?.status,
      new_status: status,
      triggered_by: 'api',
    });

    res.json({ success: true, operation: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dispatch/operations/summary - Operations summary view
router.get('/summary', async (req, res) => {
  try {
    const { data, error } = await supabase.from('dispatch_operations_summary').select('*');

    if (error) throw error;
    res.json({ success: true, summary: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// COMMAND QUEUE
// ============================================================================

// GET /api/dispatch/queue - Get command queue
router.get('/queue', async (req, res) => {
  try {
    const { status = 'queued' } = req.query;
    const { data, error } = await supabase
      .from('command_queue')
      .select('*')
      .eq('status', status)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json({ success: true, queue: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/dispatch/queue - Add command to queue
router.post('/queue', async (req, res) => {
  try {
    const { command, arguments: args, priority, requested_by, device_id, timeout_seconds } = req.body;

    if (!command) {
      return res.status(400).json({ error: 'command is required' });
    }

    const { data, error } = await supabase
      .from('command_queue')
      .insert({
        command,
        arguments: args,
        priority: priority || 0,
        requested_by,
        device_id,
        timeout_seconds: timeout_seconds || 300,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, queued: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/dispatch/queue/:id - Update queue item
router.patch('/queue/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updates = { status };
    if (status === 'processing') updates.started_at = new Date().toISOString();
    if (['completed', 'failed'].includes(status)) updates.completed_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('command_queue')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, queued: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// PUSH NOTIFICATIONS
// ============================================================================

// GET /api/dispatch/notifications - Get notifications
router.get('/notifications', async (req, res) => {
  try {
    const { device_id, status, limit = 50 } = req.query;
    let query = supabase.from('push_notifications').select('*').order('created_at', { ascending: false }).limit(limit);

    if (device_id) query = query.eq('device_id', device_id);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, notifications: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/dispatch/notifications - Send notification
router.post('/notifications', async (req, res) => {
  try {
    const { device_id, notification_type, title, message, action_url, action_data, channel, priority } = req.body;

    if (!device_id || !title) {
      return res.status(400).json({ error: 'device_id and title are required' });
    }

    const { data, error } = await supabase
      .from('push_notifications')
      .insert({
        device_id,
        notification_type,
        title,
        message,
        action_url,
        action_data,
        channel: channel || 'web_push',
        priority: priority || 'normal',
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, notification: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/dispatch/notifications/:id - Update notification status
router.patch('/notifications/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updates = { status, updated_at: new Date().toISOString() };
    if (status === 'sent') updates.sent_at = new Date().toISOString();
    if (status === 'delivered') updates.delivered_at = new Date().toISOString();
    if (status === 'read') updates.read_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('push_notifications')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, notification: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// MOBILE SESSIONS
// ============================================================================

// GET /api/dispatch/sessions - Get active sessions
router.get('/sessions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mobile_sessions')
      .select('*')
      .eq('is_active', true)
      .order('last_active', { ascending: false });

    if (error) throw error;
    res.json({ success: true, sessions: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/dispatch/sessions - Register/update session
router.post('/sessions', async (req, res) => {
  try {
    const { device_id, device_type, device_name, user_agent } = req.body;

    if (!device_id) {
      return res.status(400).json({ error: 'device_id is required' });
    }

    const { data, error } = await supabase
      .from('mobile_sessions')
      .upsert(
        {
          device_id,
          device_type,
          device_name,
          user_agent,
          last_active: new Date().toISOString(),
          is_active: true,
          last_seen_ip: req.ip,
        },
        { onConflict: 'device_id' }
      )
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, session: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// WEBSOCKET CONNECTIONS
// ============================================================================

// GET /api/dispatch/connections - Get active connections
router.get('/connections', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('websocket_connections')
      .select('*')
      .eq('is_connected', true)
      .order('connected_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, connections: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dispatch/audit-log - Get dispatch audit log
router.get('/audit-log', async (req, res) => {
  try {
    const { dispatch_operation_id, limit = 100 } = req.query;
    let query = supabase.from('dispatch_audit_log').select('*').order('timestamp', { ascending: false }).limit(limit);

    if (dispatch_operation_id) {
      query = query.eq('dispatch_operation_id', dispatch_operation_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, auditLog: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
