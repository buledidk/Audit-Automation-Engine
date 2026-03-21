/**
 * AUDIT INTELLIGENCE & EVIDENCE FRAMEWORK
 * ============================================================================
 * Comprehensive framework for:
 * 1. AI-enabled audit intelligence at every step
 * 2. Third-party evidence prioritization & reliability ranking
 * 3. Evidence chain of custody & audit trail
 * 4. Partner/Director sign-off workflow
 * 5. Responsible individual accountability
 *
 * Framework: ISA 200, 230, 330, 500, 501, 540, 560, 570
 * ============================================================================
 */

export class AuditIntelligenceFramework {
  constructor(options = {}) {
    this.engagement = options.engagement || {};
    this.auditTrail = [];
    this.evidenceHierarchy = this._buildEvidenceHierarchy();
    this.aiIntelligencePoints = {};
    this.reviewApprovals = {};
    this.documentationMap = {};
  }

  /**
   * EVIDENCE HIERARCHY - Reliability Ranking
   * Framework: ISA 500 - Audit Evidence (paragraphs A14-A43)
   * From Most Reliable to Least Reliable
   */
  _buildEvidenceHierarchy() {
    return {
      1: {
        tier: "HIGHEST",
        category: "EXTERNAL EVIDENCE - THIRD PARTY",
        examples: [
          "Bank confirmations (direct from bank to auditor)",
          "Customer confirmations (receivables, orders)",
          "Vendor confirmations (inventory, payables)",
          "Government registrations (Companies House, tax)",
          "Insurance certificates (from insurer)",
          "Legal confirmations (from external counsel)",
          "Audit confirmations from other auditors",
          "Stock exchange filings (for parent company)"
        ],
        reliability: "HIGHEST",
        auditAssertionCoverage: ["Existence", "Completeness", "Accuracy"],
        aiIntelligence: "Verify source authenticity & detect document fabrication"
      },

      2: {
        tier: "HIGH",
        category: "INTERNAL EVIDENCE - UNDER CLIENT CONTROL",
        examples: [
          "Board minutes & resolutions",
          "Internal audit reports",
          "Bank statements (received directly by auditor)",
          "Signed contracts & agreements",
          "Invoices (sales & purchases)",
          "Delivery notes & shipping documents",
          "Employee timesheets & payroll records",
          "Fixed asset registers with external certifications"
        ],
        reliability: "HIGH",
        auditAssertionCoverage: ["Existence", "Completeness", "Accuracy", "Cutoff"],
        aiIntelligence: "Extract from documents, verify signatures, match to general ledger"
      },

      3: {
        tier: "MEDIUM-HIGH",
        category: "INTERNAL EVIDENCE - MANAGEMENT CREATED",
        examples: [
          "Reconciliations (bank, suppliers, inter-company)",
          "Analytical schedules (aging analysis, variance analysis)",
          "Journal entries (especially period-end adjustments)",
          "Financial reports & analyses",
          "Valuation reports (management-prepared)",
          "Inventory count sheets & movement records",
          "Accrual calculations & provisions"
        ],
        reliability: "MEDIUM-HIGH",
        auditAssertionCoverage: ["Accuracy", "Classification", "Cutoff", "Completeness"],
        aiIntelligence: "Validate calculations, reconcile to source documents, flag unusual items"
      },

      4: {
        tier: "MEDIUM",
        category: "ANALYTICAL PROCEDURES & SYSTEM EVIDENCE",
        examples: [
          "System-generated reports (SAP, accounting system)",
          "Trend analysis & ratios",
          "Analytical procedures (variance investigation)",
          "System access logs & audit trails",
          "Automated control test results",
          "IT change logs & system configurations"
        ],
        reliability: "MEDIUM",
        auditAssertionCoverage: ["Accuracy", "Completeness", "Existence"],
        aiIntelligence: "Analyze patterns, detect anomalies, identify control bypass"
      },

      5: {
        tier: "MEDIUM-LOW",
        category: "MANAGEMENT REPRESENTATIONS & ORAL EVIDENCE",
        examples: [
          "Representations from management/directors",
          "Written confirmations from individuals",
          "Interview notes & discussions",
          "Email confirmations",
          "Oral explanations of accounting policies"
        ],
        reliability: "MEDIUM-LOW",
        auditAssertionCoverage: ["Accuracy", "Classification"],
        aiIntelligence: "Cross-reference with external sources, identify contradictions"
      },

      6: {
        tier: "LOW",
        category: "MANAGEMENT REPRESENTATIONS - HIGH JUDGMENT",
        examples: [
          "Valuation estimates (without independent source)",
          "Going concern assessments (management opinion)",
          "Allowances for doubtful debts (management judgment)",
          "Provision estimates (legal, restructuring)",
          "Fair value measurements (unobservable inputs)",
          "Useful life estimates for depreciation",
          "Recoverability of intangible assets"
        ],
        reliability: "LOW",
        auditAssertionCoverage: ["Accuracy"],
        aiIntelligence: "Compare to external benchmarks, test assumptions, challenge estimates"
      }
    };
  }

  /**
   * EVIDENCE COLLECTION STRATEGY
   * Prioritize collection based on reliability hierarchy
   */
  buildEvidenceStrategy(assertion, fsli, riskLevel) {
    const strategy = {
      fsli: fsli,
      assertion: assertion,
      riskLevel: riskLevel,
      evidencePlan: [],
      requiredEvidence: [],
      prohibitedEvidence: [],
      aiIntelligenceCheckpoints: [],
      partnerReviewPoints: [],
      signOffRequirements: []
    };

    // HIGH RISK = Require highest-tier evidence
    if (riskLevel === "HIGH") {
      strategy.evidencePlan = [
        {
          rank: 1,
          tier: "HIGHEST",
          type: "External Confirmation",
          example: "Bank confirmation, customer order",
          effort: "5-10 items",
          aiCheck: "Verify source is genuine third party, not client-created"
        },
        {
          rank: 2,
          tier: "HIGH",
          type: "Signed Contracts/Documents",
          example: "Customer contracts, vendor agreements",
          effort: "10-20 items",
          aiCheck: "Extract terms, verify signatures, match to recorded amounts"
        },
        {
          rank: 3,
          tier: "MEDIUM-HIGH",
          type: "Management Reconciliations (Auditor-Verified)",
          example: "Bank reconciliation, aging analysis",
          effort: "Verify 100% of reconciling items",
          aiCheck: "Recompute totals, verify source documents, test post-cutoff"
        },
        {
          rank: 4,
          tier: "MEDIUM",
          type: "Analytical Procedures",
          example: "Trend analysis, ratio analysis",
          effort: "Investigate all variances >threshold",
          aiCheck: "Identify outliers, anomalies, correlations"
        }
      ];

      strategy.prohibitedEvidence = [
        "Management representations alone (without corroboration)",
        "Unverified system reports",
        "Oral explanations without supporting evidence",
        "Photocopied documents without originals"
      ];

      strategy.aiIntelligenceCheckpoints = [
        {
          checkpoint: "1. Evidence Authenticity",
          aiRole: "Detect forged documents, fraudulent confirmations, system manipulation",
          process: "Digital forensics, font analysis, metadata review"
        },
        {
          checkpoint: "2. Evidence Completeness",
          aiRole: "Verify all transactions captured, no selective presentation",
          process: "Population testing, sample extrapolation, variance analysis"
        },
        {
          checkpoint: "3. Evidence Accuracy",
          aiRole: "Verify amounts, dates, descriptions match source documents",
          process: "OCR extraction, auto-reconciliation to GL, duplicate detection"
        },
        {
          checkpoint: "4. Evidence Relevance",
          aiRole: "Confirm evidence addresses the specific audit assertion",
          process: "Assertion mapping, relevance scoring, gap analysis"
        }
      ];

      strategy.signOffRequirements = [
        {
          role: "Senior Auditor",
          action: "Review & approve evidence collection plan",
          timing: "Before evidence gathering begins",
          signoffType: "MANDATORY"
        },
        {
          role: "Manager",
          action: "Review high-risk evidence samples (min 5 items per FSLI)",
          timing: "During fieldwork (weekly)",
          signoffType: "MANDATORY"
        },
        {
          role: "Partner",
          action: "Review all evidence for high-risk areas (Revenue, Inventory, etc.)",
          timing: "Before completion of final procedures",
          signoffType: "MANDATORY"
        },
        {
          role: "Responsible Individual/Director",
          action: "Sign evidence acceptance & audit independence confirmation",
          timing: "Before issuing audit opinion",
          signoffType: "MANDATORY"
        }
      ];

    } else if (riskLevel === "MEDIUM") {
      // MEDIUM RISK = Balanced evidence tier
      strategy.evidencePlan = [
        {
          rank: 1,
          tier: "HIGH",
          type: "Control Testing + Limited External Evidence",
          example: "Test internal controls + sample of confirmations",
          effort: "10-15 items"
        },
        {
          rank: 2,
          tier: "MEDIUM-HIGH",
          type: "Internal Reconciliations",
          effort: "20-30 items"
        },
        {
          rank: 3,
          tier: "MEDIUM",
          type: "Analytical Procedures",
          effort: "Investigate variances >10%"
        }
      ];

      strategy.signOffRequirements = [
        {
          role: "Manager",
          action: "Review evidence & testing approach",
          timing: "Weekly during fieldwork",
          signoffType: "MANDATORY"
        },
        {
          role: "Partner",
          action: "Review audit procedures & results",
          timing: "Before final opinion",
          signoffType: "MANDATORY"
        }
      ];

    } else {
      // LOW RISK = Limited procedures with control reliance
      strategy.evidencePlan = [
        {
          rank: 1,
          tier: "MEDIUM-HIGH",
          type: "Control Testing",
          effort: "Verify controls operating (5-10 samples)"
        },
        {
          rank: 2,
          tier: "MEDIUM",
          type: "Limited Substantive Procedures",
          effort: "Analytical review + balance verification"
        }
      ];

      strategy.signOffRequirements = [
        {
          role: "Manager",
          action: "Review control testing & substantive results",
          timing: "As completed",
          signoffType: "STANDARD"
        }
      ];
    }

    return strategy;
  }

  /**
   * DOCUMENTATION CHAIN OF CUSTODY
   * ISA 230 - Audit Documentation
   * Track: Who, What, When, Where, Why for every piece of evidence
   */
  createEvidenceChainOfCustody(evidenceItem) {
    const chainOfCustody = {
      evidenceId: `EV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fsli: evidenceItem.fsli,
      assertion: evidenceItem.assertion,
      sourceDocument: {
        original: evidenceItem.sourceFile,
        format: evidenceItem.format, // PDF, Email, Excel, Paper
        location: evidenceItem.location, // Client finance, Bank, Email
        obtainedFrom: evidenceItem.obtainedFrom, // Bank, Client, Third Party
        obtainedDate: new Date().toISOString(),
        obtainedBy: evidenceItem.collectedBy // Auditor name
      },
      thirdPartyVerification: {
        isThirdParty: evidenceItem.isThirdParty,
        source: evidenceItem.source, // Bank, Customer, Vendor, Government
        reliability: this._assessReliability(evidenceItem.source),
        fabricationRisk: "LOW", // To be assessed by AI
        authenticityChecked: false,
        checkMethod: null // Watermark, Signature, Metadata
      },
      aiIntelligenceProcessing: {
        documentExtracted: false,
        extractedData: null,
        anomaliesDetected: [],
        fraudRiskScore: 0, // 0-100 (100 = high fraud risk)
        recommendations: []
      },
      reviews: {
        auditorReview: {
          status: "PENDING", // PENDING, REVIEWED, QUESTIONED, APPROVED
          reviewer: null,
          reviewDate: null,
          findings: null,
          signoff: null // APPROVED, CONDITIONAL, REJECTED
        },
        managerReview: {
          status: "PENDING",
          reviewer: null,
          reviewDate: null,
          findings: null,
          signoff: null
        },
        partnerReview: {
          status: "PENDING",
          reviewer: null,
          reviewDate: null,
          findings: null,
          signoff: null
        }
      },
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          action: "EVIDENCE_COLLECTED",
          actor: evidenceItem.collectedBy,
          details: `Evidence collected from ${evidenceItem.obtainedFrom}`
        }
      ],
      documentationRequirements: {
        procedureReferenceNumber: null, // WP-2.1.3
        workingPaperLocation: null, // File path or folder
        descriptiveTitle: evidenceItem.title,
        purposeOfEvidence: evidenceItem.purpose,
        conclusionReachedBasedOnEvidence: null,
        referenceToOtherWP: [] // Links to related working papers
      }
    };

    return chainOfCustody;
  }

  /**
   * AI-ENABLED AUDIT INTELLIGENCE AT EACH STEP
   * Integrated intelligence for:
   * - Evidence quality assessment
   * - Fraud risk detection
   * - Anomaly identification
   * - Assumption validation
   * - Completeness verification
   */
  createAIIntelligenceCheckpoint(checkpoint, context) {
    const intelligence = {
      checkpointName: checkpoint.name,
      auditStep: checkpoint.step,
      fsli: checkpoint.fsli,
      assertion: checkpoint.assertion,
      timestamp: new Date().toISOString(),
      aiAnalysis: {
        evidenceQualityScore: null, // 0-100
        fraudRiskIndicators: [],
        anomaliesDetected: [],
        assumptionsValidated: [],
        completenessVerification: null,
        recommendations: []
      },
      intelligence: {}
    };

    // CHECKPOINT 1: Evidence Collection
    if (checkpoint.step === "EVIDENCE_COLLECTION") {
      intelligence.intelligence = {
        sourceAuthenticity: {
          description: "Verify evidence source is legitimate third party",
          aiCheck: "Watermark analysis, digital signature verification, metadata review",
          result: null // PASS, WARN, FAIL
        },
        documentCompleteness: {
          description: "Verify document is complete and not redacted",
          aiCheck: "Page count verification, OCR integrity check, redaction detection",
          result: null
        },
        fraudRiskAssessment: {
          description: "Identify signs of document fabrication or manipulation",
          aiCheck: "Font consistency, date manipulation, amount alteration, signature analysis",
          fraudScore: 0, // 0-100
          riskFactors: []
        }
      };
    }

    // CHECKPOINT 2: Evidence Analysis
    else if (checkpoint.step === "EVIDENCE_ANALYSIS") {
      intelligence.intelligence = {
        dataExtraction: {
          description: "Extract structured data from evidence",
          aiCheck: "OCR + field parsing, data validation, consistency checks",
          extractedData: null,
          confidenceScore: null // 0-100
        },
        recalculation: {
          description: "Verify calculations and formulas",
          aiCheck: "Recompute totals, verify formulas, check for rounding errors",
          issuesFound: []
        },
        reconciliation: {
          description: "Match evidence to general ledger",
          aiCheck: "Amount matching, date matching, description matching",
          discrepancies: []
        },
        anomalyDetection: {
          description: "Identify unusual items or patterns",
          aiCheck: "Outlier analysis, pattern matching, threshold alerts",
          anomalies: []
        }
      };
    }

    // CHECKPOINT 3: Assertion Coverage
    else if (checkpoint.step === "ASSERTION_COVERAGE") {
      intelligence.intelligence = {
        existenceAssertion: {
          description: "Does the item actually exist?",
          aiCheck: "Third-party confirmation, physical inspection evidence",
          status: null // SUPPORTED, PARTIALLY_SUPPORTED, NOT_SUPPORTED
        },
        completenessAssertion: {
          description: "Are all items recorded?",
          aiCheck: "Population testing, cutoff verification, reconciliation to GL",
          status: null
        },
        accuracyAssertion: {
          description: "Are amounts correctly stated?",
          aiCheck: "Recalculation, source document matching, valuation verification",
          status: null
        },
        cutoffAssertion: {
          description: "Recorded in correct period?",
          aiCheck: "Cutoff testing, date analysis, post-period transactions",
          status: null
        },
        classificationAssertion: {
          description: "Proper accounting classification?",
          aiCheck: "GL account mapping, policy compliance, disclosure checklist",
          status: null
        },
        presentationAssertion: {
          description: "Disclosed properly in FS?",
          aiCheck: "Note comparison, disclosure checklist, IFRS compliance",
          status: null
        }
      };
    }

    // CHECKPOINT 4: Assumption Validation
    else if (checkpoint.step === "ASSUMPTION_VALIDATION") {
      intelligence.intelligence = {
        managementEstimates: {
          description: "Challenge valuation & estimate assumptions",
          aiCheck: "Benchmarking, sensitivity analysis, alternative calculations",
          assumptionsValidity: null // REASONABLE, QUESTIONABLE, UNSUPPORTED
        },
        historicalAccuracy: {
          description: "Review management's prior estimate accuracy",
          aiCheck: "Actual vs estimates, tracking systematic bias",
          accuracy: null
        },
        comparativeIndustry: {
          description: "Compare to industry benchmarks",
          aiCheck: "Peer comparison, market data, regulatory guidance",
          comparison: null
        }
      };
    }

    return intelligence;
  }

  /**
   * PARTNER & RESPONSIBLE INDIVIDUAL SIGN-OFF WORKFLOW
   * ISA 210 - Engagement Letter
   * ISA 700 - Audit Opinion Formation
   * ISA 260 - Governance Communication
   */
  createSignOffWorkflow(engagement) {
    const workflow = {
      engagementId: engagement.id,
      signOffRequired: true,
      signOffStages: [
        {
          stage: 1,
          stageName: "ENGAGEMENT ACCEPTANCE",
          signedBy: "PARTNER",
          requiredFor: "Audit commencement",
          approvalContent: {
            auditScopeAcceptance: "Partner accepts audit scope & ISA standards",
            materialityApproval: "Partner approves overall & performance materiality",
            teamQualification: "Partner confirms team has required competence",
            independenceConfirmation: "Partner confirms audit independence (APES 110)",
            engagementTerms: "Partner approves engagement letter terms"
          },
          timeline: "Before fieldwork begins",
          evidence: "Signed engagement letter in file"
        },

        {
          stage: 2,
          stageName: "AUDIT STRATEGY & PLANNING APPROVAL",
          signedBy: "PARTNER + RESPONSIBLE INDIVIDUAL",
          requiredFor: "Before interim/final fieldwork",
          approvalContent: {
            auditStrategy: "Partner approves audit strategy per ISA 300",
            riskAssessment: "Partner approves assessed risk levels per FSLI",
            materiality: "Partner re-confirms materiality allocation",
            auditProcedures: "Partner approves procedure selection",
            reviewDates: "Partner schedules manager/partner reviews during fieldwork"
          },
          timeline: "Risk assessment phase end",
          evidence: "Strategy approval memo in engagement file"
        },

        {
          stage: 3,
          stageName: "INTERIM AUDIT APPROVAL",
          signedBy: "MANAGER + PARTNER",
          requiredFor: "Completion of interim phase",
          approvalContent: {
            controlsEvaluation: "Manager reviews control design & operating effectiveness",
            controlDeficiencies: "Manager identifies & documents control deficiencies",
            significantDeficiencies: "Partner determines if deficiencies are 'significant'",
            materialWeakness: "Partner assesses if control weakness = material weakness",
            interimConclusionChanges: "Partner approves changes to audit strategy based on interim"
          },
          timeline: "Interim audit completion",
          evidence: "Interim audit memo with manager/partner sign-off"
        },

        {
          stage: 4,
          stageName: "FINAL AUDIT EVIDENCE REVIEW",
          signedBy: "MANAGER (weekly) + PARTNER (pre-opinion)",
          requiredFor: "Final audit procedures & evidence adequacy",
          approvalContent: {
            evidenceSufficiency: "Manager verifies evidence collected supports conclusions",
            highRiskApprovals: "Partner reviews HIGH risk areas (Revenue, Inventory, etc.)",
            exceptionResolution: "Manager documents resolution of all exceptions",
            estimatesChallenge: "Partner challenges management estimates (IFRS 13, IFRS 15)",
            relatedPartyReview: "Partner reviews all related party transactions",
            fraudAssessment: "Partner reviews fraud risk assessment & procedures performed"
          },
          timeline: "During final fieldwork (weekly) & before opinion",
          evidence: "Review memos, exception logs, evidence working papers"
        },

        {
          stage: 5,
          stageName: "MANAGEMENT REPRESENTATIONS & SUBSEQUENT EVENTS",
          signedBy: "MANAGER + PARTNER",
          requiredFor: "Before final audit report issuance",
          approvalContent: {
            representationLetter: "Partner reviews & approves management representation letter",
            managementRepresentations: "Partner verifies all key representations obtained",
            subseqEventProcedures: "Partner approves subsequent event search procedures",
            goingConcernAssessment: "Partner evaluates going concern per ISA 570",
            contingencies: "Partner reviews contingencies & commitments"
          },
          timeline: "Final days before opinion",
          evidence: "Management rep letter, subsequent events memo"
        },

        {
          stage: 6,
          stageName: "AUDIT COMPLETION REVIEW",
          signedBy: "PARTNER (MANDATORY)",
          requiredFor: "Audit opinion formation",
          approvalContent: {
            auditObjectives: "Partner confirms all audit objectives achieved",
            auditConclusionsSupport: "Partner verifies conclusions supported by sufficient evidence",
            allMattersMatter: "Partner confirms all matters subject to ISA covered",
            disclosuresAdequate: "Partner confirms FS disclosures adequate per IFRS",
            kaM: "Partner identifies Key Audit Matters per ISA 701",
            modifiedOpinion: "Partner assesses if modified opinion required"
          },
          timeline: "Final review before opinion",
          evidence: "Audit completion review memo, partner sign-off"
        },

        {
          stage: 7,
          stageName: "GOVERNANCE COMMUNICATION",
          signedBy: "PARTNER",
          requiredFor: "Communication with those charged with governance",
          approvalContent: {
            governanceReport: "Partner approves ISA 260 governance communication",
            significantMatters: "Partner reports significant findings to Board/Audit Committee",
            internalControls: "Partner reports control deficiencies per ISA 265",
            auditIndependence: "Partner confirms continuing independence",
            materiality: "Partner communicates materiality & why",
            kaM: "Partner discusses Key Audit Matters with Board"
          },
          timeline: "Before audit opinion released",
          evidence: "ISA 260 communication letter in engagement file"
        },

        {
          stage: 8,
          stageName: "FINAL SIGN-OFF BY RESPONSIBLE INDIVIDUAL",
          signedBy: "RESPONSIBLE INDIVIDUAL / DIRECTOR",
          requiredFor: "Audit opinion issuance",
          approvalContent: {
            auditCompletionConfirmation: "RI confirms all audit procedures completed per ISA",
            auditQualityAssurance: "RI confirms QA review completed (AQRT)",
            opinionFormationSupport: "RI confirms opinion supported by sufficient evidence",
            irregularitiesFramework: "RI confirms irregularities assessment per JSA 240",
            communicationWithManagement: "RI confirms all required communications made",
            documentationCompletion: "RI confirms audit file complete per ISA 230",
            publiclyListed: "RI confirms audit meeting public audit standards"
          },
          timeline: "Final sign-off before issuing opinion",
          evidence: "RI sign-off form, audit opinion with RI signature"
        }
      ],

      signOffTracking: {
        stage1Status: "PENDING",
        stage2Status: "PENDING",
        stage3Status: "PENDING",
        stage4Status: "PENDING",
        stage5Status: "PENDING",
        stage6Status: "PENDING",
        stage7Status: "PENDING",
        stage8Status: "PENDING"
      },

      requiredSignatures: [
        {
          role: "PARTNER",
          name: null,
          position: "Engagement Partner",
          signature: null,
          date: null,
          approval: null // APPROVED, CONDITIONAL, REJECTED
        },
        {
          role: "RESPONSIBLE_INDIVIDUAL",
          name: null,
          position: "Responsible Individual / Signing Director",
          signature: null,
          date: null,
          approval: null
        },
        {
          role: "QUALITY_ASSURANCE_REVIEWER",
          name: null,
          position: "Quality Assurance Reviewer (if applicable)",
          signature: null,
          date: null,
          approval: null
        }
      ],

      approvalAuditTrail: [
        {
          timestamp: new Date().toISOString(),
          stage: "INITIATED",
          actor: "System",
          action: "Sign-off workflow created for engagement"
        }
      ]
    };

    return workflow;
  }

  /**
   * COMPREHENSIVE AUDIT DOCUMENTATION MAP
   * ISA 230 - Audit Documentation
   * Connect every piece of evidence to audit objectives & assertions
   */
  createComprehensiveDocumentationMap(engagement) {
    const map = {
      engagementId: engagement.id,
      documentationStructure: {
        "1-PLANNING": {
          folder: "1-PLANNING",
          contents: {
            "1.1": {
              workingPaperRef: "WP-1.1",
              title: "Engagement Letter (ISA 210)",
              objective: "Document audit scope, terms, and conditions",
              signedBy: "Partner, Client",
              evidence: ["Signed engagement letter"],
              assertion: ["N/A - Planning"]
            },
            "1.2": {
              workingPaperRef: "WP-1.2",
              title: "Overall Audit Strategy (ISA 300)",
              objective: "Document audit strategy and risk response",
              signedBy: "Partner",
              evidence: ["Strategy memo with materiality, procedures, team", "Subsequent strategy changes"],
              assertion: ["All assertions - used throughout audit"]
            },
            "1.3": {
              workingPaperRef: "WP-1.3",
              title: "Materiality Calculation (ISA 320)",
              objective: "Document overall and performance materiality",
              signedBy: "Partner",
              evidence: [
                "Materiality calculation spreadsheet",
                "Sensitivity analysis",
                "Benchmark selection justification",
                "Performance materiality (75%)",
                "Trivial threshold (5%)"
              ],
              assertion: ["All assertions"]
            },
            "1.4": {
              workingPaperRef: "WP-1.4",
              title: "Team Composition & Independence (APES 110)",
              objective: "Document team members, qualifications, and independence",
              signedBy: "Partner",
              evidence: ["Team member names, qualifications, experience", "Independence confirmations", "Ethics confirmations"],
              assertion: ["N/A - Compliance"]
            }
          }
        },

        "2-RISK ASSESSMENT": {
          folder: "2-RISK ASSESSMENT",
          contents: {
            "2.1": {
              workingPaperRef: "WP-2.1",
              title: "Inherent Risk Assessment per FSLI (ISA 315, ISA 240)",
              objective: "Assess inherent risk for each financial statement line item",
              signedBy: "Senior Auditor, Manager, Partner",
              evidenceRequired: {
                revenue: "Risk factors, prior year issues, industry risk, management judgment",
                inventory: "Complexity, prior issues, valuation method",
                receivables: "Credit risk, concentration, prior exceptions",
                payables: "Accuracy, cutoff risk, completeness",
                pp_e: "Valuation, depreciation, prior issues"
              },
              assertion: ["Existence", "Completeness", "Accuracy"]
            },
            "2.2": {
              workingPaperRef: "WP-2.2",
              title: "Control Environment Assessment (ISA 315)",
              objective: "Assess control environment & governance",
              signedBy: "Manager, Partner",
              evidence: ["Board minutes", "Internal audit reports", "Risk management policies"],
              assertion: ["All assertions"]
            },
            "2.3": {
              workingPaperRef: "WP-2.3",
              title: "Significant Risks & Risk Factors (ISA 240, ISA 315)",
              objective: "Identify and document significant risks (esp. fraud risk)",
              signedBy: "Partner",
              evidence: [
                "Fraud risk brainstorming memo",
                "Going concern risk assessment",
                "Related party assessment",
                "New accounting standard impacts"
              ],
              assertion: ["All assertions"]
            },
            "2.4": {
              workingPaperRef: "WP-2.4",
              title: "Control Identification & Assessment (ISA 315)",
              objective: "Document key controls by transaction cycle and assertion",
              signedBy: "Senior Auditor, Manager",
              evidence: [
                "Control matrix (controls vs assertions)",
                "Transaction cycle documentation",
                "Systems walkthrough notes",
                "Control design effectiveness assessment"
              ],
              assertion: ["All assertions"]
            }
          }
        },

        "3-INTERIM AUDIT": {
          folder: "3-INTERIM AUDIT",
          contents: {
            "3.1": {
              workingPaperRef: "WP-3.1",
              title: "Control Design & Operation Testing (ISA 330)",
              objective: "Test design and operating effectiveness of key controls",
              signedBy: "Senior Auditor, Manager, Partner",
              evidence: [
                "Control test procedures & results per control",
                "Sample selection methodology",
                "Test results (passing/exceptions)",
                "Exception documentation & management response"
              ],
              assertion: ["All assertions - basis for testing strategy"]
            },
            "3.2": {
              workingPaperRef: "WP-3.2",
              title: "Interim Procedures Conclusion Memo",
              objective: "Document conclusions on control effectiveness",
              signedBy: "Manager, Partner",
              evidence: [
                "Control deficiency summary",
                "Changes to audit strategy based on interim findings",
                "Update to performance materiality if needed",
                "Significant deficiency & material weakness assessment"
              ],
              assertion: ["All assertions"]
            }
          }
        },

        "4-FINAL AUDIT - SUBSTANTIVE PROCEDURES": {
          folder: "4-FINAL AUDIT - SUBSTANTIVE PROCEDURES",
          contents: {
            "4.1": {
              workingPaperRef: "WP-4.1",
              title: "Revenue Substantive Procedures (ISA 330, ISA 501)",
              objective: "Obtain sufficient appropriate evidence for Revenue assertion",
              fsli: "REVENUE",
              procedures: [
                "Customer confirmations (Existence)",
                "Sales journal review & cutoff testing (Completeness, Cutoff)",
                "Sample invoice testing to shipping docs (Accuracy, Existence)",
                "Analytical procedures on revenue trends (Analytical)",
                "Review of period-end journal entries (Period-end transactions)"
              ],
              signedBy: "Senior Auditor, Manager, Partner",
              assertion: ["Existence", "Completeness", "Accuracy", "Cutoff", "Classification"]
            },
            "4.2": {
              workingPaperRef: "WP-4.2",
              title: "Inventory Substantive Procedures (ISA 330, ISA 501)",
              objective: "Obtain evidence for Inventory balance assertion",
              fsli: "INVENTORY",
              procedures: [
                "Attendance at inventory count (Existence, Completeness)",
                "Test count procedures & cutoff (Accuracy, Completeness)",
                "NRV testing on sample (Accuracy/Valuation)",
                "Slow-moving item identification (Valuation)",
                "Analytical procedures (Analytical)"
              ],
              signedBy: "Senior Auditor, Manager, Partner",
              assertion: ["Existence", "Completeness", "Accuracy", "Valuation"]
            },
            "4.3": {
              workingPaperRef: "WP-4.3",
              title: "Receivables Substantive Procedures (ISA 330, ISA 501)",
              objective: "Obtain evidence for Receivables balance",
              fsli: "RECEIVABLES",
              procedures: [
                "Customer confirmations (Existence)",
                "Aged receivables analysis (Completeness, Accuracy)",
                "Credit limit review (Authorization)",
                "Post-balance sheet collections (Cutoff)",
                "Allowance testing (Valuation)"
              ],
              signedBy: "Senior Auditor, Manager, Partner",
              assertion: ["Existence", "Completeness", "Accuracy", "Valuation"]
            }
          }
        },

        "5-COMPLETION PROCEDURES": {
          folder: "5-COMPLETION PROCEDURES",
          contents: {
            "5.1": {
              workingPaperRef: "WP-5.1",
              title: "Going Concern Assessment (ISA 570)",
              objective: "Evaluate going concern assumption and identify disclosure needs",
              signedBy: "Partner",
              evidence: [
                "Going concern risk factors assessment",
                "Management going concern evaluation",
                "Subsequent event review",
                "Management representations on going concern",
                "Disclosure review per IAS 1"
              ],
              assertion: ["Going Concern"]
            },
            "5.2": {
              workingPaperRef: "WP-5.2",
              title: "Subsequent Events Review (ISA 560)",
              objective: "Identify and evaluate subsequent events",
              signedBy: "Manager, Partner",
              evidence: [
                "Subsequent events search procedures performed",
                "Bank confirmations",
                "Board minutes post year-end",
                "Subsequent customer/vendor confirmations",
                "Post-balance sheet journal entries"
              ],
              assertion: ["All assertions - subsequent events"]
            },
            "5.3": {
              workingPaperRef: "WP-5.3",
              title: "Management Representations Letter (ISA 580)",
              objective: "Obtain written representations from management",
              signedBy: "Partner, Management",
              evidence: ["Signed management representation letter"],
              assertion: ["All assertions - high-level confirmations"]
            }
          }
        },

        "6-REPORTING": {
          folder: "6-REPORTING",
          contents: {
            "6.1": {
              workingPaperRef: "WP-6.1",
              title: "Audit Completion Review Memo (ISA 700)",
              objective: "Document that all audit objectives achieved",
              signedBy: "Partner",
              evidence: [
                "Review that all assertions covered",
                "Review that all procedures completed",
                "Review that evidence sufficient & appropriate",
                "Assessment of uncorrected/detected misstatements",
                "Final materiality assessment"
              ],
              assertion: ["All assertions"]
            },
            "6.2": {
              workingPaperRef: "WP-6.2",
              title: "Audit Opinion & Report (ISA 700, ISA 701, ISA 260)",
              objective: "Document audit opinion and governance communication",
              signedBy: "Partner, Responsible Individual",
              evidence: ["Auditor's report with opinion", "ISA 260 governance letter", "Key Audit Matters (if listed)"],
              assertion: ["All assertions - final opinion"]
            }
          }
        }
      },

      documentationChecklist: {
        "Planning Phase": [
          "☐ Engagement letter signed",
          "☐ Audit strategy documented & approved",
          "☐ Materiality calculated & approved",
          "☐ Team assigned & independence confirmed"
        ],
        "Risk Assessment Phase": [
          "☐ Inherent risk assessed per FSLI",
          "☐ Fraud risk assessed per ISA 240",
          "☐ Control environment evaluated",
          "☐ Significant risks identified",
          "☐ Key controls documented"
        ],
        "Interim Phase": [
          "☐ Control procedures tested",
          "☐ Control deficiencies documented",
          "☐ Operating effectiveness confirmed for reliance controls",
          "☐ Strategy updated based on interim findings"
        ],
        "Final Phase": [
          "☐ All substantive procedures completed",
          "☐ High-risk areas reviewed by manager/partner",
          "☐ Exceptions documented & resolved",
          "☐ Estimates challenged & documented"
        ],
        "Completion Phase": [
          "☐ Going concern assessment documented",
          "☐ Subsequent events procedures documented",
          "☐ Management representation letter obtained",
          "☐ Disclosures completeness checklist completed"
        ],
        "Reporting Phase": [
          "☐ Completion review memo signed by partner",
          "☐ Opinion issued and signed",
          "☐ Governance communication sent",
          "☐ Key Audit Matters identified (if applicable)"
        ]
      }
    };

    return map;
  }

  // ========== HELPER METHODS ==========

  _assessReliability(source) {
    const reliabilityMap = {
      "Bank": "HIGHEST",
      "Customer": "HIGHEST",
      "Vendor": "HIGHEST",
      "Government": "HIGHEST",
      "Insurance": "HIGHEST",
      "Legal Counsel": "HIGHEST",
      "Board Minutes": "HIGH",
      "Internal Audit": "HIGH",
      "Signed Contract": "HIGH",
      "Invoice": "HIGH",
      "Delivery Note": "HIGH",
      "Reconciliation": "MEDIUM-HIGH",
      "Journal Entry": "MEDIUM-HIGH",
      "System Report": "MEDIUM",
      "Management Analysis": "MEDIUM",
      "Management Estimate": "LOW",
      "Management Representation": "MEDIUM-LOW",
      "Oral Evidence": "MEDIUM-LOW"
    };

    return reliabilityMap[source] || "MEDIUM";
  }
}

export default AuditIntelligenceFramework;
