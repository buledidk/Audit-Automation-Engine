/**
 * Environment Variable Mapper
 * Maps VITE_* browser env vars to their server-side equivalents.
 * Must be imported before any module that reads these env vars.
 *
 * Node's --env-file-if-exists flag loads .env.local into process.env,
 * then this module bridges the VITE_ prefix gap for CLI/server usage.
 */

const ENV_MAPPINGS = {
  VITE_CLAUDE_API_KEY: 'ANTHROPIC_API_KEY',
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
  console.warn('AI features will be disabled. Set ANTHROPIC_API_KEY or add VITE_CLAUDE_API_KEY to .env.local');
}
