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
// AUTHENTICATION HELPERS
// ═══════════════════════════════════════════════════════════════════

export async function signIn(email, password) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email, password, metadata = {}) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export function onAuthStateChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
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
// PROCEDURE OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function loadProcedures(engagementId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('procedures').select('*').eq('engagement_id', engagementId).order('procedure_code');
  if (error) throw error;
  return data;
}

export async function createProcedure(procedureData) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('procedures').insert({ ...procedureData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }).select().single();
  if (error) throw error;
  return data;
}

export async function updateProcedureStatus(procedureId, status, completionPercentage) {
  if (!supabase) throw new Error('Supabase not configured');
  const updates = { status, completion_percentage: completionPercentage, updated_at: new Date().toISOString() };
  if (status === 'completed') updates.completed_at = new Date().toISOString();
  const { data, error } = await supabase.from('procedures').update(updates).eq('id', procedureId).select().single();
  if (error) throw error;
  return data;
}

export async function updateProcedureHours(procedureId, hours) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('procedures').update({ actual_hours_spent: hours, updated_at: new Date().toISOString() }).eq('id', procedureId).select().single();
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// EVIDENCE OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function loadEvidence(engagementId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('evidence').select('*').eq('engagement_id', engagementId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function loadEvidenceByProcedure(procedureId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('evidence').select('*').eq('procedure_id', procedureId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createEvidence(evidenceData) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('evidence').insert({ ...evidenceData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }).select().single();
  if (error) throw error;
  return data;
}

export async function updateEvidenceReviewStatus(evidenceId, reviewStatus, reviewedBy, reviewNotes) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('evidence').update({ review_status: reviewStatus, reviewed_by: reviewedBy, reviewed_at: new Date().toISOString(), review_notes: reviewNotes, updated_at: new Date().toISOString() }).eq('id', evidenceId).select().single();
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// RISK ASSESSMENT OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function loadRiskAssessments(engagementId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('risk_assessments').select('*').eq('engagement_id', engagementId).order('fsli');
  if (error) throw error;
  return data;
}

export async function createRiskAssessment(assessmentData) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('risk_assessments').insert({ ...assessmentData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }).select().single();
  if (error) throw error;
  return data;
}

export async function updateRiskAssessment(assessmentId, updates) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('risk_assessments').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', assessmentId).select().single();
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// AUDIT LOG OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function logAuditEntry(engagementId, action, details = {}) {
  if (!supabase) {
    console.log('Audit log (local only):', { engagementId, action, ...details });
    return;
  }

  const { error } = await supabase
    .from('audit_log')
    .insert({
      action,
      entity_type: 'engagement',
      entity_id: engagementId,
      ...details,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('❌ Audit log entry failed:', error);
  }
}

export async function getAuditLog(engagementId) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .eq('entity_type', 'engagement')
    .eq('entity_id', engagementId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// FINDINGS OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function createFinding(engagementId, findingData) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('findings')
    .insert({
      engagement_id: engagementId,
      ...findingData,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFindings(engagementId) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('findings')
    .select('*')
    .eq('engagement_id', engagementId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateFindingStatus(findingId, status, recommendation = null) {
  if (!supabase) throw new Error('Supabase not configured');

  const updates = {
    status,
    resolution_date: status === 'resolved' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  };

  if (recommendation) {
    updates.recommendation = recommendation;
  }

  const { data, error } = await supabase
    .from('findings')
    .update(updates)
    .eq('id', findingId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// ENTITY OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function loadEntities(organizationId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('entities').select('*').eq('organization_id', organizationId).order('name');
  if (error) throw error;
  return data;
}

export async function getEntity(entityId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('entities').select('*').eq('id', entityId).single();
  if (error) throw error;
  return data;
}

export async function createEntity(entityData) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('entities').insert({ ...entityData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }).select().single();
  if (error) throw error;
  return data;
}

export async function updateEntity(entityId, updates) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('entities').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', entityId).select().single();
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// ENTITY CONTACT OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function loadEntityContacts(entityId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('entity_contacts').select('*').eq('entity_id', entityId).order('is_primary', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createEntityContact(contactData) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('entity_contacts').insert({ ...contactData, created_at: new Date().toISOString() }).select().single();
  if (error) throw error;
  return data;
}

export async function updateEntityContact(contactId, updates) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('entity_contacts').update(updates).eq('id', contactId).select().single();
  if (error) throw error;
  return data;
}

export async function deleteEntityContact(contactId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('entity_contacts').delete().eq('id', contactId);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════════════
// COMMENT OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function loadComments(engagementId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('comments').select('*').eq('engagement_id', engagementId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createComment(commentData) {
  if (!supabase) {
    console.warn('Comment not saved - Supabase not configured');
    return null;
  }
  const { data, error } = await supabase.from('comments').insert({ ...commentData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }).select().single();
  if (error) { console.warn('Comment save failed:', error); return null; }
  return data;
}

export async function resolveComment(commentId, resolvedBy) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('comments').update({ is_resolved: true, resolved_by: resolvedBy, updated_at: new Date().toISOString() }).eq('id', commentId).select().single();
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// USER OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function getUserById(userId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function getUserByEmail(email) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error) throw error;
  return data;
}

export async function getUserByAuthId(authId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('users').select('*').eq('auth_id', authId).single();
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId, updates) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('users').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', userId).select().single();
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// ORGANIZATION OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function getOrganization(orgId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('organizations').select('*').eq('id', orgId).single();
  if (error) throw error;
  return data;
}

export async function updateOrganization(orgId, updates) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('organizations').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', orgId).select().single();
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// USER ORGANIZATION OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function getUserOrganizations(userId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('user_organizations').select('*, organizations(*)').eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function getOrganizationMembers(orgId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('user_organizations').select('*, users(*)').eq('organization_id', orgId);
  if (error) throw error;
  return data;
}

export async function addUserToOrganization(userId, orgId, role) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('user_organizations').insert({ user_id: userId, organization_id: orgId, role, created_at: new Date().toISOString() }).select().single();
  if (error) throw error;
  return data;
}

export async function removeUserFromOrganization(userId, orgId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('user_organizations').delete().eq('user_id', userId).eq('organization_id', orgId);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════════════
// REPORT OPERATIONS
// ═══════════════════════════════════════════════════════════════════

export async function loadReports(engagementId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('reports').select('*').eq('engagement_id', engagementId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createReport(reportData) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('reports').insert({ ...reportData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }).select().single();
  if (error) throw error;
  return data;
}

export async function updateReport(reportId, updates) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('reports').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', reportId).select().single();
  if (error) throw error;
  return data;
}

export async function markReportFinal(reportId, signedBy) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('reports').update({ is_final: true, signed_by: signedBy, signed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', reportId).select().single();
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// REFERENCE / CONFIG OPERATIONS (read-only)
// ═══════════════════════════════════════════════════════════════════

export async function listJurisdictions() {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('jurisdiction_config').select('*').order('jurisdiction_code');
  if (error) throw error;
  return data;
}

export async function getJurisdiction(code) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('jurisdiction_config').select('*').eq('jurisdiction_code', code).single();
  if (error) throw error;
  return data;
}

export async function listFrameworks() {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('framework_config').select('*').eq('is_active', true).order('framework_code');
  if (error) throw error;
  return data;
}

export async function getFramework(code) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('framework_config').select('*').eq('framework_code', code).single();
  if (error) throw error;
  return data;
}

export async function listProcedureTemplates() {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('procedure_templates').select('*').eq('is_active', true).order('procedure_code');
  if (error) throw error;
  return data;
}

export async function getProcedureTemplatesByFramework(frameworkCode) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('procedure_templates').select('*').eq('is_active', true).contains('applicable_frameworks', JSON.stringify([frameworkCode]));
  if (error) throw error;
  return data;
}

export async function getOrgSettings(orgId) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('org_settings').select('*').eq('organization_id', orgId).single();
  if (error) throw error;
  return data;
}

export async function upsertOrgSettings(orgId, settings) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('org_settings').upsert({ organization_id: orgId, ...settings, updated_at: new Date().toISOString() }, { onConflict: 'organization_id' }).select().single();
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

export { supabase };
export default supabase;
