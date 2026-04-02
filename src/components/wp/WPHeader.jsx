/**
 * WPHeader — Working Paper header with per-FSLI export buttons
 * Generates .docx and .xlsx working papers using enhanced export services
 */

import { useState, useCallback } from 'react';

const COLORS = {
  border: 'rgba(255,255,255,0.08)', text: '#F8F8F8',
  dim: 'rgba(255,255,255,0.6)', blue: '#42A5F5', green: '#66BB6A'
};

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function WPHeader({ fsliId, fsliLabel, engagement }) {
  const [exporting, setExporting] = useState(null);

  const handleExportDocx = useCallback(async () => {
    setExporting('docx');
    try {
      const { default: wordService } = await import('../../services/enhancedAuditWordExportService');
      const blob = await wordService.generateFSLIWorkPaper(engagement, fsliId);
      saveBlob(blob, `WP_${fsliId}_${engagement?.entityName || 'entity'}.docx`);
    } catch (err) {
      console.error('[WPHeader] Word export error:', err);
    }
    setExporting(null);
  }, [engagement, fsliId]);

  const handleExportXlsx = useCallback(async () => {
    setExporting('xlsx');
    try {
      const { default: excelService } = await import('../../services/enhancedAuditExcelExportService');
      const blob = excelService.generateFSLIWorkPaperExcel(engagement, fsliId);
      saveBlob(blob, `WP_${fsliId}_${engagement?.entityName || 'entity'}.xlsx`);
    } catch (err) {
      console.error('[WPHeader] Excel export error:', err);
    }
    setExporting(null);
  }, [engagement, fsliId]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', borderBottom: `1px solid ${COLORS.border}`,
      marginBottom: '12px'
    }}>
      <div style={{ color: COLORS.text, fontSize: '14px', fontWeight: 700 }}>
        {fsliLabel || fsliId}
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={handleExportDocx}
          disabled={exporting === 'docx'}
          style={{
            padding: '6px 12px', background: COLORS.blue + '20',
            border: `1px solid ${COLORS.blue}40`, color: COLORS.blue,
            borderRadius: '4px', fontSize: '11px', fontWeight: 600,
            cursor: exporting === 'docx' ? 'wait' : 'pointer',
            opacity: exporting === 'docx' ? 0.6 : 1
          }}
        >
          {exporting === 'docx' ? 'Generating…' : '📄 Export .docx'}
        </button>
        <button
          onClick={handleExportXlsx}
          disabled={exporting === 'xlsx'}
          style={{
            padding: '6px 12px', background: COLORS.green + '20',
            border: `1px solid ${COLORS.green}40`, color: COLORS.green,
            borderRadius: '4px', fontSize: '11px', fontWeight: 600,
            cursor: exporting === 'xlsx' ? 'wait' : 'pointer',
            opacity: exporting === 'xlsx' ? 0.6 : 1
          }}
        >
          {exporting === 'xlsx' ? 'Generating…' : '📊 Export .xlsx'}
        </button>
      </div>
    </div>
  );
}
