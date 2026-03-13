/**
 * AUDIT PROCEDURE HELPER UTILITIES
 * Functions for working with the audit procedure library
 */

import {
  RISK_LEVELS,
  SAMPLE_SIZE_TABLES,
  ASSERTIONS,
  PROCEDURE_STATUS,
  PROCEDURE_TRACKER,
  EXCEPTION_EVALUATION,
  INDUSTRY_VARIATIONS,
  PROCEDURE_LIBRARY
} from '../data/auditProcedureLibrary';

/**
 * PROCEDURE SELECTION AND FILTERING
 */
export const ProcedureSelector = {
  // Filter procedures by audit area
  getProceduresByArea: (area, library) => {
    return library[area]?.procedures || [];
  },

  // Filter procedures by assertion
  getProceduresByAssertion: (assertion, allProcedures) => {
    return allProcedures.filter(proc =>
      proc.assertions.includes(assertion) || proc.secondaryAssertions.includes(assertion)
    );
  },

  // Filter procedures by risk level
  getProceduresByRisk: (riskLevel, allProcedures) => {
    return allProcedures.filter(proc => {
      const sampleSize = proc.sampleSize?.[riskLevel];
      return sampleSize !== undefined;
    });
  },

  // Get procedures for specific industry
  getIndustrySpecificProcedures: (industry, baseArea, allProcedures) => {
    const industryVariation = INDUSTRY_VARIATIONS[industry];
    if (!industryVariation) return [];

    // Return base procedures plus any industry-specific modifications
    const baseProcedures = allProcedures.filter(p => p.area === baseArea);
    return {
      baseProcedures,
      modifications: industryVariation.procedureModifications,
      specialConsiderations: industryVariation.specialConsiderations
    };
  },

  // Search procedures by keyword
  searchProcedures: (keyword, allProcedures) => {
    const lowerKeyword = keyword.toLowerCase();
    return allProcedures.filter(proc =>
      proc.title.toLowerCase().includes(lowerKeyword) ||
      proc.description.toLowerCase().includes(lowerKeyword) ||
      proc.procedureId.toLowerCase().includes(lowerKeyword)
    );
  }
};

/**
 * SAMPLE SIZE CALCULATION
 */
export const SampleSizeCalculator = {
  // Calculate sample size based on population and risk
  calculate: (populationValue, populationCount, riskLevel, strata = 1) => {
    return SAMPLE_SIZE_TABLES.calculateSampleSize(
      populationValue,
      populationCount,
      riskLevel,
      strata
    );
  },

  // Get sample size from pre-calculated matrix
  getMatrixValue: (area, riskLevel) => {
    const matrix = SAMPLE_SIZE_TABLES.matrices[area.toLowerCase()];
    if (!matrix) return null;
    return matrix[riskLevel] || null;
  },

  // Calculate stratified sample sizes
  calculateStratified: (strata, riskLevel) => {
    // strata = [{name: 'High Value', value: 500000, count: 10}, ...]
    return strata.map(stratum => ({
      stratumName: stratum.name,
      populationValue: stratum.value,
      populationCount: stratum.count,
      ...SAMPLE_SIZE_TABLES.calculateSampleSize(
        stratum.value,
        stratum.count,
        riskLevel
      )
    }));
  },

  // Calculate sample size for multi-stage sampling
  calculateMultiStage: (populationCount, riskLevel, firstStagePercent = 0.5) => {
    const riskConfig = RISK_LEVELS[riskLevel];
    const targetPercent = parseInt(riskConfig.sampleSizePercent.split('-')[0]) / 100;

    return {
      firstStage: Math.ceil(populationCount * firstStagePercent),
      secondStage: Math.ceil(populationCount * targetPercent),
      effectiveSampleSize: Math.ceil(populationCount * targetPercent)
    };
  }
};

/**
 * EXCEPTION EVALUATION
 */
export const ExceptionEvaluator = {
  // Evaluate exceptions found in sample
  evaluate: (exceptions, sampleSize, population, materialityThreshold) => {
    const exceptionCount = exceptions.length;
    const exceptionRate = exceptionCount / sampleSize;

    // Project to population
    const projectedPopulation = Math.ceil(exceptionCount * (population / sampleSize));

    return {
      exceptionCount,
      sampleSize,
      exceptionRate: (exceptionRate * 100).toFixed(2) + '%',
      projectedPopulationImpact: projectedPopulation,
      materialityThreshold,
      isMaterial: projectedPopulation > materialityThreshold,
      qualitativeFactors: this.getQualitativeFactors(exceptions),
      auditConclusion: this.getConclusion(exceptionCount, exceptionRate),
      actionRequired: this.getActionRequired(exceptionCount, exceptionRate, isMaterial),
      singleExceptionImplications: exceptionCount === 1 ? this.singleExceptionImplications() : null,
      threeExceptionImplications: exceptionCount >= 3 ? this.threeExceptionImplications() : null
    };
  },

  // Get qualitative factors affecting assessment
  getQualitativeFactors: (exceptions) => {
    return {
      nature: exceptions.map(e => e.type).join(', '),
      cause: exceptions.every(e => e.cause === exceptions[0].cause) ? 'Systematic' : 'Random',
      controlDeficiency: exceptions.some(e => e.controlGap) ? 'Yes' : 'No',
      fraudIndicator: exceptions.some(e => e.fraudRisk) ? 'Yes' : 'No'
    };
  },

  // Get audit conclusion
  getConclusion: (count, rate) => {
    if (count === 0) return 'ACCEPT - No exceptions found';
    if (count === 1 && rate < 0.02) return 'ACCEPT WITH NOTATION - Single exception, investigate';
    if (count > 2 || rate > 0.05) return 'REJECT - Exceptions exceed tolerance';
    return 'INVESTIGATE FURTHER - Evaluate cause and impact';
  },

  // Get required action
  getActionRequired: (count, rate, isMaterial) => {
    if (count === 0) return {
      action: 'Accept',
      detail: 'Procedure completed successfully; no adjustment required'
    };

    if (count === 1) return {
      action: 'Investigate',
      detail: 'Single exception - determine if isolated or systematic; document cause; monitor'
    };

    if (count >= 3 || (rate > 0.05 && isMaterial)) return {
      action: 'Reject Sample',
      detail: 'Exceptions exceed tolerance; propose correction; increase sample; evaluate controls'
    };

    return {
      action: 'Conditional Accept',
      detail: 'Limited exceptions; evaluate materiality; propose correction if material'
    };
  },

  // Single exception implications
  singleExceptionImplications: () => ({
    interpretation: 'One exception in sample does not automatically indicate population is misstated',
    considerations: [
      'Is exception isolated event or symptom of systematic error?',
      'What is root cause? (clerical, control gap, judgment difference)',
      'Could similar exceptions exist in untested population?',
      'Impact on related assertions or areas?'
    ],
    auditResponse: [
      '1. Increase sample size for area; test additional items',
      '2. Consider 100% testing if high-risk area',
      '3. Test related control to determine if exception indicates control deficiency',
      '4. Evaluate for pattern; if systematic, propose adjustment or control remediation'
    ]
  }),

  // Three exception implications
  threeExceptionImplications: () => ({
    interpretation: 'Multiple exceptions indicate possible systematic misstatement',
    considerations: [
      'Are exceptions all same type or varied?',
      'Is there a single root cause or multiple causes?',
      'Do exceptions point to specific control weakness?',
      'Population impact likely material?'
    ],
    auditResponse: [
      '1. Propose correction of identified exceptions',
      '2. Increase sample size to near-100% testing',
      '3. Evaluate control deficiency; may require ICFR disclosure',
      '4. Assess for systematic adjusting entry',
      '5. Consider impact on audit opinion'
    ]
  })
};

/**
 * PROCEDURE TRACKER MANAGEMENT
 */
export const TrackerManager = {
  // Create new tracker for procedure
  create: (procedureId) => {
    return PROCEDURE_TRACKER.createTracker(procedureId);
  },

  // Update procedure status
  updateStatus: (tracker, newStatus) => {
    return PROCEDURE_TRACKER.updateStatus(tracker, newStatus);
  },

  // Record exception
  recordException: (tracker, exception) => {
    tracker.exceptionsFound += 1;
    tracker.exceptions = tracker.exceptions || [];
    tracker.exceptions.push({
      date: new Date(),
      description: exception.description,
      amount: exception.amount || 0,
      cause: exception.cause || 'Unknown',
      resolution: exception.resolution || 'Pending'
    });
    return tracker;
  },

  // Record hours spent
  recordHours: (tracker, hours) => {
    tracker.hoursSpent += hours;
    return tracker;
  },

  // Add note to tracker
  addNote: (tracker, note) => {
    tracker.notes = tracker.notes || [];
    tracker.notes.push({
      date: new Date(),
      text: note
    });
    return tracker;
  },

  // Get tracker summary
  getSummary: (tracker) => {
    return {
      procedureId: tracker.procedureId,
      status: tracker.status,
      progress: `${tracker.status === PROCEDURE_STATUS.COMPLETE ? '100%' : '50%'}`,
      preparer: tracker.preparer || 'Unassigned',
      reviewer: tracker.reviewer || 'Pending',
      hoursSpent: tracker.hoursSpent,
      exceptionsFound: tracker.exceptionsFound,
      dateStarted: tracker.dateStarted ? tracker.dateStarted.toLocaleDateString() : 'Not started',
      dateCompleted: tracker.dateCompleted ? tracker.dateCompleted.toLocaleDateString() : 'Not completed',
      workingPaperLocation: tracker.workingPaperLocation
    };
  },

  // Get procedures by status
  getProceduresByStatus: (allTrackers, status) => {
    return allTrackers.filter(t => t.status === status);
  },

  // Get audit progress
  getProgress: (allTrackers) => {
    const total = allTrackers.length;
    const completed = allTrackers.filter(t => t.status === PROCEDURE_STATUS.COMPLETE).length;
    const inProgress = allTrackers.filter(t => t.status === PROCEDURE_STATUS.IN_PROGRESS).length;
    const notStarted = allTrackers.filter(t => t.status === PROCEDURE_STATUS.NOT_STARTED).length;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      percentComplete: Math.round((completed / total) * 100),
      totalHours: allTrackers.reduce((sum, t) => sum + t.hoursSpent, 0),
      totalExceptions: allTrackers.reduce((sum, t) => sum + t.exceptionsFound, 0)
    };
  }
};

/**
 * EVIDENCE MANAGEMENT
 */
export const EvidenceManager = {
  // Record evidence obtained
  recordEvidence: (procedureId, evidence) => {
    return {
      procedureId,
      evidenceId: `${procedureId}-${Date.now()}`,
      source: evidence.source,
      description: evidence.description,
      reliability: evidence.reliability || 'Medium',
      dateCaptured: new Date(),
      fileLocation: evidence.fileLocation,
      type: evidence.type,
      quantity: evidence.quantity || 1,
      preparer: evidence.preparer,
      reviewed: false,
      reviewDate: null,
      reviewerNotes: ''
    };
  },

  // Assess evidence quality
  assessReliability: (evidenceType) => {
    const reliabilityMatrix = {
      'External Confirmation': 'High',
      'Inspection/Observation': 'High',
      'Bank Statement': 'High',
      'GL Entry': 'High',
      'Customer Invoice': 'High',
      'Supplier Statement': 'High',
      'Management Calculation': 'Medium',
      'Recalculation': 'High',
      'Analytical Procedure': 'Medium',
      'Management Representation': 'Low-Medium',
      'Oral Inquiry': 'Low',
      'Internal Document': 'Medium'
    };
    return reliabilityMatrix[evidenceType] || 'Medium';
  },

  // Get evidence summary for procedure
  getSummary: (procedureId, allEvidence) => {
    const procEvidence = allEvidence.filter(e => e.procedureId === procedureId);
    return {
      procedureId,
      evidenceCount: procEvidence.length,
      types: [...new Set(procEvidence.map(e => e.type))],
      highReliability: procEvidence.filter(e => e.reliability === 'High').length,
      mediumReliability: procEvidence.filter(e => e.reliability === 'Medium').length,
      allReviewed: procEvidence.every(e => e.reviewed),
      fileLocations: procEvidence.map(e => e.fileLocation)
    };
  }
};

/**
 * AUDIT AREA PLANNING
 */
export const AuditPlanner = {
  // Get procedures for audit area
  getAreaProcedures: (area) => {
    return PROCEDURE_LIBRARY[area] || null;
  },

  // Calculate total procedures by area
  getTotalProcedures: () => {
    return Object.entries(PROCEDURE_LIBRARY).reduce((acc, [area, config]) => {
      acc[area] = config.totalProcedures;
      return acc;
    }, {});
  },

  // Get all areas
  getAllAreas: () => {
    return Object.keys(PROCEDURE_LIBRARY).map(area => ({
      area,
      ...PROCEDURE_LIBRARY[area]
    }));
  },

  // Get procedures by risk assessment
  getProceduresByRiskAssessment: (riskAssessment, area) => {
    const areaProcs = PROCEDURE_LIBRARY[area]?.procedures || [];
    return areaProcs.filter(proc => {
      // Match procedures to identified risks
      return proc.riskRespond.some(risk =>
        riskAssessment.identifiedRisks.includes(risk)
      );
    });
  },

  // Create audit program for area
  createAuditProgram: (area, riskLevel, industry = 'General') => {
    const areaConfig = PROCEDURE_LIBRARY[area];
    if (!areaConfig) return null;

    const procedures = areaConfig.procedures.map(proc => ({
      ...proc,
      sampleSize: proc.sampleSize[riskLevel],
      riskLevel,
      industry
    }));

    const industryVariations = INDUSTRY_VARIATIONS[industry]?.procedureModifications || {};

    return {
      area,
      riskLevel,
      industry,
      totalProcedures: procedures.length,
      procedures: procedures.map(p => ({
        ...p,
        modifications: industryVariations[p.procedureId] || null
      })),
      estimatedHours: this.estimateHours(procedures),
      keyAssertions: areaConfig.keyAssertions,
      keyRisks: areaConfig.keyRisks
    };
  },

  // Estimate hours for audit program
  estimateHours: (procedures) => {
    // Rough estimates based on procedure complexity
    const baseHours = {
      'Substantive Detail': 4,
      'Substantive': 3,
      'Control': 2,
      'Analytical': 1
    };

    return procedures.reduce((total, proc) => {
      const hours = baseHours[proc.testNature] || 2;
      return total + hours;
    }, 0);
  }
};

/**
 * ASSERTION MAPPING AND COVERAGE
 */
export const AssertionMapper = {
  // Get all assertions
  getAllAssertions: () => {
    return Object.values(ASSERTIONS);
  },

  // Get procedures testing specific assertion
  getProceduresForAssertion: (assertion, allProcedures) => {
    return allProcedures.filter(p =>
      p.assertions.includes(assertion) || p.secondaryAssertions.includes(assertion)
    );
  },

  // Get assertion coverage for area
  getAssertionCoverage: (area, procedures) => {
    const areaProcs = procedures.filter(p => p.area === area);
    const coverage = {};

    Object.keys(ASSERTIONS).forEach(assertion => {
      const proceduresForAssertion = areaProcs.filter(p =>
        p.assertions.includes(assertion)
      );
      coverage[assertion] = {
        count: proceduresForAssertion.length,
        procedures: proceduresForAssertion.map(p => p.procedureId)
      };
    });

    return coverage;
  },

  // Verify all assertions are covered
  verifyCoverage: (area, procedures) => {
    const coverage = this.getAssertionCoverage(area, procedures);
    const uncovered = Object.entries(coverage)
      .filter(([_, data]) => data.count === 0)
      .map(([assertion, _]) => assertion);

    return {
      allCovered: uncovered.length === 0,
      uncovered,
      totalAssertions: Object.keys(ASSERTIONS).length,
      coveredAssertions: Object.keys(ASSERTIONS).length - uncovered.length
    };
  }
};

/**
 * INDUSTRY-SPECIFIC HELPERS
 */
export const IndustryHelper = {
  // Get industry variations
  getIndustryVariations: (industry) => {
    return INDUSTRY_VARIATIONS[industry] || null;
  },

  // Get all supported industries
  getSupportedIndustries: () => {
    return Object.keys(INDUSTRY_VARIATIONS).map(industry => ({
      industry,
      ...INDUSTRY_VARIATIONS[industry]
    }));
  },

  // Customize procedures for industry
  customizeProcedures: (procedures, industry) => {
    const variations = INDUSTRY_VARIATIONS[industry];
    if (!variations) return procedures;

    return procedures.map(proc => ({
      ...proc,
      modification: variations.procedureModifications[proc.procedureId] || null
    }));
  }
};

/**
 * CONCLUSION FRAMEWORK HELPERS
 */
export const ConclusionBuilder = {
  // Build conclusion for procedure
  buildConclusion: (procedureId, testResults) => {
    return {
      procedureId,
      testDate: new Date(),
      sampleSize: testResults.sampleSize,
      exceptionsFound: testResults.exceptions?.length || 0,
      conclusion: this.getConclusion(testResults),
      evidence: testResults.evidenceCount || 0,
      materiality: testResults.materialityAssessed || false,
      followUpRequired: (testResults.exceptions?.length || 0) > 0,
      preparer: testResults.preparer,
      reviewer: testResults.reviewer,
      reviewDate: testResults.reviewDate || null,
      notes: testResults.notes || ''
    };
  },

  // Get conclusion text
  getConclusion: (testResults) => {
    if ((testResults.exceptions?.length || 0) === 0) {
      return 'Procedure completed successfully; no exceptions noted; assertion supported';
    }

    const exceptionCount = testResults.exceptions?.length || 0;
    if (exceptionCount === 1) {
      return `Single exception noted; cause documented; materiality assessed; assertion supported with notation`;
    }

    if (exceptionCount > 3) {
      return `Multiple exceptions noted; systematic issue possible; proposed adjustment required; assertion qualified`;
    }

    return `Limited exceptions noted; materiality assessed; proposed adjustment required; assertion supported pending adjustment`;
  }
};

// Export all utilities
export default {
  ProcedureSelector,
  SampleSizeCalculator,
  ExceptionEvaluator,
  TrackerManager,
  EvidenceManager,
  AuditPlanner,
  AssertionMapper,
  IndustryHelper,
  ConclusionBuilder
};
