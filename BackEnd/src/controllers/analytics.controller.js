/**
 * @file analytics.controller.js
 */
const { GreenCorridor, FederatedModel, TrafficSignal } = require('../models');
const { analyzeTrafficPatterns } = require('../algorithms/trafficAnalyzer');

exports.dashboard = async (_req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [activeCorridors, todayCorridors, totalCompleted, totalFailed] = await Promise.all([
            GreenCorridor.countDocuments({ status: { $in: ['APPROVED', 'IN_PROGRESS'] } }),
            GreenCorridor.countDocuments({ requestedAt: { $gte: today } }),
            GreenCorridor.countDocuments({ status: 'COMPLETED' }),
            GreenCorridor.countDocuments({ status: 'FAILED' }),
        ]);

        const completed = await GreenCorridor.find({ status: 'COMPLETED' }).select('actualDuration startedAt sourceHospital');
        const avgResponseTime = completed.length
            ? Math.round(completed.reduce((s, c) => s + (c.actualDuration || 0), 0) / completed.length)
            : 0;

        res.json({
            success: true,
            stats: {
                activeCorridors,
                todayCorridors,
                totalCompleted,
                totalFailed,
                completionRate: (totalCompleted + totalFailed) ? ((totalCompleted / (totalCompleted + totalFailed)) * 100).toFixed(1) : 100,
                avgResponseTime,
            },
        });
    } catch (error) { next(error); }
};

exports.etaAccuracy = async (_req, res, next) => {
    try {
        const model = await FederatedModel.findOne({ isActive: true }).sort({ version: -1 });
        res.json({
            success: true,
            accuracy: model ? {
                overall: ((model.accuracy.morning + model.accuracy.afternoon + model.accuracy.night) / 3).toFixed(1),
                byTime: model.accuracy,
                biases: model.biases,
                samples: model.samples,
            } : { overall: 100, byTime: {}, biases: {}, samples: {} },
        });
    } catch (error) { next(error); }
};

exports.trafficPatterns = async (req, res, next) => {
    try {
        const completed = await GreenCorridor.find({ status: 'COMPLETED' }).select('startedAt actualDuration predictedETA signalsEncountered');
        const patterns = analyzeTrafficPatterns(completed);
        res.json({ success: true, patterns });
    } catch (error) { next(error); }
};
