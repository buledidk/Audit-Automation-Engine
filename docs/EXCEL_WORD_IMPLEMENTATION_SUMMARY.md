# Excel & Word Export — Implementation Summary

## What Was Built

Three new files implement a complete, client-side export pipeline for ISA-compliant audit documents:

| File | Size | Purpose |
|------|------|---------|
| `src/services/auditExcelExportService.js` | 14 KB | Excel workbook generation (SheetJS) |
| `src/services/auditWordExportService.js` | 23 KB | Word document generation (docx) |
| `src/components/AuditExportControls.jsx` | 12 KB | React UI with 7 export buttons |

**Total:** ~49 KB of new code | 0 new dependencies (uses existing `xlsx` and `docx`)

---

## Design Decisions

### 1. Client-side generation (no server)

All document generation runs in the browser. No API calls, no server-side rendering.

**Why:**
- Audit data is sensitive — keeping it client-side avoids transmitting working papers through additional endpoints
- No backend deployment changes needed
- Works with the existing offline-capable architecture (`offlineSyncService.js`)
- Instant feedback — no network latency

**Trade-off:** Large engagements with hundreds of procedures may cause a brief UI pause during Excel generation. For the typical engagement size (< 100 procedures, < 50 TB lines), this is imperceptible.

### 2. Singleton service pattern

Both services export a singleton instance (`auditExcelExportService`, `auditWordExportService`) alongside the class default export.

**Why:**
- Matches the existing pattern used by `documentManagementService`, `auditProceduresService`, and other services in `src/services/`
- Allows direct import of the instance for component use
- Class export available for testing and extension

### 3. Defensive data handling

Every field access uses fallback defaults: `engagement.clientName || ''`, `findings || []`, etc.

**Why:**
- The engagement object accumulates data across 6 phases — early phases have incomplete data
- Users may export during any phase, not just at completion
- Prevents runtime errors from partial data

### 4. Synchronous Excel, async Word

Excel methods (`exportEngagement`, `exportPhase`, `exportTrialBalance`) are synchronous. Word methods (`exportAuditReport`, `exportEngagementLetter`, etc.) are async.

**Why:**
- SheetJS `XLSX.write()` is synchronous — wrapping it in async would add complexity with no benefit
- The `docx` library's `Packer.toBuffer()` is inherently async
- `AuditExportControls` handles both patterns transparently via `async handleExport()`

### 5. ISA-aligned document structure

Each export follows a specific ISA standard:

| Export | ISA Standard | Key Requirements Met |
|--------|-------------|---------------------|
| Working papers (Excel) | ISA 230 | Sufficient detail for experienced auditor to understand |
| Risk assessment | ISA 315 | Inherent / control / detection risk matrix |
| Audit procedures | ISA 500 | Sample sizes, exceptions, conclusions |
| Audit report (Word) | ISA 700 | Title, addressee, opinion, basis, KAMs |
| Engagement letter | ISA 210 | Scope, responsibilities, terms |
| Management letter | ISA 265 | Deficiencies, recommendations, responses |

---

## File-by-File Breakdown

### auditExcelExportService.js

**Class:** `AuditExcelExportService`
**Singleton:** `auditExcelExportService`

#### Public API

| Method | Params | Returns | Sync/Async |
|--------|--------|---------|------------|
| `exportEngagement(engagement)` | Full engagement object | `{ buffer, filename, mimeType }` | Sync |
| `exportPhase(phaseId, phaseData, engagement)` | Phase ID + data + parent | `{ buffer, filename, mimeType }` | Sync |
| `exportTrialBalance(trialBalance, engagement)` | TB array/object + parent | `{ buffer, filename, mimeType }` | Sync |

#### Internal Sheet Builders

| Method | Sheet Name | Columns |
|--------|-----------|---------|
| `_addCoverSheet` | Cover | Client, engagement, dates, prepared/reviewed by |
| `_addPlanningSheet` | Planning | Engagement letter, materiality, key decisions |
| `_addRiskSheet` | Risk Assessment | FSLI, inherent/control/detection/combined risk, response |
| `_addMaterialitySheet` | Materiality | Benchmarks, percentages, selected levels |
| `_addProceduresSheet` | Procedures | Ref, FSLI, description, approach, sample, exceptions, conclusion |
| `_addFindingsSheet` | Findings | Ref, severity, description, impact, root cause, recommendation |
| `_addTrialBalanceSheet` | Trial Balance | Code, name, debit, credit, notes |
| `_addControlTestingSheet` | Control Testing | Control, objective, design/operating effective, exceptions |
| `_addCompletionSheet` | Completion | Item, status, reviewed by, date, notes |
| `_addReportingSummarySheet` | Reporting | Opinion, type, KAMs, going concern, misstatements |
| `_addGenericSheet` | (dynamic) | Key-value pairs from any object |

#### Column Widths

All sheets set `ws['!cols']` for readable column widths. No cell styling (SheetJS Community Edition limitation — styling requires the Pro version).

---

### auditWordExportService.js

**Class:** `AuditWordExportService`
**Singleton:** `auditWordExportService`

#### Public API

| Method | Params | Returns | Async |
|--------|--------|---------|-------|
| `exportAuditReport(engagement, reportData)` | Engagement + report data | `{ buffer, filename, mimeType }` | Yes |
| `exportEngagementLetter(engagement)` | Engagement object | `{ buffer, filename, mimeType }` | Yes |
| `exportManagementLetter(engagement, findings)` | Engagement + findings array | `{ buffer, filename, mimeType }` | Yes |
| `exportPhaseNarrative(phaseId, phaseData, engagement)` | Phase ID + data + parent | `{ buffer, filename, mimeType }` | Yes |

#### Document Structure

**Audit Report sections:**
1. `_buildTitlePage` — Centred title, client, year end, firm, CONFIDENTIAL
2. `_buildTableOfContents` — Numbered sections
3. `_buildExecutiveSummary` — Opinion type, going concern, material misstatements
4. `_buildAuditOpinion` — Opinion text + basis for opinion
5. `_buildKeyAuditMatters` — Each KAM with title, description, response
6. `_buildFindings` — Table with ref, severity, finding, recommendation
7. `_buildConclusion` — Conclusion text + statutory disclaimer

**Management Letter sections:**
- Header with client/date
- Introduction paragraph
- `_buildFindingsDetailed` — Each finding with severity, description, impact, recommendation, management response
- Conclusion and sign-off

#### Typography

- Font: Calibri throughout
- Title: 36pt bold, centred
- Subtitle: 28pt bold, centred
- Headings: `HeadingLevel.HEADING_1` through `HEADING_3`
- Body: 22 half-points (11pt) with 120 twip spacing
- CONFIDENTIAL: red (#CC0000), 20 half-points

---

### AuditExportControls.jsx

**Component:** `AuditExportControls` (default export)

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `engagement` | Object | No | `{}` | Full engagement data |
| `phaseId` | String | No | `'planning'` | Current phase for phase-specific exports |
| `reportData` | Object | No | `{}` | Report data (opinion, KAMs) for audit report export |
| `onExportComplete` | Function | No | — | `(result) => void` callback |

#### State

| State | Type | Description |
|-------|------|-------------|
| `exporting` | String/null | ID of currently exporting option, or null |
| `lastExport` | Object/null | `{ filename, time }` of last successful export |
| `error` | String/null | Error message from last failed export |

#### Export Options (EXPORT_OPTIONS array)

| ID | Label | Format | Icon |
|----|-------|--------|------|
| `excel-full` | Full Working Papers | Excel | 📊 |
| `excel-phase` | Phase Working Paper | Excel | 📋 |
| `excel-tb` | Trial Balance | Excel | 📈 |
| `word-report` | Audit Report | Word | 📄 |
| `word-engagement` | Engagement Letter | Word | ✉️ |
| `word-management` | Management Letter | Word | 📝 |
| `word-narrative` | Phase Narrative | Word | 📃 |

#### Download mechanism

`downloadFile(buffer, filename, mimeType)`:
1. Creates `Blob` from buffer
2. Creates object URL via `URL.createObjectURL`
3. Creates temporary `<a>` element with `download` attribute
4. Triggers click
5. Cleans up DOM element and revokes object URL

This works in all modern browsers. No server involvement.

---

## Integration Guide

### Minimal integration (add to any phase panel)

```jsx
import AuditExportControls from '../components/AuditExportControls';

function PlanningPhase({ engagement }) {
  return (
    <div>
      {/* ... phase content ... */}
      <AuditExportControls engagement={engagement} phaseId="planning" />
    </div>
  );
}
```

### Full integration with AuditEngine.jsx

```jsx
import AuditExportControls from './components/AuditExportControls';

// Inside the render, after the phase content:
<AuditExportControls
  engagement={engagement}
  phaseId={currentPhase}
  reportData={reportData}
  onExportComplete={(result) => {
    console.log(`Exported: ${result.filename}`);
    // Optionally log to audit trail
  }}
/>
```

### Standalone service usage (without UI)

```javascript
import { auditExcelExportService } from './services/auditExcelExportService';
import { auditWordExportService } from './services/auditWordExportService';

// Excel
const excel = auditExcelExportService.exportEngagement(engagement);
// excel.buffer → Uint8Array
// excel.filename → "ClientName_WP_20260320.xlsx"

// Word
const word = await auditWordExportService.exportAuditReport(engagement, reportData);
// word.buffer → Buffer
// word.filename → "ClientName_Report_20260320.docx"
```

---

## Testing Recommendations

### Unit tests for Excel service

```javascript
import AuditExcelExportService from '../services/auditExcelExportService';
import * as XLSX from 'xlsx';

describe('AuditExcelExportService', () => {
  const service = new AuditExcelExportService();
  const mockEngagement = {
    clientName: 'Test Ltd',
    yearEnd: '31 Dec 2025',
    planning: { engagementLetter: true },
    procedures: [{ id: 'P1', fsli: 'Revenue', status: 'Complete' }],
  };

  it('exports engagement with correct filename', () => {
    const result = service.exportEngagement(mockEngagement);
    expect(result.filename).toMatch(/Test Ltd_WP_\d{8}\.xlsx/);
    expect(result.mimeType).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });

  it('generates valid workbook buffer', () => {
    const result = service.exportEngagement(mockEngagement);
    const wb = XLSX.read(result.buffer, { type: 'array' });
    expect(wb.SheetNames).toContain('Cover');
    expect(wb.SheetNames).toContain('Planning');
    expect(wb.SheetNames).toContain('Procedures');
  });

  it('handles empty engagement gracefully', () => {
    const result = service.exportEngagement({});
    expect(result.buffer).toBeDefined();
    expect(result.filename).toMatch(/\.xlsx$/);
  });
});
```

### Unit tests for Word service

```javascript
import AuditWordExportService from '../services/auditWordExportService';

describe('AuditWordExportService', () => {
  const service = new AuditWordExportService();

  it('exports audit report', async () => {
    const result = await service.exportAuditReport(
      { clientName: 'Test Ltd' },
      { opinionType: 'Unmodified' }
    );
    expect(result.filename).toMatch(/Test Ltd_Report_\d{8}\.docx/);
    expect(result.buffer).toBeDefined();
  });

  it('exports engagement letter', async () => {
    const result = await service.exportEngagementLetter({ clientName: 'Test Ltd' });
    expect(result.filename).toMatch(/Engagement_Letter/);
  });

  it('handles empty findings in management letter', async () => {
    const result = await service.exportManagementLetter({ clientName: 'Test Ltd' }, []);
    expect(result.buffer).toBeDefined();
  });
});
```

### Component tests

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import AuditExportControls from '../components/AuditExportControls';

describe('AuditExportControls', () => {
  it('renders all 7 export buttons', () => {
    render(<AuditExportControls />);
    expect(screen.getByText('Full Working Papers')).toBeDefined();
    expect(screen.getByText('Audit Report')).toBeDefined();
    expect(screen.getByText('Engagement Letter')).toBeDefined();
  });

  it('shows loading state during export', async () => {
    render(<AuditExportControls engagement={{ clientName: 'Test' }} />);
    fireEvent.click(screen.getByText('Full Working Papers'));
    expect(screen.getByText('Exporting...')).toBeDefined();
  });
});
```

---

## Limitations & Future Work

### Current Limitations

1. **No cell styling in Excel** — SheetJS Community Edition does not support cell formatting (bold headers, number formats, borders). The Pro version ($$$) or a switch to ExcelJS would be needed.

2. **No PDF export** — The existing `pdfGenerationService.js` uses `pdfkit` (server-side). A client-side PDF solution (e.g., `jsPDF`) could be added to `AuditExportControls` if needed.

3. **No template customisation** — Document templates are hardcoded. A future version could load templates from Supabase or local storage.

4. **Fixed column order** — Excel columns follow a fixed order. A future version could allow users to select/reorder columns.

### Phase 2 Enhancements (Planned)

- **Supabase integration** — Save exports to Supabase Storage with audit trail logging
- **Template editor** — Allow firms to customise report templates
- **Batch export** — Export all phases at once as a ZIP
- **Digital signatures** — Add firm/partner signature blocks to Word documents
- **Branded headers** — Firm logo and letterhead in Word exports

---

## Verification Checklist

- [x] Both services created with singleton + class exports
- [x] UI component renders 7 export buttons (3 Excel + 4 Word)
- [x] All methods handle missing/empty data gracefully
- [x] File naming follows `{Client}_{Type}_{Date}.{ext}` convention
- [x] No new dependencies added (uses existing `xlsx` and `docx`)
- [x] Lint passes (0 errors)
- [x] Build passes
- [x] Matches dark-mode design system (COLORS object)
- [x] Download mechanism works client-side (Blob + createObjectURL)
- [x] ISA compliance: 230, 210, 265, 315, 500, 700
