---
name: audit-file-reviewer
description: Perform hot review (engagement manager) or cold review (EQR / monitoring) of an audit file per ISA (UK) 220 (Revised) and ISQM 1. Triggers on "review the file", "file review", "hot review", "cold review", "EQR review", "quality review", "ISQM review", "audit file completeness". Checks documentation completeness, conclusion support, ISA compliance, and flags deficiencies.
---

## When to use

- User asks to review an audit file or working papers
- User asks about quality review requirements (ISA 220, ISQM 1)
- User asks about EQR (engagement quality review) scope
- User wants a completeness check of audit documentation
- Final step before signing the audit report
- Monitoring / cold file review for quality assurance

## Actions

1. **Determine review type:**
   - **Hot review (engagement manager/partner)** — during and at completion of the audit, before report signing
   - **EQR review** — independent partner review required for PIEs (ISQM 1 para 34-37) and other criteria
   - **Cold review / monitoring** — post-issuance quality review per ISQM 1 monitoring

2. **Apply ISA 220 (Revised) engagement quality requirements** (paras 13-31):
   - Direction, supervision, and review of the engagement team
   - Professional scepticism throughout
   - Relevant ethical requirements (independence, conflicts)
   - Acceptance and continuance
   - Engagement resources (competence, time, technology)
   - Engagement performance
   - Consultation on difficult or contentious matters
   - Differences of opinion resolved
   - Assembly of the final audit file within 60 days (ISA 230 para 14)

3. **Run completeness checklist** — verify all required documentation exists:

   | Area | Required documentation | ISA reference |
   |------|-----------------------|---------------|
   | Planning | Engagement letter, planning memo, materiality, risk assessment, audit strategy | ISA 210, 300, 315, 320 |
   | Understanding | Entity knowledge, IC understanding, IT environment, fraud discussion | ISA 315, 240, 250 |
   | Procedures | Audit programme, substantive test WPs, controls test WPs, sampling docs | ISA 330, 530 |
   | Specific areas | Going concern, related parties, estimates, subsequent events, laws & regs | ISA 570, 550, 540, 560, 250 |
   | Evidence | Confirmations, management representations, lawyer's letter, expert reports | ISA 505, 580, 501, 620 |
   | Communication | TCWG communications, management letter, control deficiencies | ISA 260, 265 |
   | Reporting | Draft financial statements, auditor's report, KAMs (if listed), EOM/OMs | ISA 700-706 |
   | Completion | Completion memo, subsequent events review, file assembly checklist | ISA 230, 560 |

4. **Assess conclusion support** for each material area:
   - Is the conclusion consistent with the evidence documented?
   - Are misstatements properly accumulated and evaluated (ISA 450)?
   - Are significant risks addressed with sufficient appropriate evidence?
   - Are professional judgements documented with reasoning?
   - Would an experienced auditor understand what was done and why?

5. **EQR-specific procedures** (ISQM 2):
   - Review significant judgements made by the engagement team
   - Review the basis for the auditor's report (opinion, GC, KAMs, EOM/OM)
   - Review selected working papers relating to significant judgements
   - Evaluate conclusions on independence
   - Evaluate whether appropriate consultation took place
   - EQR must be completed BEFORE the auditor's report is dated

6. **Flag deficiencies by severity:**
   - **Critical** — missing evidence for material balances, unsupported opinion, independence breach
   - **Major** — incomplete procedures for significant risks, missing management representations, unevaluated misstatements
   - **Minor** — formatting issues, missing cross-references, incomplete review trails, minor documentation gaps

7. **Output file review report** with:
   - Review type and scope
   - Completeness checklist (present/absent per item)
   - Conclusion support assessment by audit area
   - Deficiency register with severity ratings
   - Recommendations for remediation
   - Overall file quality assessment
   - Sign-off recommendation (ready to sign / remediation required)

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| reviewType | enum | yes | hotReview, eqr, coldReview, monitoring |
| entityName | string | yes | Entity under audit |
| yearEnd | YYYY-MM-DD | yes | Accounting year-end |
| isPIE | boolean | yes | Determines EQR requirement |
| auditFileContents | object | no | List of working papers present in the file |
| significantRisks | string[] | no | From risk assessment — to verify adequate responses |
| materialityLevels | object | no | PM/TE for evaluating sufficiency |
| misstatementsSummary | object | no | Accumulated misstatements for evaluation |

## Outputs

- File review completeness checklist
- Conclusion support assessment matrix
- Deficiency register with severity ratings
- Remediation action list
- Sign-off recommendation
- ISA 220/ISQM 1/ISQM 2 compliance report

## Codebase references

- `src/StandardsLibrary.js` — ISA 220, ISA 230, ISQM 1, ISQM 2
- `src/agents/definitions/review.js` — Review agent logic
- `src/agents/agentQualityAssessmentService.js` — Quality assessment service
- `src/services/auditDocumentationService.js` — Documentation completeness checks
- `src/AuditEngine_AURA.jsx` — signOffs, reviewStatus, reviewNotes state
