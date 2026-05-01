---
name: audit-substantive-procedure-design
description: Design substantive audit procedures responding to assessed risks of material misstatement per ISA (UK) 330. Triggers on "design procedures", "substantive tests", "audit programme", "test of details", "substantive analytical procedures", or when risk assessment outputs need procedure responses. Maps each assessed risk to specific procedures by assertion, FSLI, timing, and extent.
---

## When to use

- User asks to design audit procedures for specific risks or FSLIs
- User has completed risk assessment and needs procedure responses
- Follows from `audit-risk-assessment` skill output
- User asks about tests of details vs substantive analytical procedures
- User asks about direction of testing for specific assertions

## Actions

1. **Map risks to procedures** — for each risk from the risk register:
   - Identify the relevant FSLI and assertion
   - Determine nature: test of details, substantive analytical procedure (SAP), or combination
   - Higher RoMM → more reliance on tests of details over SAPs
   - Significant risks → tests of details mandatory (SAPs alone insufficient per ISA 330 para 21)

2. **Design tests of details** per assertion and direction of testing:

   | Assertion | Direction | Typical procedures |
   |-----------|-----------|-------------------|
   | Existence | From records → physical/confirmation | Inventory count, bank confirmation, debtor circularisation |
   | Completeness | From source → records | Goods received after YE, unrecorded liabilities search, supplier statement reconciliation |
   | Accuracy | Recalculate, agree to source | Recalculate depreciation, agree invoices to ledger |
   | Valuation | Independent estimate, specialist | NRV testing, impairment review, ECL model review |
   | Cut-off | Test transactions around YE | Sales/purchase cut-off testing, last delivery notes |
   | Rights & obligations | Inspect legal docs, confirmations | Title deeds, lease agreements, legal confirmations |
   | Classification | Review coding, disclosure | Chart of accounts mapping, FSLI classification review |
   | Occurrence | Vouch from records to source | Revenue testing to contracts/delivery, expense to invoice |

3. **Design substantive analytical procedures** (ISA 520):
   - Develop independent expectation using reliable data
   - Define acceptable threshold (relate to materiality)
   - Compare expectation to recorded amount
   - Investigate and corroborate significant differences
   - Suitable for: revenue (where predictable), payroll, depreciation, interest income/expense, rent

4. **Set timing of procedures:**
   - Interim testing (pre year-end): controls testing, cut-off at interim, walkthroughs
   - Year-end: inventory count, bank confirmations, key balance testing
   - Final (post year-end): subsequent events, going concern, completion procedures
   - Roll-forward procedures needed if interim substantive testing performed

5. **Set extent of procedures:**
   - Link to sample sizes via `audit-sampling-plan` skill
   - 100% testing for individually significant items > PM
   - Stratified sampling for remaining population
   - Greater extent for higher-risk assertions

6. **Address mandatory procedures:**
   - External confirmations for banks (ISA 505) — always
   - External confirmations for debtors — unless impracticable
   - Inventory attendance (ISA 501) — unless immaterial or impracticable
   - Journal entry testing (ISA 240) — always (delegate to `audit-journal-entry-testing`)
   - Subsequent events review (ISA 560) — always
   - Going concern assessment (ISA 570) — always (delegate to `audit-going-concern`)

7. **Output audit programme** with:
   - Procedure reference, risk addressed, assertion, FSLI
   - Nature (TOD/SAP), timing (interim/YE/final), extent
   - Source documents and evidence required
   - ISA cross-reference

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| riskRegister | array | yes | Output from audit-risk-assessment (risk ID, FSLI, assertion, RoMM rating) |
| materialityLevels | object | yes | PM, TE, trivial from audit-materiality-calc |
| controlsRelianceDecisions | object | no | Which areas have controls reliance strategy |
| entityProfile | object | yes | Sector, size, complexity |
| priorYearProgramme | object | no | Prior year procedures for consistency |

## Outputs

- Detailed audit programme by FSLI and assertion
- Procedure-to-risk mapping matrix
- Timing schedule (interim / year-end / final)
- Sampling requirements summary (feeds to `audit-sampling-plan`)
- ISA 330 compliance checklist

## Codebase references

- `src/TestingProgrammes.js` — Pre-built test programs by FSLI
- `src/StandardsLibrary.js` — ISA 330, ISA 500, ISA 501, ISA 505, ISA 520
- `src/AuditMethodology.js` — Assertion framework, direction of testing
- `src/ChartOfAccounts.js` — Account-to-FSLI mapping
- `src/CrossReferenceIndex.js` — Inter-standard procedure cross-references
