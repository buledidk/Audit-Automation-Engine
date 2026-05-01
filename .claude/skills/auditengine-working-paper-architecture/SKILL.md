---
name: auditengine-working-paper-architecture
description: "Use when designing, extending, or navigating the AuditEngine audit file tree. Covers the 47-working-paper CaseWare/Mercia-style structure across six phases — Planning (A1–A10), Risk (B1–B3), Lead Schedules (C1–C8), Testing (D1–D16), Completion (E1–E6), Reporting (F1–F2) — plus Z1 Trail Map. Every WP carries ref, ISA tag, type, optional FSLI key, sign-off block, notes field, editable tables, export (CSV/Excel/Word), and progress tracking. Trigger on 'working paper tree', 'audit file structure', 'CaseWare-style referencing', 'alphanumeric WP ref', 'add a new working paper', 'WP sign-off', 'audit trail map', 'sidebar tree', 'PRE PLN RSK INC EXP AST LIA EQU CMP RPT REF'."
---

# AuditEngine Working Paper Architecture

## The six phases + trail map

| Phase | Refs | Type | Count |
|---|---|---|---|
| Planning & Acceptance | A1–A10 | `planning` | 10 |
| Risk Assessment | B1–B3 | `risk` | 3 |
| Lead Schedules | C1–C8 | `lead` | 8 |
| Testing Programmes | D1–D16 | `testing` | 16 |
| Completion & Reporting | E1–E6 | `completion` | 6 |
| Reporting | F1–F2 | `reporting` | 2 |
| Audit Trail Map | Z1 | `trail` | 1 |
| Separators | `sep1`–`sep6` | `separator` | 6 |
| **Total (excluding separators)** | | | **46 + Dashboard** |

## WP_SECTIONS row shape

```js
{ id:"d1", label:"Revenue", icon:"💷", ref:"D1", type:"testing",
  isa:"ISA 240.26", fsliKey:"revenue" }
```

`fsliKey` is optional and links the WP to one of the 10 FSLI buckets for auto-population from the industry profile.

## Section colour mapping (sidebar)
- planning → `#1565C0` (blue)
- risk → `#C62828` (red)
- lead → `#2E7D32` (green)
- testing → `#E65100` (orange)
- completion → `#6A1B9A` (purple)
- reporting → `#4E342E` (brown)

## Required per-WP UI elements
1. Sign-off block: `preparedBy`, `reviewedBy`, `preparedDate`, `reviewedDate`
2. Editable table with CSV/Excel/Word export on every section
3. Dialogue/comment box (every step)
4. Testing table with auditor sign-off (every D-section)
5. Notes textarea at the bottom of every WP
6. Progress roll-up to the vertical progress bar

## Navigation rules
- CaseWare-style tree, NOT accordion toggles.
- Sidebar shows phase separators as coloured bands with the labels PLANNING & ACCEPTANCE / RISK ASSESSMENT / LEAD SCHEDULES / TESTING PROGRAMMES / COMPLETION & REPORTING / REPORTING.
- Every WP in the tree is reachable via its alphanumeric ref typed into a jump-to box.

## Do
- When adding a WP, assign the next unused ref in its phase (e.g. D17 for a new testing area).
- Update `WP_SECTIONS`, `ADD_TESTS` (if testing), and any industry `fsli` map simultaneously.
- Keep Z1 Trail Map auto-generating from `WP_SECTIONS` — never hard-code rows.

## Don't
- Don't introduce a new top-level phase without a separator record.
- Don't use numeric-only refs (the tree relies on alpha-prefix for sort and colour).
- Don't gate navigation on sign-off — partners need free movement.
