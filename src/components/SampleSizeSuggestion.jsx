import React, { useMemo } from "react";

/**
 * Sample Size Suggestion Engine
 * Calculates suggested sample sizes based on:
 * - Risk level (High/Medium/Low)
 * - Population size
 * - Materiality threshold
 * - Industry standards
 * - Audit strategy
 */
export function SampleSizeSuggestion({
  riskLevel = "Medium",
  populationSize = 1000,
  populationValue = 1000000,
  overallMateriality = 50000,
  performanceMateriality = 37500,
  testingMethodology = "statistical",
  accountType = "revenue"
}) {
  const calculations = useMemo(() => {
    // Risk adjustment factors
    const riskFactors = {
      High: { detectionRisk: 0.25, multiplier: 3.0, confidence: 0.97 },
      Medium: { detectionRisk: 0.50, multiplier: 2.0, confidence: 0.90 },
      Low: { detectionRisk: 0.75, multiplier: 1.0, confidence: 0.68 }
    };

    const risk = riskFactors[riskLevel] || riskFactors.Medium;

    // Account-specific factors
    const accountFactors = {
      revenue: { multiplier: 1.2, minSample: 30 },
      receivables: { multiplier: 1.3, minSample: 25 },
      inventory: { multiplier: 1.2, minSample: 35 },
      fixedAssets: { multiplier: 1.0, minSample: 20 },
      payables: { multiplier: 0.9, minSample: 15 },
      cash: { multiplier: 0.8, minSample: 10 },
      provisions: { multiplier: 1.4, minSample: 40 },
      payroll: { multiplier: 1.1, minSample: 25 }
    };

    const accountFactor = accountFactors[accountType] || accountFactors.revenue;

    // Statistical formula for sample size
    // n = (Z² × p(1-p)) / E²
    // Where: Z = confidence level, p = expected error rate, E = acceptable error
    const zScores = {
      0.68: 1.0,
      0.90: 1.645,
      0.97: 2.17
    };

    const zScore = zScores[risk.confidence] || 1.96;
    const expectedErrorRate = riskLevel === "High" ? 0.05 : riskLevel === "Medium" ? 0.02 : 0.01;
    const acceptableError = overallMateriality / populationValue;

    // Base statistical sample
    let statisticalSample = Math.round(
      (zScore * zScore * expectedErrorRate * (1 - expectedErrorRate)) / (acceptableError * acceptableError)
    );

    // Apply risk multiplier
    statisticalSample = Math.round(statisticalSample * risk.multiplier * accountFactor.multiplier);

    // Apply population adjustment (smaller populations may need higher sampling percentages)
    let populationAdjustment = 1.0;
    if (populationSize < 100) {
      populationAdjustment = Math.min(populationSize * 0.8, statisticalSample) / statisticalSample;
    }
    statisticalSample = Math.round(statisticalSample * populationAdjustment);

    // Ensure minimum sample size
    statisticalSample = Math.max(statisticalSample, accountFactor.minSample);

    // Judgmental sample (typically higher, more conservative)
    const judgmentalSample = Math.round(statisticalSample * 1.3);

    // Stratified sampling (often more efficient)
    const stratifiedSample = Math.round(statisticalSample * 0.75);

    // 100% testing recommendation
    const recommend100Percent = riskLevel === "High" && populationSize < 50;

    // Sampling percentage
    const samplingPercentage = ((statisticalSample / populationSize) * 100).toFixed(1);
    const stratifiedPercentage = ((stratifiedSample / populationSize) * 100).toFixed(1);

    return {
      statistical: {
        sample: statisticalSample,
        percentage: samplingPercentage,
        confidence: `${(risk.confidence * 100).toFixed(0)}%`,
        methodology: "Statistical Sampling",
        description: "Random selection using statistical formulas",
        appropriate: true
      },
      judgmental: {
        sample: judgmentalSample,
        percentage: ((judgmentalSample / populationSize) * 100).toFixed(1),
        confidence: "Judgmental basis",
        methodology: "Judgmental Sampling",
        description: "Auditor judgment to select high-risk items",
        appropriate: riskLevel === "High"
      },
      stratified: {
        sample: stratifiedSample,
        percentage: stratifiedPercentage,
        confidence: `${(risk.confidence * 100).toFixed(0)}%`,
        methodology: "Stratified Sampling",
        description: "Population divided by value/risk, samples from each stratum",
        appropriate: true
      },
      hundred: {
        sample: populationSize,
        percentage: "100%",
        confidence: "100%",
        methodology: "100% Testing",
        description: "Examination of all items in population",
        appropriate: recommend100Percent || populationSize < 25,
        reason: recommend100Percent ? "High risk + small population" : populationSize < 25 ? "Very small population" : ""
      },
      recommendation: {
        primary: stratifiedSample,
        secondary: statisticalSample,
        alternative: judgmentalSample,
        reason: stratifiedSample < statisticalSample
          ? "Stratified approach is more efficient for this account type"
          : "Statistical approach provides good defensibility"
      }
    };
  }, [riskLevel, populationSize, populationValue, overallMateriality, performanceMateriality, testingMethodology, accountType]);

  const COLORS = {
    bg: "#0A0E17",
    border: "rgba(255,255,255,0.08)",
    text: "#F8F8F8",
    dim: "rgba(255,255,255,0.6)",
    accent: "#F5A623",
    card: "rgba(255,255,255,0.04)",
    green: "#66BB6A",
    red: "#EF5350",
    orange: "#FFA726"
  };

  const getRiskColor = (risk) => {
    return risk === "High" ? COLORS.red : risk === "Medium" ? COLORS.orange : COLORS.green;
  };

  const SampleMethodCard = ({ title, data, isRecommended = false }) => (
    <div style={{
      background: isRecommended ? `${COLORS.accent}15` : COLORS.card,
      border: `1px solid ${isRecommended ? `${COLORS.accent}40` : COLORS.border}`,
      borderLeft: `4px solid ${isRecommended ? COLORS.accent : COLORS.dim}`,
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "12px"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        marginBottom: "8px"
      }}>
        <div>
          <h4 style={{
            color: isRecommended ? COLORS.accent : COLORS.text,
            margin: "0 0 4px 0",
            fontSize: "13px",
            fontWeight: 700
          }}>
            {title}
            {isRecommended && " ✓"}
          </h4>
          <p style={{
            color: COLORS.dim,
            margin: "0 0 8px 0",
            fontSize: "11px"
          }}>
            {data.description}
          </p>
        </div>
        {!data.appropriate && (
          <span style={{
            padding: "4px 8px",
            background: "rgba(255,167,38,0.2)",
            color: COLORS.orange,
            borderRadius: "4px",
            fontSize: "9px",
            fontWeight: 600,
            whiteSpace: "nowrap"
          }}>
            NOT RECOMMENDED
          </span>
        )}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px"
      }}>
        <div>
          <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "9px", fontWeight: 700 }}>
            SAMPLE SIZE
          </p>
          <p style={{
            color: isRecommended ? COLORS.accent : COLORS.text,
            margin: 0,
            fontSize: "18px",
            fontWeight: 700
          }}>
            {data.sample}
          </p>
          <p style={{ color: COLORS.dim, margin: "4px 0 0 0", fontSize: "10px" }}>
            {data.percentage}% of population
          </p>
        </div>

        <div>
          <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "9px", fontWeight: 700 }}>
            CONFIDENCE
          </p>
          <p style={{
            color: isRecommended ? COLORS.accent : COLORS.text,
            margin: 0,
            fontSize: "14px",
            fontWeight: 700
          }}>
            {data.confidence}
          </p>
        </div>

        <div>
          <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "9px", fontWeight: 700 }}>
            METHODOLOGY
          </p>
          <p style={{
            color: COLORS.text,
            margin: 0,
            fontSize: "11px"
          }}>
            {data.methodology}
          </p>
        </div>
      </div>

      {data.reason && (
        <div style={{
          marginTop: "8px",
          padding: "8px",
          background: "rgba(245,166,35,0.05)",
          borderRadius: "4px",
          borderLeft: `2px solid ${COLORS.accent}`,
          color: COLORS.dim,
          fontSize: "10px"
        }}>
          📌 {data.reason}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{
        background: COLORS.card,
        borderRadius: "12px",
        padding: "20px",
        border: `1px solid ${COLORS.border}`
      }}>
        {/* Summary Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: `1px solid ${COLORS.border}`
        }}>
          <div>
            <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "9px", fontWeight: 700 }}>
              RISK LEVEL
            </p>
            <p style={{
              color: getRiskColor(riskLevel),
              margin: 0,
              fontSize: "14px",
              fontWeight: 700
            }}>
              {riskLevel}
            </p>
          </div>
          <div>
            <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "9px", fontWeight: 700 }}>
              POPULATION
            </p>
            <p style={{
              color: COLORS.text,
              margin: 0,
              fontSize: "14px",
              fontWeight: 700
            }}>
              {populationSize.toLocaleString()}
            </p>
          </div>
          <div>
            <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "9px", fontWeight: 700 }}>
              MATERIALITY
            </p>
            <p style={{
              color: COLORS.text,
              margin: 0,
              fontSize: "14px",
              fontWeight: 700
            }}>
              £{(overallMateriality / 1000).toFixed(0)}k
            </p>
          </div>
          <div>
            <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "9px", fontWeight: 700 }}>
              ACCOUNT TYPE
            </p>
            <p style={{
              color: COLORS.text,
              margin: 0,
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "capitalize"
            }}>
              {accountType}
            </p>
          </div>
        </div>

        {/* Recommendation Alert */}
        <div style={{
          background: `${COLORS.accent}10`,
          border: `1px solid ${COLORS.accent}40`,
          borderRadius: "6px",
          padding: "12px",
          marginBottom: "16px"
        }}>
          <p style={{
            color: COLORS.accent,
            margin: 0,
            fontSize: "11px",
            fontWeight: 600,
            lineHeight: 1.5
          }}>
            💡 <strong>Recommendation:</strong> Use {calculations.recommendation.primary} items
            ({((calculations.recommendation.primary / populationSize) * 100).toFixed(1)}%) with {calculations.recommendation.primary < 100 ? "stratified" : "100%"} testing approach. {calculations.recommendation.reason}
          </p>
        </div>

        {/* Sample Size Options */}
        <h4 style={{
          color: COLORS.text,
          margin: "0 0 12px 0",
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase"
        }}>
          Sample Size Options
        </h4>

        {calculations.hundred.appropriate && (
          <SampleMethodCard
            title="100% Testing (Recommended for small populations)"
            data={calculations.hundred}
            isRecommended={calculations.hundred.appropriate && calculations.hundred.sample < 100}
          />
        )}

        <SampleMethodCard
          title="Stratified Sampling"
          data={calculations.stratified}
          isRecommended={!calculations.hundred.appropriate && calculations.recommendation.primary === calculations.stratified.sample}
        />

        <SampleMethodCard
          title="Statistical Sampling"
          data={calculations.statistical}
          isRecommended={!calculations.hundred.appropriate && calculations.recommendation.primary === calculations.statistical.sample}
        />

        <SampleMethodCard
          title="Judgmental Sampling"
          data={calculations.judgmental}
          isRecommended={false}
        />

        {/* Additional Guidance */}
        <div style={{
          marginTop: "16px",
          padding: "12px",
          background: "rgba(102,187,106,0.05)",
          borderLeft: `3px solid #66BB6A`,
          borderRadius: "4px"
        }}>
          <p style={{
            color: COLORS.dim,
            margin: 0,
            fontSize: "10px",
            lineHeight: 1.6
          }}>
            <strong style={{ color: "#66BB6A" }}>Sample Size Guidance:</strong> The above recommendations are based on ISA 530 statistical sampling principles
            and industry best practices. Consider stratifying by value (testing 100% of items >performance materiality),
            selecting unusual/related-party items, and using prior-period knowledge of problem areas.
          </p>
        </div>
      </div>
    </div>
  );
}
