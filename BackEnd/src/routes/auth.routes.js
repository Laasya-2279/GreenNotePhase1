/**
 * @file auth.routes.js
 */
const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');

router.post('/signup', authLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['HOSPITAL', 'CONTROL_ROOM', 'TRAFFIC', 'AMBULANCE', 'PUBLIC']),
    body('name').trim().notEmpty(),
    body('phone').trim().notEmpty(),
], validate, ctrl.signup);

router.post('/verify-otp', authLimiter, [
    body('email').isEmail(),
    body('otp').isLength({ min: 6, max: 6 }),
], validate, ctrl.verifyOTP);

router.post('/login', authLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
], validate, ctrl.login);

router.post('/logout', verifyToken, ctrl.logout);
router.post('/refresh-token', [body('refreshToken').notEmpty()], validate, ctrl.refreshToken);
router.get('/me', verifyToken, ctrl.getMe);

module.exports = router;
