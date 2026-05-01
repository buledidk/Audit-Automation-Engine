/**
 * SERVER-SIDE SUPABASE CLIENT
 * Uses service_role key to bypass RLS for server operations
 * NEVER expose this client to the frontend
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  console.log('✅ Server Supabase client initialized (service_role)');
} else {
  console.warn('⚠️ Server Supabase not configured — using mock data fallback');
  if (!supabaseServiceKey) console.warn('   Missing: SUPABASE_SERVICE_ROLE_KEY');
}

export function isServerSupabaseConfigured() {
  return supabaseAdmin !== null;
}

export function getServerSupabase() {
  return supabaseAdmin;
}

export default supabaseAdmin;
