#!/usr/bin/env node
/**
 * Database Deployment Script
 * Runs schema migrations, seeds reference data, applies RLS policies,
 * and creates the initial admin user.
 *
 * Usage:
 *   node scripts/deploy-database.js [--sql-only] [--seed-only] [--admin-only]
 *
 * Requires these env vars (set in .env.local or pass directly):
 *   SUPABASE_URL               — Project URL (or VITE_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY   — Service role key (bypasses RLS)
 *   DATABASE_URL                — Direct Postgres connection string
 *
 * Optional:
 *   SUPABASE_JWT_SECRET         — JWT secret (for Vercel env reminder)
 *
 * Get credentials from: Supabase Dashboard → Settings → API / Database
 */

import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// ============================================================================
// ENV LOADING
// ============================================================================

const envPath = resolve(rootDir, '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
} catch { /* no .env.local */ }

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

// Parse CLI flags
const args = process.argv.slice(2);
const sqlOnly = args.includes('--sql-only');
const seedOnly = args.includes('--seed-only');
const adminOnly = args.includes('--admin-only');
const runAll = !sqlOnly && !seedOnly && !adminOnly;

// ============================================================================
// VALIDATE CONFIG
// ============================================================================

if (!supabaseUrl) {
  console.error('Missing SUPABASE_URL (or VITE_SUPABASE_URL).');
  console.error('Add to .env.local: SUPABASE_URL=https://mbvjtondgunckgzrmyhq.supabase.co');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY.');
  console.error('');
  console.error('To find your service role key:');
  console.error('  1. Go to https://supabase.com/dashboard/project/mbvjtondgunckgzrmyhq/settings/api');
  console.error('  2. Copy "service_role" key (under "Project API keys" -> Reveal)');
  console.error('  3. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=eyJ...');
  process.exit(1);
}

if ((runAll || sqlOnly) && !databaseUrl) {
  console.error('Missing DATABASE_URL for schema/RLS deployment.');
  console.error('');
  console.error('To find your database connection string:');
  console.error('  1. Go to https://supabase.com/dashboard/project/mbvjtondgunckgzrmyhq/settings/database');
  console.error('  2. Under "Connection string" -> URI, copy the connection string');
  console.error('  3. Replace [YOUR-PASSWORD] with your database password');
  console.error('  4. Add to .env.local: DATABASE_URL=postgresql://postgres.[ref]:[password]@...');
  console.error('');
  console.error('Or run with --seed-only or --admin-only to skip DDL operations.');
  process.exit(1);
}

// ============================================================================
// CLIENTS
// ============================================================================

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

let pgClient = null;

async function connectPg() {
  if (!databaseUrl) return null;
  pgClient = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await pgClient.connect();
  return pgClient;
}

async function execSQL(sql) {
  if (!pgClient) throw new Error('No pg connection. Set DATABASE_URL.');
  await pgClient.query(sql);
}

// ============================================================================
// STEP 1: Run Schema SQL (via pg)
// ============================================================================

async function runSchemaSQL() {
  console.log('\n--- Step 1: Schema migration (001_deploy_schema.sql) ---');

  const sqlFile = resolve(rootDir, 'database', '001_deploy_schema.sql');
  let sql;
  try {
    sql = readFileSync(sqlFile, 'utf8');
  } catch {
    console.error(`  Could not read ${sqlFile}`);
    process.exit(1);
  }

  await execSQL(sql);
  console.log('  Done: tables, indexes, views, triggers, RLS enabled');
}

// ============================================================================
// STEP 2: Seed Reference Data (via Supabase client for idempotency checks)
// ============================================================================

async function seedReferenceData() {
  console.log('\n--- Step 2: Seed reference data ---');

  // Check if already seeded
  const { data: existing, error: checkErr } = await supabase
    .from('jurisdiction_config')
    .select('jurisdiction_code')
    .limit(1);

  if (checkErr) {
    console.error('  Could not query jurisdiction_config:', checkErr.message);
    console.error('  Have you run the schema migration first? (Step 1)');
    return false;
  }

  if (existing?.length > 0) {
    console.log('  Already seeded (jurisdiction_config has rows). Skipping.');
    return true;
  }

  // If we have a pg connection, use the SQL file (ON CONFLICT DO NOTHING)
  if (pgClient) {
    const sqlFile = resolve(rootDir, 'database', '002_seed_reference_data.sql');
    try {
      const sql = readFileSync(sqlFile, 'utf8');
      await execSQL(sql);
      console.log('  Done via SQL file (5 jurisdictions, 3 frameworks, 13 templates)');
      return true;
    } catch (err) {
      console.error('  SQL file seed failed:', err.message);
      console.log('  Falling back to Supabase client inserts...');
    }
  }

  // Fallback: use Supabase client inserts
  const jurisdictions = [
    { jurisdiction_code: 'UK', jurisdiction_name: 'United Kingdom', region: 'Europe', primary_framework: 'FRS102', secondary_frameworks: '["IFRS"]', audit_exemption_threshold: 10200000.00, accounts_filing_months: 9, materiality_guidance: '{"profit_basis": 0.05, "revenue_basis": 0.01, "assets_basis": 0.01}', key_regulations: '["Companies Act 2006", "Listing Rules"]', entity_types: '["Limited Company", "Charity", "Cooperative"]' },
    { jurisdiction_code: 'DE', jurisdiction_name: 'Germany', region: 'Europe', primary_framework: 'IFRS', secondary_frameworks: '["HGB"]', audit_exemption_threshold: 12000000.00, accounts_filing_months: 12, materiality_guidance: '{"profit_basis": 0.05, "revenue_basis": 0.01, "assets_basis": 0.02}', key_regulations: '["HGB", "German Commercial Code"]', entity_types: '["GmbH", "AG", "KG"]' },
    { jurisdiction_code: 'FR', jurisdiction_name: 'France', region: 'Europe', primary_framework: 'IFRS', secondary_frameworks: '["French GAAP"]', audit_exemption_threshold: 8000000.00, accounts_filing_months: 6, materiality_guidance: '{"profit_basis": 0.05, "revenue_basis": 0.01, "assets_basis": 0.02}', key_regulations: '["French Commercial Code"]', entity_types: '["SA", "SAS", "SARL"]' },
    { jurisdiction_code: 'IT', jurisdiction_name: 'Italy', region: 'Europe', primary_framework: 'IFRS', secondary_frameworks: '["Italian GAAP"]', audit_exemption_threshold: 8800000.00, accounts_filing_months: 4, materiality_guidance: '{"profit_basis": 0.05, "revenue_basis": 0.01, "assets_basis": 0.02}', key_regulations: '["Italian Civil Code"]', entity_types: '["SpA", "Srl"]' },
    { jurisdiction_code: 'ES', jurisdiction_name: 'Spain', region: 'Europe', primary_framework: 'IFRS', secondary_frameworks: '["Spanish GAAP"]', audit_exemption_threshold: 5700000.00, accounts_filing_months: 6, materiality_guidance: '{"profit_basis": 0.05, "revenue_basis": 0.01, "assets_basis": 0.02}', key_regulations: '["Spanish Commercial Code"]', entity_types: '["SA", "SL"]' }
  ];

  const { error: jErr } = await supabase.from('jurisdiction_config').insert(jurisdictions);
  if (jErr) { console.error('  Jurisdiction seed failed:', jErr.message); return false; }
  console.log('  5 jurisdictions seeded');

  const frameworks = [
    { framework_code: 'FRS102', framework_name: 'FRS 102 - The Financial Reporting Standard', description: 'UK and Republic of Ireland financial reporting standard for entities not applying EU-adopted IFRS', applicable_jurisdictions: '["UK"]', is_active: true },
    { framework_code: 'IFRS', framework_name: 'International Financial Reporting Standards', description: 'Global accounting standards issued by the IASB, mandatory for listed companies in many jurisdictions', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', is_active: true },
    { framework_code: 'IFRS_SME', framework_name: 'IFRS for Small and Medium-sized Entities', description: 'Simplified version of IFRS designed for non-publicly accountable entities', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', is_active: true }
  ];

  const { error: fErr } = await supabase.from('framework_config').insert(frameworks);
  if (fErr) { console.error('  Framework seed failed:', fErr.message); return false; }
  console.log('  3 frameworks seeded');

  const templates = [
    { procedure_code: 'REV-001', procedure_name: 'Revenue Recognition Testing', fsli: 'Revenue', assertion: 'Occurrence', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'MAX(25, SQRT(population) * risk_factor)', estimated_hours: 8, required_evidence: '["Sales invoices", "Contracts", "Delivery notes", "Sales ledger"]', is_active: true },
    { procedure_code: 'REV-002', procedure_name: 'Revenue Cut-off Testing', fsli: 'Revenue', assertion: 'Cut-off', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'MAX(15, days_around_year_end * 3)', estimated_hours: 6, required_evidence: '["Sales invoices around year-end", "Goods dispatched notes", "Credit notes"]', is_active: true },
    { procedure_code: 'REC-001', procedure_name: 'Receivables Circularization', fsli: 'Receivables', assertion: 'Existence', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'MAX(10, total_debtors * 0.8 / materiality)', estimated_hours: 10, required_evidence: '["Confirmation letters", "Aged receivables listing", "Subsequent receipts"]', is_active: true },
    { procedure_code: 'REC-002', procedure_name: 'Receivables Impairment Review', fsli: 'Receivables', assertion: 'Valuation', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'ALL items > materiality + sample of remainder', estimated_hours: 4, required_evidence: '["Aged receivables listing", "Credit reports", "Historical write-off data"]', is_active: true },
    { procedure_code: 'INV-001', procedure_name: 'Inventory Count Observation', fsli: 'Inventory', assertion: 'Existence', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'MAX(20, locations * 10)', estimated_hours: 12, required_evidence: '["Count sheets", "Inventory listing", "Reconciliation to GL"]', is_active: true },
    { procedure_code: 'INV-002', procedure_name: 'Inventory Valuation Testing', fsli: 'Inventory', assertion: 'Valuation', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'MAX(15, SQRT(population) * 2)', estimated_hours: 8, required_evidence: '["Purchase invoices", "Costing records", "NRV analysis"]', is_active: true },
    { procedure_code: 'FA-001', procedure_name: 'Fixed Asset Additions Testing', fsli: 'Fixed Assets', assertion: 'Occurrence', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'ALL items > materiality + sample of 15', estimated_hours: 6, required_evidence: '["Purchase invoices", "Asset register", "Board minutes for approvals"]', is_active: true },
    { procedure_code: 'FA-002', procedure_name: 'Depreciation Recalculation', fsli: 'Fixed Assets', assertion: 'Accuracy', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'Recalculate ALL asset categories', estimated_hours: 4, required_evidence: '["Asset register", "Depreciation policy", "Useful life assessments"]', is_active: true },
    { procedure_code: 'PAY-001', procedure_name: 'Payables Completeness Testing', fsli: 'Payables', assertion: 'Completeness', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'MAX(20, suppliers_count * 0.1)', estimated_hours: 8, required_evidence: '["Supplier statements", "Aged payables listing", "Subsequent payments"]', is_active: true },
    { procedure_code: 'PAY-002', procedure_name: 'Accruals Testing', fsli: 'Payables', assertion: 'Completeness', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'ALL items > trivial + sample of 10', estimated_hours: 6, required_evidence: '["Accruals schedule", "Supporting invoices", "Prior year comparison"]', is_active: true },
    { procedure_code: 'CASH-001', procedure_name: 'Bank Reconciliation Review', fsli: 'Cash', assertion: 'Existence', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'ALL bank accounts', estimated_hours: 3, required_evidence: '["Bank statements", "Bank confirmations", "Reconciliations"]', is_active: true },
    { procedure_code: 'PAY-003', procedure_name: 'Payroll Testing', fsli: 'Staff Costs', assertion: 'Accuracy', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'MAX(5, employees * 0.05)', estimated_hours: 6, required_evidence: '["Payroll reports", "Employment contracts", "P60/P45 certificates"]', is_active: true },
    { procedure_code: 'TAX-001', procedure_name: 'Tax Computation Review', fsli: 'Tax', assertion: 'Accuracy', applicable_frameworks: '["FRS102", "IFRS", "IFRS_SME"]', applicable_jurisdictions: '["UK", "DE", "FR", "IT", "ES"]', sample_size_formula: 'Full review', estimated_hours: 5, required_evidence: '["Tax computation", "Tax returns", "Deferred tax workings"]', is_active: true },
  ];

  const { error: tErr } = await supabase.from('procedure_templates').insert(templates);
  if (tErr) { console.error('  Template seed failed:', tErr.message); return false; }
  console.log(`  ${templates.length} procedure templates seeded`);

  console.log('  Done: reference data seeded');
  return true;
}

// ============================================================================
// STEP 3: Apply RLS Policies (via pg)
// ============================================================================

async function applyRLSPolicies() {
  console.log('\n--- Step 3: RLS policies (003_rls_policies.sql) ---');

  const sqlFile = resolve(rootDir, 'database', '003_rls_policies.sql');
  let sql;
  try {
    sql = readFileSync(sqlFile, 'utf8');
  } catch {
    console.error(`  Could not read ${sqlFile}`);
    process.exit(1);
  }

  await execSQL(sql);
  console.log('  Done: helper function, Phase A/B/C policies applied');
}

// ============================================================================
// STEP 4: Create Initial Admin User (via Supabase client)
// ============================================================================

async function createAdminUser() {
  console.log('\n--- Step 4: Admin user ---');

  const adminEmail = 'admin@auditengine.app';
  const adminPassword = 'AuditEngine2026!';

  // Check if admin already exists (use service_role — bypasses RLS)
  const { data: existingUsers } = await supabase
    .from('users')
    .select('id, email, auth_id')
    .eq('email', adminEmail)
    .limit(1);

  if (existingUsers?.length > 0) {
    console.log(`  Admin already exists: ${adminEmail} (id=${existingUsers[0].id})`);
    return true;
  }

  // Create Supabase Auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { first_name: 'Admin', last_name: 'User' }
  });

  if (authError) {
    console.error('  Auth user creation failed:', authError.message);
    return false;
  }

  const authId = authData.user.id;
  console.log(`  Auth user created: ${authId}`);

  // Create organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: 'AuditEngine Demo Firm',
      country_code: 'UK',
      jurisdiction: 'UK',
      subscription_level: 'professional',
      max_users: 100,
      max_engagements: 1000
    })
    .select()
    .single();

  if (orgError && orgError.code !== '23505') {
    console.error('  Org creation failed:', orgError.message);
    return false;
  }

  // If duplicate, fetch existing org
  let orgId = org?.id;
  if (!orgId) {
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('name', 'AuditEngine Demo Firm')
      .single();
    orgId = existingOrg?.id;
  }

  console.log(`  Organization: id=${orgId}`);

  // Create user profile
  const { data: userProfile, error: userError } = await supabase
    .from('users')
    .insert({
      auth_id: authId,
      email: adminEmail,
      password_hash: '(managed by Supabase Auth)',
      first_name: 'Admin',
      last_name: 'User',
      title: 'Audit Partner',
      status: 'active'
    })
    .select()
    .single();

  if (userError) {
    console.error('  User profile creation failed:', userError.message);
    return false;
  }

  console.log(`  User profile created: id=${userProfile.id}`);

  // Link user to org
  if (orgId) {
    const { error: linkError } = await supabase
      .from('user_organizations')
      .insert({
        user_id: userProfile.id,
        organization_id: orgId,
        role: 'admin'
      });

    if (linkError) {
      console.error('  User-org link failed:', linkError.message);
    } else {
      console.log(`  User linked to org ${orgId} as admin`);
    }
  }

  console.log('');
  console.log('  +-------------------------------------------+');
  console.log('  |  Admin Login Credentials                   |');
  console.log(`  |  Email:    ${adminEmail}        |`);
  console.log(`  |  Password: ${adminPassword}          |`);
  console.log('  |  CHANGE THIS PASSWORD AFTER FIRST LOGIN    |');
  console.log('  +-------------------------------------------+');

  return true;
}

// ============================================================================
// STEP 5: Vercel env var reminder
// ============================================================================

function printVercelReminder() {
  console.log('\n--- Step 5: Vercel environment variables ---');

  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  if (jwtSecret) {
    console.log('  JWT secret is set locally.');
  } else {
    console.log('  SUPABASE_JWT_SECRET not set locally.');
  }

  console.log('');
  console.log('  Ensure these are populated in Vercel (not empty):');
  console.log('    SUPABASE_SERVICE_ROLE_KEY');
  console.log('    SUPABASE_JWT_SECRET');
  console.log('    POSTGRES_PASSWORD');
  console.log('');
  console.log('  Set via CLI:');
  console.log('    vercel env add SUPABASE_SERVICE_ROLE_KEY production');
  console.log('    vercel env add SUPABASE_JWT_SECRET production');
  console.log('  Or: Vercel Dashboard -> auditengine -> Settings -> Env Variables');
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('============================================================');
  console.log('  AuditEngine Database Deployment');
  console.log('  Phase 2: Database & Cloud Infrastructure');
  console.log('============================================================');
  console.log(`Project: ${supabaseUrl}`);
  console.log(`Mode:    ${runAll ? 'full' : args.filter(a => a.startsWith('--')).join(', ')}`);
  console.log(`pg:      ${databaseUrl ? 'yes (DATABASE_URL set)' : 'no (DDL will be skipped)'}`);

  try {
    // Verify Supabase connection
    const { error } = await supabase.from('jurisdiction_config').select('jurisdiction_code').limit(1);
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
    console.log('\nConnected to Supabase.');

    // Connect pg if available
    if (databaseUrl && (runAll || sqlOnly)) {
      await connectPg();
      console.log('Connected to Postgres (direct).');
    }

    // Run steps based on flags
    if (runAll || sqlOnly) {
      await runSchemaSQL();
    }

    if (runAll || seedOnly) {
      await seedReferenceData();
    }

    if (runAll || sqlOnly) {
      await applyRLSPolicies();
    }

    if (runAll || adminOnly) {
      await createAdminUser();
    }

    if (runAll) {
      printVercelReminder();
    }

    console.log('\n============================================================');
    console.log('  Deployment complete.');
    console.log('============================================================');
    console.log('');
    console.log('Verify in Supabase SQL Editor:');
    console.log('  SELECT count(*) FROM jurisdiction_config;  -- expect 5');
    console.log('  SELECT count(*) FROM framework_config;     -- expect 3');
    console.log('  SELECT count(*) FROM procedure_templates;  -- expect 13');
    console.log('  SELECT count(*) FROM users;                -- expect 1');
    console.log('  SELECT auth_id FROM users LIMIT 1;         -- expect UUID');

  } catch (error) {
    console.error('\nDeployment failed:', error.message);
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('Check your DATABASE_URL connection string.');
    }
    process.exit(1);
  } finally {
    if (pgClient) {
      await pgClient.end();
    }
  }
}

main();
