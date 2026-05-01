// ═══════════════════════════════════════════════════════════════
// Planning Agent — Auto-populates A1-A10 based on entity config
// ═══════════════════════════════════════════════════════════════

export const planningAgent = {
  name: 'Planning Agent',
  description: 'Auto-populates planning working papers (A1-A10) based on entity configuration, industry, and framework.',
  icon: '📋',
  wpScope: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10'],
  steps: [
    {
      name: 'Populate Engagement Overview (A1)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg, ind } = extractState(state);
        if (!cfg.configured) return [];
        return [
          cell('a1', 'entity_name', cfg.entityName, 'Entity name from configuration'),
          cell('a1', 'fye', cfg.fye, 'Financial year end'),
          cell('a1', 'industry', ind?.l || cfg.industry, 'Industry classification'),
          cell('a1', 'sector', cfg.sector, 'Sector'),
          cell('a1', 'framework', cfg.framework, 'Reporting framework'),
          cell('a1', 'entity_size', cfg.entitySize, 'Entity size classification'),
          cell('a1', 'engagement_type', cfg.engagementType || 'statutory', 'Engagement type'),
          cell('a1', 'firm_name', cfg.firmName, 'Audit firm'),
          cell('a1', 'partner', cfg.partner, 'Engagement partner'),
          cell('a1', 'manager', cfg.manager, 'Audit manager'),
        ].filter(s => s.value);
      },
    },
    {
      name: 'Calculate Materiality (A3)',
      type: 'tool',
      tool: 'calculateMateriality',
      getParams: (state) => {
        const { cfg } = extractState(state);
        return {
          benchmark: 'revenue',
          amount: parseFloat(cfg.revenue || cfg.turnover || '0') || 500000,
          percentage: 0.0075,
        };
      },
      mapResult: (result) => [
        cell('a3', 'overall_materiality', `£${result.overallMateriality?.toLocaleString()}`, `Calculated at ${(result.percentage * 100).toFixed(2)}% of ${result.benchmark} (ISA 320.10)`),
        cell('a3', 'performance_materiality', `£${result.performanceMateriality?.toLocaleString()}`, 'Set at 65% of overall materiality (ISA 320.11)'),
        cell('a3', 'trivial_threshold', `£${result.trivialThreshold?.toLocaleString()}`, 'Clearly trivial threshold (ISA 450.A2)'),
        cell('a3', 'benchmark_used', result.benchmark, 'Selected benchmark'),
      ],
    },
    {
      name: 'Populate Audit Strategy (A4)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg, ind } = extractState(state);
        const risks = ind?.r || [];
        const sigRisks = risks.filter(r => r.lv === 'SIGNIFICANT');
        return [
          cell('a4', 'audit_approach', sigRisks.length > 2 ? 'Combined approach — significant risks identified requiring extended substantive testing alongside controls testing' : 'Predominantly substantive approach appropriate for entity size and risk profile', 'Audit approach determination'),
          cell('a4', 'significant_risks_count', String(sigRisks.length), 'Number of significant risks identified'),
          cell('a4', 'significant_risks_summary', sigRisks.map(r => r.t).join('; ') || 'None identified at planning stage', 'Significant risks listing'),
          cell('a4', 'group_considerations', cfg.engagementType === 'group' ? 'Group audit — ISA 600 applies. Component materiality to be determined.' : 'Single entity audit — ISA 600 not applicable', 'Group audit assessment'),
        ];
      },
    },
    {
      name: 'Populate Fraud Assessment (A5)',
      type: 'analyze',
      analyze: (state) => {
        const { _cfg, ind } = extractState(state);
        return [
          cell('a5', 'fraud_revenue_recognition', 'Revenue recognition is a presumed fraud risk per ISA 240.26. ' + (ind?.l === 'Construction' ? 'Construction contracts introduce particular fraud risk through percentage of completion estimates.' : ind?.l === 'Technology' ? 'SaaS revenue recognition timing and multiple element arrangements require scrutiny.' : 'Standard revenue cut-off and occurrence testing to be performed.'), 'ISA 240.26 presumption'),
          cell('a5', 'fraud_management_override', 'Management override of controls is always a presumed fraud risk per ISA 240.31 and cannot be rebutted. Journal entry testing, review of estimates for bias, and evaluation of unusual transactions required.', 'ISA 240.31 — cannot be rebutted'),
          cell('a5', 'fraud_discussion_required', 'Team discussion of fraud risks required per ISA 240.15. Document date, participants, and key points discussed.', 'ISA 240.15 team discussion'),
        ];
      },
    },
    {
      name: 'Populate Going Concern (A6)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg } = extractState(state);
        return [
          cell('a6', 'gc_assessment_period', `Assessment period: ${cfg.fye || '[FYE]'} plus 12 months from date of approval of financial statements (ISA 570.13)`, 'Going concern assessment period'),
          cell('a6', 'gc_financial_indicators', 'Consider: net liability position, negative operating cash flows, inability to pay creditors on due dates, adverse key financial ratios, substantial operating losses, inability to comply with loan covenants.', 'Financial indicators checklist'),
          cell('a6', 'gc_operating_indicators', 'Consider: loss of key management, loss of major market/customer/supplier, labour difficulties, shortage of important supplies, emergence of highly successful competitor.', 'Operating indicators checklist'),
        ];
      },
    },
    {
      name: 'Populate Laws & Regulations (A7)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg, _ind } = extractState(state);
        const laws = ['Companies Act 2006', 'Corporation Tax Act 2010', 'HMRC requirements'];
        if (cfg.industry === 'financial_services') laws.push('FCA Handbook', 'PRA Rulebook', 'MLR 2017');
        if (cfg.industry === 'charities') laws.push('Charities Act 2011', 'Charity Commission regulations');
        if (cfg.industry === 'construction') laws.push('Construction Industry Scheme (CIS)', 'Health & Safety at Work Act 1974');
        return [
          cell('a7', 'direct_effect_laws', laws.join('; '), 'Laws with direct effect on financial statements (ISA 250.6(a))'),
          cell('a7', 'other_laws', 'Health and safety, employment law, data protection (GDPR), environmental regulations, anti-bribery legislation', 'Other laws and regulations (ISA 250.6(b))'),
          cell('a7', 'noncompliance_procedures', 'Enquiry of management regarding compliance. Inspect correspondence with regulatory authorities. Review legal expenses for indicators of litigation or non-compliance.', 'ISA 250.14-17 procedures'),
        ];
      },
    },
    {
      name: 'Populate Related Parties (A8)',
      type: 'analyze',
      analyze: () => [
        cell('a8', 'rp_identification', 'Obtain list of related parties from management per ISA 550.13. Review Companies House records for director interests. Review prior year file for known related parties.', 'ISA 550.13 identification procedures'),
        cell('a8', 'rp_procedures', 'Verify completeness of management\'s related party list. Test related party transactions for arms-length pricing. Review disclosures per FRS 102 Section 33 / IAS 24.', 'ISA 550.20-25 procedures'),
      ],
    },
    {
      name: 'Populate Subsequent Events (A9)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg } = extractState(state);
        return [
          cell('a9', 'se_period', `Period: ${cfg.fye || '[FYE]'} to date of auditor\'s report. Active review of events required per ISA 560.6.`, 'Subsequent events review period'),
          cell('a9', 'se_procedures', 'Review minutes of meetings held after year end. Enquire of management regarding subsequent events. Review latest interim financial information. Review legal correspondence post year end.', 'ISA 560.7 procedures'),
        ];
      },
    },
  ],
};

function extractState(state) {
  return {
    cfg: state.cfg || {},
    ind: state.ind || null,
    fw: state.fw || null,
    sz: state.sz || null,
  };
}

function cell(wp, field, value, reason) {
  return {
    type: 'cell_suggestion',
    wp,
    field,
    value: value || '',
    reason: reason || '',
    cellKey: `${wp}_${field}`,
  };
}
