// backend/services/fridgeItems.service.js

async function listMine(supabase, userId) {
  const { data, error } = await supabase
    .from('fridge_items')
    .select('*')
    .eq('owner_id', userId);
  if (error) throwHttp(error.message, 400);
  return data;
}

async function listByOwner(supabase, ownerId) {
  // RLS allows any authenticated user to SELECT any fridge_items row —
  // this is how villagers browse each other's fridges.
  const { data, error } = await supabase
    .from('fridge_items')
    .select('*')
    .eq('owner_id', ownerId);
  if (error) throwHttp(error.message, 400);
  return data;
}

async function create(supabase, userId, { icon, name, count }) {
  if (!name || !name.trim()) throwHttp('name is required', 400);
  if (count === undefined || count === null || count < 0) throwHttp('count must be a non-negative number', 400);

  const { data, error } = await supabase
    .from('fridge_items')
    .insert({ owner_id: userId, icon: icon || null, name, count })
    .select()
    .single();
  if (error) throwHttp(error.message, 400);
  return data;
}

async function update(supabase, fridgeItemId, updates) {
  const allowed = {};
  if (updates.icon !== undefined) allowed.icon = updates.icon;
  if (updates.name !== undefined) allowed.name = updates.name;
  if (updates.count !== undefined) allowed.count = updates.count;

  if (Object.keys(allowed).length === 0) throwHttp('No valid fields to update', 400);

  const { data, error } = await supabase
    .from('fridge_items')
    .update(allowed)
    .eq('fridge_items_id', fridgeItemId)
    .select()
    .single();
  if (error) throwHttp(error.message, 400);
  return data;
}

async function remove(supabase, fridgeItemId) {
  const { error } = await supabase
    .from('fridge_items')
    .delete()
    .eq('fridge_items_id', fridgeItemId);
  if (error) throwHttp(error.message, 400);
  return { removed: true };
}

function throwHttp(message, status) {
  const e = new Error(message);
  e.status = status;
  throw e;
}

module.exports = { listMine, listByOwner, create, update, remove };
