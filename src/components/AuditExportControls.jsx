/**
 * Audit Export Controls
 * Provides UI for exporting audit procedures, working papers, and reports
 */

import React, { useState } from 'react';
import AuditExcelExportService from '../services/auditExcelExportService';
import AuditWordExportService from '../services/auditWordExportService';

const AuditExportControls = ({ engagement, phaseId = 'planning' }) => {
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');
  const [downloadedFile, setDownloadedFile] = useState(null);

  /**
   * Export to Excel
   */
  const handleExportToExcel = async () => {
    try {
      setExporting(true);
      setExportProgress('Generating Excel workbook...');

      const excelService = new AuditExcelExportService();
      const excelBuffer = excelService.generateAuditProceduresWorkbook(engagement, phaseId);

      // Create blob and download
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${engagement.clientName || 'audit'}-procedures-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadedFile({
        type: 'Excel',
        filename: link.download,
        timestamp: new Date(),
        size: (excelBuffer.length / 1024 / 1024).toFixed(2) + ' MB'
      });

      setExportProgress('✅ Excel export complete!');
      setTimeout(() => setExportProgress(''), 3000);
    } catch (err) {
      console.error('Excel export error:', err);
      setExportProgress('❌ Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  /**
   * Export to Word
   */
  const handleExportToWord = async () => {
    try {
      setExporting(true);
      setExportProgress('Generating Word document...');

      const wordService = new AuditWordExportService();
      const wordBuffer = await wordService.generateAuditReport(engagement);

      // Create blob and download
      const blob = new Blob([wordBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${engagement.clientName || 'audit'}-report-${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadedFile({
        type: 'Word',
        filename: link.download,
        timestamp: new Date(),
        size: (wordBuffer.length / 1024 / 1024).toFixed(2) + ' MB'
      });

      setExportProgress('✅ Word export complete!');
      setTimeout(() => setExportProgress(''), 3000);
    } catch (err) {
      console.error('Word export error:', err);
      setExportProgress('❌ Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  /**
   * Export both Excel and Word
   */
  const handleExportAll = async () => {
    try {
      setExporting(true);
      setExportProgress('Generating both Excel and Word documents...');

      // Generate Excel
      const excelService = new AuditExcelExportService();
      const excelBuffer = excelService.generateAuditProceduresWorkbook(engagement, phaseId);

      // Generate Word
      const wordService = new AuditWordExportService();
      const wordBuffer = await wordService.generateAuditReport(engagement);

      // Download Excel
      const excelBlob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const excelUrl = window.URL.createObjectURL(excelBlob);
      const excelLink = document.createElement('a');
      excelLink.href = excelUrl;
      excelLink.download = `${engagement.clientName || 'audit'}-procedures-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(excelLink);
      excelLink.click();
      document.body.removeChild(excelLink);
      window.URL.revokeObjectURL(excelUrl);

      // Download Word
      setTimeout(() => {
        const wordBlob = new Blob([wordBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        const wordUrl = window.URL.createObjectURL(wordBlob);
        const wordLink = document.createElement('a');
        wordLink.href = wordUrl;
        wordLink.download = `${engagement.clientName || 'audit'}-report-${new Date().toISOString().split('T')[0]}.docx`;
        document.body.appendChild(wordLink);
        wordLink.click();
        document.body.removeChild(wordLink);
        window.URL.revokeObjectURL(wordUrl);

        setDownloadedFile({
          type: 'Both',
          timestamp: new Date(),
          message: 'Excel and Word documents exported successfully!'
        });

        setExportProgress('✅ Both exports complete!');
        setTimeout(() => setExportProgress(''), 3000);
      }, 500);
    } catch (err) {
      console.error('Export error:', err);
      setExportProgress('❌ Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginTop: '20px'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px' }}>📥 Export Audit Procedures & Reports</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        {/* Excel Export Button */}
        <button
          onClick={handleExportToExcel}
          disabled={exporting}
          style={{
            padding: '15px',
            backgroundColor: '#217346',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: exporting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: exporting ? 0.6 : 1,
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => !exporting && (e.target.style.backgroundColor = '#1a5a38')}
          onMouseLeave={(e) => !exporting && (e.target.style.backgroundColor = '#217346')}
        >
          <span style={{ fontSize: '20px' }}>📊</span>
          Export to Excel
        </button>

        {/* Word Export Button */}
        <button
          onClick={handleExportToWord}
          disabled={exporting}
          style={{
            padding: '15px',
            backgroundColor: '#2b5797',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: exporting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: exporting ? 0.6 : 1,
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => !exporting && (e.target.style.backgroundColor = '#1e3f5a')}
          onMouseLeave={(e) => !exporting && (e.target.style.backgroundColor = '#2b5797')}
        >
          <span style={{ fontSize: '20px' }}>📄</span>
          Export to Word
        </button>

        {/* Export Both Button */}
        <button
          onClick={handleExportAll}
          disabled={exporting}
          style={{
            padding: '15px',
            backgroundColor: '#c5504d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: exporting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: exporting ? 0.6 : 1,
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => !exporting && (e.target.style.backgroundColor = '#a63f39')}
          onMouseLeave={(e) => !exporting && (e.target.style.backgroundColor = '#c5504d')}
        >
          <span style={{ fontSize: '20px' }}>🎯</span>
          Export All
        </button>
      </div>

      {/* Progress Indicator */}
      {exportProgress && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: exportProgress.includes('✅') ? '#e8f5e9' : exportProgress.includes('❌') ? '#ffebee' : '#e3f2fd',
          color: exportProgress.includes('✅') ? '#2e7d32' : exportProgress.includes('❌') ? '#c62828' : '#1565c0',
          borderRadius: '6px',
          marginBottom: '15px',
          fontWeight: '500'
        }}>
          {exportProgress}
        </div>
      )}

      {/* Download History */}
      {downloadedFile && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '6px',
          borderLeft: '4px solid #4CAF50'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '10px' }}>✅ Last Download</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <p><strong>Type:</strong> {downloadedFile.type}</p>
            {downloadedFile.filename && (
              <>
                <p><strong>Filename:</strong> {downloadedFile.filename}</p>
                <p><strong>Size:</strong> {downloadedFile.size}</p>
              </>
            )}
            {downloadedFile.message && (
              <p><strong>Status:</strong> {downloadedFile.message}</p>
            )}
            <p><strong>Time:</strong> {downloadedFile.timestamp.toLocaleTimeString()}</p>
          </div>
        </div>
      )}

      {/* Export Information Panel */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '6px',
        borderLeft: '4px solid #0066cc'
      }}>
        <h3 style={{ marginTop: 0 }}>📋 What's Included in Exports:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          <div>
            <p><strong>Excel Workbook Contains:</strong></p>
            <ul style={{ marginTop: '8px', paddingLeft: '20px', margin: 0 }}>
              <li>Summary of engagement</li>
              <li>Procedures by FSLI</li>
              <li>Testing results with samples</li>
              <li>Audit trail</li>
              <li>Findings & exceptions</li>
              <li>Risk assessment matrix</li>
              <li>Materiality calculations</li>
            </ul>
          </div>
          <div>
            <p><strong>Word Report Contains:</strong></p>
            <ul style={{ marginTop: '8px', paddingLeft: '20px', margin: 0 }}>
              <li>Title page & TOC</li>
              <li>Executive summary</li>
              <li>Audit planning strategy</li>
              <li>Risk assessment details</li>
              <li>Materiality analysis</li>
              <li>Testing results</li>
              <li>All findings with recommendations</li>
              <li>Audit opinion & conclusion</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div style={{
        marginTop: '15px',
        padding: '15px',
        backgroundColor: '#fff3e0',
        borderRadius: '6px',
        borderLeft: '4px solid #ff9800',
        fontSize: '14px'
      }}>
        <p style={{ marginTop: 0 }}>
          <strong>💡 Tip:</strong> Use Excel for detailed working papers and data entry. Use Word for formal reports and client communication. Both formats can be customized further in their respective applications.
        </p>
      </div>
    </div>
  );
};

export default AuditExportControls;
