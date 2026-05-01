import { useState } from 'react'

export function InterimPhase({ data, onComplete }) {
  const [procedures, setProcedures] = useState(data?.procedures || [])
  const [findings, setFindings] = useState(data?.findings || [])
  const [isComplete, setIsComplete] = useState(false)

  const handleAddProcedure = (procedure) => {
    setProcedures([...procedures, procedure])
  }

  const handleAddFinding = (finding) => {
    setFindings([...findings, finding])
  }

  const handleComplete = () => {
    setIsComplete(true)
    onComplete?.({
      procedures,
      findings,
      status: 'completed',
      completedAt: new Date().toISOString()
    })
  }

  return (
    <div style={{
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <h2>🔍 Interim Audit Phase</h2>

      <section style={{ marginTop: '20px' }}>
        <h3>Procedures ({procedures.length})</h3>
        <button onClick={() => handleAddProcedure({ id: Date.now(), name: 'New Procedure' })}>
          + Add Procedure
        </button>
        <ul>
          {procedures.map(p => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '20px' }}>
        <h3>Findings ({findings.length})</h3>
        <button onClick={() => handleAddFinding({ id: Date.now(), description: 'New Finding' })}>
          + Add Finding
        </button>
        <ul>
          {findings.map(f => (
            <li key={f.id}>{f.description}</li>
          ))}
        </ul>
      </section>

      <button
        onClick={handleComplete}
        disabled={isComplete}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#FB8C00',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: isComplete ? 'not-allowed' : 'pointer',
          opacity: isComplete ? 0.5 : 1
        }}
      >
        {isComplete ? 'Phase Completed' : 'Complete Phase'}
      </button>
    </div>
  )
}

export default InterimPhase
