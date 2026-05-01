# Excel & Word Export Guide

## Overview

AuditEngine provides ISA-compliant document export capabilities through two dedicated services and a unified UI component. All exports generate client-side files with no server round-trip required.

### Architecture

```
AuditExportControls.jsx          ← UI (7 export buttons)
  ├── auditExcelExportService.js ← SheetJS (xlsx) workbooks
  └── auditWordExportService.js  ← docx library documents
```

### ISA Compliance

| Standard | Coverage |
|----------|----------|
| ISA 210 | Engagement letter templates |
| ISA 230 | Audit documentation / working papers |
| ISA 500 | Audit evidence documentation |
| ISA 700 | Independent auditor's report |
| ISA 705 | Modified audit opinions |
| ISA 706 | Emphasis of matter / other matter paragraphs |

---

## Excel Export Service

**File:** `src/services/auditExcelExportService.js`
**Dependency:** `xlsx` (SheetJS)
**Instance:** `auditExcelExportService` (singleton)

### Methods

#### `exportEngagement(engagement)`

Generates a multi-sheet workbook containing all engagement data.

**Parameters:**
- `engagement` — Full engagement object

**Sheets generated:**
| Sheet | Content |
|-------|---------|
| Cover | Client name, year end, prepared/reviewed by, date |
| Planning | Engagement letter status, materiality, key decisions |
| Risk Assessment | FSLI risk matrix (inherent, control, detection, combined) |
| Materiality | Benchmark calculations, selected levels |
| Procedures | Procedure execution log with sample sizes and conclusions |
| Findings | Severity, impact, root cause, recommendations |
| Trial Balance | Account codes, balances, adjustments, variances |

**Returns:** `{ buffer: Uint8Array, filename: string, mimeType: string }`

**Example:**
```javascript
import { auditExcelExportService } from './services/auditExcelExportService';

const result = auditExcelExportService.exportEngagement({
  clientName: 'Acme Ltd',
  yearEnd: '31 March 2026',
  preparedBy: 'J. Smith',
  planning: { engagementLetter: true, materialityLevel: 50000 },
  riskAssessment: { risks: [{ area: 'Revenue', inherentRisk: 'High', controlRisk: 'Medium' }] },
  procedures: [{ id: 'P1', fsli: 'Revenue', description: 'Cutoff testing', status: 'Complete' }],
  findings: [{ ref: 'F1', severity: 'Medium', description: 'Revenue cutoff misstatement' }],
});

// result.filename → "Acme Ltd_WP_20260320.xlsx"
```

---

#### `exportPhase(phaseId, phaseData, engagement)`

Generates a workbook for a specific audit phase.

**Parameters:**
- `phaseId` — One of: `planning`, `riskAssessment`, `interim`, `final`, `completion`, `reporting`
- `phaseData` — Phase-specific data object
- `engagement` — Parent engagement (used for cover sheet)

**Phase-specific sheets:**

| phaseId | Sheet(s) |
|---------|----------|
| `planning` | Planning decisions, materiality |
| `riskAssessment` | Risk matrix |
| `interim` | Control testing results |
| `final` | Procedures + Findings |
| `completion` | Completion checklist |
| `reporting` | Opinion, misstatements |

**Example:**
```javascript
const result = auditExcelExportService.exportPhase(
  'riskAssessment',
  {
    risks: [
      { area: 'Revenue', inherentRisk: 'High', controlRisk: 'Medium', detectionRisk: 'Low', combinedRisk: 'Medium' },
      { area: 'Payables', inherentRisk: 'Low', controlRisk: 'Low', detectionRisk: 'High', combinedRisk: 'Low' },
    ]
  },
  { clientName: 'Acme Ltd', yearEnd: '31 March 2026' }
);
```

---

#### `exportTrialBalance(trialBalance, engagement)`

Generates a trial balance workbook with opening balances, adjustments, and variances.

**Parameters:**
- `trialBalance` — Array of TB items or object with `items` array
- `engagement` — Parent engagement

**TB item shape:**
```javascript
{
  code: '1100',          // Account code
  name: 'Trade Debtors', // Account name
  openingBalance: 150000,
  adjustments: -5000,
  closingBalance: 145000, // Auto-calculated if omitted
}
```

---

## Word Export Service

**File:** `src/services/auditWordExportService.js`
**Dependency:** `docx`
**Instance:** `auditWordExportService` (singleton)

All methods are `async` and return `{ buffer: Buffer, filename: string, mimeType: string }`.

### Methods

#### `exportAuditReport(engagement, reportData)`

Generates a full ISA 700 audit report.

**Sections:**
1. Title page (client, year end, firm, date, CONFIDENTIAL)
2. Table of contents
3. Executive summary
4. Audit opinion (with basis for opinion)
5. Key audit matters
6. Findings & recommendations table
7. Conclusion

**`reportData` shape:**
```javascript
{
  opinionType: 'Unmodified',        // or 'Qualified', 'Adverse', 'Disclaimer'
  opinion: '...',                    // Full opinion text
  basisForOpinion: '...',            // ISA compliance statement
  goingConcern: 'No material uncertainty',
  keyAuditMatters: [
    { title: 'Revenue Recognition', description: '...', response: '...' }
  ],
  findings: [
    { ref: 'F1', severity: 'High', description: '...', recommendation: '...' }
  ],
  conclusion: '...',
}
```

---

#### `exportEngagementLetter(engagement)`

Generates an ISA 210 engagement letter.

**Sections:** Objective & scope, responsibilities, fees, sign-off.

**`engagement` fields used:**
- `clientName`, `yearEnd`, `fees`, `auditorFirm`

---

#### `exportManagementLetter(engagement, findings)`

Generates a management letter with detailed findings.

Each finding includes: severity, description, impact, recommendation, and management response.

---

#### `exportPhaseNarrative(phaseId, phaseData, engagement)`

Generates a working paper narrative for a specific phase.

**Sections:** Objective, work performed (bulleted procedures), conclusion.

---

## UI Component

**File:** `src/components/AuditExportControls.jsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `engagement` | Object | `{}` | Full engagement data object |
| `phaseId` | String | `'planning'` | Current phase identifier |
| `reportData` | Object | `{}` | Report-specific data (opinion, KAMs) |
| `onExportComplete` | Function | — | Callback after successful export |

### Usage

```jsx
import AuditExportControls from './components/AuditExportControls';

// Basic usage
<AuditExportControls
  engagement={engagement}
  phaseId="planning"
/>

// With report data and callback
<AuditExportControls
  engagement={engagement}
  phaseId="reporting"
  reportData={{
    opinionType: 'Unmodified',
    keyAuditMatters: [...],
    findings: [...],
  }}
  onExportComplete={(result) => console.log('Exported:', result.filename)}
/>
```

### Export Buttons

The component renders 7 export buttons in two groups:

**Excel (green):**
1. Full Working Papers — all phases in one workbook
2. Phase Working Paper — current `phaseId` only
3. Trial Balance — TB with adjustments

**Word (blue):**
4. Audit Report — ISA 700 opinion document
5. Engagement Letter — ISA 210 terms
6. Management Letter — findings & recommendations
7. Phase Narrative — working paper narrative

### Behaviour

- Only one export runs at a time (buttons disabled during export)
- Success/error status shown below buttons
- Downloads trigger automatically via `Blob` + `URL.createObjectURL`
- No server round-trip — all generation is client-side

---

## Integration Points

### With AuditEngine.jsx

```jsx
import AuditExportControls from './components/AuditExportControls';

// Inside a phase panel:
<AuditExportControls
  engagement={engagement}
  phaseId={currentPhase}
/>
```

### With DocumentationGenerationService

The export services can be used alongside the existing `documentationGenerationService`:

```javascript
// Generate documentation metadata
const docs = await documentationGenerationService.generateDocumentationForPhase('final', phaseData);

// Then export to actual files
const excel = auditExcelExportService.exportPhase('final', phaseData, engagement);
const word = await auditWordExportService.exportPhaseNarrative('final', phaseData, engagement);
```

### With C1_TrialBalance template

Replace the existing `ExportButton` in `C1_TrialBalance.jsx`:

```jsx
import AuditExportControls from '../components/AuditExportControls';

// Instead of individual ExportButton components:
<AuditExportControls engagement={engagement} phaseId="final" />
```

---

## File Naming Convention

All exported files follow: `{ClientName}_{Type}_{YYYYMMDD}.{ext}`

| Export | Filename pattern |
|--------|-----------------|
| Full engagement | `Acme Ltd_WP_20260320.xlsx` |
| Phase working paper | `Acme Ltd_planning_20260320.xlsx` |
| Trial balance | `Acme Ltd_TB_20260320.xlsx` |
| Audit report | `Acme Ltd_Report_20260320.docx` |
| Engagement letter | `Acme Ltd_Engagement_Letter_20260320.docx` |
| Management letter | `Acme Ltd_Management_Letter_20260320.docx` |
| Phase narrative | `Acme Ltd_planning_WP_20260320.docx` |

---

## Error Handling

- All export methods catch errors and surface them through the `AuditExportControls` error state
- Missing data fields gracefully default to empty strings or `'[Not specified]'`
- The Excel service handles both array and object data shapes for flexibility
- Word service methods are async; Excel service methods are synchronous

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `xlsx` | ^0.18.5 | SheetJS — Excel workbook generation |
| `docx` | ^9.6.1 | Word document generation |

Both are already listed in `package.json` dependencies.
