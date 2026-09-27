// backend/services/villages.service.js
//
// Purpose: ALL business logic + Supabase queries live here. Services take
// plain arguments (never req/res directly), return data or throw — this
// keeps them testable and reusable outside of Express entirely.

async function listForUser(supabase, userId) {
  const { data, error } = await supabase
    .from('villages')
    .select('*')
    .eq('owner_id', userId);

  if (error) {
    const e = new Error(error.message);
    e.status = 400;
    throw e;
  }

  return data;
}

async function create(supabase, ownerId, name) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    const e = new Error('Village name is required');
    e.status = 400;
    throw e;
  }

  const { data, error } = await supabase
    .from('villages')
    .insert({ name: name.trim(), owner_id: ownerId })
    .select()
    .single();

  if (error) {
    const e = new Error(error.message);
    e.status = 400;
    throw e;
  }

  return data;
}

async function assertOwnsVillage(supabase, userId, villageId) {
  // Shared check used by both addMember and removeMember — a village's
  // membership can only be managed by whoever owns it.
  const { data, error } = await supabase
    .from('villages')
    .select('villages_id')
    .eq('villages_id', villageId)
    .eq('owner_id', userId)
    .single();

  if (error || !data) {
    const e = new Error('Village not found or not owned by you');
    e.status = 404;
    throw e;
  }
}

async function addMember(supabase, ownerId, villageId, friendCode) {
  if (!friendCode || typeof friendCode !== 'string') {
    const e = new Error('friendCode is required');
    e.status = 400;
    throw e;
  }

  await assertOwnsVillage(supabase, ownerId, villageId);

  const { data: friendProfile, error: friendError } = await supabase
    .from('profiles')
    .select('id')
    .eq('unique_friend_code', friendCode.trim())
    .single();

  if (friendError || !friendProfile) {
    const e = new Error('No user found with that friend code');
    e.status = 404;
    throw e;
  }

  const { data, error } = await supabase
    .from('village_members')
    .insert({ village_id: villageId, friend_user_id: friendProfile.id })
    .select()
    .single();

  if (error) {
    const e = new Error(error.message);
    e.status = 400;
    // This is where the earlier UNIQUE-constraint bug would have shown
    // up as an error on the SECOND member added to any village — now
    // fixed, so this only fires on a genuine duplicate (id, friend) pair.
    throw e;
  }

  return data;
}

async function removeMember(supabase, ownerId, villageId, memberId) {
  await assertOwnsVillage(supabase, ownerId, villageId);

  const { error } = await supabase
    .from('village_members')
    .delete()
    .eq('village_mem_id', memberId)
    .eq('village_id', villageId);
    // Scoping by both IDs, not just village_mem_id, so a member row
    // can't be deleted via the wrong village's URL.

  if (error) {
    const e = new Error(error.message);
    e.status = 400;
    throw e;
  }
}

module.exports = { listForUser, create, addMember, removeMember };