---
name: auditengine-methodology-library
description: "Use when creating or extending pre-populated audit content for UK statutory audits in AuditEngine. Enforces the zero-placeholder principle — every working paper auto-populates with real, substantive ISA-compliant content on click. Covers ENGAGEMENT_LETTER (ISA 210), ACCEPTANCE_CHECKLIST (ISA 220), MATERIALITY_BENCHMARKS + MATERIALITY_NOTES (ISA 320), FRAUD_PRESUMPTIONS + JOURNAL_ENTRY_TESTING (ISA 240), GOING_CONCERN (ISA 570), AUDIT_OPINIONS (ISA 700/705/706), COMPLETION_CHECKLIST (ISA 220/230), REPRESENTATIONS (ISA 580), TRANSACTION_CYCLES (ISA 315.14), SUBSTANTIVE_PROCEDURES, LEAD_SCHEDULES, and ISA_ENCYCLOPAEDIA. Trigger on 'pre-populated audit content', 'methodology templates', 'working paper content', 'ISA content library', 'zero placeholder', 'audit methodology module', 'engagement letter draft', 'going concern procedures', 'audit opinion wording'."
---

# AuditEngine Methodology Library

## Zero-placeholder principle (hard requirement)
Every working paper MUST auto-populate with substantive real content on click. "Enter text here" / "To be completed" / "TBC" / lorem ipsum are all violations. Content must cite ISA paragraphs inline (not external labels).

## 13 content exports + 1 encyclopaedia

Module: `src/AuditMethodology.js`

| Export | ISA | Purpose |
|---|---|---|
| `ENGAGEMENT_LETTER` | 210 | Objective, scope, responsibilities, limitations |
| `ACCEPTANCE_CHECKLIST` | 220 | Client acceptance / continuance |
| `MATERIALITY_BENCHMARKS` | 320 | Benchmark % ranges |
| `MATERIALITY_NOTES` | 320 | Benchmark rationale |
| `FRAUD_PRESUMPTIONS` | 240 | Presumed fraud risks |
| `JOURNAL_ENTRY_TESTING` | 240.32 | JE test design |
| `GOING_CONCERN` | 570 | Procedures + indicators |
| `AUDIT_OPINIONS` | 700/705/706 | Unmodified, qualified, adverse, disclaimer, EoM, OM |
| `COMPLETION_CHECKLIST` | 220/230 | File completion gate |
| `REPRESENTATIONS` | 580 | Written representations |
| `TRANSACTION_CYCLES` | 315.14 | Cycles → controls mapping |
| `SUBSTANTIVE_PROCEDURES` | — | Per-area procedures |
| `LEAD_SCHEDULES` | — | Lead schedule structure |
| `ISA_ENCYCLOPAEDIA` | 200–720 | Key para references |

## Template token convention
Placeholders inside content use `{FYE}`, `{FRAMEWORK}`, `{ENTITY_NAME}`, `{PARTNER}`, `{FIRM_NAME}` — resolved at render time from engagement config. No other token syntax.

## ISA inline citation format
- Short form: `(ISA 210.6(a))`
- Combined: `(ISA 330.20; FRS 102 s23)`
- Paragraph range: `(ISA 540.13–540.18)`

Always embed inside the sentence — never as a trailing footnote label.

## Target ISA encyclopaedia coverage
36 ISA (UK) standards + ISQM (UK) 1 + ISQM (UK) 2. Current Project snapshot covers 24 — gap list: ISA 260, 265, 402, 610, 620, 701, 710, 720 + ISQM 1 + ISQM 2 + ISA 250B + ISA 315 (revised 2022 paragraphs beyond .14/.25/.28).

## Do
- Cite ISA paragraph numbers inline in every clause.
- Keep ENGAGEMENT_LETTER clauses parameterised with tokens.
- Keep AUDIT_OPINIONS wording verbatim from ISA 700 Appendix unless the jurisdiction/entity requires adaptation.
- Extend MATERIALITY_BENCHMARKS with entity-size-specific ranges (micro / small / medium / large / listed).

## Don't
- Don't use "lorem ipsum" or generic filler — this is a hard product rule.
- Don't rewrite ISA opinion wording in plain English; use the standard prescribed wording.
- Don't include specific client names in defaults; always use generic placeholders.
