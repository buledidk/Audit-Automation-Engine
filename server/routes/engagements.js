/**
 * PRODUCTION CODE: Express API Routes
 *
 * Multi-Jurisdictional Engagement Management API
 * COPY & PASTE READY - Production Grade
 */

const express = require("express");
const router = express.Router();
const db = require("../db"); // Database connection pool
const JurisdictionEngine = require("../services/jurisdictionEngine");
const auth = require("../middleware/auth");
const audit = require("../middleware/auditLog");

const jurisdictionEngine = new JurisdictionEngine();

// ============================================================================
// CREATE ENGAGEMENT
// ============================================================================

router.post(
  "/",
  auth.requireAuth,
  audit.logAction("CREATE_ENGAGEMENT"),
  async (req, res) => {
    try {
      const {
        entity_id,
        engagement_type,
        framework_code,
        financial_year_end,
        partner_id,
        manager_id,
        estimated_budget_hours
      } = req.body;

      // Validate required fields
      if (!entity_id || !engagement_type || !framework_code) {
        return res.status(400).json({
          error: "Missing required fields: entity_id, engagement_type, framework_code"
        });
      }

      // Get entity to determine jurisdiction
      const entity = await db.query(
        "SELECT * FROM entities WHERE id = $1",
        [entity_id]
      );

      if (entity.rows.length === 0) {
        return res.status(404).json({ error: "Entity not found" });
      }

      const entityData = entity.rows[0];

      // Calculate materiality
      const materiality = jurisdictionEngine.calculateJurisdictionMateriality(
        entityData.jurisdiction_code,
        {
          profit: entityData.turnover * 0.15,
          revenue: entityData.turnover,
          assets: entityData.total_assets
        }
      );

      // Create engagement
      const result = await db.query(
        `INSERT INTO engagements (
          organization_id,
          entity_id,
          engagement_type,
          framework_code,
          financial_year_end,
          partner_id,
          manager_id,
          estimated_budget_hours,
          materiality,
          performance_materiality,
          trivial_threshold,
          created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
          req.user.organization_id,
          entity_id,
          engagement_type,
          framework_code,
          financial_year_end,
          partner_id,
          manager_id,
          estimated_budget_hours,
          materiality.overall_materiality,
          materiality.performance_materiality,
          materiality.trivial_threshold,
          req.user.id
        ]
      );

      const engagement = result.rows[0];

      // Generate and insert applicable procedures
      const procedures = jurisdictionEngine.getApplicableProcedures(
        entityData.jurisdiction_code,
        "Revenue",
        "Medium"
      );

      for (const proc of procedures) {
        await db.query(
          `INSERT INTO procedures (
            engagement_id,
            procedure_code,
            procedure_name,
            fsli,
            assertion,
            sample_size,
            estimated_hours,
            created_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            engagement.id,
            proc.id,
            proc.name,
            proc.fsli,
            proc.assertion,
            proc.sample_size,
            proc.estimated_hours,
            req.user.id
          ]
        );
      }

      res.status(201).json({
        success: true,
        engagement: {
          id: engagement.id,
          entity_id: engagement.entity_id,
          status: engagement.status,
          materiality: {
            overall: engagement.materiality,
            performance: engagement.performance_materiality,
            trivial: engagement.trivial_threshold
          },
          procedures_count: procedures.length
        }
      });
    } catch (error) {
      console.error("Error creating engagement:", error);
      res.status(500).json({ error: "Failed to create engagement" });
    }
  }
);

// ============================================================================
// GET ENGAGEMENT
// ============================================================================

router.get(
  "/:id",
  auth.requireAuth,
  audit.logAction("VIEW_ENGAGEMENT"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Get engagement with related data
      const engagement = await db.query(
        `SELECT
          e.*,
          ent.name as entity_name,
          ent.jurisdiction_code,
          ent.turnover,
          ent.total_assets,
          u_partner.first_name || ' ' || u_partner.last_name as partner_name,
          u_manager.first_name || ' ' || u_manager.last_name as manager_name,
          COUNT(DISTINCT p.id) as total_procedures,
          COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) as completed_procedures,
          COUNT(DISTINCT f.id) as open_findings
        FROM engagements e
        JOIN entities ent ON e.entity_id = ent.id
        LEFT JOIN users u_partner ON e.partner_id = u_partner.id
        LEFT JOIN users u_manager ON e.manager_id = u_manager.id
        LEFT JOIN procedures p ON e.id = p.engagement_id
        LEFT JOIN findings f ON e.id = f.engagement_id AND f.status != 'closed'
        WHERE e.id = $1 AND e.organization_id = $2
        GROUP BY e.id, ent.id, u_partner.id, u_manager.id`,
        [id, req.user.organization_id]
      );

      if (engagement.rows.length === 0) {
        return res.status(404).json({ error: "Engagement not found" });
      }

      const engagementData = engagement.rows[0];

      // Get jurisdiction info
      const jurisdictionInfo = jurisdictionEngine.getJurisdiction(
        engagementData.jurisdiction_code
      );

      // Get compliance calendar
      const calendar = jurisdictionEngine.getComplianceCalendar(
        engagementData.jurisdiction_code,
        engagementData.financial_year_end
      );

      res.json({
        success: true,
        engagement: {
          id: engagementData.id,
          entity: {
            id: engagementData.entity_id,
            name: engagementData.entity_name,
            jurisdiction: engagementData.jurisdiction_code,
            turnover: engagementData.turnover,
            assets: engagementData.total_assets
          },
          type: engagementData.engagement_type,
          framework: engagementData.framework_code,
          status: engagementData.status,
          financialYearEnd: engagementData.financial_year_end,
          partner: engagementData.partner_name,
          manager: engagementData.manager_name,
          materiality: {
            overall: engagementData.materiality,
            performance: engagementData.performance_materiality,
            trivial: engagementData.trivial_threshold
          },
          procedures: {
            total: engagementData.total_procedures,
            completed: engagementData.completed_procedures,
            percentage: Math.round(
              (engagementData.completed_procedures / engagementData.total_procedures) * 100
            ) || 0
          },
          findings: {
            open: engagementData.open_findings
          },
          jurisdiction: jurisdictionInfo,
          calendar: calendar,
          hours: {
            estimated: engagementData.estimated_budget_hours,
            actual: engagementData.actual_hours_spent
          }
        }
      });
    } catch (error) {
      console.error("Error fetching engagement:", error);
      res.status(500).json({ error: "Failed to fetch engagement" });
    }
  }
);

// ============================================================================
// LIST ENGAGEMENTS
// ============================================================================

router.get(
  "/",
  auth.requireAuth,
  audit.logAction("LIST_ENGAGEMENTS"),
  async (req, res) => {
    try {
      const { status, jurisdiction, framework } = req.query;
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const offset = parseInt(req.query.offset) || 0;

      // Build query
      let whereClause = "WHERE e.organization_id = $1";
      const params = [req.user.organization_id];
      let paramCount = 2;

      if (status) {
        whereClause += ` AND e.status = $${paramCount}`;
        params.push(status);
        paramCount++;
      }

      if (jurisdiction) {
        whereClause += ` AND ent.jurisdiction_code = $${paramCount}`;
        params.push(jurisdiction);
        paramCount++;
      }

      if (framework) {
        whereClause += ` AND e.framework_code = $${paramCount}`;
        params.push(framework);
        paramCount++;
      }

      // Get engagements
      const result = await db.query(
        `SELECT
          e.id,
          ent.name as entity_name,
          ent.jurisdiction_code,
          e.engagement_type,
          e.framework_code,
          e.status,
          e.financial_year_end,
          e.materiality,
          u_partner.first_name || ' ' || u_partner.last_name as partner,
          COUNT(DISTINCT p.id) as total_procedures,
          COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) as completed_procedures,
          ROUND(
            100.0 * COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) /
            NULLIF(COUNT(DISTINCT p.id), 0)
          ) as completion_percentage
        FROM engagements e
        JOIN entities ent ON e.entity_id = ent.id
        LEFT JOIN users u_partner ON e.partner_id = u_partner.id
        LEFT JOIN procedures p ON e.id = p.engagement_id
        ${whereClause}
        GROUP BY e.id, ent.name, ent.jurisdiction_code, u_partner.id
        ORDER BY e.created_at DESC
        LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
        [...params, limit, offset]
      );

      // Get total count
      const countResult = await db.query(
        `SELECT COUNT(*) as total FROM engagements e
        JOIN entities ent ON e.entity_id = ent.id
        ${whereClause}`,
        params
      );

      res.json({
        success: true,
        engagements: result.rows,
        pagination: {
          total: parseInt(countResult.rows[0].total),
          limit,
          offset,
          pages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
        }
      });
    } catch (error) {
      console.error("Error listing engagements:", error);
      res.status(500).json({ error: "Failed to list engagements" });
    }
  }
);

// ============================================================================
// UPDATE ENGAGEMENT STATUS
// ============================================================================

router.patch(
  "/:id/status",
  auth.requireAuth,
  audit.logAction("UPDATE_ENGAGEMENT_STATUS"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["planning", "fieldwork", "review", "completed", "archived"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const result = await db.query(
        "UPDATE engagements SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND organization_id = $3 RETURNING *",
        [status, id, req.user.organization_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Engagement not found" });
      }

      res.json({
        success: true,
        message: `Engagement status updated to ${status}`,
        engagement: result.rows[0]
      });
    } catch (error) {
      console.error("Error updating engagement:", error);
      res.status(500).json({ error: "Failed to update engagement" });
    }
  }
);

// ============================================================================
// GET MATERIALITY
// ============================================================================

router.get(
  "/:id/materiality",
  auth.requireAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      const engagement = await db.query(
        `SELECT e.*, ent.jurisdiction_code, ent.turnover, ent.total_assets
        FROM engagements e
        JOIN entities ent ON e.entity_id = ent.id
        WHERE e.id = $1 AND e.organization_id = $2`,
        [id, req.user.organization_id]
      );

      if (engagement.rows.length === 0) {
        return res.status(404).json({ error: "Engagement not found" });
      }

      const engData = engagement.rows[0];

      // Recalculate materiality
      const materiality = jurisdictionEngine.calculateJurisdictionMateriality(
        engData.jurisdiction_code,
        {
          profit: engData.turnover * 0.15,
          revenue: engData.turnover,
          assets: engData.total_assets
        }
      );

      res.json({
        success: true,
        materiality: {
          overall_materiality: materiality.overall_materiality,
          performance_materiality: materiality.performance_materiality,
          trivial_threshold: materiality.trivial_threshold,
          benchmarks: materiality.benchmarks,
          jurisdiction: engData.jurisdiction_code
        }
      });
    } catch (error) {
      console.error("Error fetching materiality:", error);
      res.status(500).json({ error: "Failed to fetch materiality" });
    }
  }
);

// ============================================================================
// GET PROCEDURES
// ============================================================================

router.get(
  "/:id/procedures",
  auth.requireAuth,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { fsli, status } = req.query;

      let whereClause = "WHERE p.engagement_id = $1";
      const params = [id];
      let paramCount = 2;

      if (fsli) {
        whereClause += ` AND p.fsli = $${paramCount}`;
        params.push(fsli);
        paramCount++;
      }

      if (status) {
        whereClause += ` AND p.status = $${paramCount}`;
        params.push(status);
        paramCount++;
      }

      const result = await db.query(
        `SELECT
          p.*,
          u.first_name || ' ' || u.last_name as assigned_to_name,
          COUNT(DISTINCT e.id) as evidence_count
        FROM procedures p
        LEFT JOIN users u ON p.assigned_to = u.id
        LEFT JOIN evidence e ON p.id = e.procedure_id
        ${whereClause}
        GROUP BY p.id, u.id
        ORDER BY p.fsli, p.created_at`,
        params
      );

      res.json({
        success: true,
        procedures: result.rows,
        total_procedures: result.rows.length
      });
    } catch (error) {
      console.error("Error fetching procedures:", error);
      res.status(500).json({ error: "Failed to fetch procedures" });
    }
  }
);

module.exports = router;
