/**
 * @file audit.routes.js
 */
const router = require('express').Router();
const ctrl = require('../controllers/audit.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', verifyToken, requireRole('CONTROL_ROOM'), ctrl.getAll);
router.get('/corridor/:corridorId', verifyToken, ctrl.getByCorridor);
router.get('/user/:userId', verifyToken, ctrl.getByUser);

module.exports = router;
