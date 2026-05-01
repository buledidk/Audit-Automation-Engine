---
name: audit-going-concern
description: Assess going concern per ISA (UK) 570 (Revised) including evaluation of management's assessment, identification of material uncertainties, and impact on the auditor's report. Triggers on "going concern", "GC assessment", "material uncertainty", "viability", "cash flow forecast", "solvency", "liquidity risk". Covers the enhanced UK requirements including the viability statement for premium-listed entities.
---

## When to use

- User asks to assess going concern for an entity
- User provides financial data indicating potential going concern risk
- Mandatory procedure in every audit (ISA 570 para 6)
- User asks about going concern disclosures or auditor reporting implications
- User mentions cash flow forecast review or covenant compliance

## Actions

1. **Evaluate management's assessment** (ISA 570 para 12):
   - Has management performed a going concern assessment? (required by FRS 102 s3.8 / IAS 1 para 25)
   - Period covered: minimum 12 months from date of approval of financial statements
   - UK enhancement: same period as directors' assessment, disclose if < 12 months from signing date
   - For premium-listed: does the viability statement cover at least 3 years? (UK Corporate Governance Code Provision 31)

2. **Identify going concern indicators** — financial and operational:

   | Category | Indicators |
   |----------|-----------|
   | Financial | Net current liability position, net liability position, adverse key financial ratios, inability to pay creditors on time, inability to comply with loan covenants, change from credit to COD, inability to obtain financing, significant operating losses |
   | Operating | Management intent to liquidate/cease, loss of key market/customer/supplier, labour difficulties, shortage of critical supplies, emergence of successful competitor |
   | Other | Non-compliance with capital requirements, pending legal/regulatory proceedings, changes in legislation/policy, uninsured catastrophes |

3. **Perform audit procedures:**
   - Analyse and discuss cash flow forecasts with management
   - Review events after year-end for going concern evidence
   - Review loan agreements and covenant compliance (actual vs required ratios)
   - Read board minutes for going concern discussion and evidence of assessment
   - Inquire of management about plans for future actions
   - Obtain management written representation regarding plans and feasibility
   - Evaluate management's plans: are they feasible? will they resolve the situation?
   - Consider sensitivity analysis on forecasts (stress testing)

4. **Assess the period of consideration:**
   - UK requirement: at least 12 months from date financial statements are approved (not year-end)
   - Practical: typically 12-18 months from year-end
   - Known events beyond the assessment period must still be disclosed

5. **Determine reporting impact:**

   | Scenario | Going concern basis appropriate? | Material uncertainty? | Report impact |
   |----------|--------------------------------|----------------------|---------------|
   | No issues | Yes | No | Unmodified, GC section in report confirms no MU identified |
   | Issues exist but resolved | Yes | No | Unmodified, may include EOM or KAM |
   | Material uncertainty exists, adequately disclosed | Yes | Yes | Unmodified + separate "Material Uncertainty Related to Going Concern" section (ISA 570 para 22) |
   | Material uncertainty exists, NOT adequately disclosed | Yes | Yes | Qualified or adverse opinion (ISA 570 para 23) |
   | Going concern basis NOT appropriate | No | N/A | Adverse opinion (ISA 570 para 21) |

6. **Draft working paper and conclusions** including:
   - Assessment of indicators (present / absent / mitigated)
   - Procedures performed and evidence obtained
   - Evaluation of management's assessment
   - Conclusion on appropriateness of going concern basis
   - Conclusion on existence of material uncertainty
   - Impact on auditor's report
   - ISA 570 disclosure adequacy checklist

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| entityName | string | yes | Entity under audit |
| yearEnd | YYYY-MM-DD | yes | Accounting year-end date |
| expectedSigningDate | YYYY-MM-DD | no | Expected date of audit report signing |
| financials | object | yes | Key figures: cash, net current assets, net assets, PBT, operating cash flow |
| loanCovenants | object[] | no | Covenant terms and actual vs required metrics |
| cashFlowForecast | object | no | Management's cash flow forecast summary |
| isPremiumListed | boolean | no | Triggers viability statement review |
| knownIndicators | string[] | no | Already-identified GC risk indicators |
| managementPlans | string | no | Summary of management's plans to address GC risks |

## Outputs

- Going concern indicator checklist (flagged/clear)
- Procedures schedule and evidence summary
- Management assessment evaluation
- Material uncertainty conclusion
- Auditor's report impact recommendation
- ISA 570 compliance working paper

## Codebase references

- `src/StandardsLibrary.js` — ISA 570 (Going Concern)
- `src/agents/definitions/solvencyGoingConcern.js` — Going concern agent logic (renamed from completion)
- `src/RegulatoryData.js` — UK Corporate Governance Code requirements
- `src/AuditMethodology.js` — Going concern procedures
