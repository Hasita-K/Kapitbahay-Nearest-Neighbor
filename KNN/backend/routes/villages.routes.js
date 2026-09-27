// backend/routes/villages.routes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const controller = require('../controllers/villages.controller');

router.use(requireAuth);

router.get('/', controller.listMine);
router.get('/lookup', controller.lookup);
router.post('/', controller.create);
router.post('/:villageId/members', controller.addMember);
router.delete('/:villageId/members/:memberId', controller.removeMember);

module.exports = router;
