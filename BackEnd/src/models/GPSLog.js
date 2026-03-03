/**
 * @file GPSLog.js — Stores every GPS reading for a corridor session.
 */
const mongoose = require('mongoose');

const gpsLogSchema = new mongoose.Schema(
    {
        corridorId: { type: mongoose.Schema.Types.ObjectId, ref: 'GreenCorridor', required: true },
        ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance', required: true },

        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true },
        },

        accuracy: Number,
        speed: Number,
        heading: Number,
        altitude: Number,

        distanceFromRoute: Number,
        isOnRoute: Boolean,
        nearestSignalId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrafficSignal' },
        distanceToNextSignal: Number,

        remainingDistance: Number,
        estimatedTimeRemaining: Number,

        deviceId: String,
        batteryLevel: Number,
        networkType: String,

        timestamp: { type: Date, required: true, default: Date.now },
    },
    { timestamps: true },
);

gpsLogSchema.index({ corridorId: 1, timestamp: -1 });
gpsLogSchema.index({ ambulanceId: 1, timestamp: -1 });
gpsLogSchema.index({ location: '2dsphere' });
// TTL — auto-delete after 90 days
gpsLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('GPSLog', gpsLogSchema);
