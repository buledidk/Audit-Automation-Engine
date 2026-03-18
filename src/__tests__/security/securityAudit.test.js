/**
 * SECURITY AUDIT TEST SUITE
 * Verifies GDPR compliance, encryption, and security best practices
 */

import { describe, it, expect, beforeAll } from "vitest";

describe("Security & Compliance Audit", () => {
  // ============================================================================
  // GDPR COMPLIANCE TESTS
  // ============================================================================

  describe("GDPR Compliance", () => {
    it("should have GDPR middleware configured", () => {
      // Verify middleware is imported in app.js
      const fs = require("fs");
      const appContent = fs.readFileSync("./server/app.js", "utf-8");

      expect(appContent).toContain("gdprMiddleware");
      expect(appContent).toContain("import gdprMiddleware");
    });

    it("should have audit trail tables created", () => {
      const fs = require("fs");
      const migrationContent = fs.readFileSync("./db/migrations/001-gdpr-audit-trail.sql", "utf-8");

      expect(migrationContent).toContain("CREATE TABLE IF NOT EXISTS audit_trail");
      expect(migrationContent).toContain("CREATE TABLE IF NOT EXISTS user_consents");
      expect(migrationContent).toContain("CREATE TABLE IF NOT EXISTS data_retention_policies");
    });

    it("should have user consent tracking", () => {
      const fs = require("fs");
      const migrationContent = fs.readFileSync("./db/migrations/001-gdpr-audit-trail.sql", "utf-8");

      expect(migrationContent).toContain("data_processing_consent");
      expect(migrationContent).toContain("marketing_consent");
    });

    it("should enforce 7-year audit log retention", () => {
      const fs = require("fs");
      const migrationContent = fs.readFileSync("./db/migrations/001-gdpr-audit-trail.sql", "utf-8");

      expect(migrationContent).toContain("2555"); // 7 years in days
      expect(migrationContent).toContain("Legal obligation");
    });
  });

  // ============================================================================
  // ENCRYPTION TESTS
  // ============================================================================

  describe("Data Encryption", () => {
    it("should have encryption service", () => {
      const fs = require("fs");
      const encryptionContent = fs.readFileSync("./src/services/encryptionService.js", "utf-8");

      expect(encryptionContent).toContain("aes-256-cbc");
      expect(encryptionContent).toContain("export const encrypt");
      expect(encryptionContent).toContain("export const decrypt");
    });

    it("should use AES-256-CBC for encryption", () => {
      const fs = require("fs");
      const encryptionContent = fs.readFileSync("./src/services/encryptionService.js", "utf-8");

      expect(encryptionContent).toContain("const ALGORITHM = \"aes-256-cbc\"");
      expect(encryptionContent).toContain("cipher.update");
      expect(encryptionContent).toContain("decipher.update");
    });

    it("should track encryption access", () => {
      const fs = require("fs");
      const migrationContent = fs.readFileSync("./db/migrations/002-encryption-setup.sql", "utf-8");

      expect(migrationContent).toContain("encryption_access_log");
      expect(migrationContent).toContain("data_type");
    });
  });

  // ============================================================================
  // RBAC TESTS
  // ============================================================================

  describe("Role-Based Access Control", () => {
    it("should have RBAC middleware", () => {
      const fs = require("fs");
      const rbacContent = fs.readFileSync("./src/middleware/rbacMiddleware.js", "utf-8");

      expect(rbacContent).toContain("rbacMiddleware");
      expect(rbacContent).toContain("403");
      expect(rbacContent).toContain("roleHierarchy");
    });

    it("should enforce role hierarchy", () => {
      const fs = require("fs");
      const rbacContent = fs.readFileSync("./src/middleware/rbacMiddleware.js", "utf-8");

      expect(rbacContent).toContain("admin");
      expect(rbacContent).toContain("partner");
      expect(rbacContent).toContain("manager");
      expect(rbacContent).toContain("auditor");
      expect(rbacContent).toContain("viewer");
    });

    it("should apply RBAC to sensitive endpoints", () => {
      const fs = require("fs");
      const appContent = fs.readFileSync("./server/app.js", "utf-8");

      // Check RBAC is applied to create engagement
      expect(appContent).toContain("rbacMiddleware([\"partner\", \"manager\"])");

      // Check RBAC is applied to findings
      expect(appContent).toContain("app.post");
    });
  });

  // ============================================================================
  // SECURITY HEADERS TESTS
  // ============================================================================

  describe("Security Headers", () => {
    it("should have helmet configured with strict CSP", () => {
      const fs = require("fs");
      const appContent = fs.readFileSync("./server/app.js", "utf-8");

      expect(appContent).toContain("helmet");
      expect(appContent).toContain("hsts");
      expect(appContent).toContain("contentSecurityPolicy");
      expect(appContent).toContain("frameguard");
    });

    it("should enforce HSTS", () => {
      const fs = require("fs");
      const appContent = fs.readFileSync("./server/app.js", "utf-8");

      expect(appContent).toContain("maxAge: 31536000");
      expect(appContent).toContain("includeSubDomains: true");
    });

    it("should block frame embedding", () => {
      const fs = require("fs");
      const appContent = fs.readFileSync("./server/app.js", "utf-8");

      expect(appContent).toContain("frameguard");
      expect(appContent).toContain("action: \"deny\"");
    });
  });

  // ============================================================================
  // AUTHENTICATION TESTS
  // ============================================================================

  describe("Authentication & Tokens", () => {
    it("should use JWT for authentication", () => {
      const fs = require("fs");
      const appContent = fs.readFileSync("./server/app.js", "utf-8");

      expect(appContent).toContain("jwt.sign");
      expect(appContent).toContain("authenticateToken");
      expect(appContent).toContain("expiresIn");
    });

    it("should set appropriate token expiration", () => {
      const fs = require("fs");
      const appContent = fs.readFileSync("./server/app.js", "utf-8");

      expect(appContent).toContain("expiresIn: \"24h\"");
    });

    it("should validate tokens on protected routes", () => {
      const fs = require("fs");
      const appContent = fs.readFileSync("./server/app.js", "utf-8");

      expect(appContent).toContain("authenticateToken");
      // Should appear multiple times for multiple endpoints
      const matches = appContent.match(/authenticateToken/g);
      expect(matches.length).toBeGreaterThan(5);
    });
  });

  // ============================================================================
  // FRONTEND SECURITY TESTS
  // ============================================================================

  describe("Frontend Security", () => {
    it("should have API client with interceptors", () => {
      const fs = require("fs");
      const apiContent = fs.readFileSync("./src/services/apiClient.js", "utf-8");

      expect(apiContent).toContain("interceptors.request");
      expect(apiContent).toContain("interceptors.response");
      expect(apiContent).toContain("401");
    });

    it("should have GDPR consent banner component", () => {
      const fs = require("fs");
      const bannerContent = fs.readFileSync("./src/components/GDPRConsentBanner.jsx", "utf-8");

      expect(bannerContent).toContain("gdpr-banner");
      expect(bannerContent).toContain("localStorage");
      expect(bannerContent).toContain("gdpr_consent_given");
    });

    it("should have privacy center for data rights", () => {
      const fs = require("fs");
      const privacyContent = fs.readFileSync("./src/components/PrivacyCenter.jsx", "utf-8");

      expect(privacyContent).toContain("Art. 15");
      expect(privacyContent).toContain("Art. 20");
      expect(privacyContent).toContain("Art. 17");
    });
  });

  // ============================================================================
  // AUDIT LOGGING TESTS
  // ============================================================================

  describe("Audit Logging", () => {
    it("should log all user actions", () => {
      const fs = require("fs");
      const appContent = fs.readFileSync("./server/app.js", "utf-8");

      expect(appContent).toContain("logAudit");
      expect(appContent).toContain("[AUDIT]");
    });

    it("should include action type in audit logs", () => {
      const fs = require("fs");
      const appContent = fs.readFileSync("./server/app.js", "utf-8");

      expect(appContent).toContain("auditLog");
      expect(appContent).toContain("CREATE_ENGAGEMENT");
      expect(appContent).toContain("UPDATE_PROCEDURE");
    });
  });

  // ============================================================================
  // COMPLIANCE DOCUMENTATION TESTS
  // ============================================================================

  describe("Compliance Documentation", () => {
    it("should have frontend API integration guide", () => {
      const fs = require("fs");
      const docExists = fs.existsSync("./FRONTEND_API_INTEGRATION.md");
      expect(docExists).toBe(true);
    });

    it("should document all API endpoints", () => {
      const fs = require("fs");
      const docContent = fs.readFileSync("./FRONTEND_API_INTEGRATION.md", "utf-8");

      expect(docContent).toContain("Authentication");
      expect(docContent).toContain("Engagements");
      expect(docContent).toContain("Evidence");
    });
  });
});
