// backend/controllers/foodRequests.controller.js
const service = require('../services/foodRequests.service');

async function create(req, res, next) {
  try {
    const request = await service.createRequest(req.supabase, req.user.id, req.body);
    res.status(201).json({ data: request });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const requests = await service.listForUser(req.supabase, req.user.id);
    res.json({ data: requests });
  } catch (err) {
    next(err);
  }
}

async function accept(req, res, next) {
  try {
    const request = await service.accept(req.supabase, req.user.id, req.params.id);
    res.json({ data: request });
  } catch (err) {
    next(err);
  }
}

async function reject(req, res, next) {
  try {
    const request = await service.reject(req.supabase, req.user.id, req.params.id);
    res.json({ data: request });
  } catch (err) {
    next(err);
  }
}

async function counter(req, res, next) {
  try {
    const request = await service.counter(req.supabase, req.user.id, req.params.id);
    res.json({ data: request });
  } catch (err) {
    next(err);
  }
}

async function updateOffer(req, res, next) {
  try {
    const request = await service.updateOffer(req.supabase, req.user.id, req.params.id, req.body.offered_items);
    res.json({ data: request });
  } catch (err) {
    next(err);
  }
}

async function complete(req, res, next) {
  try {
    const request = await service.complete(req.supabase, req.user.id, req.params.id);
    res.json({ data: request });
  } catch (err) {
    next(err);
  }
}

async function thankYou(req, res, next) {
  try {
    const request = await service.thankYou(req.supabase, req.user.id, req.params.id);
    res.json({ data: request });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, accept, reject, counter, updateOffer, complete, thankYou };
