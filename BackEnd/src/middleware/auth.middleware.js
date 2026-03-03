/**
 * @file auth.middleware.js
 * @description JWT verification + role-based access control middleware.
 */
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Verify JWT access token.
 * Attaches decoded user to `req.user`.
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Access token required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account deactivated' });
        }

        req.user = {
            userId: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            hospitalId: user.hospitalId,
            ambulanceId: user.ambulanceId,
            trafficOfficerId: user.trafficOfficerId,
        };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        }
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

/**
 * Optional auth — sets `req.user` if a valid token is present, but does not
 * reject the request when there is no token.
 */
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            if (user && user.isActive) {
                req.user = {
                    userId: user._id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    hospitalId: user.hospitalId,
                    ambulanceId: user.ambulanceId,
                };
            }
        }
    } catch (_) {
        // silently continue without user context
    }
    next();
};

/**
 * Role-based access control.
 * @param  {...string} roles  Allowed roles (e.g. 'HOSPITAL', 'CONTROL_ROOM')
 */
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: `Access denied. Required role(s): ${roles.join(', ')}`,
        });
    }
    next();
};

module.exports = { verifyToken, optionalAuth, requireRole };
