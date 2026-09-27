const service = require('../services/profiles.service');

async function getMine(req, res, next) {
  try { res.json({ data: await service.getMine(req.supabase, req.user.id) }); }
  catch (error) { next(error); }
}

async function getStats(req, res, next) {
  try { res.json({ data: await service.getStats(req.supabase, req.user.id) }); }
  catch (error) { next(error); }
}

module.exports = { getMine, getStats };
