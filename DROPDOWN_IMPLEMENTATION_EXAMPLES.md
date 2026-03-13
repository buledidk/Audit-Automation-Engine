# Dropdown System - Implementation Examples & Code Snippets

## Quick Start Examples

### Example 1: Basic Assertion Dropdown

```jsx
import React, { useState } from "react";
import { AuditDropdown } from "./components/AuditDropdown";
import dropdownLibrary from "./data/dropdownLibrary.json";

function SimpleAssertionSelector() {
  const [selectedAssertion, setSelectedAssertion] = useState(null);

  return (
    <div>
      <AuditDropdown
        label="Audit Assertion"
        options={dropdownLibrary.assertions.items}
        value={selectedAssertion}
        onChange={setSelectedAssertion}
        searchable={true}
        showDescription={true}
        placeholder="Select assertion to test..."
      />

      {selectedAssertion && (
        <div style={{ marginTop: "16px", padding: "12px", background: "#f5f5f5" }}>
          <h4>Selected: {selectedAssertion.name}</h4>
          <p>Code: {selectedAssertion.code}</p>
          <p>Risk Level: {selectedAssertion.riskLevel}</p>
          <p>Description: {selectedAssertion.description}</p>
        </div>
      )}
    </div>
  );
}

export default SimpleAssertionSelector;
```

### Example 2: Procedure Selection with Assertion Filtering

```jsx
import React, { useState, useMemo } from "react";
import { AuditDropdown } from "./components/AuditDropdown";
import dropdownLibrary from "./data/dropdownLibrary.json";

function ProcedureSelector() {
  const [selectedAssertion, setSelectedAssertion] = useState(null);
  const [selectedProcedures, setSelectedProcedures] = useState([]);

  // Get all procedures
  const allProcedures = useMemo(() => {
    return Object.values(dropdownLibrary.standardProcedures)
      .flatMap(category => category.procedures || []);
  }, []);

  // Filter procedures by selected assertion
  const filteredProcedures = useMemo(() => {
    if (!selectedAssertion) return allProcedures;

    return allProcedures.filter(proc =>
      proc.linkedAssertion?.includes(selectedAssertion.id)
    );
  }, [selectedAssertion, allProcedures]);

  return (
    <div>
      {/* Step 1: Select Assertion */}
      <AuditDropdown
        label="Step 1: Primary Assertion"
        options={dropdownLibrary.assertions.items}
        value={selectedAssertion}
        onChange={setSelectedAssertion}
        searchable={true}
      />

      {/* Step 2: Select Procedures */}
      {selectedAssertion && (
        <AuditDropdown
          label={`Step 2: Procedures for ${selectedAssertion.name}`}
          options={filteredProcedures}
          value={selectedProcedures}
          onChange={setSelectedProcedures}
          multi={true}
          searchable={true}
          showDescription={true}
        />
      )}

      {/* Summary */}
      {selectedAssertion && selectedProcedures.length > 0 && (
        <div style={{ marginTop: "20px", padding: "12px", background: "#e3f2fd" }}>
          <h4>Configuration Summary</h4>
          <p>Assertion: {selectedAssertion.name}</p>
          <p>Procedures Selected: {selectedProcedures.length}</p>
          <p>Total Estimated Time: {calculateTotalTime(selectedProcedures)}</p>
        </div>
      )}
    </div>
  );
}

function calculateTotalTime(procedures) {
  // Parse times like "4-8 hours" and sum
  const total = procedures.reduce((sum, proc) => {
    const match = proc.estimatedTime.match(/(\d+)-(\d+)/);
    return sum + (match ? parseInt(match[2]) : 0);
  }, 0);
  return `${total} hours`;
}

export default ProcedureSelector;
```

### Example 3: Quick-Fill Template Application

```jsx
import React, { useState } from "react";
import { AuditDropdown } from "./components/AuditDropdown";
import dropdownLibrary from "./data/dropdownLibrary.json";
import quickFillTemplates from "./data/quickFillTemplates.json";

function TemplateBasedWorkingPaper() {
  const [accountType, setAccountType] = useState("revenue");
  const [configuration, setConfiguration] = useState({
    assertions: [],
    procedures: [],
    riskLevel: null,
    sampleSize: 0
  });

  const accountOptions = [
    { id: "revenue", name: "Revenue (D3)" },
    { id: "inventory", name: "Inventory (D4)" },
    { id: "fixedAssets", name: "Fixed Assets (D5)" },
    { id: "payables", name: "Payables (D6)" },
    { id: "cash", name: "Cash (D11)" },
    { id: "provisions", name: "Provisions (D9)" },
    { id: "payroll", name: "Payroll (D7)" }
  ];

  const handleApplyTemplate = () => {
    const templateKey = quickFillTemplates.accountTypeMapping[accountType];
    if (!templateKey) return;

    const template = quickFillTemplates.templates[templateKey];

    // Map assertion IDs to assertion objects
    const assertions = template.assertions
      .map(id => dropdownLibrary.assertions.items.find(a => a.id === id))
      .filter(Boolean);

    // Get procedures
    const allProcs = Object.values(dropdownLibrary.standardProcedures)
      .flatMap(cat => cat.procedures);
    const procedures = template.standardProcedures
      .map(id => allProcs.find(p => p.id === id))
      .filter(Boolean);

    // Get risk level
    const riskLevel = dropdownLibrary.riskLevels.find(r => r.name === template.riskLevel);

    setConfiguration({
      assertions,
      procedures,
      riskLevel,
      sampleSize: template.suggestedSampleSize.suggested,
      materialitySignificance: template.materialitySignificance,
      disclosureChecks: template.disclosureChecks
    });
  };

  return (
    <div>
      <h3>Apply Working Paper Template</h3>

      {/* Account Type Selection */}
      <AuditDropdown
        label="Select Account Type"
        options={accountOptions}
        value={accountOptions.find(a => a.id === accountType) || null}
        onChange={(opt) => setAccountType(opt.id)}
        searchable={true}
      />

      {/* Apply Button */}
      <button
        onClick={handleApplyTemplate}
        style={{
          marginTop: "12px",
          padding: "10px 20px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Apply Template
      </button>

      {/* Configuration Display */}
      {configuration.assertions.length > 0 && (
        <div style={{ marginTop: "20px", padding: "16px", background: "#f5f5f5" }}>
          <h4>Applied Configuration</h4>
          <div>
            <p><strong>Assertions:</strong> {configuration.assertions.map(a => a.name).join(", ")}</p>
            <p><strong>Procedures:</strong> {configuration.procedures.length} items</p>
            <p><strong>Risk Level:</strong> {configuration.riskLevel?.name}</p>
            <p><strong>Suggested Sample Size:</strong> {configuration.sampleSize}</p>
            <p><strong>Materiality:</strong> {configuration.materialitySignificance}</p>
            <div>
              <strong>Disclosure Checks:</strong>
              <ul>
                {configuration.disclosureChecks.map((check, i) => (
                  <li key={i}>{check}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateBasedWorkingPaper;
```

### Example 4: Sample Size Calculation Integration

```jsx
import React, { useState } from "react";
import { AuditDropdown } from "./components/AuditDropdown";
import { SampleSizeSuggestion } from "./components/SampleSizeSuggestion";
import dropdownLibrary from "./data/dropdownLibrary.json";

function SampleSizeConfigurator() {
  const [config, setConfig] = useState({
    riskLevel: "Medium",
    populationSize: 1000,
    accountType: "revenue",
    showCalculator: false
  });

  const riskLevels = dropdownLibrary.riskLevels;
  const accountTypes = [
    { id: "revenue", name: "Revenue" },
    { id: "inventory", name: "Inventory" },
    { id: "fixedAssets", name: "Fixed Assets" },
    { id: "cash", name: "Cash" }
  ];

  return (
    <div>
      <h3>Sample Size Calculator</h3>

      {/* Risk Level */}
      <AuditDropdown
        label="Risk Level"
        options={riskLevels}
        value={riskLevels.find(r => r.name === config.riskLevel) || null}
        onChange={(r) => setConfig({ ...config, riskLevel: r.name })}
      />

      {/* Population Size */}
      <div style={{ marginTop: "12px" }}>
        <label>Population Size</label>
        <input
          type="number"
          value={config.populationSize}
          onChange={(e) => setConfig({ ...config, populationSize: parseInt(e.target.value) })}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
      </div>

      {/* Account Type */}
      <AuditDropdown
        label="Account Type"
        options={accountTypes}
        value={accountTypes.find(a => a.id === config.accountType) || null}
        onChange={(a) => setConfig({ ...config, accountType: a.id })}
      />

      {/* Show Calculator */}
      <button
        onClick={() => setConfig({ ...config, showCalculator: !config.showCalculator })}
        style={{
          marginTop: "12px",
          padding: "10px 20px",
          background: config.showCalculator ? "#d32f2f" : "#388e3c",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        {config.showCalculator ? "Hide" : "Show"} Sample Sizes
      </button>

      {/* Sample Size Suggestions */}
      {config.showCalculator && (
        <SampleSizeSuggestion
          riskLevel={config.riskLevel}
          populationSize={config.populationSize}
          populationValue={1000000}
          overallMateriality={50000}
          performanceMateriality={37500}
          accountType={config.accountType}
        />
      )}
    </div>
  );
}

export default SampleSizeConfigurator;
```

### Example 5: Exception/Finding Documentation

```jsx
import React, { useState } from "react";
import { AuditDropdown } from "./components/AuditDropdown";
import dropdownLibrary from "./data/dropdownLibrary.json";

function ExceptionDocumenter() {
  const [finding, setFinding] = useState({
    exceptionType: null,
    severity: null,
    amount: 0,
    description: "",
    resolution: null,
    evidenceFiles: []
  });

  const [findings, setFindings] = useState([]);

  const handleAddFinding = () => {
    if (!finding.exceptionType || !finding.severity) {
      alert("Please select exception type and severity");
      return;
    }

    const newFinding = {
      id: `finding_${Date.now()}`,
      ...finding,
      dateAdded: new Date().toISOString()
    };

    setFindings([...findings, newFinding]);
    setFinding({
      exceptionType: null,
      severity: null,
      amount: 0,
      description: "",
      resolution: null,
      evidenceFiles: []
    });
  };

  return (
    <div>
      <h3>Document Findings & Exceptions</h3>

      {/* Exception Type */}
      <AuditDropdown
        label="Exception Type"
        options={dropdownLibrary.exceptionTypes}
        value={finding.exceptionType}
        onChange={(e) => setFinding({ ...finding, exceptionType: e })}
        showDescription={true}
      />

      {/* Severity Level */}
      <AuditDropdown
        label="Severity Level"
        options={dropdownLibrary.severityLevels}
        value={finding.severity}
        onChange={(s) => setFinding({ ...finding, severity: s })}
      />

      {/* Amount */}
      <div style={{ marginTop: "12px" }}>
        <label>Exception Amount (£)</label>
        <input
          type="number"
          value={finding.amount}
          onChange={(e) => setFinding({ ...finding, amount: parseFloat(e.target.value) })}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
      </div>

      {/* Description */}
      <div style={{ marginTop: "12px" }}>
        <label>Description</label>
        <textarea
          value={finding.description}
          onChange={(e) => setFinding({ ...finding, description: e.target.value })}
          placeholder="Describe the exception..."
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            minHeight: "80px"
          }}
        />
      </div>

      {/* Resolution Option */}
      <AuditDropdown
        label="Resolution Option"
        options={dropdownLibrary.resolutionOptions}
        value={finding.resolution}
        onChange={(r) => setFinding({ ...finding, resolution: r })}
      />

      {/* Add Button */}
      <button
        onClick={handleAddFinding}
        style={{
          marginTop: "16px",
          padding: "10px 20px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Add Finding
      </button>

      {/* Findings List */}
      {findings.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h4>Documented Findings ({findings.length})</h4>
          {findings.map(f => (
            <div
              key={f.id}
              style={{
                padding: "12px",
                marginBottom: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                background: "#fafafa"
              }}
            >
              <p><strong>Type:</strong> {f.exceptionType.name}</p>
              <p><strong>Severity:</strong> {f.severity.name}</p>
              <p><strong>Amount:</strong> £{f.amount.toLocaleString()}</p>
              <p><strong>Resolution:</strong> {f.resolution?.name || "—"}</p>
              <p><strong>Notes:</strong> {f.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExceptionDocumenter;
```

### Example 6: Multi-Select Evidence Collection

```jsx
import React, { useState } from "react";
import { AuditDropdown } from "./components/AuditDropdown";
import dropdownLibrary from "./data/dropdownLibrary.json";

function EvidenceCollector() {
  const [selectedEvidence, setSelectedEvidence] = useState([]);
  const [evidenceNotes, setEvidenceNotes] = useState({});

  const handleAddNote = (evidenceId, note) => {
    setEvidenceNotes({
      ...evidenceNotes,
      [evidenceId]: note
    });
  };

  const totalReliability = () => {
    if (selectedEvidence.length === 0) return 0;
    const reliabilityMap = {
      "High": 3,
      "Medium": 2,
      "Low": 1
    };
    const total = selectedEvidence.reduce((sum, ev) => {
      return sum + (reliabilityMap[ev.reliability] || 0);
    }, 0);
    return (total / (selectedEvidence.length * 3) * 100).toFixed(0);
  };

  return (
    <div>
      <h3>Collect Audit Evidence</h3>

      {/* Evidence Selection */}
      <AuditDropdown
        label="Evidence Types Collected"
        options={dropdownLibrary.evidenceTypes}
        value={selectedEvidence}
        onChange={setSelectedEvidence}
        multi={true}
        searchable={true}
        showDescription={true}
      />

      {/* Evidence Details */}
      {selectedEvidence.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Evidence Details</h4>
          <div style={{
            background: "#f5f5f5",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "12px"
          }}>
            <p><strong>Evidence Quality Score:</strong> {totalReliability()}%</p>
          </div>

          {selectedEvidence.map(evidence => (
            <div
              key={evidence.id}
              style={{
                padding: "12px",
                marginBottom: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                background: "#fff"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <strong>{evidence.name}</strong>
                <span style={{
                  padding: "2px 8px",
                  background: evidence.reliability === "High" ? "#e8f5e9" : "#fff3e0",
                  color: evidence.reliability === "High" ? "#2e7d32" : "#e65100",
                  borderRadius: "3px",
                  fontSize: "12px"
                }}>
                  {evidence.reliability} Reliability
                </span>
              </div>
              <p style={{ color: "#666", fontSize: "12px", margin: "0 0 8px 0" }}>
                {evidence.description}
              </p>
              <textarea
                placeholder={`Notes on ${evidence.name}...`}
                value={evidenceNotes[evidence.id] || ""}
                onChange={(e) => handleAddNote(evidence.id, e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "12px",
                  minHeight: "60px"
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Export Button */}
      {selectedEvidence.length > 0 && (
        <button
          onClick={() => {
            const report = {
              evidenceCollected: selectedEvidence.map(e => ({
                name: e.name,
                reliability: e.reliability,
                notes: evidenceNotes[e.id]
              })),
              timestamp: new Date().toISOString()
            };
            console.log("Evidence Report:", report);
            // Could export to PDF or save to database
          }}
          style={{
            marginTop: "16px",
            padding: "10px 20px",
            background: "#388e3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Export Evidence Report
        </button>
      )}
    </div>
  );
}

export default EvidenceCollector;
```

### Example 7: Custom Procedure Addition

```jsx
import React, { useState } from "react";
import { AuditDropdown } from "./components/AuditDropdown";
import dropdownLibrary from "./data/dropdownLibrary.json";

function CustomProcedureCreator() {
  const [customProcedures, setCustomProcedures] = useState([]);
  const [newProcedure, setNewProcedure] = useState({
    name: "",
    description: "",
    estimatedTime: "2-4 hours",
    linkedAssertion: null
  });

  const allProcedures = [
    ...Object.values(dropdownLibrary.standardProcedures)
      .flatMap(cat => cat.procedures),
    ...customProcedures
  ];

  const handleAddCustomProcedure = () => {
    if (!newProcedure.name) {
      alert("Please enter procedure name");
      return;
    }

    const custom = {
      id: `custom_${Date.now()}`,
      ...newProcedure,
      custom: true,
      linkedAssertion: newProcedure.linkedAssertion
        ? [newProcedure.linkedAssertion.id]
        : []
    };

    setCustomProcedures([...customProcedures, custom]);
    setNewProcedure({
      name: "",
      description: "",
      estimatedTime: "2-4 hours",
      linkedAssertion: null
    });
  };

  return (
    <div>
      <h3>Create Custom Procedures</h3>

      {/* Procedure Name */}
      <div>
        <label>Procedure Name</label>
        <input
          type="text"
          value={newProcedure.name}
          onChange={(e) => setNewProcedure({ ...newProcedure, name: e.target.value })}
          placeholder="e.g., Customer Credit Review"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
      </div>

      {/* Description */}
      <div style={{ marginTop: "12px" }}>
        <label>Description</label>
        <textarea
          value={newProcedure.description}
          onChange={(e) => setNewProcedure({ ...newProcedure, description: e.target.value })}
          placeholder="Describe what the procedure entails..."
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            minHeight: "60px"
          }}
        />
      </div>

      {/* Time Estimate */}
      <div style={{ marginTop: "12px" }}>
        <label>Estimated Time</label>
        <input
          type="text"
          value={newProcedure.estimatedTime}
          onChange={(e) => setNewProcedure({ ...newProcedure, estimatedTime: e.target.value })}
          placeholder="e.g., 4-6 hours"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
      </div>

      {/* Link to Assertion */}
      <AuditDropdown
        label="Link to Assertion"
        options={dropdownLibrary.assertions.items}
        value={newProcedure.linkedAssertion}
        onChange={(a) => setNewProcedure({ ...newProcedure, linkedAssertion: a })}
      />

      {/* Add Button */}
      <button
        onClick={handleAddCustomProcedure}
        style={{
          marginTop: "16px",
          padding: "10px 20px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Add Custom Procedure
      </button>

      {/* Custom Procedures List */}
      {customProcedures.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h4>Custom Procedures ({customProcedures.length})</h4>
          {customProcedures.map(proc => (
            <div
              key={proc.id}
              style={{
                padding: "12px",
                marginBottom: "12px",
                border: "2px solid #1976d2",
                borderRadius: "4px",
                background: "#e3f2fd"
              }}
            >
              <p><strong>{proc.name}</strong></p>
              <p style={{ color: "#666", fontSize: "12px" }}>{proc.description}</p>
              <p style={{ color: "#666", fontSize: "12px" }}>
                Time: {proc.estimatedTime} |
                {proc.linkedAssertion?.length > 0 ? ` Assertion: ${proc.linkedAssertion}` : " No assertion linked"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomProcedureCreator;
```

## Common Patterns & Workflows

### Pattern 1: Search-Filter-Select

```jsx
const [searchTerm, setSearchTerm] = useState("");
const [filterCriteria, setFilterCriteria] = useState({ riskLevel: null });
const [selected, setSelected] = useState(null);

const filtered = useMemo(() => {
  let result = options;

  // Apply search
  if (searchTerm) {
    result = result.filter(opt =>
      opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply filters
  if (filterCriteria.riskLevel) {
    result = result.filter(opt => opt.riskLevel === filterCriteria.riskLevel);
  }

  return result;
}, [options, searchTerm, filterCriteria]);

return (
  <>
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
    <select
      value={filterCriteria.riskLevel || ""}
      onChange={(e) => setFilterCriteria({ ...filterCriteria, riskLevel: e.target.value || null })}
    >
      <option value="">All Risk Levels</option>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
    <AuditDropdown
      options={filtered}
      value={selected}
      onChange={setSelected}
    />
  </>
);
```

### Pattern 2: Cascading Selection

```jsx
// Select account -> Auto-select assertion -> Filter procedures
const [account, setAccount] = useState(null);
const [assertion, setAssertion] = useState(null);
const [procedures, setProcedures] = useState([]);

// When account changes, auto-suggest assertion
useEffect(() => {
  if (account) {
    const template = getTemplate(account.id);
    const suggestedAssertion = assertions.find(a => a.id === template.assertions[0]);
    setAssertion(suggestedAssertion);
  }
}, [account]);

// When assertion changes, filter procedures
useEffect(() => {
  if (assertion) {
    const filtered = allProcedures.filter(p =>
      p.linkedAssertion.includes(assertion.id)
    );
    setProcedures(filtered);
  }
}, [assertion]);
```

### Pattern 3: Dynamic Configuration Saving

```jsx
const saveConfiguration = async () => {
  const config = {
    workingPaperId: "D3",
    timestamp: new Date().toISOString(),
    assertion: state.assertion,
    procedures: state.procedures,
    sampleSize: state.sampleSize,
    testingApproach: state.testingApproach,
    evidenceCollected: state.evidenceCollected
  };

  try {
    const response = await fetch("/api/workingpapers/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    });

    if (response.ok) {
      alert("Configuration saved successfully");
    }
  } catch (error) {
    console.error("Save failed:", error);
  }
};
```

---

**Last Updated:** March 2026
**Version:** 1.0
