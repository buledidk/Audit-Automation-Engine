---
name: audit-journal-entry-testing
description: Design and evaluate journal entry testing procedures per ISA (UK) 240 to address the presumed risk of management override of controls. Triggers on "journal entry testing", "JET", "management override", "unusual journals", "fraud risk procedures", or when designing ISA 240 responses. Covers population analysis, selection criteria, and evaluation of results.
---

## When to use

- User asks to design journal entry testing procedures
- Mandatory in every audit — ISA 240 para 32(a) presumes risk of management override
- User asks about fraud risk procedures
- User asks about unusual or unexpected journal entries
- User wants to analyse a journal population for high-risk entries

## Actions

1. **Understand the journal entry population:**
   - Obtain complete journal listing for the period (all posted entries)
   - Identify the source systems and journal types:
     - Automated/system-generated (ERP postings, bank feeds)
     - Manual journals (highest risk — ISA 240 para A43)
     - Top-side/consolidation adjustments (highest risk for groups)
     - Closing/period-end entries (higher risk)
     - Standard/recurring vs non-standard/non-recurring

2. **Define high-risk journal characteristics** for selection:

   | Criterion | Risk rationale |
   |-----------|---------------|
   | Posted by senior management / directors | Override risk — those with authority to bypass controls |
   | Posted outside normal business hours | Unusual timing suggests concealment |
   | Posted at period-end or after period-end | Manipulation of results |
   | Round-number amounts | May indicate estimation or fabrication |
   | Entries to unusual account combinations | Revenue to expense, P&L to balance sheet |
   | Entries with no / vague descriptions | Lack of business rationale |
   | Entries posted to seldom-used accounts | Potential parking accounts |
   | Entries that eliminate intercompany differences | Consolidation manipulation |
   | Entries affecting revenue recognition | Presumed fraud risk area (ISA 240 para 26) |
   | Entries posted by users with no regular posting access | Unusual access patterns |
   | Last entry in a sequence before reporting | "Plugging" to hit targets |

3. **Select journal entries for testing:**
   - Apply data analytics to full population (filter by criteria above)
   - Use professional judgement to select from filtered population
   - Consider: CAAT-based extraction, Benford's Law analysis on amounts, keyword search on descriptions
   - Ensure unpredictability (ISA 240 para 30) — vary criteria between periods
   - Test a representative number (no fixed rule — risk-based)

4. **Perform testing procedures:**
   - For each selected entry:
     - Agree to supporting documentation (invoice, contract, calculation, approval)
     - Verify posting date, amount, account coding, description
     - Confirm appropriate authorisation per delegation of authority
     - Assess business rationale — does the entry make commercial sense?
     - Check for reversal pattern (entry + reversal around period-end = window dressing)
   - For top-side adjustments:
     - Agree to management calculation or board minute
     - Verify elimination/consolidation logic
     - Confirm not used to override underlying entity entries

5. **Evaluate results:**
   - Document each tested entry: pass/fail/exception
   - For exceptions: obtain management explanation, evaluate plausibility
   - Consider whether exceptions indicate broader fraud risk
   - Report all misstatements to ISA 450 accumulation schedule
   - If fraud suspected → ISA 240 paras 35-37 (communicate to TCWG, consider withdrawal)

6. **Output journal entry testing working paper** with:
   - Population analysis summary (total entries, by type, by user, by period)
   - Selection criteria applied with justification
   - Selected entries schedule
   - Testing results matrix
   - Exception analysis
   - Conclusion on management override risk

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| entityName | string | yes | Entity under audit |
| yearEnd | YYYY-MM-DD | yes | Accounting year-end |
| journalPopulationStats | object | no | Total entries, entries by type, entries by user if available |
| highRiskCriteria | string[] | no | Override default criteria with specific concerns |
| materialityLevels | object | yes | PM and TE from audit-materiality-calc |
| priorYearFindings | string[] | no | Journal testing issues from prior year |
| accountingSystem | string | no | ERP/system name for data extraction guidance |

## Outputs

- Journal population analysis summary
- Selection criteria matrix with risk rationale
- Testing schedule template
- Results evaluation framework
- ISA 240 compliance checklist
- Management override risk conclusion

## Codebase references

- `src/StandardsLibrary.js` — ISA 240 (Fraud), ISA 330 para 21 (significant risk procedures)
- `src/AuditMethodology.js` — Fraud risk procedures, journal testing methodology
- `src/TestingProgrammes.js` — Pre-built journal entry test programs
- `src/agents/definitions/testing.js` — Testing agent journal entry workflow
