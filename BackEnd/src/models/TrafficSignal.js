/**
 * @file TrafficSignal.js
 */
const mongoose = require('mongoose');

const trafficSignalSchema = new mongoose.Schema(
    {
        signalId: { type: String, unique: true, required: true },
        name: { type: String, required: true },

        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true },
        },
        address: String,
        landmark: String,

        signalType: {
            type: String,
            enum: ['4-way', '3-way', 'T-junction', 'Pedestrian', 'Single'],
            required: true,
        },
        controlledBy: String,
        zone: { type: String, required: true },

        isOperational: { type: Boolean, default: true },
        canBeOverridden: { type: Boolean, default: true },
        requiresManualApproval: { type: Boolean, default: false },

        normalCycleDuration: Number,
        peakHours: [String],

        // ── Current simulated state ───────────────────────────────────────
        currentState: { type: String, enum: ['RED', 'GREEN', 'YELLOW'], default: 'RED' },
        overriddenForCorridor: { type: mongoose.Schema.Types.ObjectId, ref: 'GreenCorridor' },
        overrideExpiresAt: Date,

        totalOverrides: { type: Number, default: 0 },
        lastOverrideAt: Date,
        overrideHistory: [
            {
                corridorId: String,
                timestamp: Date,
                duration: Number,
            },
        ],

        lastMaintenanceDate: Date,
        maintenanceSchedule: String,
    },
    { timestamps: true },
);

trafficSignalSchema.index({ location: '2dsphere' });
trafficSignalSchema.index({ zone: 1 });
trafficSignalSchema.index({ isOperational: 1, canBeOverridden: 1 });

module.exports = mongoose.model('TrafficSignal', trafficSignalSchema);
