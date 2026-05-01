// ═══════════════════════════════════════════════════════════════════
// FIRM MANAGEMENT SERVICE
// Role hierarchy, access control, engagement assignment
// Supabase-backed with localStorage fallback
// ═══════════════════════════════════════════════════════════════════

import { getSupabaseClient } from '../lib/supabaseClient.js';

export const ROLES = {
  PARTNER: 'partner',
  ENGAGEMENT_MANAGER: 'engagement_manager',
  SENIOR_AUDITOR: 'senior_auditor',
  JUNIOR_AUDITOR: 'junior_auditor',
  ADMIN: 'admin'
};

export const ROLE_PERMISSIONS = {
  partner: {
    canSignOpinion: true, canApproveEngagement: true, canViewAllEngagements: true,
    canManageTeam: true, canFinaliseSection: true, canReviewWork: true,
    canPrepareProcedures: true, canAccessAuditContent: true, canManageUsers: true,
    canViewFinancials: true, canRunAnalytics: true, canExportDocuments: true,
    label: 'Partner', color: '#F5A623',
    description: 'Full access. Approves engagements, signs opinions, manages team and firm.'
  },
  engagement_manager: {
    canSignOpinion: false, canApproveEngagement: false, canViewAllEngagements: false,
    canManageTeam: false, canFinaliseSection: true, canReviewWork: true,
    canPrepareProcedures: true, canAccessAuditContent: true, canManageUsers: false,
    canViewFinancials: true, canRunAnalytics: true, canExportDocuments: true,
    label: 'Engagement Manager', color: '#42A5F5',
    description: 'Manages assigned engagements. Reviews and finalises sections. Cannot sign opinion.'
  },
  senior_auditor: {
    canSignOpinion: false, canApproveEngagement: false, canViewAllEngagements: false,
    canManageTeam: false, canFinaliseSection: false, canReviewWork: false,
    canPrepareProcedures: true, canAccessAuditContent: true, canManageUsers: false,
    canViewFinancials: true, canRunAnalytics: true, canExportDocuments: false,
    label: 'Senior Auditor', color: '#66BB6A',
    description: 'Executes procedures, prepares work papers. Cannot review own work or finalise sections.'
  },
  junior_auditor: {
    canSignOpinion: false, canApproveEngagement: false, canViewAllEngagements: false,
    canManageTeam: false, canFinaliseSection: false, canReviewWork: false,
    canPrepareProcedures: true, canAccessAuditContent: true, canManageUsers: false,
    canViewFinancials: false, canRunAnalytics: false, canExportDocuments: false,
    label: 'Junior Auditor', color: '#FFA726',
    description: 'Assists with procedures. Limited access. Cannot finalise, review, or export.'
  },
  admin: {
    canSignOpinion: false, canApproveEngagement: false, canViewAllEngagements: false,
    canManageTeam: false, canFinaliseSection: false, canReviewWork: false,
    canPrepareProcedures: false, canAccessAuditContent: false, canManageUsers: true,
    canViewFinancials: false, canRunAnalytics: false, canExportDocuments: false,
    label: 'Admin', color: '#CE93D8',
    description: 'Manages users, firm settings. No access to audit content.'
  }
};

class FirmManagementService {
  constructor() {
    this.supabase = getSupabaseClient();
    this.localKey = 'firm_management_data';
  }

  _local(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
  _setLocal(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota */ } }

  // ── FIRM OPERATIONS ────────────────────────────────────────────────────
  async createFirm(firmData) {
    const firm = { id: `firm_${Date.now()}`, ...firmData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    if (this.supabase) {
      const { data, error } = await this.supabase.from('firms').insert(firm).select().single();
      if (!error) return data;
    }
    const firms = this._local('ae_firms') || [];
    firms.push(firm); this._setLocal('ae_firms', firms);
    return firm;
  }

  async getFirm(firmId) {
    if (this.supabase) {
      const { data, error } = await this.supabase.from('firms').select('*').eq('id', firmId).single();
      if (!error) return data;
    }
    const firms = this._local('ae_firms') || [];
    return firms.find(f => f.id === firmId) || null;
  }

  async updateFirm(firmId, updates) {
    const upd = { ...updates, updated_at: new Date().toISOString() };
    if (this.supabase) {
      const { data, error } = await this.supabase.from('firms').update(upd).eq('id', firmId).select().single();
      if (!error) return data;
    }
    const firms = this._local('ae_firms') || [];
    const idx = firms.findIndex(f => f.id === firmId);
    if (idx >= 0) { firms[idx] = { ...firms[idx], ...upd }; this._setLocal('ae_firms', firms); return firms[idx]; }
    return null;
  }

  async getFirmStats(firmId) {
    const [users, engagements] = await Promise.all([this.getFirmUsers(firmId), this.getEngagementsForFirm(firmId)]);
    return {
      totalTeam: users.length,
      partners: users.filter(u => u.role === 'partner').length,
      activeEngagements: engagements.filter(e => !['complete','declined'].includes(e.status)).length,
      completedThisYear: engagements.filter(e => e.status === 'complete' && new Date(e.completed_at||'').getFullYear() === new Date().getFullYear()).length,
      totalEngagements: engagements.length
    };
  }

  // ── USER OPERATIONS ─────────────────────────────────────────────────────
  async addFirmUser(firmId, userData) {
    const user = { id: `fu_${Date.now()}`, firm_id: firmId, ...userData, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    if (this.supabase) {
      const { data, error } = await this.supabase.from('firm_users').insert(user).select().single();
      if (!error) return data;
    }
    const users = this._local(`ae_firm_users_${firmId}`) || [];
    users.push(user); this._setLocal(`ae_firm_users_${firmId}`, users);
    return user;
  }

  async updateUserRole(firmUserId, role) {
    if (!ROLES[role.toUpperCase()] && !Object.values(ROLES).includes(role)) throw new Error(`Invalid role: ${role}`);
    const upd = { role, signing_authority: role === 'partner', updated_at: new Date().toISOString() };
    if (this.supabase) {
      const { data, error } = await this.supabase.from('firm_users').update(upd).eq('id', firmUserId).select().single();
      if (!error) return data;
    }
    return { id: firmUserId, ...upd };
  }

  async getFirmUsers(firmId) {
    if (this.supabase) {
      const { data, error } = await this.supabase.from('firm_users').select('*').eq('firm_id', firmId).eq('is_active', true).order('role').order('full_name');
      if (!error) return data || [];
    }
    return this._local(`ae_firm_users_${firmId}`) || [];
  }

  async deactivateUser(firmUserId) {
    if (this.supabase) {
      const { data, error } = await this.supabase.from('firm_users').update({ is_active: false, updated_at: new Date().toISOString() }).eq('id', firmUserId).select().single();
      if (!error) return data;
    }
    return { id: firmUserId, is_active: false };
  }

  async getCurrentUserRole(firmId, userId) {
    if (this.supabase) {
      const { data } = await this.supabase.from('firm_users').select('role, id, full_name, signing_authority').eq('firm_id', firmId).eq('user_id', userId).eq('is_active', true).single();
      return data || null;
    }
    const users = this._local(`ae_firm_users_${firmId}`) || [];
    return users.find(u => u.user_id === userId && u.is_active) || null;
  }

  // ── ENGAGEMENT OPERATIONS ─────────────────────────────────────────────
  async createEngagement(engagementData) {
    const { materiality } = engagementData;
    const engagement = {
      id: `eng_${Date.now()}`,
      ...engagementData,
      status: engagementData.status || 'acceptance',
      performance_materiality: materiality ? Math.round(materiality * 0.75) : null,
      trivial_threshold: materiality ? Math.round(materiality * 0.05) : null,
      stage_data: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (this.supabase) {
      const { data, error } = await this.supabase.from('firm_engagements').insert(engagement).select().single();
      if (!error) return data;
    }
    const key = `ae_engagements_${engagementData.firm_id}`;
    const engagements = this._local(key) || [];
    engagements.push(engagement); this._setLocal(key, engagements);
    return engagement;
  }

  async getEngagementsForUser(firmId, userId, userRole, firmUserId) {
    const allEngagements = await this.getEngagementsForFirm(firmId);
    if (userRole === 'partner') return allEngagements; // Partner sees all
    if (userRole === 'admin') return []; // Admin sees none

    if (this.supabase) {
      const { data: teamData } = await this.supabase.from('engagement_team').select('engagement_id').eq('user_id', firmUserId);
      const assignedIds = new Set((teamData || []).map(t => t.engagement_id));
      return allEngagements.filter(e => assignedIds.has(e.id) || e.manager_id === firmUserId || e.partner_id === firmUserId);
    }
    return allEngagements.filter(e => e.manager_id === firmUserId || e.partner_id === firmUserId);
  }

  async getEngagementsForFirm(firmId) {
    if (this.supabase) {
      const { data, error } = await this.supabase.from('firm_engagements').select(`*, partner:firm_users!partner_id(full_name, email), manager:firm_users!manager_id(full_name, email)`).eq('firm_id', firmId).order('created_at', { ascending: false });
      if (!error) return data || [];
    }
    return this._local(`ae_engagements_${firmId}`) || [];
  }

  async getEngagementById(engagementId) {
    if (this.supabase) {
      const { data, error } = await this.supabase.from('firm_engagements').select(`*, partner:firm_users!partner_id(*), manager:firm_users!manager_id(*)`).eq('id', engagementId).single();
      if (!error) return data;
    }
    return null;
  }

  async updateEngagementStatus(engagementId, status, _userId) {
    const validStatuses = ['acceptance','planning','interim','final','completion','post_engagement','complete','declined'];
    if (!validStatuses.includes(status)) throw new Error(`Invalid status: ${status}`);
    const updates = { status, updated_at: new Date().toISOString() };
    if (status === 'complete') updates.completed_at = new Date().toISOString();
    if (this.supabase) {
      const { data, error } = await this.supabase.from('firm_engagements').update(updates).eq('id', engagementId).select().single();
      if (!error) return data;
    }
    return { id: engagementId, ...updates };
  }

  async updateEngagementStageData(engagementId, stage, data) {
    if (this.supabase) {
      const { data: existing } = await this.supabase.from('firm_engagements').select('stage_data').eq('id', engagementId).single();
      const stageData = { ...(existing?.stage_data || {}), [stage]: data };
      const { data: updated } = await this.supabase.from('firm_engagements').update({ stage_data: stageData, updated_at: new Date().toISOString() }).eq('id', engagementId).select().single();
      return updated;
    }
    const key = `ae_stage_${engagementId}_${stage}`;
    this._setLocal(key, data);
    return { id: engagementId, stage, data };
  }

  async getEngagementStageData(engagementId, stage) {
    if (this.supabase) {
      const { data } = await this.supabase.from('firm_engagements').select('stage_data').eq('id', engagementId).single();
      return data?.stage_data?.[stage] || null;
    }
    return this._local(`ae_stage_${engagementId}_${stage}`);
  }

  async assignTeamMember(engagementId, firmUserId, role, sections = []) {
    const record = { id: `et_${Date.now()}`, engagement_id: engagementId, user_id: firmUserId, role, assigned_sections: sections, assigned_at: new Date().toISOString() };
    if (this.supabase) {
      const { data, error } = await this.supabase.from('engagement_team').upsert(record, { onConflict: 'engagement_id,user_id' }).select().single();
      if (!error) return data;
    }
    const key = `ae_team_${engagementId}`;
    const team = this._local(key) || [];
    const idx = team.findIndex(t => t.user_id === firmUserId);
    if (idx >= 0) team[idx] = record; else team.push(record);
    this._setLocal(key, team);
    return record;
  }

  async getEngagementTeam(engagementId) {
    if (this.supabase) {
      const { data } = await this.supabase.from('engagement_team').select(`*, user:firm_users(*)`).eq('engagement_id', engagementId);
      return data || [];
    }
    return this._local(`ae_team_${engagementId}`) || [];
  }

  // ── ACCESS CONTROL ────────────────────────────────────────────────────
  hasPermission(userRole, permission) {
    return ROLE_PERMISSIONS[userRole]?.[permission] === true;
  }

  canAccessEngagement(firmUserId, engagement, userRole) {
    if (userRole === 'partner') return true;
    if (userRole === 'admin') return false;
    return engagement.partner_id === firmUserId || engagement.manager_id === firmUserId;
  }

  getAccessibleSections(engagement, firmUserId, userRole) {
    if (userRole === 'partner' || userRole === 'engagement_manager') return 'all';
    const teamMembers = engagement.team || [];
    const member = teamMembers.find(t => t.user_id === firmUserId);
    return member?.assigned_sections || [];
  }

  // ── AUDIT FILES ─────────────────────────────────────────────────────────
  async createAuditFile(fileData) {
    const file = { id: `af_${Date.now()}`, ...fileData, status: 'not_started', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    if (this.supabase) {
      const { data, error } = await this.supabase.from('audit_files').insert(file).select().single();
      if (!error) return data;
    }
    const key = `ae_audit_files_${fileData.engagement_id}`;
    const files = this._local(key) || [];
    files.push(file); this._setLocal(key, files);
    return file;
  }

  async getAuditFiles(engagementId, stage = null) {
    if (this.supabase) {
      let query = this.supabase.from('audit_files').select('*').eq('engagement_id', engagementId);
      if (stage) query = query.eq('stage', stage);
      const { data } = await query.order('stage').order('section');
      return data || [];
    }
    const files = this._local(`ae_audit_files_${engagementId}`) || [];
    return stage ? files.filter(f => f.stage === stage) : files;
  }

  async updateAuditFile(fileId, updates) {
    const upd = { ...updates, updated_at: new Date().toISOString() };
    if (this.supabase) {
      const { data, error } = await this.supabase.from('audit_files').update(upd).eq('id', fileId).select().single();
      if (!error) return data;
    }
    return { id: fileId, ...upd };
  }

  async signOffAuditFile(fileId, signOffType, firmUserId) {
    const updates = { updated_at: new Date().toISOString() };
    if (signOffType === 'prepared') { updates.prepared_by = firmUserId; updates.prepared_date = new Date().toISOString(); updates.status = 'prepared'; }
    else if (signOffType === 'reviewed') { updates.reviewed_by = firmUserId; updates.reviewed_date = new Date().toISOString(); updates.status = 'reviewed'; }
    else if (signOffType === 'approved') { updates.approved_by = firmUserId; updates.approved_date = new Date().toISOString(); updates.status = 'approved'; }
    else throw new Error(`Invalid sign-off type: ${signOffType}`);

    if (this.supabase) {
      const { data, error } = await this.supabase.from('audit_files').update(updates).eq('id', fileId).select().single();
      if (!error) return data;
    }
    return { id: fileId, ...updates };
  }
}

export const firmManagementService = new FirmManagementService();
export default FirmManagementService;
