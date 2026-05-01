import { useState } from 'react';

/**
 * Documentation Panel
 * Controls documentation generation and export
 * Auto-generates on phase completion
 */
const DocumentationPanel = ({ phase, onExport }) => {
  const [exportFormat, setExportFormat] = useState('excel');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport?.(exportFormat);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px', border: '2px solid #0066cc' }}>
      <h3>📄 Auto-Generated Documentation</h3>

      <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '4px', borderLeft: '4px solid #0066cc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>✅</span>
          <div>
            <strong>Documentation Ready for {phase || 'Phase'}</strong>
            <br />
            <small>Auto-generated with all audit procedures, testing results, and professional judgments documented.</small>
          </div>
        </div>
      </div>

      {/* Export Format Selection */}
      <div style={{ marginBottom: '15px' }}>
        <h4>Select Export Format:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { value: 'excel', label: '📊 Excel', description: 'Working papers & calculations' },
            { value: 'word', label: '📄 Word', description: 'Audit opinion & narratives' },
            { value: 'pdf', label: '📋 PDF', description: 'Complete audit report' }
          ].map(format => (
            <div
              key={format.value}
              onClick={() => setExportFormat(format.value)}
              style={{
                padding: '12px',
                backgroundColor: exportFormat === format.value ? '#0066cc' : 'white',
                color: exportFormat === format.value ? 'white' : 'black',
                borderRadius: '4px',
                cursor: 'pointer',
                border: `2px solid ${exportFormat === format.value ? '#0066cc' : '#ddd'}`,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{format.label}</div>
              <small>{format.description}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: isExporting ? '#ccc' : '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isExporting ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: '14px'
        }}
      >
        {isExporting ? '⏳ Generating...' : `📥 Download ${exportFormat.toUpperCase()}`}
      </button>

      {/* Generation Summary */}
      <div style={{ marginTop: '15px', padding: '12px', backgroundColor: 'white', borderRadius: '4px' }}>
        <h4>📋 Documentation Includes:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>✅ All audit procedures executed</li>
          <li>✅ Testing results with professional judgment</li>
          <li>✅ Evidence attachments and links</li>
          <li>✅ FSLI narratives and conclusions</li>
          <li>✅ Audit trail of all decisions</li>
          <li>✅ Regulatory compliance mappings</li>
        </ul>
      </div>

      {/* Format Details */}
      <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h4>Format Details:</h4>
        {exportFormat === 'excel' && (
          <small>
            📊 <strong>Excel Workbook:</strong><br/>
            • Summary sheet with all FSLIs<br/>
            • Procedures sheet with test samples<br/>
            • Testing results with exceptions<br/>
            • Audit trail with timestamps<br/>
            • Formulas for auditability
          </small>
        )}
        {exportFormat === 'word' && (
          <small>
            📄 <strong>Word Document:</strong><br/>
            • Professional formatted audit opinion<br/>
            • Executive summary of findings<br/>
            • FSLI narratives and conclusions<br/>
            • Supporting schedules<br/>
            • Sign-off pages with date stamps
          </small>
        )}
        {exportFormat === 'pdf' && (
          <small>
            📋 <strong>PDF Report:</strong><br/>
            • Complete audit report in PDF format<br/>
            • All sections consolidated<br/>
            • Printable and shareable<br/>
            • Digital signatures ready<br/>
            • Bookmarks for navigation
          </small>
        )}
      </div>
    </div>
  );
};

export default DocumentationPanel;
