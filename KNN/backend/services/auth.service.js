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
//
// PROFILE CREATION: a Postgres trigger on auth.users (handle_new_user)
// automatically inserts the matching profiles row (id, username,
// phone_number, unique_friend_code) whenever a new auth user is created.
// It reads username/phone_number out of raw_user_meta_data — that's why
// signUp() below passes them via options.data. Do NOT also insert into
// profiles from this file; the trigger is the single source of truth for
// that insert, and doing it twice will collide on the profiles.id
// primary key.

const { supabaseAnon } = require('../config/supabaseClient');

function usernameToEmail(username) {
  return `${username.toLowerCase()}@friendlyneighbor.app`;
}

async function signUp({ username, password, phone_number }) {
  const email = usernameToEmail(username);

  const { data, error } = await supabaseAnon.auth.signUp({
    email,
    password,
    options: {
      // Ends up in auth.users.raw_user_meta_data, which the
      // handle_new_user trigger reads to build the profiles row.
      data: {
        username,
        phone_number: phone_number || null,
      },
    },
  });
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
