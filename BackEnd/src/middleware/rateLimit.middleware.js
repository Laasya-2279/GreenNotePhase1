/**
 * @file rateLimit.middleware.js
 * @description Rate limiters for different endpoint groups.
 */
const rateLimit = require('express-rate-limit');

/** General API rate limiter */
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    message: { success: false, message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/** Strict limiter for auth endpoints */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many auth attempts, try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/** GPS update limiter — 60 per minute per IP */
const gpsLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { success: false, message: 'GPS update rate limit exceeded.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, gpsLimiter };
