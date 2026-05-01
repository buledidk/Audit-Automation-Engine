/**
 * Agent Assessment API Routes - Phase 8.5
 * Handles agent health, incidents, rankings, trends, head agent state
 */
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://mbvjtondgunckgzrmyhq.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || ''
);

router.get('/health', async (req, res) => {
  try {
    const { agent_id, status, limit = 100 } = req.query;
    let query = supabase.from('agent_health_metrics').select('*').order('timestamp', { ascending: false }).limit(limit);
    if (agent_id) query = query.eq('agent_id', agent_id);
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, metrics: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/health/:agentId', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('agent_health_metrics')
      .select('*')
      .eq('agent_id', req.params.agentId)
      .gte('timestamp', since)
      .order('timestamp', { ascending: false });
    if (error) throw error;
    res.json({ success: true, metrics: data, agent_id: req.params.agentId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('agent_health_metrics').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, metric: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/incidents', async (req, res) => {
  try {
    const { agent_id, severity, status, limit = 50 } = req.query;
    let query = supabase.from('agent_incidents').select('*').order('timestamp', { ascending: false }).limit(limit);
    if (agent_id) query = query.eq('agent_id', agent_id);
    if (severity) query = query.eq('severity', severity);
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, incidents: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/incidents', async (req, res) => {
  try {
    const { agent_id, agent_name, incident_type, severity, description, error_details } = req.body;
    if (!agent_id || !incident_type) return res.status(400).json({ error: 'agent_id and incident_type required' });
    const { data, error } = await supabase
      .from('agent_incidents')
      .insert({
        agent_id,
        agent_name,
        incident_type,
        severity,
        description,
        error_details,
        detected_at: new Date().toISOString(),
        status: 'open',
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ success: true, incident: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/incidents/:id', async (req, res) => {
  try {
    const { status, recovery_action, recovery_status, root_cause, resolution } = req.body;
    const updates = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (recovery_action) updates.recovery_action = recovery_action;
    if (recovery_status) {
      updates.recovery_status = recovery_status;
      if (['succeeded', 'failed'].includes(recovery_status)) {
        updates.recovery_completed_at = new Date().toISOString();
      }
    }
    if (root_cause) updates.root_cause = root_cause;
    if (resolution) updates.resolution = resolution;
    const { data, error } = await supabase
      .from('agent_incidents')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, incident: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/rankings', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('agent_rankings')
      .select('*')
      .eq('date', targetDate)
      .order('rank', { ascending: true });
    if (error) throw error;
    res.json({ success: true, rankings: data, date: targetDate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/rankings/:agentId', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('agent_rankings')
      .select('*')
      .eq('agent_id', req.params.agentId)
      .gte('date', since)
      .order('date', { ascending: false });
    if (error) throw error;
    res.json({ success: true, rankings: data, agent_id: req.params.agentId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/rankings', async (req, res) => {
  try {
    const rankings = Array.isArray(req.body) ? req.body : [req.body];
    const { data, error } = await supabase
      .from('agent_rankings')
      .upsert(rankings, { onConflict: 'date,agent_id' })
      .select();
    if (error) throw error;
    res.status(201).json({ success: true, rankings: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/trends', async (req, res) => {
  try {
    const { agent_id, period = 'daily' } = req.query;
    let query = supabase
      .from('agent_performance_trends')
      .select('*')
      .eq('period', period)
      .order('period_start', { ascending: false })
      .limit(90);
    if (agent_id) query = query.eq('agent_id', agent_id);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, trends: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/trends', async (req, res) => {
  try {
    const { data, error } = await supabase.from('agent_performance_trends').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, trend: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/head-agent', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('head_agent_state')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json({ success: true, headAgent: data || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/head-agent', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('head_agent_state')
      .upsert({
        ...req.body,
        agent_id: 'head-agent',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, headAgent: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/specializations', async (req, res) => {
  try {
    const { agent_id, specialty } = req.query;
    let query = supabase.from('agent_specializations').select('*').order('expertise_score', { ascending: false });
    if (agent_id) query = query.eq('agent_id', agent_id);
    if (specialty) query = query.eq('specialty', specialty);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, specializations: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/workload', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('agent_workload_distribution')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);
    if (error) throw error;
    res.json({ success: true, workload: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/workload', async (req, res) => {
  try {
    const records = Array.isArray(req.body) ? req.body : [req.body];
    const { data, error } = await supabase.from('agent_workload_distribution').insert(records).select();
    if (error) throw error;
    res.status(201).json({ success: true, workload: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/comparisons', async (req, res) => {
  try {
    const { agent_id, metric } = req.query;
    let query = supabase.from('agent_comparisons').select('*').order('timestamp', { ascending: false }).limit(100);
    if (agent_id) query = query.eq('agent_id', agent_id);
    if (metric) query = query.eq('metric', metric);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, comparisons: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/recommendations', async (req, res) => {
  try {
    const { agent_id, status = 'open', priority } = req.query;
    let query = supabase.from('agent_recommendations').select('*').order('created_at', { ascending: false });
    if (agent_id) query = query.eq('agent_id', agent_id);
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, recommendations: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/recommendations', async (req, res) => {
  try {
    const { data, error } = await supabase.from('agent_recommendations').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, recommendation: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/recommendations/:id', async (req, res) => {
  try {
    const updates = { ...req.body, updated_at: new Date().toISOString() };
    if (req.body.status === 'completed') updates.completed_at = new Date().toISOString();
    const { data, error } = await supabase
      .from('agent_recommendations')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, recommendation: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const [healthRes, incidentRes, rankingRes, headRes] = await Promise.all([
      supabase.from('agent_health_metrics').select('*').order('timestamp', { ascending: false }).limit(18),
      supabase
        .from('agent_incidents')
        .select('*')
        .eq('status', 'open')
        .order('timestamp', { ascending: false })
        .limit(20),
      supabase
        .from('agent_rankings')
        .select('*')
        .eq('date', new Date().toISOString().split('T')[0])
        .order('rank', { ascending: true }),
      supabase.from('head_agent_state').select('*').order('updated_at', { ascending: false }).limit(1),
    ]);
    res.json({
      success: true,
      dashboard: {
        health: healthRes.data || [],
        openIncidents: incidentRes.data || [],
        rankings: rankingRes.data || [],
        headAgent: headRes.data?.[0] || null,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
