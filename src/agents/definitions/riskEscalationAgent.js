// ═══════════════════════════════════════════════════════════════
// Risk Escalation Agent — ISA 315/330 Expanded Risk Framework
// SIGNIFICANT → ELEVATED → NORMAL classification with partner
// escalation gates, control advisory, and detection risk calibration
// ═══════════════════════════════════════════════════════════════

export const riskEscalationAgent = {
  name: 'Risk Escalation Agent',
  description: 'Classifies risks across the ISA 315 spectrum (SIGNIFICANT/ELEVATED/NORMAL), generates control advisory responses per ISA 330, calibrates detection risk, and routes high-risk items to partner for judgment.',
  icon: '🚨',
  wpScope: ['b1', 'b2', 'b3', 'b4'],
  steps: [
    {
      name: 'Classify all risks on ISA 315 spectrum',
      type: 'analyze',
      analyze: (state) => {
        const { cfg, ind } = extractState(state);
        const industryRisks = ind?.r || [];
        const results = [];

        // ISA 315.25-27: Spectrum of inherent risk
        const classified = industryRisks.map(risk => {
          const score = scoreRisk(risk, cfg);
          return {
            ...risk,
            score,
            classification: score >= 80 ? 'SIGNIFICANT' : score >= 50 ? 'ELEVATED' : 'NORMAL',
            partnerEscalation: score >= 80,
            controlAdvisory: generateControlAdvisory(risk, score),
            detectionRisk: calibrateDetectionRisk(score, cfg),
            auditResponse: generateAuditResponse(risk, score),
          };
        });

        // B1: Risk Assessment Matrix
        const significant = classified.filter(r => r.classification === 'SIGNIFICANT');
        const elevated = classified.filter(r => r.classification === 'ELEVATED');
        const normal = classified.filter(r => r.classification === 'NORMAL');

        results.push(cell('b1', 'risk_summary',
          `${significant.length} SIGNIFICANT | ${elevated.length} ELEVATED | ${normal.length} NORMAL — total ${classified.length} risks assessed`,
          'ISA 315.25 — spectrum of inherent risk'
        ));

        results.push(cell('b1', 'risk_matrix', JSON.stringify(classified.map(r => ({
          id: r.id, description: r.t, classification: r.classification,
          score: r.score, partnerEscalation: r.partnerEscalation
        }))), 'Full risk classification matrix'));

        // B3: Significant risks requiring partner attention
        if (significant.length > 0) {
          results.push(cell('b3', 'significant_risks', significant.map(r =>
            `${r.id}: ${r.t} [Score: ${r.score}] — ${r.auditResponse.summary}`
          ).join('\n'), 'ISA 315.28 — significant risks requiring specific audit response'));

          results.push(cell('b3', 'partner_escalation_required', 'YES — ' + significant.length +
            ' risks require partner review and approval of audit response before substantive testing commences.',
            'ISA 220.15 — partner responsibility for significant matters'));
        }

        // Partner escalation list
        const escalations = classified.filter(r => r.partnerEscalation);
        if (escalations.length > 0) {
          results.push(cell('b1', 'partner_escalation_list', escalations.map(r =>
            `[${r.classification}] ${r.id}: ${r.t} — REQUIRES PARTNER JUDGMENT`
          ).join('\n'), 'ISA 220.15/18 — matters requiring partner judgment'));

          results.push(cell('b1', 'partner_decision_pending',
            `${escalations.length} items awaiting partner decision. Audit response cannot be finalised until partner reviews and approves.`,
            'Partner decision gate — ISA 220'));
        }

        return results;
      },
    },
    {
      name: 'Generate control advisory per risk (ISA 330)',
      type: 'analyze',
      analyze: (state) => {
        const { ind } = extractState(state);
        const risks = ind?.r || [];
        const results = [];

        risks.forEach(risk => {
          const score = scoreRisk(risk, state.cfg || {});
          const advisory = generateControlAdvisory(risk, score);

          results.push(cell('b2', `control_advisory_${risk.id.toLowerCase()}`,
            `${risk.t}:\n` +
            `  Control reliance: ${advisory.controlReliance}\n` +
            `  Testing approach: ${advisory.testingApproach}\n` +
            `  Sample multiplier: ${advisory.sampleMultiplier}x\n` +
            `  Specialist required: ${advisory.specialistRequired ? 'YES' : 'NO'}`,
            `ISA 330 response for ${risk.lv} risk`
          ));
        });

        return results;
      },
    },
    {
      name: 'Calibrate detection risk for each FSLI (ISA 200)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg, ind } = extractState(state);
        const risks = ind?.r || [];
        const results = [];

        // Group by FSLI area
        const byFsli = {};
        risks.forEach(r => {
          const area = r.t.split(' ')[0] || 'General';
          if (!byFsli[area]) byFsli[area] = [];
          byFsli[area].push(r);
        });

        Object.entries(byFsli).forEach(([area, areaRisks]) => {
          const maxScore = Math.max(...areaRisks.map(r => scoreRisk(r, cfg)));
          const ir = maxScore >= 80 ? 'HIGH' : maxScore >= 50 ? 'MEDIUM' : 'LOW';
          const cr = cfg[`${area.toLowerCase()}ControlRisk`] || 'MEDIUM';

          // DR = AR / (IR × CR) — lower IR and CR means we can accept higher DR
          const irNum = ir === 'HIGH' ? 0.9 : ir === 'MEDIUM' ? 0.6 : 0.3;
          const crNum = cr === 'HIGH' ? 0.9 : cr === 'MEDIUM' ? 0.6 : 0.3;
          const targetAR = 0.05; // 5% acceptable audit risk
          const dr = Math.min(1, targetAR / (irNum * crNum));
          const drLabel = dr <= 0.1 ? 'VERY LOW' : dr <= 0.3 ? 'LOW' : dr <= 0.6 ? 'MEDIUM' : 'HIGH';

          results.push(cell('b1', `detection_risk_${area.toLowerCase()}`,
            `${area}: IR=${ir}, CR=${cr}, DR=${drLabel} (${(dr * 100).toFixed(0)}%) — ` +
            (drLabel === 'VERY LOW' || drLabel === 'LOW'
              ? 'Extensive substantive testing required. Increase sample sizes. Consider specialist.'
              : drLabel === 'MEDIUM'
                ? 'Standard substantive testing with focused analytical procedures.'
                : 'Reduced substantive testing acceptable. Rely on controls where tested.'),
            `ISA 200 audit risk model: AR(5%) = IR(${ir}) × CR(${cr}) × DR(${drLabel})`
          ));
        });

        return results;
      },
    },
  ],
};

// ── Helpers ─────────────────────────────────────────────────────

function scoreRisk(risk, cfg) {
  let score = 0;
  if (risk.lv === 'SIGNIFICANT') score += 50;
  else if (risk.lv === 'ELEVATED') score += 30;
  else score += 10;

  // Fraud risk presumption (ISA 240.26)
  if (/revenue|fraud|override/i.test(risk.t)) score += 20;
  // Estimate/judgment (ISA 540)
  if (/estimate|valuation|provision|fair value|impairment/i.test(risk.t)) score += 15;
  // Related party (ISA 550)
  if (/related part|intercompany|connected/i.test(risk.t)) score += 10;
  // First year
  if (cfg.firstYearEngagement) score += 10;
  // Prior year issues
  if (cfg.priorYearExceptions) score += 15;

  return Math.min(100, score);
}

function generateControlAdvisory(risk, score) {
  if (score >= 80) {
    return {
      controlReliance: 'NONE — substantive-only approach required for significant risks',
      testingApproach: 'Extended substantive testing with dual-purpose procedures',
      sampleMultiplier: 2.0,
      specialistRequired: /valuation|fair value|pension|derivative/i.test(risk.t),
      isaRef: 'ISA 330.18 — substantive procedures for significant risks',
    };
  }
  if (score >= 50) {
    return {
      controlReliance: 'LIMITED — test key controls before relying, supplement with substantive',
      testingApproach: 'Combined approach: test of controls + substantive procedures',
      sampleMultiplier: 1.5,
      specialistRequired: false,
      isaRef: 'ISA 330.8 — combined approach for elevated risks',
    };
  }
  return {
    controlReliance: 'STANDARD — controls testing with routine substantive follow-up',
    testingApproach: 'Standard analytical procedures with targeted tests of detail',
    sampleMultiplier: 1.0,
    specialistRequired: false,
    isaRef: 'ISA 330.7 — routine audit procedures',
  };
}

function calibrateDetectionRisk(score, _cfg) {
  if (score >= 80) return { level: 'LOW', sampleIncrease: '30%', procedures: 'Extended' };
  if (score >= 50) return { level: 'MEDIUM', sampleIncrease: '15%', procedures: 'Enhanced' };
  return { level: 'HIGH', sampleIncrease: '0%', procedures: 'Standard' };
}

function generateAuditResponse(risk, score) {
  return {
    summary: score >= 80
      ? `Significant risk — extended substantive procedures, partner review required, consider specialist involvement.`
      : score >= 50
        ? `Elevated risk — enhanced procedures, increased sample sizes (${Math.round(score / 5)}+ items).`
        : `Normal risk — standard audit procedures sufficient.`,
    partnerReview: score >= 80,
    eqcrTrigger: score >= 80 && /going concern|fraud|revenue/i.test(risk.t),
  };
}

function extractState(state) {
  return { cfg: state.cfg || {}, ind: state.ind || null };
}

function cell(wp, field, value, reason) {
  return { type: 'cell_suggestion', wp, field, value: value || '', reason: reason || '', cellKey: `${wp}_${field}` };
}
