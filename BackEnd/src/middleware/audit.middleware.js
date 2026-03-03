/**
 * @file audit.middleware.js
 * @description Audit logging helper to persist actions into the AuditLog collection.
 */
const { AuditLog } = require('../models');

/**
 * Create an audit-log entry.
 * @param {Object} opts
 * @param {string} opts.action          - One of AUDIT_ACTIONS
 * @param {Object} [opts.req]           - Express request (for IP / UA)
 * @param {Object} [opts.user]          - { userId, role, name }
 * @param {string} [opts.targetType]
 * @param {string} [opts.targetId]
 * @param {string} [opts.corridorId]
 * @param {Object} [opts.details]
 * @param {boolean} [opts.success=true]
 * @param {string} [opts.errorMessage]
 */
const createAuditLog = async (opts) => {
    try {
        await AuditLog.create({
            action: opts.action,
            userId: opts.user?.userId,
            userRole: opts.user?.role,
            userName: opts.user?.name,
            targetType: opts.targetType,
            targetId: opts.targetId,
            corridorId: opts.corridorId,
            details: opts.details,
            changesMade: opts.changesMade,
            ipAddress: opts.req?.ip,
            userAgent: opts.req?.get?.('user-agent'),
            requestMethod: opts.req?.method,
            requestPath: opts.req?.originalUrl,
            success: opts.success !== undefined ? opts.success : true,
            errorMessage: opts.errorMessage,
        });
    } catch (err) {
        // Audit logging must never crash the request
        console.error('Audit log write failed:', err.message);
    }
};

module.exports = { createAuditLog };
