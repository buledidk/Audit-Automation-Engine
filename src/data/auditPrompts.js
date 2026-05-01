/**
 * Comprehensive Audit Prompts & Templates
 * Ready-to-use prompts for auditors across all phases
 */

export const AUDIT_PROMPTS = {
  engagement_planning: {
    understanding_entity: {
      title: 'Understanding the Entity - Comprehensive Guide',
      prompt: `Conduct a thorough understanding of the entity by addressing the following:

BUSINESS & OPERATIONS:
- What is the entity's core business model and value chain?
- Who are the key customers, suppliers, and competitors?
- What are the main product/service offerings?
- What is the market position and growth strategy?
- How does the entity differentiate itself?

INDUSTRY & REGULATORY ENVIRONMENT:
- What are the key industry dynamics and trends?
- What regulatory requirements apply to the entity?
- What are significant industry risks and challenges?
- How does the entity comply with industry standards?
- Are there upcoming regulatory changes?

FINANCIAL PERFORMANCE:
- What are recent financial results and trends?
- What is the profitability trend (last 3-5 years)?
- What are key financial metrics and ratios?
- Are there significant year-over-year changes?
- What are management's expectations?

ORGANIZATIONAL STRUCTURE:
- How is the organization structured?
- Who are key members of management and board?
- What is the governance structure?
- Are there related parties or complex structures?
- What is the IT environment?

RISK FACTORS:
- What are the key business risks?
- What are going concern indicators?
- What is the fraud risk profile?
- Are there unusual transactions or events?
- What is management's risk appetite?

ACTION ITEMS:
- Document findings in the audit file
- Identify preliminary significant risks
- Assess control environment
- Plan risk assessment procedures`,
      estimatedTime: '16 hours',
      isAIEnabled: true
    },

    materiality_assessment: {
      title: 'Assess and Document Materiality',
      prompt: `Calculate materiality using the following framework:

BENCHMARK SELECTION:
1. Identify relevant financial metrics:
   - Revenue (typical: 5% for trading entities)
   - Net profit (typical: 5-10%)
   - Gross profit (typical: 5%)
   - Total assets (typical: 1%)
   - Equity (typical: 5-10%)

2. Select primary benchmark based on:
   - Entity characteristics
   - User information needs
   - Industry norms

MATERIALITY CALCULATION:
Performance Materiality = Overall Materiality × 75% (typical)

CLEARLY TRIVIAL THRESHOLD = Overall Materiality × 5% (typical)

SPECIFIC AREA MATERIALITY:
For significant account balances:
- Revenue: [___] (typically 75-80% of overall materiality)
- Receivables: [___] (typically 75-100%)
- Inventory: [___] (typically 75-100%)
- Fixed Assets: [___] (typically 75-100%)

QUALITATIVE FACTORS:
- Regulatory compliance importance
- Management compensation links
- Loan covenant implications
- Historical adjustments
- Prior-year findings

DOCUMENTATION:
- Basis for materiality selection
- Calculations showing benchmarks
- Justification for percentages
- Specific area materiality rationale
- Approval by engagement partner`,
      estimatedTime: '4 hours',
      isAIEnabled: true
    }
  },

  risk_assessment: {
    fraud_brainstorming: {
      title: 'Fraud Risk Assessment Session',
      prompt: `Conduct a fraud brainstorming session using the fraud triangle:

INCENTIVES & PRESSURES:
- Is management under pressure to achieve earnings targets?
- Are there compensation arrangements linked to financial results?
- Is the entity in financial distress?
- Is the entity facing market competition pressures?
- Are there failed expectations from investors/lenders?

OPPORTUNITIES:
- Are there significant or unusual transactions?
- Are there weak control areas or manual processes?
- Is management override possible?
- Are there access issues to systems or records?
- Are there weak IT controls?
- Are there related party transactions?

RATIONALIZATION:
- What could motivate management to commit fraud?
- How might fraud be justified?
- What is management's attitude toward controls?
- How strong is the code of conduct enforcement?
- Is there a history of aggressive accounting?

SPECIFIC FRAUD SCENARIOS:
Consider frauds in:
1. REVENUE RECOGNITION
   - Cut-off manipulation
   - Channel stuffing
   - Round-tripping transactions
   - Side agreements
   - Fictitious customers

2. INVENTORY
   - Obsolete inventory not written down
   - Fictitious inventory
   - Warehouse padding
   - Inventory in transit issues

3. ASSET VALUATION
   - Overvalued receivables
   - Impairment indicators ignored
   - Goodwill not tested
   - Estimates manipulated

4. MANAGEMENT OVERRIDE
   - Unauthorized journal entries
   - Unsupported adjustments
   - Bypassed approval processes

RESPONSE PROCEDURES:
For each fraud risk identified:
- Design specific audit procedures
- Determine sample sizes
- Assign resources
- Plan nature, timing, extent

DOCUMENTATION:
- Fraud risk factors identified
- Assessed likelihood and magnitude
- Audit response planned
- Team discussion documented`,
      estimatedTime: '8 hours',
      isAIEnabled: true
    },

    internal_control_assessment: {
      title: 'Understand Internal Control Over Financial Reporting (ICFR)',
      prompt: `Evaluate internal control following the COSO framework:

1. CONTROL ENVIRONMENT:
   ☐ Integrity and ethical values
   ☐ Board independence and effectiveness
   ☐ Management philosophy and risk appetite
   ☐ Organizational structure clarity
   ☐ Competence of personnel
   ☐ Accountability mechanisms

   PROCEDURES:
   - Interview management about tone at top
   - Review code of conduct
   - Assess board meeting effectiveness
   - Evaluate HR policies
   - Document organizational structure

2. RISK ASSESSMENT:
   ☐ Entity-level risk identification
   ☐ Process-level risk assessment
   ☐ Risk evaluation procedures
   ☐ Management response to risks
   ☐ Change management process

   PROCEDURES:
   - Identify significant account balances
   - Assess fraud risks
   - Evaluate going concern
   - Document risk assessment process

3. CONTROL ACTIVITIES:
   For each significant account/process:
   ☐ Prevention controls (segregation of duties)
   ☐ Detection controls (reconciliations)
   ☐ IT general controls (access, changes)
   ☐ Application controls (validation)
   ☐ Manual controls (approvals)

   PROCEDURES:
   - Walkthrough each process
   - Document control designs
   - Identify control gaps
   - Test control effectiveness

4. INFORMATION & COMMUNICATION:
   ☐ Financial reporting system effectiveness
   ☐ System documentation
   ☐ Access controls
   ☐ Change management
   ☐ Communication of responsibilities

   PROCEDURES:
   - Document IT environment
   - Map data flows
   - Test system access
   - Evaluate communication protocols

5. MONITORING:
   ☐ Ongoing monitoring activities
   ☐ Periodic evaluations
   ☐ Remediation of deficiencies
   ☐ Audit adjustments tracking

   PROCEDURES:
   - Review management's monitoring
   - Test control improvements
   - Follow up on prior adjustments

DEFICIENCY CLASSIFICATION:
- Control deficiency: Control not operating
- Significant deficiency: Deficiency that is significant
- Material weakness: Could result in material misstatement

DOCUMENTATION:
- Control procedures narrative
- Flowcharts of key processes
- Control testing results
- Identified deficiencies
- Management responses`,
      estimatedTime: '20 hours',
      isAIEnabled: true
    }
  },

  interim_audit: {
    control_testing: {
      title: 'Test Control Design & Operating Effectiveness',
      prompt: `For each identified control, perform testing:

CONTROL DESIGN TESTING:
- Does the control exist?
- Is it designed to address the risk?
- Does it require IT support?
- Are there alternative controls?

OPERATING EFFECTIVENESS TESTING:

For PREVENTIVE CONTROLS:
- Observe the control in operation
- Inquire about the control process
- Evaluate design and execution
- Test for compliance

For DETECTIVE CONTROLS:
- Re-perform the control
- Test a sample of control operation
- Verify results accuracy
- Evaluate timeliness

For IT CONTROLS:
- Test system access controls
- Verify change management
- Test system-generated data
- Evaluate backup/recovery

SAMPLE SELECTION:
- Define population
- Determine sample size (typically 20-30 items)
- Select using risk-based approach
- Document sampling methodology

TESTING DOCUMENTATION:
For each control tested:
- Control ID and description
- Objective addressed
- Testing method
- Sample items tested
- Exceptions found
- Control evaluation
- Conclusion on effectiveness

DEFICIENCY EVALUATION:
If exceptions found:
- Is it isolated or pervasive?
- Does it indicate design flaw?
- Is operating effectiveness impaired?
- What is the impact?

REMEDIATION:
- Discuss with management
- Adjust audit approach if needed
- Increase substantive procedures if necessary
- Document resolution`,
      estimatedTime: '20 hours',
      isAIEnabled: true
    },

    analytical_procedures: {
      title: 'Perform Analytical Procedures',
      prompt: `Conduct analytical procedures using the following approach:

DEFINE EXPECTATIONS:
For each significant account:

1. PRELIMINARY ANALYSIS:
   - Obtain prior year amounts
   - Calculate year-over-year change %
   - Identify significant variances (>10%)
   - Research known changes

2. BUILD EXPECTATIONS:
   Using:
   - Prior year actual
   - Inflation rates
   - Industry trends
   - Budget/forecast
   - Business changes

3. COMPARE ACTUAL TO EXPECTATIONS:
   - Calculate variance amount and %
   - Assess reasonableness
   - Identify unusual items

4. INVESTIGATE VARIANCES:
   For each significant variance:
   - Inquire about nature
   - Obtain supporting documents
   - Verify through other procedures
   - Document explanation

RATIO ANALYSIS:
Calculate and analyze:
- Profitability ratios
- Liquidity ratios
- Efficiency ratios
- Solvency ratios
- Compare to industry

KEY ANALYTICAL PROCEDURES:
- Revenue trend analysis
- Gross profit margin analysis
- Operating expense analysis
- Account balance movements
- Relationship between accounts

UNUSUAL ITEMS:
- Identify unusual transactions
- Plan additional procedures
- Document explanations
- Assess impact

DOCUMENTATION:
- Analytical procedures performed
- Expectations developed
- Variances identified
- Explanations obtained
- Conclusions reached`,
      estimatedTime: '8 hours',
      isAIEnabled: true
    }
  },

  financial_position: {
    revenue_testing: {
      title: 'Test Revenue Recognition (IFRS 15)',
      prompt: `Test revenue using the 5-step IFRS 15 model:

STEP 1: IDENTIFY THE CONTRACT
For each significant revenue transaction:
- Is there a valid contract?
- Are the parties identified?
- Are rights/obligations clear?
- Is performance likely?
- Is payment terms specified?

STEP 2: IDENTIFY PERFORMANCE OBLIGATIONS
- What goods/services are promised?
- Are they separately identifiable?
- Should they be combined?
- Document all performance obligations

STEP 3: DETERMINE TRANSACTION PRICE
- Identify fixed consideration
- Identify variable consideration (discounts, returns, bonuses)
- Evaluate constraining estimates
- Assess financing components
- Consider non-cash items

STEP 4: ALLOCATE TRANSACTION PRICE
- Determine standalone selling price for each obligation
- Allocate transaction price proportionately
- Document allocation methodology

STEP 5: RECOGNIZE REVENUE
- Determine when control transfers
- Identify satisfaction indicators:
  * Point in time: transfer of control
  * Over time: continuous satisfaction
- Record revenue correctly

TESTING PROCEDURES:
Sample of revenue transactions:
☐ Trace to sales order
☐ Verify delivery/performance evidence
☐ Confirm pricing and terms
☐ Test cutoff (correct period)
☐ Verify accounting treatment
☐ Check for related party transactions
☐ Verify disclosures

REVENUE CUTOFF TESTING:
- Transactions recorded last week of period
- Transactions recorded first week of next period
- Verify proper cutoff
- Check shipping terms (FOB)

COMPLETENESS TESTING:
- Trace from shipping logs to revenue
- Verify all shipments recorded
- Test for gaps in invoice sequence

DOCUMENTATION:
- Transactions tested
- Testing procedures performed
- Evidence reviewed
- Exceptions noted
- Conclusions on accuracy`,
      estimatedTime: '16 hours',
      isAIEnabled: true
    },

    receivables_testing: {
      title: 'Test Receivables & Allowance (IFRS 9 ECL)',
      prompt: `Test receivables and expected credit loss allowance:

RECEIVABLES CONFIRMATION:
1. Select sample of accounts
   - Risk-based selection preferred
   - Consider aging and amounts
   - Include unusual items

2. Send confirmations
   - Written confirmations to customers
   - Request direct response
   - Follow up non-responses
   - Evaluate exceptions

3. Evaluate results
   - Recorded amount accuracy
   - Related party transactions
   - Unusual items
   - Alternative procedures if needed

AGING ANALYSIS:
- Obtain aging by customer
- Evaluate collectibility
- Identify past due amounts
- Verify subsequent collection

ALLOWANCE FOR CREDIT LOSS (ECL - IFRS 9):
1. Review management's ECL model
   - Understand methodology
   - Validate calculations
   - Test assumptions

2. Test parameters:
   - Historical loss rates
   - Probability of default
   - Loss given default
   - Forward-looking information

3. Sample testing:
   - Select accounts by aging bucket
   - Verify subsequent collection
   - Assess appropriateness of provision
   - Evaluate for bias

4. Low credit risk:
   - Evaluate assumption appropriateness
   - If applied, test supporting evidence

RELATED PARTY TRANSACTIONS:
- Identify related party receivables
- Review terms and status
- Assess collectibility
- Verify disclosures

CUTOFF TESTING:
- Last week of period transactions
- First week of next period
- Verify proper period assignment

DOCUMENTATION:
- Confirmation sample and results
- Aging analysis
- ECL model review
- Testing procedures
- Exceptions and conclusions`,
      estimatedTime: '12 hours',
      isAIEnabled: true
    },

    inventory_testing: {
      title: 'Test Inventory & COGS',
      prompt: `Test inventory and cost of goods sold:

INVENTORY OBSERVATION:
1. Prepare for observation:
   - Understand inventory methods (FIFO, weighted avg)
   - Know counting process
   - Review prior year adjustments
   - Prepare test procedures

2. Observe count:
   - Verify count procedures
   - Trace count tags to list
   - Note discrepancies
   - Test cutoff (goods in transit)

3. Test accuracy:
   - Recalculate footings
   - Test pricing
   - Evaluate obsolescence
   - Verify all locations counted

INVENTORY VALUATION:
1. Verify cost method:
   - FIFO, LIFO, weighted average, specific identification
   - Consistent with prior year
   - Appropriate for industry

2. Test pricing:
   - Cost of goods for sample items
   - Actual costs vs. standard costs
   - Variance analysis
   - Obsolescence indicators

3. Obsolescence evaluation:
   - Review for slow-moving items
   - Identify aged inventory
   - Evaluate for impairment
   - Verify provision appropriateness

COST OF GOODS SOLD:
- Verify cost methodology
- Test standard costs
- Analyze variances
- Verify expense recording

CUTOFF TESTING:
- Goods in transit at period-end
- Purchase cutoff
- Sale cutoff
- Proper accounting

DOCUMENTATION:
- Inventory count observed
- Items tested and results
- Pricing verification
- Obsolescence evaluation
- Conclusions on accuracy`,
      estimatedTime: '12 hours',
      isAIEnabled: true
    }
  },

  accounting_impact: {
    revenue_recognition_detail: {
      title: 'Detailed Revenue Recognition Analysis',
      prompt: `Conduct comprehensive revenue recognition analysis:

BUSINESS MODEL ANALYSIS:
- Describe revenue streams
- Identify performance obligations
- Understand customer contracts
- Identify contract terms

CONTRACT REVIEW:
For each significant contract:
- Nature of goods/services
- Terms and conditions
- Payment terms
- Return provisions
- Warranties/guarantees
- Modification clauses

RECOGNITION POINT DETERMINATION:
- When does control transfer?
- Performance over time or point in time?
- Evidence of control transfer
- Measurement at recognition

COMPLEX AREAS:
1. Variable Consideration:
   - Are there discounts?
   - Are there return rights?
   - Are there rebates?
   - Constraint assessment

2. Contract Combinations:
   - Are contracts combined per standard?
   - Are terms interdependent?
   - Accounting impact

3. Performance Obligations:
   - Are they separately identifiable?
   - Are they distinct?
   - Transfer timing

4. Non-Cash Consideration:
   - Fair value determination
   - Accounting treatment

TESTING PROCEDURES:
- Test revenue contracts
- Verify recognition point
- Test underlying data
- Validate calculations
- Review disclosures

DISCLOSURE REVIEW:
- Performance obligations
- Revenue by segment/type
- Contract assets/liabilities
- Significant judgments
- IFRS 15 compliance

AUDIT CONCLUSIONS:
- Revenue properly recognized
- Disclosures adequate
- No material misstatements
- Issues for resolution`,
      estimatedTime: '16 hours',
      isAIEnabled: true
    },

    lease_accounting: {
      title: 'IFRS 16 Lease Accounting Testing',
      prompt: `Test lease accounting under IFRS 16:

LEASE IDENTIFICATION:
1. Identify all leases:
   - Scan contracts for lease terms
   - Interview management
   - Review payment obligations
   - Evaluate implicit leases

2. Lease definition test:
   - Control of identified asset?
   - Right to direct use?
   - Right to obtain benefits?

LESSEE ACCOUNTING (if applicable):
1. Calculate ROU asset:
   - Lease liability (discounted payments)
   - Direct costs
   - Initial direct payments
   - Restoration obligations

2. Calculate lease liability:
   - Lease payments identified
   - Discount rate determined
   - Present value calculation
   - Initial liability amount

3. Subsequent measurement:
   - Depreciation of ROU asset
   - Interest on lease liability
   - Lease modification impacts
   - Reassessment indicators

LESSOR ACCOUNTING (if applicable):
1. Lease classification:
   - Finance lease (transfer of risks/rewards)
   - Operating lease (no transfer)

2. Finance lease recognition:
   - Initial receivable
   - Interest income
   - Subsequent accounting

3. Operating lease recognition:
   - Revenue recognition
   - Deferred revenue
   - Asset depreciation

TESTING PROCEDURES:
- Identify all leases
- Test lease liability calculation
- Verify ROU asset amount
- Test subsequent accounting
- Evaluate disclosures

DISCLOSURES:
- Lease liability maturity
- Operating lease commitments
- Lease modification impacts
- Significant judgments
- IFRS 16 impact

DOCUMENTATION:
- Leases identified
- Calculations reviewed
- Testing results
- Conclusions
- Disclosure evaluation`,
      estimatedTime: '12 hours',
      isAIEnabled: true
    }
  },

  completion: {
    final_analytical_review: {
      title: 'Conduct Final Analytical Review',
      prompt: `Perform final analytical review before audit completion:

COMPREHENSIVE REVIEW:
1. Review all financial statements:
   - Income statement trends
   - Balance sheet relationships
   - Cash flow statement
   - Statement of changes in equity

2. Key ratios and metrics:
   - Profitability trends
   - Liquidity ratios
   - Leverage ratios
   - Efficiency metrics

3. Relationships between accounts:
   - Revenue to receivables
   - Purchases to payables
   - Assets to depreciation
   - Cash flows

UNUSUAL ITEMS:
- Identify unusual transactions
- Investigate significant changes
- Verify explanations
- Document conclusions

SUBSEQUENT EVENTS:
- Review events after year-end
- Identify adjusting items
- Identify disclosure items
- Document procedures

MANAGEMENT REPRESENTATIONS:
- Obtain representation letter
- Verify all items covered
- Assess completeness
- Address open items

FINAL PROCEDURES:
- Review all audit notes
- Resolve all exceptions
- Verify all adjustments recorded
- Check all evidence obtained

SIGN-OFF READINESS:
- All procedures completed
- All exceptions resolved
- All evidence documented
- Partner review ready
- Audit opinion determined

DOCUMENTATION:
- Final analytical procedures
- Unusual items investigated
- Subsequent events reviewed
- Representations obtained
- Final conclusions`,
      estimatedTime: '8 hours',
      isAIEnabled: true
    }
  }
};

export const QUICK_REFERENCE_GUIDES = {
  ifrs15_recognition_tests: `
IFRS 15 QUICK TEST:
1. Is there a contract? YES/NO → If NO, not revenue
2. What are the obligations? [List]
3. What is transaction price? [Amount]
4. When does control transfer? [Date/Event]
5. Record revenue at [date] for [amount]

TESTING:
☐ Contract exists
☐ Terms documented
☐ Pricing verified
☐ Cutoff correct
☐ Disclosure complete
`,

  ifrs9_ecl_testing: `
IFRS 9 ECL QUICK TEST:
1. What is probability of default? [%]
2. What is loss given default? [%]
3. What is exposure at default? [Amount]
4. ECL = PD × LGD × EAD

TESTING:
☐ Parameters identified
☐ Calculations verified
☐ Assumptions reasonable
☐ Historical rates validated
☐ Disclosure complete
`,

  impairment_testing: `
IAS 36 IMPAIRMENT QUICK TEST:
1. Is there an impairment indicator? YES/NO
2. What is recoverable amount? [Amount]
3. What is carrying amount? [Amount]
4. Impairment = CA - RA (if CA > RA)

TESTING:
☐ Indicators assessed
☐ Value in use/fair value calculated
☐ Calculations verified
☐ Disclosure complete
`,

  consolidation_checklist: `
CONSOLIDATION QUICK CHECKLIST:
☐ Control determination (>50% voting rights or effective control)
☐ All subsidiaries identified
☐ Consolidation date confirmed
☐ Elimination entries prepared:
  - Goodwill calculation
  - Intercompany balances
  - Intercompany transactions
  - Minority interest
☐ Final consolidated statements verified
☐ Disclosures complete
`
};

export default {
  AUDIT_PROMPTS,
  QUICK_REFERENCE_GUIDES
};
