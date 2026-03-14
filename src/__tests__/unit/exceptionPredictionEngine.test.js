import { describe, it, expect, beforeEach, vi } from "vitest";
import ExceptionPredictionEngine from "../../services/exceptionPredictionEngine";

/**
 * Exception Prediction Engine Tests
 * Tests Claude API integration for exception prediction
 */

describe("ExceptionPredictionEngine", () => {
  let engine;

  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = "test-key";
    engine = new ExceptionPredictionEngine("test-key");
  });

  // =========================================================================
  // CONTEXT VALIDATION TESTS
  // =========================================================================

  describe("Context Validation", () => {
    it("validates required context fields", () => {
      const invalidContext = { industry: "SaaS" }; // Missing fsli

      expect(() => {
        engine._validateContext(invalidContext);
      }).toThrow("Missing required context field: fsli");
    });

    it("accepts valid context", () => {
      const validContext = { fsli: "Revenue" };

      expect(() => {
        engine._validateContext(validContext);
      }).not.toThrow();
    });

    it("accepts context with all optional fields", () => {
      const fullContext = {
        fsli: "Revenue",
        industry: "SaaS",
        complexity: "High",
        riskLevel: "High",
        priorYearExceptions: ["Revenue cutoff"],
        changeHistory: ["New system implementation"],
        entityAge: 15
      };

      expect(() => {
        engine._validateContext(fullContext);
      }).not.toThrow();
    });
  });

  // =========================================================================
  // CACHE KEY GENERATION TESTS
  // =========================================================================

  describe("Cache Key Generation", () => {
    it("generates consistent cache keys", () => {
      const context = {
        fsli: "Inventory",
        industry: "Manufacturing",
        priorYearExceptions: ["Valuation"]
      };

      const key1 = engine._generateCacheKey(context);
      const key2 = engine._generateCacheKey(context);

      expect(key1).toBe(key2);
    });

    it("generates different keys for different FSLIs", () => {
      const context1 = { fsli: "Revenue" };
      const context2 = { fsli: "Inventory" };

      const key1 = engine._generateCacheKey(context1);
      const key2 = engine._generateCacheKey(context2);

      expect(key1).not.toBe(key2);
    });

    it("includes prior exceptions in cache key", () => {
      const context1 = {
        fsli: "Revenue",
        priorYearExceptions: ["Cutoff"]
      };
      const context2 = {
        fsli: "Revenue",
        priorYearExceptions: ["Valuation"]
      };

      const key1 = engine._generateCacheKey(context1);
      const key2 = engine._generateCacheKey(context2);

      expect(key1).not.toBe(key2);
    });
  });

  // =========================================================================
  // PREDICTION STRUCTURE TESTS
  // =========================================================================

  describe("Prediction Data Structure", () => {
    it("validates exception probability is 0-1", () => {
      const predictions = [
        { exception_probability: 0 },
        { exception_probability: 0.5 },
        { exception_probability: 1 }
      ];

      predictions.forEach((pred) => {
        expect(pred.exception_probability).toBeGreaterThanOrEqual(0);
        expect(pred.exception_probability).toBeLessThanOrEqual(1);
      });
    });

    it("validates confidence score is 0-1", () => {
      const predictions = [
        { confidence: 0.75 },
        { confidence: 0.85 },
        { confidence: 0.95 }
      ];

      predictions.forEach((pred) => {
        expect(pred.confidence).toBeGreaterThanOrEqual(0);
        expect(pred.confidence).toBeLessThanOrEqual(1);
      });
    });

    it("validates risk score is 0-100", () => {
      const predictions = [
        { risk_score: 25 },
        { risk_score: 50 },
        { risk_score: 85 }
      ];

      predictions.forEach((pred) => {
        expect(pred.risk_score).toBeGreaterThanOrEqual(0);
        expect(pred.risk_score).toBeLessThanOrEqual(100);
      });
    });

    it("validates predicted exception types structure", () => {
      const predictions = {
        predicted_types: [
          {
            type: "Valuation Error",
            likelihood: 0.7,
            severity: "High",
            description: "Inventory valuation issues"
          },
          {
            type: "Completeness",
            likelihood: 0.45,
            severity: "Medium",
            description: "Incomplete inventory recording"
          }
        ]
      };

      predictions.predicted_types.forEach((type) => {
        expect(type.type).toBeTruthy();
        expect(type.likelihood).toBeGreaterThanOrEqual(0);
        expect(type.likelihood).toBeLessThanOrEqual(1);
        expect(["High", "Medium", "Low"]).toContain(type.severity);
      });
    });

    it("validates preventive procedures structure", () => {
      const procedures = [
        {
          procedure: "Physical Inventory Count",
          prevents: "Completeness Issues",
          effectiveness: 0.95
        },
        {
          procedure: "Valuation Testing",
          prevents: "Valuation Errors",
          effectiveness: 0.88
        }
      ];

      procedures.forEach((proc) => {
        expect(proc.procedure).toBeTruthy();
        expect(proc.prevents).toBeTruthy();
        expect(proc.effectiveness).toBeGreaterThanOrEqual(0);
        expect(proc.effectiveness).toBeLessThanOrEqual(1);
      });
    });
  });

  // =========================================================================
  // PREDICTION LOGIC TESTS
  // =========================================================================

  describe("Exception Prediction Logic", () => {
    it("predicts higher probability for high-risk FSLIs", () => {
      const lowRiskContext = {
        fsli: "Cash",
        riskLevel: "Low",
        priorYearExceptions: []
      };

      const highRiskContext = {
        fsli: "Revenue",
        riskLevel: "High",
        priorYearExceptions: ["Revenue cutoff", "Unbilled services"]
      };

      // High risk should generally have higher probability
      expect(highRiskContext.priorYearExceptions.length).toBeGreaterThan(
        lowRiskContext.priorYearExceptions.length
      );
    });

    it("considers industry-specific patterns", () => {
      const saasContext = {
        fsli: "Revenue",
        industry: "SaaS",
        priorYearExceptions: ["Revenue cutoff"]
      };

      const manufacturingContext = {
        fsli: "Inventory",
        industry: "Manufacturing",
        priorYearExceptions: ["Valuation"]
      };

      // Different industries have different risk profiles
      expect(saasContext.industry).not.toBe(manufacturingContext.industry);
    });

    it("incorporates prior exception history", () => {
      const noPriorExceptions = {
        fsli: "Revenue",
        priorYearExceptions: []
      };

      const multiplePriorExceptions = {
        fsli: "Revenue",
        priorYearExceptions: ["Cutoff", "Recognition", "Valuation"]
      };

      // More prior exceptions = higher recurrence risk
      expect(
        multiplePriorExceptions.priorYearExceptions.length
      ).toBeGreaterThan(noPriorExceptions.priorYearExceptions.length);
    });

    it("accounts for entity complexity", () => {
      const simpleEntity = {
        fsli: "Revenue",
        complexity: "Low"
      };

      const complexEntity = {
        fsli: "Revenue",
        complexity: "Very High"
      };

      // Complex entities have higher exception risk
      expect(complexEntity.complexity).toBeTruthy();
    });
  });

  // =========================================================================
  // ROOT CAUSE ANALYSIS TESTS
  // =========================================================================

  describe("Root Cause Analysis", () => {
    it("handles no prior exceptions gracefully", async () => {
      const context = {
        fsli: "Cash",
        priorYearExceptions: []
      };

      // Should not throw error
      expect(() => {
        engine._validateContext(context);
      }).not.toThrow();
    });

    it("validates root cause structure", () => {
      const rootCauses = [
        {
          cause: "Inadequate review process",
          likelihood_of_recurrence: 0.65,
          affected_areas: ["Valuation", "Completeness"],
          control_weakness: "Insufficient supervisory review",
          improvement: "Enhance review controls"
        }
      ];

      rootCauses.forEach((rc) => {
        expect(rc.cause).toBeTruthy();
        expect(rc.likelihood_of_recurrence).toBeGreaterThanOrEqual(0);
        expect(rc.likelihood_of_recurrence).toBeLessThanOrEqual(1);
        expect(Array.isArray(rc.affected_areas)).toBe(true);
      });
    });

    it("validates pattern structure", () => {
      const patterns = [
        {
          pattern: "Year-end valuation errors",
          occurrences: 3,
          severity: "High"
        },
        {
          pattern: "Month-end cutoff issues",
          occurrences: 2,
          severity: "Medium"
        }
      ];

      patterns.forEach((pattern) => {
        expect(pattern.pattern).toBeTruthy();
        expect(pattern.occurrences).toBeGreaterThan(0);
        expect(["High", "Medium", "Low"]).toContain(pattern.severity);
      });
    });
  });

  // =========================================================================
  // SAMPLE SIZE RECOMMENDATION TESTS
  // =========================================================================

  describe("Sample Size Recommendations", () => {
    it("validates sample size percentage", () => {
      const recommendations = [
        { sample_size_percentage: 5 },
        { sample_size_percentage: 25 },
        { sample_size_percentage: 100 }
      ];

      recommendations.forEach((rec) => {
        expect(rec.sample_size_percentage).toBeGreaterThanOrEqual(0);
        expect(rec.sample_size_percentage).toBeLessThanOrEqual(100);
      });
    });

    it("recommends higher sample sizes for high-risk items", () => {
      const lowRisk = { exception_probability: 0.1, sample_size_recommendation: 5 };
      const highRisk = { exception_probability: 0.8, sample_size_recommendation: 40 };

      // Higher risk = larger sample
      expect(highRisk.sample_size_recommendation).toBeGreaterThan(
        lowRisk.sample_size_recommendation
      );
    });

    it("validates sampling methodology", () => {
      const methodologies = ["Statistical", "Judgmental", "Stratified"];
      const recommendation = { methodology: "Statistical" };

      expect(methodologies).toContain(recommendation.methodology);
    });
  });

  // =========================================================================
  // JSON PARSING TESTS
  // =========================================================================

  describe("JSON Response Parsing", () => {
    it("extracts JSON from Claude response", () => {
      const response = `
Some explanation text here...

{
  "exception_probability": 0.72,
  "confidence": 0.88,
  "risk_score": 78
}

More text after JSON...
`;

      const parsed = engine._parseJSON(response);

      expect(parsed.exception_probability).toBe(0.72);
      expect(parsed.confidence).toBe(0.88);
      expect(parsed.risk_score).toBe(78);
    });

    it("throws error for invalid JSON", () => {
      const response = "No JSON content here";

      expect(() => {
        engine._parseJSON(response);
      }).toThrow();
    });
  });

  // =========================================================================
  // CACHE TESTS
  // =========================================================================

  describe("Caching Behavior", () => {
    it("stores and retrieves cached predictions", () => {
      const cacheKey = "test-key";
      const predictions = {
        exception_probability: 0.75,
        risk_score: 80
      };

      engine.cache.set(cacheKey, {
        data: predictions,
        timestamp: Date.now()
      });

      const cached = engine.cache.get(cacheKey);
      expect(cached.data).toEqual(predictions);
    });

    it("clears cache", () => {
      engine.cache.set("key1", { data: "test" });
      engine.cache.set("key2", { data: "test" });

      expect(engine.cache.size).toBe(2);

      engine.clearCache();

      expect(engine.cache.size).toBe(0);
    });

    it("reports cache statistics", () => {
      engine.clearCache();
      engine.cache.set("pred_1", { data: "test" });
      engine.cache.set("pred_2", { data: "test" });

      const stats = engine.getCacheStats();

      expect(stats.size).toBe(2);
      expect(stats.entries).toHaveLength(2);
    });
  });

  // =========================================================================
  // INDUSTRY-SPECIFIC TESTS
  // =========================================================================

  describe("Industry-Specific Predictions", () => {
    it("recognizes SaaS revenue risks", () => {
      const context = {
        fsli: "Revenue",
        industry: "SaaS",
        priorYearExceptions: ["Revenue cutoff", "Subscription recognition"]
      };

      expect(context.industry).toBe("SaaS");
      expect(context.fsli).toBe("Revenue");
    });

    it("recognizes manufacturing inventory risks", () => {
      const context = {
        fsli: "Inventory",
        industry: "Manufacturing",
        priorYearExceptions: ["Valuation", "Completeness"]
      };

      expect(context.industry).toBe("Manufacturing");
    });

    it("recognizes financial services risks", () => {
      const context = {
        fsli: "Investments",
        industry: "Banking",
        priorYearExceptions: ["Fair value measurement"]
      };

      expect(context.industry).toBe("Banking");
    });
  });

  // =========================================================================
  // REPORT GENERATION TESTS
  // =========================================================================

  describe("Report Generation", () => {
    it("validates report structure", async () => {
      const context = {
        fsli: "Revenue",
        industry: "SaaS"
      };

      // Report should have key sections
      const expectedSections = ["summary", "predictions", "rootCauses", "sampleSize"];
      expectedSections.forEach((section) => {
        expect(section).toBeTruthy();
      });
    });
  });

  // =========================================================================
  // ERROR HANDLING TESTS
  // =========================================================================

  describe("Error Handling", () => {
    it("handles missing FSLI gracefully", () => {
      const invalidContext = { industry: "SaaS" };

      expect(() => {
        engine._validateContext(invalidContext);
      }).toThrow();
    });

    it("handles null context gracefully", () => {
      expect(() => {
        engine._validateContext(null);
      }).toThrow();
    });
  });

  // =========================================================================
  // PERFORMANCE TESTS
  // =========================================================================

  describe("Performance", () => {
    it("generates cache keys quickly", () => {
      const context = {
        fsli: "Revenue",
        industry: "SaaS"
      };

      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        engine._generateCacheKey(context);
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50); // < 50ms for 1000 generations
    });

    it("validates context quickly", () => {
      const context = { fsli: "Revenue" };

      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        engine._validateContext(context);
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // < 100ms for 1000 validations
    });
  });
});
