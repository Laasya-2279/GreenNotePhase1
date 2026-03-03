/**
 * @file audit.controller.js
 */
const { AuditLog } = require('../models');

exports.getAll = async (req, res, next) => {
    try {
        const { action, userId, startDate, endDate, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (action) filter.action = action;
        if (userId) filter.userId = userId;
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [logs, total] = await Promise.all([
            AuditLog.find(filter).skip(skip).limit(parseInt(limit)).sort({ timestamp: -1 }),
            AuditLog.countDocuments(filter),
        ]);
        res.json({ success: true, logs, total });
    } catch (error) { next(error); }
};

exports.getByCorridor = async (req, res, next) => {
    try {
        const logs = await AuditLog.find({ corridorId: req.params.corridorId }).sort({ timestamp: -1 });
        res.json({ success: true, logs });
    } catch (error) { next(error); }
};

exports.getByUser = async (req, res, next) => {
    try {
        const logs = await AuditLog.find({ userId: req.params.userId }).sort({ timestamp: -1 }).limit(100);
        res.json({ success: true, logs });
    } catch (error) { next(error); }
};
