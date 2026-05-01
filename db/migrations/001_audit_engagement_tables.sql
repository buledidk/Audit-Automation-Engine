-- ═══════════════════════════════════════════════════════════════════
-- AuditEngine — Full Engagement Schema
-- 10 tables with Row Level Security (RLS)
-- Supabase / PostgreSQL 14+
-- ═══════════════════════════════════════════════════════════════════

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── 1. FIRMS ────────────────────────────────────────────────────────────────

create table if not exists public.firms (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  registration_no text,
  address         jsonb,                     -- { line1, line2, city, postcode, country }
  phone           text,
  email           text,
  website         text,
  logo_url        text,
  frc_registered  boolean default false,
  icaew_member    boolean default false,
  acca_member     boolean default false,
  subscription_tier text default 'free',     -- free | professional | enterprise
  settings        jsonb default '{}',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.firms enable row level security;

create policy "Firms are viewable by firm members"
  on public.firms for select
  using (id in (select firm_id from public.firm_users where user_id = auth.uid()));

create policy "Firms can be updated by firm admins"
  on public.firms for update
  using (id in (select firm_id from public.firm_users where user_id = auth.uid() and role = 'admin'));

-- ─── 2. FIRM USERS ───────────────────────────────────────────────────────────

create table if not exists public.firm_users (
  id          uuid primary key default uuid_generate_v4(),
  firm_id     uuid not null references public.firms(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'auditor',   -- admin | partner | manager | auditor | reviewer
  display_name text,
  job_title   text,
  email       text,
  permissions jsonb default '{}',
  active      boolean default true,
  created_at  timestamptz default now(),
  unique(firm_id, user_id)
);

alter table public.firm_users enable row level security;

create policy "Users can view their own firm membership"
  on public.firm_users for select
  using (user_id = auth.uid() or firm_id in (
    select firm_id from public.firm_users where user_id = auth.uid() and role in ('admin', 'partner', 'manager')
  ));

create policy "Admins can manage firm users"
  on public.firm_users for all
  using (firm_id in (select firm_id from public.firm_users where user_id = auth.uid() and role = 'admin'));

-- ─── 3. ENGAGEMENTS ──────────────────────────────────────────────────────────

create table if not exists public.engagements (
  id                    uuid primary key default uuid_generate_v4(),
  firm_id               uuid not null references public.firms(id) on delete cascade,
  client_name           text not null,
  client_number         text,
  company_registration  text,
  sic_code              text,
  industry              text,
  year_end              date not null,
  reporting_period_from date,
  reporting_period_to   date,
  framework             text default 'FRS 102',  -- FRS 102 | IFRS | FRS 105 | UKGAAP
  entity_type           text default 'private',  -- private | public | charity | llp | partnership
  engagement_type       text default 'statutory_audit',
  status                text default 'planning', -- planning | fieldwork | review | complete | signed
  risk_level            text default 'medium',   -- low | medium | high
  -- Materiality
  overall_materiality       numeric,
  performance_materiality   numeric,
  trivial_threshold         numeric,
  materiality_benchmark     text,
  materiality_basis         text,
  -- Financials (current year)
  revenue               numeric,
  total_assets          numeric,
  profit_before_tax     numeric,
  gross_profit          numeric,
  equity                numeric,
  -- Prior year
  prior_revenue         numeric,
  prior_total_assets    numeric,
  prior_pbt             numeric,
  -- Flags
  is_group              boolean default false,
  is_listed             boolean default false,
  going_concern_flag    boolean default false,
  fraud_risk_flag       boolean default false,
  first_year            boolean default false,
  -- Dates
  planned_start         date,
  planned_completion    date,
  actual_start          date,
  actual_completion     date,
  signed_date           date,
  -- Quality
  frc_readiness_score   integer,
  partner_signed_off    boolean default false,
  eqcr_required         boolean default false,
  eqcr_completed        boolean default false,
  --
  notes                 text,
  created_by            uuid references auth.users(id),
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

alter table public.engagements enable row level security;

create policy "Engagements viewable by firm members"
  on public.engagements for select
  using (firm_id in (select firm_id from public.firm_users where user_id = auth.uid()));

create policy "Engagements manageable by assigned team"
  on public.engagements for all
  using (firm_id in (select firm_id from public.firm_users where user_id = auth.uid() and role in ('admin', 'partner', 'manager')));

-- ─── 4. ENGAGEMENT TEAM ──────────────────────────────────────────────────────

create table if not exists public.engagement_team (
  id              uuid primary key default uuid_generate_v4(),
  engagement_id   uuid not null references public.engagements(id) on delete cascade,
  user_id         uuid not null references auth.users(id),
  firm_user_id    uuid references public.firm_users(id),
  role            text not null,   -- engagement_partner | manager | senior | junior | eqcr | specialist
  hours_budgeted  numeric,
  hours_actual    numeric,
  areas_assigned  text[],          -- ['Revenue', 'Trade Debtors', 'Payroll']
  active          boolean default true,
  created_at      timestamptz default now(),
  unique(engagement_id, user_id)
);

alter table public.engagement_team enable row level security;

create policy "Team viewable by engagement firm"
  on public.engagement_team for select
  using (engagement_id in (
    select id from public.engagements
    where firm_id in (select firm_id from public.firm_users where user_id = auth.uid())
  ));

-- ─── 5. AUDIT SECTIONS (FSLI-level) ──────────────────────────────────────────

create table if not exists public.audit_sections (
  id              uuid primary key default uuid_generate_v4(),
  engagement_id   uuid not null references public.engagements(id) on delete cascade,
  fsli            text not null,           -- 'Revenue', 'Trade Debtors', etc.
  section_ref     text,                    -- 'A1', 'B2'
  risk_level      text default 'medium',
  risk_score      integer,
  assertions      text[],                  -- ['existence', 'completeness', 'accuracy', 'cutoff', 'classification']
  materiality     numeric,
  performance_materiality numeric,
  -- Status
  status          text default 'not_started',  -- not_started | in_progress | complete | reviewed | signed
  assigned_to     uuid references auth.users(id),
  reviewed_by     uuid references auth.users(id),
  -- Conclusion
  conclusion      text,
  conclusion_narrative text,
  misstatements_identified boolean default false,
  misstatement_amount numeric,
  -- Timestamps
  started_at      timestamptz,
  completed_at    timestamptz,
  reviewed_at     timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.audit_sections enable row level security;

create policy "Sections viewable by engagement team"
  on public.audit_sections for select
  using (engagement_id in (
    select id from public.engagements
    where firm_id in (select firm_id from public.firm_users where user_id = auth.uid())
  ));

create policy "Sections editable by assigned user or manager"
  on public.audit_sections for all
  using (
    assigned_to = auth.uid() or
    engagement_id in (
      select id from public.engagements
      where firm_id in (select firm_id from public.firm_users where user_id = auth.uid() and role in ('admin', 'partner', 'manager'))
    )
  );

-- ─── 6. AUDIT PROCEDURES ─────────────────────────────────────────────────────

create table if not exists public.audit_procedures (
  id              uuid primary key default uuid_generate_v4(),
  section_id      uuid not null references public.audit_sections(id) on delete cascade,
  engagement_id   uuid not null references public.engagements(id) on delete cascade,
  procedure_ref   text,
  description     text not null,
  procedure_type  text,  -- substantive_test | control_test | analytical_procedure | enquiry | observation | confirmation
  isa_reference   text,
  assertion       text,
  -- Execution
  status          text default 'pending',  -- pending | in_progress | complete | n_a
  performed_by    uuid references auth.users(id),
  performed_date  date,
  -- Results
  result          text,   -- satisfactory | exception | inconclusive
  result_narrative text,
  exception_amount numeric,
  exception_description text,
  -- Sample
  sample_size     integer,
  population_size integer,
  exceptions_found integer default 0,
  -- Evidence
  evidence_refs   text[],   -- references to uploaded documents
  workpaper_refs  text[],   -- cross-references to other work papers
  -- Auto-tick forward
  auto_ticked     boolean default false,
  tick_forward_date timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.audit_procedures enable row level security;

create policy "Procedures viewable by engagement firm"
  on public.audit_procedures for select
  using (engagement_id in (
    select id from public.engagements
    where firm_id in (select firm_id from public.firm_users where user_id = auth.uid())
  ));

create policy "Procedures editable by performer or manager"
  on public.audit_procedures for all
  using (
    performed_by = auth.uid() or
    engagement_id in (
      select id from public.engagements
      where firm_id in (select firm_id from public.firm_users where user_id = auth.uid() and role in ('admin', 'partner', 'manager'))
    )
  );

-- ─── 7. AUDIT FINDINGS ───────────────────────────────────────────────────────

create table if not exists public.audit_findings (
  id                uuid primary key default uuid_generate_v4(),
  engagement_id     uuid not null references public.engagements(id) on delete cascade,
  section_id        uuid references public.audit_sections(id),
  procedure_id      uuid references public.audit_procedures(id),
  -- Finding details
  finding_type      text not null,  -- misstatement | control_deficiency | disclosure_gap | going_concern | fraud_indicator | other
  description       text not null,
  amount            numeric,
  direction         text,           -- overstatement | understatement
  account           text,
  assertion         text,
  isa_reference     text,
  -- Classification
  classification    text,           -- below_trivial | above_trivial_below_pm | above_pm_below_overall | above_overall
  severity          text,           -- trivial | minor | significant | material
  -- Resolution
  adjusted_by_client boolean default false,
  adjustment_amount  numeric,
  management_response text,
  -- Status
  status            text default 'open',  -- open | client_adjusted | not_corrected | waived | resolved
  raised_by         uuid references auth.users(id),
  resolved_by       uuid references auth.users(id),
  raised_date       timestamptz default now(),
  resolved_date     timestamptz,
  -- FRC Readiness
  frc_finding_ref   text,           -- reference to frcThematicFindings (e.g. 'REV-01')
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

alter table public.audit_findings enable row level security;

create policy "Findings viewable by engagement firm"
  on public.audit_findings for select
  using (engagement_id in (
    select id from public.engagements
    where firm_id in (select firm_id from public.firm_users where user_id = auth.uid())
  ));

create policy "Findings manageable by team"
  on public.audit_findings for all
  using (engagement_id in (
    select id from public.engagements
    where firm_id in (select firm_id from public.firm_users where user_id = auth.uid())
  ));

-- ─── 8. ML ENGAGEMENT HISTORY ────────────────────────────────────────────────

create table if not exists public.ml_engagement_history (
  id               uuid primary key default uuid_generate_v4(),
  firm_id          uuid references public.firms(id),
  engagement_id    uuid references public.engagements(id),
  industry         text,
  entity_size      text,   -- micro | small | medium | large
  risk_level       text,
  materiality_used numeric,
  materiality_basis text,
  findings_count   integer,
  opinion_type     text,   -- unmodified | qualified | adverse | disclaimer
  going_concern    boolean default false,
  key_risk_areas   text[],
  procedures_used  text[],
  engagement_data  jsonb,
  created_at       timestamptz default now()
);

alter table public.ml_engagement_history enable row level security;

create policy "ML history viewable by firm"
  on public.ml_engagement_history for select
  using (firm_id in (select firm_id from public.firm_users where user_id = auth.uid()));

create policy "ML history insertable by authenticated"
  on public.ml_engagement_history for insert
  with check (firm_id in (select firm_id from public.firm_users where user_id = auth.uid()));

-- ─── 9. ML RISK PATTERNS ─────────────────────────────────────────────────────

create table if not exists public.ml_risk_patterns (
  id              uuid primary key default uuid_generate_v4(),
  firm_id         uuid references public.firms(id),
  pattern_type    text not null,  -- industry_risk | fsli_risk | procedure_effectiveness | materiality_predictor
  industry        text,
  fsli            text,
  risk_level      text,
  pattern_data    jsonb not null,
  weight          numeric default 1.0,
  sample_count    integer default 0,
  accuracy        numeric,
  last_updated    timestamptz default now(),
  created_at      timestamptz default now()
);

alter table public.ml_risk_patterns enable row level security;

create policy "Risk patterns viewable by firm"
  on public.ml_risk_patterns for select
  using (firm_id in (select firm_id from public.firm_users where user_id = auth.uid()) or firm_id is null);

-- ─── 10. FRC READINESS CHECKS ────────────────────────────────────────────────

create table if not exists public.frc_readiness_checks (
  id              uuid primary key default uuid_generate_v4(),
  engagement_id   uuid not null references public.engagements(id) on delete cascade,
  criterion_id    text not null,  -- matches frcReadinessCriteria.id
  category        text,
  description     text,
  weight          integer,
  status          text default 'not_checked',  -- not_checked | met | not_met | n_a
  evidence        text,
  checked_by      uuid references auth.users(id),
  checked_at      timestamptz,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique(engagement_id, criterion_id)
);

alter table public.frc_readiness_checks enable row level security;

create policy "FRC checks viewable by engagement firm"
  on public.frc_readiness_checks for select
  using (engagement_id in (
    select id from public.engagements
    where firm_id in (select firm_id from public.firm_users where user_id = auth.uid())
  ));

create policy "FRC checks editable by team"
  on public.frc_readiness_checks for all
  using (engagement_id in (
    select id from public.engagements
    where firm_id in (select firm_id from public.firm_users where user_id = auth.uid())
  ));

-- ─── INDEXES ─────────────────────────────────────────────────────────────────

create index if not exists idx_engagements_firm_id    on public.engagements(firm_id);
create index if not exists idx_engagements_year_end   on public.engagements(year_end);
create index if not exists idx_engagements_status     on public.engagements(status);
create index if not exists idx_audit_sections_eng     on public.audit_sections(engagement_id);
create index if not exists idx_audit_sections_fsli    on public.audit_sections(fsli);
create index if not exists idx_audit_procedures_sec   on public.audit_procedures(section_id);
create index if not exists idx_audit_findings_eng     on public.audit_findings(engagement_id);
create index if not exists idx_audit_findings_status  on public.audit_findings(status);
create index if not exists idx_firm_users_firm        on public.firm_users(firm_id);
create index if not exists idx_firm_users_user        on public.firm_users(user_id);

-- ─── TRIGGERS: updated_at ────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$ declare t text; begin
  foreach t in array array[
    'firms', 'engagements', 'audit_sections', 'audit_procedures',
    'audit_findings', 'frc_readiness_checks'
  ] loop
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ─── VIEWS ───────────────────────────────────────────────────────────────────

-- Engagement dashboard summary
create or replace view public.engagement_summary as
select
  e.id,
  e.firm_id,
  e.client_name,
  e.year_end,
  e.status,
  e.risk_level,
  e.overall_materiality,
  e.frc_readiness_score,
  count(distinct s.id) filter (where s.status = 'complete')  as sections_complete,
  count(distinct s.id)                                        as sections_total,
  count(distinct f.id) filter (where f.status = 'open')      as open_findings,
  count(distinct f.id) filter (where f.severity = 'material') as material_findings,
  round(
    count(distinct s.id) filter (where s.status = 'complete')::numeric /
    nullif(count(distinct s.id), 0) * 100, 1
  ) as completion_pct
from public.engagements e
left join public.audit_sections   s on s.engagement_id = e.id
left join public.audit_findings   f on f.engagement_id = e.id
group by e.id;

-- Quality control dashboard (firm-wide)
create or replace view public.quality_control_dashboard as
select
  e.firm_id,
  count(*)                                                      as total_engagements,
  count(*) filter (where e.status = 'planning')                as in_planning,
  count(*) filter (where e.status = 'fieldwork')               as in_fieldwork,
  count(*) filter (where e.status = 'review')                  as in_review,
  count(*) filter (where e.status = 'complete')                as complete,
  count(*) filter (where e.planned_completion < now()::date and e.status not in ('complete','signed')) as overdue,
  round(avg(e.frc_readiness_score), 1)                         as avg_frc_score,
  count(*) filter (where e.going_concern_flag)                  as going_concern_engagements,
  count(*) filter (where e.partner_signed_off = false and e.status = 'complete') as unsigned_complete
from public.engagements e
group by e.firm_id;
