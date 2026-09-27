// backend/routes/villages.routes.js
//
// Purpose: HTTP layer only — verb + path, nothing else. No logic here ever.

const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const controller = require('../controllers/villages.controller');

router.use(requireAuth);
// Every route in this file requires a logged-in user — attach once here
// instead of repeating requireAuth on every single line below.

router.get('/', controller.listMyVillages);
router.post('/', controller.createVillage);
router.post('/:villageId/members', controller.addMember);
router.delete('/:villageId/members/:memberId', controller.removeMember);

module.exports = router;