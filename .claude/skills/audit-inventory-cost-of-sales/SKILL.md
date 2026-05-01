---
name: audit-inventory-cost-of-sales
description: "Audit inventory existence, valuation (NRV/cost), cost of sales, and WIP per ISA (UK) 501 (attendance at inventory counts), IAS 2 / FRS 102 S13. Covers physical count attendance, NRV testing, cost allocation, standard costing variances, WIP valuation, and obsolescence provisions. FS-specific: physical collateral held, repossessed assets. Trigger on 'inventory audit', 'stock count', 'ISA 501', 'inventory count attendance', 'NRV testing', 'net realisable value', 'WIP valuation', 'work in progress', 'cost of sales', 'IAS 2', 'FRS 102 S13', 'obsolescence', 'stock provision', 'standard costing', 'inventory existence'."
---

# Inventory & Cost of Sales — Elevated Risk Area

Inventory existence requires **mandatory attendance at physical counts** under ISA (UK) 501 para 4 unless impracticable, in which case alternative procedures must be performed and documented.

## Assertions and direction of testing

| Assertion | Risk level | Direction | Key procedures |
|-----------|-----------|-----------|---------------|
| **Existence** | Elevated | Physical verification | Attend inventory count, perform test counts, reconcile to records |
| **Valuation (NRV/cost)** | Elevated | Test lower of cost and NRV | Cost build-up, NRV testing to post-YE sales, obsolescence review |
| **Completeness** | Moderate | Source to records | Floor to sheet test counts, goods received not invoiced (GRNI) |
| **Rights & obligations** | Moderate | Verify ownership | Goods on consignment, goods held for third parties, bill-and-hold |
| **Cut-off** | Moderate | Test around YE | Last GRN/despatch notes pre and post YE, goods in transit |

## Non-financial services entities

### Inventory count attendance (ISA 501)
- Plan attendance: understand count procedures, locations, timing
- Perform test counts: floor to sheet (completeness) and sheet to floor (existence)
- Record last sequence numbers for GRNs, despatch notes, production orders
- Observe count procedures: segregation, movement controls, damaged/obsolete identification
- If unable to attend: alternative procedures (subsequent count, roll-back/roll-forward testing)
- Third-party locations: confirm or attend where material

### Cost testing
- Raw materials: test purchase cost to recent invoices, weighted average or FIFO
- Labour: verify labour rates and hours allocated to WIP/finished goods
- Overheads: test absorption rate calculation, verify only production overheads included (IAS 2.12)
- Standard costing: test standard rates are reasonable approximation of actual cost, analyse variances
- Exclude abnormal waste, storage costs (unless necessary), selling costs, general admin (IAS 2.16)

### Net realisable value (NRV)
- Compare carrying value to post-YE selling prices less costs to complete and sell
- Slow-moving analysis: test items with no movement > 6/12 months
- Damaged/obsolete: verify items flagged at count are written down
- Industry-specific: fashion (seasonal markdown), food (expiry dates), technology (rapid obsolescence)

### Work in progress (WIP)
- Test stage of completion: physical inspection, production records
- Cost accumulation: materials issued, labour bookings, overhead allocation
- Long-term WIP: verify not carrying costs in excess of NRV

### Cost of sales
- Reconcile opening stock + purchases - closing stock = COGS
- Test gross margin by product line to prior year and budget, investigate unusual variances
- Cut-off: purchases and sales recorded in correct period

## Financial services entities

### Physical collateral (banks)
- Where bank holds physical collateral (gold, commodities): existence confirmation
- Repossessed assets (vehicles, property): test valuation to market evidence
- Classify correctly: held for sale vs held for use
- IFRS 5 measurement: lower of carrying amount and fair value less costs to sell

### Insurance (salvage inventory)
- Motor salvage: existence, valuation to auction/disposal values
- Track from claim to recovery to disposal

## Inputs

| Field | Required | Description |
|-------|----------|-------------|
| entityProfile | yes | Industry, inventory types, locations |
| materialityLevels | yes | PM, TE, trivial |
| countPlan | yes | Locations, dates, methodology (full/cycle/perpetual) |
| costingMethod | yes | FIFO, weighted average, standard cost |
| priorYearInventory | no | For analytical comparison and roll-forward |

## Outputs

- Inventory count attendance memorandum with test count results
- Cost testing schedule (raw materials, labour, overheads)
- NRV testing and obsolescence provision schedule
- Cut-off testing schedule (GRNs, despatch notes)
- Inventory existence, valuation, and completeness conclusion
