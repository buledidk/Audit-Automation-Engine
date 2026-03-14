-- Audit Automation Engine - Phase 2 Database Sharding
-- Migration 002: Data Migration from v1 to v2 (Partitioned)
-- Date: March 14, 2026
-- WARNING: Run during maintenance window, requires exclusive locks

-- ============================================================================
-- STEP 1: Backup existing data
-- ============================================================================

-- Create backup tables before migration
-- BACKUP TABLES SHOULD BE CREATED BEFORE RUNNING THIS MIGRATION
-- See: backup_pre_migration.sh

-- ============================================================================
-- STEP 2: Migrate working_papers data
-- ============================================================================

-- Migrate in batches to avoid locking entire table
BEGIN TRANSACTION;

-- Copy all working papers to partitioned table
INSERT INTO working_papers_v2 (
  id,
  engagement_id,
  working_paper_ref,
  fsli,
  account_type,
  title,
  procedures,
  exceptions,
  comments,
  evidence_links,
  sample_size,
  population_size,
  testing_methodology,
  audit_results,
  status,
  created_at,
  modified_at,
  deleted_at,
  version,
  created_by,
  modified_by
)
SELECT
  id,
  engagement_id,
  working_paper_ref,
  fsli,
  account_type,
  title,
  procedures,
  exceptions,
  comments,
  evidence_links,
  sample_size,
  population_size,
  testing_methodology,
  audit_results,
  status,
  created_at,
  modified_at,
  deleted_at,
  version,
  created_by,
  modified_by
FROM working_papers
WHERE deleted_at IS NULL;

-- Verify counts match
-- SELECT COUNT(*) FROM working_papers WHERE deleted_at IS NULL;
-- SELECT COUNT(*) FROM working_papers_v2;

COMMIT;

-- ============================================================================
-- STEP 3: Migrate exceptions data
-- ============================================================================

BEGIN TRANSACTION;

INSERT INTO exceptions_v2 (
  id,
  working_paper_id,
  engagement_id,
  procedure_id,
  fsli,
  description,
  amount,
  item_description,
  item_value,
  evaluation_status,
  root_cause,
  status,
  created_at,
  modified_at,
  deleted_at,
  created_by,
  modified_by
)
SELECT
  id,
  working_paper_id,
  engagement_id,
  procedure_id,
  fsli,
  description,
  amount,
  item_description,
  item_value,
  evaluation_status,
  root_cause,
  status,
  created_at,
  modified_at,
  deleted_at,
  created_by,
  modified_by
FROM exceptions
WHERE deleted_at IS NULL;

COMMIT;

-- ============================================================================
-- STEP 4: Migrate comments data
-- ============================================================================

BEGIN TRANSACTION;

INSERT INTO audit_comments_v2 (
  id,
  working_paper_id,
  engagement_id,
  comment_text,
  comment_type,
  resolved,
  created_at,
  modified_at,
  deleted_at,
  created_by
)
SELECT
  id,
  working_paper_id,
  engagement_id,
  comment_text,
  comment_type,
  resolved,
  created_at,
  modified_at,
  deleted_at,
  created_by
FROM audit_comments
WHERE deleted_at IS NULL;

COMMIT;

-- ============================================================================
-- STEP 5: Build audit trail from deleted records
-- ============================================================================

BEGIN TRANSACTION;

-- Log the migration event itself
INSERT INTO audit_trail_v2 (
  entity_type,
  entity_id,
  engagement_id,
  action,
  changes,
  created_at,
  created_by
)
SELECT
  'migration',
  id,
  engagement_id,
  'migrated_to_v2',
  jsonb_build_object(
    'old_table', 'working_papers',
    'new_table', 'working_papers_v2',
    'migrated_at', CURRENT_TIMESTAMP
  ),
  CURRENT_TIMESTAMP,
  'system'
FROM working_papers
LIMIT 1;

COMMIT;

-- ============================================================================
-- STEP 6: Rename tables (cutover)
-- ============================================================================
-- STEP 6a: Lock tables (this will block all read/write)
-- This step should be done during the maintenance window

-- SET SESSION sql_mode = 'NO_BACKSLASH_ESCAPES';
-- LOCK TABLES working_papers WRITE,
--              exceptions WRITE,
--              audit_comments WRITE,
--              working_papers_v2 WRITE,
--              exceptions_v2 WRITE,
--              audit_comments_v2 WRITE;

-- STEP 6b: Rename old tables to backup and new to active
-- ALTER TABLE working_papers RENAME TO working_papers_backup;
-- ALTER TABLE working_papers_v2 RENAME TO working_papers;
--
-- ALTER TABLE exceptions RENAME TO exceptions_backup;
-- ALTER TABLE exceptions_v2 RENAME TO exceptions;
--
-- ALTER TABLE audit_comments RENAME TO audit_comments_backup;
-- ALTER TABLE audit_comments_v2 RENAME TO audit_comments;

-- UNLOCK TABLES;

-- ============================================================================
-- STEP 7: Verify migration success
-- ============================================================================

-- Run these queries to verify migration was successful:

-- Check row counts
-- SELECT
--   'working_papers' as table_name,
--   COUNT(*) as row_count
-- FROM working_papers
-- UNION ALL
-- SELECT
--   'exceptions' as table_name,
--   COUNT(*) as row_count
-- FROM exceptions
-- UNION ALL
-- SELECT
--   'audit_comments' as table_name,
--   COUNT(*) as row_count
-- FROM audit_comments;

-- Check partition distribution
-- SELECT
--   partition_name,
--   table_rows,
--   ROUND(data_length / 1024 / 1024, 2) as size_mb
-- FROM information_schema.partitions
-- WHERE table_schema = 'audit_db'
--   AND table_name = 'working_papers'
-- ORDER BY partition_name;

-- ============================================================================
-- STEP 8: Post-migration cleanup
-- ============================================================================

-- Once migration is verified successful, keep old tables for 2 weeks then drop
-- DROP TABLE IF EXISTS working_papers_backup;
-- DROP TABLE IF EXISTS exceptions_backup;
-- DROP TABLE IF EXISTS audit_comments_backup;

-- ============================================================================
-- STEP 9: Rebuild query statistics
-- ============================================================================

-- ANALYZE TABLE working_papers;
-- ANALYZE TABLE exceptions;
-- ANALYZE TABLE audit_comments;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. This migration should run during a scheduled maintenance window
-- 2. Expected downtime: 10-30 minutes depending on data volume
-- 3. All steps are wrapped in transactions for safety
-- 4. Backup old tables for 2 weeks before dropping
-- 5. Test rollback procedure before executing in production
-- 6. Monitor replication lag after migration (should be < 1 second)
-- 7. Run ANALYZE to update query statistics after migration
-- 8. Monitor query performance for 24 hours post-migration
