/**
 * ENHANCEMENT #3: AUDIT CONFIDENCE SCORING ENGINE
 * ===============================================
 * Granular confidence levels for every audit assertion.
 * Better targeting of audit efforts, risk-based resource allocation.
 */

export class AuditConfidenceScoringEngine {
  constructor() {
    this.weights = {
      evidenceStrength: 0.30,
      sourceReliability: 0.25,
      consistency: 0.20,
      completeness: 0.15,
      overrideFreedom: 0.10
    };
  }

  /**
   * Score all findings for confidence
   */
  async scoreAllFindings(results) {
    const scores = {};

    const findings = this._extractFindings(results);

    for (const finding of findings) {
      scores[finding.id] = await this._scoreIndividualFinding(finding, results);
    }

    return scores;
  }

  /**
   * Score individual finding
   */
  async _scoreIndividualFinding(finding, context) {
    return {
      findingId: finding.id,
      evidenceStrengthScore: this._scoreEvidenceStrength(finding),
      sourceReliabilityScore: this._scoreSourceReliability(finding),
      consistencyScore: this._scoreConsistency(finding, context),
      completenessScore: this._scoreCompleteness(finding),
      overrideResistanceScore: this._scoreOverrideResistance(finding),
      finalConfidenceScore: 0,
      confidenceLevel: '',
      riskAssessment: '',
      recommendedAuditProcedures: []
    };
  }

  /**
   * Score evidence strength (0-1)
   */
  _scoreEvidenceStrength(finding) {
    let score = 0;

    // Direct evidence (higher score)
    if (finding.evidenceType === 'DIRECT') score += 0.9;
    else if (finding.evidenceType === 'INDIRECT') score += 0.6;
    else if (finding.evidenceType === 'INFERENTIAL') score += 0.3;
    else score += 0.1;

    // Evidence quantity
    if (finding.evidenceCount >= 5) score += 0.1;
    else if (finding.evidenceCount >= 3) score += 0.05;

    // Recency
    if (finding.evidenceAge <= 30) score += 0.05;

    return Math.min(1.0, score);
  }

  /**
   * Score source reliability (ISA 500 hierarchy)
   */
  _scoreSourceReliability(finding) {
    const sourceReliabilityHierarchy = {
      'EXTERNAL_THIRD_PARTY': 0.95,
      'EXTERNAL_INDEPENDENT': 0.90,
      'INTERNAL_UNDER_CONTROL': 0.75,
      'INTERNAL_MANAGEMENT_CREATED': 0.60,
      'MANAGEMENT_ESTIMATE': 0.50,
      'UNVERIFIED': 0.20
    };

    const reliability = sourceReliabilityHierarchy[finding.sourceType] || 0.5;
    const adjustments = this._applySourceAdjustments(finding);

    return Math.min(1.0, Math.max(0, reliability + adjustments));
  }

  /**
   * Apply source reliability adjustments
   */
  _applySourceAdjustments(finding) {
    let adjustment = 0;

    // Controls over preparation
    if (finding.hasControlsOverPreperation) adjustment += 0.1;

    // Auditor involvement
    if (finding.auditorObserved) adjustment += 0.1;
    if (finding.auditorVerified) adjustment += 0.05;

    // Prior relationship
    if (finding.priorYearIssues) adjustment -= 0.1;
    if (finding.priorYearClean) adjustment += 0.05;

    // External verification
    if (finding.externallyVerified) adjustment += 0.15;

    return adjustment;
  }

  /**
   * Score consistency across sources
   */
  _scoreConsistency(finding, _context) {
    let score = 0.5; // Base score

    // Check consistency with other findings
    const consistentSources = finding.consistentWithOtherEvidence ? 0.25 : -0.15;
    score += consistentSources;

    // Check consistency with prior periods
    if (finding.consistentWithPriorPeriod) {
      score += 0.15;
    } else if (finding.changedFromPriorPeriod) {
      score -= 0.10;
    }

    // Check for contradictions
    if (finding.hasContradictions) {
      score -= 0.25;
    }

    // Multiple sources agreement
    if (finding.agreementAcrossSources) {
      score += 0.15;
    }

    return Math.min(1.0, Math.max(0, score));
  }

  /**
   * Score completeness of audit procedures
   */
  _scoreCompleteness(finding) {
    let score = 0.5;

    // Procedures performed
    if (finding.proceduresCount >= 5) score += 0.25;
    else if (finding.proceduresCount >= 3) score += 0.15;
    else score -= 0.1;

    // Sampling coverage
    if (finding.samplingRate >= 0.2) score += 0.15;
    else if (finding.samplingRate >= 0.1) score += 0.05;

    // Population tested
    if (finding.populationTested > 1000) score += 0.1;

    // Exceptions found and addressed
    if (finding.exceptionsFound && finding.exceptionsResolved) score += 0.05;

    return Math.min(1.0, Math.max(0, score));
  }

  /**
   * Score resistance to override
   */
  _scoreOverrideResistance(finding) {
    let score = 0.7; // Base resilience

    // Detection controls
    if (finding.hasAutomatedControls) score += 0.15;
    if (finding.hasManualControls) score += 0.05;

    // Segregation of duties
    if (finding.hasSODControls) score += 0.1;

    // Approvals and authorizations
    if (finding.requiresApproval) score += 0.05;
    if (finding.requiresDirectorSign) score += 0.1;

    // Evidence of management override
    if (finding.indicatesManagementOverride) score -= 0.3;
    if (finding.hasHistoryOfOverride) score -= 0.15;

    return Math.min(1.0, Math.max(0, score));
  }

  /**
   * Calculate final confidence score
   */
  _calculateFinalConfidence(scores) {
    const weighted =
      (scores.evidenceStrengthScore * this.weights.evidenceStrength) +
      (scores.sourceReliabilityScore * this.weights.sourceReliability) +
      (scores.consistencyScore * this.weights.consistency) +
      (scores.completenessScore * this.weights.completeness) +
      (scores.overrideResistanceScore * this.weights.overrideFreedom);

    return Math.round(weighted * 100) / 100;
  }

  /**
   * Determine confidence level
   */
  _getConfidenceLevel(score) {
    if (score >= 0.85) return 'VERY HIGH';
    if (score >= 0.70) return 'HIGH';
    if (score >= 0.55) return 'MEDIUM';
    if (score >= 0.40) return 'LOW';
    return 'VERY LOW';
  }

  /**
   * Generate risk assessment based on confidence
   */
  _generateRiskAssessment(score) {
    const level = this._getConfidenceLevel(score);

    const assessments = {
      'VERY HIGH': 'Finding is well-supported by evidence. Minimal additional procedures required.',
      'HIGH': 'Finding is supported by evidence. Standard audit procedures recommended.',
      'MEDIUM': 'Finding has moderate support. Enhanced procedures recommended.',
      'LOW': 'Finding has limited support. Significant additional procedures required.',
      'VERY LOW': 'Finding lacks adequate support. Extensive additional procedures required or finding questioned.'
    };

    return assessments[level];
  }

  /**
   * Generate recommended audit procedures
   */
  _generateRecommendedProcedures(score, _finding) {
    const procedures = [];

    if (score < 0.85) {
      procedures.push('Obtain additional supporting documentation');
    }
    if (score < 0.70) {
      procedures.push('Perform detailed substantive testing');
      procedures.push('Obtain independent external confirmation');
    }
    if (score < 0.55) {
      procedures.push('Expand sample size significantly');
      procedures.push('Perform additional analytical procedures');
      procedures.push('Involve specialist or partner review');
    }
    if (score < 0.40) {
      procedures.push('Reconsider inherent risk assessment');
      procedures.push('Re-evaluate control effectiveness');
      procedures.push('Escalate to audit partner');
    }

    return procedures;
  }

  /**
   * Extract findings from results
   */
  _extractFindings(results) {
    const findings = [];

    const extractFromObj = (obj, prefix = '') => {
      if (Array.isArray(obj)) {
        obj.forEach((item, idx) => {
          if (item && typeof item === 'object') {
            extractFromObj(item, `${prefix}[${idx}]`);
          }
        });
      } else if (obj && typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj)) {
          if (key.includes('finding') || key.includes('anomaly') || key.includes('issue')) {
            findings.push({
              id: `${prefix}.${key}`,
              value: value,
              evidenceType: 'INDIRECT',
              sourceType: 'INTERNAL_MANAGEMENT_CREATED',
              evidenceCount: 1,
              evidenceAge: 0,
              consistentWithOtherEvidence: true,
              proceduresCount: 1,
              samplingRate: 0.1
            });
          }
          if (typeof value === 'object' && value !== null) {
            extractFromObj(value, `${prefix}.${key}`);
          }
        }
      }
    };

    extractFromObj(results);
    return findings.slice(0, 10); // Limit to 10 findings
  }
}

export default AuditConfidenceScoringEngine;
