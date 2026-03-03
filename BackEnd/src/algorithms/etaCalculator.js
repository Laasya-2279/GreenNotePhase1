/**
 * @file etaCalculator.js
 * @description Computes ETA from remaining route distance, signal penalties, and ML bias.
 *
 * ETA CALCULATION LOGIC (replaces frontend ETAseconds / computeETAForRoute):
 *   ETA = remainingDistance / ambulanceSpeed
 *       + numberOfRedSignalsAhead × signalDelay(criticality)
 *       + federatedModelBias(timeBucket)
 *
 * This is invoked:
 *   1. When a corridor is first approved (initial ETA)
 *   2. On every GPS update to recalculate remaining ETA
 *   3. When the route optimizer selects the best hospital route
 */
const { distMeters, remainingRouteDistance } = require('../utils/distance');
const { AMBULANCE_SPEED_MS, SIGNAL_DELAY } = require('../config/constants');

/**
 * Determine which time-of-day bucket we are in.
 * @returns {'morning'|'afternoon'|'night'}
 */
function getTimeBucket() {
    const h = new Date().getHours();
    if (h < 10) return 'morning';
    if (h < 18) return 'afternoon';
    return 'night';
}

/**
 * Calculate ETA in seconds.
 *
 * @param {Object} opts
 * @param {Array<[number,number]>} opts.route         - [[lat,lng], …]
 * @param {number}                 opts.fromIndex      - Current waypoint index
 * @param {string}                 opts.urgency        - 'STABLE'|'CRITICAL'|'VERY_CRITICAL'
 * @param {Array}                  opts.signals        - [{ position: [lat,lng], state:'RED'|'GREEN' }, …]
 * @param {Object}                 [opts.biases]       - { morning, afternoon, night } from FederatedModel
 * @returns {number} ETA in seconds (≥ 0)
 */
function calculateETA({ route, fromIndex, urgency, signals = [], biases = {} }) {
    // 1. Remaining distance along the polyline
    const remaining = remainingRouteDistance(route, fromIndex);

    // 2. Base travel time
    const travelTime = remaining / AMBULANCE_SPEED_MS;

    // 3. Count red signals that are AHEAD on the route
    const delayPerSignal = SIGNAL_DELAY[urgency] || 8;
    let redCount = 0;
    if (signals.length > 0) {
        for (const sig of signals) {
            if (sig.state !== 'RED') continue;
            // Check if signal is on the remaining portion of the route
            for (let i = fromIndex; i < route.length; i++) {
                const d = distMeters(route[i][0], route[i][1], sig.position[0], sig.position[1]);
                if (d <= 50) { // within 50m of a waypoint — signal is on route
                    redCount++;
                    break;
                }
            }
        }
    }
    const signalPenalty = redCount * delayPerSignal;

    // 4. Federated learning bias
    const bucket = getTimeBucket();
    const mlBias = biases[bucket] || 0;

    return Math.max(0, Math.round(travelTime + signalPenalty + mlBias));
}

/**
 * Format seconds into a human-readable string.
 * @param {number} s - seconds
 * @returns {string} e.g. "3 mins 24 secs"
 */
function formatETA(s) {
    return `${Math.floor(s / 60)} mins ${s % 60} secs`;
}

module.exports = { calculateETA, formatETA, getTimeBucket };
