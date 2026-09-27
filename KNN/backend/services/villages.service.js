// backend/services/villages.service.js
// Every function takes the caller's req.supabase (user-scoped, RLS-aware)
// as its first argument — never the shared admin client.

async function listForUser(supabase, userId) {
  const [{ data: owned, error: ownedError }, { data: memberships, error: memberError }] = await Promise.all([
    supabase.from('villages').select('villages_id,name,owner_id,created_at').eq('owner_id', userId),
    supabase.from('village_members').select('village_mem_id,village_id,friend_user_id').eq('friend_user_id', userId),
  ]);
  if (ownedError) throwHttp(ownedError.message, 400);
  if (memberError) throwHttp(memberError.message, 400);

  const memberVillageIds = (memberships || []).map((row) => row.village_id);
  const { data: joined, error: joinedError } = memberVillageIds.length
    ? await supabase.from('villages').select('villages_id,name,owner_id,created_at').in('villages_id', memberVillageIds)
    : { data: [], error: null };
  if (joinedError) throwHttp(joinedError.message, 400);

  const villages = [...new Map([...(owned || []), ...(joined || [])].map((v) => [v.villages_id, v])).values()];
  if (!villages.length) return [];
  const { data: allMemberships, error: allMembersError } = await supabase
    .from('village_members').select('village_mem_id,village_id,friend_user_id').in('village_id', villages.map((v) => v.villages_id));
  if (allMembersError) throwHttp(allMembersError.message, 400);

  const userIds = [...new Set(villages.flatMap((v) => [v.owner_id, ...(allMemberships || [])
    .filter((m) => m.village_id === v.villages_id).map((m) => m.friend_user_id)]))];
  const { data: profiles, error: profileError } = await supabase
    .from('profiles').select('id,username,unique_friend_code').in('id', userIds);
  if (profileError) throwHttp(profileError.message, 400);

  const profileById = new Map((profiles || []).map((p) => [p.id, p]));
  return villages.map((v) => ({
    ...v,
    members: [v.owner_id, ...(allMemberships || []).filter((m) => m.village_id === v.villages_id)
      .map((m) => m.friend_user_id)].filter((id, index, list) => list.indexOf(id) === index)
      .map((id) => ({ user_id: id, username: profileById.get(id)?.username || 'Villager',
        member_id: (allMemberships || []).find((m) => m.village_id === v.villages_id && m.friend_user_id === id)?.village_mem_id })),
  }));
}

async function lookupByCode(supabase, code, userId) {
  if (!code || !code.trim()) throwHttp('Friend code is required', 400);
  const { data, error } = await supabase.from('profiles')
    .select('id,username,unique_friend_code').ilike('unique_friend_code', code.trim()).maybeSingle();
  if (error) throwHttp(error.message, 400);
  if (!data) throwHttp('No villager found with that code', 404);
  if (data.id === userId) throwHttp('That is your own friend code', 400);
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
    .eq('village_mem_id', memberId);
  if (error) throwHttp(error.message, 400);
  return { removed: true };
}

function throwHttp(message, status) {
  const e = new Error(message);
  e.status = status;
  throw e;
}

module.exports = { listForUser, lookupByCode, create, addMember, removeMember };
