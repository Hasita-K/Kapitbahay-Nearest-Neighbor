// backend/routes/fridgeItems.routes.js
//
// Purpose: HTTP layer only — verb + path, nothing else. No logic here ever.

const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const controller = require('../controllers/fridgeItems.controller');

router.use(requireAuth);

router.get('/', controller.listMyItems);
router.post('/', controller.createItem);
router.patch('/:itemId', controller.updateCount);
router.delete('/:itemId', controller.deleteItem);

module.exports = router;