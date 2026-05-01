// ═══════════════════════════════════════════════════════════════
// Completion Agent — Reviews all WPs → populates E1-E6
// ═══════════════════════════════════════════════════════════════

export const completionAgent = {
  name: 'Completion Agent',
  description: 'Analyses engagement completeness, generates completion checklists, and populates E1-E6 working papers.',
  icon: '✅',
  wpScope: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'],
  steps: [
    {
      name: 'Assess Working Paper Completeness',
      type: 'tool',
      tool: 'predictExceptions',
      getParams: (state) => ({
        engagementData: {
          cfg: state.cfg,
          cellData: state.cellData,
          signOffs: state.signOffs,
          tbData: state.tbData,
          industryData: state.ind,
          visibleWPs: state.visibleWPs,
        },
      }),
      mapResult: (result, _state) => {
        const predictions = result.predictions || [];
        const criticals = predictions.filter(p => p.severity === 'critical');
        const warnings = predictions.filter(p => p.severity === 'warning');

        return [
          {
            type: 'cell_suggestion',
            wp: 'e1',
            field: 'completeness_assessment',
            value: `Engagement completeness review: ${criticals.length} critical items, ${warnings.length} warnings identified. ${criticals.length === 0 ? 'No critical gaps — engagement substantially complete.' : 'Critical gaps require attention before completion.'}`,
            reason: 'Automated completeness assessment (ISA 220.30)',
            cellKey: 'e1_completeness_assessment',
          },
          ...criticals.slice(0, 5).map((p, i) => ({
            type: 'cell_suggestion',
            wp: 'e1',
            field: `critical_item_${i + 1}`,
            value: `CRITICAL: ${p.message || p.wpRef || 'Unresolved item'} — ${p.detail || 'Requires attention'}`,
            reason: 'Critical completion item',
            cellKey: `e1_critical_item_${i + 1}`,
          })),
        ];
      },
    },
    {
      name: 'Generate Completion Checklist (E2)',
      type: 'analyze',
      analyze: (state) => {
        const cfg = state.cfg || {};
        const signOffs = state.signOffs || {};
        const allWPs = state.allWPs || [];
        const unsigned = allWPs.filter(w => !signOffs[w.id]?.preparedBy).map(w => w.ref || w.id);

        return [
          {
            type: 'cell_suggestion',
            wp: 'e2',
            field: 'unsigned_wps',
            value: unsigned.length > 0
              ? `${unsigned.length} working papers unsigned: ${unsigned.slice(0, 10).join(', ')}${unsigned.length > 10 ? '...' : ''}`
              : 'All working papers signed off.',
            reason: 'Working paper sign-off status',
            cellKey: 'e2_unsigned_wps',
          },
          {
            type: 'cell_suggestion',
            wp: 'e2',
            field: 'subsequent_events_review',
            value: `Subsequent events review required to date of auditor's report. Period: ${cfg.fye || '[FYE]'} to [report date]. Procedures per ISA 560.7-9 to be documented.`,
            reason: 'ISA 560 subsequent events',
            cellKey: 'e2_subsequent_events_review',
          },
          {
            type: 'cell_suggestion',
            wp: 'e2',
            field: 'going_concern_conclusion',
            value: 'Going concern assessment to be finalised. Confirm management\'s assessment covers at least 12 months from approval date (ISA 570.13). Document conclusion on appropriateness of going concern basis.',
            reason: 'ISA 570 going concern conclusion',
            cellKey: 'e2_going_concern_conclusion',
          },
          {
            type: 'cell_suggestion',
            wp: 'e2',
            field: 'management_representations',
            value: 'Written representations letter to be obtained per ISA 580.9. Must be dated same date as auditor\'s report and cover all material matters.',
            reason: 'ISA 580 representations',
            cellKey: 'e2_management_representations',
          },
        ];
      },
    },
    {
      name: 'Evaluate Misstatements (E3)',
      type: 'analyze',
      analyze: (state) => {
        const cfg = state.cfg || {};
        const materiality = parseFloat(cfg.materiality) || 0;
        const trivial = parseFloat(cfg.trivial) || Math.round(materiality * 0.04);

        return [
          {
            type: 'cell_suggestion',
            wp: 'e3',
            field: 'misstatement_evaluation',
            value: `Summary of uncorrected misstatements per ISA 450.5. Overall materiality: £${materiality.toLocaleString()}. Trivial threshold: £${trivial.toLocaleString()}. Misstatements above trivial threshold to be accumulated and evaluated in aggregate.`,
            reason: 'ISA 450 misstatement evaluation',
            cellKey: 'e3_misstatement_evaluation',
          },
          {
            type: 'cell_suggestion',
            wp: 'e3',
            field: 'conclusion',
            value: 'Conclusion: [To be completed] — The aggregate of uncorrected misstatements is/is not material to the financial statements as a whole. Management has been requested to correct all identified misstatements.',
            reason: 'ISA 450.11 conclusion on misstatements',
            cellKey: 'e3_conclusion',
          },
        ];
      },
    },
    {
      name: 'Draft Audit Opinion Elements (E4-E6)',
      type: 'analyze',
      analyze: (state) => {
        const cfg = state.cfg || {};
        const fw = state.fw || {};

        return [
          {
            type: 'cell_suggestion',
            wp: 'e4',
            field: 'opinion_type',
            value: 'Proposed opinion: [To be determined] — Unmodified / Qualified / Adverse / Disclaimer. Based on evaluation of: (1) sufficiency of evidence, (2) uncorrected misstatements, (3) going concern, (4) scope limitations.',
            reason: 'ISA 700.10-11 opinion formation',
            cellKey: 'e4_opinion_type',
          },
          {
            type: 'cell_suggestion',
            wp: 'e4',
            field: 'true_and_fair_view',
            value: `Financial statements give a true and fair view in accordance with ${fw.l || cfg.framework || 'applicable framework'} and have been properly prepared in accordance with the Companies Act 2006.`,
            reason: 'ISA 700 / s495 CA 2006',
            cellKey: 'e4_true_and_fair_view',
          },
          {
            type: 'cell_suggestion',
            wp: 'e5',
            field: 'communication_tcwg',
            value: 'Communication required with those charged with governance per ISA 260: (1) Audit approach and scope, (2) Significant findings, (3) Significant difficulties, (4) Independence matters, (5) Other matters.',
            reason: 'ISA 260 communication requirements',
            cellKey: 'e5_communication_tcwg',
          },
          {
            type: 'cell_suggestion',
            wp: 'e6',
            field: 'file_assembly',
            value: 'Audit file to be assembled within 60 days of auditor\'s report date per ISA 230.14. No deletions or discarding after assembly. File completion date: [to be determined].',
            reason: 'ISA 230.14 file assembly',
            cellKey: 'e6_file_assembly',
          },
        ];
      },
    },
  ],
};
