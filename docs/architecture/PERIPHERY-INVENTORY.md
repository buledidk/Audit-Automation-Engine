# Periphery Scaffold Inventory (Sprint 0 V-05)

**Date:** 2026-05-10
**Question answered:** What lives outside `~/audit-engine`, and what to do with each.

## Findings

### `~/Documents/DK-HQ-deploy/apps/`

| Directory | Contents | Maturity vs `~/audit-engine` | Recommendation |
|---|---|---|---|
| `apps/audit-engine/` | `package.json`, `src/index.js`, 3 thin compliance files (`working-papers.js`, `checklist.js`, `risk-assessment.js`) | Stub; superseded | Archive — move to `~/Documents/DK-HQ-deploy/_archive/2026-05-10/` with a README pointer to `~/audit-engine/` |
| `apps/audit-web/` | Next.js + Tailwind scaffold, `middleware.ts`, `layout.tsx`, `tsconfig.json` | Different stack from canonical (Next.js vs Vite). Empty product surface. | Archive — same path |
| `apps/audit-automation/` | `README.md` only | Placeholder | Archive — same path |
| `apps/company-portal/` | One subdir | Out of scope for AuditEngine | Leave (Indus Nexus / company portal scope) |
| `apps/main/` | One subdir | Out of scope for AuditEngine | Leave |

### `~/Downloads/03_Audit_Professional/AuditEngine/`

30+ files dated 1–10 March 2026. Mix of `.jsx` variants, `.zip` snapshots, `.xlsx` workbooks, `.html` portals, two Vite scaffolds.

| File / dir | Date | Content |
|---|---|---|
| `AuditEngineV10_AURA_1.jsx` (referenced in v1 roadmap) | 9 Mar 2026 | 160 KB single-file build. Methodology source-of-truth pre-port. |
| `AuditEngine_v10_AURA 2/` | 9 Mar 2026 | Vite shell, `main.jsx` + `App.jsx` only |
| `auditengine-site/` and `auditengine-site 2/` | 10 Mar 2026 | Landing-page Vite shells |
| Older `.jsx` (`AuditEngine_v8_1`, `AuditAutomationEngine`, `AuditEngine_Portal`, `AuditEngine_CommandCenter`, etc.) | 1–9 Mar | Earlier variants (v4, v6, v8, v10 candidates) |
| `.zip`, `.tar.gz` snapshots | 2–9 Mar | Historical bundles |
| `.html` portals (`AuditEngine_v10_AURA_Portal.html`, `AuditEngine_v10_AURA_Professional_Phase1-4.html`) | 9 Mar | Static HTML demos |
| `Audit_Working_Paper_File_V2(.xlsx)`, `Audit_Working_Paper_File_V2 (1).xlsx`, `Audit_Automation_Engine.xlsx`, `AuditEngine_v10_AURA_Workbook.xlsx` | 2–9 Mar | Reference workbooks (preserve) |

**Recommendation:** Bulk-move to `~/Documents/03_Audit_Professional/AuditEngine/_archive_2026-05-10/`, except for the `.xlsx` workbooks which stay in place as reference. Decision rationale recorded here so the move is reversible.

### `~/dk-empire/auditengine/`

Pnpm workspace shell scaffolded 22 April 2026:

```
~/dk-empire/auditengine/
├── apps/
├── package.json (380 bytes)
└── packages/
```

Empty workspaces. Per `project_dk_empire.md` memory, dk-empire is a separate "monorepo to house FS automation agents, AuditEngine SaaS, consulting, angel investing", scaffolded but not populated.

**Recommendation:** Leave as-is. If at some future point AuditEngine moves into the monorepo, the migration target is here. Until then, do not duplicate code into this tree.

## Decisions

1. **Canonical AuditEngine remains `~/audit-engine/`.** No move planned. (Confirmed in v2 roadmap §2.)
2. **DK-HQ-deploy/apps/audit-{engine,web,automation}** — archive (move out of `apps/`). They are starter scaffolds that have been superseded by the canonical app.
3. **Downloads/03_Audit_Professional/AuditEngine** — archive `.jsx` / `.zip` / `.tar.gz` / `.html`; keep `.xlsx` workbooks in place.
4. **dk-empire/auditengine** — leave; potential future home, not active.

## Why this matters

The v1 roadmap inadvertently elevated DK-HQ-deploy/apps/audit-engine to "canonical" status because it's a more legible scaffold than the live app's much larger tree. Archiving these stubs prevents the same mistake the next time a fresh contributor or future agent surveys `~/Documents/`.

## Out of scope here

The actual `mv` operations are deferred to a separate small chore PR (or done manually outside the repo since these paths are not in `~/audit-engine`). This document captures the *decision*, not the execution.
