/**
 * @file GreenCorridor.js — The central workflow document.
 *
 * Lifecycle:  PENDING → APPROVED → IN_PROGRESS → COMPLETED
 *                      ↘ REJECTED
 *                      ↘ CANCELLED
 */
const mongoose = require('mongoose');
const { CORRIDOR_STATUSES, URGENCY_LEVELS, ORGAN_TYPES } = require('../config/constants');

const pointSchema = {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] }, // [lng, lat]
};

const greenCorridorSchema = new mongoose.Schema(
    {
        corridorId: { type: String, unique: true }, // auto: "GC" + YYYYMMDD + seq

        // ── Hospitals ────────────────────────────────────────────────────
        sourceHospital: {
            hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
            name: String,
            location: pointSchema,
        },
        destinationHospital: {
            hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
            name: String,
            location: pointSchema,
        },

        // ── Medical ──────────────────────────────────────────────────────
        organType: { type: String, enum: ORGAN_TYPES },
        operationType: String,
        patientInfo: {
            age: Number,
            gender: { type: String, enum: ['Male', 'Female', 'Other'] },
            criticalCondition: String,
        },
        doctorInCharge: {
            name: { type: String, required: true },
            id: String,
            department: String,
            contactNumber: String,
        },

        // ── Ambulance ────────────────────────────────────────────────────
        ambulance: {
            ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
            driverId: String,
            driverName: String,
            vehicleNumber: { type: String, required: true },
            vehicleType: String,
        },

        // ── Criticality ──────────────────────────────────────────────────
        urgencyLevel: { type: String, enum: Object.values(URGENCY_LEVELS), required: true },
        finalCriticality: String,
        priority: { type: Number, min: 1, max: 10 },

        // ── Route ────────────────────────────────────────────────────────
        selectedRoute: {
            waypoints: [[Number]], // [[lat, lng], …]
            distance: Number,      // metres
            estimatedDuration: Number, // seconds
            calculatedAt: Date,
        },
        alternateRoutes: [
            {
                waypoints: [[Number]],
                distance: Number,
                estimatedDuration: Number,
                reason: String,
            },
        ],

        // ── Status ───────────────────────────────────────────────────────
        status: {
            type: String,
            enum: Object.values(CORRIDOR_STATUSES),
            default: CORRIDOR_STATUSES.PENDING,
            required: true,
        },

        // ── Timeline ─────────────────────────────────────────────────────
        requestedAt: { type: Date, default: Date.now, required: true },
        approvedAt: Date,
        rejectedAt: Date,
        startedAt: Date,
        completedAt: Date,
        cancelledAt: Date,

        // ── Performance metrics ──────────────────────────────────────────
        predictedETA: Number,      // seconds
        actualDuration: Number,    // seconds
        distanceTraveled: Number,  // metres
        averageSpeed: Number,      // m/s
        etaAccuracyScore: Number,  // %

        // ── Traffic stats ────────────────────────────────────────────────
        signalsEncountered: { type: Number, default: 0 },
        signalsClearedAutomatically: { type: Number, default: 0 },
        signalsClearedManually: { type: Number, default: 0 },
        routeDeviations: { type: Number, default: 0 },

        // ── Control room ─────────────────────────────────────────────────
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rejectionReason: String,
        specialInstructions: String,
        controlRoomNotes: String,

        notes: String,
        attachments: [String],
    },
    { timestamps: true },
);

// ── Indexes ───────────────────────────────────────────────────────────
greenCorridorSchema.index({ status: 1, requestedAt: -1 });
greenCorridorSchema.index({ 'sourceHospital.hospitalId': 1 });
greenCorridorSchema.index({ 'destinationHospital.hospitalId': 1 });
greenCorridorSchema.index({ 'ambulance.ambulanceId': 1 });
greenCorridorSchema.index({ urgencyLevel: 1, status: 1 });

// ── Auto-generate corridorId ──────────────────────────────────────────
greenCorridorSchema.pre('save', async function (next) {
    if (this.corridorId) return next();
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const todayCount = await this.constructor.countDocuments({
        corridorId: { $regex: `^GC${datePart}` },
    });
    this.corridorId = `GC${datePart}${String(todayCount + 1).padStart(3, '0')}`;
    next();
});

module.exports = mongoose.model('GreenCorridor', greenCorridorSchema);
