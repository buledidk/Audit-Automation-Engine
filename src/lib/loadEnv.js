/**
 * Environment Variable Mapper
 * Maps VITE_* browser env vars to their server-side equivalents.
 * Must be imported before any module that reads these env vars.
 *
 * Node's --env-file-if-exists flag loads .env.local into process.env,
 * then this module bridges the VITE_ prefix gap for CLI/server usage.
 *
 * S1-00 (May 2026): the Anthropic API key bridge has been removed. The Anthropic
 * key is now ANTHROPIC_API_KEY only — never `VITE_` prefixed — because Vite
 * bakes any VITE_* var into the client bundle. Browser code calls AI via
 * /api/ai (see src/services/aiProxyClient.js).
 */

const ENV_MAPPINGS = {
  VITE_SUPABASE_URL: 'SUPABASE_URL',
  VITE_SUPABASE_ANON_KEY: 'SUPABASE_ANON_KEY',
};

for (const [viteKey, serverKey] of Object.entries(ENV_MAPPINGS)) {
  if (!process.env[serverKey] && process.env[viteKey]) {
    process.env[serverKey] = process.env[viteKey];
  }
}

const missing = ['ANTHROPIC_API_KEY'].filter(k => !process.env[k]);
if (missing.length) {
  console.warn(`⚠ Optional env vars not set: ${missing.join(', ')}`);
  console.warn('AI features will be disabled. Set ANTHROPIC_API_KEY (server-side env, never VITE_ prefix) in .env.local.');
}
