/**
 * @file ambulance.controller.js
 */
const { Ambulance } = require('../models');

exports.getAll = async (req, res, next) => {
    try {
        const { isAvailable, page = 1, limit = 20 } = req.query;
        const filter = { isActive: true };
        if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [ambulances, total] = await Promise.all([
            Ambulance.find(filter).skip(skip).limit(parseInt(limit)).sort({ driverId: 1 }),
            Ambulance.countDocuments(filter),
        ]);
        res.json({ success: true, ambulances, total, page: parseInt(page) });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const amb = await Ambulance.findById(req.params.id);
        if (!amb) return res.status(404).json({ success: false, message: 'Ambulance not found' });
        res.json({ success: true, ambulance: amb });
    } catch (error) { next(error); }
};

exports.getAvailable = async (req, res, next) => {
    try {
        const ambulances = await Ambulance.find({ isActive: true, isAvailable: true }).sort({ driverId: 1 });
        res.json({ success: true, ambulances });
    } catch (error) { next(error); }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { isAvailable, isOnDuty } = req.body;
        const amb = await Ambulance.findByIdAndUpdate(
            req.params.id, { isAvailable, isOnDuty }, { new: true },
        );
        if (!amb) return res.status(404).json({ success: false, message: 'Ambulance not found' });
        res.json({ success: true, ambulance: amb });
    } catch (error) { next(error); }
};

exports.updateLocation = async (req, res, next) => {
    try {
        const { lat, lng } = req.body;
        const amb = await Ambulance.findByIdAndUpdate(req.params.id, {
            currentLocation: { type: 'Point', coordinates: [lng, lat] },
            lastLocationUpdate: new Date(),
        }, { new: true });
        if (!amb) return res.status(404).json({ success: false, message: 'Ambulance not found' });
        res.json({ success: true, message: 'Location updated' });
    } catch (error) { next(error); }
};
