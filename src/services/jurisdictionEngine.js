/**
 * PRODUCTION CODE: Multi-Jurisdictional Audit Framework
 *
 * Jurisdiction Rules Engine
 * Handles UK, EU, and global audit framework compliance
 *
 * COPY & PASTE READY - Production Grade
 */

import Anthropic from "@anthropic-ai/sdk";

export class JurisdictionEngine {
  constructor(apiKey = process.env.ANTHROPIC_API_KEY) {
    this.client = new Anthropic({ apiKey });
    this.model = "claude-3-5-sonnet-20241022";

    // Jurisdiction Configuration - UK/EU FOCUS
    this.jurisdictions = {
      UK: {
        name: "United Kingdom",
        region: "Europe",
        frameworks: ["FRS102", "IFRS"],
        default_framework: "FRS102",
        regulations: [
          "Companies Act 2006",
          "Listing Rules",
          "UK Corporate Governance Code",
          "Charity Commission Standards"
        ],
        entity_types: [
          "Limited Company (Private)",
          "Limited Company (Public)",
          "Charity",
          "Cooperative",
          "Unlimited Company"
        ],
        filing_requirements: {
          accounts_deadline: 9, // 9 months after year end
          audit_requirement: "Based on turnover/assets",
          audit_exemption_threshold: 500000 // £500k
        },
        materiality_guidance: {
          profit_basis: 0.05,
          revenue_basis: 0.01,
          assets_basis: 0.01,
          equity_basis: 0.05
        }
      },

      // EU MEMBERS
      DE: {
        name: "Germany",
        region: "EU",
        frameworks: ["IFRS", "HGB"],
        default_framework: "IFRS",
        regulations: [
          "HGB (Handelsgesetzbuch)",
          "German Corporate Governance Code",
          "AStG (Foreign Tax Act)"
        ],
        filing_requirements: {
          accounts_deadline: 3, // 3 months after year end
          audit_requirement: "Based on size criteria",
          audit_exemption_threshold: 600000
        }
      },

      FR: {
        name: "France",
        region: "EU",
        frameworks: ["IFRS", "French GAAP"],
        default_framework: "IFRS",
        regulations: [
          "French Commercial Code",
          "French Accounting Standards",
          "Corporate Governance Code"
        ],
        filing_requirements: {
          accounts_deadline: 3,
          audit_requirement: "Based on size",
          audit_exemption_threshold: 500000
        }
      },

      NL: {
        name: "Netherlands",
        region: "EU",
        frameworks: ["IFRS", "Dutch GAAP"],
        default_framework: "IFRS",
        regulations: [
          "Civil Code Book 2",
          "Dutch Accounting Standards",
          "Two-tier Board Structure"
        ]
      },

      IT: {
        name: "Italy",
        region: "EU",
        frameworks: ["IFRS", "Italian GAAP"],
        default_framework: "IFRS",
        regulations: [
          "Italian Civil Code",
          "Legislative Decree 127/1991",
          "Tax Code"
        ]
      },

      ES: {
        name: "Spain",
        region: "EU",
        frameworks: ["IFRS", "Spanish GAAP"],
        default_framework: "IFRS",
        regulations: [
          "Spanish Commercial Code",
          "Chart of Accounts",
          "Corporate Governance Code"
        ]
      },

      // Add more EU members as needed
      BE: {
        name: "Belgium",
        region: "EU",
        frameworks: ["IFRS", "Belgian GAAP"],
        default_framework: "IFRS",
        regulations: ["Belgian Company Code", "Accounting Standards"]
      },

      AT: {
        name: "Austria",
        region: "EU",
        frameworks: ["IFRS", "Austrian GAAP"],
        default_framework: "IFRS",
        regulations: ["Austrian UGB", "Austrian Tax Code"]
      },

      SE: {
        name: "Sweden",
        region: "EU",
        frameworks: ["IFRS", "Swedish GAAP"],
        default_framework: "IFRS",
        regulations: ["Swedish Companies Act", "Accounting Act"]
      },

      DK: {
        name: "Denmark",
        region: "EU",
        frameworks: ["IFRS", "Danish GAAP"],
        default_framework: "IFRS",
        regulations: ["Danish Financial Statements Act"]
      },

      PL: {
        name: "Poland",
        region: "EU",
        frameworks: ["IFRS", "Polish GAAP"],
        default_framework: "IFRS",
        regulations: ["Polish Accounting Act"]
      }
    };

    // Risk Assessment Templates by Jurisdiction
    this.riskFrameworks = {
      UK: {
        inherent_risk_factors: [
          "Account complexity",
          "Transaction volume",
          "Related party transactions",
          "Fraud risk indicators",
          "Liquidity concerns"
        ],
        control_environment_factors: [
          "Board oversight",
          "Internal audit function",
          "Segregation of duties",
          "IT controls",
          "Whistleblower procedures"
        ],
        significant_risks: [
          "Management override",
          "Revenue recognition",
          "Related parties",
          "Valuation judgements",
          "Going concern"
        ]
      },

      EU_GENERAL: {
        inherent_risk_factors: [
          "EU regulatory changes",
          "Transfer pricing",
          "VAT compliance",
          "Change in regulations",
          "New accounting standards"
        ],
        control_environment_factors: [
          "Multi-entity controls",
          "Governance structure",
          "Internal controls",
          "Compliance procedures",
          "Data protection (GDPR)"
        ]
      }
    };

    // Procedure Library by Jurisdiction
    this.procedureLibrary = {
      UK: {
        revenue: [
          {
            id: "rev-uk-001",
            name: "Revenue Recognition Policy Review",
            assertion: "Accuracy",
            mandatory: true,
            framework: ["FRS102", "IFRS"]
          },
          {
            id: "rev-uk-002",
            name: "Sales Invoice Testing (Sample)",
            assertion: "Occurrence",
            sample_size_formula: "0.25% of transactions or £50k"
          },
          {
            id: "rev-uk-003",
            name: "Receivables Aging Analysis",
            assertion: "Valuation",
            mandatory: true
          },
          {
            id: "rev-uk-004",
            name: "Cutoff Testing (Pre/Post Year End)",
            assertion: "Completeness",
            mandatory: true
          },
          {
            id: "rev-uk-005",
            name: "Related Party Transaction Review",
            assertion: "Disclosure",
            mandatory: true
          }
        ],

        inventory: [
          {
            id: "inv-uk-001",
            name: "Inventory Count Observation",
            assertion: "Existence",
            mandatory: true
          },
          {
            id: "inv-uk-002",
            name: "Valuation Testing",
            assertion: "Valuation",
            mandatory: true
          },
          {
            id: "inv-uk-003",
            name: "Obsolescence Review",
            assertion: "Valuation",
            sample_size_formula: "Risk-based"
          },
          {
            id: "inv-uk-004",
            name: "Cutoff Testing",
            assertion: "Completeness",
            mandatory: true
          }
        ],

        receivables: [
          {
            id: "rec-uk-001",
            name: "Receivables Circularization",
            assertion: "Existence",
            sample_size_formula: "Judgmental"
          },
          {
            id: "rec-uk-002",
            name: "Allowance for Doubtful Debts Review",
            assertion: "Valuation",
            mandatory: true
          },
          {
            id: "rec-uk-003",
            name: "Related Party Receivables",
            assertion: "Disclosure",
            mandatory: true
          }
        ]
      },

      EU_GENERAL: {
        // EU-specific procedures
        transfer_pricing: [
          {
            id: "tp-eu-001",
            name: "Transfer Pricing Documentation Review",
            assertion: "Valuation",
            mandatory: true,
            jurisdictions: ["DE", "FR", "IT"]
          },
          {
            id: "tp-eu-002",
            name: "Related Party Terms Review",
            assertion: "Accuracy",
            mandatory: true
          }
        ],

        vat: [
          {
            id: "vat-eu-001",
            name: "VAT Compliance Review",
            assertion: "Completeness",
            mandatory: true
          },
          {
            id: "vat-eu-002",
            name: "INTRASTAT Testing",
            assertion: "Accuracy",
            jurisdictions: ["DE", "FR", "IT", "NL"]
          }
        ],

        gdpr_compliance: [
          {
            id: "gdpr-001",
            name: "GDPR Compliance Review",
            assertion: "Disclosure",
            mandatory: true,
            all_jurisdictions: true
          }
        ]
      }
    };
  }

  /**
   * Get jurisdiction configuration
   */
  getJurisdiction(jurisdiction_code) {
    const juris = this.jurisdictions[jurisdiction_code];
    if (!juris) {
      throw new Error(`Unsupported jurisdiction: ${jurisdiction_code}`);
    }
    return juris;
  }

  /**
   * Get applicable frameworks for jurisdiction
   */
  getApplicableFrameworks(jurisdiction_code) {
    const juris = this.getJurisdiction(jurisdiction_code);
    return {
      jurisdiction: jurisdiction_code,
      frameworks: juris.frameworks,
      default_framework: juris.default_framework,
      regulations: juris.regulations
    };
  }

  /**
   * Determine materiality based on jurisdiction & financials
   */
  calculateJurisdictionMateriality(jurisdiction_code, financials) {
    const juris = this.getJurisdiction(jurisdiction_code);
    const guidance = juris.materiality_guidance;

    const benchmarks = [];

    if (financials.profit) {
      benchmarks.push({
        basis: "Profit",
        rate: guidance.profit_basis,
        amount: Math.round(financials.profit * guidance.profit_basis)
      });
    }

    if (financials.revenue) {
      benchmarks.push({
        basis: "Revenue",
        rate: guidance.revenue_basis,
        amount: Math.round(financials.revenue * guidance.revenue_basis)
      });
    }

    if (financials.assets) {
      benchmarks.push({
        basis: "Assets",
        rate: guidance.assets_basis,
        amount: Math.round(financials.assets * guidance.assets_basis)
      });
    }

    // Use highest benchmark
    const materiality = Math.max(...benchmarks.map(b => b.amount));

    return {
      overall_materiality: materiality,
      performance_materiality: Math.round(materiality * 0.75),
      trivial_threshold: Math.round(materiality * 0.05),
      jurisdiction: jurisdiction_code,
      benchmarks: benchmarks,
      guidance_source: `${juris.name} Audit Standards`
    };
  }

  /**
   * Get applicable procedures for FSLI & jurisdiction
   */
  getApplicableProcedures(jurisdiction_code, fsli, risk_level) {
    const procedures = this.procedureLibrary[jurisdiction_code];
    if (!procedures || !procedures[fsli.toLowerCase()]) {
      return [];
    }

    const fsli_procedures = procedures[fsli.toLowerCase()];

    // Filter based on risk level
    return fsli_procedures.map(proc => ({
      ...proc,
      jurisdiction: jurisdiction_code,
      applies_due_to_risk: risk_level === "High" ? true : false,
      estimated_hours: this._estimateHours(proc, risk_level)
    }));
  }

  /**
   * Check audit exemption eligibility
   */
  checkAuditExemption(jurisdiction_code, financials) {
    const juris = this.getJurisdiction(jurisdiction_code);
    const threshold = juris.filing_requirements.audit_exemption_threshold;

    if (financials.turnover <= threshold) {
      return {
        exempt: true,
        jurisdiction: jurisdiction_code,
        threshold: threshold,
        reason: `Turnover below ${threshold.toLocaleString()} threshold`,
        review_required: true // Still should review exemption criteria
      };
    }

    return {
      exempt: false,
      jurisdiction: jurisdiction_code,
      threshold: threshold,
      audit_required: true
    };
  }

  /**
   * Get compliance calendar for jurisdiction
   */
  getComplianceCalendar(jurisdiction_code, year_end_date) {
    const juris = this.getJurisdiction(jurisdiction_code);
    const year_end = new Date(year_end_date);

    const accounts_due = new Date(year_end);
    accounts_due.setMonth(accounts_due.getMonth() + juris.filing_requirements.accounts_deadline);

    return {
      jurisdiction: jurisdiction_code,
      year_end: year_end.toISOString().split('T')[0],
      accounts_filing_deadline: accounts_due.toISOString().split('T')[0],
      audit_planning_period: "Start 2 months before year end",
      audit_fieldwork_period: "2-4 weeks after year end",
      key_deadlines: [
        { date: year_end.toISOString().split('T')[0], event: "Year End" },
        {
          date: new Date(year_end.getTime() + 60*24*60*60*1000).toISOString().split('T')[0],
          event: "Audit Fieldwork Start"
        },
        { date: accounts_due.toISOString().split('T')[0], event: "Accounts Filing Deadline" }
      ]
    };
  }

  /**
   * Generate jurisdiction-specific audit plan
   */
  async generateAuditPlan(context) {
    const jurisdiction = context.jurisdiction;
    const juris = this.getJurisdiction(jurisdiction);

    const prompt = `
You are an audit partner specializing in ${juris.name} audits.

ENGAGEMENT DETAILS:
- Entity: ${context.entityName}
- Jurisdiction: ${jurisdiction}
- Framework: ${context.framework}
- Year End: ${context.yearEnd}
- Turnover: £${context.turnover?.toLocaleString() || "N/A"}
- Risk Level: ${context.riskLevel}

KEY REGULATIONS:
${juris.regulations.join("\n")}

FILING REQUIREMENTS:
- Deadline: ${juris.filing_requirements.accounts_deadline} months after year end
- Audit Required: ${context.requiresAudit ? "Yes" : "No"}

TASK:
Generate a comprehensive audit plan specific to ${juris.name} requirements.

Include:
1. Key audit risks
2. Materiality assessment
3. Significant risk areas
4. Planned audit procedures
5. Timeline
6. Resource requirements
7. Compliance considerations

Return as JSON.
`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    });

    return this._parseJSON(response.content[0].text);
  }

  /**
   * Estimate audit hours by jurisdiction
   */
  _estimateHours(procedure, risk_level) {
    const base_hours = {
      "UK": 2,
      "DE": 2.5,
      "FR": 2.5,
      "EU": 3
    };

    const risk_multiplier = risk_level === "High" ? 1.5 : 1;
    return Math.round(base_hours["UK"] * risk_multiplier);
  }

  /**
   * Parse JSON from Claude response
   */
  _parseJSON(text) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON in response");
    }
    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Get all supported jurisdictions
   */
  getSupportedJurisdictions() {
    return Object.entries(this.jurisdictions).map(([code, data]) => ({
      code,
      name: data.name,
      region: data.region,
      frameworks: data.frameworks
    }));
  }

  /**
   * Check if jurisdiction pair has special considerations
   */
  checkMultiJurisdictionConsiderations(jurisdiction1, jurisdiction2) {
    // E.g., UK-EU considerations for cross-border transactions
    if ((jurisdiction1 === "UK" && ["DE", "FR", "NL", "IT"].includes(jurisdiction2)) ||
        (jurisdiction2 === "UK" && ["DE", "FR", "NL", "IT"].includes(jurisdiction1))) {
      return {
        multi_jurisdiction: true,
        considerations: [
          "Transfer pricing documentation required",
          "VAT compliance review",
          "Currency translation adjustments",
          "Related party transaction documentation",
          "Permanent establishment assessment"
        ]
      };
    }

    return { multi_jurisdiction: false };
  }
}

export default JurisdictionEngine;
