// backend/config/supabaseClient.js
//
// Two kinds of Supabase client, both needed:
//   1. A per-request client scoped to the logged-in user's JWT, so Row
//      Level Security (auth.uid()) resolves correctly for THAT user.
//   2. One shared admin client using the service role key, which bypasses
//      RLS entirely — only for the handful of backend-only writes
//      (profile_stats) that have no client-side write policy on purpose.

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

for (const [key, val] of Object.entries({
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
})) {
  if (!val) throw new Error(`Missing required env var: ${key}`);
}

// A base anon client for calls that happen before a user has a session yet
// (signup, login). Exported separately from the per-request factory below.
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function createUserScopedClient(userAccessToken) {
  // Call once per incoming authenticated request, passing the JWT from
  // that user's Authorization header. This makes auth.uid() resolve
  // correctly inside Supabase's RLS checks.
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: { Authorization: `Bearer ${userAccessToken}` },
    },
  });
}

// Shared admin client — bypasses RLS. ONLY services/profileStats.service.js
// should ever import this.
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

module.exports = { supabaseAnon, createUserScopedClient, supabaseAdmin };
