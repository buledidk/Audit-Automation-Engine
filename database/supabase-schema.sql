-- ═══════════════════════════════════════════════════════════════
-- AuditEngine v10 AURA — Supabase Production Schema
-- Tables that match what the frontend actually uses
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. Engagements — top-level audit engagement records
CREATE TABLE IF NOT EXISTS engagements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Unnamed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id),
  org_id TEXT
);

-- 2. Engagement Data — key-value store for all engagement state
-- The StorageEngine writes: cfg, cellData, signOffs, wpNotes, customItems,
-- tbData, tbMappings, uploads, archived, reviewStatus, integrations,
-- signOffLog, reviewNotes, documentLinks, changeLog
CREATE TABLE IF NOT EXISTS engagement_data (
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  state_key TEXT NOT NULL,
  data JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (engagement_id, state_key)
);

-- 3. Documents — file metadata for Supabase Storage uploads
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  wp_id TEXT,
  filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  storage_path TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ  -- soft delete
);

-- 4. Document Links — cross-references between documents and working papers
CREATE TABLE IF NOT EXISTS document_links (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  wp_id TEXT NOT NULL,
  assertion TEXT,
  linked_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Audit Trail — immutable log of all audit actions
CREATE TABLE IF NOT EXISTS audit_trail (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_engagement_data_eng ON engagement_data(engagement_id);
CREATE INDEX IF NOT EXISTS idx_documents_eng ON documents(engagement_id);
CREATE INDEX IF NOT EXISTS idx_documents_wp ON documents(engagement_id, wp_id);
CREATE INDEX IF NOT EXISTS idx_document_links_doc ON document_links(document_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_eng ON audit_trail(engagement_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_time ON audit_trail(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Engagement-level isolation: users only see their org's data
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- For initial single-user setup: allow authenticated users full access
-- Replace these with org-level policies when multi-tenant is needed

CREATE POLICY "Users can manage their own engagements"
  ON engagements FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can access their engagement data"
  ON engagement_data FOR ALL
  USING (
    engagement_id IN (
      SELECT id FROM engagements WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

CREATE POLICY "Users can access their documents"
  ON documents FOR ALL
  USING (
    engagement_id IN (
      SELECT id FROM engagements WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

CREATE POLICY "Users can access their document links"
  ON document_links FOR ALL
  USING (
    document_id IN (
      SELECT d.id FROM documents d
      JOIN engagements e ON d.engagement_id = e.id
      WHERE e.user_id = auth.uid() OR e.user_id IS NULL
    )
  );

CREATE POLICY "Users can access their audit trail"
  ON audit_trail FOR ALL
  USING (
    engagement_id IN (
      SELECT id FROM engagements WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- STORAGE BUCKET (run separately in Supabase Dashboard → Storage)
-- Create bucket: audit-documents
-- Policy: Authenticated users can upload/download
-- ═══════════════════════════════════════════════════════════════
-- INSERT INTO storage.buckets (id, name, public) VALUES ('audit-documents', 'audit-documents', false);
