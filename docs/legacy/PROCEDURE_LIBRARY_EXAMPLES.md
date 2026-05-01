# AUDIT PROCEDURE LIBRARY - USAGE EXAMPLES

## Quick Start Examples

### Example 1: Generate Audit Program for Revenue Area (HIGH Risk, Manufacturing)

**Scenario:** Manufacturing company with high-risk revenue (3 major contracts worth £2m, representing 60% of annual revenue)

```javascript
import { AuditPlanner, SampleSizeCalculator } from './lib/auditProcedureHelper';

// Step 1: Create audit program for Revenue area
const auditProgram = AuditPlanner.createAuditProgram(
  'D3',                    // Audit area: Revenue & Receivables
  'HIGH',                  // Risk level (high-risk customer concentration)
  'MANUFACTURING'          // Industry (long-term contracts, retentions)
);

// Returns:
// {
//   area: 'D3 - Revenue & Receivables',
//   riskLevel: 'HIGH',
//   industry: 'MANUFACTURING',
//   totalProcedures: 30,
//   estimatedHours: 45,
//   keyAssertions: ['EXISTENCE', 'COMPLETENESS', 'ACCURACY', 'CUTOFF', 'VALUATION'],
//   keyRisks: [
//     'Fraudulent revenue recognition',
//     'Revenue from non-existent transactions',
//     'Performance obligation not satisfied',
//     'Stage of completion misstatement',
//     'Retention amount not properly disclosed'
//   ],
//   procedures: [
//     {
//       procedureId: 'D3.1',
//       title: 'Revenue Recognition Policy Compliance with FRS 15',
//       sampleSize: '100% (policy review)',
//       modifications: 'Include stage of completion method; test cost allocations per manufacturing contracts',
//       ...
//     },
//     {
//       procedureId: 'D3.2',
//       title: 'Revenue Transaction Testing - Performance Obligation Verification',
//       sampleSize: '60%',  // HIGH risk = 60%
//       modifications: 'Test stage of completion calculations; verify cost vs contract price; assess retention receivable',
//       ...
//     },
//     // ... 28 more procedures
//   ]
// }

// Step 2: Calculate sample size for revenue testing
const revenueSample = SampleSizeCalculator.calculate(
  2000000,  // Total revenue population (£2m)
  150,      // Number of revenue transactions
  'HIGH'    // Risk level
);

// Returns:
// {
//   riskLevel: 'HIGH',
//   populationValue: 2000000,
//   populationCount: 150,
//   percentage: '60%',
//   sampleSize: 90,        // Test 90 transactions
//   stratifiedPerStrata: 30,
//   selectionMethod: 'Stratified random or systematic'
// }

// Step 3: Plan stratified sample
const stratification = SampleSizeCalculator.calculateStratified(
  [
    { name: 'Major Contracts (>£100k)', value: 1500000, count: 3 },      // 3 contracts, 60% of revenue
    { name: 'Medium Contracts (£10-100k)', value: 400000, count: 25 },   // 25 contracts, 30% of revenue
    { name: 'Small Sales (<£10k)', value: 100000, count: 122 }           // 122 sales, 10% of revenue
  ],
  'HIGH'
);

// Returns:
// [
//   {
//     stratumName: 'Major Contracts (>£100k)',
//     populationValue: 1500000,
//     populationCount: 3,
//     percentage: '60%',
//     sampleSize: 3,         // Test all 3 major contracts (100%)
//     stratifiedPerStrata: 1
//   },
//   {
//     stratumName: 'Medium Contracts (£10-100k)',
//     populationValue: 400000,
//     populationCount: 25,
//     percentage: '60%',
//     sampleSize: 15,        // Test 15 medium contracts (60%)
//     stratifiedPerStrata: 5
//   },
//   {
//     stratumName: 'Small Sales (<£10k)',
//     populationValue: 100000,
//     populationCount: 122,
//     percentage: '60%',
//     sampleSize: 73,        // Test 73 small sales (60%)
//     stratifiedPerStrata: 24
//   }
// ]

// Audit program is ready to execute!
console.log(`Estimated hours: ${auditProgram.estimatedHours}`);
console.log(`Total procedures: ${auditProgram.totalProcedures}`);
console.log(`Sample size: ${revenueSample.sampleSize} transactions`);
```

---

### Example 2: Execute Revenue Procedure D3.2 with Exception Evaluation

**Scenario:** Testing revenue transactions for existence and accuracy

```javascript
import { ProcedureSelector, ExceptionEvaluator, TrackerManager } from './lib/auditProcedureHelper';
import { PROCEDURE_D3_REVENUE } from './data/auditProcedureLibrary';

// Step 1: Get procedure D3.2
const procedure = PROCEDURE_D3_REVENUE.find(p => p.procedureId === 'D3.2');

console.log('PROCEDURE: ' + procedure.title);
console.log('Assertions: ' + procedure.assertions.join(', '));
console.log('Sample Size (HIGH risk): ' + procedure.sampleSize.HIGH);

// Step 2: Create execution tracker
let tracker = TrackerManager.create('D3.2');
tracker.preparer = 'John Smith (Senior Accountant)';
tracker.dateStarted = new Date('2026-02-15');
tracker = TrackerManager.updateStatus(tracker, 'In Progress');

// Step 3: Execute procedure (Pseudo-code showing exception discovery)
const testedTransactions = [
  { id: 'INV001', date: '2025-12-15', amount: 15000, status: 'PASS' },
  { id: 'INV002', date: '2025-12-18', amount: 22000, status: 'PASS' },
  { id: 'INV003', date: '2025-12-20', amount: 18500, status: 'EXCEPTION' },  // Revenue before delivery
  { id: 'INV004', date: '2025-12-28', amount: 45000, status: 'PASS' },
  { id: 'INV005', date: '2025-12-31', amount: 35000, status: 'PASS' },
  // ... 85 more transactions tested
];

const exceptions = [
  {
    transactionId: 'INV003',
    type: 'Revenue recorded before delivery',
    amount: 18500,
    cause: 'Invoice dated Dec 20; delivery on Jan 2 (post year-end)',
    fraudRisk: true,
    controlGap: true
  },
  {
    transactionId: 'INV041',
    type: 'Side agreement reducing effective price',
    amount: 8000,
    cause: 'Verbal discount not documented in order',
    fraudRisk: true,
    controlGap: true
  }
];

// Record exceptions
exceptions.forEach(exc => {
  tracker = TrackerManager.recordException(tracker, {
    description: `${exc.type}: ${exc.amount}`,
    amount: exc.amount,
    cause: exc.cause,
    resolution: 'Adjustment proposed'
  });
});

// Step 4: Evaluate exceptions
const evaluation = ExceptionEvaluator.evaluate(
  exceptions,                    // 2 exceptions found
  90,                            // Sample size: 90 transactions
  150,                           // Population: 150 transactions
  50000                          // Materiality: £50k
);

console.log('\n=== EXCEPTION EVALUATION RESULTS ===');
console.log(`Exceptions Found: ${evaluation.exceptionCount}`);
console.log(`Sample Size: ${evaluation.sampleSize}`);
console.log(`Exception Rate: ${evaluation.exceptionRate}`);
console.log(`Projected Impact: £${evaluation.projectedPopulationImpact}`);
console.log(`Materiality: £${evaluation.materialityThreshold}`);
console.log(`Is Material: ${evaluation.isMaterial}`);
console.log(`Audit Conclusion: ${evaluation.auditConclusion}`);
console.log(`Action Required: ${evaluation.actionRequired}`);

// Returns:
// {
//   exceptionCount: 2,
//   sampleSize: 90,
//   exceptionRate: '2.22%',
//   projectedPopulationImpact: 3333,
//   materialityThreshold: 50000,
//   isMaterial: false,
//   qualitativeFactors: {
//     nature: 'Revenue before delivery, Side agreement reducing price',
//     cause: 'Random',
//     controlDeficiency: 'Yes',
//     fraudIndicator: 'Yes'
//   },
//   auditConclusion: 'INVESTIGATE FURTHER',
//   actionRequired: 'Evaluate cause; recommend increase sample',
//   singleExceptionImplications: null,
//   threeExceptionImplications: null
// }

// Step 5: Escalate finding
console.log('\nACTION: Escalate to Manager for fraud assessment');
console.log('ACTION: Expand sample to 100% for this procedure');
console.log('ACTION: Review revenue recognition controls');
console.log('ACTION: Consider fraud brainstorming discussion');

// Record conclusion
tracker = TrackerManager.recordHours(tracker, 8.5);
tracker.reviewer = 'Jane Doe (Manager)';
tracker = TrackerManager.updateStatus(tracker, 'Complete');
tracker.reviewerApprovalDate = new Date('2026-02-20');

const summary = TrackerManager.getSummary(tracker);
console.log('\nTRACKER SUMMARY:', summary);
```

---

### Example 3: Bad Debt Provision Testing (D3.6) with Estimation

**Scenario:** Assessing bad debt provision adequacy

```javascript
import { TrackerManager, AuditPlanner } from './lib/auditProcedureHelper';

// Get D3.6 procedure
const procedure = /* D3.6 - Bad Debt Provision */;

// Step 1: Historical analysis (from procedure execution)
const agedAR = {
  current: 800000,
  '1-30': 150000,
  '31-60': 45000,
  '61-90': 20000,
  '90+': 35000,
  total: 1050000
};

const historicalDefaultRates = {
  current: 0.5,      // 0.5% write-off rate
  '1-30': 2.0,       // 2% write-off rate
  '31-60': 5.0,      // 5% write-off rate
  '61-90': 10.0,     // 10% write-off rate
  '90+': 40.0        // 40% write-off rate (very aged)
};

// Step 2: Calculate required provision
const requiredProvision =
  (agedAR.current * historicalDefaultRates.current / 100) +
  (agedAR['1-30'] * historicalDefaultRates['1-30'] / 100) +
  (agedAR['31-60'] * historicalDefaultRates['31-60'] / 100) +
  (agedAR['61-90'] * historicalDefaultRates['61-90'] / 100) +
  (agedAR['90+'] * historicalDefaultRates['90+'] / 100);

// Returns: 14,000 + 3,000 + 2,250 + 2,000 + 14,000 = £35,250 required

// Step 3: Compare to recorded provision
const recordedProvision = 28000;  // From GL

const provisionGap = requiredProvision - recordedProvision;
console.log(`Recorded Provision: £${recordedProvision}`);
console.log(`Required Provision: £${requiredProvision.toFixed(0)}`);
console.log(`Gap: £${provisionGap.toFixed(0)}`);

// Step 4: Evaluate materiality
const materiality = 50000;
const isAdjustmentMaterial = provisionGap > (materiality * 0.05);  // >5% of materiality
console.log(`Adjustment Material (>£${materiality * 0.05}): ${isAdjustmentMaterial}`);

// Step 5: Management response
const managementResponse = {
  explanation: 'We believe current provision is adequate based on latest customer communications',
  supportingEvidence: [
    'Customer XYZ paid 2 weeks late but ultimately collected',
    'Customer ABC agreed payment plan for £8k balance',
    'Bad debt write-offs in current year were £6k (vs historical avg £8k)'
  ],
  proposedAdjustment: 'No adjustment; provision assessment complete'
};

// Step 6: Auditor conclusion
const conclusion = {
  procedure: 'D3.6 - Bad Debt Provision',
  testDate: new Date('2026-02-18'),
  sampleTestedPercentage: 100,
  exceptionsFound: 0,
  deficiencyIdentified: true,
  deficiencyNature: 'Provision appears understated by £7,250 based on historical default rates',
  materiality: isAdjustmentMaterial ? 'Yes' : 'No',
  managementConcurrence: 'No - Management disputes need for adjustment',
  auditorAction: 'Propose adjustment entry for £7,250',
  auditConclusion: 'Bad debt provision is understated; adjustment required'
};

console.log('\n=== CONCLUSION SUMMARY ===');
console.log(JSON.stringify(conclusion, null, 2));
```

---

### Example 4: Assertion Coverage Verification

**Scenario:** Verify all assertions are tested for Inventory area

```javascript
import { AssertionMapper } from './lib/auditProcedureHelper';
import { PROCEDURE_D4_INVENTORY } from './data/auditProcedureLibrary';
import { ASSERTIONS } from './data/auditProcedureLibrary';

// Step 1: Get all assertions
const allAssertions = AssertionMapper.getAllAssertions();
console.log('Audit Assertions (ISA 500):');
allAssertions.forEach(a => {
  console.log(`  - ${a.name}: ${a.description}`);
});

// Step 2: Check assertion coverage for D4 (Inventory)
const coverage = AssertionMapper.getAssertionCoverage('D4', PROCEDURE_D4_INVENTORY);
console.log('\n=== ASSERTION COVERAGE - D4 INVENTORY ===');

Object.entries(coverage).forEach(([assertion, data]) => {
  console.log(`${assertion}:`);
  console.log(`  Procedures: ${data.count}`);
  console.log(`  Examples: ${data.procedures.slice(0, 3).join(', ')}`);
});

// Step 3: Verify completeness
const verification = AssertionMapper.verifyCoverage('D4', PROCEDURE_D4_INVENTORY);
console.log('\n=== COVERAGE VERIFICATION ===');
console.log(`All Assertions Covered: ${verification.allCovered}`);
console.log(`Covered: ${verification.coveredAssertions}/${verification.totalAssertions}`);

if (!verification.allCovered) {
  console.log(`\nUNCOVERED ASSERTIONS:`);
  verification.uncovered.forEach(a => {
    console.log(`  - ${a} (No procedures test this assertion)`);
    console.log(`    RECOMMENDATION: Add procedure to test ${a}`);
  });
}

// Step 4: Sample output for procedures by assertion
const existenceProcedures = AssertionMapper.getProceduresForAssertion(
  'EXISTENCE',
  PROCEDURE_D4_INVENTORY
);

console.log('\n=== PROCEDURES TESTING EXISTENCE ===');
existenceProcedures.forEach(p => {
  console.log(`${p.procedureId}: ${p.title}`);
  console.log(`  Type: ${p.testNature} | Timing: ${p.timing}`);
});
```

---

### Example 5: Procedure Selection by Industry

**Scenario:** Get procedures modified for SaaS company

```javascript
import { IndustryHelper, AuditPlanner } from './lib/auditProcedureHelper';
import { INDUSTRY_VARIATIONS } from './data/auditProcedureLibrary';

// Step 1: Get SaaS industry variations
const saasVariations = IndustryHelper.getIndustryVariations('SAAS_TECHNOLOGY');
console.log('SaaS Industry Special Considerations:');
saasVariations.specialConsiderations.forEach(consideration => {
  console.log(`  - ${consideration}`);
});

// Step 2: Get procedures customized for SaaS
const saasProgram = AuditPlanner.createAuditProgram('D3', 'HIGH', 'SAAS_TECHNOLOGY');

console.log('\n=== PROCEDURE MODIFICATIONS FOR SAAS ===');
saasProgram.procedures
  .filter(p => p.modification)
  .forEach(p => {
    console.log(`${p.procedureId}: ${p.title}`);
    console.log(`  Modification: ${p.modification}`);
  });

// Returns modifications like:
// D3.8: Deferred Revenue - Timing and Completeness
//   Modification: "Enhanced deferred revenue procedures; test release timing per performance periods"
//
// D3.X: SaaS-specific revenue (subscriptions, multi-year contracts)
//   Modification: "Test performance obligation satisfaction per subscription terms"
```

---

### Example 6: Team Progress Tracking

**Scenario:** Monitor audit progress across team

```javascript
import { TrackerManager, AuditPlanner } from './lib/auditProcedureHelper';

// Step 1: Create audit program for engagement
const allProcedures = AuditPlanner.getAllAreas().map(area =>
  AuditPlanner.createAuditProgram(area.area, 'MEDIUM', 'GENERAL').procedures
).flat();

// Step 2: Create trackers for all procedures
const allTrackers = allProcedures.map(proc =>
  TrackerManager.create(proc.procedureId)
);

// Simulate audit progress (demo data)
const progressData = [
  { procId: 'D3.1', status: 'Complete', hours: 2, preparer: 'John', reviewer: 'Jane' },
  { procId: 'D3.2', status: 'In Progress', hours: 6, preparer: 'John', reviewer: null },
  { procId: 'D3.3', status: 'Complete', hours: 3, preparer: 'Bob', reviewer: 'Jane' },
  { procId: 'D4.1', status: 'Complete', hours: 5, preparer: 'Alice', reviewer: 'Manager' },
  { procId: 'D4.2', status: 'Not Started', hours: 0, preparer: 'Unassigned', reviewer: null },
  // ... more procedures
];

// Step 3: Update trackers
progressData.forEach(data => {
  let tracker = allTrackers.find(t => t.procedureId === data.procId);
  tracker.status = data.status;
  tracker.hoursSpent = data.hours;
  tracker.preparer = data.preparer;
  tracker.reviewer = data.reviewer;
});

// Step 4: Get audit progress
const progress = TrackerManager.getProgress(allTrackers);

console.log('\n=== AUDIT PROGRESS REPORT ===');
console.log(`Total Procedures: ${progress.total}`);
console.log(`Completed: ${progress.completed} (${progress.percentComplete}%)`);
console.log(`In Progress: ${progress.inProgress}`);
console.log(`Not Started: ${progress.notStarted}`);
console.log(`\nTotal Hours Spent: ${progress.totalHours}`);
console.log(`Total Exceptions Found: ${progress.totalExceptions}`);

// Step 5: Get procedures by status
const completedProcedures = TrackerManager.getProceduresByStatus(
  allTrackers,
  'Complete'
);
const inProgressProcedures = TrackerManager.getProceduresByStatus(
  allTrackers,
  'In Progress'
);

console.log(`\n=== PROCEDURES NOT YET STARTED ===`);
const notStarted = TrackerManager.getProceduresByStatus(allTrackers, 'Not Started');
notStarted.slice(0, 5).forEach(t => {
  console.log(`  - ${t.procedureId} (Assign to: ?)`);
});

// Step 6: Generate workload report
console.log(`\n=== TEAM WORKLOAD ===`);
const workload = {};
allTrackers.forEach(tracker => {
  const preparer = tracker.preparer || 'Unassigned';
  if (!workload[preparer]) workload[preparer] = { hours: 0, count: 0 };
  workload[preparer].hours += tracker.hoursSpent;
  workload[preparer].count += 1;
});

Object.entries(workload).forEach(([person, data]) => {
  console.log(`${person}: ${data.count} procedures, ${data.hours} hours`);
});
```

---

### Example 7: Full Audit Program Generation for Manufacturing Company

**Scenario:** Create comprehensive audit program for manufacturing entity with £5m revenue, high inventory, capital-intensive operations

```javascript
import { AuditPlanner } from './lib/auditProcedureHelper';

// Step 1: Determine risk by area for manufacturing company
const riskAssessment = {
  D3_Revenue: 'MEDIUM',       // Revenue from 5 major customers, relatively routine
  D4_Inventory: 'HIGH',       // Manufacturing with complex WIP, overhead absorption
  D5_FixedAssets: 'MEDIUM',   // Capital-intensive industry; some recent acquisitions
  D6_Payables: 'LOW',         // Standard supplier base
  D7_Loans: 'MEDIUM-HIGH',    // Covenant-based facility; leverage ratio covenant
  D8_Tax: 'MEDIUM',           // R&D credits available; standard CT
  D9_Provisions: 'MEDIUM',    // Warranty provision (3-year products)
  D10_Equity: 'LOW',          // Stable shareholder base
  D11_Cash: 'LOW',            // Standard banking arrangements
  D12_JEs: 'MEDIUM',          // Standard journal entries; consolidation only
  D13_Events: 'LOW',          // Standard post-period review
  D14_RelatedParties: 'LOW'   // Minimal related party activity
};

// Step 2: Create audit programs for each area
console.log('=== MANUFACTURING COMPANY AUDIT PROGRAM ===\n');

const auditPrograms = {
  D3: AuditPlanner.createAuditProgram('D3', 'MEDIUM', 'MANUFACTURING'),
  D4: AuditPlanner.createAuditProgram('D4', 'HIGH', 'MANUFACTURING'),
  D5: AuditPlanner.createAuditProgram('D5', 'MEDIUM', 'MANUFACTURING'),
  D6: AuditPlanner.createAuditProgram('D6', 'LOW', 'MANUFACTURING'),
  D7: AuditPlanner.createAuditProgram('D7', 'MEDIUM-HIGH', 'MANUFACTURING'),
  D8: AuditPlanner.createAuditProgram('D8', 'MEDIUM', 'MANUFACTURING'),
  D9: AuditPlanner.createAuditProgram('D9', 'MEDIUM', 'MANUFACTURING'),
  D10: AuditPlanner.createAuditProgram('D10', 'LOW', 'MANUFACTURING'),
  D11: AuditPlanner.createAuditProgram('D11', 'LOW', 'MANUFACTURING'),
  D12: AuditPlanner.createAuditProgram('D12', 'MEDIUM', 'MANUFACTURING'),
  D13: AuditPlanner.createAuditProgram('D13', 'LOW', 'MANUFACTURING'),
  D14: AuditPlanner.createAuditProgram('D14', 'LOW', 'MANUFACTURING')
};

// Step 3: Calculate total audit effort
let totalProcedures = 0;
let totalHours = 0;

Object.entries(auditPrograms).forEach(([area, program]) => {
  totalProcedures += program.totalProcedures;
  totalHours += program.estimatedHours;
  console.log(`${area}: ${program.totalProcedures} procedures, ${program.estimatedHours} hours (${program.riskLevel} risk)`);
});

console.log(`\nTOTAL: ${totalProcedures} procedures, ${totalHours} hours`);

// Step 4: Identify high-risk areas requiring senior focus
const highRiskAreas = Object.entries(auditPrograms)
  .filter(([_, prog]) => prog.riskLevel === 'HIGH' || prog.riskLevel === 'MEDIUM-HIGH')
  .map(([area, _]) => area);

console.log(`\nHIGH-RISK AREAS REQUIRING SENIOR FOCUS: ${highRiskAreas.join(', ')}`);

// Step 5: Key risks by area
console.log('\n=== KEY RISKS BY AREA ===');
Object.entries(auditPrograms).forEach(([area, program]) => {
  console.log(`\n${area}: ${program.area}`);
  program.keyRisks.slice(0, 3).forEach(risk => {
    console.log(`  - ${risk}`);
  });
});

// Step 6: Generate audit budget
const auditBudget = {
  totalHours,
  hourlyRate: 150,  // £/hour average
  totalCost: totalHours * 150,
  contingency: (totalHours * 150) * 0.1,  // 10% contingency
  totalBudget: (totalHours * 150) * 1.1
};

console.log(`\n=== AUDIT BUDGET ===`);
console.log(`Estimated Hours: ${auditBudget.totalHours}`);
console.log(`Hourly Rate: £${auditBudget.hourlyRate}`);
console.log(`Direct Cost: £${auditBudget.totalCost.toLocaleString()}`);
console.log(`Contingency (10%): £${auditBudget.contingency.toLocaleString()}`);
console.log(`TOTAL BUDGET: £${auditBudget.totalBudget.toLocaleString()}`);

// Export programs
console.log(`\n✓ Audit programs created for all 12 areas`);
console.log(`✓ Ready for team assignment and execution`);
```

---

## Key Takeaways

1. **Comprehensive Coverage**: 200+ procedures across 12 audit areas
2. **Risk-Based Approach**: Sample sizes automatically scale by risk level
3. **Exception Management**: Clear protocols for evaluating and escalating findings
4. **Industry Customization**: Procedures modified for 8 different industries
5. **Assertion Testing**: All 7 assertions tested with multiple procedures per area
6. **Team Integration**: Status tracking, workload management, progress reporting
7. **Standards Compliant**: ISA, FRS 102, and Companies Act 2006 compliance built-in

These examples demonstrate how the procedure library integrates into a real-world audit engagement, from initial planning through completion and reporting.

