/**
 * @file User.js — Mongoose schema for all application users.
 *
 * Every person (hospital admin, ambulance driver, traffic officer, control-room
 * operator, public user) is represented by a single User document.  Role-specific
 * detail is stored in separate linked collections (Hospital, Ambulance, etc.).
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, select: false }, // never returned by default
        role: { type: String, enum: Object.values(ROLES), required: true },

        // ── Common ────────────────────────────────────────────────────────
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, unique: true, trim: true },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },

        // ── OTP verification ──────────────────────────────────────────────
        otp: String,
        otpExpiry: Date,
        otpAttempts: { type: Number, default: 0 },

        // ── Role-specific refs ────────────────────────────────────────────
        hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
        ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
        trafficOfficerId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrafficOfficer' },

        // ── Security ──────────────────────────────────────────────────────
        lastLogin: Date,
        loginAttempts: { type: Number, default: 0 },
        lockUntil: Date,
        refreshToken: String,
    },
    { timestamps: true },
);

// ── Indexes ───────────────────────────────────────────────────────────
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1, isVerified: 1 });

// ── Pre-save: hash password ───────────────────────────────────────────
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// ── Instance method: compare password ─────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance method: check if account is locked ───────────────────────
userSchema.methods.isLocked = function () {
    return this.lockUntil && this.lockUntil > Date.now();
};

module.exports = mongoose.model('User', userSchema);
