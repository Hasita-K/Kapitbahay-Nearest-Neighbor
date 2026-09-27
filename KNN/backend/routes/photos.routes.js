// backend/routes/photos.routes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const controller = require('../controllers/photos.controller');

router.use(requireAuth);

router.post('/:requestId', controller.upload);
router.get('/mine', controller.listMine);
router.get('/:requestId', controller.get);

module.exports = router;
