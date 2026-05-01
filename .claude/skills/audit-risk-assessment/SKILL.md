---
name: audit-risk-assessment
description: Perform risk assessment per ISA (UK) 315 (Revised 2019) including understanding the entity, identifying and assessing risks of material misstatement at financial statement and assertion level, identifying significant risks, and designing overall audit responses. Triggers on "risk assessment", "identify risks", "significant risks", "inherent risk factors", "control environment", or when delegated from audit-engagement-scope.
---

## When to use

- User asks to assess audit risks for an entity
- User provides entity/industry information and asks about risk of material misstatement (RoMM)
- Delegated from `audit-engagement-scope` skill
- User asks about significant risks, fraud risk, or management override
- User asks about spectrum of inherent risk (ISA 315 Revised 2019 enhancement)

## Actions

1. **Understand the entity and its environment** (ISA 315 paras 19-27):
   - Industry, regulatory, and financial reporting framework
   - Nature of the entity (operations, ownership, governance, investments, structure, financing)
   - Accounting policies and their appropriateness
   - Entity's objectives, strategies, and business risks
   - Measurement and review of financial performance

2. **Understand the entity's internal control system** (ISA 315 paras 21-27):
   - Control environment (integrity, ethical values, management philosophy)
   - Entity's risk assessment process
   - Information system and communication (including IT environment)
   - Control activities relevant to the audit
   - Monitoring of controls

3. **Identify risks of material misstatement** at:
   - **Financial statement level** — pervasive risks affecting many assertions (e.g., going concern doubt, management integrity, economic downturn)
   - **Assertion level** — by FSLI class of transaction, account balance, and disclosure:
     - Transactions: occurrence, completeness, accuracy, cut-off, classification
     - Balances: existence, rights & obligations, completeness, valuation & allocation
     - Disclosures: occurrence & rights, completeness, classification & understandability, accuracy & valuation

4. **Assess inherent risk** using the spectrum of inherent risk (ISA 315 Revised 2019 para A-3):
   - Inherent risk factors: complexity, subjectivity, change, uncertainty, susceptibility to misstatement due to management bias or fraud
   - Rate each identified risk on the spectrum: low → moderate → high → very high
   - Higher inherent risk = more persuasive audit evidence required (ISA 330)

5. **Assess control risk:**
   - For each identified risk, assess whether controls are designed and implemented
   - Determine whether to test operating effectiveness (controls reliance strategy) or substantive-only
   - Document rationale for control reliance or non-reliance

6. **Identify significant risks** (ISA 315 para 28):
   - Risks requiring special audit consideration
   - Presumed significant risks: revenue recognition fraud (ISA 240 para 26), management override of controls (ISA 240 para 31)
   - Accounting estimates with high estimation uncertainty
   - Related party transactions outside normal course
   - Non-routine or unusual transactions

7. **Design overall audit responses** (ISA 330 paras 5-6):
   - Assign experienced staff to high-risk areas
   - Increase unpredictability of procedures
   - Changes to timing, nature, or extent of procedures

8. **Output risk assessment working paper** with:
   - Risk register (risk ID, description, assertion, FSLI, inherent risk rating, control risk rating, RoMM, significant risk flag)
   - ISA 315 cross-references
   - Planned audit response per risk (links to `audit-substantive-procedure-design`)

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| entityName | string | yes | Entity under audit |
| sector | string | yes | Industry sector |
| entityDescription | string | yes | Business overview, operations, structure |
| financialHighlights | object | no | Key financials (revenue, PBT, assets, liabilities) |
| priorYearIssues | string[] | no | Misstatements or control deficiencies from prior year |
| managementChanges | boolean | no | Changes in key management personnel |
| systemChanges | string[] | no | IT system or ERP changes in period |
| regulatoryChanges | string[] | no | New regulations or compliance requirements |
| fraudIndicators | string[] | no | Known fraud risk indicators |

## Outputs

- Risk register with inherent/control/RoMM ratings per assertion
- Significant risks schedule
- Overall audit strategy responses
- Control reliance decisions with rationale
- ISA 315/240/330 cross-reference matrix

## Codebase references

- `src/StandardsLibrary.js` — ISA 315, ISA 240, ISA 330 definitions
- `src/AuditMethodology.js` — Risk trilogy methodology, assertion framework
- `src/RegulatoryData.js` — Industry-specific risk factors
- `src/agents/definitions/riskAssessment.js` — Risk assessment agent logic
- `src/ComplianceFrameworks.js` — Regulatory risk factors (FCA, AML, GDPR)
