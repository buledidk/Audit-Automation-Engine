import React, { useState, useMemo } from "react";
import { AuditDropdown, FilterBar } from "./AuditDropdown";
import { SampleSizeSuggestion } from "./SampleSizeSuggestion";
import dropdownLibrary from "../data/dropdownLibrary.json";
import quickFillTemplates from "../data/quickFillTemplates.json";

/**
 * WorkingPaperDropdowns - Comprehensive dropdown system for audit working papers
 * Provides assertion, procedure, methodology, and exception dropdowns
 * with auto-suggestions and quick-fill templates
 */
export function WorkingPaperDropdowns({
  accountType = "revenue",
  workingPaperId = "D3",
  engagement = {},
  onUpdate = () => {}
}) {
  const [state, setState] = useState({
    assertion: null,
    procedures: [],
    riskLevel: null,
    samplingMethodology: null,
    testingMethodology: [],
    exceptionType: null,
    evidenceCollected: [],
    findingSeverity: null,
    resolutionOption: null,
    populationSize: 1000,
    showSampleCalculator: false
  });

  const [filters, setFilters] = useState({
    riskLevel: null,
    applicableAccounts: null
  });

  // Get quick-fill template for this account
  const template = useMemo(() => {
    const templateKey = quickFillTemplates.accountTypeMapping[accountType] || null;
    if (!templateKey) return null;
    return quickFillTemplates.templates[templateKey];
  }, [accountType]);

  // Get filtered procedures based on selected assertion
  const filteredProcedures = useMemo(() => {
    if (!state.assertion) return [];

    const assertionId = state.assertion.id;
    const allProcedures = Object.values(dropdownLibrary.standardProcedures)
      .flatMap(category => category.procedures || []);

    return allProcedures.filter(proc =>
      proc.linkedAssertion?.includes(assertionId)
    );
  }, [state.assertion]);

  const handleApplyTemplate = () => {
    if (!template) return;

    setState(prev => ({
      ...prev,
      assertion: dropdownLibrary.assertions.items.find(a =>
        template.assertions.includes(a.id)
      ) || null,
      riskLevel: template.riskLevel,
      procedures: template.standardProcedures,
      populationSize: template.suggestedSampleSize.population
    }));
  };

  const handleSelectAssertion = (assertion) => {
    setState(prev => ({ ...prev, assertion }));
  };

  const handleSelectProcedure = (procedure) => {
    setState(prev => ({
      ...prev,
      procedures: prev.procedures.includes(procedure.id)
        ? prev.procedures.filter(p => p !== procedure.id)
        : [...prev.procedures, procedure.id]
    }));
  };

  const handleSelectException = (exception) => {
    setState(prev => ({ ...prev, exceptionType: exception }));
  };

  const handleSelectMethodology = (methodology) => {
    setState(prev => ({
      ...prev,
      testingMethodology: prev.testingMethodology.includes(methodology.id)
        ? prev.testingMethodology.filter(m => m !== methodology.id)
        : [...prev.testingMethodology, methodology.id]
    }));
  };

  const COLORS = {
    bg: "#0A0E17",
    sidebar: "#0F1622",
    card: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    accent: "#F5A623",
    text: "#F8F8F8",
    dim: "rgba(255,255,255,0.6)",
    faint: "rgba(255,255,255,0.3)",
    green: "#66BB6A",
    red: "#EF5350",
    orange: "#FFA726",
    blue: "#42A5F5"
  };

  return (
    <div style={{
      background: COLORS.bg,
      color: COLORS.text,
      padding: "24px",
      maxWidth: "1200px"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: COLORS.accent, marginBottom: "4px" }}>
          📋 {workingPaperId} - {accountType.toUpperCase()} Audit Procedures
        </h2>
        <p style={{ color: COLORS.dim, margin: 0, fontSize: "12px" }}>
          Configure assertions, procedures, testing methodology, and sample sizes with auto-suggestions
        </p>
      </div>

      {/* Quick Template Application */}
      {template && (
        <div style={{
          background: `${COLORS.accent}15`,
          border: `1px solid ${COLORS.accent}40`,
          borderRadius: "8px",
          padding: "14px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <p style={{ color: COLORS.accent, margin: "0 0 4px 0", fontSize: "12px", fontWeight: 700 }}>
              💡 Quick Template Available
            </p>
            <p style={{ color: COLORS.dim, margin: 0, fontSize: "11px" }}>
              {template.description}
            </p>
          </div>
          <button
            onClick={handleApplyTemplate}
            style={{
              padding: "8px 16px",
              background: COLORS.accent,
              border: "none",
              borderRadius: "6px",
              color: "#000",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            Apply Template
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "24px"
      }}>
        {/* Left Column */}
        <div>
          {/* Assertion Selection */}
          <div style={{
            background: COLORS.card,
            borderRadius: "12px",
            padding: "16px",
            border: `1px solid ${COLORS.border}`,
            marginBottom: "16px"
          }}>
            <h3 style={{ color: COLORS.text, margin: "0 0 12px 0", fontSize: "13px" }}>
              Step 1: Select Assertion
            </h3>
            <AuditDropdown
              label="Audit Assertion"
              options={dropdownLibrary.assertions.items}
              value={state.assertion}
              onChange={handleSelectAssertion}
              searchable={true}
              showDescription={true}
              placeholder="Select primary assertion to test..."
            />
            {state.assertion && (
              <div style={{
                marginTop: "12px",
                padding: "10px",
                background: COLORS.bg,
                borderRadius: "6px",
                borderLeft: `3px solid ${COLORS.blue}`,
                color: COLORS.dim,
                fontSize: "11px",
                lineHeight: 1.5
              }}>
                <strong style={{ color: COLORS.text }}>Selected:</strong> {state.assertion.name}
                <br />
                <strong style={{ color: COLORS.text }}>Risk Level:</strong> {state.assertion.riskLevel}
                <br />
                <strong style={{ color: COLORS.text }}>Applicable Accounts:</strong> {state.assertion.applicableToAccounts.join(", ")}
              </div>
            )}
          </div>

          {/* Risk Level Selection */}
          <div style={{
            background: COLORS.card,
            borderRadius: "12px",
            padding: "16px",
            border: `1px solid ${COLORS.border}`,
            marginBottom: "16px"
          }}>
            <h3 style={{ color: COLORS.text, margin: "0 0 12px 0", fontSize: "13px" }}>
              Step 2: Risk Assessment
            </h3>
            <AuditDropdown
              label="Risk Level"
              options={dropdownLibrary.riskLevels}
              value={state.riskLevel}
              onChange={(risk) => setState(prev => ({ ...prev, riskLevel: risk }))}
              placeholder="Select risk level..."
            />
            {state.riskLevel && (
              <div style={{
                marginTop: "12px",
                padding: "10px",
                background: COLORS.bg,
                borderRadius: "6px",
                borderLeft: `3px solid ${state.riskLevel.color}`,
                color: COLORS.dim,
                fontSize: "11px",
                lineHeight: 1.5
              }}>
                <strong style={{ color: COLORS.text }}>Audit Response:</strong> {state.riskLevel.description}
              </div>
            )}
          </div>

          {/* Sampling Methodology */}
          <div style={{
            background: COLORS.card,
            borderRadius: "12px",
            padding: "16px",
            border: `1px solid ${COLORS.border}`
          }}>
            <h3 style={{ color: COLORS.text, margin: "0 0 12px 0", fontSize: "13px" }}>
              Step 3: Sampling Approach
            </h3>
            <AuditDropdown
              label="Sampling Methodology"
              options={dropdownLibrary.samplingMethodologies}
              value={state.samplingMethodology}
              onChange={(method) => setState(prev => ({ ...prev, samplingMethodology: method }))}
              placeholder="Select sampling approach..."
            />
            <div style={{
              marginTop: "12px",
              display: "flex",
              gap: "8px",
              alignItems: "flex-end"
            }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: "block",
                  color: COLORS.accent,
                  fontSize: "10px",
                  fontWeight: 700,
                  marginBottom: "6px",
                  textTransform: "uppercase"
                }}>
                  Population Size
                </label>
                <input
                  type="number"
                  value={state.populationSize}
                  onChange={(e) => setState(prev => ({ ...prev, populationSize: parseInt(e.target.value) || 0 }))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "6px",
                    color: COLORS.text,
                    fontSize: "12px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
              <button
                onClick={() => setState(prev => ({ ...prev, showSampleCalculator: !prev.showSampleCalculator }))}
                style={{
                  padding: "10px 16px",
                  background: COLORS.accent + "30",
                  border: `1px solid ${COLORS.accent}`,
                  borderRadius: "6px",
                  color: COLORS.accent,
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                Calculate
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Testing Methodology */}
          <div style={{
            background: COLORS.card,
            borderRadius: "12px",
            padding: "16px",
            border: `1px solid ${COLORS.border}`,
            marginBottom: "16px"
          }}>
            <h3 style={{ color: COLORS.text, margin: "0 0 12px 0", fontSize: "13px" }}>
              Step 4: Testing Approaches (Select Multiple)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {dropdownLibrary.testingMethodologies.map(methodology => (
                <label
                  key={methodology.id}
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "8px",
                    padding: "10px",
                    background: state.testingMethodology.includes(methodology.id)
                      ? COLORS.accent + "20"
                      : "transparent",
                    borderRadius: "6px",
                    cursor: "pointer",
                    border: state.testingMethodology.includes(methodology.id)
                      ? `1px solid ${COLORS.accent}`
                      : `1px solid transparent`
                  }}
                >
                  <input
                    type="checkbox"
                    checked={state.testingMethodology.includes(methodology.id)}
                    onChange={() => handleSelectMethodology(methodology)}
                    style={{ marginTop: "2px", cursor: "pointer" }}
                  />
                  <div>
                    <p style={{ color: COLORS.text, margin: 0, fontSize: "11px", fontWeight: 700 }}>
                      {methodology.name}
                    </p>
                    <p style={{ color: COLORS.dim, margin: "2px 0 0 0", fontSize: "10px" }}>
                      {methodology.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Evidence Types */}
          <div style={{
            background: COLORS.card,
            borderRadius: "12px",
            padding: "16px",
            border: `1px solid ${COLORS.border}`
          }}>
            <h3 style={{ color: COLORS.text, margin: "0 0 12px 0", fontSize: "13px" }}>
              Step 5: Evidence Types
            </h3>
            <AuditDropdown
              label="Evidence Collected"
              options={dropdownLibrary.evidenceTypes}
              value={state.evidenceCollected}
              onChange={(evidence) => setState(prev => ({ ...prev, evidenceCollected: evidence }))}
              multi={true}
              searchable={true}
              placeholder="Select evidence types..."
            />
            {state.evidenceCollected.length > 0 && (
              <div style={{
                marginTop: "12px",
                padding: "10px",
                background: COLORS.bg,
                borderRadius: "6px",
                color: COLORS.dim,
                fontSize: "11px"
              }}>
                <strong style={{ color: COLORS.text }}>Selected Evidence:</strong>
                <div style={{ marginTop: "6px" }}>
                  {state.evidenceCollected.map(ev => (
                    <div key={ev.id} style={{ marginBottom: "4px" }}>
                      • {ev.name} ({ev.reliability} reliability)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Procedures Selection */}
      <div style={{
        background: COLORS.card,
        borderRadius: "12px",
        padding: "16px",
        border: `1px solid ${COLORS.border}`,
        marginBottom: "24px"
      }}>
        <h3 style={{ color: COLORS.text, margin: "0 0 12px 0", fontSize: "13px" }}>
          Step 6: Audit Procedures
        </h3>
        <p style={{ color: COLORS.dim, margin: "0 0 12px 0", fontSize: "11px" }}>
          {state.assertion
            ? `Procedures linked to "${state.assertion.name}" assertion`
            : "Select an assertion to see linked procedures"}
        </p>

        {filteredProcedures.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "12px"
          }}>
            {filteredProcedures.map(proc => (
              <label
                key={proc.id}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "12px",
                  background: COLORS.bg,
                  borderRadius: "6px",
                  border: state.procedures.includes(proc.id)
                    ? `1px solid ${COLORS.accent}`
                    : `1px solid ${COLORS.border}`,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <input
                  type="checkbox"
                  checked={state.procedures.includes(proc.id)}
                  onChange={() => handleSelectProcedure(proc)}
                  style={{ marginTop: "2px", cursor: "pointer" }}
                />
                <div>
                  <p style={{ color: COLORS.text, margin: 0, fontSize: "11px", fontWeight: 700 }}>
                    {proc.name}
                  </p>
                  <p style={{ color: COLORS.dim, margin: "2px 0 0 0", fontSize: "10px" }}>
                    {proc.description}
                  </p>
                  <div style={{ marginTop: "4px", display: "flex", gap: "8px" }}>
                    <span style={{
                      padding: "2px 6px",
                      background: proc.riskLevel === "High"
                        ? "rgba(239,83,80,0.2)"
                        : "rgba(255,167,38,0.2)",
                      color: proc.riskLevel === "High" ? COLORS.red : COLORS.orange,
                      fontSize: "9px",
                      borderRadius: "3px"
                    }}>
                      {proc.riskLevel} Risk
                    </span>
                    <span style={{
                      padding: "2px 6px",
                      background: "rgba(102,187,106,0.2)",
                      color: COLORS.green,
                      fontSize: "9px",
                      borderRadius: "3px"
                    }}>
                      {proc.estimatedTime}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div style={{
            padding: "16px",
            background: COLORS.bg,
            borderRadius: "6px",
            color: COLORS.dim,
            fontSize: "11px",
            textAlign: "center"
          }}>
            No procedures available. Select an assertion to see related procedures.
          </div>
        )}
      </div>

      {/* Sample Size Calculator */}
      {state.showSampleCalculator && state.riskLevel && (
        <div style={{ marginBottom: "24px" }}>
          <SampleSizeSuggestion
            riskLevel={state.riskLevel.name}
            populationSize={state.populationSize}
            populationValue={engagement.materiality?.overall || 1000000}
            overallMateriality={engagement.materiality?.overall || 50000}
            performanceMateriality={engagement.materiality?.performance || 37500}
            accountType={accountType}
            testingMethodology={state.samplingMethodology?.id}
          />
        </div>
      )}

      {/* Exception/Finding Section */}
      <div style={{
        background: COLORS.card,
        borderRadius: "12px",
        padding: "16px",
        border: `1px solid ${COLORS.border}`,
        marginBottom: "24px"
      }}>
        <h3 style={{ color: COLORS.text, margin: "0 0 12px 0", fontSize: "13px" }}>
          Step 7: Exception Handling (If Issues Found)
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px"
        }}>
          <AuditDropdown
            label="Exception Type"
            options={dropdownLibrary.exceptionTypes}
            value={state.exceptionType}
            onChange={handleSelectException}
            placeholder="Select exception..."
          />
          <AuditDropdown
            label="Severity Level"
            options={dropdownLibrary.severityLevels}
            value={state.findingSeverity}
            onChange={(severity) => setState(prev => ({ ...prev, findingSeverity: severity }))}
            placeholder="Select severity..."
          />
          <AuditDropdown
            label="Resolution Option"
            options={dropdownLibrary.resolutionOptions}
            value={state.resolutionOption}
            onChange={(resolution) => setState(prev => ({ ...prev, resolutionOption: resolution }))}
            placeholder="Select resolution..."
          />
        </div>
      </div>

      {/* Summary Panel */}
      <div style={{
        background: COLORS.card,
        borderRadius: "12px",
        padding: "16px",
        border: `1px solid ${COLORS.border}`
      }}>
        <h3 style={{ color: COLORS.text, margin: "0 0 12px 0", fontSize: "13px" }}>
          Working Paper Configuration Summary
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px"
        }}>
          <div style={{ background: COLORS.bg, padding: "12px", borderRadius: "6px" }}>
            <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "9px", fontWeight: 700 }}>ASSERTION</p>
            <p style={{ color: COLORS.text, margin: 0, fontSize: "11px", fontWeight: 700 }}>
              {state.assertion?.code || "—"}
            </p>
          </div>
          <div style={{ background: COLORS.bg, padding: "12px", borderRadius: "6px" }}>
            <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "9px", fontWeight: 700 }}>RISK LEVEL</p>
            <p style={{ color: state.riskLevel?.color || COLORS.text, margin: 0, fontSize: "11px", fontWeight: 700 }}>
              {state.riskLevel?.name || "—"}
            </p>
          </div>
          <div style={{ background: COLORS.bg, padding: "12px", borderRadius: "6px" }}>
            <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "9px", fontWeight: 700 }}>PROCEDURES</p>
            <p style={{ color: COLORS.text, margin: 0, fontSize: "11px", fontWeight: 700 }}>
              {state.procedures.length} selected
            </p>
          </div>
          <div style={{ background: COLORS.bg, padding: "12px", borderRadius: "6px" }}>
            <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "9px", fontWeight: 700 }}>EVIDENCE</p>
            <p style={{ color: COLORS.text, margin: 0, fontSize: "11px", fontWeight: 700 }}>
              {state.evidenceCollected.length} types
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
