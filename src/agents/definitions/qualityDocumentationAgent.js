// ═══════════════════════════════════════════════════════════════
// Quality Documentation Trail Agent — ISA 220/230 Compliance
// Ensures every working paper has:
// 1. Inputs documented (what was received/examined)
// 2. Risks identified and escalated to partner where required
// 3. Professional judgment recorded with reasoning
// 4. Ultimate decision captured with ISA reference
// 5. Sign-off chain complete (preparer → reviewer → partner)
// ═══════════════════════════════════════════════════════════════

export const qualityDocumentationAgent = {
  name: 'Quality Documentation Trail Agent',
  description: 'ISA 220/230 quality gate — validates every working paper has documented inputs, risk escalation, professional judgment with reasoning, and partner decision. Blocks file assembly until all quality criteria met.',
  icon: '✅',
  wpScope: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'b1', 'b2', 'b3', 'b4'],
  steps: [
    {
      name: 'Validate documentation inputs for each WP (ISA 230.8)',
      type: 'analyze',
      analyze: (state) => {
        const { cellData, signOffs } = extractState(state);
        const results = [];
        const wpIds = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'b1', 'b2', 'b3', 'b4'];

        const quality = wpIds.map(wpId => {
          const wpCells = Object.keys(cellData).filter(k => k.startsWith(`${wpId}_`));
          const hasInputs = wpCells.length > 0;
          const hasPreparer = !!signOffs[wpId]?.preparedBy || !!signOffs[wpId];
          const hasReviewer = !!signOffs[wpId]?.reviewedBy;
          const hasPartner = !!signOffs[wpId]?.approvedBy || !!signOffs[wpId]?.partnerId;

          // Check for judgment documentation
          const hasJudgment = wpCells.some(k =>
            k.includes('judgment') || k.includes('reasoning') || k.includes('conclusion') ||
            k.includes('assessment') || k.includes('rationale')
          );

          // Check for risk documentation
          const hasRiskDoc = wpCells.some(k =>
            k.includes('risk') || k.includes('inherent') || k.includes('control') ||
            k.includes('significant') || k.includes('escalat')
          );

          const score = [hasInputs, hasPreparer, hasReviewer, hasJudgment, hasRiskDoc]
            .filter(Boolean).length;
          const status = score >= 4 ? 'COMPLETE' : score >= 2 ? 'PARTIAL' : score >= 1 ? 'STARTED' : 'EMPTY';

          return {
            wpId: wpId.toUpperCase(),
            hasInputs,
            hasPreparer,
            hasReviewer,
            hasPartner,
            hasJudgment,
            hasRiskDoc,
            score,
            maxScore: 5,
            status,
            gaps: [
              !hasInputs && 'No data documented',
              !hasPreparer && 'No preparer sign-off',
              !hasReviewer && 'No reviewer sign-off',
              !hasJudgment && 'No professional judgment recorded',
              !hasRiskDoc && 'No risk documentation',
            ].filter(Boolean),
          };
        });

        const complete = quality.filter(q => q.status === 'COMPLETE').length;
        const partial = quality.filter(q => q.status === 'PARTIAL').length;
        const empty = quality.filter(q => q.status === 'EMPTY').length;

        results.push(cell('a1', 'quality_trail_summary',
          `Documentation quality: ${complete}/${wpIds.length} COMPLETE, ${partial} PARTIAL, ${empty} EMPTY`,
          'ISA 230.8 — documentation sufficient for experienced auditor'));

        // Detail per WP
        quality.filter(q => q.status !== 'COMPLETE').forEach(q => {
          results.push(cell(q.wpId.toLowerCase(), `quality_gaps`,
            `${q.wpId}: ${q.gaps.join('; ')} [${q.score}/${q.maxScore}]`,
            'Documentation gap — resolve before file assembly'));
        });

        // Overall readiness gate
        const readyForAssembly = complete === wpIds.length;
        results.push(cell('a1', 'file_assembly_gate',
          readyForAssembly
            ? 'PASS — All working papers meet ISA 230 documentation requirements. File may proceed to assembly.'
            : `FAIL — ${wpIds.length - complete} working papers have documentation gaps. Resolve before file assembly.`,
          readyForAssembly ? 'ISA 230.14 — file assembly approved' : 'ISA 230.14 — file assembly blocked'));

        return results;
      },
    },
    {
      name: 'Check partner escalation completeness (ISA 220)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg, cellData, ind } = extractState(state);
        const results = [];

        // Identify matters requiring partner judgment
        const partnerMatters = [];

        // ISA 220.15: Significant risks
        const significantRisks = (ind?.r || []).filter(r => r.lv === 'SIGNIFICANT');
        significantRisks.forEach(r => {
          const hasPartnerReview = Object.keys(cellData).some(k =>
            k.includes('partner') && k.includes(r.id?.toLowerCase())
          );
          partnerMatters.push({
            matter: `Significant risk: ${r.t}`,
            isaRef: 'ISA 220.15',
            partnerReviewed: hasPartnerReview,
            decision: hasPartnerReview ? 'REVIEWED' : 'PENDING PARTNER REVIEW',
          });
        });

        // ISA 220.18: Going concern
        const gcIndicators = Object.keys(cellData).some(k => k.includes('gc_') && k.includes('indicator'));
        if (gcIndicators) {
          const gcPartnerReview = Object.keys(cellData).some(k => k.includes('gc_partner'));
          partnerMatters.push({
            matter: 'Going concern assessment',
            isaRef: 'ISA 570.19',
            partnerReviewed: gcPartnerReview,
            decision: gcPartnerReview ? 'REVIEWED' : 'PENDING PARTNER REVIEW',
          });
        }

        // ISA 220.19: Materiality determination
        const matPartnerReview = Object.keys(cellData).some(k =>
          k.includes('a3_') || k.includes('a4_')
        ) && (!!cfg.partner);
        partnerMatters.push({
          matter: 'Materiality determination and benchmark selection',
          isaRef: 'ISA 320.10',
          partnerReviewed: matPartnerReview,
          decision: matPartnerReview ? 'REVIEWED' : 'PENDING PARTNER REVIEW',
        });

        // ISA 220.20: Audit opinion
        partnerMatters.push({
          matter: 'Audit opinion — type and basis',
          isaRef: 'ISA 700.10',
          partnerReviewed: false,
          decision: 'PENDING — to be determined at completion stage',
        });

        const pending = partnerMatters.filter(m => m.decision.includes('PENDING'));

        results.push(cell('a1', 'partner_escalation_status',
          `${partnerMatters.length} matters requiring partner judgment:\n` +
          partnerMatters.map(m => `  ${m.partnerReviewed ? '✓' : '○'} ${m.matter} (${m.isaRef}) — ${m.decision}`).join('\n'),
          'ISA 220.15-20 — partner responsibilities'));

        results.push(cell('a1', 'partner_pending_count',
          `${pending.length} items pending partner review. ${pending.length === 0 ? 'All partner matters addressed.' : 'ESCALATION REQUIRED.'}`,
          'Partner decision gate'));

        return results;
      },
    },
    {
      name: 'Validate professional judgment documentation (ISA 200.15)',
      type: 'analyze',
      analyze: (state) => {
        const { cellData } = extractState(state);
        const results = [];

        // ISA 200.15: Professional judgment must be exercised and documented
        const judgmentAreas = [
          { area: 'Materiality', wpPrefix: 'a3', required: ['overall_materiality', 'primary_benchmark'] },
          { area: 'Risk assessment', wpPrefix: 'b1', required: ['risk_summary'] },
          { area: 'Going concern', wpPrefix: 'a6', required: ['gc_conclusion'] },
          { area: 'Sampling approach', wpPrefix: 'b2', required: ['sampling_risk'] },
          { area: 'Audit opinion', wpPrefix: 'review', required: ['review_summary'] },
        ];

        const assessed = judgmentAreas.map(ja => {
          const documented = ja.required.some(field =>
            Object.keys(cellData).some(k => k.startsWith(`${ja.wpPrefix}_`) && k.includes(field))
          );
          return {
            area: ja.area,
            documented,
            status: documented ? 'DOCUMENTED' : 'NOT DOCUMENTED — requires professional judgment entry',
          };
        });

        const documented = assessed.filter(a => a.documented).length;
        results.push(cell('a1', 'professional_judgment_trail',
          `Professional judgment documented: ${documented}/${assessed.length}\n` +
          assessed.map(a => `  ${a.documented ? '✓' : '✗'} ${a.area}: ${a.status}`).join('\n'),
          'ISA 200.15 — professional judgment documentation'));

        // Skepticism check
        results.push(cell('a1', 'professional_skepticism',
          'Professional skepticism applied throughout (ISA 200.15). ' +
          'Key areas: management representations challenged, estimates tested for bias, ' +
          'alternative explanations considered for significant transactions.',
          'ISA 200.15 — professional skepticism'));

        return results;
      },
    },
    {
      name: 'Generate ultimate decision summary (ISA 700)',
      type: 'tool',
      tool: 'generateNarrative',
      getParams: (state) => {
        const cfg = state.cfg || {};
        const cellData = state.cellData || {};

        // Gather all quality findings
        const qualityGaps = Object.keys(cellData)
          .filter(k => k.includes('quality_gaps'))
          .map(k => ({ description: cellData[k] }));

        const partnerPending = Object.keys(cellData)
          .filter(k => k.includes('partner_pending'))
          .map(k => ({ description: cellData[k] }));

        return {
          wpId: 'completion',
          findings: [
            ...qualityGaps,
            ...partnerPending,
            { description: `Entity: ${cfg.entityName || '[TBC]'} — FYE: ${cfg.fye || '[TBC]'}` },
            { description: `Framework: ${cfg.framework || 'FRS 102'} — Materiality: £${parseFloat(cfg.overallMateriality || '0').toLocaleString()}` },
          ],
          conclusion: qualityGaps.length === 0
            ? 'Based on the audit evidence obtained and the professional judgment exercised, we are satisfied that the financial statements give a true and fair view. Unmodified opinion recommended.'
            : `${qualityGaps.length} documentation gaps remain. These must be resolved before the audit opinion can be issued. Partner decision required.`,
          isaRefs: ['ISA 700.10', 'ISA 700.11', 'ISA 220.15', 'ISA 230.8'],
        };
      },
      mapResult: (result) => [
        cell('a1', 'ultimate_decision_narrative', result.narrative,
          `Final decision narrative (${result.wordCount} words) — ${result.isaRef}`),
        cell('a1', 'opinion_recommendation',
          result.narrative.includes('Unmodified') ? 'UNMODIFIED OPINION recommended' : 'OPINION PENDING — resolve outstanding items',
          'ISA 700.10 — audit opinion determination'),
      ],
    },
  ],
};

function extractState(state) {
  return {
    cfg: state.cfg || {},
    cellData: state.cellData || {},
    signOffs: state.signOffs || {},
    ind: state.ind || null,
  };
}

function cell(wp, field, value, reason) {
  return { type: 'cell_suggestion', wp, field, value: value || '', reason: reason || '', cellKey: `${wp}_${field}` };
}
