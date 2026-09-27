// backend/services/villages.service.js
// Every function takes the caller's req.supabase (user-scoped, RLS-aware)
// as its first argument — never the shared admin client.

async function listForUser(supabase, userId) {
  const { data, error } = await supabase
    .from('villages')
    .select('*')
    .eq('owner_id', userId);
  if (error) throwHttp(error.message, 400);
  return data;
}

async function create(supabase, userId, name) {
  if (!name || !name.trim()) throwHttp('name is required', 400);

  const { data, error } = await supabase
    .from('villages')
    .insert({ name, owner_id: userId })
    .select()
    .single();
  if (error) throwHttp(error.message, 400);
  return data;
}

async function addMember(supabase, villageId, friendUserId) {
  if (!friendUserId) throwHttp('friend_user_id is required', 400);

  const { data, error } = await supabase
    .from('village_members')
    .insert({ village_id: villageId, friend_user_id: friendUserId })
    .select()
    .single();
  if (error) throwHttp(error.message, 400);
  return data;
}

async function removeMember(supabase, memberId) {
  const { error } = await supabase
    .from('village_members')
    .delete()
    .eq('village_member_id', memberId);
  if (error) throwHttp(error.message, 400);
  return { removed: true };
}

function throwHttp(message, status) {
  const e = new Error(message);
  e.status = status;
  throw e;
}

module.exports = { listForUser, create, addMember, removeMember };
