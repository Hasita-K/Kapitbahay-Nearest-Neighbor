// backend/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/profiles', require('./profiles.routes'));
router.use('/villages', require('./villages.routes'));
router.use('/fridge-items', require('./fridgeItems.routes'));
router.use('/food-requests', require('./foodRequests.routes'));
router.use('/photos', require('./photos.routes'));

module.exports = router;
