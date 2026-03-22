# Accuracy Enhancement Engine — Deployment Guide

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ENABLE_ACCURACY_ENHANCEMENTS` | No | `true` | Set to `false` to disable the engine (returns 503 on all routes) |
| `VITE_CLAUDE_API_KEY` | Yes* | — | Required for AI-enhanced modules (Sonnet/Opus calls) |

*Pure computation modules (Mathematical, DataQuality, RealTimeMonitoring) work without an API key.

## Vercel Configuration

No changes to `vercel.json` needed. The accuracy routes are mounted on the Express server which already handles API routing.

Add to Vercel environment:
```
ENABLE_ACCURACY_ENHANCEMENTS=true
```

## Feature Flag

The engine uses a feature gate middleware:
- `ENABLE_ACCURACY_ENHANCEMENTS=true` (or unset) → Engine enabled
- `ENABLE_ACCURACY_ENHANCEMENTS=false` → All `/api/accuracy/*` routes return 503

This allows instant rollback without redeployment.

## Rate Limits

| Endpoints | Window | Max Requests | Reason |
|-----------|--------|-------------|--------|
| `/api/accuracy/full-assessment` | 5 min | 10 | Runs all 7 modules including AI |
| `/api/accuracy/estimates` | 5 min | 10 | Uses Opus with extended thinking |
| `/api/accuracy/batch` | 5 min | 10 | Batch API calls |
| All other accuracy endpoints | — | No limit | Pure computation or light AI |

## Cost Considerations

| Module | Model | Approximate Cost per Call |
|--------|-------|--------------------------|
| MathematicalAccuracy | None | Free |
| DataQuality | None | Free |
| RealTimeMonitoring | None | Free |
| CrossAccountValidation | Sonnet (AI interpretation only) | ~$0.01 |
| ReconciliationModule | Sonnet (investigation only) | ~$0.01 |
| SamplingAccuracy | Sonnet + MEDIUM thinking | ~$0.02 |
| EstimateAccuracy | **Opus + HIGH/MAX thinking** | ~$0.15-0.30 |

**Batch processing** (via `/api/accuracy/batch`) is 50% cheaper for AI calls.

## Health Checks

```bash
# Engine status
curl http://localhost:3000/api/accuracy/status

# Detailed metrics
curl http://localhost:3000/api/accuracy/metrics

# Orchestrator status (includes accuracy agent)
curl http://localhost:3000/api/orchestrator/status
```

## Monitoring

The RealTimeMonitoringModule maintains in-memory state per engagement:
```bash
# Initialize monitoring for an engagement
# (automatically done on first full-assessment call)

# Get dashboard
curl http://localhost:3000/api/accuracy/dashboard/eng_001

# Get alerts
curl http://localhost:3000/api/accuracy/alerts/eng_001?severity=HIGH
```

Note: In-memory monitoring state is lost on server restart. For persistent state, integrate with Supabase.
