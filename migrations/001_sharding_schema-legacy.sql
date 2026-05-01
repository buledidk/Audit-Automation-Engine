-- Audit Automation Engine - Phase 2 Database Sharding
-- Migration 001: Partitioning Schema Setup
-- Date: March 14, 2026
-- Status: Ready for Production

-- ============================================================================
-- STEP 1: Create partitioned working_papers table
-- ============================================================================

CREATE TABLE IF NOT EXISTS working_papers_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL,
  working_paper_ref VARCHAR(50) NOT NULL,
  fsli VARCHAR(100),
  account_type VARCHAR(50),
  title TEXT,
  procedures JSONB DEFAULT '[]'::jsonb,
  exceptions JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  evidence_links TEXT[],
  sample_size INT,
  population_size INT,
  testing_methodology VARCHAR(50),
  audit_results TEXT,
  status VARCHAR(20) DEFAULT 'Draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  version INT DEFAULT 1,
  created_by VARCHAR(100),
  modified_by VARCHAR(100),
  CONSTRAINT pk_working_papers_v2 PRIMARY KEY (id)
)
PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p2027 VALUES LESS THAN (2028),
  PARTITION future VALUES LESS THAN MAXVALUE
);

-- ============================================================================
-- STEP 2: Create indexes on working_papers_v2
-- ============================================================================

CREATE INDEX idx_wp_engagement ON working_papers_v2(engagement_id, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_wp_ref ON working_papers_v2(engagement_id, working_paper_ref)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_wp_status ON working_papers_v2(status, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_wp_active ON working_papers_v2(deleted_at, engagement_id);

-- Full-text search index (if supported by database)
-- CREATE INDEX idx_wp_search ON working_papers_v2 USING GIN (
--   to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(procedures::text, ''))
-- );

-- ============================================================================
-- STEP 3: Create partitioned exceptions table
-- ============================================================================

CREATE TABLE IF NOT EXISTS exceptions_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  working_paper_id UUID NOT NULL,
  engagement_id UUID NOT NULL,
  procedure_id VARCHAR(50),
  fsli VARCHAR(100),
  description TEXT NOT NULL,
  amount DECIMAL(15, 2),
  item_description TEXT,
  item_value DECIMAL(15, 2),
  evaluation_status VARCHAR(20) DEFAULT 'Pending',
  root_cause TEXT,
  status VARCHAR(20) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  created_by VARCHAR(100),
  modified_by VARCHAR(100),
  CONSTRAINT pk_exceptions_v2 PRIMARY KEY (id),
  CONSTRAINT fk_exceptions_wp FOREIGN KEY (working_paper_id)
    REFERENCES working_papers_v2(id) ON DELETE CASCADE
)
PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p2027 VALUES LESS THAN (2028),
  PARTITION future VALUES LESS THAN MAXVALUE
);

-- ============================================================================
-- STEP 4: Create indexes on exceptions_v2
-- ============================================================================

CREATE INDEX idx_exc_wp ON exceptions_v2(working_paper_id)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_exc_engagement ON exceptions_v2(engagement_id, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_exc_status ON exceptions_v2(status, evaluation_status, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_exc_amount ON exceptions_v2(engagement_id, amount DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_exc_active ON exceptions_v2(deleted_at, engagement_id);

-- ============================================================================
-- STEP 5: Create audit_comments partitioned table
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_comments_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  working_paper_id UUID NOT NULL,
  engagement_id UUID NOT NULL,
  comment_text TEXT NOT NULL,
  comment_type VARCHAR(20) DEFAULT 'General',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  created_by VARCHAR(100),
  CONSTRAINT pk_comments_v2 PRIMARY KEY (id),
  CONSTRAINT fk_comments_wp FOREIGN KEY (working_paper_id)
    REFERENCES working_papers_v2(id) ON DELETE CASCADE
)
PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p2027 VALUES LESS THAN (2028),
  PARTITION future VALUES LESS THAN MAXVALUE
);

CREATE INDEX idx_comments_wp ON audit_comments_v2(working_paper_id)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_comments_engagement ON audit_comments_v2(engagement_id, created_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- STEP 6: Create audit trail table (non-partitioned, but indexed)
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_trail_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  engagement_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  changes JSONB,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100),
  ip_address VARCHAR(45)
);

CREATE INDEX idx_audit_entity ON audit_trail_v2(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_engagement ON audit_trail_v2(engagement_id, created_at DESC);
CREATE INDEX idx_audit_timestamp ON audit_trail_v2(created_at DESC);

-- ============================================================================
-- STEP 7: Create backup/recovery tracking table
-- ============================================================================

CREATE TABLE IF NOT EXISTS backup_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_name VARCHAR(100) NOT NULL UNIQUE,
  backup_type VARCHAR(20) NOT NULL,
  table_name VARCHAR(100),
  partition_name VARCHAR(100),
  backup_path TEXT,
  backup_size BIGINT,
  backup_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  restore_timestamp TIMESTAMP,
  status VARCHAR(20) DEFAULT 'Pending',
  checksum VARCHAR(64),
  notes TEXT
);

CREATE INDEX idx_backup_status ON backup_tracking(status, backup_timestamp DESC);
CREATE INDEX idx_backup_table ON backup_tracking(table_name, partition_name);

-- ============================================================================
-- STEP 8: Verify partitioning
-- ============================================================================

-- These queries help verify the partitioning is working correctly:

-- View partition information:
-- SELECT
--   table_schema,
--   table_name,
--   partition_name,
--   partition_expression,
--   partition_description,
--   partition_ordinal_position
-- FROM information_schema.partitions
-- WHERE table_schema = 'public'
--   AND table_name IN ('working_papers_v2', 'exceptions_v2', 'audit_comments_v2')
-- ORDER BY table_name, partition_ordinal_position;

-- ============================================================================
-- STEP 9: Grant appropriate permissions
-- ============================================================================

-- GRANT SELECT, INSERT, UPDATE, DELETE ON working_papers_v2 TO audit_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON exceptions_v2 TO audit_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON audit_comments_v2 TO audit_user;
-- GRANT SELECT ON audit_trail_v2 TO audit_user;
-- GRANT SELECT, DELETE ON backup_tracking TO admin_user;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Run this script during a maintenance window
-- 2. Verify all partitions exist before data migration
-- 3. Test indexes with sample queries before production
-- 4. Monitor partition sizes with the provided queries
-- 5. Add new partitions annually (e.g., p2028 in December 2027)
-- 6. Consider archiving old partitions (p2023, p2024) after 2-3 years
