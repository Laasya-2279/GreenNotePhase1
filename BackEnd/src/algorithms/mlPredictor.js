/**
 * @file mlPredictor.js
 * @description Federated-learning ETA bias — stores aggregate model, not raw data.
 *
 * After each corridor completes, this module compares predicted vs actual ETA
 * and adjusts the time-bucket bias using a simple gradient-descent update.
 *
 * The model is stored in MongoDB (FederatedModel) so it persists across restarts.
 */
const FederatedModel = require('../models/FederatedModel');

const LEARNING_RATE = 0.2;

/**
 * Get the active federated model biases.
 * @returns {Object} { morning, afternoon, night }
 */
async function getActiveBiases() {
    const model = await FederatedModel.findOne({ isActive: true }).sort({ version: -1 });
    return model ? model.biases.toObject() : { morning: 0, afternoon: 0, night: 0 };
}

/**
 * Determine time bucket from a Date.
 * @param {Date} date
 * @returns {'morning'|'afternoon'|'night'}
 */
function getTimeBucket(date = new Date()) {
    const h = date.getHours();
    if (h < 10) return 'morning';
    if (h < 18) return 'afternoon';
    return 'night';
}

/**
 * Update the federated model after a corridor completes.
 *
 * @param {Object} opts
 * @param {number} opts.predictedETA  - seconds
 * @param {number} opts.actualDuration - seconds
 * @param {Date}   opts.startedAt     - corridor start time (for bucket selection)
 * @param {string} opts.corridorId    - for tracking
 */
async function updateModel({ predictedETA, actualDuration, startedAt, corridorId }) {
    const error = actualDuration - predictedETA; // positive = took longer than predicted
    const bucket = getTimeBucket(new Date(startedAt));

    let model = await FederatedModel.findOne({ isActive: true }).sort({ version: -1 });
    if (!model) {
        model = new FederatedModel({ version: 1 });
    }

    // Gradient-descent bias update
    model.biases[bucket] += LEARNING_RATE * error;

    // Update sample count and running average error
    model.samples[bucket] += 1;
    const prevSamples = model.samples[bucket] - 1;
    model.averageError[bucket] =
        (model.averageError[bucket] * prevSamples + Math.abs(error)) / model.samples[bucket];

    // Calculate accuracy (% of predictions within 10% of actual)
    const tolerance = actualDuration * 0.1;
    const isAccurate = Math.abs(error) <= tolerance ? 1 : 0;
    model.accuracy[bucket] =
        ((model.accuracy[bucket] / 100) * prevSamples + isAccurate) /
        model.samples[bucket] * 100;

    model.totalCorridorsUsed += 1;
    model.lastUpdatedBy = corridorId;
    model.markModified('biases');
    model.markModified('samples');
    model.markModified('averageError');
    model.markModified('accuracy');

    await model.save();
    return model;
}

module.exports = { getActiveBiases, getTimeBucket, updateModel };
