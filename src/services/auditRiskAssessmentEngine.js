/**
 * Audit Risk Assessment Engine
 * Comprehensive audit risk model with inherent, control, and detection risk
 * Drives audit strategy selection and testing approach
 *
 * Framework: ISA 200, ISA 315, ISA 330, ISA 330
 * Risk Model: Audit Risk = Inherent Risk × Control Risk × Detection Risk
 */

export class AuditRiskAssessmentEngine {
  constructor(options = {}) {
    this.materiality = options.materiality || 0.05;
    this.performanceMateriality = options.performanceMateriality || 0.75 * this.materiality;
    this.fslis = []; // Financial Statement Line Items
    this.riskAssessments = {};
    this.auditStrategies = {};
  }

  /**
   * ASSESS INHERENT RISK
   * Risk of material misstatement before considering controls
   * Framework: ISA 315 - Risk Identification & Assessment
   */
  assessInherentRisk(fsliData) {
    const inherentRisk = {
      fsli: fsliData.name,
      riskFactors: [],
      overallRating: 'MEDIUM',
      score: 0,
      details: {}
    };

    // Factor 1: Financial Statement Importance
    const importance = (fsliData.balance / fsliData.totalAssets) * 100;
    if (importance > 20) {
      inherentRisk.riskFactors.push('MATERIAL_AMOUNT: Large FSLI (>20% of assets)');
      inherentRisk.score += 30;
    } else if (importance > 10) {
      inherentRisk.riskFactors.push('SIGNIFICANT_AMOUNT: Moderate FSLI (>10% of assets)');
      inherentRisk.score += 20;
    }

    // Factor 2: Complexity of Accounting Treatment
    const complexity = fsliData.accountingComplexity || 'LOW';
    inherentRisk.details.complexity = complexity;
    if (complexity === 'HIGH') {
      inherentRisk.riskFactors.push('COMPLEX_ACCOUNTING: Requires judgment (IFRS 15, IFRS 9, etc.)');
      inherentRisk.score += 25;
    } else if (complexity === 'MEDIUM') {
      inherentRisk.score += 15;
    }

    // Factor 3: Transaction Volume & Turnover
    const volume = fsliData.transactionCount || 0;
    if (volume > 10000) {
      inherentRisk.riskFactors.push('HIGH_VOLUME: >10K transactions in period');
      inherentRisk.score += 20;
    } else if (volume > 1000) {
      inherentRisk.score += 10;
    }

    // Factor 4: Prior Year Issues & Misstatements
    if (fsliData.priorYearExceptions > 0) {
      inherentRisk.riskFactors.push(`PRIOR_ISSUES: ${fsliData.priorYearExceptions} exceptions prior year`);
      inherentRisk.score += 20;
    }

    // Factor 5: Management Override & Fraud Risk
    if (fsliData.hasManagementJudgment) {
      inherentRisk.riskFactors.push('JUDGMENT_AREA: Requires management estimates/judgment');
      inherentRisk.score += 15;
    }

    // Factor 6: Customer/Vendor Concentration
    if (fsliData.concentrationRatio > 40) {
      inherentRisk.riskFactors.push(`CONCENTRATION: Top items = ${fsliData.concentrationRatio}% of total`);
      inherentRisk.score += 15;
    }

    // Factor 7: Economic Environment & Industry Risk
    if (fsliData.industryRisk === 'HIGH') {
      inherentRisk.riskFactors.push('INDUSTRY_RISK: Volatile/declining industry');
      inherentRisk.score += 20;
    }

    // Determine Overall Rating
    if (inherentRisk.score >= 70) {
      inherentRisk.overallRating = 'HIGH';
    } else if (inherentRisk.score >= 40) {
      inherentRisk.overallRating = 'MEDIUM';
    } else {
      inherentRisk.overallRating = 'LOW';
    }

    inherentRisk.riskScore = inherentRisk.score;

    return inherentRisk;
  }

  /**
   * ASSESS CONTROL RISK
   * Risk of material misstatement NOT being prevented/detected by controls
   * Framework: ISA 315, ISA 330 - Control Effectiveness
   */
  assessControlRisk(fsliData, controlsData) {
    const controlRisk = {
      fsli: fsliData.name,
      controlsIdentified: controlsData.length,
      controlsTestedAsEffective: 0,
      controlsWithDeficiencies: [],
      overallRating: 'MEDIUM',
      score: 0,
      controlMatrix: []
    };

    // Evaluate each control
    controlsData.forEach(control => {
      const controlEvaluation = {
        controlId: control.id,
        controlName: control.name,
        controlType: control.type, // Preventive, Detective, Corrective
        transactionCycle: control.transactionCycle,
        designEffective: control.designEffective || false,
        operatingEffective: control.operatingEffective || false,
        frequency: control.frequency, // Daily, Weekly, Monthly, etc.
        automation: control.automation || 'Manual',
        deficiencies: [],
        testingApproach: null,
        rating: 'UNTESTED'
      };

      // Design Effectiveness Assessment
      if (!controlEvaluation.designEffective) {
        controlEvaluation.deficiencies.push('Design deficiency: Control not designed effectively');
        controlEvaluation.rating = 'DESIGN_DEFICIENCY';
      }

      // Operating Effectiveness Assessment
      if (controlEvaluation.designEffective && !controlEvaluation.operatingEffective) {
        controlEvaluation.deficiencies.push('Operating deficiency: Control not operating as designed');
        controlEvaluation.rating = 'OPERATING_DEFICIENCY';
      }

      if (controlEvaluation.designEffective && controlEvaluation.operatingEffective) {
        controlEvaluation.rating = 'EFFECTIVE';
        controlRisk.controlsTestedAsEffective++;
      } else if (controlEvaluation.deficiencies.length > 0) {
        controlRisk.controlsWithDeficiencies.push(controlEvaluation);
      }

      // Testing Approach
      controlEvaluation.testingApproach = this._determineControlTestingApproach(control);

      controlRisk.controlMatrix.push(controlEvaluation);
    });

    // Calculate Control Risk Rating
    const controlEffectivenessRate = controlRisk.controlsTestedAsEffective / controlsData.length;

    if (controlEffectivenessRate >= 0.8) {
      controlRisk.overallRating = 'LOW';
      controlRisk.score = 20;
    } else if (controlEffectivenessRate >= 0.5) {
      controlRisk.overallRating = 'MEDIUM';
      controlRisk.score = 50;
    } else {
      controlRisk.overallRating = 'HIGH';
      controlRisk.score = 80;
    }

    // Flag significant deficiencies
    if (controlRisk.controlsWithDeficiencies.length > 0) {
      controlRisk.significantDeficiencies = controlRisk.controlsWithDeficiencies.map(c => c.controlName);
    }

    return controlRisk;
  }

  /**
   * CALCULATE AUDIT RISK & DETERMINE DETECTION RISK
   * Audit Risk = Inherent Risk × Control Risk × Detection Risk
   * Framework: ISA 200 - Audit Risk Model
   */
  calculateAuditRisk(inherentRisk, controlRisk, targetAuditRisk = 0.05) {
    const auditRisk = {
      fsli: inherentRisk.fsli,
      inherentRisk: inherentRisk.overallRating,
      inherentRiskScore: inherentRisk.score,
      controlRisk: controlRisk.overallRating,
      controlRiskScore: controlRisk.score,
      targetAuditRisk: targetAuditRisk,
      calculatedAuditRisk: 0,
      detectionRiskRequired: 0,
      testingStrategy: null,
      procedureSelection: []
    };

    // Calculate numerical risk levels
    const irScore = this._getRiskScore(inherentRisk.overallRating);
    const crScore = this._getRiskScore(controlRisk.overallRating);

    auditRisk.calculatedAuditRisk = irScore * crScore;
    auditRisk.detectionRiskRequired = targetAuditRisk / auditRisk.calculatedAuditRisk;

    // Determine Testing Strategy based on Risk
    if (auditRisk.calculatedAuditRisk >= 0.50) {
      // High Risk: Substantive Focus
      auditRisk.testingStrategy = 'SUBSTANTIVE_FOCUS';
      auditRisk.overallAuditRisk = 'HIGH';
    } else if (auditRisk.calculatedAuditRisk >= 0.25) {
      // Medium Risk: Balanced Approach
      auditRisk.testingStrategy = 'BALANCED';
      auditRisk.overallAuditRisk = 'MEDIUM';
    } else {
      // Low Risk: Controls-Based
      auditRisk.testingStrategy = 'CONTROLS_BASED';
      auditRisk.overallAuditRisk = 'LOW';
    }

    return auditRisk;
  }

  /**
   * ASSESS FRAUD RISK
   * Consider fraud triangle: Incentive, Opportunity, Rationalization
   * Framework: ISA 240 - The Auditor's Responsibilities Relating to Fraud
   */
  assessFraudRisk(fsliData, engagementContext) {
    const fraudRisk = {
      fsli: fsliData.name,
      fraudTriangleFactors: {
        incentives: [],
        opportunities: [],
        rationalizations: []
      },
      fraudRiskLevel: 'NORMAL',
      significantFraudRisk: false,
      procedures: []
    };

    // INCENTIVES - Management pressure or personal motivation
    if (engagementContext.earningsTarget && fsliData.balance < engagementContext.earningsTarget) {
      fraudRisk.fraudTriangleFactors.incentives.push(
        'Financial performance pressure: Below earnings targets'
      );
    }

    if (engagementContext.compensationTiedToMetrics) {
      fraudRisk.fraudTriangleFactors.incentives.push(
        'Compensation incentives: Tied to financial metrics'
      );
    }

    if (fsliData.priorYearAdjustments > 0) {
      fraudRisk.fraudTriangleFactors.incentives.push(
        'Prior period issues: History of adjustments in this area'
      );
    }

    // OPPORTUNITIES - Weak controls or easy access
    if (controlRisk?.score > 60) {
      fraudRisk.fraudTriangleFactors.opportunities.push(
        'Weak control environment: Control deficiencies identified'
      );
    }

    if (fsliData.manualTransactions > 50) {
      fraudRisk.fraudTriangleFactors.opportunities.push(
        'Manual transactions: High volume of manual entries (>50%)'
      );
    }

    if (fsliData.complexAccounting) {
      fraudRisk.fraudTriangleFactors.opportunities.push(
        'Accounting complexity: Difficult to understand/trace'
      );
    }

    // RATIONALIZATIONS - Management integrity, tone at top
    if (engagementContext.mgmtToneAtTop === 'WEAK') {
      fraudRisk.fraudTriangleFactors.rationalizations.push(
        'Weak tone at top: Ethical concerns'
      );
    }

    if (engagementContext.priorManagementDisputes) {
      fraudRisk.fraudTriangleFactors.rationalizations.push(
        'Management disputes: History of disagreements with auditors'
      );
    }

    // Determine Fraud Risk Level
    const totalRiskFactors =
      fraudRisk.fraudTriangleFactors.incentives.length +
      fraudRisk.fraudTriangleFactors.opportunities.length +
      fraudRisk.fraudTriangleFactors.rationalizations.length;

    if (totalRiskFactors >= 4) {
      fraudRisk.fraudRiskLevel = 'SIGNIFICANT';
      fraudRisk.significantFraudRisk = true;
    } else if (totalRiskFactors >= 2) {
      fraudRisk.fraudRiskLevel = 'ELEVATED';
    } else {
      fraudRisk.fraudRiskLevel = 'NORMAL';
    }

    // Design fraud procedures
    fraudRisk.procedures = this._generateFraudProcedures(fsliData, fraudRisk);

    return fraudRisk;
  }

  /**
   * GENERATE RISK-BASED AUDIT STRATEGY
   * Framework: ISA 330 - The Auditor's Responses to Assessed Risks
   */
  generateAuditStrategy(auditRisk, controlRisk, inherentRisk, fraudRisk) {
    const strategy = {
      fsli: auditRisk.fsli,
      riskRating: auditRisk.overallAuditRisk,
      testingStrategy: auditRisk.testingStrategy,
      components: {
        inherentRisk: inherentRisk,
        controlRisk: controlRisk,
        auditRisk: auditRisk,
        fraudRisk: fraudRisk
      },
      testingApproach: {},
      procedureSelectionLogic: '',
      sampleSizeConsiderations: '',
      documentationRequirements: []
    };

    // ===== STRATEGY 1: CONTROLS-BASED (Low Risk) =====
    if (auditRisk.testingStrategy === 'CONTROLS_BASED') {
      strategy.testingApproach = {
        controlTesting: {
          extent: 'COMPREHENSIVE',
          approach: 'Perform testing of key controls in transaction cycles',
          procedures: this._generateControlTestingProcedures(controlRisk),
          expectation: 'Rely on controls to achieve audit objectives'
        },
        substantiveTesting: {
          extent: 'LIMITED',
          approach: 'Limited substantive procedures - balance only',
          procedures: [
            'Analytical review of account balance movements',
            'Testing of unusual transactions or period-end adjustments'
          ],
          sampling: 'Limited sample size possible due to control reliance'
        }
      };

      strategy.procedureSelectionLogic =
        'Low inherent and control risk allow reliance on controls. Substantive ' +
        'procedures limited to account balance verification and unusual items.';

      strategy.sampleSizeConsiderations =
        'Smaller sample sizes possible. Consider: controls operating throughout period, ' +
        'control effectiveness, and transaction volume.';
    }

    // ===== STRATEGY 2: BALANCED (Medium Risk) =====
    else if (auditRisk.testingStrategy === 'BALANCED') {
      strategy.testingApproach = {
        controlTesting: {
          extent: 'SELECTIVE',
          approach: 'Test key controls in higher risk areas',
          procedures: this._generateSelectiveControlProcedures(controlRisk),
          expectation: 'Partial reliance on controls for lower risk assertions'
        },
        substantiveTesting: {
          extent: 'MODERATE',
          approach: 'Moderate substantive testing across transactions and balance',
          procedures: [
            'Details testing of significant transactions',
            'Analytical review and reasonableness testing',
            'Substantive procedures on period-end transactions'
          ],
          sampling: 'Moderate sample size reflecting risk level'
        }
      };

      strategy.procedureSelectionLogic =
        'Combined approach. Rely on effective controls for some assertions while ' +
        'performing substantive testing for higher risk areas.';

      strategy.sampleSizeConsiderations =
        'Moderate sample sizes. Consider: materiality, control effectiveness in specific ' +
        'areas, risk of misstatement, and transaction volume.';
    }

    // ===== STRATEGY 3: SUBSTANTIVE FOCUS (High Risk) =====
    else if (auditRisk.testingStrategy === 'SUBSTANTIVE_FOCUS') {
      strategy.testingApproach = {
        controlTesting: {
          extent: 'LIMITED',
          approach: 'Limited control testing - focus on design only',
          procedures: [
            'Walkthrough of key processes to understand controls',
            'Evaluate design effectiveness of controls',
            'No operating effectiveness testing assumed'
          ],
          expectation: 'Minimal reliance on controls'
        },
        substantiveTesting: {
          extent: 'COMPREHENSIVE',
          approach: 'Detailed substantive testing of transactions and balance',
          procedures: [
            'Detailed testing of all significant transactions',
            'Comprehensive analytical review with investigation of all variances',
            'Testing of period-end cutoff and completeness',
            'Direct confirmation with third parties',
            'Detailed review of reconciliations and manual adjustments'
          ],
          sampling: 'Larger sample sizes or potentially testing entire population'
        }
      };

      strategy.procedureSelectionLogic =
        'High inherent or control risk requires comprehensive substantive testing. ' +
        'Controls not relied upon for audit conclusions.';

      strategy.sampleSizeConsiderations =
        'Larger sample sizes required. Consider: high risk rating, control deficiencies, ' +
        'complex accounting, prior year issues, and fraud risk factors.';
    }

    // Fraud Risk Procedures
    if (fraudRisk.significantFraudRisk) {
      strategy.fraudRiskProcedures = fraudRisk.procedures;
      strategy.fraudRiskNote = 'SIGNIFICANT FRAUD RISK IDENTIFIED - Enhanced procedures required';
    }

    // Documentation Requirements
    strategy.documentationRequirements = [
      'Risk assessment summary and supporting analysis',
      'Inherent risk assessment with risk factors',
      'Control identification and effectiveness evaluation',
      'Control testing program and results',
      'Substantive testing program and results',
      'Sample selection methodology and justification',
      'Fraud risk assessment and response procedures',
      'Audit strategy approval (Partner review)',
      'Changes to strategy and supporting rationale'
    ];

    return strategy;
  }

  /**
   * ASSESS SPECIFIC RISK AREAS FOR EACH ASSERTION
   * Existence, Completeness, Accuracy, Cutoff, Classification, Presentation
   */
  assessAssertionRisks(fsliData, controlRisk) {
    const assertions = [
      'existence',
      'completeness',
      'accuracy',
      'cutoff',
      'classification',
      'presentation'
    ];

    const assertionRisks = {};

    assertions.forEach(assertion => {
      const risk = {
        assertion: assertion,
        riskLevel: 'MEDIUM',
        riskFactors: [],
        controlsAddress: [],
        proceduresRequired: []
      };

      // EXISTENCE - Does the item actually exist?
      if (assertion === 'existence') {
        if (fsliData.concentrationRatio > 40) {
          risk.riskFactors.push('Large items concentrated in few customers/vendors');
          risk.riskLevel = 'HIGH';
        }
        if (fsliData.manualTransactions > 50) {
          risk.riskFactors.push('High proportion of manual transactions');
          risk.riskLevel = 'MEDIUM';
        }
        risk.proceduresRequired = [
          'Confirmation with external third parties',
          'Physical inspection/observation',
          'Testing authorization and supporting documentation'
        ];
      }

      // COMPLETENESS - Are all items recorded?
      if (assertion === 'completeness') {
        if (fsliData.transactionCount > 10000) {
          risk.riskFactors.push('High transaction volume - completeness difficult to verify');
          risk.riskLevel = 'MEDIUM';
        }
        if (controlRisk.controlsWithDeficiencies.length > 0) {
          risk.riskFactors.push('Control deficiencies in input/accrual controls');
          risk.riskLevel = 'HIGH';
        }
        risk.proceduresRequired = [
          'Reconciliation of subsidiary ledgers to general ledger',
          'Testing cut-off procedures',
          'Review of reconciliations and adjustments',
          'Analytical review for unusual variations'
        ];
      }

      // ACCURACY - Are amounts correct?
      if (assertion === 'accuracy') {
        if (fsliData.accountingComplexity === 'HIGH') {
          risk.riskFactors.push('Complex accounting - valuation difficult');
          risk.riskLevel = 'HIGH';
        }
        if (fsliData.hasManagementJudgment) {
          risk.riskFactors.push('Requires management estimates/judgment');
          risk.riskLevel = 'MEDIUM';
        }
        risk.proceduresRequired = [
          'Recalculation of amounts',
          'Review of supporting documentation',
          'Testing of valuation methodologies',
          'Verification of prices, rates, and terms'
        ];
      }

      // CUTOFF - Transactions recorded in correct period?
      if (assertion === 'cutoff') {
        if (fsliData.yearEndTransactions > 50) {
          risk.riskFactors.push('Significant period-end transactions');
          risk.riskLevel = 'MEDIUM';
        }
        risk.proceduresRequired = [
          'Review transactions around period end',
          'Verify proper recording in correct period',
          'Test supporting documentation'
        ];
      }

      // CLASSIFICATION - Correct account?
      if (assertion === 'classification') {
        if (fsliData.transactionTypes > 5) {
          risk.riskFactors.push('Multiple transaction types within account');
          risk.riskLevel = 'MEDIUM';
        }
        risk.proceduresRequired = [
          'Review transaction coding/classification',
          'Test accuracy of posting to ledger',
          'Evaluate reasonableness of classifications'
        ];
      }

      // PRESENTATION - Disclosed properly?
      if (assertion === 'presentation') {
        if (fsliData.hasComplexDisclosures) {
          risk.riskFactors.push('Complex disclosures required (IFRS)');
          risk.riskLevel = 'MEDIUM';
        }
        risk.proceduresRequired = [
          'Review financial statement disclosures',
          'Test adequacy of note disclosures',
          'Verify compliance with presentation standards'
        ];
      }

      assertionRisks[assertion] = risk;
    });

    return assertionRisks;
  }

  // ========== HELPER METHODS ==========

  _getRiskScore(riskRating) {
    const scoreMap = {
      'HIGH': 0.9,
      'MEDIUM': 0.5,
      'LOW': 0.1
    };
    return scoreMap[riskRating] || 0.5;
  }

  _determineControlTestingApproach(control) {
    if (!control.designEffective) {
      return 'NO_TESTING: Design deficiency - control not effective';
    }

    if (control.automation === 'Automated') {
      return 'AUTOMATED: Test automated control (input/output, logic)';
    } else {
      return 'MANUAL: Test manual control (sample testing, review)';
    }
  }

  _generateControlTestingProcedures(controlRisk) {
    const procedures = [];

    controlRisk.controlMatrix.forEach(control => {
      if (control.designEffective) {
        procedures.push({
          controlId: control.controlId,
          controlName: control.controlName,
          testingProcedure: this._determineControlTestingApproach(control),
          sampleSize: control.automation === 'Automated' ? '10-20 items' : '20-30 items',
          evaluationCriteria: 'Control operated effectively throughout period',
          documentationRequired: 'Evidence of control operation (logs, approvals, reconciliations)'
        });
      }
    });

    return procedures;
  }

  _generateSelectiveControlProcedures(controlRisk) {
    return controlRisk.controlMatrix
      .filter(c => c.designEffective && c.rating === 'EFFECTIVE')
      .slice(0, 3) // Select top 3 controls
      .map(c => ({
        controlId: c.controlId,
        controlName: c.controlName,
        testingScope: 'Selective - High risk areas only'
      }));
  }

  _generateFraudProcedures(fsliData, fraudRisk) {
    const procedures = [];

    if (fraudRisk.significantFraudRisk) {
      procedures.push({
        name: 'Expanded analytical procedures',
        description: 'Perform detailed analytical review looking for unusual items or patterns',
        focus: 'Identify anomalies suggesting potential fraud'
      });

      procedures.push({
        name: 'Journal entry testing',
        description: 'Test large, unusual, or period-end journal entries',
        focus: 'Identify potential management override'
      });

      procedures.push({
        name: 'Increased sample sizes',
        description: 'Increase sample sizes in higher fraud risk areas',
        focus: 'Better detection of potential fraud'
      });

      procedures.push({
        name: 'Involvement of specialists',
        description: 'Consider using specialists for complex areas',
        focus: 'Enhanced expertise for fraud detection'
      });
    }

    return procedures;
  }
}

export default AuditRiskAssessmentEngine;
