// backend/routes/foodRequests.routes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const controller = require('../controllers/foodRequests.controller');

router.use(requireAuth);

router.post('/', controller.create);
router.get('/', controller.list);
router.post('/:id/accept', controller.accept);
router.post('/:id/reject', controller.reject);
router.post('/:id/counter', controller.counter);
router.patch('/:id/offer', controller.updateOffer);
router.post('/:id/complete', controller.complete);
router.post('/:id/thank-you', controller.thankYou);

module.exports = router;
