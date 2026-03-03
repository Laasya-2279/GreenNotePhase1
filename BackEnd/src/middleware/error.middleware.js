/**
 * @file error.middleware.js
 * @description Centralised error handling.
 */
const logger = require('../config/logger');

/** 404 handler — must be registered AFTER all real routes. */
const notFound = (req, res, _next) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

/** Global error handler — must be the LAST middleware. */
const errorHandler = (err, req, res, _next) => {
    logger.error(`${err.message}`, {
        stack: err.stack,
        method: req.method,
        path: req.originalUrl,
        user: req.user?.userId,
    });

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue).join(', ');
        return res.status(409).json({ success: false, message: `Duplicate value for: ${field}` });
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: `Invalid ID: ${err.value}` });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = { notFound, errorHandler };
