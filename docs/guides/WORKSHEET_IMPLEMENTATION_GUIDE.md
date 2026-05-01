# WORKSHEET IMPLEMENTATION GUIDE
## Step-by-Step Integration for Audit-Automation-Engine

**Date:** 13 March 2025
**Version:** 1.0
**Status:** Implementation Ready

---

## TABLE OF CONTENTS

1. [Quick Start](#quick-start)
2. [Component Architecture](#component-architecture)
3. [Data Model Specification](#data-model-specification)
4. [UI/UX Implementation](#uiux-implementation)
5. [Integration Points](#integration-points)
6. [Testing Strategy](#testing-strategy)
7. [Deployment Checklist](#deployment-checklist)

---

## 1. QUICK START

### 1.1 File Structure

```
src/
├── templates/
│   ├── WorksheetTemplates.jsx          [Core template definitions]
│   ├── C1_TrialBalance.jsx             [C1 complete example]
│   ├── D3_Revenue.jsx                  [D3 template (to be created)]
│   ├── D4_Inventory.jsx                [D4 template (to be created)]
│   ├── D5_FixedAssets.jsx              [D5 template (to be created)]
│   ├── D6_Payables.jsx                 [D6 template (to be created)]
│   └── components/
│       ├── WorksheetHeader.jsx         [Shared header]
│       ├── ProcedureTable.jsx          [Procedure execution UI]
│       ├── AssertionMatrix.jsx         [Assertion testing UI]
│       ├── CommentPanel.jsx            [Comment system UI]
│       └── ExportButtons.jsx           [Export functionality]
├── store/
│   └── worksheetStore.js               [State management for worksheets]
├── data/
│   └── procedureLibrary.json           [Pre-built audit procedures]
└── pages/
    └── WorksheetPage.jsx               [Worksheet navigation & listing]
```

### 1.2 Import & Usage

```javascript
// In AuditEngine.jsx or appropriate phase component
import { C1_TrialBalance } from './templates/C1_TrialBalance';
import WORKSHEET_TEMPLATES from './templates/WorksheetTemplates';

// Component usage
<C1_TrialBalance />

// Access procedure library
const d3Procedures = WORKSHEET_TEMPLATES.D3.procedures;
```

---

## 2. COMPONENT ARCHITECTURE

### 2.1 Worksheet Component Hierarchy

```
WorksheetPage (Navigation & Listing)
├── WorksheetHeader
│   ├── EngagementDetails
│   └── SignOffSection
├── ObjectiveAndScope
│   ├── AuditObjective
│   ├── MaterialitySection
│   └── ControlReliance
├── ProcedureExecution
│   ├── ProcedureSelector
│   └── ProcedureTable
│       ├── ProcedureRow (repeating)
│       └── SampleSizeCalculator
├── ResultsSummary
│   ├── SummaryMetrics
│   ├── ExceptionTable
│   └── ExceptionDetails
├── AssertionMatrix
│   └── AssertionRow (repeating x 5-7)
├── EvidenceDocumentation
│   └── EvidenceRow (repeating)
├── SensitiveAreas
│   ├── KeyJudgments
│   ├── Assumptions
│   ├── AlternativeApproaches
│   └── ChallengePoints
├── RisksAndControls
│   ├── ControlDescription
│   └── ControlEffectivenessTests
├── WorkpaperConclusion
│   ├── ConclusionText
│   └── SignOffSection
└── CommentPanel (available in every section)
    ├── CommentList
    └── CommentInput
```

### 2.2 Shared Component Architecture

**WorksheetHeader Component:**
```jsx
function WorksheetHeader({ wsData, updateWS, isReadOnly }) {
  return (
    <div>
      {/* Engagement section */}
      {/* Sign-off section */}
      {/* Assertion section */}
    </div>
  );
}
```

**CommentButton Component:**
```jsx
function CommentButton({ section, sectionId, wsData, updateWS, inline }) {
  // Renders comment count & button
  // Expands to show comment thread
  // Allows adding new comments
  // Comments automatically timestamped & user-tracked
}
```

**ExportButton Component:**
```jsx
function ExportButton({ format, wsData, wpRef }) {
  // Handles PDF, Excel, Word, Print exports
  // Formats data appropriately for each format
  // Includes branding, headers, footers
}
```

### 2.3 Component Props Interface

**All worksheet components should accept:**

```javascript
interface WorksheetComponentProps {
  // Data state
  wsData: WorksheetData,

  // Update handler
  updateWS: (fieldPath: string, value: any) => void,

  // Configuration
  isReadOnly: boolean,
  isReviewMode: boolean,
  currentUserRole: 'preparer' | 'reviewer' | 'partner',

  // Navigation
  onNext: () => void,
  onPrevious: () => void,
  onSave: () => void,
  onComplete: () => void,

  // Context
  engagement: EngagementData,
  riskAssessment: RiskAssessmentData,
  procedureLibrary: ProcedureDefinition[],
}
```

---

## 3. DATA MODEL SPECIFICATION

### 3.1 Worksheet Data Structure

```javascript
interface WorksheetData {
  // Identifiers
  id: string,                        // Unique worksheet ID
  wpRef: 'C1' | 'D3' | 'D4' | 'D5' | 'D6',
  engagementId: string,
  auditYear: number,

  // Section 1: Header
  header: {
    entityName: string,
    yearEnd: date,
    period: string,
    wsTitle: string,
    riskLevel: 'High' | 'Medium' | 'Low',
    preparer: {
      name: string,
      initials: string,
      date: date,
    },
    reviewer: {
      name: string,
      initials: string,
      date: date,
    },
    assertion: string,
    partnerApproval: string,
  },

  // Section 2: Objective & Scope
  objective: string,
  glAccounts: string,
  bsDescription: string,
  assertionsTested: string,
  overallMateriality: number,
  performanceMateriality: number,  // Auto-calc: OM × 0.75
  trivialThreshold: number,         // Auto-calc: OM × 0.05
  reliedOnControls: boolean,
  keyControls: string,
  testingApproach: 'Full' | 'Stratified' | 'Random' | 'Risk-Based',

  // Section 3: Procedures
  procedures: Array<{
    id: string,                      // e.g., D3.1
    description: string,
    assertion: string,
    plannedSampleSize: number,
    actualSampleSize: number,
    selectionMethod: string,
    populationTotal: string,
    populationValue: number,
    evidenceReference: string,
    exceptionsFound: number,
    exceptionTypes: string,
    conclusion: 'Y' | 'N',
  }>,
  populationItems: number,
  populationValue: number,
  selectionMethod: string,
  samplingTool: string,
  testedBy: string,

  // Section 4: Results
  exceptionDetails: string,

  // Section 5: Assertion Matrix
  assertionMatrix: Array<{
    assertion: string,
    procedures: string,              // Comma-separated proc IDs
    evidence: string,
    risk: string,
    conclusion: 'Y' | 'N' | '',
  }>,

  // Section 6: Evidence
  evidence: Array<{
    type: string,                    // Evidence type (see ISA 500)
    source: string,
    summary: string,
    dateObtained: date,
    reliability: 'Reliable' | 'Conditional' | 'Limited',
    fileRef: string,
  }>,

  // Section 7: Sensitive Areas
  keyJudgments: string,
  assumptions: string,
  alternativeApproaches: string,
  challengePoints: string,

  // Section 8: Risks & Controls
  keyControls: string,
  controlGaps: string,
  designEffectiveness: 'Yes' | 'No',
  operatingEffectiveness: 'Yes' | 'No',
  relianceDecision: 'Yes' | 'No',

  // Section 9: Conclusion
  conclusionText: string,
  nextSteps: string,
  status: 'Pending' | 'In Progress' | 'Pending Review' | 'Complete' | 'Requires Further Work',
  signOff: string,

  // Comments (available throughout)
  comments: {
    [sectionKey: string]: Array<{
      author: string,
      date: date,
      text: string,
      replies?: Array<Comment>,
    }>,
  },

  // Metadata
  createdDate: date,
  lastModifiedDate: date,
  lastModifiedBy: string,
  version: number,
  auditTrail: Array<AuditTrailEntry>,
}

interface AuditTrailEntry {
  timestamp: date,
  user: string,
  action: string,        // 'Created', 'Updated', 'Section Completed', etc.
  fieldChanged: string,
  oldValue: any,
  newValue: any,
}
```

### 3.2 Procedure Library Data Structure

```javascript
interface ProcedureDefinition {
  id: string,                  // e.g., 'D3.1'
  description: string,
  assertions: string[],
  estimatedHours: number,
  riskRating: 'High' | 'Medium' | 'Low',
  sampleSizeRec: {
    min: number,
    max: number,
    recommended: number,
  },
  fsliBelong: string,          // e.g., 'D3'
  isaReference: string[],      // e.g., ['ISA 500', 'ISA 501']
  frsSections: string[],       // e.g., ['FRS 102 s15']
  riskAddressed: string[],     // Link to risk matrix
}

// Example:
const D3_1_Procedure = {
  id: 'D3.1',
  description: 'Test revenue recognition policy compliance with IFRS 15/FRS 102 s15',
  assertions: ['Accuracy', 'Classification'],
  estimatedHours: 4,
  riskRating: 'Medium',
  sampleSizeRec: { min: 0, max: 0, recommended: 1 },  // Full policy review
  fsliBelong: 'D3',
  isaReference: ['ISA 500', 'ISA 501'],
  frsSections: ['FRS 102 s15'],
  riskAddressed: ['RMM-D3.1', 'RMM-D3.3'],
};
```

---

## 4. UI/UX IMPLEMENTATION

### 4.1 Color & Typography System

Use existing COLORS from AuditEngine.jsx:

```javascript
const WORKSHEET_COLORS = {
  // Core palette (existing)
  bg: '#0A0E17',
  text: '#F8F8F8',
  dim: 'rgba(255,255,255,0.6)',
  accent: '#F5A623',

  // Status colors
  success: '#66BB6A',       // Green - passed
  error: '#EF5350',         // Red - failed/exception
  warning: '#FFA726',       // Orange - significant
  info: '#42A5F5',          // Blue - info/comment

  // Section colors
  c1Color: '#4CAF50',       // Green - Trial Balance
  d3Color: '#2196F3',       // Blue - Revenue
  d4Color: '#FF9800',       // Orange - Inventory
  d5Color: '#9C27B0',       // Purple - Fixed Assets
  d6Color: '#00BCD4',       // Cyan - Payables
};
```

### 4.2 Section Navigation

```jsx
<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
  {['1. Header', '2. Objective', '3. Procedures', '4. Results',
    '5. Assertions', '6. Evidence', '7. Sensitive', '8. Controls',
    '9. Conclusion'].map((section, idx) => (
    <button
      key={idx}
      onClick={() => scrollToSection(idx)}
      style={{
        padding: '6px 12px',
        background: activeSection === idx ? COLORS.accent + '30' : 'transparent',
        border: `1px solid ${activeSection === idx ? COLORS.accent : COLORS.border}`,
        color: activeSection === idx ? COLORS.accent : COLORS.dim,
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: 600,
      }}
    >
      {section}
    </button>
  ))}
</div>
```

### 4.3 Form Input Styling

Standard input components:

```jsx
// Text input
<input
  type="text"
  value={value}
  onChange={(e) => updateWS(field, e.target.value)}
  style={{
    width: '100%',
    padding: '8px',
    background: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '6px',
    color: COLORS.text,
    fontSize: '11px',
    fontFamily: 'inherit',
  }}
/>

// Select dropdown
<select
  value={value}
  onChange={(e) => updateWS(field, e.target.value)}
  style={{
    width: '100%',
    padding: '8px',
    background: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '6px',
    color: COLORS.text,
    fontSize: '11px',
    cursor: 'pointer',
  }}
>
  <option value="">-- Select --</option>
  {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
</select>

// Textarea
<textarea
  value={value}
  onChange={(e) => updateWS(field, e.target.value)}
  style={{
    width: '100%',
    padding: '8px',
    background: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '6px',
    color: COLORS.text,
    fontSize: '11px',
    fontFamily: 'monospace',
    minHeight: '100px',
    resize: 'vertical',
  }}
/>
```

### 4.4 Table Styling

Standard table for procedures, assertions, evidence:

```jsx
<table style={{
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '10px',
  background: COLORS.bg,
  borderRadius: '6px',
  overflow: 'hidden',
}}>
  <thead>
    <tr style={{
      background: COLORS.sidebar,
      borderBottom: `2px solid ${COLORS.accent}`,
    }}>
      <th style={{
        padding: '10px',
        textAlign: 'left',
        color: COLORS.accent,
        fontWeight: 700,
      }}>Column Header</th>
    </tr>
  </thead>
  <tbody>
    {data.map((row, idx) => (
      <tr key={idx} style={{
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <td style={{
          padding: '8px',
          color: COLORS.text,
        }}>Cell content</td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## 5. INTEGRATION POINTS

### 5.1 Integration with Risk Assessment

Link each worksheet to risk assessment:

```javascript
// In ProcedureExecution component
const linkedRisks = riskAssessment.risks.filter(r =>
  r.fsli === wpRef && r.assertion === selectedAssertion
);

// Display as: "Addresses RMM-D3.1 (Revenue cutoff) - Inherent Risk: High"
```

### 5.2 Integration with Trial Balance

All worksheets should reference TB:

```javascript
// In C1 worksheet, display TB accounts
// In D3 worksheet, show linked TB line (e.g., "Linked to TB line: Revenue 4000")
// Clicking TB reference opens C1 worksheet side-by-side

const linkedTBLine = c1Data.procedures
  .find(p => p.id === 'C1.2')
  .tbAccounts
  .find(acc => acc.range.includes(selectedGLAccount));
```

### 5.3 Integration with Comments System

Comment button available on every section:

```javascript
// onClick handler for comment button
const handleCommentClick = (section) => {
  setShowComments(!showComments);
  // Fetch comments for section from wsData.comments[section]
  // Display comment thread
  // Allow adding new comment
  // Auto-save comment to wsData
};

// Comment structure
{
  sectionKey: 'procedures',
  sectionId: 'D3.3',
  comments: [
    {
      id: 'CMT-001',
      author: 'John Davis',
      role: 'Reviewer',
      date: '2025-01-22',
      time: '14:30',
      text: 'Why was the 75-item sample size selected for high-risk area?',
      resolved: false,
      replies: [
        {
          id: 'CMT-001-R1',
          author: 'Sarah Johnson',
          role: 'Preparer',
          date: '2025-01-22',
          time: '15:45',
          text: 'Based on ISA 315 high-risk guidance, 75 items achieves 95% confidence with 5% precision. See sample size calc in Section 3.',
          resolved: true,
        }
      ]
    }
  ]
}
```

### 5.4 Integration with Document Management

Evidence files should link to:

```javascript
// File reference format
{
  type: 'External Confirmation',
  source: 'AR Confirmations',
  fileRef: 'audit://files/D3.5_AR_Confirmations_2025-01-15.pdf',
  // Or for network drives
  fileRef: 'H:\\Audit\\ABC_Ltd\\2024\\D3.5_AR_Confirmations.xlsx',
}

// In UI: clickable link to open file
<a href={evidence.fileRef} style={{ color: COLORS.blue, cursor: 'pointer' }}>
  📎 {evidence.source}
</a>
```

---

## 6. TESTING STRATEGY

### 6.1 Unit Tests

Test individual components:

```javascript
// Example: Test WorksheetHeader component
describe('WorksheetHeader', () => {
  it('renders engagement details', () => {
    const wsData = {
      header: {
        entityName: 'ABC Ltd',
        yearEnd: '2024-12-31',
      }
    };

    render(<WorksheetHeader wsData={wsData} />);
    expect(screen.getByText('ABC Ltd')).toBeInTheDocument();
  });

  it('auto-calculates performance materiality', () => {
    const wsData = { overallMateriality: 500000 };
    const updateWS = jest.fn();

    render(<ObjectiveAndScope wsData={wsData} updateWS={updateWS} />);
    // Should show PM = 375000
    expect(screen.getByText('£375,000')).toBeInTheDocument();
  });
});
```

### 6.2 Integration Tests

Test worksheet workflow:

```javascript
// Test complete C1 worksheet flow
describe('C1 Worksheet', () => {
  it('completes full worksheet workflow', () => {
    render(<C1_TrialBalance />);

    // Fill in header
    fireEvent.change(screen.getByLabelText('Preparer Name'),
      { target: { value: 'Sarah Johnson' } });

    // Add procedure
    fireEvent.click(screen.getByText('Add Procedure'));
    fireEvent.change(screen.getByLabelText('Procedure'),
      { target: { value: 'C1.1' } });

    // Execute procedure
    fireEvent.change(screen.getByLabelText('Actual Sample Size'),
      { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Exceptions Found'),
      { target: { value: '0' } });

    // Verify conclusion auto-updates
    expect(screen.getByText('✓ PASS')).toBeInTheDocument();
  });
});
```

### 6.3 Data Validation Tests

Test data integrity:

```javascript
// Test exception rate calculation
describe('Exception Rate Calculation', () => {
  it('calculates correct exception rate', () => {
    const procedure = {
      actualSampleSize: 75,
      exceptionsFound: 1,
    };

    const rate = calculateExceptionRate(procedure);
    expect(rate).toBe('1.33%');
  });

  it('flags material exceptions', () => {
    const exceptions = [
      { amount: 15000, type: 'cutoff' },
      { amount: 25000, type: 'pricing' },
      { amount: 8000, type: 'classification' },
    ];

    const totalExceptions = 48000;
    const materialityThreshold = 500000;

    const isMaterial = (totalExceptions / materialityThreshold) > 0.05;
    expect(isMaterial).toBe(false); // 9.6% < materiality threshold
  });
});
```

---

## 7. DEPLOYMENT CHECKLIST

### 7.1 Pre-Deployment Verification

- [ ] All 5 FSLI templates created (C1, D3, D4, D5, D6)
- [ ] Procedure libraries populated with ISA-compliant procedures
- [ ] All formula auto-calculations tested
- [ ] Comment system fully functional
- [ ] Export buttons generate correct output
- [ ] Risk assessment linkage working
- [ ] Trial balance linkage working
- [ ] Evidence document references validated

### 7.2 Data Migration

If migrating from existing worksheets:

```javascript
// Migration script
async function migrateExistingWorksheets() {
  const oldWorksheets = await fetchOldWorksheetData();

  oldWorksheets.forEach(old => {
    const newWS = {
      ...old,
      // Map old fields to new structure
      header: {
        entityName: old.entityName,
        yearEnd: old.yearEnd,
        // ... etc
      },
      procedures: old.procedures.map(p => ({
        ...p,
        // Ensure new fields present
        selectionMethod: p.selectionMethod || 'Random',
        // ... etc
      })),
      comments: old.comments || {},
    };

    saveWorksheet(newWS);
  });
}
```

### 7.3 User Training

Prepare training materials:

- [ ] Template overview video (30 min)
- [ ] Section-by-section walkthrough guide
- [ ] Sample completed worksheets (C1, D3 examples)
- [ ] ISA standard reference guide
- [ ] FAQ document
- [ ] Quick reference card
- [ ] Support contact information

### 7.4 Go-Live Tasks

1. **Beta Testing** (2 weeks)
   - Deploy to 5-10 users
   - Gather feedback
   - Fix issues

2. **Training** (1 week)
   - Conduct live training sessions
   - Distribute materials
   - Answer questions

3. **Full Deployment** (1 week)
   - Enable for all users
   - Monitor usage
   - Provide support

4. **Post-Go-Live** (ongoing)
   - Track usage metrics
   - Gather feedback
   - Plan enhancements

---

## 8. SAMPLE IMPLEMENTATION: D3 REVENUE & RECEIVABLES

### 8.1 D3 Procedure Library

```javascript
const D3_ProcedureLibrary = [
  {
    id: 'D3.1',
    description: 'Test revenue recognition policy compliance with IFRS 15',
    assertions: ['Accuracy', 'Classification'],
    estimatedHours: 4,
    riskRating: 'Medium',
  },
  {
    id: 'D3.2',
    description: 'Analytical review - revenue trends by product/period',
    assertions: ['Reasonableness'],
    estimatedHours: 3,
    riskRating: 'Low',
  },
  {
    id: 'D3.3',
    description: 'Sample revenue transactions ±10 days year-end for cutoff',
    assertions: ['Cutoff', 'Existence', 'Accuracy'],
    estimatedHours: 8,
    riskRating: 'High',
    sampleSizeRec: { min: 50, max: 100, recommended: 75 },
  },
  {
    id: 'D3.4',
    description: 'AR aging analysis and collectibility assessment',
    assertions: ['Valuation'],
    estimatedHours: 6,
    riskRating: 'High',
  },
  {
    id: 'D3.5',
    description: 'Perform AR confirmations (positive and negative)',
    assertions: ['Existence', 'Accuracy'],
    estimatedHours: 10,
    riskRating: 'High',
    sampleSizeRec: { min: 25, max: 50, recommended: 40 },
  },
  {
    id: 'D3.6',
    description: 'Evaluate allowance for doubtful debts adequacy',
    assertions: ['Valuation'],
    estimatedHours: 6,
    riskRating: 'Medium',
  },
];
```

### 8.2 D3 Assertion Matrix Template

```javascript
const D3_AssertionMatrix = [
  {
    assertion: 'Existence',
    procedures: 'D3.1, D3.5',
    evidence: 'Revenue policy compliance testing; AR confirmations',
    risk: 'RMM-D3.2: AR overstated due to fictitious sales (fraud risk)',
    conclusion: '',
  },
  {
    assertion: 'Completeness',
    procedures: 'D3.2, D3.3',
    evidence: 'Analytical review of revenue trends; Cutoff testing',
    risk: 'RMM-D3.1: Revenue understated due to missed sales',
    conclusion: '',
  },
  {
    assertion: 'Accuracy',
    procedures: 'D3.1, D3.3, D3.5',
    evidence: 'Policy testing; Sample testing; Confirmations',
    risk: 'RMM-D3.3: Sales recorded at incorrect amounts',
    conclusion: '',
  },
  {
    assertion: 'Cutoff',
    procedures: 'D3.3',
    evidence: '±10 day cutoff testing linked to shipping docs',
    risk: 'RMM-D3.4: Revenue recorded in wrong period',
    conclusion: '',
  },
  {
    assertion: 'Valuation',
    procedures: 'D3.4, D3.6',
    evidence: 'AR aging analysis; Allowance adequacy assessment',
    risk: 'RMM-D3.5: AR valuation allowance insufficient',
    conclusion: '',
  },
];
```

---

## 9. NEXT STEPS

1. **Week 1-2:** Create remaining templates (D3, D4, D5, D6)
2. **Week 3:** Implement shared UI components
3. **Week 4:** Integrate state management & workflows
4. **Week 5:** Build export & reporting functionality
5. **Week 6-7:** Testing & refinement
6. **Week 8:** Training & deployment

---

**Document Version:** 1.0
**Last Updated:** 13 March 2025
**Prepared by:** Audit Automation Engine Team

