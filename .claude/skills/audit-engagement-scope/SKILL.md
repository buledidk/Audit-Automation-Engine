---
name: audit-engagement-scope
description: Plan a new UK statutory audit engagement end-to-end from client facts. Triggers on phrases like "new audit", "plan engagement", "audit scope", "client onboarding", or when given turnover/employees/balance-sheet figures. Produces ISA (UK) 300-compliant planning memo covering reporting framework, entity size, materiality, risk profile, team composition, deliverables, and milestone dates. Delegates analysis to paired subagent.
---

## When to use

- User says "new audit", "plan engagement", "scope the audit", "client onboarding"
- User provides entity facts (turnover, balance sheet total, employees, year-end)
- User asks about Companies Act 2006 entity classification or PIE status
- User asks about audit team composition or EQR triggers

## Actions

1. **Elicit missing client facts** — legal name, CRN, year-end date, turnover (GBP), balance sheet total (GBP), average employees, sector, ownership structure, prior auditor, first-year engagement flag.
2. **Classify entity size** against Companies Act 2006 s382 (small) / s384A (micro) / s465 (medium) using the two-out-of-three rule:
   - Micro: turnover ≤ £632k, BS ≤ £316k, employees ≤ 10
   - Small: turnover ≤ £10.2m, BS ≤ £5.1m, employees ≤ 50
   - Medium: turnover ≤ £36m, BS ≤ £18m, employees ≤ 250
3. **Identify PIE status** — triggers ISQM 1 EQR requirement and FRC Ethical Standard 2024 long-association rotation rules.
4. **Delegate framework selection** to `audit-frs-framework-selector` skill.
5. **Delegate preliminary materiality** to `audit-materiality-calc` skill.
6. **Delegate preliminary risk assessment** to `audit-risk-assessment` skill.
7. **Propose team composition:**
   - Base: signing partner + audit manager + senior + junior
   - PIE → add EQR partner (ISQM 1 para 37)
   - Systems reliance strategy → add IT auditor
   - Fair value FSLIs > performance materiality → add valuation specialist
   - Group audit → add group engagement team (ISA 600)
8. **Build engagement timeline** with regulatory deadlines:
   - Companies House filing: 9 months (private) / 6 months (public) after YE
   - Corporation tax: 12 months after period end
   - FCA/PRA regulated: sector-specific reporting deadlines
9. **Output ISA 300 planning memo** skeleton ready for signing partner review.

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| legalName | string | yes | Registered company name |
| companyNumber | string | yes | Companies House CRN |
| yearEnd | YYYY-MM-DD | yes | Accounting year-end date |
| turnover | number (GBP) | yes | Annual revenue |
| balanceSheetTotal | number (GBP) | yes | Total assets |
| averageEmployees | integer | yes | Average headcount in period |
| sector | enum | yes | bank, insurer, charity, pension, LLP, PIE, other |
| ownership | enum | yes | listed, AIM, private, subsidiary |
| priorAuditor | string | no | Name of predecessor auditor or null |
| firstYearEngagement | boolean | yes | True if first year as auditor |

## Outputs

- ISA 300 planning memo (structured markdown or docx via export)
- Entity classification table
- Team composition with justification
- Engagement timeline with key dates
- Cross-references to ISA 210 (engagement terms), ISA 220 (quality management), ISA 315 (risk)

## Codebase references

- `src/StandardsLibrary.js` — ISA 200, 210, 220, 230, 300, 315 definitions
- `src/RegulatoryData.js` — Companies Act 2006 thresholds, FRC Ethical Standard
- `src/ComplianceFrameworks.js` — Regulatory body requirements
- `src/agents/definitions/planning.js` — Planning agent logic
