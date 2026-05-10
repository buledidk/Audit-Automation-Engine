# Database Migration Ownership (Sprint 0 V-03)

**Date:** 2026-05-10
**Status:** Discovery snapshot — no migrations changed.

## Problem

Three migration directories exist with overlapping intent. Two `001*` files in `db/migrations/` collide on numbering. This makes "which schema is canonical" ambiguous.

## Inventory

### `database/` — production schema (canonical for fresh deploys)

| File | Lines | Role |
|---|---|---|
| `001_deploy_schema.sql` | 587 | Initial production schema |
| `002_seed_reference_data.sql` | 272 | Seed data (jurisdictions, frameworks) |
| `003_rls_policies.sql` | 419 | Row-Level Security policies |
| `supabase-schema.sql` | 131 | Supabase live schema reflection (frontend-aligned) |
| `schema-legacy.sql` | 783 | Pre-AURA backup. Do not run. |

Run order on a fresh Supabase project: `001 → 002 → 003`. `supabase-schema.sql` is the post-application reflection; do not run it as a migration.

### `db/migrations/` — incremental migrations (canonical for additive changes)

| File | Lines | Role |
|---|---|---|
| `001_audit_engagement_tables.sql` | 471 | 10-table engagement schema with RLS |
| `001-gdpr-audit-trail.sql` | 58 | **GDPR-shaped** `audit_trail` table — not the ISA 230 hash-chained shape required by `reference_auditengine_architecture.md`. Will be superseded by `006-audit-trail-isa230.sql` (Sprint 1 S1-03). |
| `002-encryption-setup.sql` | 38 | Encrypted-column scaffolding (extend in S1-01 / CC-13) |
| `003-dispatch-tables.sql` | 220 | Mobile dispatch + push notifications |
| `004-agent-assessment-tables.sql` | 353 | Agent health metrics + incidents |
| `005-full-audit-engagement.sql` | 508 | Firms + Partner Management + ML Learning |

**Numbering collision:** `001_audit_engagement_tables.sql` and `001-gdpr-audit-trail.sql` both prefix with `001`. This is a hazard if a tool sorts by prefix and runs the first match. Mitigation: rename `001-gdpr-audit-trail.sql` to `006-gdpr-audit-trail-legacy.sql` once Sprint 1 S1-03 lands the ISA-230-shaped replacement.

### `migrations/` — legacy v1→v2 sharding (do not run)

| File | Lines | Role |
|---|---|---|
| `001_sharding_schema-legacy.sql` | 231 | Phase 2 partitioning (March 2026) |
| `002_data_migration-legacy.sql` | 276 | v1→v2 data move (March 2026) |

Both files are explicitly suffixed `-legacy`. Decision: leave in place as historical record; do not include in any deploy script.

## Canonical run-order (for Supabase production)

1. `database/001_deploy_schema.sql`
2. `database/002_seed_reference_data.sql`
3. `database/003_rls_policies.sql`
4. `db/migrations/001_audit_engagement_tables.sql`
5. `db/migrations/001-gdpr-audit-trail.sql` (until Sprint 1 S1-03 supersedes)
6. `db/migrations/002-encryption-setup.sql` → `005-full-audit-engagement.sql` in numeric order

## Owner per directory

- `database/` — production schema team. Touch only on major schema bumps.
- `db/migrations/` — feature engineering. Add new migrations here with strictly-increasing prefixes.
- `migrations/` — closed. Do not add files; do not run.

## Action items (carry into Sprint 1)

- Sprint 1 S1-03: drop new `db/migrations/006-audit-trail-isa230.sql` with hash-chained schema; rename `001-gdpr-audit-trail.sql` → `006-gdpr-audit-trail-legacy.sql` after the cutover.
- Add a `scripts/deploy-database.js --dry-run` that prints the resolved file list in canonical order so collisions get caught in CI.
