/**
 * @file analytics.routes.js
 */
const router = require('express').Router();
const ctrl = require('../controllers/analytics.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/dashboard', verifyToken, requireRole('CONTROL_ROOM'), ctrl.dashboard);
router.get('/eta-accuracy', verifyToken, requireRole('CONTROL_ROOM'), ctrl.etaAccuracy);
router.get('/traffic-patterns', verifyToken, requireRole('TRAFFIC', 'CONTROL_ROOM'), ctrl.trafficPatterns);

module.exports = router;
