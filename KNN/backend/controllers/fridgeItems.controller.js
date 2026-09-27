// backend/controllers/fridgeItems.controller.js
//
// Purpose: pull data off the request, call a service, shape the response.
// No business logic or Supabase queries here — those live in the service.

const fridgeItemsService = require('../services/fridgeItems.service');

async function listMyItems(req, res, next) {
  try {
    const items = await fridgeItemsService.listForUser(req.supabase, req.user.id);
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
}

async function createItem(req, res, next) {
  try {
    const { icon, name, count } = req.body;
    const item = await fridgeItemsService.create(req.supabase, req.user.id, { icon, name, count });
    res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
}

async function updateCount(req, res, next) {
  try {
    const { itemId } = req.params;
    const { delta } = req.body;
    // delta is a signed number: +1 to increase, -1 to decrease.
    // Keeping the math in the service, not here — the controller just
    // passes along what the client asked for.

    const item = await fridgeItemsService.updateCount(req.supabase, req.user.id, itemId, delta);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    const { itemId } = req.params;
    await fridgeItemsService.remove(req.supabase, req.user.id, itemId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listMyItems, createItem, updateCount, deleteItem };