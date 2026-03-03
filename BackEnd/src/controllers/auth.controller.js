/**
 * @file auth.controller.js
 * @description Authentication controller — signup, login, OTP, refresh, logout.
 */
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User, Hospital, Ambulance, TrafficOfficer } = require('../models');
const { createAuditLog } = require('../middleware/audit.middleware');

// ── Helper: generate 6-digit OTP ──────────────────────────────────────
function generateOTP() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

// ── Helper: generate tokens ───────────────────────────────────────────
function generateTokens(user) {
    const accessToken = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    );
    const refreshToken = jwt.sign(
        { userId: user._id, tokenId: uuidv4() },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' },
    );
    return { accessToken, refreshToken };
}

// ── SIGNUP ─────────────────────────────────────────────────────────────
exports.signup = async (req, res, next) => {
    try {
        const { email, password, role, name, phone, ...extra } = req.body;

        // Check existing
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email or phone already registered' });
        }

        // Create role-specific entity first
        let hospitalId, ambulanceId, trafficOfficerId;

        if (role === 'HOSPITAL' && extra.hospitalName) {
            const hospital = await Hospital.create({
                name: extra.hospitalName,
                address: extra.address || '',
                location: {
                    type: 'Point',
                    coordinates: extra.coordinates || [76.2999, 9.9312], // default Kochi
                },
                contactNumber: phone,
                email,
                hasTransplantFacility: extra.hasTransplantFacility || false,
                emergencyBedCapacity: extra.emergencyBedCapacity || 0,
                departments: extra.departments || [],
                headOfHospital: extra.headOfHospital || name,
            });
            hospitalId = hospital._id;
        }

        if (role === 'AMBULANCE') {
            const ambulance = await Ambulance.create({
                driverName: name,
                contactNumber: phone,
                email,
                drivingLicenseNumber: extra.licenseNumber || `LIC${Date.now()}`,
                licenseExpiry: extra.licenseExpiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                vehicleNumbers: extra.vehicleNumber ? [extra.vehicleNumber] : [],
                currentVehicle: extra.vehicleNumber || '',
                vehicleType: extra.vehicleType || 'BLS',
            });
            ambulanceId = ambulance._id;
        }

        if (role === 'TRAFFIC') {
            const officer = await TrafficOfficer.create({
                badgeId: extra.badgeId || `BADGE${Date.now()}`,
                name,
                rank: extra.rank || 'Constable',
                contactNumber: phone,
                email,
                zone: extra.zone || 'Default Zone',
            });
            trafficOfficerId = officer._id;
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 10) * 60000);

        const user = await User.create({
            email, password, role, name, phone,
            otp, otpExpiry,
            hospitalId, ambulanceId, trafficOfficerId,
            isVerified: true, // auto-verify for demo; set false for production OTP flow
        });

        await createAuditLog({
            action: 'USER_SIGNUP', req, user: { userId: user._id, role, name },
            details: { email, role }, success: true,
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: user._id,
            otp: process.env.NODE_ENV === 'development' ? otp : undefined, // expose OTP in dev
        });
    } catch (error) { next(error); }
};

// ── VERIFY OTP ────────────────────────────────────────────────────────
exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Already verified' });
        }
        if (user.otpAttempts >= (parseInt(process.env.OTP_MAX_ATTEMPTS, 10) || 3)) {
            return res.status(429).json({ success: false, message: 'Max OTP attempts exceeded' });
        }
        if (!user.otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }
        if (user.otp !== otp) {
            user.otpAttempts += 1;
            await user.save();
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.otpAttempts = 0;
        await user.save();

        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        user.lastLogin = new Date();
        await user.save();

        res.json({
            success: true,
            message: 'Verified',
            ...tokens,
            user: { _id: user._id, email: user.email, role: user.role, name: user.name },
        });
    } catch (error) { next(error); }
};

// ── LOGIN ─────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        if (user.isLocked()) {
            return res.status(423).json({ success: false, message: 'Account locked. Try later.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 15 * 60000); // 15 min lock
            }
            await user.save();
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Reset login attempts
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        user.lastLogin = new Date();

        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        await createAuditLog({
            action: 'USER_LOGIN', req,
            user: { userId: user._id, role: user.role, name: user.name },
            success: true,
        });

        res.json({
            success: true,
            ...tokens,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                phone: user.phone,
                hospitalId: user.hospitalId,
                ambulanceId: user.ambulanceId,
                trafficOfficerId: user.trafficOfficerId,
                isVerified: user.isVerified,
            },
        });
    } catch (error) { next(error); }
};

// ── LOGOUT ────────────────────────────────────────────────────────────
exports.logout = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });
        await createAuditLog({
            action: 'USER_LOGOUT', req, user: req.user, success: true,
        });
        res.json({ success: true, message: 'Logged out' });
    } catch (error) { next(error); }
};

// ── REFRESH TOKEN ─────────────────────────────────────────────────────
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
        );

        res.json({ success: true, accessToken });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Refresh token expired' });
        }
        next(error);
    }
};

// ── GET CURRENT USER ──────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate('hospitalId')
            .populate('ambulanceId')
            .populate('trafficOfficerId');
        res.json({ success: true, user });
    } catch (error) { next(error); }
};
