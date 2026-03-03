/**
 * @file Ambulance.js — Mongoose schema for ambulance drivers / vehicles.
 */
const mongoose = require('mongoose');
const { VEHICLE_TYPES } = require('../config/constants');

const ambulanceSchema = new mongoose.Schema(
    {
        driverId: { type: String, unique: true }, // "DRV001"
        driverName: { type: String, required: true },

        contactNumber: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },

        drivingLicenseNumber: { type: String, required: true, unique: true },
        licenseExpiry: { type: Date, required: true },
        photo: String,

        vehicleNumbers: [String],
        currentVehicle: String,
        vehicleType: { type: String, enum: VEHICLE_TYPES, default: 'BLS' },

        isAvailable: { type: Boolean, default: true },
        isOnDuty: { type: Boolean, default: false },
        currentLocation: {
            type: { type: String, enum: ['Point'] },
            coordinates: [Number],
        },
        lastLocationUpdate: Date,

        totalCorridorsCompleted: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        totalDistanceTraveled: { type: Number, default: 0 },

        registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

ambulanceSchema.index({ currentLocation: '2dsphere' });
ambulanceSchema.index({ isAvailable: 1, isOnDuty: 1 });

ambulanceSchema.pre('save', async function (next) {
    if (this.driverId) return next();
    const count = await this.constructor.countDocuments();
    this.driverId = `DRV${String(count + 1).padStart(3, '0')}`;
    next();
});

module.exports = mongoose.model('Ambulance', ambulanceSchema);
