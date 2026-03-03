/**
 * @file hospital.controller.js
 */
const { Hospital } = require('../models');

exports.getAll = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 20, hasTransplant } = req.query;
        const filter = { isActive: true };
        if (search) filter.name = { $regex: search, $options: 'i' };
        if (hasTransplant === 'true') filter.hasTransplantFacility = true;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [hospitals, total] = await Promise.all([
            Hospital.find(filter).skip(skip).limit(parseInt(limit)).sort({ name: 1 }),
            Hospital.countDocuments(filter),
        ]);
        res.json({ success: true, hospitals, total, page: parseInt(page) });
    } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
        res.json({ success: true, hospital });
    } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
    try {
        const hospital = await Hospital.create({ ...req.body, registeredBy: req.user.userId });
        res.status(201).json({ success: true, hospital });
    } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
        res.json({ success: true, hospital });
    } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
    try {
        await Hospital.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ success: true, message: 'Hospital deactivated' });
    } catch (error) { next(error); }
};

exports.nearby = async (req, res, next) => {
    try {
        const { lat, lng, radius = 5000 } = req.query;
        if (!lat || !lng) return res.status(400).json({ success: false, message: 'lat and lng required' });
        const hospitals = await Hospital.find({
            isActive: true,
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: parseInt(radius),
                },
            },
        });
        res.json({ success: true, hospitals });
    } catch (error) { next(error); }
};
