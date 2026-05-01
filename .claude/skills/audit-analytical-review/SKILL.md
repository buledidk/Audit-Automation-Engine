---
name: audit-analytical-review
description: Perform analytical procedures per ISA (UK) 520 at all three audit stages — preliminary (planning), substantive (execution), and final overall review (completion). Triggers on "analytical review", "analytical procedures", "variance analysis", "ratio analysis", "trend analysis", "expectation model", "final analytical review". Supports both simple comparisons and sophisticated expectation-based models.
---

## When to use

- User asks to perform analytical procedures at any audit stage
- User provides financial data and asks for variance analysis or ratio analysis
- Part of planning (ISA 315 para 14) — mandatory
- Substantive analytical procedure (ISA 520) — when designed as primary test
- Final overall review (ISA 520 para 6) — mandatory at completion
- User asks about building an independent expectation

## Actions

1. **Determine the analytical procedure stage:**
   - **Planning analytics** (ISA 315 para 14): understand the entity, identify unusual trends, direct risk assessment
   - **Substantive analytics** (ISA 520 paras 5-7): designed as substantive procedure to gather audit evidence
   - **Final overall review** (ISA 520 para 6): mandatory at completion, confirm financial statements consistent with auditor's understanding

2. **Perform planning analytical procedures:**
   - Year-on-year comparison of all material FSLIs
   - Ratio analysis (liquidity, profitability, gearing, efficiency)
   - Industry/peer comparison where data available
   - Trend analysis (3-5 year where available)
   - Identify areas requiring further investigation → feed to risk assessment
   - Flag unexpected relationships or departures from expected trends

3. **Design substantive analytical procedures** (ISA 520 para 5):
   - **Step 1 — Develop expectation:** Use independent and reliable data to build an expectation of the recorded amount
     - Sources: prior year actuals, budgets, industry data, non-financial data, interrelationships between data
     - The expectation must be precise enough to identify misstatement > PM
   - **Step 2 — Define threshold:** What difference between expectation and recorded amount is acceptable?
     - Relate to performance materiality
     - Tighter threshold = more persuasive evidence
   - **Step 3 — Compare:** Expectation vs recorded amount
   - **Step 4 — Investigate:** If difference exceeds threshold:
     - Inquire of management
     - Corroborate explanation with additional evidence
     - Do NOT accept management explanation without corroboration (ISA 520 para 7)
   - **Step 5 — Conclude:** Is the recorded amount supported?

4. **Common analytical models:**

   | FSLI | Expectation model | Data inputs |
   |------|-------------------|-------------|
   | Revenue | Units × price, or prior year × growth rate | Sales volume, pricing, contracts |
   | Payroll | Headcount × average salary × 12 | HR records, pay scales, NIC/pension rates |
   | Depreciation | Asset base × weighted average rate | Fixed asset register, useful lives |
   | Interest expense | Average borrowings × average rate | Loan agreements, bank statements |
   | Rent | Contracted rent × months | Lease agreements |
   | Cost of sales | Revenue × expected margin | Historical margins, pricing changes |

5. **Perform final overall review** (ISA 520 para 6):
   - Read the financial statements as a whole
   - Consider whether they are consistent with auditor's understanding of the entity
   - Identify any material inconsistencies with knowledge obtained during the audit
   - Identify any previously unrecognised risks of material misstatement
   - If new risks identified → perform additional procedures before concluding

6. **Key ratios to compute:**
   - **Profitability:** Gross margin %, operating margin %, ROCE, ROE
   - **Liquidity:** Current ratio, quick ratio, cash conversion cycle
   - **Gearing:** Debt/equity, interest cover, net debt/EBITDA
   - **Efficiency:** Asset turnover, debtor days, creditor days, inventory days
   - **Sector-specific:** Solvency (insurance), CET1 (banks), reserves (charities)

7. **Output analytical review working paper** with:
   - Comparative analysis tables (CY vs PY vs Budget vs Expectation)
   - Ratio analysis with trends
   - Variance analysis with materiality flagging
   - Investigation notes for significant variances
   - Stage-specific conclusions

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| stage | enum | yes | planning, substantive, finalReview |
| currentYearFinancials | object | yes | Full trial balance or key FSLIs |
| priorYearFinancials | object | yes | Comparative figures |
| budgetFigures | object | no | Management budgets/forecasts |
| materialityLevels | object | yes | PM and TE |
| entityProfile | object | yes | Sector, size, business model |
| nonFinancialData | object | no | KPIs, headcount, volumes, unit prices |

## Outputs

- Comparative analysis table with variance analysis
- Ratio analysis with trend data
- Expectation models (for substantive analytics)
- Investigation register for significant variances
- Final overall review conclusion
- ISA 520/315 cross-references

## Codebase references

- `src/StandardsLibrary.js` — ISA 520 (Analytical Procedures), ISA 315 (risk assessment analytics)
- `src/AuditMethodology.js` — Analytical procedure methodology
- `src/agents/definitions/riskAssessment.js` — Planning analytics integration
- `src/agents/definitions/completion.js` — Final review analytics
- `src/services/accuracy-enhancements/` — Financial ratio calculation engines
