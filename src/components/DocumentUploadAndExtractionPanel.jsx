/**
 * Document Upload and Smart Extraction Panel
 * Tokenizes documents, extracts audit-relevant data, auto-populates procedures
 * Integrates Companies House, smart search, and framework reporting
 */

import React, { useState, useCallback } from 'react';
import documentTokenizationService from '../services/documentTokenizationService';
import aiExtractionService from '../services/aiExtractionService';
import companiesHouseConnector from '../services/connectors/companiesHouseConnector';
import smartSearchService from '../services/smartSearchService';
import autoPopulationEngine from '../services/autoPopulationEngine';
import frameworkReportingEngine from '../services/frameworkReportingEngine';

const DocumentUploadAndExtractionPanel = ({ engagement }) => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [extractionProgress, setExtractionProgress] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [companiesHouseData, setCompaniesHouseData] = useState(null);
  const [autoPopulatedData, setAutoPopulatedData] = useState(null);
  const [frameworkReport, setFrameworkReport] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(false);

  /**
   * Handle document upload
   */
  const handleDocumentUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const documentId = `doc-${Date.now()}`;

      // Update progress
      setExtractionProgress(prev => ({
        ...prev,
        [documentId]: { status: 'uploading', progress: 0 }
      }));

      // Tokenize document
      const tokenization = await documentTokenizationService.uploadAndTokenize(
        file,
        documentId
      );

      setExtractionProgress(prev => ({
        ...prev,
        [documentId]: { ...prev[documentId], status: 'tokenizing', progress: 50 }
      }));

      setUploadedDocuments(prev => [...prev, {
        id: documentId,
        ...tokenization.metadata,
        chunks: tokenization.chunks
      }]);

      // Start AI extraction
      setExtractionProgress(prev => ({
        ...prev,
        [documentId]: { ...prev[documentId], status: 'extracting', progress: 70 }
      }));

      const extractedData = await aiExtractionService.extractAuditData(
        tokenization.chunks,
        tokenization.metadata,
        {
          entityName: engagement.entityName,
          industry: engagement.industry,
          standards: engagement.standards || ['ISA 200-700', 'FRS 102'],
          fslis: engagement.fslis || ['Cash', 'Receivables', 'Inventory'],
          riskLevel: engagement.riskLevel || 'medium'
        }
      );

      // Auto-populate procedures
      setExtractionProgress(prev => ({
        ...prev,
        [documentId]: { ...prev[documentId], status: 'populating', progress: 85 }
      }));

      const populated = await autoPopulationEngine.autoPopulate(extractedData, {
        entityName: engagement.entityName,
        industry: engagement.industry,
        jurisdiction: engagement.jurisdiction || 'UK'
      });

      setAutoPopulatedData(populated);

      setExtractionProgress(prev => ({
        ...prev,
        [documentId]: { status: 'complete', progress: 100 }
      }));

      console.log('✅ Document extraction complete');
    } catch (error) {
      console.error('Upload failed:', error);
      setExtractionProgress(prev => ({
        ...prev,
        [documentId]: { status: 'error', error: error.message }
      }));
    } finally {
      setLoading(false);
    }
  }, [engagement]);

  /**
   * Search across all sources
   */
  const handleSmartSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await smartSearchService.search(searchQuery, {
        limit: 50
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  /**
   * Search Companies House
   */
  const handleCompaniesHouseSearch = useCallback(async () => {
    if (!engagement.entityName) return;

    setLoading(true);
    try {
      const results = await companiesHouseConnector.searchCompany(engagement.entityName);
      if (results.companies.length > 0) {
        const details = await companiesHouseConnector.getCompanyDetails(
          results.companies[0].companyNumber
        );
        const officers = await companiesHouseConnector.getCompanyOfficers(
          results.companies[0].companyNumber
        );

        setCompaniesHouseData({
          company: results.companies[0],
          details,
          officers
        });
      }
    } catch (error) {
      console.error('Companies House search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [engagement.entityName]);

  /**
   * Generate framework report
   */
  const handleGenerateReport = useCallback(async () => {
    if (!autoPopulatedData) {
      alert('Please extract document data first');
      return;
    }

    setLoading(true);
    try {
      const report = await frameworkReportingEngine.generateFrameworkReport(
        autoPopulatedData,
        ['ISA', 'FRS 102', 'GDPR', 'ISQM 1']
      );

      setFrameworkReport(report);
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setLoading(false);
    }
  }, [autoPopulatedData]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h2>📄 Document Upload & Smart Extraction</h2>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        {['upload', 'search', 'companiesHouse', 'extraction', 'reporting'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === tab ? '#0052CC' : 'transparent',
              color: activeTab === tab ? 'white' : '#333',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid #0052CC' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>📤 Upload Documents</h3>
          <p>Upload audit-relevant documents for tokenization and AI-powered extraction</p>

          <div style={{
            border: '2px dashed #0052CC',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <input
              type="file"
              multiple
              onChange={handleDocumentUpload}
              accept=".pdf,.docx,.xlsx,.txt"
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📁</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                Click to upload or drag and drop
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                PDF, DOCX, Excel, or Text files
              </div>
            </label>
          </div>

          {/* Uploaded Documents */}
          {uploadedDocuments.length > 0 && (
            <div>
              <h4>Uploaded Documents</h4>
              {uploadedDocuments.map(doc => (
                <div key={doc.id} style={{
                  padding: '15px',
                  backgroundColor: '#e8f4f8',
                  borderRadius: '4px',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{doc.filename}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {doc.chunkCount} chunks | {doc.totalTokens} tokens | {doc.fileSize} bytes
                      </div>
                    </div>
                    {extractionProgress[doc.id] && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                          {extractionProgress[doc.id].status}
                        </div>
                        <div style={{ width: '200px', height: '8px', backgroundColor: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${extractionProgress[doc.id].progress}%`,
                            height: '100%',
                            backgroundColor: '#4CAF50',
                            transition: 'width 0.3s'
                          }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Smart Search Tab */}
      {activeTab === 'search' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>🔍 Smart Search</h3>
          <p>Search across documents, Companies House, and audit data with relevance scoring</p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search documents, entities, procedures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSmartSearch()}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleSmartSearch}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#0052CC',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading ? '🔄 Searching...' : '🔍 Search'}
            </button>
          </div>

          {searchResults && (
            <div>
              <h4>Search Results ({searchResults.totalResults}) - {searchResults.searchTime}ms</h4>
              {searchResults.combinedResults.map((result, idx) => (
                <div key={idx} style={{
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  borderLeft: '4px solid #0052CC'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{result.title}</strong>
                      <div style={{ fontSize: '14px', color: '#666' }}>{result.description}</div>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                        Source: {result.source} | Relevance: {Math.round((result.relevanceScore || 0) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Companies House Tab */}
      {activeTab === 'companiesHouse' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>🏢 Companies House Data</h3>
          <p>Verify entity details and assess audit risk indicators</p>

          <button
            onClick={handleCompaniesHouseSearch}
            disabled={loading || !engagement.entityName}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0052CC',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}
          >
            {loading ? '🔄 Searching...' : '🔍 Search Companies House'}
          </button>

          {companiesHouseData && (
            <div>
              {/* Company Details */}
              <div style={{ backgroundColor: '#e8f4f8', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
                <h4>{companiesHouseData.company.companyName}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '10px' }}>
                  <div>
                    <strong>Company Number:</strong>
                    <div>{companiesHouseData.company.companyNumber}</div>
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <div style={{ color: companiesHouseData.company.status === 'Active' ? '#4CAF50' : '#ff9800' }}>
                      {companiesHouseData.company.status}
                    </div>
                  </div>
                  <div>
                    <strong>Incorporated:</strong>
                    <div>{companiesHouseData.company.incorporation}</div>
                  </div>
                  <div>
                    <strong>Type:</strong>
                    <div>{companiesHouseData.company.type}</div>
                  </div>
                </div>
              </div>

              {/* Risk Indicators */}
              {companiesHouseData.details?.riskIndicators && companiesHouseData.details.riskIndicators.length > 0 && (
                <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '4px', borderLeft: '4px solid #ff9800' }}>
                  <h4>⚠️ Risk Indicators</h4>
                  {companiesHouseData.details.riskIndicators.map((risk, idx) => (
                    <div key={idx} style={{ marginBottom: '10px' }}>
                      <strong>{risk.factor}</strong> - {risk.description}
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        Implication: {risk.implication}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Officers */}
              {companiesHouseData.officers?.officers && companiesHouseData.officers.officers.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4>👥 Officers ({companiesHouseData.officers.officers.length})</h4>
                  {companiesHouseData.officers.officers.slice(0, 3).map((officer, idx) => (
                    <div key={idx} style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', marginBottom: '10px' }}>
                      <strong>{officer.name}</strong> - {officer.position}
                      <div style={{ fontSize: '12px', color: '#666' }}>Appointed: {officer.appointed}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Extraction Results Tab */}
      {activeTab === 'extraction' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>✨ Extraction Results & Auto-Population</h3>

          {autoPopulatedData && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#e8f4f8', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0052CC' }}>
                    {autoPopulatedData.enrichmentSummary.proceduresGenerated}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Procedures Generated</div>
                </div>
                <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
                    {autoPopulatedData.enrichmentSummary.resultsPopulated}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Test Results</div>
                </div>
                <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
                    {autoPopulatedData.enrichmentSummary.findingsCreated}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Findings Identified</div>
                </div>
                <div style={{ backgroundColor: '#f3e5f5', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b1fa2' }}>
                    {autoPopulatedData.enrichmentSummary.estimatedCompletionRate}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Completion Rate</div>
                </div>
              </div>

              {/* Sample Procedures */}
              {autoPopulatedData.procedures && autoPopulatedData.procedures.length > 0 && (
                <div>
                  <h4>Sample Generated Procedures</h4>
                  {autoPopulatedData.procedures.slice(0, 3).map((proc, idx) => (
                    <div key={idx} style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <strong>{proc.name}</strong>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {proc.isA} | FSLI: {proc.fsli} | Sample Size: {proc.sampleSize}
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', backgroundColor: '#e0f2f1', padding: '4px 8px', borderRadius: '4px' }}>
                          {proc.priority}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Reporting Tab */}
      {activeTab === 'reporting' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>📊 Framework Compliance Reporting</h3>

          <button
            onClick={handleGenerateReport}
            disabled={loading || !autoPopulatedData}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0052CC',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}
          >
            {loading ? '⏳ Generating Report...' : '📄 Generate Framework Report'}
          </button>

          {frameworkReport && (
            <div>
              <div style={{ backgroundColor: '#e8f4f8', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
                <h4>Report Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '10px' }}>
                  <div>
                    <strong>Total Findings:</strong>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {frameworkReport.executiveSummary.totalFindings}
                    </div>
                  </div>
                  <div>
                    <strong>Critical Gaps:</strong>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f44336' }}>
                      {frameworkReport.executiveSummary.criticalGaps}
                    </div>
                  </div>
                  <div>
                    <strong>Frameworks Reported:</strong>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {frameworkReport.frameworksReported.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Matrix */}
              <div>
                <h4>Compliance Matrix</h4>
                {Object.entries(frameworkReport.complianceMatrix).map(([framework, status]) => (
                  <div key={framework} style={{
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '4px',
                    marginBottom: '10px',
                    borderLeft: `4px solid ${status.status === 'compliant' ? '#4CAF50' : status.status === 'partial' ? '#ff9800' : '#f44336'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{framework}</strong>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Status: {status.status} | Score: {status.score}%
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                          {status.gaps} gaps
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUploadAndExtractionPanel;
