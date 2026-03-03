/**
 * @file TrafficOfficer.js
 */
const mongoose = require('mongoose');
const { RANKS } = require('../config/constants');

const trafficOfficerSchema = new mongoose.Schema(
    {
        badgeId: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        rank: { type: String, enum: RANKS, required: true },

        contactNumber: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        photo: String,

        zone: { type: String, required: true },
        jurisdiction: {
            type: { type: String, enum: ['Polygon'] },
            coordinates: [[[Number]]],
        },

        isActive: { type: Boolean, default: true },
        isOnDuty: { type: Boolean, default: false },
        currentLocation: {
            type: { type: String, enum: ['Point'] },
            coordinates: [Number],
        },
    },
    { timestamps: true },
);

trafficOfficerSchema.index({ zone: 1 });

module.exports = mongoose.model('TrafficOfficer', trafficOfficerSchema);
