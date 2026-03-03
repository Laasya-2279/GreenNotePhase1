/**
 * @file corridor.routes.js
 */
const router = require('express').Router();
const ctrl = require('../controllers/corridor.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.post('/', verifyToken, requireRole('HOSPITAL'), ctrl.create);
router.get('/', verifyToken, requireRole('HOSPITAL', 'CONTROL_ROOM', 'TRAFFIC', 'AMBULANCE'), ctrl.getAll);
router.get('/active', verifyToken, requireRole('CONTROL_ROOM', 'TRAFFIC', 'AMBULANCE'), ctrl.getActive);
router.get('/statistics', verifyToken, requireRole('CONTROL_ROOM'), ctrl.getStats);
router.get('/:id', verifyToken, ctrl.getById);
router.get('/:id/route', verifyToken, ctrl.getRoute);
router.patch('/:id/approve', verifyToken, requireRole('CONTROL_ROOM'), ctrl.approve);
router.patch('/:id/reject', verifyToken, requireRole('CONTROL_ROOM'), ctrl.reject);
router.post('/:id/start', verifyToken, requireRole('AMBULANCE', 'CONTROL_ROOM'), ctrl.start);
router.post('/:id/complete', verifyToken, requireRole('AMBULANCE', 'CONTROL_ROOM'), ctrl.complete);
router.delete('/:id', verifyToken, requireRole('HOSPITAL', 'CONTROL_ROOM'), ctrl.cancel);

module.exports = router;
