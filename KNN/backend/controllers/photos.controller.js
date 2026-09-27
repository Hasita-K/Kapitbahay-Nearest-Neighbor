// backend/controllers/photos.controller.js
const service = require('../services/photos.service');

async function upload(req, res, next) {
  try {
    const photo = await service.recordPhoto(req.supabase, req.user.id, req.params.requestId, req.body.photo_url);
    res.status(201).json({ data: photo });
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const photo = await service.getPhoto(req.supabase, req.params.requestId);
    res.json({ data: photo });
  } catch (err) {
    next(err);
  }
}

async function listMine(req, res, next) {
  try {
    const photos = await service.listMine(req.supabase, req.user.id);
    res.json({ data: photos });
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, get, listMine };
