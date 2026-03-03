/**
 * @file gps.controller.js
 * @description GPS tracking REST endpoints (supplement to Socket.IO streaming).
 */
const { GPSLog, TrafficSignal } = require('../models');
const { getActiveSession, setActiveSession } = require('./corridor.controller');
const { processGPSUpdate } = require('../algorithms/movementEngine');
const { calculateETA } = require('../algorithms/etaCalculator');
const { processSignalPreemption, persistSignalChanges } = require('../algorithms/signalScheduler');
const { getActiveBiases } = require('../algorithms/mlPredictor');
const { createAuditLog } = require('../middleware/audit.middleware');

// ── POST GPS UPDATE ───────────────────────────────────────────────────
exports.update = async (req, res, next) => {
    try {
        const { corridorId, lat, lng, accuracy, speed, heading, altitude } = req.body;
        const session = getActiveSession();
        if (!session || String(session.corridorId) !== String(corridorId)) {
            return res.status(400).json({ success: false, message: 'No active corridor for this ID' });
        }

        // Save GPS log
        await GPSLog.create({
            corridorId: session.corridorId,
            ambulanceId: req.user.ambulanceId,
            location: { type: 'Point', coordinates: [lng, lat] },
            accuracy, speed, heading, altitude,
            timestamp: new Date(),
        });

        // Process against route
        const movement = processGPSUpdate(session, lat, lng, session.eta);

        // Recalculate ETA
        const biases = await getActiveBiases();
        const signals = await TrafficSignal.find({ isOperational: true });
        const signalStates = signals.map((s) => ({
            position: [s.location.coordinates[1], s.location.coordinates[0]],
            state: s.currentState || 'RED',
        }));

        const newETA = calculateETA({
            route: session.route,
            fromIndex: movement.snapped.index,
            urgency: session.criticality,
            signals: signalStates,
            biases,
        });

        // Update session
        session.currentLocation = [lat, lng];
        session.eta = newETA;
        setActiveSession(session);

        // Signal preemption
        const preemption = processSignalPreemption({
            lat, lng,
            urgency: session.criticality,
            corridorId: session.corridorId,
            signals,
        });
        if (preemption.changed.length) {
            await persistSignalChanges(preemption.changed, session.corridorId);
        }

        // Socket broadcasts
        const io = req.app.get('io');
        if (io) {
            io.emit('gps_update', {
                corridorId: session.corridorIdStr,
                lat, lng, speed, heading,
                remainingDistance: Math.round(movement.remainingDist),
                eta: newETA,
                timestamp: new Date(),
            });
            io.emit('eta_updated', { corridorId: session.corridorIdStr, newETA });
            if (preemption.changed.length) {
                io.emit('signal_state_update', { signals: preemption.signalStates });
            }
        }

        res.json({
            success: true,
            eta: newETA,
            remainingDistance: Math.round(movement.remainingDist),
            hasArrived: movement.hasArrived,
            signalStates: preemption.signalStates,
        });
    } catch (error) { next(error); }
};

// ── GET LATEST GPS ────────────────────────────────────────────────────
exports.getLatest = async (req, res, next) => {
    try {
        const log = await GPSLog.findOne({ corridorId: req.params.corridorId }).sort({ timestamp: -1 });
        if (!log) return res.status(404).json({ success: false, message: 'No GPS data' });
        res.json({ success: true, location: log.location, timestamp: log.timestamp, speed: log.speed, heading: log.heading });
    } catch (error) { next(error); }
};

// ── GET GPS TRAIL ─────────────────────────────────────────────────────
exports.getTrail = async (req, res, next) => {
    try {
        const filter = { corridorId: req.params.corridorId };
        if (req.query.startTime) filter.timestamp = { $gte: new Date(req.query.startTime) };
        if (req.query.endTime) {
            filter.timestamp = filter.timestamp || {};
            filter.timestamp.$lte = new Date(req.query.endTime);
        }
        const logs = await GPSLog.find(filter).sort({ timestamp: 1 }).limit(500);
        res.json({ success: true, gpsLogs: logs });
    } catch (error) { next(error); }
};
