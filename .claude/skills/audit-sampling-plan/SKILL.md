---
name: audit-sampling-plan
description: Design audit samples per ISA (UK) 530 including sample size determination, selection method, and evaluation of results. Triggers on "sample size", "audit sampling", "how many items to test", "MUS", "monetary unit sampling", "statistical sampling", or when audit-substantive-procedure-design needs sample quantities. Supports both statistical and non-statistical approaches.
---

## When to use

- User asks how many items to test for a procedure
- User asks about sampling methodology (MUS, random, systematic, haphazard)
- Follows from `audit-substantive-procedure-design` for extent of testing
- User asks about evaluating sample results or projecting misstatements
- User needs to document sampling rationale for working papers

## Actions

1. **Determine sampling approach:**
   - **Statistical sampling** (MUS / classical variables) — required when: population is large and homogeneous, quantifiable results needed, regulatory expectation of statistical rigour
   - **Non-statistical sampling** — acceptable when: professional judgement sufficient, population is small or heterogeneous, combined with other procedures

2. **Calculate sample size — Monetary Unit Sampling (MUS):**
   ```
   Sample size = (Population value × Confidence factor) / Tolerable misstatement

   Where:
   - Confidence factor at 95% confidence, 0 expected errors = 3.0
   - Confidence factor at 90% confidence, 0 expected errors = 2.3
   - Tolerable misstatement = Performance materiality (TE)
   - Adjust for expected misstatement if > 0
   ```

   | Confidence | Expected errors = 0 | = 1 | = 2 |
   |------------|---------------------|-----|-----|
   | 95% | 3.00 | 4.75 | 6.30 |
   | 90% | 2.31 | 3.89 | 5.33 |
   | 80% | 1.61 | 3.00 | 4.28 |

3. **Calculate sample size — non-statistical:**
   - Consider: assurance required from this test alone, population size, tolerable misstatement, expected misstatement rate, stratification
   - Typical ranges:

   | Risk of material misstatement | Typical sample (no other procedures) |
   |-------------------------------|-------------------------------------|
   | High | 40-60 items |
   | Moderate | 20-40 items |
   | Low | 10-20 items |

   - Reduce if combined with effective controls testing or SAPs

4. **Select sampling method:**
   - **MUS / probability-proportional-to-size** — biases toward high-value items, ideal for overstatement testing
   - **Random** — every item equal chance, use random number generator
   - **Systematic** — every nth item, random start, ensure no pattern in population
   - **Haphazard** — no structured selection, only for non-statistical low-risk tests
   - **Block** — generally NOT acceptable for audit (ISA 530 para A13)

5. **Stratify the population:**
   - Items > PM → test 100% (individually significant)
   - Items between TE and PM → higher coverage stratum
   - Remaining items → sampling stratum
   - Negative/unusual items → separate testing

6. **Evaluate results and project misstatements:**
   - Factual misstatements found in sample
   - For MUS: calculate projected misstatement = (misstatement / sampled item value) × sampling interval
   - For non-statistical: project proportionally = (misstatement rate in sample × population value)
   - Compare total projected + known misstatements to PM
   - If projected > TE → extend testing or qualify conclusion
   - Document all misstatements for ISA 450 accumulation schedule

7. **Output sampling plan document** with:
   - Population definition and size
   - Sampling method and justification
   - Sample size calculation (showing all inputs)
   - Stratification tiers
   - Selection procedure instructions
   - Results evaluation template

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| populationDescription | string | yes | What is being sampled (e.g., "trade receivables > £500") |
| populationValue | number (GBP) | yes | Total monetary value of population |
| populationCount | integer | yes | Number of items in population |
| performanceMateriality | number (GBP) | yes | TE from audit-materiality-calc |
| riskRating | enum | yes | high, moderate, low — from risk assessment |
| expectedMisstatementRate | number | no | Expected error rate (0-100%), default 0 |
| samplingApproach | enum | no | statistical, nonStatistical — default based on population |
| otherProceduresAssurance | enum | no | none, some, significant — reduces sample if SAP or controls tested |

## Outputs

- Sample size with full calculation workings
- Stratification table
- Selection method and instructions
- Results evaluation template with projection formulas
- ISA 530 compliance documentation

## Codebase references

- `src/StandardsLibrary.js` — ISA 530 (Audit Sampling)
- `src/AuditMethodology.js` — Sampling methodology tables
- `src/TestingProgrammes.js` — Sample size defaults by test type
