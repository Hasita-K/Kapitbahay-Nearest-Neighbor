// backend/routes/index.js
//
// Purpose: aggregates every resource's route file into one router that
// app.js mounts. Empty for now since no Phase 1 tracks (auth, villages,
// food-requests) exist yet — this just lets the server boot cleanly.
// As each track gets built, add: router.use('/food-requests', require('./foodRequests.routes'));

const express = require('express');
const router = express.Router();

module.exports = router;