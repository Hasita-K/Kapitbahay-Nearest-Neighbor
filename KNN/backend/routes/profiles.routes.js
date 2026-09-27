const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const controller = require('../controllers/profiles.controller');

router.use(requireAuth);
router.get('/me', controller.getMine);
router.get('/me/stats', controller.getStats);

module.exports = router;
