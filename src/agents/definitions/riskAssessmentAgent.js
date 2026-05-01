// ═══════════════════════════════════════════════════════════════
// Risk Assessment Agent — Analyzes industry risks → populates B1-B4
// ═══════════════════════════════════════════════════════════════

export const riskAssessmentAgent = {
  name: 'Risk Assessment Agent',
  description: 'Analyzes industry-specific risks and populates risk assessment working papers (B1-B4) with risk ratings, assertions, and responses.',
  icon: '⚠️',
  wpScope: ['b1', 'b2', 'b3', 'b4'],
  steps: [
    {
      name: 'Assess Inherent Risks (B1)',
      type: 'analyze',
      analyze: (state) => {
        const cfg = state.cfg || {};
        const ind = state.ind || {};
        const risks = ind.r || [];
        const suggestions = [];

        risks.forEach((risk, i) => {
          suggestions.push({
            type: 'cell_suggestion',
            wp: 'b1',
            field: `risk_${i + 1}_description`,
            value: risk.t || risk.title || `Risk ${i + 1}`,
            reason: `Industry risk for ${ind.l || cfg.industry}`,
            cellKey: `b1_risk_${i + 1}_description`,
          });
          suggestions.push({
            type: 'cell_suggestion',
            wp: 'b1',
            field: `risk_${i + 1}_level`,
            value: risk.lv || 'NORMAL',
            reason: `Risk level classification per ISA 315`,
            cellKey: `b1_risk_${i + 1}_level`,
          });
          suggestions.push({
            type: 'cell_suggestion',
            wp: 'b1',
            field: `risk_${i + 1}_assertions`,
            value: (risk.assertions || ['Existence', 'Accuracy', 'Valuation']).join(', '),
            reason: 'Assertions affected by this risk',
            cellKey: `b1_risk_${i + 1}_assertions`,
          });
        });

        return suggestions;
      },
    },
    {
      name: 'Assess Control Risk (B2)',
      type: 'analyze',
      analyze: (state) => {
        const cfg = state.cfg || {};
        const sz = state.sz || {};
        const isSmall = cfg.entitySize === 'micro' || cfg.entitySize === 'small';
        return [
          {
            type: 'cell_suggestion',
            wp: 'b2',
            field: 'control_environment',
            value: isSmall
              ? 'Owner-managed entity with limited segregation of duties. Compensating controls through owner oversight. Control risk assessed as HIGH — substantive approach to be adopted.'
              : 'Formal control environment with segregation of duties. Internal controls to be assessed for key cycles. Combined approach may be appropriate.',
            reason: `Based on entity size: ${sz.l || cfg.entitySize || 'unknown'} (ISA 315.14-24)`,
            cellKey: 'b2_control_environment',
          },
          {
            type: 'cell_suggestion',
            wp: 'b2',
            field: 'it_controls',
            value: isSmall
              ? 'Simple IT environment — commercial accounting software. General IT controls: password policy, backup procedures, access controls to be assessed.'
              : 'IT environment assessment required. Consider: access controls, change management, data backup and recovery, processing controls. ITGC testing may be required.',
            reason: 'IT environment assessment (ISA 315.Appendix 5)',
            cellKey: 'b2_it_controls',
          },
          {
            type: 'cell_suggestion',
            wp: 'b2',
            field: 'controls_approach',
            value: isSmall
              ? 'Do not intend to rely on internal controls. Substantive approach to be adopted for all material account balances and transaction classes.'
              : 'Controls to be evaluated for key transaction cycles. Where controls are effective, reduced substantive testing may be appropriate per ISA 330.8.',
            reason: 'Audit approach (ISA 330.7-8)',
            cellKey: 'b2_controls_approach',
          },
        ];
      },
    },
    {
      name: 'Fraud Risk Assessment (B3)',
      type: 'multi-tool',
      getCalls: (state) => {
        const cfg = state.cfg || {};
        return [
          {
            tool: 'assessRisk',
            params: {
              riskId: 'fraud_revenue',
              factors: {
                inherentRisk: 'significant',
                fraudRisk: true,
                controlEffectiveness: cfg.entitySize === 'micro' ? 'weak' : 'moderate',
              },
            },
            mapResult: (result) => ({
              type: 'cell_suggestion',
              wp: 'b3',
              field: 'fraud_revenue_risk',
              value: `Revenue recognition fraud risk: ${result.level}. Score: ${result.score}/100. ${result.response}`,
              reason: 'ISA 240.26 — presumed fraud risk in revenue recognition',
              cellKey: 'b3_fraud_revenue_risk',
            }),
          },
          {
            tool: 'assessRisk',
            params: {
              riskId: 'fraud_management_override',
              factors: {
                inherentRisk: 'significant',
                fraudRisk: true,
                controlEffectiveness: 'none',
              },
            },
            mapResult: (result) => ({
              type: 'cell_suggestion',
              wp: 'b3',
              field: 'fraud_override_risk',
              value: `Management override: ${result.level}. Score: ${result.score}/100. ${result.response}`,
              reason: 'ISA 240.31 — presumed risk that cannot be rebutted',
              cellKey: 'b3_fraud_override_risk',
            }),
          },
        ];
      },
    },
    {
      name: 'Risk Summary & Response (B4)',
      type: 'analyze',
      analyze: (state, previousResults) => {
        const allSuggestions = previousResults.filter(r => r.type === 'cell_suggestion');
        const sigRisks = allSuggestions.filter(s => s.value && s.value.includes('SIGNIFICANT'));
        const elevRisks = allSuggestions.filter(s => s.value && s.value.includes('ELEVATED'));

        return [
          {
            type: 'cell_suggestion',
            wp: 'b4',
            field: 'risk_summary',
            value: `Risk assessment summary: ${sigRisks.length} significant risks, ${elevRisks.length} elevated risks identified. Audit approach calibrated accordingly. ISA 330 responses documented per risk area.`,
            reason: 'Overall risk assessment summary (ISA 315.25-27)',
            cellKey: 'b4_risk_summary',
          },
          {
            type: 'cell_suggestion',
            wp: 'b4',
            field: 'overall_audit_risk',
            value: sigRisks.length > 3 ? 'HIGH' : sigRisks.length > 1 ? 'MEDIUM-HIGH' : 'MEDIUM',
            reason: 'Aggregate engagement risk assessment',
            cellKey: 'b4_overall_audit_risk',
          },
          {
            type: 'cell_suggestion',
            wp: 'b4',
            field: 'response_to_risks',
            value: 'Overall responses per ISA 330.5: (1) Team discussion of susceptibility to misstatement, (2) Assignment of experienced staff to higher risk areas, (3) Professional scepticism emphasis, (4) Unpredictability in testing procedures.',
            reason: 'ISA 330.5 overall responses to assessed risks',
            cellKey: 'b4_response_to_risks',
          },
        ];
      },
    },
  ],
};
