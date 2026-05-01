# AuditEngine — Deployment Runbook

Single source of truth for connecting **GitHub ↔ Vercel ↔ Supabase** for this repo.

Production: <https://auditengine.agency> · <https://auditengine.vercel.app>
Vercel project: `auditengine` (`prj_AEmKRMoty5AZXC2RBwyCSaMuWeG8`, team `team_ZAIbIuEshedZuJr5szniVWGQ`)
GitHub repo: `buledidk/Audit-Engine`

---

## 1. GitHub → Vercel (auto-deploy)

Vercel's GitHub integration is already connected. Every push to `main` or any `claude/**` branch triggers a Vercel deployment (see `vercel.json` `github.enabled: true` and the deployment history).

The GitHub Actions workflow `.github/workflows/deploy.yml` provides a parallel, authoritative deploy path and depends on three **repo secrets** (Settings → Secrets and variables → Actions → New repository secret):

| Secret name          | Value                                      | Where to get it                                  |
|----------------------|--------------------------------------------|--------------------------------------------------|
| `VERCEL_TOKEN`       | Personal access token                      | <https://vercel.com/account/tokens> → Create     |
| `VERCEL_ORG_ID`      | `team_ZAIbIuEshedZuJr5szniVWGQ`            | Already known (this team)                        |
| `VERCEL_PROJECT_ID`  | `prj_AEmKRMoty5AZXC2RBwyCSaMuWeG8`         | Already known (this project)                     |

If `VERCEL_TOKEN` is missing, the `deploy-vercel` job in the workflow will fail but Vercel's native GitHub integration will still deploy — the workflow is a belt-and-braces check.

---

## 2. Vercel env vars (required for Supabase to work at runtime)

Dashboard → Project `auditengine` → **Settings → Environment Variables**. Scope each one to **Production** and **Preview** unless noted.

### Required (frontend — Vite `import.meta.env`)

| Variable                | Example                              | Notes                                          |
|-------------------------|--------------------------------------|------------------------------------------------|
| `VITE_SUPABASE_URL`     | `https://xxxxx.supabase.co`          | From Supabase → Project Settings → API         |
| `VITE_SUPABASE_ANON_KEY`| `eyJhbGc...` (JWT)                   | Same page, "anon public" key                   |
| `VITE_APP_URL`          | `https://auditengine.agency`         | Used for CORS / redirects                      |
| `VITE_APP_ENV`          | `production`                         | Switches dev/test flags                        |
| `VITE_APP_NAME`         | `AuditEngine`                        | Display name                                   |
| `VITE_APP_VERSION`      | `10.0.0`                             | Shown in footer                                |

### Optional (only if server functions / Claude API are enabled)

See `.env.example` for the full list — `ANTHROPIC_API_KEY`, `JWT_SECRET`, `SENDGRID_API_KEY`, `SLACK_BOT_TOKEN`, `GITHUB_TOKEN`, AWS S3 keys, etc. These are **not** required for the static site build; add them only as you wire up the corresponding feature.

**After adding env vars, trigger a new deployment** (`git commit --allow-empty -m "redeploy: pick up env vars" && git push`, or redeploy from the Vercel dashboard). Vite bakes `VITE_*` vars at build time, so old deployments won't see new values.

---

## 3. Supabase — one-time setup

1. Create a new project at <https://supabase.com/dashboard/projects>. Region = London (eu-west-2) to match `.env.example`.
2. **SQL Editor → New query** → paste the entire contents of [`database/supabase-schema.sql`](./database/supabase-schema.sql) → **Run**. This creates:
   - 5 tables: `engagements`, `engagement_data`, `documents`, `document_links`, `audit_trail`
   - 5 Row Level Security policies (engagement-level isolation, user-owned rows)
   - 6 supporting indexes
3. **Storage → Create bucket** → name `audit-documents`, visibility **Private**.
4. **Project Settings → API** → copy "Project URL" + "anon public" key → paste into Vercel env vars from §2.
5. **Authentication → Providers** → enable Email (magic link + password). Add `https://auditengine.agency/auth/callback` to Site URL + Redirect URLs.
6. Redeploy Vercel (see §2). The `src/supabaseClient.js` client reads `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` and returns `null` if either is missing — so until §2 is done, the app quietly falls back to localStorage.

---

## 4. Verification checklist

After the working branch is merged to `main` and the three connections above are wired:

- [ ] `curl -I https://auditengine.agency` → `HTTP/2 200`
- [ ] `curl -I https://auditengine.vercel.app` → `HTTP/2 200`
- [ ] <https://auditengine.agency/welcome> renders the landing page; DevTools console shows **no** `MISSING_EXPORT` or `Cannot find module` errors
- [ ] Vercel Dashboard → Project `auditengine` shows `live: true` and latest deploy `state: READY, target: production`
- [ ] GitHub Actions run of `deploy.yml` on the merge commit is green across `build-and-test`, `security-checks`, `deploy-vercel`, `verify-production`
- [ ] Once Supabase creds are in Vercel: visit `/auth`, attempt sign-up — DevTools Network tab shows `POST https://<your-project>.supabase.co/auth/v1/signup` returning 200/400-JSON (not a network error)
- [ ] Supabase Dashboard → Table Editor shows a new row in `auth.users` after signup

---

## 5. Troubleshooting

### Build fails with `MISSING_EXPORT: _Foo does not exist in lucide-react/recharts`
A lint cleanup prefixed a JSX-referenced import with `_`. Find the file, rename `_Foo` back to `Foo` in both the import and the usage. This was the exact regression fixed by this branch.

### Vercel deployment shows state `ERROR`
Get build logs via the Vercel MCP: `get_deployment_build_logs({ deploymentId, teamId })`. Most common: missing env var (error will mention `VITE_SUPABASE_URL is undefined`) or a lint-introduced import regression.

### `project.live: false` after a successful deploy
The production alias is still pointing at an older deployment. Either promote the latest deploy from the Vercel UI (Deployments → ⋯ → Promote to Production) or push a new commit to `main`.

### Supabase auth works locally but fails in production with CORS
Add `https://auditengine.agency` and `https://auditengine.vercel.app` to Supabase → Authentication → URL Configuration → "Site URL" and "Redirect URLs".

---

## 6. Where each file lives

- CI/CD workflow: [.github/workflows/deploy.yml](./.github/workflows/deploy.yml)
- Vercel config: [vercel.json](./vercel.json) (headers, rewrites, framework = vite)
- Supabase client: [src/supabaseClient.js](./src/supabaseClient.js)
- Supabase schema: [database/supabase-schema.sql](./database/supabase-schema.sql)
- Env var template: [.env.example](./.env.example)
- This runbook: `DEPLOYMENT_RUNBOOK.md`
