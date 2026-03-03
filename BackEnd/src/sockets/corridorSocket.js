/**
 * @file corridorSocket.js
 * @description Socket.IO real-time handler for green corridor operations.
 *
 * SOCKET BROADCAST FLOW:
 *   1. Ambulance connects and joins corridor room
 *   2. Ambulance emits `ambulanceLocationUpdate` with { lat, lng, corridorId }
 *   3. Backend processes GPS (throttled to 1 per second):
 *      a. Updates in-memory session currentLocation
 *      b. Snaps GPS to nearest route point (movementEngine)
 *      c. Computes remaining path distance
 *      d. Recalculates ETA (etaCalculator)
 *      e. Checks signal thresholds (signalScheduler)
 *      f. Detects deviation (movementEngine)
 *   4. Backend emits:
 *      - `routeUpdate` → route array + remaining distance
 *      - `etaUpdate` → new ETA
 *      - `signalStateUpdate` → current signal states
 *      - `corridorStatusUpdate` → if status changed (arrived, etc.)
 *
 *   RULES:
 *   - Single authoritative corridor session (no duplicates)
 *   - GPS handling throttled to 1s minimum
 *   - No infinite loops (no re-emitting events that trigger more emits)
 *   - No duplicate emissions
 */
const { GPSLog, TrafficSignal, GreenCorridor } = require('../models');
const { getActiveSession, setActiveSession, clearActiveSession } = require('../controllers/corridor.controller');
const { processGPSUpdate } = require('../algorithms/movementEngine');
const { calculateETA } = require('../algorithms/etaCalculator');
const { processSignalPreemption, persistSignalChanges, restoreSignalsForCorridor } = require('../algorithms/signalScheduler');
const { getActiveBiases } = require('../algorithms/mlPredictor');
const { updateModel } = require('../algorithms/mlPredictor');
const logger = require('../config/logger');

// Throttle map: corridorId → last GPS timestamp
const lastGPSTime = new Map();

function setupCorridorSocket(io) {
    io.on('connection', (socket) => {
        logger.info(`Socket connected: ${socket.id}`);

        // ── Join role room ──────────────────────────────────────────────
        socket.on('join_role', ({ role }) => {
            if (!role) return;
            socket.join(`role:${role}`);
            logger.info(`Socket ${socket.id} joined role:${role}`);
        });

        // ── Join corridor room ──────────────────────────────────────────
        socket.on('join_corridor', ({ corridorId, role }) => {
            if (!corridorId) return;
            socket.join(`corridor:${corridorId}`);
            logger.info(`Socket ${socket.id} joined corridor:${corridorId} as ${role}`);
        });

        // ── Leave corridor room ─────────────────────────────────────────
        socket.on('leave_corridor', ({ corridorId }) => {
            if (!corridorId) return;
            socket.leave(`corridor:${corridorId}`);
        });

        // ── AMBULANCE GPS UPDATE (primary real-time channel) ────────────
        // This is the core event that drives the entire real-time system.
        socket.on('ambulanceLocationUpdate', async (data) => {
            try {
                const { lat, lng, corridorId, speed, heading, accuracy } = data;
                if (typeof lat !== 'number' || typeof lng !== 'number' || !corridorId) {
                    socket.emit('error', { message: 'Invalid GPS data', code: 'INVALID_GPS' });
                    return;
                }

                // ── THROTTLE: 1 GPS update per second per corridor ─────────
                const now = Date.now();
                const lastTime = lastGPSTime.get(corridorId) || 0;
                if (now - lastTime < 1000) return; // silently drop
                lastGPSTime.set(corridorId, now);

                const session = getActiveSession();
                if (!session || String(session.corridorId) !== String(corridorId)) {
                    socket.emit('error', { message: 'No active session for this corridor', code: 'NO_SESSION' });
                    return;
                }

                // ── STEP 1: Save GPS log to database ──────────────────────
                const gpsLog = await GPSLog.create({
                    corridorId: session.corridorId,
                    ambulanceId: data.ambulanceId || null,
                    location: { type: 'Point', coordinates: [lng, lat] },
                    accuracy, speed, heading,
                    timestamp: new Date(),
                });

                // ── STEP 2: Process GPS against active route ──────────────
                // This maps the raw GPS to the nearest route waypoint and
                // determines if the ambulance has deviated.
                const previousETA = session.eta;
                const movement = processGPSUpdate(session, lat, lng, previousETA);

                // ── STEP 3: Recalculate ETA from remaining route ──────────
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

                // ── STEP 4: Update in-memory session ──────────────────────
                session.currentLocation = [lat, lng];
                session.eta = newETA;
                setActiveSession(session);

                // ── STEP 5: Signal preemption check ───────────────────────
                const preemption = processSignalPreemption({
                    lat, lng,
                    urgency: session.criticality,
                    corridorId: session.corridorId,
                    signals,
                });
                if (preemption.changed.length > 0) {
                    await persistSignalChanges(preemption.changed, session.corridorId);
                    // Emit signal state changes to traffic + control room
                    io.emit('signalStateUpdate', { signals: preemption.signalStates });
                }

                // ── STEP 6: Emit route & ETA updates ─────────────────────
                // These events are sent to ALL connected clients in the corridor room
                const routePayload = {
                    corridorId: session.corridorIdStr || corridorId,
                    currentLocation: [lat, lng],
                    route: session.route,
                    remainingDistance: Math.round(movement.remainingDist),
                    snappedIndex: movement.snapped.index,
                    timestamp: new Date(),
                };
                io.emit('routeUpdate', routePayload);

                io.emit('etaUpdate', {
                    corridorId: session.corridorIdStr || corridorId,
                    eta: newETA,
                    previousETA,
                    remainingDistance: Math.round(movement.remainingDist),
                    timestamp: new Date(),
                });

                // ── STEP 7: Check for arrival ─────────────────────────────
                if (movement.hasArrived) {
                    // Auto-complete the corridor
                    const corridor = await GreenCorridor.findById(session.corridorId);
                    if (corridor && corridor.status === 'IN_PROGRESS') {
                        corridor.status = 'COMPLETED';
                        corridor.completedAt = new Date();
                        corridor.actualDuration = Math.round((corridor.completedAt - corridor.startedAt) / 1000);
                        await corridor.save();

                        // Update ML model
                        if (corridor.predictedETA && corridor.actualDuration) {
                            await updateModel({
                                predictedETA: corridor.predictedETA,
                                actualDuration: corridor.actualDuration,
                                startedAt: corridor.startedAt,
                                corridorId: corridor._id,
                            });
                        }

                        await restoreSignalsForCorridor(corridor._id);
                        clearActiveSession();
                        lastGPSTime.delete(corridorId);

                        io.emit('corridorStatusUpdate', {
                            corridorId: session.corridorIdStr || corridorId,
                            status: 'COMPLETED',
                            completedAt: corridor.completedAt,
                            metrics: {
                                actualDuration: corridor.actualDuration,
                                predictedETA: corridor.predictedETA,
                            },
                        });
                    }
                }

                // ── STEP 8: Deviation alert ───────────────────────────────
                if (movement.isDeviated) {
                    io.to('role:CONTROL_ROOM').to('role:TRAFFIC').emit('route_deviation', {
                        corridorId: session.corridorIdStr || corridorId,
                        deviationDistance: Math.round(movement.snapped.distance),
                        timestamp: new Date(),
                    });
                }

            } catch (err) {
                logger.error(`GPS processing error: ${err.message}`, { stack: err.stack });
                socket.emit('error', { message: 'GPS processing failed', code: 'GPS_ERROR' });
            }
        });

        // ── REQUEST STATUS ──────────────────────────────────────────────
        socket.on('request_status', ({ corridorId }) => {
            const session = getActiveSession();
            if (session && String(session.corridorId) === String(corridorId)) {
                socket.emit('corridorStatusUpdate', {
                    corridorId: session.corridorIdStr,
                    status: session.status,
                    eta: session.eta,
                    currentLocation: session.currentLocation,
                    route: session.route,
                });
            }
        });

        // ── MANUAL SIGNAL OVERRIDE (Traffic role) ───────────────────────
        socket.on('manual_signal_override', async ({ signalId, corridorId, duration = 60 }) => {
            try {
                const signal = await TrafficSignal.findOne({ signalId });
                if (!signal || !signal.canBeOverridden) return;

                signal.currentState = 'GREEN';
                signal.overriddenForCorridor = corridorId;
                signal.lastOverrideAt = new Date();
                signal.totalOverrides += 1;
                signal.overrideHistory.push({ corridorId, timestamp: new Date(), duration });
                await signal.save();

                io.emit('signal_manual_override', {
                    signalId: signal.signalId,
                    state: 'GREEN',
                    overriddenBy: 'TRAFFIC',
                    duration,
                });
            } catch (err) {
                logger.error(`Manual signal override error: ${err.message}`);
            }
        });

        // ── DISCONNECT ──────────────────────────────────────────────────
        socket.on('disconnect', () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });
}

module.exports = { setupCorridorSocket };
