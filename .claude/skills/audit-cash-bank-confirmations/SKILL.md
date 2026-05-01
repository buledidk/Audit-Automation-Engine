---
name: audit-cash-bank-confirmations
description: "Audit cash, bank balances, and external confirmations per ISA (UK) 505 and ISA 501. Covers bank confirmation letters, bank reconciliations, petty cash, foreign currency accounts, restricted cash, and FS-specific: client money (CASS 5/6/7), nostro/vostro accounts, money market placements, central bank reserves. Trigger on 'cash audit', 'bank confirmation', 'bank reconciliation', 'ISA 505', 'client money', 'CASS audit', 'petty cash', 'restricted cash', 'nostro', 'vostro', 'money market', 'cash count', 'bank letter', 'confirmation letter'."
---

# Cash & Bank — Elevated Risk Area

Bank balances require **mandatory external confirmation** under ISA (UK) 505 para 7 for UK statutory audits (per APB Practice Note).

## Assertions and direction of testing

| Assertion | Risk level | Direction | Key procedures |
|-----------|-----------|-----------|---------------|
| **Existence** | Elevated | Confirmation + reconciliation | Bank confirmation letter, reconciliation to GL |
| **Completeness** | Elevated | Confirm all accounts | Letter requests all accounts including nil/closed |
| **Rights & obligations** | Moderate | Confirmation | Confirm lien, charge, encumbrance, guarantees |
| **Accuracy** | Moderate | Reconcile | Bank rec items, verify reconciling items cleared post-YE |
| **Valuation** | Moderate (FX) | Recalculate | Translate foreign currency at closing rate |

## Non-financial services entities

### Bank confirmation letters (ISA 505)
- Send to ALL banks (not just those with balances — captures guarantees, facilities, charges)
- Standard UK format: request balances, facilities, charges, guarantees, interest rates
- If bank refuses to confirm: alternative procedures (bank statements + post-YE clearance)
- Timing: send before year-end, follow up within 2 weeks post-YE

### Bank reconciliations
- Obtain management's bank rec at year-end
- Agree bank balance to confirmation / year-end bank statement
- Agree book balance to GL
- Test reconciling items: outstanding cheques (verify cleared post-YE), deposits in transit, bank errors
- Stale cheques: investigate items > 6 months outstanding
- Test for window dressing (round-tripping cash between accounts at year-end)

### Petty cash
- Cash count at year-end (or as close as practicable)
- Reconcile count to GL balance
- Test sample of petty cash vouchers to supporting receipts
- Verify petty cash limit and authorisation controls

### Foreign currency accounts
- Closing rate from independent source (Bank of England, Bloomberg)
- FX gain/loss recalculation on translation
- Verify hedging arrangements if applicable

### Restricted cash / escrow
- Confirm with holder, verify restriction terms
- Correct classification (current vs non-current)
- Disclosure adequacy

## Financial services entities

### Client money (FCA CASS 5/6/7)
- **CASS 5**: Insurance client money — trust requirements, segregation, CASS resolution pack
- **CASS 6**: Custody assets — reconciliation, title verification
- **CASS 7**: Investment firm client money — internal and external reconciliations, alternative approach vs normal approach
- CASS audit report: CMAR reconciliations (daily internal, monthly external)
- Shortfalls: identify, report, and rectify timeline
- Trust letter: verify from each bank holding client money

### Nostro / vostro accounts (banks)
- Nostro (our account at their bank): confirm balances, test reconciliation
- Vostro (their account at our bank): confirm with correspondent bank
- Reconciling items: investigate breaks > materiality

### Money market placements / deposits
- Confirm with counterparty: amount, maturity, rate
- Test to dealing tickets and confirmations
- Verify accrued interest calculation

### Central bank reserves (banks)
- Confirm reserve requirement balance with central bank
- Verify meets minimum reserve requirement
- Classification: restricted cash

## Outputs

- Bank confirmation tracking schedule (sent, received, exceptions)
- Bank reconciliation testing schedule
- CASS reconciliation findings (FS entities)
- Cash existence and completeness conclusion
