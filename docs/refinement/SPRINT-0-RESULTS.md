# Sprint 0 Results — Verify-and-Correct

**Date:** 2026-05-10
**Roadmap reference:** `~/Documents/DK-HQ-deploy/AuditEngine-Compliance/REFINEMENT_ROADMAP_v2.md` §7

## Status

| Item | Status | Output |
|---|---|---|
| V-01 Rotate Anthropic API key | **DK action — pending** | Will be confirmed in Anthropic dashboard |
| V-02 Reconcile test count | **Done** | 773 tests across 21 files, all passing in 14.82 s. CLAUDE.md needs update from "305" → "773". |
| V-03 Migration ownership | **Done** | `docs/database/MIGRATION-OWNERSHIP.md` — three dirs catalogued, numbering collision flagged for Sprint 1 |
| V-04 AI client import map | **Done** | `docs/security/AI-CLIENT-IMPORT-MAP.md` — 8 unsafe Anthropic sites; transitive callers via `claudeClient.js` listed |
| V-05 Periphery inventory | **Done** | `docs/architecture/PERIPHERY-INVENTORY.md` — DK-HQ-deploy stubs and Downloads JSX variants both flagged for archival |
| V-06 Memory updates | **Done** (out of repo) | `~/.claude/projects/.../memory/`: `project_auditengine.md` rewritten, `project_security_aikey_leak.md` added, `MEMORY.md` index updated |
| V-07 Domain decision | **Done** | `docs/architecture/DOMAINS.md` — `auditengine.co.uk` not registered; recommend register-and-redirect |

## Headline numbers (rebased)

- **773 tests** (not 305, not 219). Suite duration 14.82 s. Pass rate 100%.
- **22 unsafe Anthropic surfaces** in the live tree, not 8 (the first grep undercounted because of inline imports and named imports). Breakdown: 18 SDK instantiation sites (6 agents + 2 components + 10 services) + 3 reference-only sites + 1 `.env.example` line. **17 closed in this PR**; `claudeClient.js` deferred to S1-00 phase 2 because it uses the batch API and needs the proxy extended first.
- **3 migration directories** with one numbering collision on `001-*`.
- **2 brand domains** — `.agency` live, `.co.uk` not registered.
- **6 methodology source files** totalling **9,673 lines** — load-bearing asset, no regression allowed.

## Critical action gate

DK must rotate the Anthropic API key before S1-00 ships (the proxy migration eliminates the leak path, but the *currently-deployed* bundle is still leaking until then). Sequence:

1. DK rotates key in Anthropic console; revokes old key.
2. DK updates Vercel env: `ANTHROPIC_API_KEY` only (no `VITE_` prefix).
3. S1-00 PR (this PR) merges to `develop`.
4. CI gate prevents regression.

## What this PR contains

- Sprint 0 docs (V-02 through V-07): the 5 markdown files above.
- Sprint 1 S1-00 phase 1: server-side AI proxy + `aiProxyClient.js` + migration of `AgentFramework.js`, the 4 specialised agents, the 2 components, and `claudeClient.js`. CI grep gate. Env-example cleanup. CLAUDE.md test-count fix.

## What this PR does not contain

- The V-05 `mv` operations (decisions only; execution outside repo).
- A new `audit_trail` migration (Sprint 1 S1-03).
- MFA enforcement (Sprint 1 S1-02).
- RBAC matrix expansion (Sprint 1 S1-04).
- ECCTA / sanctions / DSR / cookie banner / etc. (Sprints 2–4).
