/**
 * IPV Dashboard — Investment Portfolio Valuation
 * IFRS 13 hierarchy pie chart, sortable table, exception drill-down, add instrument modal
 */

import { useState, useMemo, useCallback } from 'react';
import { IPVEngine } from '../services/ipvEngine';

const COLORS = {
  bg: '#0A0E17', card: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)',
  text: '#F8F8F8', dim: 'rgba(255,255,255,0.6)', faint: 'rgba(255,255,255,0.3)',
  green: '#66BB6A', red: '#EF5350', orange: '#FFA726', blue: '#42A5F5',
  accent: '#F5A623', purple: '#CE93D8'
};

const LEVEL_COLORS = { 1: COLORS.green, 2: COLORS.blue, 3: COLORS.purple };

function formatCurrency(val, currency = 'GBP') {
  if (val == null) return '—';
  const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '';
  return `${symbol}${Number(val).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Simple SVG pie chart for IFRS 13 hierarchy
function HierarchyPieChart({ breakdown, totalFV }) {
  if (totalFV === 0) return <div style={{ color: COLORS.faint, textAlign: 'center', padding: '20px' }}>No data</div>;

  const slices = [1, 2, 3].map(level => ({
    level,
    value: breakdown[level]?.totalFV || 0,
    pct: totalFV > 0 ? ((breakdown[level]?.totalFV || 0) / totalFV) * 100 : 0
  })).filter(s => s.value > 0);

  let cumAngle = 0;
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, i) => {
          const startAngle = cumAngle;
          const sliceAngle = (slice.pct / 100) * 360;
          cumAngle += sliceAngle;

          if (slices.length === 1) {
            return <circle key={i} cx={cx} cy={cy} r={r} fill={LEVEL_COLORS[slice.level]} />;
          }

          const startRad = ((startAngle - 90) * Math.PI) / 180;
          const endRad = ((startAngle + sliceAngle - 90) * Math.PI) / 180;
          const largeArc = sliceAngle > 180 ? 1 : 0;
          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);

          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={LEVEL_COLORS[slice.level]}
              stroke={COLORS.bg}
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <div>
        {slices.map(s => (
          <div key={s.level} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: 12, height: 12, borderRadius: '2px', background: LEVEL_COLORS[s.level] }} />
            <span style={{ color: COLORS.text, fontSize: '12px' }}>
              Level {s.level}: {Math.round(s.pct)}% ({formatCurrency(s.value)})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IPVDashboard({ engagement, updateEngagement }) {
  const [portfolio, setPortfolio] = useState(() => engagement?.ipvPortfolio || []);
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [newInstrument, setNewInstrument] = useState({
    name: '', type: 'listed', quantity: 0, bookValue: 0,
    marketPrice: 0, quotes: '', cashFlows: '', discountRate: 0.10,
    principal: 0, interestRate: 0, termYears: 0, ticker: ''
  });

  const ipvEngine = useMemo(() => new IPVEngine(), []);

  const summary = useMemo(() => {
    if (portfolio.length === 0) return null;
    return ipvEngine.buildPortfolioSummary(portfolio);
  }, [portfolio, ipvEngine]);

  const sortedPortfolio = useMemo(() => {
    return [...portfolio].sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [portfolio, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const addInstrument = useCallback(() => {
    const inst = {
      ...newInstrument,
      id: Date.now().toString(),
      quantity: Number(newInstrument.quantity),
      bookValue: Number(newInstrument.bookValue),
      marketPrice: Number(newInstrument.marketPrice),
      principal: Number(newInstrument.principal),
      interestRate: Number(newInstrument.interestRate),
      termYears: Number(newInstrument.termYears),
      discountRate: Number(newInstrument.discountRate),
      quotes: newInstrument.quotes ? newInstrument.quotes.split(',').map(Number).filter(n => !isNaN(n)) : [],
      cashFlows: newInstrument.cashFlows ? newInstrument.cashFlows.split(',').map(Number).filter(n => !isNaN(n)) : []
    };

    const updated = [...portfolio, inst];
    setPortfolio(updated);
    if (updateEngagement) updateEngagement('ipvPortfolio', updated);
    setShowAddModal(false);
    setNewInstrument({ name: '', type: 'listed', quantity: 0, bookValue: 0, marketPrice: 0, quotes: '', cashFlows: '', discountRate: 0.10, principal: 0, interestRate: 0, termYears: 0, ticker: '' });
  }, [newInstrument, portfolio, updateEngagement]);

  const removeInstrument = (id) => {
    const updated = portfolio.filter(p => p.id !== id);
    setPortfolio(updated);
    if (updateEngagement) updateEngagement('ipvPortfolio', updated);
  };

  const handleExport = () => {
    const data = ipvEngine.exportToExcel(portfolio);
    // Generate CSV for download
    const csvContent = [data.headers.join(','), ...data.rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IPV_Portfolio_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputStyle = {
    width: '100%', padding: '8px 10px', background: COLORS.card,
    border: `1px solid ${COLORS.border}`, borderRadius: '6px',
    color: COLORS.text, fontSize: '12px', outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: COLORS.accent, marginBottom: '4px' }}>💰 Investment Portfolio Valuation</h2>
          <p style={{ color: COLORS.dim, margin: 0, fontSize: '12px' }}>IFRS 13 Fair Value • IFRS 9 ECL • IAS 40 Investment Property</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowAddModal(true)} style={{
            padding: '8px 16px', background: COLORS.green + '20', border: `1px solid ${COLORS.green}40`,
            color: COLORS.green, borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
          }}>
            + Add Instrument
          </button>
          {portfolio.length > 0 && (
            <button onClick={handleExport} style={{
              padding: '8px 16px', background: COLORS.blue + '20', border: `1px solid ${COLORS.blue}40`,
              color: COLORS.blue, borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
            }}>
              📊 Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total Fair Value', value: formatCurrency(summary.totalFV), color: COLORS.green },
            { label: 'Total Book Value', value: formatCurrency(summary.totalBV), color: COLORS.blue },
            { label: 'Total Variance', value: `${summary.totalVariance}%`, color: Math.abs(summary.totalVariance) > 5 ? COLORS.red : COLORS.green },
            { label: 'Exceptions', value: summary.exceptions.length, color: summary.exceptions.length > 0 ? COLORS.red : COLORS.green }
          ].map((card, i) => (
            <div key={i} style={{
              padding: '16px', background: COLORS.card, border: `1px solid ${COLORS.border}`,
              borderRadius: '8px', textAlign: 'center'
            }}>
              <div style={{ color: COLORS.faint, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>{card.label}</div>
              <div style={{ color: card.color, fontSize: '20px', fontWeight: 700 }}>{card.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* IFRS 13 Hierarchy Pie Chart */}
      {summary && (
        <div style={{
          padding: '20px', background: COLORS.card, border: `1px solid ${COLORS.border}`,
          borderRadius: '8px', marginBottom: '24px'
        }}>
          <div style={{ color: COLORS.text, fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>IFRS 13 Fair Value Hierarchy</div>
          <HierarchyPieChart breakdown={summary.hierarchyBreakdown} totalFV={summary.totalFV} />
        </div>
      )}

      {/* Portfolio Table */}
      {portfolio.length > 0 ? (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['name', 'type', 'bookValue', 'quantity'].map(field => (
                  <th
                    key={field}
                    onClick={() => handleSort(field)}
                    style={{
                      padding: '10px 12px', textAlign: 'left', color: COLORS.dim,
                      fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                      borderBottom: `1px solid ${COLORS.border}`, cursor: 'pointer',
                      background: sortField === field ? COLORS.accent + '10' : 'transparent'
                    }}
                  >
                    {field.replace(/([A-Z])/g, ' $1')} {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
                <th style={{ padding: '10px 12px', textAlign: 'right', color: COLORS.dim, fontSize: '10px', fontWeight: 700, borderBottom: `1px solid ${COLORS.border}` }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPortfolio.map(inst => (
                <tr
                  key={inst.id}
                  onClick={() => setSelectedInstrument(selectedInstrument?.id === inst.id ? null : inst)}
                  style={{ cursor: 'pointer', background: selectedInstrument?.id === inst.id ? COLORS.accent + '08' : 'transparent' }}
                >
                  <td style={{ padding: '10px 12px', color: COLORS.text, fontSize: '12px', fontWeight: 600, borderBottom: `1px solid ${COLORS.border}` }}>{inst.name || inst.ticker}</td>
                  <td style={{ padding: '10px 12px', color: COLORS.dim, fontSize: '12px', borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                      background: LEVEL_COLORS[inst.type === 'listed' ? 1 : inst.type === 'semi-listed' ? 2 : 3] + '20',
                      color: LEVEL_COLORS[inst.type === 'listed' ? 1 : inst.type === 'semi-listed' ? 2 : 3]
                    }}>
                      {inst.type}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: COLORS.text, fontSize: '12px', borderBottom: `1px solid ${COLORS.border}` }}>{formatCurrency(inst.bookValue)}</td>
                  <td style={{ padding: '10px 12px', color: COLORS.dim, fontSize: '12px', borderBottom: `1px solid ${COLORS.border}` }}>{inst.quantity || '—'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: `1px solid ${COLORS.border}` }}>
                    <button onClick={(e) => { e.stopPropagation(); removeInstrument(inst.id); }} style={{
                      background: 'none', border: 'none', color: COLORS.red, cursor: 'pointer', fontSize: '12px'
                    }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', color: COLORS.faint }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💰</div>
          <div style={{ fontSize: '14px' }}>No instruments in portfolio</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>Click "Add Instrument" to begin IPV</div>
        </div>
      )}

      {/* Exception Drill-Down */}
      {summary && summary.exceptions.length > 0 && (
        <div style={{ marginTop: '24px', padding: '16px', background: COLORS.red + '10', border: `1px solid ${COLORS.red}30`, borderRadius: '8px' }}>
          <div style={{ color: COLORS.red, fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
            ⚠️ Exceptions ({summary.exceptions.length})
          </div>
          {summary.exceptions.map((exc, i) => (
            <div key={i} style={{ padding: '8px', background: COLORS.card, borderRadius: '4px', marginBottom: '6px' }}>
              <div style={{ color: COLORS.text, fontSize: '12px', fontWeight: 600 }}>{exc.name || exc.ticker}</div>
              <div style={{ color: COLORS.red, fontSize: '11px' }}>{exc.exceptionReason}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add Instrument Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }} onClick={() => setShowAddModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: 440, maxHeight: '80vh', overflow: 'auto', background: COLORS.bg,
            border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '24px'
          }}>
            <h3 style={{ color: COLORS.text, margin: '0 0 16px 0' }}>Add Instrument</h3>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: COLORS.dim, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Name</label>
              <input value={newInstrument.name} onChange={e => setNewInstrument(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: COLORS.dim, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Type</label>
              <select value={newInstrument.type} onChange={e => setNewInstrument(p => ({ ...p, type: e.target.value }))}
                style={{ ...inputStyle, appearance: 'auto' }}>
                <option value="listed">Listed (Level 1)</option>
                <option value="semi-listed">Semi-Listed (Level 2)</option>
                <option value="unlisted">Unlisted (Level 3)</option>
                <option value="loan">Loan (IFRS 9)</option>
                <option value="derivative">Derivative</option>
                <option value="property">Investment Property (IAS 40)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ color: COLORS.dim, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Book Value</label>
                <input type="number" value={newInstrument.bookValue} onChange={e => setNewInstrument(p => ({ ...p, bookValue: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: COLORS.dim, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Quantity</label>
                <input type="number" value={newInstrument.quantity} onChange={e => setNewInstrument(p => ({ ...p, quantity: e.target.value }))} style={inputStyle} />
              </div>
            </div>

            {newInstrument.type === 'listed' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: COLORS.dim, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Market Price</label>
                <input type="number" value={newInstrument.marketPrice} onChange={e => setNewInstrument(p => ({ ...p, marketPrice: e.target.value }))} style={inputStyle} />
              </div>
            )}

            {newInstrument.type === 'semi-listed' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: COLORS.dim, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Dealer Quotes (comma-separated)</label>
                <input value={newInstrument.quotes} onChange={e => setNewInstrument(p => ({ ...p, quotes: e.target.value }))} style={inputStyle} placeholder="10.5, 10.8, 11.0" />
              </div>
            )}

            {newInstrument.type === 'unlisted' && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: COLORS.dim, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Projected Cash Flows (comma-separated)</label>
                  <input value={newInstrument.cashFlows} onChange={e => setNewInstrument(p => ({ ...p, cashFlows: e.target.value }))} style={inputStyle} placeholder="100000, 120000, 140000" />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: COLORS.dim, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Discount Rate</label>
                  <input type="number" step="0.01" value={newInstrument.discountRate} onChange={e => setNewInstrument(p => ({ ...p, discountRate: e.target.value }))} style={inputStyle} />
                </div>
              </>
            )}

            {newInstrument.type === 'loan' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ color: COLORS.dim, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Principal</label>
                  <input type="number" value={newInstrument.principal} onChange={e => setNewInstrument(p => ({ ...p, principal: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ color: COLORS.dim, fontSize: '11px', display: 'block', marginBottom: '4px' }}>Term (Years)</label>
                  <input type="number" value={newInstrument.termYears} onChange={e => setNewInstrument(p => ({ ...p, termYears: e.target.value }))} style={inputStyle} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setShowAddModal(false)} style={{
                padding: '8px 16px', background: 'transparent', border: `1px solid ${COLORS.border}`,
                color: COLORS.dim, borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
              }}>Cancel</button>
              <button onClick={addInstrument} disabled={!newInstrument.name} style={{
                padding: '8px 16px', background: COLORS.green + '20', border: `1px solid ${COLORS.green}40`,
                color: COLORS.green, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                opacity: newInstrument.name ? 1 : 0.5
              }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
