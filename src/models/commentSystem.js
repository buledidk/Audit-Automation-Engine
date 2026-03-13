/**
 * COMPREHENSIVE AUDIT WORKPAPER COMMENTING & ANNOTATION SYSTEM
 * ═════════════════════════════════════════════════════════════════════
 *
 * A complete commenting framework supporting:
 * - Multiple comment types with different purposes
 * - Thread-based discussions with resolutions
 * - Smart suggestions based on testing context
 * - Templates for common audit documentation
 * - Full audit trail and compliance checking
 * - Analytics for comment patterns and insights
 */

// ═════════════════════════════════════════════════════════════════════
// COMMENT TYPE DEFINITIONS
// ═════════════════════════════════════════════════════════════════════

export const COMMENT_TYPES = {
  PREPARER_NOTES: {
    id: "preparer_notes",
    label: "Preparer Notes",
    icon: "✍️",
    color: "#42A5F5",
    description: "What we did and why - documenting procedures performed",
    required: false,
    defaultTemplate: "procedures_performed"
  },
  REVIEWER_COMMENT: {
    id: "reviewer_comment",
    label: "Reviewer Comment",
    icon: "💬",
    color: "#F5A623",
    description: "Reviewer feedback, queries, or approvals",
    required: true,
    workflow: "requires_response"
  },
  TEAM_DISCUSSION: {
    id: "team_discussion",
    label: "Team Discussion",
    icon: "👥",
    color: "#CE93D8",
    description: "Team deliberation, judgments, and decisions",
    required: false,
    threadable: true
  },
  MGMT_COMMUNICATION: {
    id: "mgmt_communication",
    label: "Management Communication",
    icon: "📞",
    color: "#FF7043",
    description: "What was asked of client, responses received",
    required: false,
    trackable: true
  },
  EXCEPTION_FOUND: {
    id: "exception_found",
    label: "Exception Found",
    icon: "⚠️",
    color: "#EF5350",
    description: "Details of issues, errors, or non-compliance found",
    required: true,
    priority: "critical"
  },
  FOLLOW_UP_ITEM: {
    id: "follow_up_item",
    label: "Follow-up Item",
    icon: "📌",
    color: "#FFA726",
    description: "Next steps, outstanding items, action items",
    required: false,
    trackable: true
  },
  EVIDENCE_REFERENCE: {
    id: "evidence_reference",
    label: "Evidence Reference",
    icon: "🔗",
    color: "#66BB6A",
    description: "Link to external files, emails, confirmations",
    required: false,
    linkable: true
  }
};

// ═════════════════════════════════════════════════════════════════════
// COMMENT PRIORITY LEVELS
// ═════════════════════════════════════════════════════════════════════

export const PRIORITY_LEVELS = {
  ROUTINE: { id: "routine", label: "Routine", color: "#90CAF9", order: 1 },
  IMPORTANT: { id: "important", label: "Important", color: "#FFA726", order: 2 },
  CRITICAL: { id: "critical", label: "Critical", color: "#EF5350", order: 3 }
};

// ═════════════════════════════════════════════════════════════════════
// RESOLUTION STATUS
// ═════════════════════════════════════════════════════════════════════

export const RESOLUTION_STATUS = {
  OPEN: { id: "open", label: "Open", color: "#42A5F5", icon: "🔵" },
  IN_PROGRESS: { id: "in_progress", label: "In Progress", color: "#FFA726", icon: "🟠" },
  RESOLVED: { id: "resolved", label: "Resolved", color: "#66BB6A", icon: "✅" },
  ACKNOWLEDGED: { id: "acknowledged", label: "Acknowledged", color: "#9575CD", icon: "👁️" },
  CLOSED: { id: "closed", label: "Closed", color: "#90A4AE", icon: "⏹️" }
};

// ═════════════════════════════════════════════════════════════════════
// CONFIDENTIALITY LEVELS
// ═════════════════════════════════════════════════════════════════════

export const CONFIDENTIALITY_LEVELS = {
  STANDARD: { id: "standard", label: "Standard", description: "Normal audit documentation" },
  RESTRICTED: { id: "restricted", label: "Restricted", description: "Sensitive findings, partner eyes only" },
  EXTERNAL_ONLY: { id: "external_only", label: "External Only", description: "For client communication only" }
};

// ═════════════════════════════════════════════════════════════════════
// COMMENT TEMPLATES BY CATEGORY
// ═════════════════════════════════════════════════════════════════════

export const COMMENT_TEMPLATES = {
  // Sampling documentation templates
  sampling_selection: {
    name: "Sample items selected as follows...",
    category: "procedures",
    type: "preparer_notes",
    template: `Sample items selected as follows:
- Population: [describe full population tested]
- Sample size: [number of items selected]
- Selection method: [random/systematic/stratified/judgmental]
- Basis: [materiality calculation, ISA 530 guidance]
- Items selected: [reference to detail schedule/listing]

Rationale: [explain why this sample provides sufficient appropriate audit evidence]`,
    useCases: ["revenue testing", "receivables", "inventory", "payables", "asset testing"],
    isRequired: false
  },

  exception_summary: {
    name: "All exceptions were...",
    category: "findings",
    type: "exception_found",
    template: `All exceptions were:
[✓] Adjusted by management (list exceptions)
[✓] Individually immaterial but monitored (list)
[✓] Resolved by management action (describe)
[ ] Recorded as unadjusted misstatement

Summary of exceptions:
- Number of exceptions identified: [X]
- Total value of exceptions: [£X]
- % of materiality: [X%]
- Assessment: [qualitative assessment of significance]`,
    useCases: ["all testing procedures"],
    isRequired: true
  },

  conclusion_template: {
    name: "Based on our testing...",
    category: "conclusions",
    type: "preparer_notes",
    template: `Based on our testing of [assertion] in [account], we obtained sufficient appropriate audit evidence that:
- [Description of what we tested and found]
- [Any exceptions identified and their resolution]
- [Conclusion re: whether assertion is satisfied]

Evidence obtained:
- Testing procedures: [list procedures performed]
- Sample items: [X items tested from population of X]
- Exceptions: [number and nature]
- Analytical procedures: [if performed]

Conclusion: [We are satisfied that this assertion is fairly stated in accordance with [framework]]`,
    useCases: ["all substantive testing"],
    isRequired: true
  },

  mgmt_representation: {
    name: "Management represented that...",
    category: "representations",
    type: "mgmt_communication",
    template: `Management represented that:
- [Complete list of management representations obtained]
- Representation letter dated: [date]
- Signatories: [names and titles]
- Key matters covered: [areas of focus]

Our follow-up:
- [How we corroborated representations]
- [Any inconsistencies identified]
- [Resolution of any conflicts]

Assessment: Management representations are consistent with audit evidence obtained.`,
    useCases: ["completion procedures"],
    isRequired: true
  },

  clean_testing: {
    name: "No exceptions noted in our testing",
    category: "findings",
    type: "preparer_notes",
    template: `No exceptions noted in our testing of [procedure description]:
- [Sample/Population description]
- Testing method: [procedures applied]
- Sample size: [X items from population of X]
- Result: No exceptions identified
- Conclusion: [Assertion is supported by audit evidence]

This substantive testing supports the recorded balance of £[X]`,
    useCases: ["all testing procedures"],
    isRequired: false
  },

  // Industry-specific templates
  construction_revenue: {
    name: "Construction: Revenue Recognition Testing",
    category: "industry_specific",
    industry: "construction",
    type: "preparer_notes",
    template: `Revenue Recognition - Construction Industry (IFRS 15):
- Contract identifier: [reference]
- Performance obligation: [delivery of goods/services]
- Progress method: [percentage of completion calculation]
- Progress percentage as at [date]: [X%]

Testing performed:
- Reviewed original contract terms and amendments
- Obtained and tested [X] contracts for revenue recognized in period
- Verified performance status: [X% complete by [method]]
- Recalculated revenue recognition: [detail calculation]
- Verified warranty provisions: [assessment]

Sample exceptions:
[Document any over/under recognition]

Conclusion: Revenue recognized in accordance with IFRS 15`,
    isRequired: false
  },

  manufacturing_inventory: {
    name: "Manufacturing: Inventory Valuation",
    category: "industry_specific",
    industry: "manufacturing",
    type: "preparer_notes",
    template: `Inventory Valuation - Manufacturing (IFRS 2 / FRS 102):
- Inventory count date: [date]
- Count observers: [names]
- WIP stage: [raw materials / work in process / finished goods]

Costing methodology:
- Method applied: [FIFO / LIFO / weighted average / standard cost]
- Absorption vs marginal: [which method]
- Allocation basis: [how overheads allocated]

Testing performed:
- [X] inventory items tested
- Cost verification: [method of verification]
- NRV assessment: [testing for obsolescence, slow-moving items]
- Cut-off testing: [goods in transit, consignment]

Exceptions: [detail any variances found]

Conclusion: Inventory is fairly valued at [amount]`,
    isRequired: false
  }
};

// ═════════════════════════════════════════════════════════════════════
// SMART COMMENT SUGGESTIONS ENGINE
// ═════════════════════════════════════════════════════════════════════

export const COMMENT_SUGGESTIONS = {
  // Based on testing results
  testing_results: {
    exceptions_found: {
      suggestedType: "exception_found",
      template: "exception_summary",
      priority: "critical",
      message: "Exceptions detected - recommend detailed exception comment"
    },
    no_exceptions: {
      suggestedType: "preparer_notes",
      template: "clean_testing",
      priority: "routine",
      message: "Testing clean - suggest clean testing conclusion"
    },
    partial_exceptions: {
      suggestedType: "exception_found",
      template: "exception_summary",
      priority: "important",
      message: "Some exceptions found - ensure all documented"
    }
  },

  // Based on procedure type
  procedure_type: {
    confirmations: {
      suggestedType: "evidence_reference",
      message: "Link confirmation evidence to this testing"
    },
    analytical: {
      suggestedType: "preparer_notes",
      message: "Document analytical procedure results and conclusions"
    },
    sampling: {
      suggestedType: "preparer_notes",
      template: "sampling_selection",
      message: "Document sample selection methodology"
    },
    inspection: {
      suggestedType: "preparer_notes",
      message: "Describe items inspected and findings"
    }
  },

  // Based on risk level
  risk_level: {
    high_risk: {
      suggestedType: "preparer_notes",
      priority: "critical",
      message: "High-risk area - ensure comprehensive documentation of procedures"
    },
    medium_risk: {
      suggestedType: "preparer_notes",
      priority: "important",
      message: "Medium-risk area - standard documentation recommended"
    },
    low_risk: {
      suggestedType: "preparer_notes",
      priority: "routine",
      message: "Low-risk area - brief summary documentation sufficient"
    }
  },

  // Based on prior year issues
  prior_year: {
    repeated_issue: {
      suggestedType: "reviewer_comment",
      priority: "critical",
      message: "Prior year exception identified again - ensure adequate procedures"
    },
    resolved_issue: {
      suggestedType: "preparer_notes",
      message: "Prior year issue now resolved - document resolution"
    }
  },

  // Based on ISA requirements
  audit_standards: {
    isa_540_accounting_estimates: {
      suggestedType: "preparer_notes",
      message: "ISA 540 requires documentation of estimate review procedures"
    },
    isa_501_inventory: {
      suggestedType: "preparer_notes",
      template: "manufacturing_inventory",
      message: "ISA 501 - Inventory attendance and valuation procedures"
    },
    isa_505_confirmations: {
      suggestedType: "evidence_reference",
      message: "ISA 505 - Link confirmation procedures to testing WP"
    }
  }
};

// ═════════════════════════════════════════════════════════════════════
// COMMENT DATA MODEL
// ═════════════════════════════════════════════════════════════════════

export const CommentModel = {
  // Core comment structure
  id: "uuid",
  engagementId: "string - reference to engagement",
  workingPaperId: "string - ref A1, D3, etc.",
  workingPaperSection: "string - optional section within WP",

  // Content
  commentType: "enum - from COMMENT_TYPES",
  text: "string - the actual comment text",
  templateId: "string - if from template",

  // Metadata
  createdBy: {
    userId: "string",
    name: "string",
    email: "string",
    role: "partner | manager | senior | junior"
  },
  createdAt: "timestamp",
  updatedAt: "timestamp - last edit",

  // Resolution tracking
  status: "enum - from RESOLUTION_STATUS",
  resolvedBy: { userId: "string", name: "string" },
  resolvedAt: "timestamp",
  resolutionNotes: "string - how it was resolved",

  // Priority & importance
  priority: "enum - routine | important | critical",
  confidentiality: "enum - standard | restricted | external_only",

  // Threading & linking
  parentCommentId: "uuid - if reply to another comment",
  replies: ["array of comment IDs"],
  linkedDocuments: [
    {
      documentId: "string",
      documentType: "email | file | confirmation | evidence",
      fileName: "string",
      fileUrl: "string",
      description: "string"
    }
  ],
  linkedPriorYearWp: "string - reference to prior year WP",

  // Mentions
  mentions: [
    {
      userId: "string",
      name: "string",
      email: "string",
      mentionedAt: "timestamp"
    }
  ],

  // Audit trail
  editHistory: [
    {
      timestamp: "timestamp",
      editedBy: { userId: "string", name: "string" },
      originalText: "string",
      newText: "string",
      reason: "string"
    }
  ],

  // Compliance
  requiresResponse: "boolean",
  responseDeadline: "timestamp - if required",
  respondedBy: { userId: "string", name: "string" },
  respondedAt: "timestamp",

  // Tags for filtering
  tags: ["array of strings"]
};

// ═════════════════════════════════════════════════════════════════════
// WORKPAPER-LEVEL COMMENT SECTIONS
// ═════════════════════════════════════════════════════════════════════

export const WORKPAPER_COMMENT_SECTIONS = {
  objective: {
    title: "Audit Objective",
    required: true,
    example: "To obtain sufficient appropriate audit evidence regarding the completeness and accuracy of revenue recorded in the financial statements for the year ended 31 December 2024."
  },

  scope: {
    title: "Scope Description",
    required: true,
    example: "Population: All sales transactions recorded in the revenue journal for the period 1 January - 31 December 2024 (total £X). Sample: [X items selected using [method]]."
  },

  procedures: {
    title: "Procedures Performed",
    required: true,
    example: "1. Obtained and reviewed sales contracts\n2. Selected sample of X sales transactions\n3. Agreed to supporting documentation\n4. Recalculated revenue recognition calculations"
  },

  results: {
    title: "Results Summary",
    required: true,
    example: "Testing identified [X] exceptions: [list exceptions]. [Assessment of significance and nature of exceptions]"
  },

  conclusion: {
    title: "Conclusion",
    required: true,
    example: "Based on our testing, we are satisfied that the revenue assertion is fairly stated in accordance with [framework] and no adjustments are required."
  },

  reviewer_signoff: {
    title: "Reviewer Sign-off",
    required: true,
    fields: ["reviewedBy", "reviewDate", "reviewerInitials", "reviewNotes"]
  }
};

// ═════════════════════════════════════════════════════════════════════
// STAGE-LEVEL COMMENT SECTIONS
// ═════════════════════════════════════════════════════════════════════

export const STAGE_COMMENT_SECTIONS = {
  planning: {
    phase: "planning",
    sections: [
      {
        id: "engagement_strategy",
        title: "Engagement Strategy",
        comments: ["Overall approach", "Risk assessment strategy", "Testing strategy"]
      },
      {
        id: "materiality",
        title: "Materiality Determination",
        comments: ["Benchmarking basis", "OM calculation", "PM calculation", "Trivial threshold"]
      },
      {
        id: "team_allocation",
        title: "Team Allocation & Roles",
        comments: ["Partner role", "Manager role", "Senior auditor role", "Team capability"]
      }
    ]
  },

  riskAssessment: {
    phase: "riskAssessment",
    sections: [
      {
        id: "key_risks",
        title: "Key Risks Identified",
        comments: ["Significant audit risks", "Entity risks", "Fraud risks"]
      },
      {
        id: "fraud_assessment",
        title: "Fraud Assessment",
        comments: ["Fraud brainstorming results", "Management override risks", "Fraud response"]
      },
      {
        id: "going_concern",
        title: "Going Concern Assessment",
        comments: ["Assessment conclusion", "Risk factors", "Management plans"]
      }
    ]
  },

  interim: {
    phase: "interim",
    sections: [
      {
        id: "control_reliance",
        title: "Control Reliance Determination",
        comments: ["Design testing results", "Operating testing results", "Reliance decision"]
      },
      {
        id: "substantive_plan",
        title: "Substantive Testing Plan",
        comments: ["Testing approach", "Sample sizes", "Materiality application"]
      }
    ]
  },

  final: {
    phase: "finalAudit",
    sections: [
      {
        id: "fsli_summary",
        title: "FSLI Testing Summary",
        comments: ["Overall testing results", "Key findings", "Exceptions summary"]
      },
      {
        id: "exceptions",
        title: "Exceptions & Adjustments",
        comments: ["Adjusted misstatements", "Unadjusted misstatements", "Quantitative assessment"]
      }
    ]
  },

  completion: {
    phase: "completion",
    sections: [
      {
        id: "subsequent_events",
        title: "Subsequent Events Review",
        comments: ["Events identified", "Accounting treatment", "Disclosure requirements"]
      },
      {
        id: "representations",
        title: "Management Representations",
        comments: ["Representations obtained", "Consistency assessment"]
      },
      {
        id: "disclosure_checklist",
        title: "Disclosure Compliance",
        comments: ["Disclosure requirements", "Completeness assessment"]
      }
    ]
  },

  reporting: {
    phase: "reporting",
    sections: [
      {
        id: "opinion_formulation",
        title: "Opinion Formulation",
        comments: ["Opinion conclusion", "KAMs identified", "Report modifications"]
      },
      {
        id: "kams",
        title: "Key Audit Matters",
        comments: ["KAM selection", "KAM descriptions", "Auditor responses"]
      }
    ]
  }
};

// ═════════════════════════════════════════════════════════════════════
// COMMENT EXPORT SPECIFICATIONS
// ═════════════════════════════════════════════════════════════════════

export const EXPORT_FORMATS = {
  excel: {
    format: "xlsx",
    sheets: [
      {
        name: "Comments Summary",
        columns: ["WP Ref", "Section", "Comment Type", "Author", "Date", "Status", "Priority"]
      },
      {
        name: "Detailed Comments",
        columns: ["WP Ref", "Comment ID", "Type", "Author", "Date", "Text", "Status", "Resolution"]
      },
      {
        name: "Exception Log",
        columns: ["WP Ref", "Description", "Amount", "Status", "Resolution", "Comments"]
      }
    ]
  },

  word: {
    format: "docx",
    structure: [
      "Title page",
      "Comment index (linked to sections)",
      "For each WP: [comments as footnotes/endnotes with cross-references]",
      "Exception summary",
      "Action items register"
    ]
  },

  pdf: {
    format: "pdf",
    features: [
      "Embedded comments on relevant pages",
      "Bookmark index by WP",
      "Highlight critical exceptions",
      "Summary statistics page"
    ]
  },

  summary_report: {
    format: "html/pdf",
    sections: [
      "Executive summary of key comments",
      "Critical exceptions",
      "Open action items",
      "Resolution timeline",
      "Team participation statistics"
    ]
  }
};

// ═════════════════════════════════════════════════════════════════════
// COMMENT COMPLIANCE RULES
// ═════════════════════════════════════════════════════════════════════

export const COMPLIANCE_CHECKS = {
  critical_comment_addressed: {
    rule: "All CRITICAL priority comments must be addressed",
    action: "Flag if critical comment unresolved after deadline",
    auditValue: "Ensures critical issues don't fall through cracks"
  },

  reviewer_responses: {
    rule: "All reviewer comments must receive a response",
    action: "Track response time, flag if no response",
    auditValue: "Ensures reviewer feedback is acted upon"
  },

  exception_resolution: {
    rule: "All exception_found comments must have documented resolution",
    action: "Flag exceptions without resolution notes",
    auditValue: "Ensures all exceptions are properly addressed"
  },

  wp_conclusion: {
    rule: "Every WP must have a conclusion comment signed off",
    action: "Flag WPs missing conclusion",
    auditValue: "Ensures audit evidence chain is complete"
  },

  exception_quantification: {
    rule: "All exceptions must be quantified with impact assessment",
    action: "Flag exceptions without amounts or assessment",
    auditValue: "Ensures proper misstatement evaluation"
  },

  mgmt_follow_up: {
    rule: "All management communications must have follow-up comments",
    action: "Track management response timeline",
    auditValue: "Ensures client action items are tracked"
  }
};

// ═════════════════════════════════════════════════════════════════════
// CUSTOM COMMENT CONFIGURATION (PER ENGAGEMENT)
// ═════════════════════════════════════════════════════════════════════

export const CUSTOM_COMMENT_CONFIG = {
  engagementId: "string",

  // Firm-specific comment types
  customCommentTypes: [
    {
      id: "string",
      label: "string",
      description: "string",
      color: "string",
      isRequired: "boolean"
    }
  ],

  // Custom workflow
  commentWorkflow: {
    requiredApprovals: ["preparer", "reviewer", "manager", "partner"],
    notificationRules: {
      onComment: ["@mentioned users", "WP owner", "manager"],
      onException: ["manager", "partner"],
      onResolution: ["original commenter", "reviewer"]
    }
  },

  // Mandatory vs optional
  mandatoryCommentTypes: ["exception_found", "conclusion", "reviewer_comment"],
  optionalCommentTypes: ["preparer_notes", "team_discussion"],

  // Custom templates
  firmTemplates: [
    {
      id: "string",
      name: "string",
      category: "string",
      template: "string",
      industry: "optional"
    }
  ]
};

export default {
  COMMENT_TYPES,
  PRIORITY_LEVELS,
  RESOLUTION_STATUS,
  CONFIDENTIALITY_LEVELS,
  COMMENT_TEMPLATES,
  COMMENT_SUGGESTIONS,
  CommentModel,
  WORKPAPER_COMMENT_SECTIONS,
  STAGE_COMMENT_SECTIONS,
  EXPORT_FORMATS,
  COMPLIANCE_CHECKS,
  CUSTOM_COMMENT_CONFIG
};
