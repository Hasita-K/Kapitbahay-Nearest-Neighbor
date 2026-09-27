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
    // Services throw; they never touch res directly.
  }

  return data;
}

module.exports = { listForUser /*, create, addMember, removeMember */ };