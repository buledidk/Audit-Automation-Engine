---
name: auditengine-industry-profiles
description: "Use when designing, extending, or reasoning about the AuditEngine industry risk library for UK statutory audits. Covers the 8-industry profile pattern — construction, manufacturing, technology, financial_services, retail, professional_services, property, charities — each with risks (severity + ISA ref + response), procedures (area + WP ref + assertion + standard), KPIs, disclosures, controls, going-concern factors, laws, and a 10-bucket FSLI map. Trigger on 'industry risk matrix', 'sector-specific audit risks', 'industry profile', 'add a new industry', 'construction audit risks', 'SaaS audit risks', 'charity audit risks', 'UK industry methodology'."
---

# AuditEngine Industry Profiles

## Purpose
AuditEngine ships 8 hard-coded industry profiles. Each drives risk registers, procedure programmes, lead schedules, KPI expectations, and FSLI mappings. When adding a ninth industry or extending an existing one, follow this exact shape.

## The 8 profiles
`construction`, `manufacturing`, `technology`, `financial_services`, `retail`, `professional_services`, `property`, `charities`.

## Required structure (do not drop fields)

```js
industry_key: {
  label: "Display Name",
  icon: "emoji",
  sectors: ["Sub-sector 1", "Sub-sector 2", ...],
  risks: [
    { id:"R01", text:"...", level:"SIGNIFICANT|ELEVATED|NORMAL", isa:"ISA xxx", response:"..." }
  ],
  procedures: [
    { area:"Revenue", ref:"D1", proc:"...", assertion:"...", isa:"ISA xxx; FRS 102 sNN" }
  ],
  kpis: ["..."],
  disclosures: ["..."],
  controls: ["..."],
  goingConcern: ["..."],
  laws: ["Companies Act 2006", "..."],
  fsli: {
    revenue: [...], receivables: [...], inventory: [...], payables: [...],
    fixedAssets: [...], equity: [...], loans: [...], provisions: [...],
    tax: [...], cash: [...]
  }
}
```

## Severity convention
- `SIGNIFICANT` — must be addressed by significant risk response (ISA 315.28)
- `ELEVATED` — heightened inherent risk, extended procedures required
- `NORMAL` — standard procedures acceptable

## Do
- Tag every risk with the driving ISA paragraph.
- Cross-reference every procedure to a D-section ref from `WP_SECTIONS`.
- Keep FSLI buckets aligned to the 10 fixed keys — do NOT invent new buckets; extend within.
- Include at least one FRS 102 (or IFRS) section number per procedure.

## Don't
- Don't add industries unless the sector has materially different FSLIs, risks, or regulators.
- Don't use competitor firm names in defaults; use generic placeholders.
- Don't frame "when to use / when not to use" for procedures — leave professional judgement to the partner.
