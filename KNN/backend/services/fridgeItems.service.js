// backend/services/fridgeItems.service.js
//
// Purpose: ALL business logic + Supabase queries live here. Services take
// plain arguments (never req/res directly), return data or throw — this
// keeps them testable and reusable outside of Express entirely.

async function listForUser(supabase, userId) {
  const { data, error } = await supabase
    .from('fridge_items')
    .select('*')
    .eq('owner_id', userId);

  if (error) {
    const e = new Error(error.message);
    e.status = 400;
    throw e;
  }

  return data;
}

async function create(supabase, ownerId, { icon, name, count }) {
  if (!icon || !name) {
    const e = new Error('icon and name are required');
    e.status = 400;
    throw e;
  }

  const { data, error } = await supabase
    .from('fridge_items')
    .insert({
      owner_id: ownerId,
      icon,
      name,
      count: count && count > 0 ? count : 1,
      // Table default is 1 anyway, but being explicit here avoids
      // relying on the DB default silently doing the right thing.
    })
    .select()
    .single();

  if (error) {
    const e = new Error(error.message);
    e.status = 400;
    throw e;
  }

  return data;
}

async function assertOwnsItem(supabase, userId, itemId) {
  const { data, error } = await supabase
    .from('fridge_items')
    .select('fridge_items_id, count')
    .eq('fridge_items_id', itemId)
    .eq('owner_id', userId)
    .single();

  if (error || !data) {
    const e = new Error('Fridge item not found or not owned by you');
    e.status = 404;
    throw e;
  }

  return data;
}

async function updateCount(supabase, ownerId, itemId, delta) {
  if (typeof delta !== 'number' || delta === 0) {
    const e = new Error('delta must be a non-zero number');
    e.status = 400;
    throw e;
  }

  const item = await assertOwnsItem(supabase, ownerId, itemId);
  // Reusing this both to confirm ownership AND to get the current count,
  // so we don't need a second round-trip.

  const newCount = item.count + delta;

  if (newCount < 0) {
    const e = new Error('Count cannot go below 0');
    e.status = 400;
    throw e;
    // The table's own CHECK (count >= 0) constraint would also catch
    // this, but failing here gives a clearer error message than a raw
    // Postgres constraint violation would.
  }

  const { data, error } = await supabase
    .from('fridge_items')
    .update({ count: newCount })
    .eq('fridge_items_id', itemId)
    .select()
    .single();

  if (error) {
    const e = new Error(error.message);
    e.status = 400;
    throw e;
  }

  return data;
  // Note: this does NOT auto-delete at count = 0. Per the PRD, hitting 0
  // should prompt the user to CONFIRM deletion — that's a frontend
  // decision (show a confirm dialog, then call DELETE), not something
  // the backend should do silently on the count update itself.
}

async function remove(supabase, ownerId, itemId) {
  await assertOwnsItem(supabase, ownerId, itemId);

  const { error } = await supabase
    .from('fridge_items')
    .delete()
    .eq('fridge_items_id', itemId);

  if (error) {
    const e = new Error(error.message);
    e.status = 400;
    throw e;
  }
}

module.exports = { listForUser, create, updateCount, remove };