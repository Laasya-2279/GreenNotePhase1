/**
 * @file ambulance.routes.js
 */
const router = require('express').Router();
const ctrl = require('../controllers/ambulance.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', verifyToken, requireRole('HOSPITAL', 'CONTROL_ROOM', 'TRAFFIC'), ctrl.getAll);
router.get('/available', verifyToken, requireRole('HOSPITAL', 'CONTROL_ROOM'), ctrl.getAvailable);
router.get('/:id', verifyToken, ctrl.getById);
router.patch('/:id/status', verifyToken, requireRole('AMBULANCE', 'CONTROL_ROOM'), ctrl.updateStatus);
router.patch('/:id/location', verifyToken, requireRole('AMBULANCE'), ctrl.updateLocation);

module.exports = router;
