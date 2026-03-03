/**
 * @file signalScheduler.js
 * @description Signal preemption logic — detects ambulance proximity and
 *              auto-overrides traffic signals to GREEN for ACTIVE corridors.
 *
 * SIGNAL THRESHOLD DETECTION:
 *   When a GPS update arrives, this module checks every signal:
 *     distance(ambulanceLat, ambulanceLng, signalLat, signalLng) < threshold?
 *   Thresholds are urgency-dependent:
 *     STABLE:       40 m
 *     CRITICAL:     80 m
 *     VERY_CRITICAL: 200 m
 *
 *   If within threshold → set signal state to GREEN (in DB).
 *   If ambulance moves away → restore to RED.
 *
 *   Emit `signalStateUpdate` via socket for the traffic dashboard.
 */
const { distMeters } = require('../utils/distance');
const { SIGNAL_THRESHOLDS } = require('../config/constants');
const TrafficSignal = require('../models/TrafficSignal');

/**
 * Process signal preemption for a given ambulance location.
 *
 * @param {Object}  opts
 * @param {number}  opts.lat           - ambulance latitude
 * @param {number}  opts.lng           - ambulance longitude
 * @param {string}  opts.urgency       - corridor urgency level
 * @param {string}  opts.corridorId    - active corridor ObjectId
 * @param {Array}   opts.signals       - array of signal docs (from DB)
 * @returns {{ changed: Array, signalStates: Array }}
 */
function processSignalPreemption({ lat, lng, urgency, corridorId, signals }) {
    const threshold = SIGNAL_THRESHOLDS[urgency] || 60;
    const changed = [];
    const signalStates = [];

    for (const sig of signals) {
        const [sigLng, sigLat] = sig.location.coordinates; // GeoJSON is [lng, lat]
        const d = distMeters(lat, lng, sigLat, sigLng);
        const shouldBeGreen = d <= threshold && d > 5; // > 5m avoids false positives at signal

        const previousState = sig.currentState;
        const newState = shouldBeGreen ? 'GREEN' : 'RED';

        if (previousState !== newState) {
            changed.push({
                signalId: sig.signalId,
                _id: sig._id,
                previousState,
                newState,
                distance: Math.round(d),
            });
        }

        signalStates.push({
            signalId: sig.signalId,
            _id: sig._id,
            position: [sigLat, sigLng], // [lat, lng] for frontend
            state: newState,
            distance: Math.round(d),
        });
    }

    return { changed, signalStates };
}

/**
 * Persist signal state changes to the database.
 */
async function persistSignalChanges(changed, corridorId) {
    for (const ch of changed) {
        await TrafficSignal.findByIdAndUpdate(ch._id, {
            currentState: ch.newState,
            ...(ch.newState === 'GREEN'
                ? {
                    overriddenForCorridor: corridorId,
                    lastOverrideAt: new Date(),
                    $inc: { totalOverrides: 1 },
                    $push: {
                        overrideHistory: {
                            corridorId: String(corridorId),
                            timestamp: new Date(),
                            duration: 0,
                        },
                    },
                }
                : { overriddenForCorridor: null }),
        });
    }
}

/**
 * Restore all signals overridden for a specific corridor back to RED.
 */
async function restoreSignalsForCorridor(corridorId) {
    await TrafficSignal.updateMany(
        { overriddenForCorridor: corridorId },
        { currentState: 'RED', overriddenForCorridor: null },
    );
}

module.exports = { processSignalPreemption, persistSignalChanges, restoreSignalsForCorridor };
