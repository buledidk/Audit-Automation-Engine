/**
 * DATABASE MIGRATION RUNNER
 * Executes SQL migrations for GDPR and encryption setup
 */

import postgres from "postgres";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sql = postgres({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "audit_automation",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
});

async function runMigrations() {
  try {
    console.log("Running database migrations...");

    // Create migration tracking table if it doesn't exist
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const migrationsDir = path.join(__dirname, "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    // Get already-applied migrations
    const applied = await sql`SELECT name FROM _migrations ORDER BY name`;
    const appliedSet = new Set(applied.map((r) => r.name));

    let newMigrations = 0;

    for (const file of migrationFiles) {
      if (appliedSet.has(file)) {
        console.log(`-- Skipping (already applied): ${file}`);
        continue;
      }

      const filePath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(filePath, "utf-8");

      console.log(`Running migration: ${file}`);
      try {
        await sql.begin(async (tx) => {
          await tx.unsafe(migrationSQL);
          await tx`INSERT INTO _migrations (name) VALUES (${file})`;
        });
        console.log(`Completed: ${file}`);
        newMigrations++;
      } catch (error) {
        console.error(`FAILED: ${file}:`, error.message);
        console.error("Halting migrations due to error.");
        await sql.end();
        process.exit(1);
      }
    }

    console.log(
      newMigrations > 0
        ? `All migrations completed! (${newMigrations} new)`
        : "No new migrations to apply."
    );
    await sql.end();
  } catch (error) {
    console.error("Migration runner error:", error);
    process.exit(1);
  }
}

runMigrations();
