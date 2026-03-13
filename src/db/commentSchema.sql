-- ═════════════════════════════════════════════════════════════════════
-- AUDIT WORKPAPER COMMENTING SYSTEM - DATABASE SCHEMA
-- ═════════════════════════════════════════════════════════════════════
-- Comprehensive schema for storing comments, threads, and audit evidence

-- ═════════════════════════════════════════════════════════════════════
-- MAIN COMMENTS TABLE
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE audit_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL,
  working_paper_ref VARCHAR(10) NOT NULL,
  working_paper_section VARCHAR(255),

  -- Comment content
  comment_type VARCHAR(50) NOT NULL, -- preparer_notes, reviewer_comment, exception_found, etc.
  text TEXT NOT NULL,
  template_id VARCHAR(100),

  -- Author information
  created_by_user_id UUID NOT NULL,
  created_by_name VARCHAR(255),
  created_by_role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Threading (reply to another comment)
  parent_comment_id UUID REFERENCES audit_comments(id),

  -- Resolution tracking
  status VARCHAR(50) DEFAULT 'open', -- open, in_progress, resolved, acknowledged, closed
  resolved_by_user_id UUID,
  resolved_at TIMESTAMP,
  resolution_notes TEXT,

  -- Priority and sensitivity
  priority VARCHAR(50) DEFAULT 'routine', -- routine, important, critical
  confidentiality VARCHAR(50) DEFAULT 'standard', -- standard, restricted, external_only

  -- Linking to external evidence
  linked_documents JSONB, -- array of {documentId, type, fileName, fileUrl, description}

  -- Prior year references
  linked_prior_year_wp VARCHAR(10),

  -- Tags for categorization
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Audit trail and compliance
  requires_response BOOLEAN DEFAULT FALSE,
  response_deadline TIMESTAMP,
  responded_by_user_id UUID,
  responded_at TIMESTAMP,

  -- Metadata
  edit_count INT DEFAULT 0,
  view_count INT DEFAULT 0,

  -- Indexes
  CONSTRAINT valid_comment_type CHECK (comment_type IN (
    'preparer_notes', 'reviewer_comment', 'team_discussion',
    'mgmt_communication', 'exception_found', 'follow_up_item',
    'evidence_reference'
  )),
  CONSTRAINT valid_status CHECK (status IN (
    'open', 'in_progress', 'resolved', 'acknowledged', 'closed'
  )),
  CONSTRAINT valid_priority CHECK (priority IN (
    'routine', 'important', 'critical'
  )),
  CONSTRAINT valid_confidentiality CHECK (confidentiality IN (
    'standard', 'restricted', 'external_only'
  ))
);

CREATE INDEX idx_audit_comments_engagement ON audit_comments(engagement_id);
CREATE INDEX idx_audit_comments_wp ON audit_comments(working_paper_ref);
CREATE INDEX idx_audit_comments_type ON audit_comments(comment_type);
CREATE INDEX idx_audit_comments_status ON audit_comments(status);
CREATE INDEX idx_audit_comments_priority ON audit_comments(priority);
CREATE INDEX idx_audit_comments_created_by ON audit_comments(created_by_user_id);
CREATE INDEX idx_audit_comments_parent ON audit_comments(parent_comment_id);
CREATE INDEX idx_audit_comments_created_at ON audit_comments(created_at DESC);

-- ═════════════════════════════════════════════════════════════════════
-- COMMENT EDIT HISTORY (AUDIT TRAIL)
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE audit_comment_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES audit_comments(id) ON DELETE CASCADE,
  edited_by_user_id UUID NOT NULL,
  edited_by_name VARCHAR(255),
  edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  original_text TEXT,
  new_text TEXT,
  change_reason VARCHAR(255),

  CREATE INDEX idx_comment_edits_comment ON audit_comment_edits(comment_id);
  CREATE INDEX idx_comment_edits_user ON audit_comment_edits(edited_by_user_id);
  CREATE INDEX idx_comment_edits_date ON audit_comment_edits(edited_at DESC);
);

-- ═════════════════════════════════════════════════════════════════════
-- COMMENT MENTIONS (@mentions)
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE audit_comment_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES audit_comments(id) ON DELETE CASCADE,
  mentioned_user_id UUID NOT NULL,
  mentioned_user_name VARCHAR(255),
  mentioned_user_email VARCHAR(255),
  mentioned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMP,

  CREATE INDEX idx_mentions_comment ON audit_comment_mentions(comment_id);
  CREATE INDEX idx_mentions_user ON audit_comment_mentions(mentioned_user_id);
  CREATE INDEX idx_mentions_acknowledged ON audit_comment_mentions(acknowledged);
);

-- ═════════════════════════════════════════════════════════════════════
-- LINKED DOCUMENTS/EVIDENCE
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE audit_comment_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES audit_comments(id) ON DELETE CASCADE,
  document_type VARCHAR(50), -- email, file, confirmation, evidence, etc.
  file_name VARCHAR(255),
  file_url TEXT,
  file_size_bytes INT,
  uploaded_by_user_id UUID,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT,

  CREATE INDEX idx_evidence_comment ON audit_comment_evidence(comment_id);
  CREATE INDEX idx_evidence_type ON audit_comment_evidence(document_type);
);

-- ═════════════════════════════════════════════════════════════════════
-- WORKING PAPER COMMENT FRAMEWORK
-- Tracks comments at the WP level (objective, scope, procedures, etc.)
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE working_paper_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL,
  working_paper_ref VARCHAR(10) NOT NULL,
  section_id VARCHAR(100) NOT NULL, -- 'objective', 'scope', 'procedures', 'results', 'conclusion', 'reviewer_signoff'

  section_title VARCHAR(255),
  section_content TEXT,
  section_template_id VARCHAR(100),

  created_by_user_id UUID NOT NULL,
  created_by_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Sign-off tracking
  reviewed_by_user_id UUID,
  reviewed_by_name VARCHAR(255),
  reviewed_date TIMESTAMP,
  reviewer_initials VARCHAR(10),
  reviewer_notes TEXT,

  -- Compliance
  is_complete BOOLEAN DEFAULT FALSE,
  completion_checklist JSONB,

  CREATE INDEX idx_wp_comments_engagement ON working_paper_comments(engagement_id);
  CREATE INDEX idx_wp_comments_wp ON working_paper_comments(working_paper_ref);
  CREATE INDEX idx_wp_comments_section ON working_paper_comments(section_id);
);

-- ═════════════════════════════════════════════════════════════════════
-- STAGE-LEVEL COMMENTS
-- Tracks comments at the phase/stage level (planning, risk assessment, etc.)
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE stage_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL,
  phase VARCHAR(50) NOT NULL, -- planning, riskAssessment, interim, finalAudit, completion, reporting
  section_id VARCHAR(100) NOT NULL,
  section_title VARCHAR(255),

  -- Comments array
  comments TEXT[], -- Comma-separated or structured

  created_by_user_id UUID NOT NULL,
  created_by_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Sign-off
  approved_by_user_id UUID,
  approved_at TIMESTAMP,

  CREATE INDEX idx_stage_comments_engagement ON stage_comments(engagement_id);
  CREATE INDEX idx_stage_comments_phase ON stage_comments(phase);
);

-- ═════════════════════════════════════════════════════════════════════
-- COMMENT TEMPLATES (FIRM AND CUSTOM)
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE comment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id VARCHAR(100) UNIQUE NOT NULL,
  engagement_id UUID, -- NULL for firm-wide, specific for custom
  template_name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- procedures, findings, conclusions, representations, etc.
  industry VARCHAR(100), -- construction, manufacturing, etc. - NULL for all
  comment_type VARCHAR(50), -- preparer_notes, exception_found, etc.

  template_text TEXT NOT NULL,
  use_cases TEXT[],
  is_required BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  created_by_user_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CREATE INDEX idx_templates_engagement ON comment_templates(engagement_id);
  CREATE INDEX idx_templates_category ON comment_templates(category);
  CREATE INDEX idx_templates_industry ON comment_templates(industry);
);

-- ═════════════════════════════════════════════════════════════════════
-- COMMENT SUGGESTIONS (SMART SUGGESTIONS ENGINE)
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE comment_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL,
  working_paper_ref VARCHAR(10) NOT NULL,

  -- Trigger context
  trigger_type VARCHAR(100), -- 'exceptions_found', 'high_risk', 'prior_year_issue', etc.
  trigger_context JSONB, -- Context data that triggered suggestion

  -- Suggestion details
  suggested_comment_type VARCHAR(50),
  suggested_template_id VARCHAR(100),
  suggested_priority VARCHAR(50),
  suggestion_message TEXT,

  -- Status
  is_dismissed BOOLEAN DEFAULT FALSE,
  was_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP,
  used_comment_id UUID,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CREATE INDEX idx_suggestions_engagement ON comment_suggestions(engagement_id);
  CREATE INDEX idx_suggestions_wp ON comment_suggestions(working_paper_ref);
  CREATE INDEX idx_suggestions_trigger ON comment_suggestions(trigger_type);
);

-- ═════════════════════════════════════════════════════════════════════
-- COMMENT RESOLUTION TRACKING
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE comment_resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES audit_comments(id) ON DELETE CASCADE,

  resolution_status VARCHAR(50) NOT NULL, -- open, in_progress, resolved, acknowledged, closed
  resolved_by_user_id UUID,
  resolved_at TIMESTAMP,
  resolution_date_deadline TIMESTAMP,
  resolution_notes TEXT,

  -- How was it resolved?
  resolution_type VARCHAR(100), -- adjusted, accepted_risk, process_change, etc.
  resolved_amount_if_exception DECIMAL(15,2),
  quantitative_impact VARCHAR(255),

  -- Audit evidence
  resolution_evidence JSONB, -- linked documents, process changes, etc.

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CREATE INDEX idx_resolutions_comment ON comment_resolutions(comment_id);
  CREATE INDEX idx_resolutions_status ON comment_resolutions(resolution_status);
);

-- ═════════════════════════════════════════════════════════════════════
-- COMMENT NOTIFICATIONS & WORKFLOW
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE comment_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES audit_comments(id) ON DELETE CASCADE,
  notified_user_id UUID NOT NULL,
  notified_user_email VARCHAR(255),

  notification_type VARCHAR(100), -- new_comment, mention, response_needed, deadline, etc.
  notification_message TEXT,

  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  is_acted_upon BOOLEAN DEFAULT FALSE,
  acted_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CREATE INDEX idx_notifications_user ON comment_notifications(notified_user_id);
  CREATE INDEX idx_notifications_comment ON comment_notifications(comment_id);
  CREATE INDEX idx_notifications_read ON comment_notifications(is_read);
);

-- ═════════════════════════════════════════════════════════════════════
-- COMMENT ANALYTICS & METRICS
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE comment_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL,
  analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Comment volume
  total_comments INT,
  by_type JSONB, -- {preparer_notes: X, reviewer_comment: Y, ...}
  by_status JSONB, -- {open: X, resolved: Y, ...}
  by_priority JSONB, -- {routine: X, critical: Y, ...}

  -- WP analysis
  wp_comment_distribution JSONB, -- {D3: 5, D4: 3, ...}
  wp_most_discussed VARCHAR(10),
  wp_least_discussed VARCHAR(10),

  -- Team engagement
  commenters_count INT,
  comments_per_person JSONB, -- {user_id: count, ...}
  reviewer_response_time_avg_hours INT,

  -- Resolution metrics
  avg_resolution_time_hours INT,
  critical_unresolved_count INT,
  resolution_rate_percent DECIMAL(5,2),

  -- Exception tracking
  exceptions_found_count INT,
  exceptions_adjusted INT,
  exceptions_unadjusted INT,
  total_exception_value DECIMAL(15,2),

  CREATE INDEX idx_analytics_engagement ON comment_analytics(engagement_id);
  CREATE INDEX idx_analytics_date ON comment_analytics(analysis_date DESC);
);

-- ═════════════════════════════════════════════════════════════════════
-- ENGAGEMENT COMMENT CONFIGURATION
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE engagement_comment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL UNIQUE,

  -- Custom comment types
  custom_comment_types JSONB,

  -- Workflow configuration
  required_approvals TEXT[], -- ['preparer', 'reviewer', 'manager', 'partner']
  notification_rules JSONB,

  -- Mandatory types
  mandatory_types TEXT[],
  optional_types TEXT[],

  -- Firm templates
  enabled_templates TEXT[],
  custom_templates JSONB,

  -- Compliance rules
  require_critical_response BOOLEAN DEFAULT TRUE,
  critical_response_deadline_hours INT DEFAULT 24,
  require_all_wp_conclusions BOOLEAN DEFAULT TRUE,
  require_exception_quantification BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CREATE INDEX idx_config_engagement ON engagement_comment_config(engagement_id);
);

-- ═════════════════════════════════════════════════════════════════════
-- COMMENT EXPORT LOG
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE comment_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL,
  export_format VARCHAR(50), -- excel, word, pdf, html
  export_type VARCHAR(100), -- full, exceptions_only, summary, etc.

  exported_by_user_id UUID,
  exported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  export_file_url TEXT,
  export_file_name VARCHAR(255),

  -- What was included
  comments_included INT,
  wps_included TEXT[],
  filters_applied JSONB,

  CREATE INDEX idx_exports_engagement ON comment_exports(engagement_id);
  CREATE INDEX idx_exports_date ON comment_exports(exported_at DESC);
);

-- ═════════════════════════════════════════════════════════════════════
-- COMPLIANCE CHECK RESULTS
-- ═════════════════════════════════════════════════════════════════════
CREATE TABLE comment_compliance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL,
  check_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Check results
  check_name VARCHAR(100), -- 'critical_comment_addressed', 'reviewer_responses', etc.
  check_status VARCHAR(50), -- passed, failed, warning
  check_message TEXT,

  -- Issues found
  issues_found INT,
  affected_comments JSONB, -- array of comment IDs with issues
  affected_wps TEXT[],

  remediation_required BOOLEAN,
  remediation_notes TEXT,

  checked_by_user_id UUID,

  CREATE INDEX idx_compliance_engagement ON comment_compliance_checks(engagement_id);
  CREATE INDEX idx_compliance_date ON comment_compliance_checks(check_date DESC);
);

-- ═════════════════════════════════════════════════════════════════════
-- GRANT PERMISSIONS (adjust based on your user roles)
-- ═════════════════════════════════════════════════════════════════════

-- Enable RLS (Row Level Security) if needed
ALTER TABLE audit_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_paper_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies (example - customize based on your org structure)
CREATE POLICY comments_engagement_isolation ON audit_comments
  USING (engagement_id = current_setting('app.engagement_id')::uuid);

CREATE POLICY wp_comments_engagement_isolation ON working_paper_comments
  USING (engagement_id = current_setting('app.engagement_id')::uuid);

-- ═════════════════════════════════════════════════════════════════════
-- SAMPLE DATA TRIGGERS & VIEWS
-- ═════════════════════════════════════════════════════════════════════

-- View: Comments by engagement summary
CREATE VIEW v_comments_by_engagement AS
SELECT
  ac.engagement_id,
  COUNT(ac.id) as total_comments,
  COUNT(CASE WHEN ac.status = 'open' THEN 1 END) as open_comments,
  COUNT(CASE WHEN ac.priority = 'critical' THEN 1 END) as critical_count,
  COUNT(CASE WHEN ac.comment_type = 'exception_found' THEN 1 END) as exceptions_count,
  COUNT(DISTINCT ac.created_by_user_id) as unique_commenters,
  MAX(ac.created_at) as latest_comment_date
FROM audit_comments ac
GROUP BY ac.engagement_id;

-- View: Exception summary by WP
CREATE VIEW v_exceptions_by_wp AS
SELECT
  ac.engagement_id,
  ac.working_paper_ref,
  COUNT(ac.id) as exception_count,
  STRING_AGG(ac.id::text, ', ') as comment_ids,
  COUNT(CASE WHEN ac.status = 'open' THEN 1 END) as unresolved,
  COUNT(CASE WHEN ac.status = 'resolved' THEN 1 END) as resolved
FROM audit_comments ac
WHERE ac.comment_type = 'exception_found'
GROUP BY ac.engagement_id, ac.working_paper_ref;

-- View: Reviewer response times
CREATE VIEW v_reviewer_metrics AS
SELECT
  ac.created_by_user_id as reviewer_id,
  ac.created_by_name as reviewer_name,
  COUNT(ac.id) as comments_made,
  AVG(EXTRACT(EPOCH FROM (ac.updated_at - ac.created_at))/3600) as avg_response_time_hours,
  COUNT(CASE WHEN ac.status = 'resolved' THEN 1 END) as resolved_comments
FROM audit_comments ac
WHERE ac.comment_type = 'reviewer_comment'
GROUP BY ac.created_by_user_id, ac.created_by_name;
