// backend/controllers/villages.controller.js
const service = require('../services/villages.service');

async function listMine(req, res, next) {
  try {
    const villages = await service.listForUser(req.supabase, req.user.id);
    res.json({ data: villages });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const village = await service.create(req.supabase, req.user.id, req.body.name);
    res.status(201).json({ data: village });
  } catch (err) {
    next(err);
  }
}

async function lookup(req, res, next) {
  try {
    const profile = await service.lookupByCode(req.supabase, req.query.code, req.user.id);
    res.json({ data: profile });
  } catch (err) {
    next(err);
  }
}

async function addMember(req, res, next) {
  try {
    const member = await service.addMember(req.supabase, req.params.villageId, req.body.friend_user_id);
    res.status(201).json({ data: member });
  } catch (err) {
    next(err);
  }
}

async function removeMember(req, res, next) {
  try {
    const result = await service.removeMember(req.supabase, req.params.memberId);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { listMine, lookup, create, addMember, removeMember };
