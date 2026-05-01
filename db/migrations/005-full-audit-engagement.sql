-- ═══════════════════════════════════════════════════════════════════
-- MIGRATION 005: FULL AUDIT ENGAGEMENT PLATFORM
-- Firms, Partner Management, Engagement Lifecycle, ML Learning Tables
-- Run in Supabase SQL editor or via migration tool
-- ═══════════════════════════════════════════════════════════════════

-- ─── FIRMS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  registration_number TEXT,
  address JSONB DEFAULT '{}',
  regulatory_body TEXT DEFAULT 'ICAEW',
  subscription_tier TEXT DEFAULT 'professional',
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── FIRM USERS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS firm_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('partner','engagement_manager','senior_auditor','junior_auditor','admin')),
  qualifications TEXT[] DEFAULT '{}',
  signing_authority BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(firm_id, email)
);

-- ─── FIRM ENGAGEMENTS (enhanced) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS firm_engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id),
  partner_id UUID REFERENCES firm_users(id),
  manager_id UUID REFERENCES firm_users(id),
  client_name TEXT NOT NULL,
  client_registration TEXT,
  industry TEXT NOT NULL DEFAULT 'other',
  sector TEXT,
  framework TEXT NOT NULL DEFAULT 'frs102',
  entity_size TEXT NOT NULL DEFAULT 'small',
  year_end DATE NOT NULL,
  period_start DATE,
  period_end DATE,
  status TEXT NOT NULL DEFAULT 'acceptance'
    CHECK (status IN ('acceptance','planning','interim','final','completion','post_engagement','complete','declined')),
  stage_data JSONB DEFAULT '{}',
  -- Materiality
  materiality NUMERIC(15,2),
  performance_materiality NUMERIC(15,2),
  trivial_threshold NUMERIC(15,2),
  materiality_basis TEXT,
  materiality_percentage NUMERIC(5,4),
  -- Risk & opinion
  risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low','medium','high','significant')),
  going_concern TEXT DEFAULT 'no_material_uncertainty'
    CHECK (going_concern IN ('no_material_uncertainty','material_uncertainty_disclosed','material_uncertainty_not_disclosed','going_concern_doubt')),
  opinion_type TEXT DEFAULT 'unmodified'
    CHECK (opinion_type IN ('unmodified','qualified','adverse','disclaimer','emphasis_of_matter','other_matter')),
  engagement_type TEXT DEFAULT 'statutory'
    CHECK (engagement_type IN ('statutory','non_statutory','group','pie','listed_pie')),
  is_listed BOOLEAN DEFAULT false,
  is_group BOOLEAN DEFAULT false,
  is_pie BOOLEAN DEFAULT false,
  -- Client financial data
  prior_year_figures JSONB DEFAULT '{}',
  current_year_figures JSONB DEFAULT '{}',
  client_details JSONB DEFAULT '{}',
  -- Stage-specific data
  acceptance_checklist JSONB DEFAULT '{}',
  independence_assessment JSONB DEFAULT '{}',
  planning_data JSONB DEFAULT '{}',
  risk_matrix JSONB DEFAULT '{}',
  completion_data JSONB DEFAULT '{}',
  -- Timestamps
  accepted_at TIMESTAMPTZ,
  planning_completed_at TIMESTAMPTZ,
  interim_completed_at TIMESTAMPTZ,
  final_completed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── ENGAGEMENT TEAM ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS engagement_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES firm_engagements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES firm_users(id),
  role TEXT NOT NULL,
  assigned_sections TEXT[] DEFAULT '{}',
  assigned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(engagement_id, user_id)
);

-- ─── AUDIT FILES (working papers) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES firm_engagements(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  fsli TEXT,
  stage TEXT NOT NULL,
  title TEXT NOT NULL,
  ref_code TEXT,
  content JSONB DEFAULT '{}',
  procedures JSONB DEFAULT '[]',
  findings JSONB DEFAULT '[]',
  cross_references JSONB DEFAULT '[]',
  documentation JSONB DEFAULT '{}',
  analytics_results JSONB DEFAULT '{}',
  status TEXT DEFAULT 'not_started'
    CHECK (status IN ('not_started','in_progress','prepared','reviewed','approved','signed_off')),
  risk_level TEXT CHECK (risk_level IN ('low','medium','high','significant')),
  prepared_by UUID REFERENCES firm_users(id),
  prepared_date TIMESTAMPTZ,
  reviewed_by UUID REFERENCES firm_users(id),
  reviewed_date TIMESTAMPTZ,
  approved_by UUID REFERENCES firm_users(id),
  approved_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── ML: ENGAGEMENT HISTORY ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ml_engagement_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID REFERENCES firm_engagements(id),
  firm_id UUID REFERENCES firms(id),
  industry TEXT NOT NULL,
  entity_size TEXT NOT NULL,
  framework TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  materiality_basis TEXT,
  materiality_amount NUMERIC(15,2),
  procedures_applied JSONB DEFAULT '[]',
  findings_by_fsli JSONB DEFAULT '{}',
  anomalies_detected JSONB DEFAULT '[]',
  opinion_type TEXT,
  going_concern_conclusion TEXT,
  year_end DATE,
  partner_judgments JSONB DEFAULT '{}',
  effective_procedures JSONB DEFAULT '[]',
  outcome_score NUMERIC(3,2) DEFAULT 1.0,
  total_findings INTEGER DEFAULT 0,
  total_misstatements NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── ML: RISK PATTERNS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ml_risk_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  risk_type TEXT NOT NULL,
  fsli TEXT NOT NULL,
  assertion TEXT NOT NULL,
  frequency NUMERIC(5,4) DEFAULT 0.50,
  weight NUMERIC(5,4) DEFAULT 1.00,
  description TEXT,
  sample_finding TEXT,
  isa_reference TEXT,
  accounting_standard TEXT,
  last_updated TIMESTAMPTZ DEFAULT now(),
  engagement_count INTEGER DEFAULT 0
);

-- ─── ML: PROCEDURE EFFECTIVENESS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS ml_procedure_effectiveness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id TEXT NOT NULL,
  procedure_name TEXT NOT NULL,
  fsli TEXT NOT NULL,
  industry TEXT,
  risk_level TEXT,
  times_applied INTEGER DEFAULT 0,
  findings_caught INTEGER DEFAULT 0,
  false_positives INTEGER DEFAULT 0,
  effectiveness_score NUMERIC(5,4) DEFAULT 0.50,
  avg_time_hours NUMERIC(6,2),
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- ─── ML: STANDARD UPDATES REGISTRY ───────────────────────────────────
CREATE TABLE IF NOT EXISTS ml_standard_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_code TEXT NOT NULL,
  standard_name TEXT NOT NULL,
  effective_date DATE NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('new','amendment','clarification','withdrawal')),
  change_summary TEXT NOT NULL,
  affected_procedures TEXT[] DEFAULT '{}',
  affected_fsli TEXT[] DEFAULT '{}',
  is_applied BOOLEAN DEFAULT false,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── ML: ANOMALY PATTERNS (industry ratio baselines) ─────────────────
CREATE TABLE IF NOT EXISTS ml_anomaly_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  ratio_name TEXT NOT NULL,
  ratio_key TEXT NOT NULL,
  benchmark_mean NUMERIC(10,4),
  benchmark_std NUMERIC(10,4),
  benchmark_min NUMERIC(10,4),
  benchmark_max NUMERIC(10,4),
  percentile_25 NUMERIC(10,4),
  percentile_75 NUMERIC(10,4),
  flag_threshold_low NUMERIC(10,4),
  flag_threshold_high NUMERIC(10,4),
  data_points INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- ─── FINDINGS REGISTER (cross-reference hub) ─────────────────────────
CREATE TABLE IF NOT EXISTS findings_register (
  id TEXT PRIMARY KEY,
  engagement_id UUID NOT NULL REFERENCES firm_engagements(id) ON DELETE CASCADE,
  source_section TEXT NOT NULL,
  source_procedure TEXT,
  finding_type TEXT NOT NULL CHECK (finding_type IN ('misstatement','control_deficiency','risk_indicator','disclosure_issue','limitation')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(15,2),
  amount_type TEXT CHECK (amount_type IN ('likely','possible','nil')),
  is_adjusted BOOLEAN DEFAULT false,
  isa_reference TEXT,
  assertion TEXT[] DEFAULT '{}',
  risk_level TEXT,
  affected_sections TEXT[] DEFAULT '{}',
  cross_reference_reasons JSONB DEFAULT '{}',
  management_response TEXT,
  auditor_assessment TEXT,
  recommendation TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','adjusted','passed','escalated','closed')),
  prepared_by UUID REFERENCES firm_users(id),
  prepared_date TIMESTAMPTZ DEFAULT now(),
  working_paper_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── JOURNAL ENTRY TESTING ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS je_testing_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES firm_engagements(id) ON DELETE CASCADE,
  run_date TIMESTAMPTZ DEFAULT now(),
  total_entries INTEGER DEFAULT 0,
  flagged_entries INTEGER DEFAULT 0,
  benford_chi_square NUMERIC(10,4),
  benford_p_value NUMERIC(10,6),
  benford_conforming BOOLEAN,
  high_risk_flags JSONB DEFAULT '[]',
  medium_risk_flags JSONB DEFAULT '[]',
  duplicates_found JSONB DEFAULT '[]',
  split_transactions JSONB DEFAULT '[]',
  summary JSONB DEFAULT '{}',
  created_by UUID REFERENCES firm_users(id)
);

-- ─── DCF MODELS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dcf_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES firm_engagements(id) ON DELETE CASCADE,
  model_type TEXT NOT NULL CHECK (model_type IN ('going_concern','impairment','ecl','lease','fair_value')),
  purpose TEXT,
  assumptions JSONB DEFAULT '{}',
  cash_flows JSONB DEFAULT '[]',
  results JSONB DEFAULT '{}',
  sensitivity_matrix JSONB DEFAULT '{}',
  wacc NUMERIC(6,4),
  terminal_growth_rate NUMERIC(6,4),
  discount_rate NUMERIC(6,4),
  conclusion TEXT,
  prepared_by UUID REFERENCES firm_users(id),
  reviewed_by UUID REFERENCES firm_users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_firm_users_firm_id ON firm_users(firm_id);
CREATE INDEX IF NOT EXISTS idx_firm_users_user_id ON firm_users(user_id);
CREATE INDEX IF NOT EXISTS idx_firm_engagements_firm_id ON firm_engagements(firm_id);
CREATE INDEX IF NOT EXISTS idx_firm_engagements_partner_id ON firm_engagements(partner_id);
CREATE INDEX IF NOT EXISTS idx_firm_engagements_status ON firm_engagements(status);
CREATE INDEX IF NOT EXISTS idx_engagement_team_engagement ON engagement_team(engagement_id);
CREATE INDEX IF NOT EXISTS idx_engagement_team_user ON engagement_team(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_files_engagement ON audit_files(engagement_id);
CREATE INDEX IF NOT EXISTS idx_audit_files_section ON audit_files(section);
CREATE INDEX IF NOT EXISTS idx_audit_files_stage ON audit_files(stage);
CREATE INDEX IF NOT EXISTS idx_findings_engagement ON findings_register(engagement_id);
CREATE INDEX IF NOT EXISTS idx_findings_source ON findings_register(source_section);
CREATE INDEX IF NOT EXISTS idx_ml_risk_industry ON ml_risk_patterns(industry, fsli);
CREATE INDEX IF NOT EXISTS idx_ml_anomaly_industry ON ml_anomaly_patterns(industry, ratio_key);
CREATE INDEX IF NOT EXISTS idx_ml_proc_fsli ON ml_procedure_effectiveness(fsli, industry);

-- ═══════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE firm_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE firm_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings_register ENABLE ROW LEVEL SECURITY;

-- Firms: users can only see their own firm
CREATE POLICY "Users see own firm" ON firms
  FOR ALL USING (
    id IN (SELECT firm_id FROM firm_users WHERE user_id = auth.uid() AND is_active = true)
  );

-- Firm users: can see users in same firm
CREATE POLICY "Users see team members" ON firm_users
  FOR ALL USING (
    firm_id IN (SELECT firm_id FROM firm_users WHERE user_id = auth.uid() AND is_active = true)
  );

-- Engagements: partner sees all in firm, others see assigned only
CREATE POLICY "Engagement access by role" ON firm_engagements
  FOR ALL USING (
    -- Partner: sees all firm engagements
    (firm_id IN (SELECT firm_id FROM firm_users WHERE user_id = auth.uid() AND role = 'partner' AND is_active = true))
    OR
    -- Others: only assigned engagements
    (id IN (SELECT engagement_id FROM engagement_team
            JOIN firm_users fu ON engagement_team.user_id = fu.id
            WHERE fu.user_id = auth.uid() AND fu.is_active = true))
    OR
    -- Partner/Manager directly assigned
    (partner_id IN (SELECT id FROM firm_users WHERE user_id = auth.uid()))
    OR
    (manager_id IN (SELECT id FROM firm_users WHERE user_id = auth.uid()))
  );

-- Audit files: team members only
CREATE POLICY "Audit file access" ON audit_files
  FOR ALL USING (
    engagement_id IN (
      SELECT fe.id FROM firm_engagements fe
      WHERE
        fe.firm_id IN (SELECT firm_id FROM firm_users WHERE user_id = auth.uid() AND role = 'partner' AND is_active = true)
        OR fe.id IN (SELECT et.engagement_id FROM engagement_team et JOIN firm_users fu ON et.user_id = fu.id WHERE fu.user_id = auth.uid())
        OR fe.partner_id IN (SELECT id FROM firm_users WHERE user_id = auth.uid())
        OR fe.manager_id IN (SELECT id FROM firm_users WHERE user_id = auth.uid())
    )
  );

-- Findings: same as audit files
CREATE POLICY "Findings access" ON findings_register
  FOR ALL USING (
    engagement_id IN (
      SELECT fe.id FROM firm_engagements fe
      WHERE
        fe.firm_id IN (SELECT firm_id FROM firm_users WHERE user_id = auth.uid() AND role = 'partner' AND is_active = true)
        OR fe.id IN (SELECT et.engagement_id FROM engagement_team et JOIN firm_users fu ON et.user_id = fu.id WHERE fu.user_id = auth.uid())
        OR fe.partner_id IN (SELECT id FROM firm_users WHERE user_id = auth.uid())
        OR fe.manager_id IN (SELECT id FROM firm_users WHERE user_id = auth.uid())
    )
  );

-- ML tables: read-only for all authenticated users, write via service_role
CREATE POLICY "ML read access" ON ml_risk_patterns FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ML anomaly read" ON ml_anomaly_patterns FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ML proc read" ON ml_procedure_effectiveness FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ML std read" ON ml_standard_updates FOR SELECT USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════════════
-- SEED DATA: ML RISK PATTERNS BY INDUSTRY
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO ml_risk_patterns (industry, risk_type, fsli, assertion, frequency, weight, description, isa_reference, accounting_standard) VALUES
-- MANUFACTURING
('manufacturing','revenue_recognition','revenue','Cutoff',0.72,1.5,'Revenue cutoff risk high at year end — goods in transit, delivery terms','ISA 315','IFRS 15 / FRS 102 s23'),
('manufacturing','inventory_valuation','inventory','Valuation',0.68,1.4,'Inventory obsolescence and NRV risk in manufacturing','ISA 501','IAS 2 / FRS 102 s13'),
('manufacturing','ppe_impairment','ppe','Valuation',0.55,1.2,'Plant and equipment impairment indicators from market decline','ISA 315','IAS 36 / FRS 102 s27'),
('manufacturing','related_party','related_parties','Completeness',0.61,1.3,'Related party transactions between parent and subsidiaries in supply chain','ISA 550','IAS 24'),
('manufacturing','going_concern','going_concern','Appropriateness',0.48,1.6,'Going concern risk from commodity price exposure and contract concentration','ISA 570','FRS 102 s3'),
('manufacturing','payroll','payroll','Accuracy',0.45,1.0,'Overtime and shift premium payroll complexity','ISA 330','IAS 19 / FRS 102 s28'),
('manufacturing','provisions','provisions','Completeness',0.52,1.2,'Warranty provisions and onerous contract provisions common','ISA 540','IAS 37 / FRS 102 s21'),
-- RETAIL
('retail','revenue_recognition','revenue','Occurrence',0.78,1.6,'Returns and refund provisions, gift card redemption, loyalty points','ISA 315','IFRS 15 / FRS 102 s23'),
('retail','inventory_valuation','inventory','Valuation',0.82,1.7,'Slow-moving and obsolete inventory, NRV below cost risk','ISA 501','IAS 2 / FRS 102 s13'),
('retail','inventory_completeness','inventory','Completeness',0.70,1.5,'Shrinkage risk, theft, inventory count accuracy','ISA 501','IAS 2 / FRS 102 s13'),
('retail','leases','leases','Completeness',0.88,1.4,'High volume of property leases under IFRS 16 — completeness critical','ISA 315','IFRS 16 / FRS 102 s20'),
('retail','going_concern','going_concern','Appropriateness',0.55,1.5,'Retail sector pressure from e-commerce competition, footfall decline','ISA 570','FRS 102 s3'),
('retail','related_party','related_parties','Disclosure',0.44,1.1,'Franchise arrangements and supplier rebates','ISA 550','IAS 24'),
-- CONSTRUCTION
('construction','revenue_recognition','revenue','Accuracy',0.85,1.8,'Percentage completion revenue — estimation risk very high','ISA 540','IFRS 15 / FRS 102 s23'),
('construction','provisions','provisions','Completeness',0.79,1.7,'Onerous contracts, penalty clauses, defect provisions','ISA 540','IAS 37 / FRS 102 s21'),
('construction','ppe_existence','ppe','Existence',0.62,1.2,'Equipment across multiple sites — existence risk','ISA 501','IAS 16 / FRS 102 s17'),
('construction','going_concern','going_concern','Appropriateness',0.71,1.8,'Construction industry high insolvency rate — going concern always significant','ISA 570','FRS 102 s3'),
('construction','related_party','related_parties','Completeness',0.67,1.4,'Subcontractor relationships with directors or connected parties','ISA 550','IAS 24'),
('construction','fraud_risk','revenue','Occurrence',0.58,1.6,'Contract manipulation and overbilling risk','ISA 240','IFRS 15'),
-- PROFESSIONAL SERVICES
('professional_services','revenue_recognition','revenue','Cutoff',0.74,1.5,'WIP valuation and time-based revenue recognition','ISA 315','IFRS 15 / FRS 102 s23'),
('professional_services','related_party','related_parties','Completeness',0.55,1.2,'Partner drawings, related party firms','ISA 550','IAS 24'),
('professional_services','payroll','payroll','Accuracy',0.68,1.3,'Variable pay, bonuses, LLP profit allocations','ISA 330','IAS 19'),
('professional_services','trade_debtors','trade_debtors','Valuation',0.71,1.4,'Long debtor days, fee disputes, WIP recoverability','ISA 330','IFRS 9 / FRS 102 s11'),
('professional_services','intangibles','intangibles','Valuation',0.49,1.1,'Purchased client lists, goodwill on acquisition','ISA 315','IAS 38 / FRS 102 s18'),
-- TECHNOLOGY
('technology','revenue_recognition','revenue','Accuracy',0.88,1.9,'Multi-element arrangements, SaaS subscriptions, licence vs service split','ISA 540','IFRS 15'),
('technology','intangibles','intangibles','Valuation',0.82,1.8,'R&D capitalisation criteria, development costs under IAS 38','ISA 315','IAS 38 / FRS 102 s18'),
('technology','going_concern','going_concern','Appropriateness',0.62,1.6,'Burn rate, cash runway, VC funding dependency','ISA 570','FRS 102 s3'),
('technology','related_party','related_parties','Completeness',0.58,1.3,'Founder loans, option schemes, connected entities','ISA 550','IAS 24'),
('technology','provisions','provisions','Completeness',0.55,1.2,'Refund liabilities, service level agreement penalties','ISA 540','IAS 37'),
-- FINANCIAL SERVICES
('financial_services','ecl_provisions','trade_debtors',  'Valuation',0.91,2.0,'ECL model accuracy critical — IFRS 9 Stage 1/2/3 classification','ISA 540','IFRS 9'),
('financial_services','fair_value','financial_instruments','Valuation',0.88,1.9,'Fair value Level 2/3 instruments — significant estimation','ISA 540','IFRS 9 / IFRS 13'),
('financial_services','revenue_recognition','revenue','Accuracy',0.79,1.7,'Fee income recognition, effective interest rate method','ISA 315','IFRS 15 / IFRS 9'),
('financial_services','related_party','related_parties','Completeness',0.72,1.5,'Director loans, connected counterparties, group transactions','ISA 550','IAS 24'),
-- CHARITY
('charity','income_recognition','revenue','Completeness',0.76,1.6,'Grant conditions, restricted vs unrestricted funds, legacy income','ISA 315','Charities SORP'),
('charity','going_concern','going_concern','Appropriateness',0.65,1.5,'Funding dependency, reserve levels, recurring deficit risk','ISA 570','FRS 102 s3'),
('charity','related_party','related_parties','Completeness',0.71,1.4,'Trustee transactions, connected organisations','ISA 550','IAS 24'),
('charity','payroll','payroll','Accuracy',0.58,1.2,'Volunteer vs employed distinction, pension auto-enrolment','ISA 330','FRS 102 s28');

-- ═══════════════════════════════════════════════════════════════════════
-- SEED DATA: ML ANOMALY PATTERNS (UK SME BENCHMARKS BY INDUSTRY)
-- Benchmarks sourced from FAME database averages, adjusted for UK SMEs
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO ml_anomaly_patterns (industry, ratio_name, ratio_key, benchmark_mean, benchmark_std, benchmark_min, benchmark_max, percentile_25, percentile_75, flag_threshold_low, flag_threshold_high, data_points) VALUES
-- MANUFACTURING
('manufacturing','Gross Margin %','gross_margin',0.280,0.080,0.050,0.650,0.220,0.340,0.100,0.500,450),
('manufacturing','Operating Margin %','operating_margin',0.072,0.045,0.000,0.200,0.035,0.105,0.000,0.180,450),
('manufacturing','Current Ratio','current_ratio',1.62,0.42,0.80,3.50,1.30,1.90,0.90,3.00,450),
('manufacturing','Quick Ratio','quick_ratio',0.98,0.35,0.30,2.50,0.72,1.20,0.50,2.20,450),
('manufacturing','Debt to Equity','debt_to_equity',0.85,0.52,0.00,3.50,0.42,1.20,0.00,2.80,450),
('manufacturing','Asset Turnover','asset_turnover',0.92,0.38,0.30,2.80,0.65,1.15,0.40,2.20,450),
('manufacturing','Inventory Days','inventory_days',58.2,22.0,10.0,150.0,42.0,72.0,15.0,120.0,450),
('manufacturing','Debtor Days','debtor_days',48.5,18.0,15.0,110.0,35.0,60.0,20.0,95.0,450),
('manufacturing','Creditor Days','creditor_days',42.8,16.0,15.0,90.0,32.0,52.0,20.0,80.0,450),
('manufacturing','Interest Coverage','interest_coverage',5.8,3.2,1.0,25.0,3.2,7.8,1.5,20.0,380),
-- RETAIL
('retail','Gross Margin %','gross_margin',0.342,0.095,0.080,0.750,0.260,0.420,0.120,0.650,520),
('retail','Operating Margin %','operating_margin',0.048,0.038,0.000,0.180,0.018,0.072,0.000,0.150,520),
('retail','Current Ratio','current_ratio',1.18,0.38,0.50,2.80,0.88,1.42,0.60,2.50,520),
('retail','Quick Ratio','quick_ratio',0.42,0.25,0.10,1.80,0.25,0.58,0.15,1.50,520),
('retail','Inventory Days','inventory_days',72.5,28.0,20.0,180.0,52.0,88.0,25.0,150.0,520),
('retail','Debtor Days','debtor_days',12.8,8.0,1.0,45.0,6.0,18.0,2.0,40.0,520),
('retail','Creditor Days','creditor_days',38.5,15.0,10.0,80.0,28.0,48.0,15.0,70.0,520),
-- CONSTRUCTION
('construction','Gross Margin %','gross_margin',0.195,0.072,0.050,0.450,0.135,0.250,0.080,0.400,380),
('construction','Operating Margin %','operating_margin',0.055,0.042,0.000,0.200,0.022,0.082,0.000,0.170,380),
('construction','Current Ratio','current_ratio',1.45,0.48,0.60,3.20,1.08,1.78,0.70,2.80,380),
('construction','Debtor Days','debtor_days',62.5,22.0,20.0,130.0,46.0,76.0,25.0,110.0,380),
('construction','Creditor Days','creditor_days',55.8,20.0,20.0,110.0,40.0,68.0,25.0,90.0,380),
-- PROFESSIONAL SERVICES
('professional_services','Gross Margin %','gross_margin',0.485,0.112,0.200,0.800,0.385,0.572,0.250,0.750,340),
('professional_services','Operating Margin %','operating_margin',0.158,0.068,0.020,0.420,0.102,0.208,0.025,0.380,340),
('professional_services','Debtor Days','debtor_days',52.2,20.0,10.0,120.0,38.0,64.0,15.0,100.0,340),
('professional_services','Current Ratio','current_ratio',1.52,0.45,0.60,3.50,1.18,1.82,0.70,3.00,340),
-- TECHNOLOGY
('technology','Gross Margin %','gross_margin',0.652,0.148,0.100,0.950,0.520,0.780,0.150,0.920,280),
('technology','Operating Margin %','operating_margin',0.092,0.112,0.000,0.450,0.018,0.165,0.000,0.400,280),
('technology','Current Ratio','current_ratio',2.12,0.78,0.80,6.00,1.55,2.65,0.90,5.00,280),
('technology','Debtor Days','debtor_days',44.8,18.0,10.0,95.0,32.0,56.0,15.0,85.0,280),
-- FINANCIAL SERVICES
('financial_services','Return on Equity','return_on_equity',0.112,0.058,0.000,0.350,0.068,0.152,0.010,0.300,220),
('financial_services','Net Interest Margin','net_interest_margin',0.028,0.012,0.005,0.085,0.018,0.038,0.008,0.072,220),
-- CHARITY
('charity','Operating Surplus %','operating_margin',0.022,0.045,0.000,0.150,0.000,0.042,0.000,0.120,180),
('charity','Free Reserves Cover (months)','reserves_cover',5.2,3.0,0.0,24.0,2.8,7.5,1.0,18.0,180);

-- ═══════════════════════════════════════════════════════════════════════
-- SEED DATA: STANDARD UPDATES REGISTRY
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO ml_standard_updates (standard_code, standard_name, effective_date, change_type, change_summary, affected_procedures, affected_fsli) VALUES
('ISA-240-2023','ISA 240 (Revised) - Fraud','2023-12-15','amendment','Enhanced requirements for fraud risk assessment including specific procedures for journal entry testing and management override','{"JE-001","JE-002","FRAUD-001"}','{"revenue","trade_debtors","payroll"}'),
('ISA-315-2021','ISA 315 (Revised 2019) - Risk Assessment','2021-01-01','amendment','Revised risk assessment standard — new control components, IT risks, spectrum of risk','{"PLAN-001","RISK-001","RISK-002"}','{"planning","risk_assessment"}'),
('IFRS-16-2019','IFRS 16 - Leases','2019-01-01','new','New standard requiring recognition of all leases on balance sheet — ROU asset and lease liability','{"LEASE-001","LEASE-002","LEASE-003"}','{"leases","ppe"}'),
('IFRS-9-2018','IFRS 9 - Financial Instruments','2018-01-01','new','Expected credit loss model replaces incurred loss model for financial assets','{"ECL-001","ECL-002","FI-001"}','{"trade_debtors","financial_instruments"}'),
('FRS-102-2026','FRS 102 (2026 Periodic Review)','2026-01-01','amendment','Updated UK GAAP with IFRS 15 and IFRS 16 alignment — revenue and leases','{"REV-001","LEASE-001"}','{"revenue","leases"}'),
('ISA-570-2019','ISA 570 (Revised) - Going Concern','2019-12-15','amendment','Enhanced going concern procedures — auditor responsibility clarified','{"GC-001","GC-002","GC-003"}','{"going_concern"}'),
('ISQM-1-2022','ISQM 1 - Quality Management','2022-12-15','new','Replaced ISQC 1 — firm-wide quality management system requirements','{}','{}'),
('ISQM-2-2022','ISQM 2 - Engagement Quality Reviews','2022-12-15','new','New standard for engagement quality reviews — replaced hot reviews','{"EQR-001"}','{"completion"}');

-- ═══════════════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_firms_updated_at BEFORE UPDATE ON firms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_firm_users_updated_at BEFORE UPDATE ON firm_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_firm_engagements_updated_at BEFORE UPDATE ON firm_engagements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audit_files_updated_at BEFORE UPDATE ON audit_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_findings_updated_at BEFORE UPDATE ON findings_register FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
