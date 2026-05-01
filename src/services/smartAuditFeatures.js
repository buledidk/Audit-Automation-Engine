/**
 * Smart Audit Features — AuditBoard-inspired + cross-platform intelligence
 * Auto-tick forward, cascading updates, deadline tracking, prior year comparison,
 * disclosure checklist generator, audit timeline generator, quality control dashboard,
 * control library, RCSA templates, issue tracking
 */

// ─── 1. AUTO-TICK FORWARD ────────────────────────────────────────────────

/**
 * When a procedure conclusion is 'satisfactory', cascade status updates
 * to: trial balance, risk assessment section, completion checklist
 * @param {string} procedureId
 * @param {string} conclusion    'satisfactory' | 'exception' | 'inconclusive'
 * @param {Object} context       { engagementId, fsli, sectionId, materiality, currentFindings }
 */
export function autoTickForward(procedureId, conclusion, context) {
  const updates = [];
  const { fsli, sectionId, _materiality, _currentFindings = [] } = context;

  if (conclusion === 'satisfactory') {
    // Update procedure
    updates.push({ type: 'procedure', id: procedureId, status: 'complete', result: 'satisfactory', autoTicked: true, tickDate: new Date().toISOString() });

    // Update section if all procedures satisfactory
    updates.push({ type: 'section_check', id: sectionId, action: 'check_if_complete', trigger: `Procedure ${procedureId} satisfactory` });

    // Update trial balance — tick this FSLI as covered
    updates.push({ type: 'trial_balance', fsli, status: 'covered', note: `Work completed on ${new Date().toLocaleDateString('en-GB')}` });

    // Update completion checklist
    updates.push({ type: 'completion_checklist', item: `${fsli}_substantive_testing`, status: 'complete' });

  } else if (conclusion === 'exception') {
    // Flag on section
    updates.push({ type: 'section_flag', id: sectionId, flag: 'exception_identified', fsli, severity: 'review_required' });

    // Add to findings accumulation
    updates.push({ type: 'findings_accumulation', action: 'add_flag', message: `Exception identified in ${fsli} — evaluate against performance materiality` });

    // Trigger AiDA real-time alert
    updates.push({ type: 'aida_alert', fsli, finding: { type: 'sampling_exception', procedureId }, urgency: 'high' });

  } else if (conclusion === 'inconclusive') {
    updates.push({ type: 'procedure_flag', id: procedureId, flag: 'inconclusive', action: 'Senior review required before section sign-off' });
  }

  return {
    procedureId,
    conclusion,
    updates,
    timestamp:  new Date().toISOString(),
    autoActioned: conclusion === 'satisfactory',
  };
}

// ─── 2. CASCADING MATERIALITY UPDATES ────────────────────────────────────

/**
 * When materiality changes, cascade through all dependent calculations
 * @param {Object} newMateriality     result of calculateMateriality()
 * @param {Object} engagementContext  { procedures, findings, sampleSizes }
 */
export function cascadeMaterialityUpdate(newMateriality, engagementContext) {
  const { procedures = [], findings = [], _sampleSizes = {} } = engagementContext;
  const updates = [];

  // 1. Recalculate sample sizes for all active procedures
  for (const proc of procedures) {
    if (proc.status !== 'complete' && proc.populationSize) {
      const newSample = Math.ceil(
        (proc.populationSize * 2.6) / (newMateriality.performanceMateriality / proc.populationSize * proc.populationSize || 1)
      );
      const cappedSample = Math.min(newSample, proc.populationSize);
      updates.push({
        type:     'procedure_sample',
        id:       proc.id,
        oldSize:  proc.sampleSize || 0,
        newSize:  cappedSample,
        reason:   `Sample size recalculated for revised materiality of £${newMateriality.overall.toLocaleString()}`,
      });
    }
  }

  // 2. Re-evaluate findings classification
  for (const finding of findings) {
    const oldClass = finding.classification;
    let newClass;
    const amt = Math.abs(finding.amount || 0);

    if (amt < newMateriality.trivialThreshold)          newClass = 'below_trivial';
    else if (amt < newMateriality.performanceMateriality) newClass = 'above_trivial_below_pm';
    else if (amt < newMateriality.overall)               newClass = 'above_pm_below_overall';
    else                                                  newClass = 'above_overall';

    if (newClass !== oldClass) {
      updates.push({
        type:     'finding_reclassified',
        id:       finding.id,
        oldClass,
        newClass,
        amount:   finding.amount,
        impact:   newClass === 'above_overall' ? 'Material misstatement — opinion may be affected' : `Classification changed to: ${newClass}`,
      });
    }
  }

  // 3. Update conclusion narratives
  const aggregateFindings = findings.reduce((s, f) => s + Math.abs(f.amount || 0), 0);
  let narrativeUpdate = '';

  if (aggregateFindings > newMateriality.overall) {
    narrativeUpdate = `⚠ MATERIAL: Aggregate uncorrected misstatements of £${aggregateFindings.toLocaleString()} exceed revised overall materiality of £${newMateriality.overall.toLocaleString()}. Consider impact on audit opinion.`;
  } else if (aggregateFindings > newMateriality.performanceMateriality) {
    narrativeUpdate = `⚠ Review required: Aggregate misstatements exceed performance materiality. Consider extending procedures.`;
  } else {
    narrativeUpdate = `Aggregate misstatements of £${aggregateFindings.toLocaleString()} remain below revised performance materiality of £${newMateriality.performanceMateriality.toLocaleString()}.`;
  }

  return {
    newMateriality,
    updates,
    narrativeUpdate,
    totalUpdates:  updates.length,
    timestamp:     new Date().toISOString(),
  };
}

// ─── 3. DEADLINE TRACKER ─────────────────────────────────────────────────

/**
 * Auto-calculate all UK regulatory filing deadlines from year-end date
 * Companies House, HMRC, audit opinion deadlines
 * @param {string} yearEnd          ISO date string (e.g. '2024-12-31')
 * @param {string} entityType       'private' | 'public' | 'charity' | 'llp'
 * @param {string} accountingRef    Companies House accounting reference date
 */
export function calculateDeadlines(yearEnd, entityType = 'private', options = {}) {
  const ye     = new Date(yearEnd);
  const today  = new Date();

  function addDays(date, days) {
    const d = new Date(date); d.setDate(d.getDate() + days); return d;
  }
  function addMonths(date, months) {
    const d = new Date(date); d.setMonth(d.getMonth() + months); return d;
  }
  function daysUntil(date) {
    return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
  }
  function formatDate(d) {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const deadlines = [];

  // Accounts filing — Companies House
  const accountsDeadline = entityType === 'public'  ? addMonths(ye, 6) :
                           entityType === 'charity' ? addMonths(ye, 10) :
                           addMonths(ye, 9);

  deadlines.push({
    name:      'Annual Accounts — Companies House',
    deadline:  formatDate(accountsDeadline),
    rawDate:   accountsDeadline,
    daysUntil: daysUntil(accountsDeadline),
    regulator: 'Companies House',
    reference: 'Companies Act 2006 s.394',
    penalty:   'Late filing penalties: £150 (up to 1 month), £375 (1-3 months), £750 (3-6 months), £1,500 (>6 months)',
    urgent:    daysUntil(accountsDeadline) <= 30,
  });

  // CT600 — HMRC (12 months from end of accounting period)
  const ct600Deadline = addMonths(ye, 12);
  deadlines.push({
    name:      'Corporation Tax Return (CT600) — HMRC',
    deadline:  formatDate(ct600Deadline),
    rawDate:   ct600Deadline,
    daysUntil: daysUntil(ct600Deadline),
    regulator: 'HMRC',
    reference: 'Corporation Tax Act 2010 s.83',
    penalty:   '£100 (1 day late), £200 (3 months), 10% of tax unpaid (6 months), further 10% (12 months)',
    urgent:    daysUntil(ct600Deadline) <= 30,
  });

  // CT Payment — 9 months + 1 day from year end
  const ctPaymentDate = addDays(addMonths(ye, 9), 1);
  deadlines.push({
    name:      'Corporation Tax Payment — HMRC',
    deadline:  formatDate(ctPaymentDate),
    rawDate:   ctPaymentDate,
    daysUntil: daysUntil(ctPaymentDate),
    regulator: 'HMRC',
    reference: 'CTSA — due 9 months and 1 day after accounting period end',
    penalty:   'Interest on late payment at HMRC late payment rate (currently BoE base + 2.5%)',
    urgent:    daysUntil(ctPaymentDate) <= 30,
  });

  // Confirmation Statement
  const csDate = addDays(addMonths(ye, 12), 14);
  deadlines.push({
    name:      'Confirmation Statement — Companies House',
    deadline:  formatDate(csDate),
    rawDate:   csDate,
    daysUntil: daysUntil(csDate),
    regulator: 'Companies House',
    reference: 'Companies Act 2006 s.853A',
    penalty:   'Criminal offence if not filed; company may be struck off',
    urgent:    daysUntil(csDate) <= 14,
  });

  // Quarterly VAT (if applicable)
  if (options.vatQuarterEnd) {
    const vatDue = addDays(new Date(options.vatQuarterEnd), 37); // 1 month + 7 days
    deadlines.push({
      name:      'VAT Return — HMRC',
      deadline:  formatDate(vatDue),
      rawDate:   vatDue,
      daysUntil: daysUntil(vatDue),
      regulator: 'HMRC',
      reference: 'VAT Act 1994 — MTD for VAT',
      penalty:   'Default surcharge or points-based penalty system',
      urgent:    daysUntil(vatDue) <= 7,
    });
  }

  // Audit opinion deadline (user-specified or 3 months before accounts deadline)
  const auditDeadline = options.auditOpinionDeadline
    ? new Date(options.auditOpinionDeadline)
    : addDays(accountsDeadline, -21);

  deadlines.push({
    name:      'Audit Report Sign-off Target',
    deadline:  formatDate(auditDeadline),
    rawDate:   auditDeadline,
    daysUntil: daysUntil(auditDeadline),
    regulator: 'Internal — Firm',
    reference: 'ISA 700 — Forming an Opinion and Reporting',
    penalty:   'N/A — internal target',
    urgent:    daysUntil(auditDeadline) <= 14,
  });

  deadlines.sort((a, b) => a.rawDate - b.rawDate);

  return {
    yearEnd,
    entityType,
    deadlines,
    urgentItems:  deadlines.filter(d => d.urgent),
    overdueItems: deadlines.filter(d => d.daysUntil < 0),
    nextDeadline: deadlines.find(d => d.daysUntil > 0),
  };
}

// ─── 4. PRIOR YEAR COMPARISON ────────────────────────────────────────────

/**
 * Auto-generate variance analysis for every line item
 * @param {Array}  current  [{ account, description, amount }]
 * @param {Array}  prior    [{ account, description, amount }]
 * @param {Object} options  { thresholdPct, materialityAmount }
 */
export function generatePriorYearComparison(current, prior, options = {}) {
  const { thresholdPct = 0.1, materialityAmount = 0 } = options;
  const priorMap = new Map(prior.map(p => [p.account, p]));
  const results  = [];

  for (const curr of current) {
    const priorItem = priorMap.get(curr.account);
    const currAmt   = curr.amount || 0;
    const priorAmt  = priorItem?.amount || 0;
    const absDiff   = currAmt - priorAmt;
    const pctChange = priorAmt !== 0 ? (absDiff / Math.abs(priorAmt)) * 100 : (currAmt !== 0 ? 100 : 0);

    const flagged = Math.abs(pctChange) > thresholdPct * 100 || Math.abs(absDiff) > materialityAmount;

    results.push({
      account:     curr.account,
      description: curr.description || priorItem?.description || '',
      current:     currAmt,
      prior:       priorAmt,
      absDiff,
      pctChange:   Number(pctChange.toFixed(1)),
      direction:   absDiff > 0 ? '▲' : absDiff < 0 ? '▼' : '─',
      trend:       Math.abs(pctChange) <= 5 ? 'stable' : absDiff > 0 ? 'increasing' : 'decreasing',
      flagged,
      flag:        flagged ? `${Math.abs(pctChange).toFixed(1)}% movement — explain or investigate` : null,
      severity:    Math.abs(pctChange) > 50 ? 'high' : Math.abs(pctChange) > 20 ? 'medium' : 'low',
    });
  }

  // Items in prior not in current
  const newInCurrent = current.filter(c => !priorMap.has(c.account)).map(c => ({ ...c, type: 'new', note: 'New item — not present in prior year' }));
  const removedFromCurrent = prior.filter(p => !current.find(c => c.account === p.account)).map(p => ({ ...p, type: 'removed', note: 'Item in prior year not in current — possible disposal or reclassification' }));

  return {
    results,
    newItems:     newInCurrent,
    removedItems: removedFromCurrent,
    flagged:      results.filter(r => r.flagged),
    summary: {
      total:       results.length,
      flagged:     results.filter(r => r.flagged).length,
      new:         newInCurrent.length,
      removed:     removedFromCurrent.length,
      highRisk:    results.filter(r => r.severity === 'high').length,
    },
    isaReference: 'ISA 520 — Analytical Procedures',
  };
}

// ─── 5. DISCLOSURE CHECKLIST GENERATOR ───────────────────────────────────

/**
 * Generate applicable disclosure checklist based on entity profile
 * @param {Object} profile  { framework, entityType, entitySize, hasLeases, hasDebt, hasRelatedParties, ... }
 */
export function generateDisclosureChecklist(profile) {
  const { framework = 'FRS 102', entityType = 'private', entitySize = 'small' } = profile;

  const allItems = [
    // Universal
    { id: 'DC-01', section: 'Basis of preparation',       ref: 'FRS 102.3 / IAS 1', mandatory: true,  trigger: 'always' },
    { id: 'DC-02', section: 'Going concern',               ref: 'FRS 102.3.8 / IAS 1.25', mandatory: true, trigger: 'always' },
    { id: 'DC-03', section: 'Accounting policies',         ref: 'FRS 102.8 / IAS 8', mandatory: true, trigger: 'always' },
    { id: 'DC-04', section: 'Revenue recognition policy',  ref: 'FRS 102.23 / IFRS 15', mandatory: true, trigger: 'always' },
    { id: 'DC-05', section: 'Tangible fixed assets — policy and depreciation rates', ref: 'FRS 102.17 / IAS 16', mandatory: true, trigger: 'always' },
    { id: 'DC-06', section: 'Average number of employees', ref: 'CA 2006 s.411', mandatory: entitySize !== 'micro', trigger: 'not_micro' },
    { id: 'DC-07', section: 'Directors\' emoluments — total and highest paid', ref: 'CA 2006 s.412', mandatory: entitySize !== 'micro', trigger: 'not_micro' },
    { id: 'DC-08', section: 'Post balance sheet events',   ref: 'FRS 102.32 / IAS 10', mandatory: !!profile.hasPostYearEndEvents, trigger: 'post_ye_events' },
    { id: 'DC-09', section: 'Contingent liabilities and commitments', ref: 'FRS 102.21 / IAS 37', mandatory: !!profile.hasContingencies, trigger: 'contingencies' },
    // Loans/debt
    { id: 'DC-10', section: 'Loans — terms, interest, security, maturity', ref: 'FRS 102.11 / IFRS 7', mandatory: !!profile.hasDebt, trigger: 'has_debt' },
    { id: 'DC-11', section: 'Covenant compliance',         ref: 'FRS 102.11', mandatory: !!profile.hasCovenants, trigger: 'has_covenants' },
    // Leases
    { id: 'DC-12', section: 'Right-of-use assets and lease liabilities', ref: 'IFRS 16 / FRS 102 Sec 20A', mandatory: !!profile.hasLeases && framework !== 'FRS 105', trigger: 'has_leases' },
    { id: 'DC-13', section: 'Lease commitments — minimum future payments', ref: 'FRS 102.20 / IFRS 16', mandatory: !!profile.hasLeases, trigger: 'has_leases' },
    // Related parties
    { id: 'DC-14', section: 'Related party transactions',  ref: 'FRS 102.33 / IAS 24', mandatory: !!profile.hasRelatedParties, trigger: 'related_parties' },
    // Group
    { id: 'DC-15', section: 'Parent company disclosure',   ref: 'CA 2006 s.409', mandatory: !!profile.hasParent, trigger: 'group' },
    // Charity
    { id: 'DC-16', section: 'Funds analysis (restricted/unrestricted/endowment)', ref: 'Charity SORP', mandatory: framework === 'Charity SORP', trigger: 'charity' },
    // IFRS / Listed extras
    { id: 'DC-17', section: 'Earnings per share (basic and diluted)', ref: 'IAS 33', mandatory: entityType === 'listed', trigger: 'listed' },
    { id: 'DC-18', section: 'Segment reporting',            ref: 'IFRS 8', mandatory: entityType === 'listed', trigger: 'listed' },
    { id: 'DC-19', section: 'Financial instruments — fair value hierarchy', ref: 'IFRS 7 / FRS 102.11', mandatory: !!profile.hasFinancialInstruments, trigger: 'fin_instruments' },
    { id: 'DC-20', section: 'Goodwill — impairment test details', ref: 'IAS 36 / FRS 102.27', mandatory: !!profile.hasGoodwill, trigger: 'has_goodwill' },
  ];

  const applicable = allItems.filter(d => d.mandatory);

  return {
    framework,
    entityType,
    entitySize,
    checklist: applicable.map(d => ({ ...d, status: 'unchecked', evidence: '', reviewer: null, notes: '' })),
    totalRequired: applicable.length,
    isaReference:  'ISA 700 / ISA 720 — Disclosure review',
  };
}

// ─── 6. AUDIT TIMELINE GENERATOR ─────────────────────────────────────────

/**
 * Generate Gantt-style audit timeline based on year-end, deadlines, and team size
 */
export function generateAuditTimeline(yearEnd, auditSignDate, teamSize = 3) {
  const ye   = new Date(yearEnd);
  const sign = new Date(auditSignDate || (() => { const d = new Date(ye); d.setMonth(d.getMonth() + 8); return d; })());
  const totalDays = Math.ceil((sign - ye) / (1000 * 60 * 60 * 24));

  function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function fmtRange(start, end) {
    return `${start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  }

  const milestones = [
    { phase: 'Planning',           start: addDays(ye, 7),            end: addDays(ye, 30),           activities: ['Engagement letter', 'Risk assessment', 'Materiality calculation', 'Audit plan', 'Team briefing'] },
    { phase: 'Interim Fieldwork',  start: addDays(ye, 31),           end: addDays(ye, 90),           activities: ['Controls testing', 'Walkthrough procedures', 'Interim substantive testing', 'Preliminary analytical review'] },
    { phase: 'Final Fieldwork',    start: addDays(ye, 91),           end: addDays(ye, Math.round(totalDays * 0.7)), activities: ['Balance sheet substantive procedures', 'Confirmation requests', 'Physical counts', 'Journal entry testing', 'Year-end procedures'] },
    { phase: 'Completion',         start: addDays(ye, Math.round(totalDays * 0.7) + 1), end: addDays(ye, Math.round(totalDays * 0.9)), activities: ['Findings evaluation', 'Going concern assessment', 'Subsequent events review', 'Management representations', 'Partner review', 'EQCR review'] },
    { phase: 'Reporting',          start: addDays(ye, Math.round(totalDays * 0.9) + 1), end: sign, activities: ['Audit report', 'Management letter', 'Engagement completion', 'File archiving'] },
  ];

  return {
    yearEnd,
    plannedSignDate: sign.toLocaleDateString('en-GB'),
    totalDays,
    teamSize,
    milestones: milestones.map(m => ({
      ...m,
      dateRange:   fmtRange(m.start, m.end),
      duration:    Math.ceil((m.end - m.start) / (1000 * 60 * 60 * 24)),
      startOffset: Math.ceil((m.start - ye) / (1000 * 60 * 60 * 24)),
    })),
    keyDates: [
      { event: 'Year End',                date: ye.toLocaleDateString('en-GB') },
      { event: 'Planning Complete',       date: milestones[0].end.toLocaleDateString('en-GB') },
      { event: 'Interim Complete',        date: milestones[1].end.toLocaleDateString('en-GB') },
      { event: 'Fieldwork Complete',      date: milestones[2].end.toLocaleDateString('en-GB') },
      { event: 'Audit Report Signed',     date: sign.toLocaleDateString('en-GB') },
    ],
  };
}

// ─── 7. QUALITY CONTROL DASHBOARD ────────────────────────────────────────

/**
 * Real-time view across all firm engagements
 * @param {Array} engagements  array of engagement objects
 */
export function generateQCDashboard(engagements) {
  const today = new Date();

  const withMetrics = engagements.map(eng => {
    const overdue = eng.plannedCompletion && new Date(eng.plannedCompletion) < today && !['complete', 'signed'].includes(eng.status);
    const completionPct = eng.sectionsTotal > 0 ? ((eng.sectionsComplete || 0) / eng.sectionsTotal * 100) : 0;

    return {
      ...eng,
      overdue,
      completionPct: Number(completionPct.toFixed(1)),
      daysToDeadline: eng.plannedCompletion ? Math.ceil((new Date(eng.plannedCompletion) - today) / (1000 * 60 * 60 * 24)) : null,
    };
  });

  return {
    total:            engagements.length,
    byStatus: {
      planning:       withMetrics.filter(e => e.status === 'planning').length,
      fieldwork:      withMetrics.filter(e => e.status === 'fieldwork').length,
      review:         withMetrics.filter(e => e.status === 'review').length,
      complete:       withMetrics.filter(e => e.status === 'complete').length,
      signed:         withMetrics.filter(e => e.status === 'signed').length,
    },
    overdue:          withMetrics.filter(e => e.overdue),
    overdueCount:     withMetrics.filter(e => e.overdue).length,
    avgCompletion:    Number((withMetrics.reduce((s, e) => s + e.completionPct, 0) / (withMetrics.length || 1)).toFixed(1)),
    unsignedComplete: withMetrics.filter(e => e.status === 'complete' && !e.partnerSignedOff),
    goingConcernEng:  withMetrics.filter(e => e.goingConcernFlag),
    openFindings:     withMetrics.reduce((s, e) => s + (e.openFindings || 0), 0),
    avgFRCScore:      Number((withMetrics.reduce((s, e) => s + (e.frcReadinessScore || 0), 0) / (withMetrics.length || 1)).toFixed(1)),
    engagements:      withMetrics.sort((a, b) => (a.daysToDeadline || 999) - (b.daysToDeadline || 999)),
  };
}

// ─── 8. CONTROL LIBRARY (AuditBoard-style) ───────────────────────────────

export const controlLibrary = {
  revenue: [
    { id: 'CON-REV-01', name: 'Revenue authorisation',    description: 'All revenue transactions authorised by management before recognition', risk: 'Unauthorised revenue entries', isaRef: 'ISA 315', frequency: 'Per transaction' },
    { id: 'CON-REV-02', name: 'Invoice sequence check',   description: 'Sequential invoice numbering monitored and gaps investigated', risk: 'Suppressed invoices / incomplete revenue', isaRef: 'ISA 315', frequency: 'Monthly' },
    { id: 'CON-REV-03', name: 'Dispatch note matching',   description: 'Revenue invoices matched to delivery notes before posting', risk: 'Revenue recognised without delivery', isaRef: 'IFRS 15', frequency: 'Per transaction' },
    { id: 'CON-REV-04', name: 'Credit note approval',     description: 'Credit notes require management approval and are reviewed for legitimacy', risk: 'Fraudulent credits reducing revenue', isaRef: 'ISA 240', frequency: 'Per event' },
  ],
  payables: [
    { id: 'CON-PAY-01', name: '3-way match',              description: 'All invoices matched to purchase order and GRN before payment', risk: 'Payment without goods/services received', isaRef: 'ISA 315', frequency: 'Per transaction' },
    { id: 'CON-PAY-02', name: 'Payment run authorisation', description: 'Payment runs authorised by two signatories above defined threshold', risk: 'Unauthorised payments', isaRef: 'ISA 315', frequency: 'Per payment run' },
    { id: 'CON-PAY-03', name: 'Supplier master file access', description: 'Changes to supplier master file restricted to finance director', risk: 'Fictitious supplier creation', isaRef: 'ISA 240', frequency: 'Per change' },
  ],
  payroll: [
    { id: 'CON-PAY-01', name: 'New employee authorisation', description: 'All new starters authorised by HR and confirmed against ID documents', risk: 'Ghost employees', isaRef: 'ISA 315', frequency: 'Per event' },
    { id: 'CON-PAY-02', name: 'Payroll reconciliation',   description: 'Payroll control account reconciled monthly to payroll records', risk: 'Undetected payroll manipulation', isaRef: 'ISA 330', frequency: 'Monthly' },
  ],
};

/**
 * Generate RCSA (Risk and Control Self-Assessment) template for a process
 * @param {'revenue'|'payables'|'payroll'|string} process
 */
export function generateRCSA(process) {
  const controls = controlLibrary[process] || [];
  return {
    process,
    generatedAt: new Date().toISOString(),
    controls:    controls.map(c => ({
      ...c,
      designEffective:     null,
      operatingEffective:  null,
      controlOwner:        '',
      testingStatus:       'not_tested',
      deficiencies:        [],
      remediationRequired: false,
    })),
    template: 'RCSA — AuditBoard-style Risk and Control Self-Assessment',
    isaReference: 'ISA 315 / ISA 330',
  };
}
