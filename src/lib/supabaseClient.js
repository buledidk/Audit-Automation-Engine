// ═══════════════════════════════════════════════════════════════════
// SUPABASE CLIENT MODULE
// Handles database connectivity and operations
// Phase 2 Integration - Persistent Storage
// ═══════════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

// Initialize Supabase client if credentials are provided
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('⚠️ Supabase credentials not configured. Database features disabled.');
  console.warn('   See PHASE_2_SETUP.md for configuration instructions.');
}

// ═══════════════════════════════════════════════════════════════════
// ENGAGEMENT OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function loadEngagement(engagementId) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('engagements')
    .select('*')
    .eq('id', engagementId)
    .single();

  if (error) throw error;
  return data;
}

export async function loadAllEngagements() {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('engagements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createEngagement(engagementData) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('engagements')
    .insert({
      ...engagementData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEngagement(engagementId, updates) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('engagements')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', engagementId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEngagement(engagementId) {
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase
    .from('engagements')
    .delete()
    .eq('id', engagementId);

  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════════════
// WORKING PAPER OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function loadWorkingPapers(engagementId) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('working_papers')
    .select('*')
    .eq('engagement_id', engagementId)
    .order('ref_code', { ascending: true });

  if (error) throw error;
  return data;
}

export async function saveWorkingPaper(wpData) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('working_papers')
    .upsert(wpData, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function signOffWorkingPaper(wpId, type, userId) {
  if (!supabase) throw new Error('Supabase not configured');

  const updates = {
    updated_at: new Date().toISOString()
  };

  if (type === 'prepared') {
    updates.prepared_by = userId;
    updates.prepared_date = new Date().toISOString();
  } else if (type === 'reviewed') {
    updates.reviewed_by = userId;
    updates.reviewed_date = new Date().toISOString();
    updates.status = 'complete';
  }

  const { data, error } = await supabase
    .from('working_papers')
    .update(updates)
    .eq('id', wpId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// AUDIT TRAIL OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function logAuditTrail(engagementId, action, details = {}) {
  if (!supabase) {
    console.log('Audit trail (local only):', { engagementId, action, ...details });
    return;
  }

  const { error } = await supabase
    .from('audit_trail')
    .insert({
      engagement_id: engagementId,
      action,
      ...details,
      changed_at: new Date().toISOString()
    });

  if (error) {
    console.error('❌ Audit trail log failed:', error);
  }
}

export async function getAuditTrail(engagementId) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('audit_trail')
    .select('*')
    .eq('engagement_id', engagementId)
    .order('changed_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// ISSUES & MISSTATEMENTS OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function createIssue(engagementId, issueData) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('issues')
    .insert({
      engagement_id: engagementId,
      ...issueData,
      raised_date: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getIssues(engagementId) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('engagement_id', engagementId)
    .order('raised_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateIssueStatus(issueId, status, resolution_notes = null) {
  if (!supabase) throw new Error('Supabase not configured');

  const updates = {
    status,
    resolved_date: status === 'resolved' ? new Date().toISOString() : null
  };

  if (resolution_notes) {
    updates.resolution_notes = resolution_notes;
  }

  const { data, error } = await supabase
    .from('issues')
    .update(updates)
    .eq('id', issueId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

export function isSupabaseConfigured() {
  return supabase !== null;
}

export function getSupabaseClient() {
  return supabase;
}

export default supabase;
