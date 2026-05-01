---
name: audit-materiality-calc
description: Calculate planning materiality, performance materiality, and trivial threshold for a UK statutory audit per ISA (UK) 320 and ISA (UK) 450. Triggers on "calculate materiality", "materiality threshold", "PM and TE", "trivial amount", or when delegated from audit-engagement-scope. Supports multiple benchmark options with justification and recalculation at completion stage.
---

## When to use

- User asks to calculate materiality for an audit
- User provides financial figures and asks for PM/TE/trivial
- Delegated from `audit-engagement-scope` skill
- User asks about changing materiality during the audit (ISA 320 para 12-13)
- User asks about specific materiality for particular FSLIs

## Actions

1. **Select appropriate benchmark** based on entity type and user circumstances:

   | Entity type | Primary benchmark | Typical range |
   |-------------|-------------------|---------------|
   | Profit-oriented (stable) | Profit before tax | 5-10% |
   | Profit-oriented (volatile) | 3-year average PBT or normalised PBT | 5-10% |
   | Revenue-driven / NFP | Revenue | 0.5-2% |
   | Asset-rich / holding co | Total assets / net assets | 1-2% |
   | Charity | Total income or total expenditure | 1-2% |
   | Regulated (bank) | Net assets / regulatory capital | 1-2% |
   | Public sector | Total expenditure | 0.5-2% |

2. **Calculate planning materiality (PM):**
   - Apply selected percentage to chosen benchmark
   - Document rationale for percentage chosen within the range
   - Consider prior year materiality for consistency
   - Consider user expectations and qualitative factors

3. **Calculate performance materiality (TE):**
   - Typically 50-75% of PM (ISA 320 para A13)
   - Factors increasing TE toward 75%: low misstatement history, stable entity, first year with clean prior
   - Factors decreasing TE toward 50%: history of misstatements, first-year engagement, complex group, high-risk entity
   - Document the factor-based justification

4. **Calculate trivial threshold (clearly trivial):**
   - Per ISA 450 para 5(c): typically 3-5% of PM
   - Below this, misstatements need not be accumulated
   - Must be disclosed in engagement letter per ISA 210

5. **Assess need for specific materiality:**
   - Related party transactions
   - Director/KMP remuneration
   - Regulatory capital/solvency ratios
   - Compliance-driven disclosures (e.g., political donations, auditor remuneration)
   - Apply lower materiality where users' decisions would be influenced

6. **Output materiality memo** with:
   - Selected benchmark and rationale
   - PM, TE, trivial amounts
   - Any specific materiality levels
   - Comparison to prior year
   - Completion stage recalculation guidance

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| profitBeforeTax | number (GBP) | no | Current year PBT |
| revenue | number (GBP) | no | Current year revenue |
| totalAssets | number (GBP) | no | Balance sheet total |
| netAssets | number (GBP) | no | Net assets / equity |
| entityType | enum | yes | profitOriented, NFP, charity, bank, publicSector, holdingCo |
| priorYearMateriality | number (GBP) | no | Prior year PM for comparison |
| misstatementHistory | enum | no | none, few, significant — drives TE percentage |
| isFirstYear | boolean | no | First year of engagement |

## Outputs

- Materiality calculation table (PM, TE, trivial)
- Benchmark selection justification
- Specific materiality levels (if applicable)
- Prior year comparison
- ISA 320/450 cross-references

## Codebase references

- `src/StandardsLibrary.js` — ISA 320 (Materiality), ISA 450 (Evaluation of Misstatements)
- `src/AuditMethodology.js` — Materiality methodology and benchmark tables
- `src/agents/definitions/planning.js` — Planning agent materiality workflow
