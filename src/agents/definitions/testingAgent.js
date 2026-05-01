// ═══════════════════════════════════════════════════════════════
// Testing Agent — Generates testing procedures for D1-D18
// ═══════════════════════════════════════════════════════════════

const TESTING_WPS = [
  { id: 'd1', label: 'Revenue', fk: 'revenue' },
  { id: 'd2', label: 'Receivables', fk: 'receivables' },
  { id: 'd3', label: 'Inventory', fk: 'inventory' },
  { id: 'd4', label: 'Payables', fk: 'payables' },
  { id: 'd5', label: 'Cash & Bank', fk: 'cash' },
  { id: 'd6', label: 'Bank Confirmations', fk: 'bank' },
  { id: 'd7', label: 'Fixed Assets', fk: 'fixedAssets' },
  { id: 'd8', label: 'Intangibles', fk: 'intangibles' },
  { id: 'd9', label: 'Investments', fk: 'investments' },
  { id: 'd10', label: 'Equity', fk: 'equity' },
  { id: 'd11', label: 'Loans & Borrowings', fk: 'loans' },
  { id: 'd12', label: 'Provisions', fk: 'provisions' },
  { id: 'd13', label: 'Taxation', fk: 'taxation' },
  { id: 'd14', label: 'Leases', fk: 'leases' },
  { id: 'd15', label: 'Related Parties', fk: 'relatedParties' },
  { id: 'd16', label: 'Subsequent Events', fk: 'subsequentEvents' },
  { id: 'd17', label: 'Payroll', fk: 'payroll' },
  { id: 'd18', label: 'Other Areas', fk: 'other' },
];

export const testingAgent = {
  name: 'Testing Agent',
  description: 'Generates tailored substantive audit procedures for all testing working papers (D1-D18) based on risk assessment and industry context.',
  icon: '🔬',
  wpScope: TESTING_WPS.map(w => w.id),
  steps: [
    {
      name: 'Analyze Trial Balance for Focus Areas',
      type: 'tool',
      tool: 'analyzeTrialBalance',
      getParams: (state) => ({
        tbData: state.tbData || [],
        mappings: state.tbMappings || {},
      }),
      mapResult: (result) => {
        if (!result.anomalies?.length) return [];
        return result.anomalies.slice(0, 5).map(a => ({
          type: 'cell_suggestion',
          wp: 'd1',
          field: `tb_anomaly_${a.rowIndex}`,
          value: `${a.account}: ${a.percentChange}% movement (£${a.change?.toLocaleString()}). ${a.suggestion}`,
          reason: 'Trial balance analytical review anomaly',
          cellKey: `tb_anomaly_${a.rowIndex}`,
        }));
      },
    },
    {
      name: 'Generate Procedures for Active Testing WPs',
      type: 'multi-tool',
      getCalls: (state) => {
        const cfg = state.cfg || {};
        const visibleWPs = state.visibleWPs || [];
        const activeTestingWPs = TESTING_WPS.filter(tw =>
          visibleWPs.includes(tw.id) || visibleWPs.length === 0
        );

        return activeTestingWPs.slice(0, 10).map(tw => ({
          tool: 'generateProcedures',
          params: {
            wpId: tw.id,
            context: {
              cfg,
              industryData: state.ind || null,
              cellData: state.cellData || {},
            },
          },
          mapResult: (result) => {
            if (!result.procedures?.length) {
              return {
                type: 'cell_suggestion',
                wp: tw.id,
                field: 'procedures_status',
                value: `Standard substantive procedures to be applied for ${tw.label}. Tailor based on risk assessment results.`,
                reason: `Default procedures for ${tw.label}`,
                cellKey: `${tw.id}_procedures_status`,
              };
            }
            return result.procedures.slice(0, 3).map((p, i) => ({
              type: 'cell_suggestion',
              wp: tw.id,
              field: `procedure_${i + 1}`,
              value: typeof p === 'string' ? p : p.description || p.test || JSON.stringify(p),
              reason: `Suggested procedure for ${tw.label} — ${p.assertion || 'multiple assertions'} (${p.isa || p.isaRef || 'ISA 330'})`,
              cellKey: `${tw.id}_procedure_${i + 1}`,
            }));
          },
        }));
      },
    },
    {
      name: 'Set Sample Size Guidance',
      type: 'analyze',
      analyze: (state) => {
        const cfg = state.cfg || {};
        const materiality = parseFloat(cfg.materiality) || 0;
        const perfMat = parseFloat(cfg.perfMateriality) || materiality * 0.65;
        const suggestions = [];

        const sampleGuidance = materiality > 500000
          ? { min: 5, typical: 10, extended: 15, basis: 'Large materiality — smaller samples acceptable' }
          : materiality > 100000
            ? { min: 10, typical: 15, extended: 25, basis: 'Moderate materiality' }
            : { min: 15, typical: 25, extended: 40, basis: 'Low materiality — larger samples required' };

        TESTING_WPS.forEach(tw => {
          suggestions.push({
            type: 'cell_suggestion',
            wp: tw.id,
            field: 'sample_size_guidance',
            value: `Minimum: ${sampleGuidance.min} items | Typical: ${sampleGuidance.typical} items | Extended (significant risk): ${sampleGuidance.extended} items. Basis: ${sampleGuidance.basis}. Materiality: £${materiality.toLocaleString()}, Perf Mat: £${Math.round(perfMat).toLocaleString()}.`,
            reason: 'Sample size guidance per ISA 530.7-8',
            cellKey: `${tw.id}_sample_size_guidance`,
          });
        });

        return suggestions;
      },
    },
  ],
};
