---
name: audit-working-paper
description: Generate ISA (UK) 230-compliant audit working papers with proper documentation standards. Triggers on "working paper", "work paper", "audit documentation", "document this procedure", "WP reference", "prepare lead schedule", "prepare working paper". Produces structured, reviewable documentation that meets ISA 230 experienced auditor test.
---

## When to use

- User asks to create or format an audit working paper
- User has completed a procedure and needs to document it
- User asks about ISA 230 documentation requirements
- User asks about the "experienced auditor test"
- User wants to create lead schedules, summary schedules, or detailed test sheets
- Any skill output needs formalising into working paper format

## Actions

1. **Apply ISA 230 documentation standard** — the experienced auditor test (para 8):
   > Documentation must be sufficient to enable an experienced auditor, having no previous connection with the audit, to understand:
   > - The nature, timing, and extent of procedures performed
   > - The results of procedures and evidence obtained
   > - Significant matters arising and conclusions reached

2. **Structure every working paper with standard sections:**

   | Section | Content | ISA reference |
   |---------|---------|---------------|
   | **Header** | Entity name, year-end, WP reference, preparer, reviewer, date | ISA 230 para 9 |
   | **Objective** | What this paper aims to evidence | ISA 230 para 8(a) |
   | **Scope** | FSLI, assertion(s), population covered | ISA 330 |
   | **Risk addressed** | Link to risk register reference | ISA 315/330 |
   | **Materiality** | PM, TE, specific materiality if applicable | ISA 320 |
   | **Procedure** | Step-by-step description of work performed | ISA 230 para 8(a) |
   | **Source / evidence** | Documents inspected, confirmations received, system reports | ISA 500 |
   | **Results** | Findings table — pass/fail/exception per item tested | ISA 230 para 8(b) |
   | **Misstatements** | Any misstatements identified — factual, judgemental, projected | ISA 450 |
   | **Conclusion** | Professional conclusion on the objective, referencing evidence | ISA 230 para 8(c) |
   | **Cross-references** | Links to other WPs, risk register, summary of misstatements | ISA 230 para 9 |

3. **Apply working paper types:**
   - **Lead schedule** — summarises an FSLI area (e.g., trade receivables lead), bridges PY to CY, references all supporting WPs
   - **Detailed test sheet** — individual procedure documentation (e.g., receivables circularisation results)
   - **Summary schedule** — aggregates results across tests for a section
   - **Memo / narrative** — documents judgements, discussions, complex areas (e.g., going concern memo, accounting treatment memo)
   - **Completion checklist** — ISA 220/ISQM 1 review checklists

4. **Apply referencing conventions:**
   - Alpha-numeric WP references: section letter + sequential number (e.g., E1 = receivables lead, E1.1 = circularisation, E1.2 = aged analysis)
   - Standard section letters (customisable per firm):
     - A = Planning, B = Permanent file, C = Revenue, D = Payroll, E = Receivables, F = Inventory, G = Fixed assets, H = Cash/bank, I = Payables, J = Provisions, K = Equity, L = Tax, M = Consolidation, N = Completion

5. **Ensure review trail:**
   - Preparer initials and date
   - Reviewer initials and date
   - Review points raised (with responses)
   - Sign-off status (draft / reviewed / approved)
   - Link to AuditEngine sign-off log

6. **Output formatted working paper** in:
   - Structured markdown (for in-app display)
   - Export-ready format referencing `src/services/` export capabilities (docx/xlsx/pdf)

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| wpType | enum | yes | leadSchedule, testSheet, summary, memo, checklist |
| wpReference | string | yes | Working paper reference code (e.g., "E1.1") |
| entityName | string | yes | Entity under audit |
| yearEnd | YYYY-MM-DD | yes | Accounting year-end |
| objective | string | yes | What this paper evidences |
| riskReference | string | no | Link to risk register entry |
| procedureDetails | string | yes | Description of work performed |
| results | object | yes | Findings — pass/fail/exceptions |
| conclusion | string | yes | Auditor's conclusion |

## Outputs

- Formatted working paper with all ISA 230 required sections
- Cross-reference links
- Review trail template
- Export-ready structure

## Codebase references

- `src/StandardsLibrary.js` — ISA 230 (Audit Documentation)
- `src/services/auditDocumentationService.js` — Documentation service
- `src/services/exportService*.js` — Export to docx/xlsx/pdf
- `src/AuditEngine_AURA.jsx` — Working paper UI (cellData, signOffs, wpNotes state)
