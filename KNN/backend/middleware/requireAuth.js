// backend/middleware/requireAuth.js
//
// Reads the JWT off Authorization, verifies it with Supabase, attaches a
// user-scoped client (req.supabase) and the verified user (req.user).

const { createUserScopedClient } = require('../config/supabaseClient');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { message: 'Missing or malformed Authorization header', status: 401 },
    });
  }

  const token = authHeader.split(' ')[1];
  const supabase = createUserScopedClient(token);

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({
      error: { message: 'Invalid or expired session', status: 401 },
    });
  }

  req.user = data.user;
  req.supabase = supabase;
  next();
}

module.exports = requireAuth;
