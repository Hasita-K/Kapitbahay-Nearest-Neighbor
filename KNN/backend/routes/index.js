// backend/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/villages', require('./villages.routes'));
router.use('/fridge-items', require('./fridgeItems.routes'));

module.exports = router;