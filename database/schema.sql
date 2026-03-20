--
-- PRODUCTION DATABASE SCHEMA
-- Multi-Jurisdictional Audit Platform
-- PostgreSQL 13+
--
-- COPY & PASTE: Create with psql < schema.sql
--

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users & Authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  title VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  INDEX idx_email (email),
  INDEX idx_status (status)
);

-- Organizations (Audit Firms)
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  country_code VARCHAR(2),
  jurisdiction VARCHAR(2),
  logo_url TEXT,
  website VARCHAR(255),
  regulatory_registration VARCHAR(255),
  max_users INTEGER DEFAULT 100,
  max_engagements INTEGER DEFAULT 1000,
  subscription_level VARCHAR(50), -- starter, professional, enterprise
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Organization Membership
CREATE TABLE user_organizations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- admin, manager, auditor, viewer
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, organization_id),
  INDEX idx_user_org (user_id, organization_id)
);

-- Clients (Entities being audited)
CREATE TABLE entities (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  jurisdiction_code VARCHAR(2) NOT NULL, -- UK, DE, FR, etc
  entity_type VARCHAR(100), -- Limited Company, Charity, etc
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
  created_by INTEGER REFERENCES users(id),
  INDEX idx_jurisdiction (jurisdiction_code),
  INDEX idx_organization (organization_id),
  INDEX idx_status (status)
);

-- Entity Contacts
CREATE TABLE entity_contacts (
  id SERIAL PRIMARY KEY,
  entity_id INTEGER NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50), -- cfo, finance_manager, audit_contact
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Engagements (Audit Projects)
CREATE TABLE engagements (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  entity_id INTEGER NOT NULL REFERENCES entities(id),
  engagement_type VARCHAR(50) NOT NULL, -- full_audit, limited_review, agreed_procedures
  framework_code VARCHAR(20) NOT NULL, -- FRS102, IFRS, etc
  financial_year_end DATE NOT NULL,
  audit_start_date DATE,
  audit_end_date DATE,
  status VARCHAR(50) DEFAULT 'planning', -- planning, fieldwork, review, completed, archived
  partner_id INTEGER REFERENCES users(id),
  manager_id INTEGER REFERENCES users(id),
  estimated_budget_hours INTEGER,
  actual_hours_spent INTEGER DEFAULT 0,
  budget_amount NUMERIC(12, 2),
  materiality NUMERIC(12, 2),
  performance_materiality NUMERIC(12, 2),
  trivial_threshold NUMERIC(12, 2),
  overall_risk_level VARCHAR(20), -- low, medium, high
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  INDEX idx_organization (organization_id),
  INDEX idx_entity (entity_id),
  INDEX idx_status (status),
  INDEX idx_framework (framework_code)
);

-- Procedures (Audit Work Steps)
CREATE TABLE procedures (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  procedure_code VARCHAR(50) NOT NULL,
  procedure_name VARCHAR(255) NOT NULL,
  fsli VARCHAR(50), -- Revenue, Inventory, Receivables, etc
  assertion VARCHAR(50), -- Occurrence, Completeness, Accuracy, etc
  risk_level VARCHAR(20), -- low, medium, high
  is_significant_risk BOOLEAN DEFAULT FALSE,
  sample_size INTEGER,
  sample_percentage NUMERIC(5, 2),
  estimated_hours INTEGER,
  actual_hours_spent INTEGER DEFAULT 0,
  assigned_to INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, review, completed
  completion_percentage INTEGER DEFAULT 0,
  notes TEXT,
  required_evidence TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  INDEX idx_engagement (engagement_id),
  INDEX idx_status (status),
  INDEX idx_assigned (assigned_to)
);

-- Evidence Management
CREATE TABLE evidence (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  procedure_id INTEGER REFERENCES procedures(id),
  evidence_type VARCHAR(100), -- invoice, reconciliation, receipt, statement, etc
  file_name VARCHAR(255),
  file_path TEXT,
  file_size INTEGER, -- bytes
  file_hash VARCHAR(64), -- SHA256
  s3_key TEXT, -- S3 storage key
  description TEXT,
  source VARCHAR(100), -- client_provided, auditor_obtained, system_generated
  evidence_date DATE,
  review_status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected, needs_revision
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  exceptions_found BOOLEAN DEFAULT FALSE,
  exception_ids TEXT, -- comma-separated
  audit_trail TEXT, -- JSON log of all changes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  INDEX idx_engagement (engagement_id),
  INDEX idx_procedure (procedure_id),
  INDEX idx_type (evidence_type),
  INDEX idx_status (review_status)
);

-- Findings (Exceptions/Issues)
CREATE TABLE findings (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  fsli VARCHAR(50),
  finding_type VARCHAR(100), -- misstatement, control_deficiency, compliance_issue
  severity VARCHAR(20), -- low, medium, high, critical
  description TEXT NOT NULL,
  impact_amount NUMERIC(12, 2),
  is_adjusted BOOLEAN DEFAULT FALSE,
  adjustment_approved BOOLEAN DEFAULT FALSE,
  root_cause TEXT,
  recommendation TEXT,
  assigned_to INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'open', -- open, under_review, resolved, closed
  resolution_date TIMESTAMP,
  evidence_ids TEXT, -- comma-separated
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  INDEX idx_engagement (engagement_id),
  INDEX idx_status (status),
  INDEX idx_severity (severity)
);

-- Risk Assessment
CREATE TABLE risk_assessments (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  fsli VARCHAR(50) NOT NULL,
  inherent_risk_score INTEGER, -- 1-5
  control_risk_score INTEGER, -- 1-5
  detection_risk_score INTEGER, -- 1-5
  risk_factors TEXT, -- JSON array
  key_risks TEXT, -- JSON array
  significant_risks BOOLEAN DEFAULT FALSE,
  fraud_risk_identified BOOLEAN DEFAULT FALSE,
  going_concern_risk BOOLEAN DEFAULT FALSE,
  notes TEXT,
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'draft', -- draft, final
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  INDEX idx_engagement (engagement_id),
  INDEX idx_fsli (fsli)
);

-- Reports
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  report_type VARCHAR(100), -- audit_report, management_letter, compliance_report
  report_title VARCHAR(255),
  report_content TEXT, -- Stored as JSON or HTML
  executive_summary TEXT,
  findings_summary TEXT,
  recommendations TEXT,
  draft_number INTEGER DEFAULT 1,
  is_final BOOLEAN DEFAULT FALSE,
  signed_by INTEGER REFERENCES users(id), -- Partner signature
  signed_at TIMESTAMP,
  file_path TEXT,
  file_format VARCHAR(20), -- PDF, DOCX, HTML
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  INDEX idx_engagement (engagement_id),
  INDEX idx_type (report_type),
  INDEX idx_is_final (is_final)
);

-- ============================================================================
-- AUDIT TRAIL & LOGGING
-- ============================================================================

-- Complete Audit Trail
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100), -- engagement, procedure, evidence, etc
  entity_id INTEGER,
  entity_name VARCHAR(255),
  old_values TEXT, -- JSON
  new_values TEXT, -- JSON
  ip_address VARCHAR(45),
  user_agent TEXT,
  status VARCHAR(50), -- success, failure
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_org (organization_id),
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_timestamp (created_at)
);

-- ============================================================================
-- COLLABORATION & COMMENTS
-- ============================================================================

-- Comments & Notes
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  engagement_id INTEGER NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  entity_type VARCHAR(100), -- procedure, evidence, finding
  entity_id INTEGER,
  comment_text TEXT NOT NULL,
  mentions TEXT, -- @username mentions
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER NOT NULL REFERENCES users(id),
  resolved_by INTEGER REFERENCES users(id),
  INDEX idx_engagement (engagement_id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_resolved (is_resolved)
);

-- ============================================================================
-- COMPLIANCE & REFERENCE DATA
-- ============================================================================

-- Jurisdiction Configuration
CREATE TABLE jurisdiction_config (
  id SERIAL PRIMARY KEY,
  jurisdiction_code VARCHAR(2) UNIQUE NOT NULL,
  jurisdiction_name VARCHAR(100),
  region VARCHAR(50),
  primary_framework VARCHAR(20),
  secondary_frameworks TEXT, -- JSON array
  audit_exemption_threshold NUMERIC(12, 2),
  accounts_filing_months INTEGER,
  materiality_guidance TEXT, -- JSON
  key_regulations TEXT, -- JSON array
  entity_types TEXT, -- JSON array
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Framework Configuration
CREATE TABLE framework_config (
  id SERIAL PRIMARY KEY,
  framework_code VARCHAR(20) UNIQUE NOT NULL,
  framework_name VARCHAR(100),
  description TEXT,
  applicable_jurisdictions TEXT, -- JSON array
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Procedure Template Library
CREATE TABLE procedure_templates (
  id SERIAL PRIMARY KEY,
  procedure_code VARCHAR(50) UNIQUE NOT NULL,
  procedure_name VARCHAR(255),
  description TEXT,
  fsli VARCHAR(50),
  assertion VARCHAR(50),
  applicable_frameworks TEXT, -- JSON array
  applicable_jurisdictions TEXT, -- JSON array
  sample_size_formula TEXT,
  estimated_hours INTEGER,
  required_evidence TEXT, -- JSON array
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SETTINGS & CONFIGURATION
-- ============================================================================

-- Organization Settings
CREATE TABLE org_settings (
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
  settings_json TEXT, -- Additional JSON config
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES & CONSTRAINTS
-- ============================================================================

-- Create indexes for frequently queried combinations
CREATE INDEX idx_engagement_user ON engagements(partner_id, manager_id);
CREATE INDEX idx_procedures_engagement_user ON procedures(engagement_id, assigned_to);
CREATE INDEX idx_evidence_procedure ON evidence(procedure_id, review_status);
CREATE INDEX idx_findings_engagement ON findings(engagement_id, status);

-- ============================================================================
-- VIEWS (Helpful for queries)
-- ============================================================================

-- Active Engagements Summary
CREATE VIEW v_active_engagements AS
SELECT
  e.id,
  e.engagement_type,
  ent.name as entity_name,
  e.framework_code,
  e.status,
  u_partner.first_name || ' ' || u_partner.last_name as partner,
  e.actual_hours_spent,
  e.estimated_budget_hours,
  COUNT(DISTINCT p.id) as procedure_count,
  COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) as completed_procedures,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) /
    NULLIF(COUNT(DISTINCT p.id), 0)
  ) as completion_percentage
FROM engagements e
JOIN entities ent ON e.entity_id = ent.id
LEFT JOIN users u_partner ON e.partner_id = u_partner.id
LEFT JOIN procedures p ON e.id = p.engagement_id
WHERE e.status IN ('planning', 'fieldwork', 'review')
GROUP BY e.id, ent.name, u_partner.first_name, u_partner.last_name;

-- Outstanding Findings
CREATE VIEW v_outstanding_findings AS
SELECT
  f.id,
  e.engagement_type,
  ent.name as entity_name,
  f.fsli,
  f.severity,
  f.finding_type,
  f.impact_amount,
  u.first_name || ' ' || u.last_name as assigned_to,
  f.created_at,
  CURRENT_DATE - f.created_at::DATE as days_outstanding
FROM findings f
JOIN engagements e ON f.engagement_id = e.id
JOIN entities ent ON e.entity_id = ent.id
LEFT JOIN users u ON f.assigned_to = u.id
WHERE f.status != 'closed'
ORDER BY f.severity DESC, f.created_at ASC;

-- ============================================================================
-- GRANTS & SECURITY
-- ============================================================================

-- Create audit_readonly role for read-only access
-- CREATE ROLE audit_readonly WITH LOGIN PASSWORD 'secure_password';
-- GRANT USAGE ON SCHEMA public TO audit_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO audit_readonly;

-- ============================================================================
-- END SCHEMA
-- ============================================================================

COMMIT;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
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
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Organization-level access for users
CREATE POLICY "Users can access their organizations"
  ON user_organizations FOR SELECT
  USING (user_id = current_user_id());

-- Entities accessible within organization
CREATE POLICY "Entities accessible within organization"
  ON entities FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_organizations
    WHERE user_id = current_user_id()
  ));

-- Engagements accessible within organization
CREATE POLICY "Engagements accessible within organization"
  ON engagements FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_organizations
    WHERE user_id = current_user_id()
  ));

-- Audit log accessible within organization
CREATE POLICY "Audit log accessible within organization"
  ON audit_log FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_organizations
    WHERE user_id = current_user_id()
  ));

