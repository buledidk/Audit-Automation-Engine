import { useState } from 'react';

/**
 * Audit Procedures Panel
 * Allows auditors to execute and document audit procedures with professional judgment
 * Compliant with ISA 500 (Audit Evidence) and ISA 320 (Materiality)
 */
const AuditProceduresPanel = () => {
  const [selectedFSLI, setSelectedFSLI] = useState('cash');
  const [procedures, setProcedures] = useState({});
  const [currentProcedure, setCurrentProcedure] = useState(null);

  const fslis = [
    { id: 'cash', name: 'Cash & Bank', materiality: '£50,000' },
    { id: 'receivables', name: 'Trade Receivables', materiality: '£75,000' },
    { id: 'inventory', name: 'Inventory', materiality: '£100,000' },
    { id: 'fixedAssets', name: 'Fixed Assets', materiality: '£150,000' },
    { id: 'payables', name: 'Trade Payables', materiality: '£75,000' },
    { id: 'equity', name: "Shareholders' Equity", materiality: '£200,000' }
  ];

  const defaultProcedures = {
    cash: [
      { id: 'p1', description: 'Bank confirmations', complexity: 'medium', hours: 2 },
      { id: 'p2', description: 'Cash reconciliation', complexity: 'low', hours: 1.5 },
      { id: 'p3', description: 'Cutoff testing', complexity: 'medium', hours: 2 }
    ],
    receivables: [
      { id: 'p4', description: 'Receivables confirmations', complexity: 'high', hours: 3 },
      { id: 'p5', description: 'Aged receivables review', complexity: 'medium', hours: 2 },
      { id: 'p6', description: 'Allowance adequacy', complexity: 'high', hours: 2.5 }
    ]
  };

  const handleRecordTesting = (procedureId) => {
    const newProcedure = {
      procedureId,
      fsli: selectedFSLI,
      status: 'completed',
      itemsTested: 50,
      itemsPassed: 50,
      itemsFailed: 0,
      conclusion: 'Fairly stated',
      auditorJudgment: {
        decision: 'Approved',
        reasoning: 'Testing performed appropriately',
        riskLevel: 'Low'
      },
      timestamp: new Date().toLocaleString()
    };

    setProcedures({
      ...procedures,
      [procedureId]: newProcedure
    });

    setCurrentProcedure(newProcedure);
  };

  const complexityColor = (complexity) => {
    const colors = { low: '#4CAF50', medium: '#FF9800', high: '#F44336' };
    return colors[complexity] || '#999';
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h2>📋 Audit Procedures</h2>

      {/* FSLI Selection */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Select Financial Statement Line Item:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {fslis.map(fsli => (
            <div
              key={fsli.id}
              onClick={() => setSelectedFSLI(fsli.id)}
              style={{
                padding: '15px',
                backgroundColor: selectedFSLI === fsli.id ? '#0066cc' : 'white',
                color: selectedFSLI === fsli.id ? 'white' : 'black',
                borderRadius: '4px',
                cursor: 'pointer',
                border: '2px solid' + (selectedFSLI === fsli.id ? '#0066cc' : '#ddd'),
                transition: 'all 0.2s'
              }}
            >
              <strong>{fsli.name}</strong>
              <br />
              <small>Materiality: {fsli.materiality}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Procedures for Selected FSLI */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Procedures for {fslis.find(f => f.id === selectedFSLI)?.name}:</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {(defaultProcedures[selectedFSLI] || []).map(proc => (
            <div
              key={proc.id}
              style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '4px',
                borderLeft: `4px solid ${complexityColor(proc.complexity)}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{proc.description}</h4>
                  <small style={{ color: '#666' }}>
                    Complexity: <span style={{ color: complexityColor(proc.complexity), fontWeight: 'bold' }}>
                      {proc.complexity.toUpperCase()}
                    </span> | Est. Hours: {proc.hours}
                  </small>
                </div>

                {procedures[proc.id] ? (
                  <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>✅ TESTED</div>
                    <small>{procedures[proc.id].itemsTested} items tested</small>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRecordTesting(proc.id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#0066cc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Run Procedure
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Procedure Details */}
      {currentProcedure && (
        <div style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          borderLeft: '4px solid #0066cc'
        }}>
          <h3>Procedure Results</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Items Tested:</td>
                <td style={{ padding: '8px' }}>{currentProcedure.itemsTested}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Items Passed:</td>
                <td style={{ padding: '8px', color: '#4CAF50' }}>{currentProcedure.itemsPassed}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Items Failed:</td>
                <td style={{ padding: '8px', color: currentProcedure.itemsFailed > 0 ? '#F44336' : '#4CAF50' }}>
                  {currentProcedure.itemsFailed}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Professional Judgment:</td>
                <td style={{ padding: '8px' }}>{currentProcedure.auditorJudgment.decision}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Risk Assessment:</td>
                <td style={{ padding: '8px' }}>{currentProcedure.auditorJudgment.riskLevel}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
            <strong>Auditor Reasoning:</strong>
            <p style={{ margin: '8px 0' }}>{currentProcedure.auditorJudgment.reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditProceduresPanel;
