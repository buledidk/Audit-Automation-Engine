# Audit Framework Quick Reference

## Phase Overview

| Phase | Duration | Objective | Key Output |
|-------|----------|-----------|-----------|
| **1. Planning** | 1-2 wks | Establish strategy & plan | Audit plan, materiality |
| **2. Risk Assessment** | 1-2 wks | Identify & assess risks | Risk memo, control docs |
| **3. Interim** | 1-3 wks | Test controls & gather evidence | Control testing results |
| **4. Final** | 1-3 wks | Substantive procedures | Testing files, adjustments |
| **5. Completion** | 1 wk | Finalize procedures | QC sign-off, conclusions |
| **6. Reporting** | 1-2 wks | Opinion & communication | Audit report, mgmt letter |

---

## Key ISA Standards by Phase

### Planning
- **ISA 200**: Overall Objectives
- **ISA 210**: Engagement Terms
- **ISA 220**: Quality Control
- **ISA 320**: Materiality
- **ISA 330**: Risk Response

### Risk Assessment
- **ISA 315**: Risk Identification
- **ISA 330**: Audit Response

### Interim & Final
- **ISA 330**: Audit Procedures
- **ISA 500**: Audit Evidence
- **ISA 501**: Specific Considerations
- **ISA 505**: Confirmations
- **ISA 540**: Estimates

### Completion & Reporting
- **ISA 560**: Subsequent Events
- **ISA 570**: Going Concern
- **ISA 580**: Representations
- **ISA 700**: Audit Opinion
- **ISA 705**: Modified Opinions

---

## Planning Phase Checklist

- [ ] Engagement letter signed
- [ ] Independence confirmed
- [ ] Team assigned
- [ ] Materiality calculated
- [ ] Preliminary risks identified
- [ ] Audit strategy documented
- [ ] Audit plan prepared
- [ ] Quality control assigned

---

## Risk Assessment Phase Checklist

- [ ] Business understanding documented
- [ ] Inherent risks identified
- [ ] Control environment assessed
- [ ] Controls documented
- [ ] Walkthroughs completed
- [ ] Risk response planned
- [ ] Audit program updated

---

## Interim Phase Checklist

- [ ] Control testing completed
- [ ] Confirmations sent
- [ ] Revenue cycle procedures done
- [ ] Purchasing cycle procedures done
- [ ] Payroll procedures completed
- [ ] Interim analytics performed
- [ ] Management discussion held

---

## Final Phase Checklist

- [ ] Substantive procedures completed
- [ ] All accounts tested
- [ ] Estimates evaluated
- [ ] Subsequent events reviewed
- [ ] Management representations obtained
- [ ] Misstatements accumulated
- [ ] Quality review completed

---

## Completion Phase Checklist

- [ ] Final analytics completed
- [ ] Specialist reports reviewed
- [ ] Management adjustments processed
- [ ] Audit findings summarized
- [ ] Going concern finalized
- [ ] Engagement QC review signed
- [ ] Audit file complete

---

## Reporting Phase Checklist

- [ ] Opinion formed
- [ ] Auditor report drafted
- [ ] Key audit matters identified
- [ ] Governance communication prepared
- [ ] Final financial statements reviewed
- [ ] Report signed
- [ ] Audit committee communication sent
- [ ] Management letter delivered

---

## Materiality Benchmarks

| Type | Benchmark | Range |
|------|-----------|-------|
| **Revenue-Based** | Annual Revenue | 5-10% |
| **Profit-Based** | Profit Before Tax | 5-10% |
| **Asset-Based** | Total Assets | 1-2% |
| **Equity-Based** | Equity | 1-2% |

---

## Control Testing Framework

**Walkthrough**: Single transaction trace → Documents review → System review

**Compliance Testing**: Multiple transactions → Deviations identified → Effectiveness assessed

**Operating Effectiveness**: High confidence in control operation → Can reduce substantive procedures

---

## Substantive Procedures Summary

| Account | Key Procedures |
|---------|-----------------|
| **Receivables** | Confirmations, aging analysis, collectibility |
| **Inventory** | Physical observation, pricing, obsolescence |
| **Fixed Assets** | Additions, disposals, depreciation, impairment |
| **Debt** | Existence, terms, covenants, interest |
| **Equity** | Authorization, completeness, restrictions |
| **Revenue** | Cutoff, authorization, completeness |
| **Expenses** | Accruals, authorization, allocation |

---

## Regional Requirements Summary

### UK (FRC)
- ISA (UK) compliance
- Auditor rotation 10-20 years
- Non-audit services cap (70%)
- KAM for PIEs
- Viability statement

### EU
- EU Regulation 537/2014
- Extended auditor report
- Auditor rotation 10-20 years
- Audit fee disclosure
- QA review every 6 years

### US
- PCAOB (public) / AICPA (non-public)
- Internal control opinion (SOX 404)
- Partner rotation 5 years
- Audit committee pre-approval
- COSO alignment

### Pakistan
- ISA + Local Companies Ordinance
- FBR compliance
- Tax audit procedures
- Form A Certificate
- SBP guidelines

---

## Documentation Essentials

**Every Phase**:
- Working papers with clear cross-references
- Significant judgments documented
- Unusual items explained
- Review sign-offs and dates

**Planning Phase**:
- Engagement letter
- Materiality schedule
- Risk assessment memo

**Risk Assessment**:
- Business understanding docs
- Risk identification matrix
- Control documentation

**Testing Phases**:
- Test procedures and results
- Sample selection and evaluation
- Exception analysis
- Conclusion memos

**Final/Completion**:
- Misstatement summary
- Management representations
- Quality control sign-off

**Reporting**:
- Opinion basis memo
- Auditor report
- Management letter

---

## Going Concern Assessment

**Evaluate**:
1. Financial condition through projections
2. Debt covenant compliance
3. Liquidity and solvency
4. Refinancing plans
5. Management commitment to plans

**Document**:
- Assessment rationale
- Management plans reviewed
- Adequacy of disclosure

**Report**:
- Unqualified with emphasis of matter, OR
- Qualified opinion, OR
- Disclaimer if severe uncertainty

---

## Quality Control Checkpoints

| Phase | Checkpoint |
|-------|-----------|
| Planning | Engagement QC review approval |
| Risk Assessment | Risk assessment approval |
| Interim | Control testing sign-off |
| Final | Substantive procedures completion |
| Completion | QC final review sign-off |
| Reporting | Partner sign-off on report |

---

## Common ISA Violations to Avoid

❌ **Insufficient Evidence**
- ✓ Test sufficient items to support conclusions
- ✓ Document evidence obtained
- ✓ Evaluate sufficiency and appropriateness

❌ **No Documentation**
- ✓ Document all significant judgments
- ✓ Include basis for conclusions
- ✓ File complete and organized

❌ **Skipped Procedures**
- ✓ Complete all planned procedures
- ✓ Document changes and rationale
- ✓ Justify any skipped procedures

❌ **Independence Threats**
- ✓ Annual independence confirmation
- ✓ No prohibited services
- ✓ Disclose to audit committee

❌ **Inadequate Estimates Evaluation**
- ✓ Evaluate methodology
- ✓ Test assumptions
- ✓ Assess for management bias

---

## Useful Links

- **Framework Index**: `src/frameworks/AuditFrameworkIndex.js`
- **Planning Guide**: `src/audit-stages/planning/Planning_Stage.js`
- **ISA Framework**: `src/frameworks/isa-standards/ISA_Framework.js`
- **Regional Standards**: `src/frameworks/regional-standards/Regional_Standards.js`
- **Requirements**: `src/requirements/AuditRequirementsFramework.js`

---

**Quick Start**: Import `AuditFrameworkIndex` and use methods like:
- `getPhase()` - Get phase by name/number
- `getAllPhases()` - Get all phases in order
- `getPhaseDocumentation()` - Required docs
- `getPhaseControlPoints()` - QC checkpoints
