# AuditEngine — Mac One-Tap Launcher

Double-click. Auto-installs deps, pulls secrets from macOS Keychain, starts Vite + Express, opens the browser, tails logs. Ctrl+C cleans everything up.

## First-time setup (one-time, ~2 minutes)

```bash
cd ~/Desktop/Audit-Engine     # or wherever your clone lives
chmod +x dev stop scripts/launcher/*.sh scripts/launcher/AuditEngine.command
./dev
```

The Keychain wizard runs once and asks for:

**Required**
- Supabase project URL — `https://xxxxx.supabase.co`
- Supabase anon (public) key — the JWT shown in Supabase → Settings → API
- Anthropic API key — `sk-ant-...` from https://console.anthropic.com/settings/keys

**Optional** (press Enter to skip any)
- Supabase service-role key (server-side, RLS bypass)
- GitHub PAT (for `npm run agents:report`)
- SendGrid, Slack, Companies House, Companies House — only if you use them

`JWT_SECRET` is auto-generated as a 64-char random string.

All secrets are stored in macOS Keychain under service-prefix `AuditEngine.*`. The `.env.local` file is regenerated on every launch with `chmod 600` and is gitignored.

## Daily use

```bash
./dev                    # Cloud Supabase + local Vite + local API
./dev --with-docker      # Adds local Postgres, Redis, Ollama
./dev --no-open          # Don't open browser
./dev --reset-keychain   # Re-prompt for all secrets
./dev --help             # Full options
./stop                   # Stop everything cleanly
```

Or double-click `scripts/launcher/AuditEngine.command` from Finder.

## What gets started

| Service | Port | Source | Log |
|---|---|---|---|
| Vite dev (React 19 + Vite 8) | 5173 | `npm run dev` | `.auditengine/web.log` |
| Express API | 3001 | `node server/index.js` | `.auditengine/api.log` |
| Postgres (optional) | 5432 | docker compose | docker logs |
| Redis (optional) | 6379 | docker compose | docker logs |
| Ollama (optional) | 11434 | docker compose | docker logs |

The launcher prints a status dashboard once everything is up. PIDs are written to `.auditengine/{api,web}.pid` so `./stop` can find them.

## How secrets flow

```
macOS Keychain  ──read──▶  launch.sh  ──write──▶  .env.local (chmod 600, gitignored)
                                                       │
                                                       ▼
                                              Vite + Express + agents
```

- The launcher reads secrets at runtime only; nothing is logged.
- `.env.local` is regenerated on every launch — manual edits are overwritten.
- Inspect a value: `security find-generic-password -s AuditEngine.VITE_SUPABASE_URL -w`
- Change a value: `./dev --reset-keychain` (prompts again, keeps existing on Enter)

## Troubleshooting

- **"Port 3001 already in use"** — the launcher tries to free stuck ports on start. If it persists, run `./stop` then `./dev` again.
- **"Node 18.x is too old"** — install Node 20: `brew install node@20 && brew link --overwrite node@20`.
- **"Keychain access denied" on first run** — macOS pops a permission dialog; click "Always Allow" so future launches don't re-prompt.
- **Vite stuck at "module not found"** — delete `node_modules` and `package-lock.json`, then `./dev` to fresh-install. `./dev --reset-keychain` is not needed for this.
- **API serves `/health` but app shows "Supabase client is null"** — your `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` value is empty in Keychain. Run `./dev --reset-keychain`.

## Files

```
scripts/launcher/
├── AuditEngine.command       Mac double-click entry (calls launch.sh)
├── launch.sh                 Orchestrator (preflight, keychain, install, start, dashboard)
├── stop.sh                   Graceful shutdown
├── keychain.sh               Keychain read/write helpers (sourced)
├── setup-keychain.sh         One-time Keychain seeding wizard
└── README.md                 This file
dev                           Top-level shim → launch.sh
stop                          Top-level shim → stop.sh
```

## What this does NOT do

- Does not install Node, Docker, or Homebrew — those are prerequisites.
- Does not deploy to Vercel, run database migrations, or seed cloud Supabase. See `DEPLOYMENT_RUNBOOK.md` for production wiring.
- Does not modify any `src/`, `server/`, or build config.
- Does not commit anything for you.

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| macOS | 12+ (Monterey or newer) | n/a |
| Node | 20.x | `brew install node@20` |
| npm | 10.x (bundled with Node 20) | n/a |
| Docker Desktop (only for `--with-docker`) | latest | https://www.docker.com/products/docker-desktop |
