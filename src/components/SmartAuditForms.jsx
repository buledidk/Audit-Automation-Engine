import { useState } from 'react';

/**
 * Smart Audit Forms
 * Intelligent forms with validation, auto-fill, and smart suggestions
 * Context-aware field population based on engagement data
 */
const SmartAuditForms = () => {
  const [formData, setFormData] = useState({
    fsli: 'receivables',
    procedure: 'confirmations',
    itemsTested: 50,
    itemsPassed: 48,
    itemsFailed: 2,
    exceptions: '',
    auditorName: 'John Smith',
    reviewerName: '',
    testDate: '2026-03-19',
    conclusion: 'qualified'
  });

  const [suggestions, setSuggestions] = useState([
    'Based on 2% exception rate, consider documenting management response',
    'Receivables aging shows 15% over 90 days - allowance may need review'
  ]);

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Smart suggestions based on input
    if (field === 'itemsFailed' && parseInt(value) > 0) {
      setSuggestions(['⚠️ Exceptions identified - ensure management response documented']);
    }
  };

  const exceptionRate = formData.itemsTested > 0 
    ? ((formData.itemsFailed / formData.itemsTested) * 100).toFixed(2)
    : 0;

  return (
    <div style={{ padding: '20px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
      <h3>📝 Smart Audit Forms</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Form Fields */}
        <div>
          <label style={{ display: 'block', marginBottom: '16px' }}>
            <strong>FSLI:</strong>
            <select
              value={formData.fsli}
              onChange={(e) => handleFieldChange('fsli', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                marginTop: '4px',
                fontFamily: 'inherit'
              }}
            >
              <option value="cash">Cash & Bank</option>
              <option value="receivables">Trade Receivables</option>
              <option value="inventory">Inventory</option>
              <option value="fixedAssets">Fixed Assets</option>
              <option value="payables">Trade Payables</option>
            </select>
          </label>

          <label style={{ display: 'block', marginBottom: '16px' }}>
            <strong>Procedure:</strong>
            <select
              value={formData.procedure}
              onChange={(e) => handleFieldChange('procedure', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                marginTop: '4px',
                fontFamily: 'inherit'
              }}
            >
              <option value="confirmations">Confirmations</option>
              <option value="reconciliation">Reconciliation</option>
              <option value="cutoff">Cutoff Testing</option>
              <option value="valuation">Valuation Review</option>
            </select>
          </label>

          <label style={{ display: 'block', marginBottom: '16px' }}>
            <strong>Items Tested:</strong>
            <input
              type="number"
              value={formData.itemsTested}
              onChange={(e) => handleFieldChange('itemsTested', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                marginTop: '4px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '16px' }}>
            <strong>Items Passed:</strong>
            <input
              type="number"
              value={formData.itemsPassed}
              onChange={(e) => handleFieldChange('itemsPassed', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                marginTop: '4px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '16px' }}>
            <strong>Items Failed:</strong>
            <input
              type="number"
              value={formData.itemsFailed}
              onChange={(e) => handleFieldChange('itemsFailed', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                marginTop: '4px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                borderColor: formData.itemsFailed > 0 ? '#F44336' : '#ddd'
              }}
            />
          </label>
        </div>

        {/* Auto-Calculated Metrics */}
        <div style={{ padding: '16px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h4 style={{ marginTop: 0 }}>Auto-Calculated Metrics</h4>

          <div style={{ marginBottom: '12px', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Exception Rate</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: exceptionRate > 5 ? '#F44336' : '#4CAF50' }}>
              {exceptionRate}%
            </div>
          </div>

          <div style={{ marginBottom: '12px', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Pass Rate</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
              {formData.itemsTested > 0 ? ((formData.itemsPassed / formData.itemsTested) * 100).toFixed(1) : 0}%
            </div>
          </div>

          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Test Completion</div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden',
              marginTop: '4px'
            }}>
              <div style={{
                width: `${Math.round((formData.itemsPassed / formData.itemsTested) * 100) || 0}%`,
                height: '100%',
                backgroundColor: '#4CAF50'
              }} />
            </div>
          </div>

          {/* Smart Suggestions */}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>💡 Smart Suggestions</h4>
            {suggestions.map((sugg, idx) => (
              <div key={idx} style={{
                padding: '8px',
                backgroundColor: '#FFF3E0',
                borderRadius: '4px',
                marginBottom: '6px',
                fontSize: '12px',
                borderLeft: '3px solid #FF9800'
              }}>
                {sugg}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <label style={{ display: 'block' }}>
          <strong>Auditor Name:</strong>
          <input
            type="text"
            value={formData.auditorName}
            onChange={(e) => handleFieldChange('auditorName', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              marginTop: '4px',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </label>

        <label style={{ display: 'block' }}>
          <strong>Reviewer Name:</strong>
          <input
            type="text"
            value={formData.reviewerName}
            onChange={(e) => handleFieldChange('reviewerName', e.target.value)}
            placeholder="Will auto-populate based on hierarchy"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              marginTop: '4px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              backgroundColor: '#f0f0f0'
            }}
          />
        </label>
      </div>

      <label style={{ display: 'block', marginBottom: '20px' }}>
        <strong>Test Date:</strong>
        <input
          type="date"
          value={formData.testDate}
          onChange={(e) => handleFieldChange('testDate', e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginTop: '4px',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
      </label>

      {/* Submit Button */}
      <button style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px'
      }}>
        ✅ Save & Submit Form
      </button>
    </div>
  );
};

export default SmartAuditForms;
