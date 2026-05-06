# AuditEngine — Wiring Audit (read-only)

**Date:** 2026-04-19
**Scope:** GitHub ↔ Vercel ↔ Supabase ↔ Anthropic
**Method:** Read-only inspection of repo files. No remote state queried. No deploys. No env changes.

## Vercel (`vercel.json`)

- ✅ `framework: vite`, `buildCommand: npm run build`, `outputDirectory: dist`, `installCommand: npm ci`
- ✅ Regions: `cdg`, `lhr`, `sfo`
- ✅ SPA rewrite: `"/(.*)" → "/index.html"`
- ✅ Security headers: HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- ✅ `/assets/:path*` Cache-Control `public, max-age=31536000, immutable`
- ✅ `github.enabled: true`, `autoAlias: true`, `autoJobCancelation: true`

Matches `DEPLOYMENT_RUNBOOK.md` §1. **No drift.**

## GitHub Actions

Workflows present in `.github/workflows/`:
- `deploy.yml` — Vercel deploy on push to `main` (needs repo secrets below)
- `test.yml` — lint + Vitest + Codecov
- `security.yml` — `npm audit` + CodeQL

Required repo secrets (per `DEPLOYMENT_RUNBOOK.md` §1):
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID` = `team_ZAIbIuEshedZuJr5szniVWGQ`
- `VERCEL_PROJECT_ID` = `prj_AEmKRMoty5AZXC2RBwyCSaMuWeG8`

**Cannot be verified from the repo alone.** If any are missing, the `deploy-vercel` job fails but Vercel's native GitHub integration still deploys (belt-and-braces).

**Action for DK:** Settings → Secrets and variables → Actions → confirm all three present. Rotate `VERCEL_TOKEN` if over 90 days old.

## Supabase

- ✅ Schema `database/supabase-schema.sql` defines 5 tables: `engagements`, `engagement_data`, `documents`, `document_links`, `audit_trail`
- ✅ RLS policies declared for all 5 tables
- ✅ `src/supabaseClient.js` uses `import.meta.env.VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` and returns `null` when either is missing
- ✅ Storage bucket expected: `audit-documents` (private) — declared in `DEPLOYMENT_RUNBOOK.md` §3

**Action for DK:** Vercel → Project `auditengine` → Environment Variables → confirm Production + Preview both have `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set. After any env change, redeploy — Vite bakes `VITE_*` at build time.

## Anthropic

- `.env.example` declares `ANTHROPIC_API_KEY` (server-side) and `VITE_CLAUDE_API_KEY` (client-side)
- `src/IntegrationsEngine.js` is referenced by `CLAUDE.md` as the live wiring point (file exists in `src/`)
- `CLAUDE.md` declares model matrix: Sonnet 4.6 (primary), Opus 4.6 (agents), Haiku 4.5 (fast), GPT-4 (fallback), Ollama (local)

**Not verified:** whether the keys in the Vercel env match a live Anthropic workspace with rate limits that fit production traffic. That is a DK-only check.

## Summary

No wiring regressions detected from file state. Three items for DK to confirm out-of-band:

1. GitHub repo secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
2. Vercel env vars for both Production and Preview: `VITE_SUPABASE_*`, `VITE_APP_*`
3. Anthropic API key validity + rate-limit tier

None of these can be checked from inside the repo. If DK wants, a follow-up session can run the Vercel deploy-hook against a dummy commit to confirm build passes.
