// ═══════════════════════════════════════════════════════════════
// Review Agent — Quality review across all WPs, flags gaps
// ═══════════════════════════════════════════════════════════════

export const reviewAgent = {
  name: 'Review Agent',
  description: 'Performs quality review across all working papers — flags gaps, inconsistencies, and compliance issues.',
  icon: '🔍',
  wpScope: ['all'],
  steps: [
    {
      name: 'Check Sign-off Completeness',
      type: 'analyze',
      analyze: (state) => {
        const signOffs = state.signOffs || {};
        const allWPs = state.allWPs || [];
        const issues = [];

        // Check for WPs prepared but not reviewed
        const preparedNotReviewed = allWPs.filter(w =>
          signOffs[w.id]?.preparedBy && !signOffs[w.id]?.reviewedBy
        );
        if (preparedNotReviewed.length > 0) {
          issues.push({
            type: 'review_finding',
            severity: 'warning',
            wp: 'review',
            field: 'unreviewed_wps',
            value: `${preparedNotReviewed.length} WPs prepared but not reviewed: ${preparedNotReviewed.map(w => w.ref || w.id).join(', ')}. ISA 220.25 requires engagement partner review of significant matters.`,
            reason: 'ISA 220.25 — review requirement',
            cellKey: 'review_unreviewed_wps',
          });
        }

        // Check for completely empty WPs
        const cellData = state.cellData || {};
        const emptyWPs = allWPs.filter(w => {
          const prefix = w.id.toLowerCase();
          return !Object.keys(cellData).some(k => k.toLowerCase().startsWith(prefix + '_'));
        });
        if (emptyWPs.length > 0) {
          issues.push({
            type: 'review_finding',
            severity: 'critical',
            wp: 'review',
            field: 'empty_wps',
            value: `${emptyWPs.length} working papers have no data: ${emptyWPs.slice(0, 10).map(w => w.ref || w.id).join(', ')}${emptyWPs.length > 10 ? '...' : ''}. Consider whether these WPs are applicable or need documentation.`,
            reason: 'Working paper completeness',
            cellKey: 'review_empty_wps',
          });
        }

        return issues;
      },
    },
    {
      name: 'Check Configuration Consistency',
      type: 'analyze',
      analyze: (state) => {
        const cfg = state.cfg || {};
        const issues = [];

        if (!cfg.entityName) {
          issues.push(finding('review', 'missing_entity_name', 'Entity name not configured. Required for all working papers and reports.', 'critical'));
        }
        if (!cfg.fye) {
          issues.push(finding('review', 'missing_fye', 'Financial year end not set. Required for audit scope and subsequent events assessment.', 'critical'));
        }
        if (!cfg.materiality) {
          issues.push(finding('review', 'missing_materiality', 'Overall materiality not set. Required per ISA 320 before substantive testing.', 'critical'));
        }
        if (!cfg.partner) {
          issues.push(finding('review', 'missing_partner', 'Engagement partner not identified. Required per ISA 220.12.', 'warning'));
        }
        if (!cfg.firmName) {
          issues.push(finding('review', 'missing_firm', 'Audit firm not identified.', 'info'));
        }
        if (cfg.materiality && cfg.perfMateriality) {
          const ratio = parseFloat(cfg.perfMateriality) / parseFloat(cfg.materiality);
          if (ratio < 0.5 || ratio > 0.85) {
            issues.push(finding('review', 'perf_mat_ratio', `Performance materiality ratio (${Math.round(ratio * 100)}%) outside normal range of 50-75%. Document rationale per ISA 320.11.`, 'warning'));
          }
        }

        return issues;
      },
    },
    {
      name: 'Check Trial Balance Coverage',
      type: 'analyze',
      analyze: (state) => {
        const tbData = state.tbData || [];
        const tbMappings = state.tbMappings || {};
        const issues = [];

        if (tbData.length === 0) {
          issues.push(finding('review', 'no_trial_balance', 'No trial balance data loaded. Import TB to enable analytical review and FSLI mapping.', 'warning'));
          return issues;
        }

        const unmapped = tbData.filter((_, i) => !tbMappings[i]).length;
        const unmappedPct = Math.round((unmapped / tbData.length) * 100);
        if (unmappedPct > 20) {
          issues.push(finding('review', 'tb_mapping_gaps', `${unmapped} of ${tbData.length} TB lines unmapped (${unmappedPct}%). Complete FSLI mapping for full coverage.`, 'warning'));
        }

        return issues;
      },
    },
    {
      name: 'Cross-Reference Checks',
      type: 'analyze',
      analyze: (state) => {
        const cellData = state.cellData || {};
        const issues = [];

        // Check if materiality in A3 is consistent with cfg
        const cfg = state.cfg || {};
        const a3Mat = cellData['a3_overall_materiality'];
        if (a3Mat && cfg.materiality) {
          const a3Val = parseFloat(a3Mat.replace(/[£,]/g, ''));
          const cfgVal = parseFloat(cfg.materiality);
          if (!isNaN(a3Val) && !isNaN(cfgVal) && Math.abs(a3Val - cfgVal) > 1) {
            issues.push(finding('review', 'materiality_inconsistency', `Materiality in A3 (£${a3Val.toLocaleString()}) differs from configured materiality (£${cfgVal.toLocaleString()}). Reconcile and update.`, 'warning'));
          }
        }

        return issues;
      },
    },
    {
      name: 'Generate Review Summary',
      type: 'analyze',
      analyze: (state, previousResults) => {
        const allFindings = previousResults.filter(r => r.type === 'review_finding');
        const criticals = allFindings.filter(f => f.severity === 'critical');
        const warnings = allFindings.filter(f => f.severity === 'warning');
        const infos = allFindings.filter(f => f.severity === 'info');

        return [{
          type: 'review_finding',
          severity: 'info',
          wp: 'review',
          field: 'review_summary',
          value: `Quality review complete: ${criticals.length} critical, ${warnings.length} warnings, ${infos.length} info. ${criticals.length === 0 ? 'No critical issues — file may proceed to partner review.' : 'Critical issues must be resolved before partner review.'}`,
          reason: 'Automated quality review summary',
          cellKey: 'review_summary',
        }];
      },
    },
  ],
};

function finding(wp, field, value, severity) {
  return {
    type: 'review_finding',
    severity,
    wp,
    field,
    value,
    reason: 'Quality review finding',
    cellKey: `${wp}_${field}`,
  };
}
