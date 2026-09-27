// backend/middleware/requireAuth.js
//
// Purpose: read the user's JWT off the Authorization header, verify it
// with Supabase, and attach a per-request, user-scoped Supabase client
// (req.supabase) plus the verified user object (req.user) so every
// downstream controller/service can use them without re-verifying.

const { createUserScopedClient } = require('../config/supabaseClient');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  // Expected format: "Bearer <jwt>"

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token at all — reject before touching Supabase.
    return res.status(401).json({ error: { message: 'Missing or malformed Authorization header', status: 401 } });
  }

  const token = authHeader.split(' ')[1];
  // Strip the "Bearer " prefix to get just the raw JWT.

  const supabase = createUserScopedClient(token);
  // Build a client that will make every subsequent query "as" this user.

  const { data, error } = await supabase.auth.getUser(token);
  // Ask Supabase to verify the token is real and not expired, and to
  // return the user it belongs to.

  if (error || !data?.user) {
    // Token was present but invalid/expired.
    return res.status(401).json({ error: { message: 'Invalid or expired session', status: 401 } });
  }

  req.user = data.user;
  // Downstream code can read req.user.id, req.user.email, etc.
  req.supabase = supabase;
  // Downstream services use THIS client, never a module-level shared one,
  // so RLS is enforced correctly per-user.

  next();
  // Hand off to the next middleware/controller.
}

module.exports = requireAuth;