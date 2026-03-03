/**
 * @file AuditLog.js
 */
const mongoose = require('mongoose');
const { AUDIT_ACTIONS } = require('../config/constants');

const auditLogSchema = new mongoose.Schema(
    {
        action: { type: String, enum: AUDIT_ACTIONS, required: true },

        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userRole: String,
        userName: String,

        targetType: {
            type: String,
            enum: ['GreenCorridor', 'User', 'Hospital', 'Ambulance', 'TrafficSignal'],
        },
        targetId: mongoose.Schema.Types.ObjectId,

        corridorId: { type: mongoose.Schema.Types.ObjectId, ref: 'GreenCorridor' },

        details: mongoose.Schema.Types.Mixed,
        changesMade: mongoose.Schema.Types.Mixed,

        ipAddress: String,
        userAgent: String,
        requestMethod: String,
        requestPath: String,

        success: Boolean,
        errorMessage: String,

        timestamp: { type: Date, required: true, default: Date.now },
    },
    { timestamps: true },
);

auditLogSchema.index({ corridorId: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
