async function getMine(supabase, userId) {
  // Never select `*` from profiles: the legacy table includes a password column.
  const { data, error } = await supabase.from('profiles')
    .select('id,username,phone_number,unique_friend_code,updated_at').eq('id', userId).single();
  if (error) throwHttp(error.message, 400);
  return data;
}

async function getStats(supabase, userId) {
  const { data, error } = await supabase.from('profile_stats')
    .select('deals_completed,thank_you_count').eq('profiles_id', userId).maybeSingle();
  if (error) throwHttp(error.message, 400);
  return data || { deals_completed: 0, thank_you_count: 0 };
}

function throwHttp(message, status) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

module.exports = { getMine, getStats };
