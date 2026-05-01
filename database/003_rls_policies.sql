-- ============================================================================
-- 003_rls_policies.sql
-- Comprehensive Row Level Security (RLS) Policies for Audit-Engine
-- ============================================================================
--
-- HOW RLS WORKS IN THIS APPLICATION:
--
--   - The backend / server connects with the `service_role` key, which
--     BYPASSES RLS entirely.  This is intentional: server-side logic already
--     enforces authorization before touching the database.
--
--   - The frontend (Supabase client) connects with the `anon` key, which
--     RESPECTS RLS.  Every query made from the browser is filtered by the
--     policies defined below.
--
-- IDEMPOTENCY:
--   Every CREATE POLICY is preceded by a DROP POLICY IF EXISTS so this file
--   can be re-run safely during development and CI migrations.
--
-- ============================================================================


-- ############################################################################
-- PHASE A  --  Read-only reference / lookup tables
-- ############################################################################
-- These tables contain system-wide configuration that every authenticated
-- user is allowed to read but never modify from the client side.
-- ############################################################################

-- ---------- jurisdiction_config ----------

ALTER TABLE jurisdiction_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read jurisdictions" ON jurisdiction_config;
CREATE POLICY "Authenticated users can read jurisdictions"
  ON jurisdiction_config FOR SELECT
  TO authenticated
  USING (true);

-- ---------- framework_config ----------

ALTER TABLE framework_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read frameworks" ON framework_config;
CREATE POLICY "Authenticated users can read frameworks"
  ON framework_config FOR SELECT
  TO authenticated
  USING (true);

-- ---------- procedure_templates ----------

ALTER TABLE procedure_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read procedure templates" ON procedure_templates;
CREATE POLICY "Authenticated users can read procedure templates"
  ON procedure_templates FOR SELECT
  TO authenticated
  USING (true);


-- ############################################################################
-- PHASE B  --  Organization-scoped tables
-- ############################################################################
-- Access is restricted to rows belonging to organizations the requesting
-- user is a member of.  A helper function resolves the list of org IDs.
-- ############################################################################

-- ---- Helper: get_user_org_ids() -------------------------------------------
-- Returns every organization_id the currently authenticated user belongs to.
-- SECURITY DEFINER so it can read user_organizations regardless of RLS on
-- that table (avoids circular dependency).
-- STABLE because the result does not change within a single statement.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_user_org_ids()
RETURNS SETOF INTEGER AS $$
  SELECT uo.organization_id
  FROM user_organizations uo
  JOIN users u ON u.id = uo.user_id
  WHERE u.auth_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ==========================================================================
-- B-1  Tables with a direct `organization_id` column
-- ==========================================================================

-- ---------- entities ----------

ALTER TABLE entities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view entities in own org" ON entities;
CREATE POLICY "Users can view entities in own org"
  ON entities FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS "Users can create entities in own org" ON entities;
CREATE POLICY "Users can create entities in own org"
  ON entities FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS "Users can update entities in own org" ON entities;
CREATE POLICY "Users can update entities in own org"
  ON entities FOR UPDATE
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

-- ---------- engagements ----------

ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own org engagements" ON engagements;
CREATE POLICY "Users can view own org engagements"
  ON engagements FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS "Users can create engagements in own org" ON engagements;
CREATE POLICY "Users can create engagements in own org"
  ON engagements FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS "Users can update own org engagements" ON engagements;
CREATE POLICY "Users can update own org engagements"
  ON engagements FOR UPDATE
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));


-- ==========================================================================
-- B-2  Tables linked via engagement_id -> engagements.organization_id
-- ==========================================================================

-- ---------- procedures ----------

ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view procedures in own org" ON procedures;
CREATE POLICY "Users can view procedures in own org"
  ON procedures FOR SELECT
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can create procedures in own org" ON procedures;
CREATE POLICY "Users can create procedures in own org"
  ON procedures FOR INSERT
  TO authenticated
  WITH CHECK (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can update procedures in own org" ON procedures;
CREATE POLICY "Users can update procedures in own org"
  ON procedures FOR UPDATE
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

-- ---------- evidence ----------

ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view evidence in own org" ON evidence;
CREATE POLICY "Users can view evidence in own org"
  ON evidence FOR SELECT
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can create evidence in own org" ON evidence;
CREATE POLICY "Users can create evidence in own org"
  ON evidence FOR INSERT
  TO authenticated
  WITH CHECK (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can update evidence in own org" ON evidence;
CREATE POLICY "Users can update evidence in own org"
  ON evidence FOR UPDATE
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can delete evidence in own org" ON evidence;
CREATE POLICY "Users can delete evidence in own org"
  ON evidence FOR DELETE
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

-- ---------- findings ----------

ALTER TABLE findings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view findings in own org" ON findings;
CREATE POLICY "Users can view findings in own org"
  ON findings FOR SELECT
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can create findings in own org" ON findings;
CREATE POLICY "Users can create findings in own org"
  ON findings FOR INSERT
  TO authenticated
  WITH CHECK (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can update findings in own org" ON findings;
CREATE POLICY "Users can update findings in own org"
  ON findings FOR UPDATE
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

-- ---------- risk_assessments ----------

ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view risk assessments in own org" ON risk_assessments;
CREATE POLICY "Users can view risk assessments in own org"
  ON risk_assessments FOR SELECT
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can create risk assessments in own org" ON risk_assessments;
CREATE POLICY "Users can create risk assessments in own org"
  ON risk_assessments FOR INSERT
  TO authenticated
  WITH CHECK (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can update risk assessments in own org" ON risk_assessments;
CREATE POLICY "Users can update risk assessments in own org"
  ON risk_assessments FOR UPDATE
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

-- ---------- working_papers ----------

ALTER TABLE working_papers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view working papers in own org" ON working_papers;
CREATE POLICY "Users can view working papers in own org"
  ON working_papers FOR SELECT
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can create working papers in own org" ON working_papers;
CREATE POLICY "Users can create working papers in own org"
  ON working_papers FOR INSERT
  TO authenticated
  WITH CHECK (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can update working papers in own org" ON working_papers;
CREATE POLICY "Users can update working papers in own org"
  ON working_papers FOR UPDATE
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

-- ---------- reports ----------

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view reports in own org" ON reports;
CREATE POLICY "Users can view reports in own org"
  ON reports FOR SELECT
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can create reports in own org" ON reports;
CREATE POLICY "Users can create reports in own org"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can update reports in own org" ON reports;
CREATE POLICY "Users can update reports in own org"
  ON reports FOR UPDATE
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

-- ---------- comments ----------

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view comments in own org" ON comments;
CREATE POLICY "Users can view comments in own org"
  ON comments FOR SELECT
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can create comments in own org" ON comments;
CREATE POLICY "Users can create comments in own org"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can update comments in own org" ON comments;
CREATE POLICY "Users can update comments in own org"
  ON comments FOR UPDATE
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can delete comments in own org" ON comments;
CREATE POLICY "Users can delete comments in own org"
  ON comments FOR DELETE
  TO authenticated
  USING (engagement_id IN (SELECT id FROM engagements WHERE organization_id IN (SELECT get_user_org_ids())));


-- ############################################################################
-- PHASE C  --  Sensitive / special-case tables
-- ############################################################################

-- ---------- users ----------

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth_id = auth.uid());

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth_id = auth.uid());

-- ---------- user_organizations ----------

ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;

-- Users can see memberships in their orgs
DROP POLICY IF EXISTS "Users can view org memberships" ON user_organizations;
CREATE POLICY "Users can view org memberships"
  ON user_organizations FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

-- ---------- organizations ----------

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own organizations" ON organizations;
CREATE POLICY "Users can view own organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS "Users can update own organizations" ON organizations;
CREATE POLICY "Users can update own organizations"
  ON organizations FOR UPDATE
  TO authenticated
  USING (id IN (SELECT get_user_org_ids()));

-- ---------- org_settings ----------

ALTER TABLE org_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own org settings" ON org_settings;
CREATE POLICY "Users can view own org settings"
  ON org_settings FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

DROP POLICY IF EXISTS "Users can update own org settings" ON org_settings;
CREATE POLICY "Users can update own org settings"
  ON org_settings FOR UPDATE
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

-- ---------- audit_log ----------

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- All authenticated users can insert audit log entries
DROP POLICY IF EXISTS "Authenticated users can insert audit log" ON audit_log;
CREATE POLICY "Authenticated users can insert audit log"
  ON audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can view audit logs for their org
DROP POLICY IF EXISTS "Users can view own org audit log" ON audit_log;
CREATE POLICY "Users can view own org audit log"
  ON audit_log FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

-- ---------- entity_contacts ----------

ALTER TABLE entity_contacts ENABLE ROW LEVEL SECURITY;

-- Scoped via entity -> organization
DROP POLICY IF EXISTS "Users can view entity contacts in own org" ON entity_contacts;
CREATE POLICY "Users can view entity contacts in own org"
  ON entity_contacts FOR SELECT
  TO authenticated
  USING (entity_id IN (SELECT id FROM entities WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can manage entity contacts in own org" ON entity_contacts;
CREATE POLICY "Users can manage entity contacts in own org"
  ON entity_contacts FOR INSERT
  TO authenticated
  WITH CHECK (entity_id IN (SELECT id FROM entities WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can update entity contacts in own org" ON entity_contacts;
CREATE POLICY "Users can update entity contacts in own org"
  ON entity_contacts FOR UPDATE
  TO authenticated
  USING (entity_id IN (SELECT id FROM entities WHERE organization_id IN (SELECT get_user_org_ids())));

DROP POLICY IF EXISTS "Users can delete entity contacts in own org" ON entity_contacts;
CREATE POLICY "Users can delete entity contacts in own org"
  ON entity_contacts FOR DELETE
  TO authenticated
  USING (entity_id IN (SELECT id FROM entities WHERE organization_id IN (SELECT get_user_org_ids())));


-- ============================================================================
-- END OF RLS POLICIES
-- ============================================================================
