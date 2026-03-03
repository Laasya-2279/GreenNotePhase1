/**
 * @file signal.routes.js
 */
const router = require('express').Router();
const ctrl = require('../controllers/signal.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', verifyToken, requireRole('TRAFFIC', 'CONTROL_ROOM'), ctrl.getAll);
router.get('/nearby', verifyToken, ctrl.nearby);
router.post('/', verifyToken, requireRole('CONTROL_ROOM'), ctrl.create);
router.get('/:id/status', verifyToken, ctrl.getStatus);
router.patch('/:id/override', verifyToken, requireRole('TRAFFIC'), ctrl.override);

module.exports = router;
