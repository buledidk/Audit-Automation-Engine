// ═══════════════════════════════════════════════════════════════
// Documentation Agent — ISA 230 specialist
// Generates narratives, validates completeness, prepares file for assembly
// ═══════════════════════════════════════════════════════════════

export const documentationAgent = {
  name: 'Documentation Agent',
  description: 'Generates ISA 230-compliant working paper narratives, validates documentation completeness across all phases, and prepares the audit file for review and assembly.',
  icon: '📝',
  wpScope: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10'],
  steps: [
    {
      name: 'Validate documentation completeness (ISA 230.8)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg, cellData, signOffs } = extractState(state);
        const planningWPs = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10'];
        const completeness = [];
        const gaps = [];

        planningWPs.forEach(wp => {
          const wpCells = Object.keys(cellData).filter(k => k.startsWith(`${wp}_`));
          const hasSignOff = signOffs[wp];
          const populated = wpCells.length > 0;

          completeness.push({
            wp: wp.toUpperCase(),
            populated,
            cellCount: wpCells.length,
            signedOff: !!hasSignOff,
          });

          if (!populated) gaps.push(`${wp.toUpperCase()}: Not populated — requires completion`);
          else if (!hasSignOff) gaps.push(`${wp.toUpperCase()}: Populated but NOT signed off — requires preparer sign-off`);
        });

        const completionPct = Math.round((completeness.filter(c => c.populated && c.signedOff).length / planningWPs.length) * 100);

        return [
          cell('a1', 'documentation_completion', `${completionPct}% — ${completeness.filter(c => c.populated && c.signedOff).length}/${planningWPs.length} working papers complete and signed off`,
            'ISA 230.8 — sufficient documentation for experienced auditor'),
          cell('a1', 'documentation_gaps', gaps.length > 0 ? gaps.join('\n') : 'All planning working papers populated and signed off', 'Documentation gaps requiring attention'),
          cell('a1', 'documentation_standard', 'Documentation must enable an experienced auditor, having no previous connection with the audit, to understand: (a) nature, timing, extent of procedures, (b) results of procedures and evidence obtained, (c) significant matters and conclusions.', 'ISA 230.8 documentation standard'),
        ];
      },
    },
    {
      name: 'Generate engagement summary narrative (ISA 230.9)',
      type: 'tool',
      tool: 'generateNarrative',
      getParams: (state) => {
        const cfg = state.cfg || {};
        return {
          wpId: 'a1',
          findings: [
            { description: `Entity: ${cfg.entityName || '[Entity name]'} — ${cfg.entitySize || 'medium'} ${cfg.industry || 'commercial'} entity` },
            { description: `Framework: ${cfg.framework || 'FRS 102'} — FYE: ${cfg.fye || '[TBC]'}` },
            { description: `Materiality: £${parseFloat(cfg.overallMateriality || '0').toLocaleString()} overall, £${parseFloat(cfg.performanceMateriality || '0').toLocaleString()} performance` },
            { description: `Significant risks: ${cfg.significantRisksCount || '0'} identified at planning stage` },
          ],
          conclusion: `This engagement has been planned in accordance with ISA 300. The audit strategy and plan are appropriate for the nature, size, and complexity of the entity. Resources allocated are sufficient to complete the engagement within the planned timeline.`,
          isaRefs: ['ISA 300.7', 'ISA 320.10', 'ISA 315.5', 'ISA 230.8'],
        };
      },
      mapResult: (result) => [
        cell('a1', 'engagement_narrative', result.narrative, `Auto-generated narrative (${result.wordCount} words) — ${result.isaRef}`),
      ],
    },
    {
      name: 'Prepare audit file index (ISA 230.14)',
      type: 'analyze',
      analyze: (state) => {
        const { cellData, signOffs } = extractState(state);

        // Build file index from populated working papers
        const allWPs = [...new Set(Object.keys(cellData).map(k => k.split('_')[0]))].sort();
        const index = allWPs.map(wp => {
          const cells = Object.keys(cellData).filter(k => k.startsWith(`${wp}_`)).length;
          const signed = signOffs[wp];
          return `${wp.toUpperCase()} — ${cells} cells${signed ? ' ✓ signed off' : ' ○ pending sign-off'}`;
        });

        return [
          cell('a1', 'audit_file_index', index.length > 0 ? index.join('\n') : 'No working papers populated yet', 'ISA 230.14 — audit file assembly'),
          cell('a1', 'file_assembly_deadline', 'Audit file must be assembled within 60 days of the auditor\'s report date (ISA 230.14). No deletions or modifications permitted after assembly.', 'ISA 230.14-16 — assembly and retention'),
          cell('a1', 'retention_period', 'Minimum 6 years from date of auditor\'s report, or longer if required by law or regulation.', 'ISA 230.A23 — retention requirements'),
        ];
      },
    },
    {
      name: 'Check ISA 230 required documentation elements',
      type: 'analyze',
      analyze: (state) => {
        const { cfg, cellData } = extractState(state);
        const required = [
          { field: 'entity_name', label: 'Entity identification', isa: 'ISA 230.8(a)' },
          { field: 'fye', label: 'Period covered', isa: 'ISA 230.8(a)' },
          { field: 'overall_materiality', label: 'Materiality determination', isa: 'ISA 320' },
          { field: 'audit_approach', label: 'Audit strategy', isa: 'ISA 300.7' },
          { field: 'fraud_revenue_recognition', label: 'Fraud risk assessment', isa: 'ISA 240.26' },
          { field: 'gc_conclusion', label: 'Going concern assessment', isa: 'ISA 570.10' },
          { field: 'significant_risks_summary', label: 'Significant risks', isa: 'ISA 315.28' },
        ];

        const results = required.map(r => {
          const found = Object.keys(cellData).some(k => k.includes(r.field) && cellData[k]);
          return { ...r, documented: found };
        });

        const missing = results.filter(r => !r.documented);

        return [
          cell('a1', 'isa230_checklist', `${results.filter(r => r.documented).length}/${required.length} required elements documented`,
            missing.length > 0 ? `Missing: ${missing.map(m => `${m.label} (${m.isa})`).join(', ')}` : 'All required elements present'),
        ];
      },
    },
  ],
};

function extractState(state) {
  return {
    cfg: state.cfg || {},
    cellData: state.cellData || {},
    signOffs: state.signOffs || {},
  };
}

function cell(wp, field, value, reason) {
  return { type: 'cell_suggestion', wp, field, value: value || '', reason: reason || '', cellKey: `${wp}_${field}` };
}
