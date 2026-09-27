// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

// No requireAuth here — these routes are how a user OBTAINS a session.
router.post('/signup', controller.signup);
router.post('/login', controller.login);

module.exports = router;
