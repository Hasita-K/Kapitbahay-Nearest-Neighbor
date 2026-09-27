// backend/routes/fridgeItems.routes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const controller = require('../controllers/fridgeItems.controller');

router.use(requireAuth);

router.get('/', controller.listMine);
router.get('/:ownerId', controller.listByOwner);
router.post('/', controller.create);
router.patch('/:fridgeItemId', controller.update);
router.delete('/:fridgeItemId', controller.remove);

module.exports = router;
