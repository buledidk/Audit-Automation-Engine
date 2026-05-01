--
-- 001_deploy_schema.sql
-- Initial Schema Deployment Migration
-- Multi-Jurisdictional Audit Platform (AuditEngine)
-- PostgreSQL 13+
--
-- This migration creates the full production schema from scratch.
-- All statements are idempotent (IF NOT EXISTS) so the script is safe to re-run.
--

BEGIN;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  auth_id UUID UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  title VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  status VARCHAR(20) DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);

-- ============================================================================
-- 2. ORGANIZATIONS (Audit Firms)
-- ============================================================================

CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  country_code VARCHAR(2),
  jurisdiction VARCHAR(2),
  logo_url TEXT,
  website VARCHAR(255),
  regulatory_registration VARCHAR(255),
  max_users INTEGER DEFAULT 100,
  max_engagements INTEGER DEFAULT 1000,
  subscription_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. USER-ORGANIZATION MEMBERSHIP
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_organizations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, organization_id)
);

CREATE INDEX IF NOT EXISTS idx_user_organizations_user_org ON user_organizations(user_id, organization_id);

-- ============================================================================
-- 4. ENTITIES (Clients being audited)
-- ============================================================================

CREATE TABLE IF NOT EXISTS entities (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  jurisdiction_code VARCHAR(2) NOT NULL,
  entity_type VARCHAR(100),
  turnover NUMERIC(15, 2),
  total_assets NUMERIC(15, 2),
  equity NUMERIC(15, 2),
  year_end_date DATE,
  registration_number VARCHAR(100),
  company_website VARCHAR(255),
  is_public BOOLEAN DEFAULT FALSE,
  is_charity BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_entities_jurisdiction ON entities(jurisdiction_code);
CREATE INDEX IF NOT EXISTS idx_entities_organization ON entities(organization_id);
CREATE INDEX IF NOT EXISTS idx_entities_status ON entities(status);

-- ============================================================================
-- 5. ENTITY CONTACTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS entity_contacts (
  id SERIAL PRIMARY KEY,
  entity_id INTEGER NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. ENGAGEMENTS (Audit Projects)
-- ============================================================================

CREATE TABLE IF NOT EXISTS engagements (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  entity_id INTEGER NOT NULL REFERENCES entities(id),
  engagement_type VARCHAR(50) NOT NULL,
  framework_code VARCHAR(20) NOT NULL,
  financial_year_end DATE NOT NULL,
  audit_start_date DATE,
  audit_end_date DATE,
  status VARCHAR(50) DEFAULT 'planning',
  partner_id INTEGER REFERENCES users(id),
  manager_id INTEGER REFERENCES users(id),
  estimated_budget_hours INTEGER,
  actual_hours_spent INTEGER DEFAULT 0,
  budget_amount NUMERIC(12, 2),
  materiality NUMERIC(12, 2),
  performance_materiality NUMERIC(12, 2),
  trivial_threshold NUMERIC(12, 2),
  overall_risk_level VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_engagements_organization ON engagements(organization_id);
CREATE INDEX IF NOT EXISTS idx_engagements_entity ON engagements(entity_id);
CREATE INDEX IF NOT EXISTS idx_engagements_status ON engagements(status);
CREATE INDEX IF NOT EXISTS idx_engagements_framework ON engagements(framework_code);
CREATE INDEX IF NOT EXISTS idx_engagements_user ON engagements(partner_id, manager_id);

-- ============================================================================
-- 7. PROCEDURES (Audit Work Steps)
-- ============================================================================

CREATE TABLE IF NOT EXISTS procedures (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  procedure_code VARCHAR(50) NOT NULL,
  procedure_name VARCHAR(255) NOT NULL,
  fsli VARCHAR(50),
  assertion VARCHAR(50),
  risk_level VARCHAR(20),
  is_significant_risk BOOLEAN DEFAULT FALSE,
  sample_size INTEGER,
  sample_percentage NUMERIC(5, 2),
  estimated_hours INTEGER,
  actual_hours_spent INTEGER DEFAULT 0,
  assigned_to INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'not_started',
  completion_percentage INTEGER DEFAULT 0,
  notes TEXT,
  required_evidence TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_procedures_engagement ON procedures(engagement_id);
CREATE INDEX IF NOT EXISTS idx_procedures_status ON procedures(status);
CREATE INDEX IF NOT EXISTS idx_procedures_assigned ON procedures(assigned_to);
CREATE INDEX IF NOT EXISTS idx_procedures_engagement_user ON procedures(engagement_id, assigned_to);

-- ============================================================================
-- 8. EVIDENCE MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS evidence (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  procedure_id INTEGER REFERENCES procedures(id),
  evidence_type VARCHAR(100),
  file_name VARCHAR(255),
  file_path TEXT,
  file_size INTEGER,
  file_hash VARCHAR(64),
  s3_key TEXT,
  description TEXT,
  source VARCHAR(100),
  evidence_date DATE,
  review_status VARCHAR(50) DEFAULT 'pending',
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  exceptions_found BOOLEAN DEFAULT FALSE,
  exception_ids TEXT,
  audit_trail TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_evidence_engagement ON evidence(engagement_id);
CREATE INDEX IF NOT EXISTS idx_evidence_procedure ON evidence(procedure_id);
CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence(evidence_type);
CREATE INDEX IF NOT EXISTS idx_evidence_status ON evidence(review_status);
CREATE INDEX IF NOT EXISTS idx_evidence_procedure_status ON evidence(procedure_id, review_status);

-- ============================================================================
-- 9. FINDINGS (Exceptions / Issues)
-- ============================================================================

CREATE TABLE IF NOT EXISTS findings (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  fsli VARCHAR(50),
  finding_type VARCHAR(100),
  severity VARCHAR(20),
  description TEXT NOT NULL,
  impact_amount NUMERIC(12, 2),
  is_adjusted BOOLEAN DEFAULT FALSE,
  adjustment_approved BOOLEAN DEFAULT FALSE,
  root_cause TEXT,
  recommendation TEXT,
  assigned_to INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'open',
  resolution_date TIMESTAMP,
  evidence_ids TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_findings_engagement ON findings(engagement_id);
CREATE INDEX IF NOT EXISTS idx_findings_status ON findings(status);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON findings(severity);
CREATE INDEX IF NOT EXISTS idx_findings_engagement_status ON findings(engagement_id, status);

-- ============================================================================
-- 10. RISK ASSESSMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS risk_assessments (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  fsli VARCHAR(50) NOT NULL,
  inherent_risk_score INTEGER,
  control_risk_score INTEGER,
  detection_risk_score INTEGER,
  risk_factors TEXT,
  key_risks TEXT,
  significant_risks BOOLEAN DEFAULT FALSE,
  fraud_risk_identified BOOLEAN DEFAULT FALSE,
  going_concern_risk BOOLEAN DEFAULT FALSE,
  notes TEXT,
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_risk_assessments_engagement ON risk_assessments(engagement_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_fsli ON risk_assessments(fsli);

-- ============================================================================
-- 11. REPORTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  report_type VARCHAR(100),
  report_title VARCHAR(255),
  report_content TEXT,
  executive_summary TEXT,
  findings_summary TEXT,
  recommendations TEXT,
  draft_number INTEGER DEFAULT 1,
  is_final BOOLEAN DEFAULT FALSE,
  signed_by INTEGER REFERENCES users(id),
  signed_at TIMESTAMP,
  file_path TEXT,
  file_format VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_reports_engagement ON reports(engagement_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_is_final ON reports(is_final);

-- ============================================================================
-- 12. WORKING PAPERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS working_papers (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  ref_code VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  phase VARCHAR(50),
  isa_ref VARCHAR(50),
  description TEXT,
  cell_data JSONB,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  prepared_by INTEGER REFERENCES users(id),
  prepared_date TIMESTAMP,
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_working_papers_engagement ON working_papers(engagement_id);
CREATE INDEX IF NOT EXISTS idx_working_papers_phase ON working_papers(phase);
CREATE INDEX IF NOT EXISTS idx_working_papers_status ON working_papers(status);
CREATE INDEX IF NOT EXISTS idx_working_papers_ref_code ON working_papers(ref_code);

-- ============================================================================
-- 13. AUDIT LOG (Complete Audit Trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  entity_name VARCHAR(255),
  old_values TEXT,
  new_values TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status VARCHAR(50),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_org ON audit_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(created_at);

-- ============================================================================
-- 14. COMMENTS & NOTES
-- ============================================================================

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  comment_text TEXT NOT NULL,
  mentions TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER NOT NULL REFERENCES users(id),
  resolved_by INTEGER REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_comments_engagement ON comments(engagement_id);
CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_comments_resolved ON comments(is_resolved);

-- ============================================================================
-- 15. JURISDICTION CONFIGURATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS jurisdiction_config (
  id SERIAL PRIMARY KEY,
  jurisdiction_code VARCHAR(2) UNIQUE NOT NULL,
  jurisdiction_name VARCHAR(100),
  region VARCHAR(50),
  primary_framework VARCHAR(20),
  secondary_frameworks TEXT,
  audit_exemption_threshold NUMERIC(12, 2),
  accounts_filing_months INTEGER,
  materiality_guidance TEXT,
  key_regulations TEXT,
  entity_types TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 16. FRAMEWORK CONFIGURATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS framework_config (
  id SERIAL PRIMARY KEY,
  framework_code VARCHAR(20) UNIQUE NOT NULL,
  framework_name VARCHAR(100),
  description TEXT,
  applicable_jurisdictions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 17. PROCEDURE TEMPLATE LIBRARY
-- ============================================================================

CREATE TABLE IF NOT EXISTS procedure_templates (
  id SERIAL PRIMARY KEY,
  procedure_code VARCHAR(50) UNIQUE NOT NULL,
  procedure_name VARCHAR(255),
  description TEXT,
  fsli VARCHAR(50),
  assertion VARCHAR(50),
  applicable_frameworks TEXT,
  applicable_jurisdictions TEXT,
  sample_size_formula TEXT,
  estimated_hours INTEGER,
  required_evidence TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 18. ORGANIZATION SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS org_settings (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL UNIQUE REFERENCES organizations(id),
  default_framework VARCHAR(20),
  primary_jurisdiction VARCHAR(2),
  timezone VARCHAR(50),
  date_format VARCHAR(20),
  currency VARCHAR(3),
  require_2fa BOOLEAN DEFAULT TRUE,
  require_evidence_review BOOLEAN DEFAULT TRUE,
  auto_generate_reports BOOLEAN DEFAULT FALSE,
  settings_json TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Active Engagements Summary
CREATE OR REPLACE VIEW v_active_engagements AS
SELECT
  e.id,
  e.engagement_type,
  ent.name AS entity_name,
  e.framework_code,
  e.status,
  u_partner.first_name || ' ' || u_partner.last_name AS partner,
  e.actual_hours_spent,
  e.estimated_budget_hours,
  COUNT(DISTINCT p.id) AS procedure_count,
  COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) AS completed_procedures,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) /
    NULLIF(COUNT(DISTINCT p.id), 0)
  ) AS completion_percentage
FROM engagements e
JOIN entities ent ON e.entity_id = ent.id
LEFT JOIN users u_partner ON e.partner_id = u_partner.id
LEFT JOIN procedures p ON e.id = p.engagement_id
WHERE e.status IN ('planning', 'fieldwork', 'review')
GROUP BY e.id, e.engagement_type, ent.name, e.framework_code, e.status,
         u_partner.first_name, u_partner.last_name,
         e.actual_hours_spent, e.estimated_budget_hours;

-- Outstanding Findings
CREATE OR REPLACE VIEW v_outstanding_findings AS
SELECT
  f.id,
  e.engagement_type,
  ent.name AS entity_name,
  f.fsli,
  f.severity,
  f.finding_type,
  f.impact_amount,
  u.first_name || ' ' || u.last_name AS assigned_to,
  f.created_at,
  CURRENT_DATE - f.created_at::DATE AS days_outstanding
FROM findings f
JOIN engagements e ON f.engagement_id = e.id
JOIN entities ent ON e.entity_id = ent.id
LEFT JOIN users u ON f.assigned_to = u.id
WHERE f.status != 'closed'
ORDER BY f.severity DESC, f.created_at ASC;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE jurisdiction_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE framework_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedure_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TRIGGERS: auto-update updated_at columns
-- ============================================================================

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'users', 'organizations', 'entities', 'engagements',
      'procedures', 'evidence', 'findings', 'risk_assessments',
      'reports', 'working_papers', 'comments'
    ])
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trigger_updated_at ON %I; '
      'CREATE TRIGGER trigger_updated_at BEFORE UPDATE ON %I '
      'FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      tbl, tbl
    );
  END LOOP;
END;
$$;

-- Reference tables with updated_at also get triggers
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'jurisdiction_config', 'framework_config',
      'procedure_templates', 'org_settings'
    ])
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trigger_updated_at ON %I; '
      'CREATE TRIGGER trigger_updated_at BEFORE UPDATE ON %I '
      'FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      tbl, tbl
    );
  END LOOP;
END;
$$;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

COMMIT;
