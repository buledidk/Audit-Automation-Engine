# Frontend API Integration Guide

## Overview
All frontend components use the centralized `apiClient.js` service to communicate with backend APIs. This ensures consistent error handling, authentication, and data transformation.

## API Client Usage

### Authentication
```jsx
import * as apiClient from "../services/apiClient";

// Login
const { token, user } = await apiClient.auth.login(email, password);
localStorage.setItem("token", token);

// Get current user
const user = await apiClient.auth.getCurrentUser();
```

### Engagements
```jsx
// Create engagement
const result = await apiClient.engagements.create({
  entity_id: "ABC Corp",
  engagement_type: "full_audit",
  framework_code: "FRS102",
  financial_year_end: "2024-12-31",
  estimated_budget_hours: 160
});

// Get engagement by ID
const engagement = await apiClient.engagements.getById(1);

// List all engagements
const { engagements } = await apiClient.engagements.list({
  status: "fieldwork",
  limit: 20
});

// Update engagement status
await apiClient.engagements.updateStatus(1, "completed");
```

### Materiality
```jsx
// Get materiality calculations for engagement
const mat = await apiClient.materiality.calculate(engagementId);
```

### Procedures
```jsx
// Get procedures for engagement
const procs = await apiClient.procedures.list(engagementId);

// Update procedure
await apiClient.procedures.update(procedureId, {
  status: "completed",
  completion_percentage: 100
});
```

### Evidence
```jsx
// Upload evidence file
const formData = new FormData();
formData.append("file", file);
formData.append("procedure_id", 1);
formData.append("evidence_type", "invoice");

const evidence = await apiClient.evidence.upload(engagementId, formData);

// Review evidence
await apiClient.evidence.review(evidenceId, {
  review_status: "accepted",
  review_notes: "Evidence satisfactory"
});
```

### Findings
```jsx
// Get findings for engagement
const findings = await apiClient.findings.list(engagementId);

// Create finding
const finding = await apiClient.findings.create(engagementId, {
  fsli: "Revenue",
  finding_type: "misstatement",
  severity: "high",
  description: "Sample error",
  impact_amount: 45000
});
```

### Risk Assessments
```jsx
// Get risk assessments
const risks = await apiClient.riskAssessments.list(engagementId);

// Create risk assessment
const risk = await apiClient.riskAssessments.create(engagementId, {
  fsli: "Revenue",
  inherent_risk_score: 4,
  control_risk_score: 2,
  detection_risk_score: 2
});
```

### AI Orchestrator
```jsx
// Request specific agent analysis
const result = await apiClient.orchestrator.request({
  type: "MATERIALITY_CALCULATION",
  engagementId: 1,
  params: { turnover: 1000000 }
});

// Full engagement analysis (all agents parallel)
const analysis = await apiClient.orchestrator.fullAnalysis({
  engagementId: 1,
  context: { /* engagement context */ }
});

// Exception handling workflow
const response = await apiClient.orchestrator.exceptionHandling({
  engagementId: 1,
  exceptionDescription: "Revenue spike in Q4",
  context: { /* context */ }
});

// Risk assessment suite
const risks = await apiClient.orchestrator.riskAssessmentSuite({
  engagementId: 1,
  context: { /* context */ }
});

// Get orchestrator status
const status = await apiClient.orchestrator.getStatus();
const metrics = await apiClient.orchestrator.getMetrics();
```

## Using Custom Hooks

### useApiCall - For Manual Execution
```jsx
import { useApiCall } from "../hooks/useApi";

function MyComponent() {
  const { execute, loading, error, data } = useApiCall(
    (engId) => apiClient.engagements.getById(engId)
  );

  async function handleClick() {
    try {
      const result = await execute(1);
      console.log("Engagement:", result);
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        Load Engagement
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Name: {data.entity_name}</p>}
    </div>
  );
}
```

### useFetchData - For Component Mount
```jsx
import { useFetchData } from "../hooks/useApi";

function EngagementList() {
  const { data, loading, error, refetch } = useFetchData(
    () => apiClient.engagements.list(),
    [] // Dependencies
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.engagements?.map(eng => (
        <div key={eng.id}>{eng.entity_name}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## Error Handling

The apiClient automatically handles:
- 401 Unauthorized: Clears token and redirects to /login
- Network errors: Throws to component
- Response errors: Returns error object with message

Components should wrap API calls in try/catch:
```jsx
try {
  const result = await apiClient.engagements.create(data);
} catch (error) {
  console.error("Error:", error);
  showErrorMessage(error.message || "Operation failed");
}
```

## Environment Variables

Create `.env` with:
```
VITE_API_URL=http://localhost:5001
```

## Integration Checklist

- [ ] Import apiClient in component
- [ ] Replace local service calls with API calls
- [ ] Add error handling in try/catch
- [ ] Add loading state for UI feedback
- [ ] Test with backend running
- [ ] Verify JWT token in localStorage after login
