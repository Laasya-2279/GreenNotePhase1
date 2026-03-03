/**
 * @file corridor.controller.js
 * @description Green corridor lifecycle — create, approve, reject, start, complete, cancel.
 *
 * This is the core workflow controller.
 *
 * LIFECYCLE:
 *   Hospital creates → Control Room approves/rejects → Ambulance starts →
 *   GPS streaming → ETA updates → Completion / Cancellation.
 */
const { GreenCorridor, Hospital, Ambulance, TrafficSignal } = require('../models');
const { createAuditLog } = require('../middleware/audit.middleware');
const { selectBestEmergencyRoute, resolveDonorRoute } = require('../algorithms/routeOptimizer');
const { calculateETA } = require('../algorithms/etaCalculator');
const { getActiveBiases, updateModel } = require('../algorithms/mlPredictor');
const { restoreSignalsForCorridor } = require('../algorithms/signalScheduler');
const { routeDistance } = require('../utils/distance');
const { getRoute, DEFAULT_SIGNALS } = require('../algorithms/routeRepository');
const { CORRIDOR_STATUSES } = require('../config/constants');

// ── In-memory active corridor session ─────────────────────────────────
// Only ONE active corridor at a time (as per spec)
let activeCorridorSession = null;

function getActiveSession() { return activeCorridorSession; }
function setActiveSession(session) { activeCorridorSession = session; }
function clearActiveSession() { activeCorridorSession = null; }

// ── CREATE CORRIDOR ───────────────────────────────────────────────────
exports.create = async (req, res, next) => {
    try {
        const {
            sourceHospitalId, destinationHospitalId, organType, operationType,
            doctorInCharge, ambulanceId, urgencyLevel, vehicleNumber, patientInfo, notes,
        } = req.body;

        // Validate source & destination
        const [srcHospital, destHospital] = await Promise.all([
            Hospital.findById(sourceHospitalId),
            Hospital.findById(destinationHospitalId),
        ]);
        if (!srcHospital) return res.status(404).json({ success: false, message: 'Source hospital not found' });
        if (!destHospital) return res.status(404).json({ success: false, message: 'Destination hospital not found' });

        // Validate ambulance
        let ambulance = null;
        if (ambulanceId) {
            ambulance = await Ambulance.findById(ambulanceId);
            if (!ambulance) return res.status(404).json({ success: false, message: 'Ambulance not found' });
        }

        // Priority calculation
        const priorityMap = { VERY_CRITICAL: 10, CRITICAL: 7, STABLE: 4 };
        const organBoost = ['Heart', 'Liver', 'Lung'].includes(organType) ? 1 : 0;
        const priority = Math.min(10, (priorityMap[urgencyLevel] || 5) + organBoost);

        const corridor = await GreenCorridor.create({
            sourceHospital: {
                hospitalId: srcHospital._id,
                name: srcHospital.name,
                location: srcHospital.location,
            },
            destinationHospital: {
                hospitalId: destHospital._id,
                name: destHospital.name,
                location: destHospital.location,
            },
            organType,
            operationType,
            doctorInCharge,
            ambulance: {
                ambulanceId: ambulance?._id,
                driverId: ambulance?.driverId,
                driverName: ambulance?.driverName,
                vehicleNumber: vehicleNumber || ambulance?.currentVehicle || 'N/A',
                vehicleType: ambulance?.vehicleType,
            },
            urgencyLevel,
            priority,
            patientInfo,
            notes,
            status: CORRIDOR_STATUSES.PENDING,
        });

        await createAuditLog({
            action: 'CORRIDOR_CREATED', req, user: req.user,
            targetType: 'GreenCorridor', targetId: corridor._id,
            corridorId: corridor._id,
            details: { corridorId: corridor.corridorId, organType, urgencyLevel },
            success: true,
        });

        // Notify control room via socket (if io is available)
        const io = req.app.get('io');
        if (io) {
            io.to('role:CONTROL_ROOM').emit('corridor_created', { corridor });
        }

        res.status(201).json({ success: true, corridor, corridorId: corridor.corridorId });
    } catch (error) { next(error); }
};

// ── GET ALL CORRIDORS (role-filtered) ─────────────────────────────────
exports.getAll = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20, sortBy = 'requestedAt' } = req.query;
        const filter = {};
        if (status) filter.status = status;

        // Role-based filtering
        if (req.user.role === 'HOSPITAL') {
            filter['sourceHospital.hospitalId'] = req.user.hospitalId;
        } else if (req.user.role === 'AMBULANCE') {
            filter['ambulance.ambulanceId'] = req.user.ambulanceId;
        }
        // CONTROL_ROOM and TRAFFIC see all

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [corridors, total] = await Promise.all([
            GreenCorridor.find(filter).skip(skip).limit(parseInt(limit)).sort({ [sortBy]: -1 }),
            GreenCorridor.countDocuments(filter),
        ]);
        res.json({ success: true, corridors, total, page: parseInt(page) });
    } catch (error) { next(error); }
};

// ── GET CORRIDOR BY ID ────────────────────────────────────────────────
exports.getById = async (req, res, next) => {
    try {
        const corridor = await GreenCorridor.findById(req.params.id);
        if (!corridor) return res.status(404).json({ success: false, message: 'Corridor not found' });
        res.json({ success: true, corridor });
    } catch (error) { next(error); }
};

// ── APPROVE CORRIDOR ──────────────────────────────────────────────────
exports.approve = async (req, res, next) => {
    try {
        const corridor = await GreenCorridor.findById(req.params.id);
        if (!corridor) return res.status(404).json({ success: false, message: 'Corridor not found' });
        if (corridor.status !== CORRIDOR_STATUSES.PENDING) {
            return res.status(400).json({ success: false, message: `Cannot approve — status is ${corridor.status}` });
        }

        const { finalCriticality, specialInstructions } = req.body;

        // Calculate route
        const biases = await getActiveBiases();
        const signals = await TrafficSignal.find({ isOperational: true });
        const signalStates = signals.map((s) => ({
            position: [s.location.coordinates[1], s.location.coordinates[0]], // [lat, lng]
            state: s.currentState || 'RED',
        }));

        // Try to find a stored route first (donor / emergency)
        const srcHId = corridor.sourceHospital.hospitalId;
        const destHId = corridor.destinationHospital.hospitalId;
        const srcH = await Hospital.findById(srcHId);
        const destH = await Hospital.findById(destHId);
        let routeData = null;

        // Check for donor route by hospitalId pattern
        if (srcH?.hospitalId && destH?.hospitalId) {
            routeData = resolveDonorRoute(srcH.hospitalId, destH.hospitalId, {
                urgency: finalCriticality || corridor.urgencyLevel,
                signals: signalStates,
                biases,
            });
        }

        // Fallback to best emergency route
        if (!routeData) {
            const best = selectBestEmergencyRoute({
                urgency: finalCriticality || corridor.urgencyLevel,
                signals: signalStates,
                biases,
            });
            routeData = best.bestRoute;
        }

        corridor.status = CORRIDOR_STATUSES.APPROVED;
        corridor.approvedAt = new Date();
        corridor.approvedBy = req.user.userId;
        corridor.finalCriticality = finalCriticality || corridor.urgencyLevel;
        corridor.specialInstructions = specialInstructions;

        if (routeData) {
            corridor.selectedRoute = {
                waypoints: routeData.route,
                distance: routeData.distance,
                estimatedDuration: routeData.eta,
                calculatedAt: new Date(),
            };
            corridor.predictedETA = routeData.eta;
        }

        await corridor.save();

        await createAuditLog({
            action: 'CORRIDOR_APPROVED', req, user: req.user,
            targetType: 'GreenCorridor', targetId: corridor._id,
            corridorId: corridor._id,
            details: { corridorId: corridor.corridorId, finalCriticality },
            success: true,
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('corridor_approved', {
                corridorId: corridor.corridorId,
                _id: corridor._id,
                approvedBy: req.user.name,
                finalCriticality: corridor.finalCriticality,
                route: corridor.selectedRoute,
            });
        }

        res.json({ success: true, corridor });
    } catch (error) { next(error); }
};

// ── REJECT CORRIDOR ───────────────────────────────────────────────────
exports.reject = async (req, res, next) => {
    try {
        const corridor = await GreenCorridor.findById(req.params.id);
        if (!corridor) return res.status(404).json({ success: false, message: 'Corridor not found' });
        if (corridor.status !== CORRIDOR_STATUSES.PENDING) {
            return res.status(400).json({ success: false, message: 'Cannot reject — not pending' });
        }

        corridor.status = CORRIDOR_STATUSES.REJECTED;
        corridor.rejectedAt = new Date();
        corridor.rejectionReason = req.body.rejectionReason || '';
        await corridor.save();

        await createAuditLog({
            action: 'CORRIDOR_REJECTED', req, user: req.user,
            corridorId: corridor._id, details: { reason: corridor.rejectionReason }, success: true,
        });

        const io = req.app.get('io');
        if (io) io.emit('corridor_rejected', { corridorId: corridor.corridorId, reason: corridor.rejectionReason });

        res.json({ success: true, corridor });
    } catch (error) { next(error); }
};

// ── START CORRIDOR ────────────────────────────────────────────────────
exports.start = async (req, res, next) => {
    try {
        const corridor = await GreenCorridor.findById(req.params.id);
        if (!corridor) return res.status(404).json({ success: false, message: 'Corridor not found' });
        if (corridor.status !== CORRIDOR_STATUSES.APPROVED) {
            return res.status(400).json({ success: false, message: 'Corridor is not approved' });
        }

        corridor.status = CORRIDOR_STATUSES.IN_PROGRESS;
        corridor.startedAt = new Date();
        await corridor.save();

        // Set up active in-memory session
        const route = corridor.selectedRoute?.waypoints || [];
        setActiveSession({
            corridorId: corridor._id,
            corridorIdStr: corridor.corridorId,
            route,
            sourceHospital: corridor.sourceHospital,
            destinationHospital: corridor.destinationHospital,
            currentLocation: route[0] || null,
            eta: corridor.predictedETA || 0,
            criticality: corridor.finalCriticality || corridor.urgencyLevel,
            startedAt: corridor.startedAt,
            status: 'IN_PROGRESS',
        });

        await createAuditLog({
            action: 'CORRIDOR_STARTED', req, user: req.user,
            corridorId: corridor._id, success: true,
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('corridor_started', {
                corridorId: corridor.corridorId,
                _id: corridor._id,
                startedAt: corridor.startedAt,
                route,
            });
        }

        res.json({ success: true, corridor, startedAt: corridor.startedAt });
    } catch (error) { next(error); }
};

// ── COMPLETE CORRIDOR ─────────────────────────────────────────────────
exports.complete = async (req, res, next) => {
    try {
        const corridor = await GreenCorridor.findById(req.params.id);
        if (!corridor) return res.status(404).json({ success: false, message: 'Corridor not found' });
        if (corridor.status !== CORRIDOR_STATUSES.IN_PROGRESS) {
            return res.status(400).json({ success: false, message: 'Corridor is not in progress' });
        }

        corridor.status = CORRIDOR_STATUSES.COMPLETED;
        corridor.completedAt = new Date();
        corridor.actualDuration = Math.round((corridor.completedAt - corridor.startedAt) / 1000);
        corridor.distanceTraveled = req.body.distanceTraveled || corridor.selectedRoute?.distance || 0;
        corridor.averageSpeed = corridor.distanceTraveled / (corridor.actualDuration || 1);

        // ETA accuracy
        if (corridor.predictedETA) {
            corridor.etaAccuracyScore = Math.max(0, 100 - Math.abs(corridor.actualDuration - corridor.predictedETA) / corridor.predictedETA * 100);
        }

        await corridor.save();

        // Update federated learning model
        if (corridor.predictedETA && corridor.actualDuration) {
            await updateModel({
                predictedETA: corridor.predictedETA,
                actualDuration: corridor.actualDuration,
                startedAt: corridor.startedAt,
                corridorId: corridor._id,
            });
        }

        // Restore signals
        await restoreSignalsForCorridor(corridor._id);

        // Clear in-memory session
        clearActiveSession();

        await createAuditLog({
            action: 'CORRIDOR_COMPLETED', req, user: req.user,
            corridorId: corridor._id,
            details: { actualDuration: corridor.actualDuration, etaAccuracy: corridor.etaAccuracyScore },
            success: true,
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('corridor_completed', {
                corridorId: corridor.corridorId,
                completedAt: corridor.completedAt,
                metrics: {
                    actualDuration: corridor.actualDuration,
                    predictedETA: corridor.predictedETA,
                    accuracy: corridor.etaAccuracyScore,
                },
            });
        }

        res.json({ success: true, corridor });
    } catch (error) { next(error); }
};

// ── CANCEL CORRIDOR ───────────────────────────────────────────────────
exports.cancel = async (req, res, next) => {
    try {
        const corridor = await GreenCorridor.findById(req.params.id);
        if (!corridor) return res.status(404).json({ success: false, message: 'Corridor not found' });
        if ([CORRIDOR_STATUSES.COMPLETED, CORRIDOR_STATUSES.CANCELLED].includes(corridor.status)) {
            return res.status(400).json({ success: false, message: 'Cannot cancel' });
        }

        corridor.status = CORRIDOR_STATUSES.CANCELLED;
        corridor.cancelledAt = new Date();
        corridor.controlRoomNotes = req.body.cancellationReason || '';
        await corridor.save();

        await restoreSignalsForCorridor(corridor._id);
        clearActiveSession();

        await createAuditLog({
            action: 'CORRIDOR_CANCELLED', req, user: req.user, corridorId: corridor._id, success: true,
        });

        const io = req.app.get('io');
        if (io) io.emit('corridor_cancelled', { corridorId: corridor.corridorId });

        res.json({ success: true, message: 'Corridor cancelled' });
    } catch (error) { next(error); }
};

// ── GET ACTIVE CORRIDORS ──────────────────────────────────────────────
exports.getActive = async (_req, res, next) => {
    try {
        const corridors = await GreenCorridor.find({
            status: { $in: [CORRIDOR_STATUSES.APPROVED, CORRIDOR_STATUSES.IN_PROGRESS] },
        }).sort({ requestedAt: -1 });
        res.json({ success: true, corridors, activeSession: activeCorridorSession });
    } catch (error) { next(error); }
};

// ── GET CORRIDOR ROUTE ────────────────────────────────────────────────
exports.getRoute = async (req, res, next) => {
    try {
        const corridor = await GreenCorridor.findById(req.params.id).select('selectedRoute alternateRoutes');
        if (!corridor) return res.status(404).json({ success: false, message: 'Corridor not found' });
        res.json({ success: true, selectedRoute: corridor.selectedRoute, alternateRoutes: corridor.alternateRoutes });
    } catch (error) { next(error); }
};

// ── STATISTICS ────────────────────────────────────────────────────────
exports.getStats = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const filter = {};
        if (startDate || endDate) {
            filter.requestedAt = {};
            if (startDate) filter.requestedAt.$gte = new Date(startDate);
            if (endDate) filter.requestedAt.$lte = new Date(endDate);
        }

        const total = await GreenCorridor.countDocuments(filter);
        const completed = await GreenCorridor.countDocuments({ ...filter, status: 'COMPLETED' });
        const failed = await GreenCorridor.countDocuments({ ...filter, status: 'FAILED' });
        const cancelled = await GreenCorridor.countDocuments({ ...filter, status: 'CANCELLED' });

        const completedDocs = await GreenCorridor.find({ ...filter, status: 'COMPLETED' }).select('actualDuration predictedETA');
        const avgDuration = completedDocs.length
            ? Math.round(completedDocs.reduce((s, c) => s + (c.actualDuration || 0), 0) / completedDocs.length)
            : 0;

        res.json({
            success: true,
            stats: { total, completed, failed, cancelled, avgDuration, completionRate: total ? ((completed / total) * 100).toFixed(1) : 0 },
        });
    } catch (error) { next(error); }
};

// Export session helpers for socket module
exports.getActiveSession = getActiveSession;
exports.setActiveSession = setActiveSession;
exports.clearActiveSession = clearActiveSession;
