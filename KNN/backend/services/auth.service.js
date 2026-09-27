// backend/services/auth.service.js
//
// Supabase Auth needs an email or phone to sign up with, but the product
// only wants username + password + phone_number in the UI. Working
// assumption (per project notes, NOT yet confirmed with the team):
// synthesize an internal email like `${username}@friendlyneighbor.app`.
//
// This ALSO assumes Supabase's "Confirm email" setting is turned OFF in
// the dashboard (Authentication -> Providers -> Email). If it's on,
// signUp() won't return a usable session immediately and this flow breaks.
// Flag this explicitly to the team before relying on it.

const { supabaseAnon, createUserScopedClient } = require('../config/supabaseClient');

function usernameToEmail(username) {
  return `${username.toLowerCase()}@friendlyneighbor.app`;
}

async function signUp({ username, password, phone_number }) {
  const email = usernameToEmail(username);

  const { data, error } = await supabaseAnon.auth.signUp({ email, password });
  if (error) {
    const e = new Error(error.message);
    e.status = 400;
    throw e;
  }

  if (!data.session) {
    const e = new Error(
      'Signup succeeded but no session was returned — check that "Confirm email" is disabled in Supabase Auth settings'
    );
    e.status = 500;
    throw e;
  }

  // Insert the profiles row AS the new user (not as admin), so RLS's
  // "INSERT (own)" policy (auth.uid() = id) is satisfied.
  const userClient = createUserScopedClient(data.session.access_token);
  const { error: profileError } = await userClient.from('profiles').insert({
    id: data.user.id,
    username,
    phone_number: phone_number || null,
  });

  if (profileError) {
    const e = new Error(profileError.message);
    e.status = 400;
    throw e;
  }

  return {
    user: { id: data.user.id, username },
    session: data.session,
  };
}

async function logIn({ username, password }) {
  const email = usernameToEmail(username);

  const { data, error } = await supabaseAnon.auth.signInWithPassword({ email, password });
  if (error) {
    const e = new Error('Invalid username or password');
    e.status = 401;
    throw e;
  }

  return { user: data.user, session: data.session };
}

module.exports = { signUp, logIn, usernameToEmail };
