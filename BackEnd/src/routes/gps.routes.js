/**
 * @file gps.routes.js
 */
const router = require('express').Router();
const ctrl = require('../controllers/gps.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const { gpsLimiter } = require('../middleware/rateLimit.middleware');

router.post('/update', verifyToken, requireRole('AMBULANCE'), gpsLimiter, ctrl.update);
router.get('/latest/:corridorId', verifyToken, ctrl.getLatest);
router.get('/trail/:corridorId', verifyToken, ctrl.getTrail);

module.exports = router;
