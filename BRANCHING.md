# Branch Strategy — AuditEngine

## Branches

| Branch | Purpose | Deploys to |
|--------|---------|------------|
| `main` | Production-ready releases only | Vercel (auditengine.agency) |
| `develop` | Daily work, all new commits land here first | — |
| `feature/*` | Multi-day features that might break things | — |

## Rules

1. **Never push directly to main.** All changes go through develop first.
2. **Merge develop → main** only when ready to ship (tests pass, build clean).
3. **Feature branches** branch off develop, merge back to develop via PR.
4. **Hotfixes** can branch off main, merge to both main and develop.

## Commands

```bash
# Start a feature
git checkout develop
git checkout -b feature/my-feature

# Finish a feature
git checkout develop
git merge feature/my-feature
git branch -d feature/my-feature

# Ship to production
git checkout main
git merge develop
git push origin main
git checkout develop
```

## Vercel

Vercel auto-deploys from `main` only. Preview deployments trigger on PRs to main.
