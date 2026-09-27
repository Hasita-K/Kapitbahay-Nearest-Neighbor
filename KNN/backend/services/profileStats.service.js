// backend/services/profileStats.service.js
//
// profile_stats has no write policy and no trigger, on purpose. This is
// the ONLY file in the whole backend allowed to import supabaseAdmin.
// Every other service must go through req.supabase (user-scoped) instead.
//
// NOTE (known tradeoff, flag to team): this does a read-then-write, not an
// atomic increment. Fine at hackathon scale/traffic, but two completions
// landing in the same instant could race. If that ever matters, replace
// this with a Postgres RPC function (`increment_deals_completed(uid)`)
// that does `SET deals_completed = deals_completed + 1` in one statement.

const { supabaseAdmin } = require('../config/supabaseClient');

async function incrementDealsCompleted(userIds) {
  for (const userId of userIds) {
    await incrementColumn('deals_completed', userId);
  }
}

async function incrementThankYouCount(userId) {
  await incrementColumn('thank_you_count', userId);
}

async function incrementColumn(column, userId) {
  const { data: current, error: readError } = await supabaseAdmin
    .from('profile_stats')
    .select(column)
    .eq('profiles_id', userId)
    .single();
  if (readError) throwHttp(readError.message, 500);

  const { error: writeError } = await supabaseAdmin
    .from('profile_stats')
    .update({ [column]: current[column] + 1 })
    .eq('profiles_id', userId);
  if (writeError) throwHttp(writeError.message, 500);
}

function throwHttp(message, status) {
  const e = new Error(message);
  e.status = status;
  throw e;
}

module.exports = { incrementDealsCompleted, incrementThankYouCount };
