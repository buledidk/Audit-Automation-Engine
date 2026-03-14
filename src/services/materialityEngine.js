/**
 * Advanced Materiality Calculation Engine
 *
 * Features:
 * - Multi-benchmark materiality calculation
 * - Sensitivity analysis
 * - Scenario planning
 * - Industry benchmarking
 */

export class MaterialityEngine {
  constructor() {
    this.benchmarks = {
      profit: { rate: 0.05, label: "5% of Pre-Tax Profit" },
      revenue: { rate: 0.01, label: "1% of Revenue" },
      assets: { rate: 0.01, label: "1% of Total Assets" },
      equity: { rate: 0.05, label: "5% of Equity" }
    };

    this.industryBenchmarks = {
      Manufacturing: {
        primary: "profit",
        secondary: "assets",
        weights: { profit: 0.6, assets: 0.4 }
      },
      SaaS: {
        primary: "revenue",
        secondary: "profit",
        weights: { revenue: 0.6, profit: 0.4 }
      },
      Retail: {
        primary: "profit",
        secondary: "revenue",
        weights: { profit: 0.5, revenue: 0.5 }
      },
      Banking: {
        primary: "assets",
        secondary: "equity",
        weights: { assets: 0.7, equity: 0.3 }
      }
    };
  }

  /**
   * Calculate base materiality using multiple benchmarks
   * @param {Object} context - Financial context
   * @returns {Object} Materiality calculation
   */
  calculateBaseMateriality(context) {
    if (!context.preTextProfit && !context.revenue && !context.assets && !context.equity) {
      throw new Error("At least one benchmark value is required");
    }

    // Determine applicable benchmarks
    const benchmarkResults = [];

    if (context.preTextProfit) {
      benchmarkResults.push({
        benchmark: "5% Profit",
        value: context.preTextProfit * 0.05,
        basis: "Pre-Tax Profit"
      });
    }

    if (context.revenue) {
      benchmarkResults.push({
        benchmark: "1% Revenue",
        value: context.revenue * 0.01,
        basis: "Revenue"
      });
    }

    if (context.assets) {
      benchmarkResults.push({
        benchmark: "1% Assets",
        value: context.assets * 0.01,
        basis: "Total Assets"
      });
    }

    if (context.equity) {
      benchmarkResults.push({
        benchmark: "5% Equity",
        value: context.equity * 0.05,
        basis: "Equity"
      });
    }

    // Apply industry weighting
    const industryWeights = this.industryBenchmarks[context.industry];
    let overallMateriality = 0;

    if (industryWeights) {
      // Weighted calculation based on industry
      let weightedTotal = 0;
      let totalWeight = 0;

      benchmarkResults.forEach((result) => {
        const basisKey = result.basis.toLowerCase().replace("-", "").replace(" ", "");
        const weight = this._getWeightForBasis(basisKey, industryWeights);

        if (weight > 0) {
          weightedTotal += result.value * weight;
          totalWeight += weight;
        }
      });

      overallMateriality = totalWeight > 0 ? weightedTotal / totalWeight : benchmarkResults[0].value;
    } else {
      // Default: use average of all benchmarks
      overallMateriality =
        benchmarkResults.reduce((sum, r) => sum + r.value, 0) / benchmarkResults.length;
    }

    // Calculate performance materiality (typically 75% of overall)
    const performanceMateriality = overallMateriality * 0.75;

    // Calculate trivial threshold (typically 5% of overall)
    const trivialThreshold = overallMateriality * 0.05;

    return {
      overall_materiality: Math.round(overallMateriality),
      performance_materiality: Math.round(performanceMateriality),
      trivial_threshold: Math.round(trivialThreshold),
      basis: this._determineBasis(context, industryWeights),
      benchmark_results: benchmarkResults,
      calculation_method: "Multi-Benchmark Weighted Average",
      industry: context.industry,
      justification: this._generateJustification(
        overallMateriality,
        benchmarkResults,
        context.industry
      )
    };
  }

  /**
   * Perform sensitivity analysis
   * @param {Number} baseMateriality
   * @param {Object} tolerances - {low: %, high: %}
   * @returns {Object} Sensitivity analysis results
   */
  performSensitivityAnalysis(baseMateriality, tolerances = { low: 10, high: 20 }) {
    const scenarios = [];

    // Low tolerance scenario (-10%)
    scenarios.push({
      scenario: "Conservative (-10%)",
      materiality: Math.round(baseMateriality * 0.9),
      change: -10,
      impact:
        "Higher sample sizes required, increased audit work, more conservative conclusions"
    });

    // Base case
    scenarios.push({
      scenario: "Base Case",
      materiality: Math.round(baseMateriality),
      change: 0,
      impact: "Standard audit procedures and sample sizes"
    });

    // High tolerance scenario (+10%)
    scenarios.push({
      scenario: "Liberal (+10%)",
      materiality: Math.round(baseMateriality * 1.1),
      change: 10,
      impact: "Lower sample sizes possible, reduced audit work"
    });

    // Extreme scenarios
    scenarios.push({
      scenario: "Very Conservative (-20%)",
      materiality: Math.round(baseMateriality * 0.8),
      change: -20,
      impact: "Significant increase in audit scope and cost"
    });

    scenarios.push({
      scenario: "Very Liberal (+20%)",
      materiality: Math.round(baseMateriality * 1.2),
      change: 20,
      impact: "Significant reduction in audit scope"
    });

    return {
      base_materiality: baseMateriality,
      sensitivity_scenarios: scenarios,
      recommended_range: {
        low: Math.round(baseMateriality * 0.9),
        high: Math.round(baseMateriality * 1.1)
      }
    };
  }

  /**
   * Plan scenarios for materiality
   * @param {Object} context - Financial context
   * @returns {Object} Scenario planning results
   */
  planScenarios(context) {
    const baseMat = this.calculateBaseMateriality(context);

    return {
      best_case: {
        description: "All benchmarks at upper range",
        materiality: Math.round(baseMat.overall_materiality * 1.15),
        assumptions: ["Strong profitability", "Growing revenue", "Healthy equity"],
        likelihood: "Low (20%)"
      },

      base_case: {
        description: "Standard assumptions",
        materiality: baseMat.overall_materiality,
        assumptions: [
          "Stable profitability",
          "Consistent revenue",
          "Adequate equity base"
        ],
        likelihood: "High (60%)"
      },

      worst_case: {
        description: "Reduced profitability and growth",
        materiality: Math.round(baseMat.overall_materiality * 0.85),
        assumptions: ["Lower profitability", "Slower growth", "Tighter equity"],
        likelihood: "Medium (20%)"
      }
    };
  }

  /**
   * Get benchmark comparison for industry
   * @param {Object} context
   * @returns {Object} Industry benchmark data
   */
  benchmarkComparison(context) {
    const baseMat = this.calculateBaseMateriality(context);
    const industryBench = this.industryBenchmarks[context.industry];

    if (!industryBench) {
      return {
        message: "No industry benchmarks available",
        calculated_materiality: baseMat.overall_materiality
      };
    }

    return {
      your_materiality: baseMat.overall_materiality,
      industry_standard: this._getIndustryStandard(context),
      variance_percentage: this._calculateVariance(
        baseMat.overall_materiality,
        this._getIndustryStandard(context)
      ),
      assessment: this._assessMaterialityReason(
        baseMat,
        context.industry
      ),
      industry_median: this._estimateIndustryMedian(context)
    };
  }

  /**
   * Calculate sample size based on materiality
   * @param {Object} context
   * @returns {Object} Sample size recommendation
   */
  calculateSampleSize(context) {
    const materiality = this.calculateBaseMateriality(context);

    // Using statistical sampling formulas
    const populationSize = context.populationSize || 1000;
    const riskOfIncorrectAcceptance = 0.05; // 5%
    const tolerable = materiality.overall_materiality;

    // Sample size = (z-score² × population variance) / (tolerable error)²
    const zScore = 1.96; // 95% confidence level

    // Estimate sample size
    let sampleSize = Math.ceil(
      (zScore * zScore * populationSize) / (tolerable * populationSize)
    );

    sampleSize = Math.min(sampleSize, populationSize);
    sampleSize = Math.max(sampleSize, 25); // Minimum 25 samples

    return {
      recommended_sample_size: sampleSize,
      sample_percentage: Math.round((sampleSize / populationSize) * 100),
      confidence_level: "95%",
      materiality_basis: materiality.basis,
      methodology: "Statistical Sampling with Materiality Threshold"
    };
  }

  /**
   * Generate audit documentation
   * @param {Object} context
   * @returns {Object} Audit documentation
   */
  generateAuditDocumentation(context) {
    const materiality = this.calculateBaseMateriality(context);
    const sensitivity = this.performSensitivityAnalysis(materiality.overall_materiality);
    const scenarios = this.planScenarios(context);
    const sampleSize = this.calculateSampleSize(context);

    return {
      section: "Audit Documentation - Materiality Assessment",
      engagement_name: context.entityName,
      year_end: context.financialYearEnd,
      prepared_by: context.preparedBy || "Audit Team",
      approval_status: "For Review",

      calculation_summary: {
        overall_materiality: materiality.overall_materiality,
        performance_materiality: materiality.performance_materiality,
        trivial_threshold: materiality.trivial_threshold,
        basis: materiality.basis,
        justification: materiality.justification
      },

      sensitivity_analysis: sensitivity.sensitivity_scenarios,
      scenario_planning: scenarios,
      sample_size_recommendation: sampleSize,

      audit_implications: {
        scope_impact: this._describeAuditScope(materiality.overall_materiality),
        procedure_impact: this._describeProcedureImpact(materiality.overall_materiality),
        risk_consideration: this._describeRiskConsideration(context)
      },

      approval_section: {
        manager_review: "Pending",
        partner_approval: "Pending",
        date_approved: null
      }
    };
  }

  /**
   * Get weight for basis
   * @private
   */
  _getWeightForBasis(basis, weights) {
    const mapping = {
      profit: "profit",
      revenue: "revenue",
      assets: "assets",
      equity: "equity"
    };

    return weights[mapping[basis]] || 0;
  }

  /**
   * Determine materiality basis
   * @private
   */
  _determineBasis(context, industryWeights) {
    if (!industryWeights) {
      return "Multiple Benchmarks (Average)";
    }

    return `Industry-Weighted: ${industryWeights.primary} (${Math.round(
      industryWeights.weights[industryWeights.primary] * 100
    )}%)`;
  }

  /**
   * Generate justification
   * @private
   */
  _generateJustification(materiality, benchmarks, industry) {
    return `Overall materiality of $${Math.round(
      materiality
    )} has been determined based on ${benchmarks.length} key benchmarks for ${industry || "the entity"
    } and represents a reasonable threshold for audit planning and evaluation.`;
  }

  /**
   * Get industry standard
   * @private
   */
  _getIndustryStandard(context) {
    // Estimated industry standards
    const standards = {
      Manufacturing: 50000,
      SaaS: 40000,
      Retail: 30000,
      Banking: 100000
    };

    return standards[context.industry] || 50000;
  }

  /**
   * Calculate variance
   * @private
   */
  _calculateVariance(yourValue, industryValue) {
    const variance = ((yourValue - industryValue) / industryValue) * 100;
    return Math.round(variance);
  }

  /**
   * Assess materiality
   * @private
   */
  _assessMaterialityReason(materiality, industry) {
    const variance = this._calculateVariance(
      materiality.overall_materiality,
      this._getIndustryStandard({ industry })
    );

    if (variance > 20) {
      return `Materiality is ${variance}% above industry average, likely due to higher profitability or scale.`;
    }
    if (variance < -20) {
      return `Materiality is ${Math.abs(variance)}% below industry average, likely due to lower profitability or scale.`;
    }
    return `Materiality is within normal range for ${industry} industry.`;
  }

  /**
   * Estimate industry median
   * @private
   */
  _estimateIndustryMedian(context) {
    // Returns estimated median for industry
    const medians = {
      Manufacturing: 45000,
      SaaS: 38000,
      Retail: 28000,
      Banking: 95000
    };

    return medians[context.industry] || 40000;
  }

  /**
   * Describe audit scope
   * @private
   */
  _describeAuditScope(materiality) {
    if (materiality > 75000) return "Focused scope on high-risk areas";
    if (materiality > 50000) return "Standard audit scope";
    return "Expanded scope with additional procedures";
  }

  /**
   * Describe procedure impact
   * @private
   */
  _describeProcedureImpact(materiality) {
    if (materiality > 75000) return "Reduced sample sizes, focused procedures";
    if (materiality > 50000) return "Standard sample sizes and procedures";
    return "Increased sample sizes, expanded procedures";
  }

  /**
   * Describe risk consideration
   * @private
   */
  _describeRiskConsideration(context) {
    return `Risk assessment: ${context.riskLevel || "Medium"}. Materiality has been set considering identified risks and control environment.`;
  }
}

export default MaterialityEngine;
