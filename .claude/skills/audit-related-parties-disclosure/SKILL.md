---
name: audit-related-parties-disclosure
description: "Audit related party transactions and disclosures per ISA 550, IAS 24 / FRS 102 S33. Covers identification procedures, arm's length testing, management representations, and FS-specific: intra-group transactions (banking groups), connected lending, key management compensation. Non-FS: director transactions, shareholder loans, family company dealings. Trigger on 'related parties', 'ISA 550', 'IAS 24', 'FRS 102 S33', 'related party transactions', 'arm's length', 'connected persons', 'director transactions', 'key management compensation', 'intra-group transactions', 'connected lending', 'shareholder loans', 'transfer pricing', 'related party disclosure', 'management representations related parties'."
---

# Related Parties & Disclosure — Elevated Risk Area

ISA 550 requires the auditor to obtain **sufficient appropriate evidence** about related party relationships and transactions, with a presumption that related party transactions outside the normal course of business are a **significant risk**.

## Assertions and direction of testing

| Assertion | Risk level | Direction | Key procedures |
|-----------|-----------|-----------|---------------|
| **Completeness** | Significant (primary) | Multiple sources | Cross-reference registers, Companies House, inquiries, journal scans |
| **Occurrence** | Elevated | Records to source | Verify transactions took place with supporting documentation |
| **Accuracy** | Elevated | Test terms | Arm's length comparison, pricing analysis, commercial rationale |
| **Disclosure** | Significant | Test to IAS 24/S33 | Names, nature, amounts, terms, balances, guarantees |
| **Classification** | Moderate | Review coding | Correct categorisation of relationship type |

## ISA 550 framework

### Identification of related parties
- Inquiry of management and TCWG: who are the related parties? Has there been any change?
- Review prior year workpapers: carry forward known related parties
- Companies House searches: directorships, persons with significant control (PSC register)
- Shareholder register: identify controlling parties and beneficial owners
- Review group structure: parent, subsidiaries, associates, joint ventures
- Related party register: obtain management's list, test for completeness independently

### Risk assessment procedures
- Understand the nature of related party relationships and types of transactions
- Assess risk that related party transactions are not identified or disclosed
- Determine whether identified transactions are outside the normal course of business
- Transactions outside normal course: presumed significant risk (ISA 550.18)

### Fraud considerations
- Related parties may facilitate fraudulent financial reporting or misappropriation
- Previously undisclosed related parties: heightened scepticism
- Dominant influence of one individual: risk of overriding controls
- Complex structures with no apparent business purpose

## Non-financial services entities

### Director transactions
- Loans to directors: verify compliance with Companies Act 2006 S197-214
- Disclosure: amounts outstanding, terms, maximum balance during year
- Transactions with director-connected entities: purchases, sales, leases
- Director remuneration: verify to service contracts and board approval
- Benefits in kind: verify to P11D filings

### Shareholder loans and family companies
- Loans to/from shareholders: verify terms, interest rate (arm's length), security
- Transactions with shareholder-controlled entities: test pricing to market comparables
- Family company dealings: identify through inquiry and Companies House searches
- Beneficial ownership: look through nominee arrangements

### Key management compensation (IAS 24.17 / FRS 102 S33.7)
- Short-term benefits: salary, bonuses, benefits in kind
- Post-employment benefits: pension contributions, defined benefit accrual
- Termination benefits: verify to agreements, board approval
- Share-based payments: cross-reference to IFRS 2 / FRS 102 S26 workpaper
- Aggregate disclosure: verify amounts agree to underlying records

### Arm's length testing
- Compare transaction terms to those with independent third parties
- Where no comparable external transaction: test to market data, independent valuations
- Pricing analysis: is the price within a reasonable range of arm's length terms?
- Commercial rationale: does the transaction have a genuine business purpose?

### Management representations
- Obtain written representations that all related parties and transactions have been disclosed
- Representations re: completeness of information provided about related parties
- Representations re: appropriateness of accounting and disclosure

## Financial services entities

### Intra-group transactions (banking groups)
- Intercompany loans, deposits, guarantees: verify terms, pricing, elimination on consolidation
- Capital injections and dividends: verify against regulatory permissions
- Service level agreements: test charges to arm's length (transfer pricing)
- Management recharges: verify allocation methodology and commercial justification
- Group relief (tax): verify formal claims and commercial arrangements

### Connected lending (banks)
- Regulatory requirement: FCA/PRA rules on lending to connected persons
- Large exposure limits: verify compliance with CRR Article 395
- Board approval: verify lending to directors/significant shareholders approved
- Terms: test interest rate, security, repayment terms to arm's length
- Monitoring: ongoing credit risk assessment of connected exposures

### Key management compensation (banking/FS)
- PRA Remuneration Code: test compliance for material risk takers
- Fixed to variable ratio: regulatory cap verification
- Deferred variable remuneration: test deferral periods and instrument types
- Malus and clawback provisions: verify contractual terms
- Disclosure: Pillar 3 remuneration disclosures

### Fund management related parties
- Fund manager / fund transactions: management fees, performance fees at arm's length
- Seed capital investments: conflicts disclosure, fair value
- Co-investment by directors/principals: terms and disclosure
- Soft commissions: verify disclosed and compliant with FCA rules

## Inputs

| Field | Required | Description |
|-------|----------|-------------|
| entityProfile | yes | Industry, group structure, ownership |
| materialityLevels | yes | PM, TE, trivial |
| relatedPartyRegister | yes | Management's list of related parties and transactions |
| companiesHouseSearches | yes | Director and PSC search results |
| groupStructureChart | conditional | Required for group audits |
| priorYearRelatedParties | yes | Carry-forward for completeness comparison |

## Outputs

- Related party identification and completeness assessment
- Transaction testing schedule (occurrence, arm's length, commercial rationale)
- Disclosure adequacy checklist (IAS 24 / FRS 102 S33 requirements)
- Fraud risk indicators assessment (ISA 550 / ISA 240)
- Management representation letter related party confirmations
- Related parties completeness, occurrence, and disclosure conclusion
