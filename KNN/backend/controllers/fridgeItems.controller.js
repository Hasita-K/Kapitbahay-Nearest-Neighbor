// backend/controllers/fridgeItems.controller.js
const service = require('../services/fridgeItems.service');

async function listMine(req, res, next) {
  try {
    const items = await service.listMine(req.supabase, req.user.id);
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
}

async function listByOwner(req, res, next) {
  try {
    const items = await service.listByOwner(req.supabase, req.params.ownerId);
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const item = await service.create(req.supabase, req.user.id, req.body);
    res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const item = await service.update(req.supabase, req.params.fridgeItemId, req.body);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await service.remove(req.supabase, req.params.fridgeItemId);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { listMine, listByOwner, create, update, remove };
