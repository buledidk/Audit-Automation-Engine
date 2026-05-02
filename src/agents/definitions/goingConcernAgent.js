// ═══════════════════════════════════════════════════════════════
// Going Concern Agent — ISA 570 specialist
// Evaluates indicators, assesses management plans, determines disclosure
// ═══════════════════════════════════════════════════════════════

export const goingConcernAgent = {
  name: 'Going Concern Agent',
  description: 'Evaluates going concern indicators per ISA 570, assesses management cash flow forecasts, determines disclosure requirements, and documents the auditor conclusion.',
  icon: '⚠️',
  wpScope: ['a6'],
  steps: [
    {
      name: 'Evaluate going concern indicators (ISA 570.10)',
      type: 'tool',
      tool: 'evaluateGoingConcern',
      getParams: (state) => {
        const cfg = state.cfg || {};
        return {
          financialData: {
            totalAssets: parseFloat(cfg.totalAssets || '0'),
            totalLiabilities: parseFloat(cfg.totalLiabilities || '0'),
            netLiabilities: parseFloat(cfg.totalLiabilities || '0') > parseFloat(cfg.totalAssets || '0'),
            operatingCashFlow: parseFloat(cfg.operatingCashFlow || '0'),
            negativeCashFlow: parseFloat(cfg.operatingCashFlow || '0') < 0,
          },
          indicators: {
            debtCovenantBreach: cfg.debtCovenantBreach === 'true' || cfg.debtCovenantBreach === true,
            loanMaturityNoRefinancing: cfg.loanMaturityNoRefinancing === 'true',
            keyManagementDeparture: cfg.keyManagementDeparture === 'true',
            majorCustomerLoss: cfg.majorCustomerLoss === 'true',
            regulatoryAction: cfg.regulatoryAction === 'true',
          },
        };
      },
      mapResult: (result) => [
        cell('a6', 'gc_indicator_score', `${result.score}/100 — ${result.assessment}`, 'Automated indicator assessment'),
        cell('a6', 'gc_flags', result.flags.map(f => `${f.indicator} [${f.severity}] (${f.isaRef})`).join('; ') || 'No indicators identified', 'Individual indicator flags'),
        cell('a6', 'gc_conclusion', result.conclusion, result.isaRef),
        cell('a6', 'gc_assessment_period', result.assessmentPeriod, 'ISA 570.13'),
      ],
    },
    {
      name: 'Assess management cash flow forecast (ISA 570.16)',
      type: 'analyze',
      analyze: (state) => {
        const cfg = state.cfg || {};
        const hasForecast = cfg.managementForecastAvailable === 'true';
        const forecastPeriod = cfg.forecastPeriodMonths || '12';

        return [
          cell('a6', 'management_forecast', hasForecast
            ? `Management has prepared a ${forecastPeriod}-month cash flow forecast. Evaluate reasonableness of key assumptions.`
            : 'Management has NOT prepared a cash flow forecast. Request preparation per ISA 570.16(b) or consider implications for audit report.',
            'ISA 570.16 — evaluate management assessment'),
          cell('a6', 'forecast_procedures', [
            '1. Evaluate reasonableness of assumptions underlying the forecast',
            '2. Compare prior period forecasts to actual results (track record)',
            '3. Consider sensitivity of key assumptions (revenue, cost, timing)',
            '4. Assess consistency with other audit evidence obtained',
            '5. Challenge management bias — professional skepticism required',
          ].join('\n'), 'ISA 570.16(c) — procedures on forecast'),
          cell('a6', 'forecast_period_adequacy', parseInt(forecastPeriod) >= 12
            ? `${forecastPeriod}-month forecast covers the minimum assessment period.`
            : `${forecastPeriod}-month forecast is INSUFFICIENT — must cover at least 12 months from FS approval date.`,
            'ISA 570.13 — minimum period'),
        ];
      },
    },
    {
      name: 'Determine audit report impact (ISA 570.17-20)',
      type: 'analyze',
      analyze: (state) => {
        const cfg = state.cfg || {};
        const gcScore = parseInt(cfg.gcIndicatorScore || '0');

        let reportImpact;
        if (gcScore >= 60) {
          reportImpact = 'MATERIAL UNCERTAINTY — If adequately disclosed: unmodified opinion with "Material Uncertainty Related to Going Concern" section (ISA 570.22). If NOT adequately disclosed: qualified or adverse opinion (ISA 570.23).';
        } else if (gcScore >= 30) {
          reportImpact = 'CLOSE CALL — Consider emphasis of matter paragraph if events/conditions are significant but uncertainty is not material (ISA 570.A28). Document why conclusion is not a material uncertainty.';
        } else {
          reportImpact = 'NO IMPACT — Standard unmodified opinion. No additional reporting required. Document going concern assessment as complete with no indicators requiring disclosure.';
        }

        return [
          cell('a6', 'audit_report_impact', reportImpact, 'ISA 570.17-23'),
          cell('a6', 'management_representation', 'Obtain specific written representation from management regarding their assessment of going concern and their plans for future actions (ISA 570.16(e)).', 'ISA 580 — management representations'),
          cell('a6', 'subsequent_events', 'Review events after the reporting period through to the date of the auditor\'s report for additional going concern evidence (ISA 560.6).', 'ISA 560 — subsequent events'),
        ];
      },
    },
  ],
};

function cell(wp, field, value, reason) {
  return { type: 'cell_suggestion', wp, field, value: value || '', reason: reason || '', cellKey: `${wp}_${field}` };
}
