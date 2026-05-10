# Domains (Sprint 0 V-07)

**Date:** 2026-05-10

## Live

| Domain | Status (10 May 2026) | Notes |
|---|---|---|
| `auditengine.agency` | Live, A records `216.150.16.129`, `216.150.1.129`, NS `ns1/2.vercel-dns.com` | Production AuditEngine app on Vercel, multi-region CDG / LHR / SFO |

## Not registered

| Domain | Status (10 May 2026) | Notes |
|---|---|---|
| `auditengine.co.uk` | **Not registered.** Whois confirms "This domain name has not been registered." | The original target name in pre-AURA docs. Either never owned or registration lapsed. |

## Decision

There is no redirect to maintain because `.co.uk` does not exist. Two options:

1. **Register `auditengine.co.uk`** (~£10/year via Nominet / 123-reg / similar). Set as 301 redirect to `auditengine.agency`. Useful if UK-only branding is a future positioning move.
2. **Release.** Treat `.agency` as the only AuditEngine identity. Saves £10/year and one renewal touchpoint.

Default recommendation: **register** — UK audit firms search for `.co.uk` more often than `.agency`, and £10/year is below any reasonable noise threshold for a UK-positioned product. Decision deferred to DK; this doc records the state.

## Vercel domain config

On the Vercel project for `auditengine.agency`:

- Production domain: `auditengine.agency`
- Regions: `cdg`, `lhr`, `sfo`
- Headers (per `vercel.json`): HSTS preload, X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy camera=()/microphone=()/geolocation=()
- CSP: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:`

## Out of scope here

Actually purchasing `auditengine.co.uk` (DK action; not mine).
