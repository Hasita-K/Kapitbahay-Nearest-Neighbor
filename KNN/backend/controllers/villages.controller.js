// backend/controllers/villages.controller.js
//
// Purpose: pull data off the request, call a service, shape the response.
// No business logic or Supabase queries here — those live in the service.

const villagesService = require('../services/villages.service');

async function listMyVillages(req, res, next) {
  try {
    const villages = await villagesService.listForUser(req.supabase, req.user.id);
    res.json({ data: villages });
  } catch (err) {
    next(err);
  }
}

async function createVillage(req, res, next) {
  try {
    const { name } = req.body;
    const village = await villagesService.create(req.supabase, req.user.id, name);
    res.status(201).json({ data: village });
  } catch (err) {
    next(err);
  }
}

async function addMember(req, res, next) {
  try {
    const { villageId } = req.params;
    const { friendCode } = req.body;
    // Adding by friend code, not raw user ID — matches the PRD's
    // "unique friend code" flow, and means the frontend never needs
    // to know another user's actual UUID.

    const member = await villagesService.addMember(req.supabase, req.user.id, villageId, friendCode);
    res.status(201).json({ data: member });
  } catch (err) {
    next(err);
  }
}

async function removeMember(req, res, next) {
  try {
    const { villageId, memberId } = req.params;

    await villagesService.removeMember(req.supabase, req.user.id, villageId, memberId);
    res.status(204).send();
    // 204 = "success, no content to return" — correct for a DELETE
    // that doesn't need to send anything back.
  } catch (err) {
    next(err);
  }
}

module.exports = { listMyVillages, createVillage, addMember, removeMember };