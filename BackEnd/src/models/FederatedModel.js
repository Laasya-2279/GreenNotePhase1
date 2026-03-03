/**
 * @file FederatedModel.js — ETA learning model (federated-style aggregation).
 */
const mongoose = require('mongoose');

const federatedModelSchema = new mongoose.Schema(
    {
        version: { type: Number, required: true },

        biases: {
            morning: { type: Number, default: 0 },
            afternoon: { type: Number, default: 0 },
            night: { type: Number, default: 0 },
        },

        samples: {
            morning: { type: Number, default: 0 },
            afternoon: { type: Number, default: 0 },
            night: { type: Number, default: 0 },
        },

        averageError: {
            morning: { type: Number, default: 0 },
            afternoon: { type: Number, default: 0 },
            night: { type: Number, default: 0 },
        },

        accuracy: {
            morning: { type: Number, default: 100 },
            afternoon: { type: Number, default: 100 },
            night: { type: Number, default: 100 },
        },

        totalCorridorsUsed: { type: Number, default: 0 },
        lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'GreenCorridor' },

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

federatedModelSchema.index({ isActive: 1, version: -1 });

module.exports = mongoose.model('FederatedModel', federatedModelSchema);
