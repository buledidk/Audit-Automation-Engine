# Accuracy Enhancement Engine — Quick Start

## 1. Enable the Engine

Add to your `.env` (or Vercel environment):
```
ENABLE_ACCURACY_ENHANCEMENTS=true
```

## 2. Verify It's Running

```bash
curl http://localhost:3000/api/accuracy/status
```

Expected response:
```json
{
  "success": true,
  "status": {
    "agent": "AuditAccuracyEnhancement",
    "enabled": true,
    "status": "READY",
    "modules": 7,
    "isaReferences": ["ISA 330", "ISA 500", "ISA 520", "ISA 530", "ISA 540"]
  }
}
```

## 3. Run Your First Check

### Trial Balance Validation (ISA 330)
```bash
curl -X POST http://localhost:3000/api/accuracy/mathematical \
  -H 'Content-Type: application/json' \
  -d '{
    "data": {
      "trialBalance": [
        {"account": "Cash", "debit": 100000, "credit": 0},
        {"account": "Revenue", "debit": 0, "credit": 80000},
        {"account": "Expenses", "debit": 30000, "credit": 0},
        {"account": "Equity", "debit": 0, "credit": 50000}
      ]
    }
  }'
```

### Data Quality Assessment
```bash
curl -X POST http://localhost:3000/api/accuracy/data-quality \
  -H 'Content-Type: application/json' \
  -d '{
    "data": {
      "transactions": [
        {"id": 1, "amount": 500, "vendor": "Acme"},
        {"id": 2, "amount": 500, "vendor": "Acme"},
        {"id": 3, "amount": 1200, "vendor": "Beta Corp"}
      ],
      "keyFields": ["amount", "vendor"]
    }
  }'
```

### Full Assessment (All 7 Modules)
```bash
curl -X POST http://localhost:3000/api/accuracy/full-assessment \
  -H 'Content-Type: application/json' \
  -d '{
    "engagementId": "eng_001",
    "data": {
      "trialBalance": [
        {"account": "Cash", "debit": 100000, "credit": 0},
        {"account": "Revenue", "debit": 0, "credit": 100000}
      ],
      "transactions": [
        {"id": 1, "amount": 500, "date": "2026-01-15"}
      ]
    }
  }'
```

## API Endpoints Summary

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/accuracy/full-assessment` | Run all 7 modules |
| POST | `/api/accuracy/mathematical` | Trial balance, cross-foot |
| POST | `/api/accuracy/data-quality` | Duplicates, completeness |
| POST | `/api/accuracy/cross-account` | ISA 520 analytical |
| POST | `/api/accuracy/estimates` | ISA 540 estimate testing |
| POST | `/api/accuracy/reconciliation` | ISA 500 matching |
| POST | `/api/accuracy/sampling` | ISA 530 sampling |
| POST | `/api/accuracy/batch` | Bulk AI checks (50% cost) |
| GET | `/api/accuracy/batch/:id` | Poll batch results |
| GET | `/api/accuracy/dashboard/:id` | Monitoring dashboard |
| GET | `/api/accuracy/alerts/:id` | Discrepancy alerts |
| GET | `/api/accuracy/status` | Engine status |
| GET | `/api/accuracy/metrics` | Usage metrics |

## Orchestrator Integration

The engine is also available via the orchestrator:
```bash
curl -X POST http://localhost:3000/api/orchestrator/request \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "CHECK_MATHEMATICAL_ACCURACY",
    "engagementId": "eng_001",
    "params": {
      "data": {
        "trialBalance": [
          {"account": "Cash", "debit": 50000, "credit": 0},
          {"account": "Equity", "debit": 0, "credit": 50000}
        ]
      }
    }
  }'
```
