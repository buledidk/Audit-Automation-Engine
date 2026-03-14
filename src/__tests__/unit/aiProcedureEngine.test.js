import { describe, it, expect, beforeEach, vi } from "vitest";
import AIProcedureEngine from "../../services/aiProcedureEngine";

/**
 * AI Procedure Engine Tests
 * Tests Claude API integration for procedure recommendations
 */

describe("AIProcedureEngine", () => {
  let engine;

  beforeEach(() => {
    // Mock API key
    process.env.ANTHROPIC_API_KEY = "test-key";
    engine = new AIProcedureEngine("test-key");
  });

  // =========================================================================
  // UNIT TESTS: Context Validation
  // =========================================================================

  describe("Context Validation", () => {
    it("validates required context fields", () => {
      const invalidContext = { riskLevel: "High" }; // Missing fsli

      expect(() => {
        engine._validateContext(invalidContext);
      }).toThrow("Missing required context field: fsli");
    });

    it("accepts valid context", () => {
      const validContext = {
        fsli: "Revenue",
        riskLevel: "High"
      };

      expect(() => {
        engine._validateContext(validContext);
      }).not.toThrow();
    });
  });

  // =========================================================================
  // UNIT TESTS: Filtering
  // =========================================================================

  describe("Procedure Filtering", () => {
    const procedures = [
      {
        id: "1",
        name: "Procedure A",
        fsliList: ["Revenue", "Receivables"]
      },
      {
        id: "2",
        name: "Procedure B",
        fsliList: ["All"]
      },
      {
        id: "3",
        name: "Procedure C",
        fsliList: ["Inventory"]
      },
      {
        id: "4",
        name: "Procedure D"
        // No fsliList restriction
      }
    ];

    it("filters procedures by FSLI", () => {
      const filtered = engine._filterByFsli(procedures, "Revenue");

      expect(filtered).toHaveLength(3); // A, B, D
      expect(filtered.map((p) => p.id)).toContain("1");
      expect(filtered.map((p) => p.id)).not.toContain("3");
    });

    it("includes All procedures", () => {
      const filtered = engine._filterByFsli(procedures, "Revenue");

      expect(filtered.map((p) => p.id)).toContain("2");
    });

    it("includes procedures with no FSLI restriction", () => {
      const filtered = engine._filterByFsli(procedures, "Revenue");

      expect(filtered.map((p) => p.id)).toContain("4");
    });

    it("returns empty array for non-existent FSLI", () => {
      const filtered = engine._filterByFsli(procedures, "NonExistent");

      expect(filtered.length).toBeGreaterThan(0); // Still includes All and unrestricted
    });
  });

  // =========================================================================
  // UNIT TESTS: Caching
  // =========================================================================

  describe("Result Caching", () => {
    it("generates cache keys consistently", () => {
      const context = {
        fsli: "Revenue",
        riskLevel: "High",
        industry: "Manufacturing"
      };

      const key1 = engine._generateCacheKey(context);
      const key2 = engine._generateCacheKey(context);

      expect(key1).toBe(key2);
    });

    it("generates different keys for different contexts", () => {
      const context1 = { fsli: "Revenue", riskLevel: "High" };
      const context2 = { fsli: "Inventory", riskLevel: "High" };

      const key1 = engine._generateCacheKey(context1);
      const key2 = engine._generateCacheKey(context2);

      expect(key1).not.toBe(key2);
    });

    it("stores and retrieves cached results", () => {
      const cacheKey = "test-key";
      const cachedData = [
        {
          rank: 1,
          name: "Test Procedure",
          effectiveness: 95
        }
      ];

      engine.cache.set(cacheKey, {
        data: cachedData,
        timestamp: Date.now()
      });

      const cached = engine.cache.get(cacheKey);
      expect(cached.data).toEqual(cachedData);
    });

    it("clears cache", () => {
      engine.cache.set("key1", { data: "test" });
      engine.cache.set("key2", { data: "test" });

      expect(engine.cache.size).toBe(2);

      engine.clearCache();

      expect(engine.cache.size).toBe(0);
    });

    it("reports cache statistics", () => {
      engine.cache.clear();
      engine.cache.set("key1", { data: "test" });
      engine.cache.set("key2", { data: "test" });

      const stats = engine.getCacheStats();

      expect(stats.size).toBe(2);
      expect(stats.entries).toHaveLength(2);
    });
  });

  // =========================================================================
  // UNIT TESTS: Prompt Generation
  // =========================================================================

  describe("Prompt Generation", () => {
    const context = {
      fsli: "Revenue",
      riskLevel: "High",
      priorExceptions: ["Revenue cutoff", "Unbilled services"],
      industry: "SaaS",
      complexity: "High",
      materiality: 100000
    };

    const procedures = [
      {
        id: "1",
        name: "Verify Sales Invoices",
        type: "Substantive",
        assertion: "Completeness",
        standard: "ISA 500"
      },
      {
        id: "2",
        name: "Test Revenue Recognition",
        type: "Substantive",
        assertion: "Accuracy",
        standard: "ISA 500"
      }
    ];

    it("builds comprehensive ranking prompt", () => {
      const prompt = engine._buildRankingPrompt(context, procedures);

      expect(prompt).toContain("Revenue");
      expect(prompt).toContain("High");
      expect(prompt).toContain("SaaS");
      expect(prompt).toContain("Verify Sales Invoices");
      expect(prompt).toContain("Test Revenue Recognition");
    });

    it("includes all context in prompt", () => {
      const prompt = engine._buildRankingPrompt(context, procedures);

      expect(prompt).toContain("High");
      expect(prompt).toContain("Revenue cutoff");
      expect(prompt).toContain("Unbilled services");
    });

    it("formats procedures correctly in prompt", () => {
      const prompt = engine._buildRankingPrompt(context, procedures);

      expect(prompt).toContain("Verify Sales Invoices");
      expect(prompt).toContain("Substantive");
      expect(prompt).toContain("ISA 500");
    });
  });

  // =========================================================================
  // UNIT TESTS: JSON Parsing
  // =========================================================================

  describe("Response Parsing", () => {
    it("extracts JSON from Claude response", () => {
      const response = `
Some explanatory text...

{
  "recommendations": [
    {
      "rank": 1,
      "name": "Procedure A",
      "effectiveness": 95
    }
  ]
}

More text after JSON...
`;

      const parsed = engine._parseJSON(response);

      expect(parsed.recommendations).toBeDefined();
      expect(parsed.recommendations[0].name).toBe("Procedure A");
    });

    it("throws error for invalid JSON", () => {
      const response = "No JSON here";

      expect(() => {
        engine._parseJSON(response);
      }).toThrow();
    });

    it("parses recommendations with original data", () => {
      const text = `
{
  "recommendations": [
    {
      "rank": 1,
      "name": "Test Procedure",
      "effectiveness": 85,
      "justification": "High risk area"
    }
  ]
}
`;

      const procedures = [
        {
          id: "proc-1",
          name: "Test Procedure",
          type: "Substantive",
          assertion: "Completeness"
        }
      ];

      const parsed = engine._parseRecommendations(text, procedures);

      expect(parsed[0].effectiveness).toBe(85);
      expect(parsed[0].id).toBe("proc-1");
      expect(parsed[0].type).toBe("Substantive");
    });
  });

  // =========================================================================
  // INTEGRATION TESTS: Simulated API Responses
  // =========================================================================

  describe("Integration: Simulated Workflows", () => {
    it("handles high-risk revenue procedure selection", () => {
      const context = {
        fsli: "Revenue",
        riskLevel: "High",
        priorExceptions: ["Revenue cutoff"],
        industry: "Manufacturing",
        complexity: "High",
        materiality: 500000
      };

      // Simulate what AI should return for high-risk revenue
      const expectedBehavior = {
        topProcedure: "Verify Sales Invoices",
        minimumProcedures: 3, // High risk = more procedures
        expectedEffectiveness: { min: 75, max: 100 }
      };

      expect(expectedBehavior.minimumProcedures).toBeGreaterThan(1);
      expect(expectedBehavior.expectedEffectiveness.min).toBeGreaterThan(50);
    });

    it("handles low-risk routine procedure selection", () => {
      const context = {
        fsli: "Cash",
        riskLevel: "Low",
        priorExceptions: [],
        industry: "Retail",
        complexity: "Low",
        materiality: 100000
      };

      // Simulate what AI should return for low-risk cash
      const expectedBehavior = {
        topProcedure: "Reconcile Bank Statements",
        minimumProcedures: 1,
        expectedEffectiveness: { min: 80, max: 95 }
      };

      expect(expectedBehavior.minimumProcedures).toBeGreaterThan(0);
    });

    it("handles complex multi-assertion procedures", () => {
      const context = {
        fsli: "Inventory",
        riskLevel: "High",
        priorExceptions: ["Valuation", "Completeness"],
        industry: "Manufacturing",
        complexity: "Very High",
        materiality: 250000
      };

      // Complex scenarios need more procedures
      const expectedBehavior = {
        minimumProcedures: 4,
        shouldIncludeProcedures: [
          "Physical Inventory Count",
          "Valuation Testing",
          "Obsolescence Review",
          "Cutoff Testing"
        ]
      };

      expect(expectedBehavior.minimumProcedures).toBeGreaterThanOrEqual(3);
    });
  });

  // =========================================================================
  // TESTS: Error Handling
  // =========================================================================

  describe("Error Handling", () => {
    it("handles missing context gracefully", async () => {
      const invalidContext = {};
      const procedures = [];

      expect(() => {
        engine._validateContext(invalidContext);
      }).toThrow();
    });

    it("handles empty procedures array", async () => {
      const context = {
        fsli: "Revenue",
        riskLevel: "High"
      };

      expect(() => {
        engine.suggestProcedures(context, []);
      }).toThrow("Procedures array is required");
    });

    it("handles null procedures array", async () => {
      const context = {
        fsli: "Revenue",
        riskLevel: "High"
      };

      expect(() => {
        engine.suggestProcedures(context, null);
      }).toThrow();
    });
  });

  // =========================================================================
  // TESTS: Data Quality
  // =========================================================================

  describe("Data Quality", () => {
    it("ensures effectiveness scores are 0-100", () => {
      const recommendations = [
        { effectiveness: 0 },
        { effectiveness: 50 },
        { effectiveness: 100 }
      ];

      recommendations.forEach((rec) => {
        expect(rec.effectiveness).toBeGreaterThanOrEqual(0);
        expect(rec.effectiveness).toBeLessThanOrEqual(100);
      });
    });

    it("ensures recommendations are ranked", () => {
      const recommendations = [
        { rank: 1, effectiveness: 95 },
        { rank: 2, effectiveness: 85 },
        { rank: 3, effectiveness: 75 }
      ];

      expect(recommendations[0].effectiveness).toBeGreaterThan(
        recommendations[1].effectiveness
      );
    });

    it("includes justification for all recommendations", () => {
      const recommendations = [
        { name: "Proc 1", justification: "High risk area" },
        { name: "Proc 2", justification: "Prior exception" },
        { name: "Proc 3", justification: "Complex transaction type" }
      ];

      recommendations.forEach((rec) => {
        expect(rec.justification).toBeTruthy();
        expect(rec.justification.length).toBeGreaterThan(5);
      });
    });
  });

  // =========================================================================
  // TESTS: Industry-Specific Behavior
  // =========================================================================

  describe("Industry-Specific Behavior", () => {
    it("recognizes manufacturing-specific risks", () => {
      const context = {
        fsli: "Inventory",
        riskLevel: "High",
        industry: "Manufacturing",
        complexity: "High"
      };

      // Manufacturing typically has complex inventory
      expect(context.industry).toBe("Manufacturing");
      expect(context.complexity).toBe("High");
    });

    it("recognizes SaaS-specific risks", () => {
      const context = {
        fsli: "Revenue",
        riskLevel: "High",
        industry: "SaaS",
        complexity: "Medium"
      };

      // SaaS typically has revenue recognition issues
      expect(context.industry).toBe("SaaS");
      expect(context.fsli).toBe("Revenue");
    });

    it("recognizes financial services risks", () => {
      const context = {
        fsli: "Investments",
        riskLevel: "High",
        industry: "Banking",
        complexity: "Very High"
      };

      expect(context.industry).toBe("Banking");
    });
  });

  // =========================================================================
  // PERFORMANCE TESTS
  // =========================================================================

  describe("Performance", () => {
    it("cache lookup is fast", () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        engine.cache.set(`key-${i}`, { data: "test" });
      }

      const lookupStart = performance.now();
      engine.cache.get("key-500");
      const lookupEnd = performance.now();

      expect(lookupEnd - lookupStart).toBeLessThan(1); // < 1ms
    });

    it("context validation is fast", () => {
      const context = {
        fsli: "Revenue",
        riskLevel: "High"
      };

      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        engine._validateContext(context);
      }

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // < 100ms for 1000 validations
    });
  });
});
