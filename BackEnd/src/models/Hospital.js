/**
 * @file Hospital.js — Mongoose schema for registered hospitals.
 */
const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
    {
        hospitalId: { type: String, unique: true }, // auto-generated "H001" etc.
        name: { type: String, required: true, trim: true },
        address: { type: String, required: true },

        // GeoJSON Point
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true }, // [lng, lat]
        },

        contactNumber: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        emergencyContact: String,

        headOfHospital: String,
        departments: [String],

        hasTransplantFacility: { type: Boolean, default: false },
        emergencyBedCapacity: Number,
        hasHelipad: { type: Boolean, default: false },

        registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

// ── Indexes ───────────────────────────────────────────────────────────
hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ name: 'text' });

// ── Auto-generate hospitalId ──────────────────────────────────────────
hospitalSchema.pre('save', async function (next) {
    if (this.hospitalId) return next();
    const count = await this.constructor.countDocuments();
    this.hospitalId = `H${String(count + 1).padStart(3, '0')}`;
    next();
});

module.exports = mongoose.model('Hospital', hospitalSchema);
