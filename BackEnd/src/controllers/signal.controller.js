/**
 * @file signal.controller.js
 */
const { TrafficSignal } = require('../models');

exports.getAll = async (req, res, next) => {
    try {
        const { zone, isOperational } = req.query;
        const filter = {};
        if (zone) filter.zone = zone;
        if (isOperational !== undefined) filter.isOperational = isOperational === 'true';
        const signals = await TrafficSignal.find(filter).sort({ signalId: 1 });
        res.json({ success: true, signals });
    } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
    try {
        const signal = await TrafficSignal.create(req.body);
        res.status(201).json({ success: true, signal });
    } catch (error) { next(error); }
};

exports.nearby = async (req, res, next) => {
    try {
        const { lat, lng, radius = 500 } = req.query;
        if (!lat || !lng) return res.status(400).json({ success: false, message: 'lat/lng required' });
        const signals = await TrafficSignal.find({
            isOperational: true,
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: parseInt(radius),
                },
            },
        });
        res.json({ success: true, signals });
    } catch (error) { next(error); }
};

exports.override = async (req, res, next) => {
    try {
        const { corridorId, duration = 60 } = req.body;
        const signal = await TrafficSignal.findById(req.params.id);
        if (!signal) return res.status(404).json({ success: false, message: 'Signal not found' });
        if (!signal.canBeOverridden) return res.status(403).json({ success: false, message: 'Signal cannot be overridden' });

        signal.currentState = 'GREEN';
        signal.overriddenForCorridor = corridorId;
        signal.overrideExpiresAt = new Date(Date.now() + duration * 1000);
        signal.lastOverrideAt = new Date();
        signal.totalOverrides += 1;
        signal.overrideHistory.push({ corridorId: String(corridorId), timestamp: new Date(), duration });
        await signal.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('signal_manual_override', {
                signalId: signal.signalId,
                state: 'GREEN',
                overriddenBy: req.user.name,
                duration,
            });
        }

        res.json({ success: true, signal, overrideExpiry: signal.overrideExpiresAt });
    } catch (error) { next(error); }
};

exports.getStatus = async (req, res, next) => {
    try {
        const signal = await TrafficSignal.findById(req.params.id);
        if (!signal) return res.status(404).json({ success: false, message: 'Signal not found' });
        res.json({ success: true, signal, currentState: signal.currentState });
    } catch (error) { next(error); }
};
