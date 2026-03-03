/**
 * @file hospital.routes.js
 */
const router = require('express').Router();
const ctrl = require('../controllers/hospital.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', verifyToken, ctrl.getAll);
router.get('/nearby', verifyToken, ctrl.nearby);
router.get('/:id', verifyToken, ctrl.getById);
router.post('/', verifyToken, requireRole('CONTROL_ROOM'), ctrl.create);
router.patch('/:id', verifyToken, requireRole('CONTROL_ROOM'), ctrl.update);
router.delete('/:id', verifyToken, requireRole('CONTROL_ROOM'), ctrl.remove);

module.exports = router;
