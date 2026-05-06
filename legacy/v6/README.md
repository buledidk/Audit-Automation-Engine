# AuditEngine v6 — Frozen Snapshot

This folder contains a verbatim copy of the three files that previously lived in the private `buledidk/Auditengine` repo (the v6 single-page HTML prototype). They are preserved here as a historical reference and are **not** wired into the v10 Vite build.

## Files

| File | Size | SHA-256 | Lines |
|---|---|---|---|
| `index.html` | 128,146 B | `dd5c2d593829dfecddb2e437b29c129822d53bc709c24bc5e0367f18e595dec3` | 724 |
| `AuditFrameworks.js` | 5,515 B | `78b22d717618ce74de8ba059afb22986d76a0cbf75882f1d18a14aac37d9bcc2` | 112 |
| `WorkingPaperGenerator.js` | 11,137 B | `c42a38600bd370bc095c4c11c1923a8a06fa8514a86646af24c068d10e2aa716` | 280 |

Source: `buledidk/Auditengine@main` commit `c12f618` (2026-04-19).

## v10 supersession map

| v6 file | Superseded by |
|---|---|
| `index.html` | `/index.html` + `src/AuditEngine_AURA.jsx` (v10 entry) |
| `AuditFrameworks.js` | `src/data/AuditFrameworks.js` (live) — v10 re-exports the same `FRAMEWORKS`, `ENTITY_SIZES`, `AUDIT_PHASES`, `WORKING_PAPERS` constants |
| `WorkingPaperGenerator.js` | `src/services/WorkingPaperGenerator.js` (live) |

See `src/SERVICES_AGENTS_INDEX.md` for the full v10 service map.

## Do not import from here

These files are kept at rest. The v10 build does not reference `legacy/v6/` anywhere. If you need the same data or generator logic, import from the live `src/` paths above.
