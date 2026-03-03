/**
 * @file routeOptimizer.js
 * @description Selects the best route from candidate routes based on ETA.
 *
 * Replaces frontend autoSelectNearestHospital():
 *   For each candidate hospital route → compute ETA → pick the lowest.
 *
 * For DONOR mode the route is deterministic (direct hospital-to-hospital),
 * bypassing the selection logic entirely.
 */
const { routeDistance } = require('../utils/distance');
const { calculateETA } = require('./etaCalculator');
const { getAllEmergencyRoutes, getRoute, HOSPITAL_NAMES } = require('./routeRepository');

/**
 * Select the optimal emergency route from the depot to the best hospital.
 *
 * @param {Object} opts
 * @param {string}  opts.urgency    - 'STABLE'|'CRITICAL'|'VERY_CRITICAL'
 * @param {Array}   opts.signals    - current signal states
 * @param {Object}  [opts.biases]   - federated model biases
 * @returns {{ bestRoute, allCandidates }}
 */
function selectBestEmergencyRoute({ urgency, signals, biases }) {
    const candidates = getAllEmergencyRoutes();

    const scored = candidates.map((c) => {
        const eta = calculateETA({
            route: c.route,
            fromIndex: 0,
            urgency,
            signals,
            biases,
        });
        return {
            id: c.id,
            name: c.name,
            route: c.route,
            distance: routeDistance(c.route),
            eta,
        };
    });

    // Sort ascending by ETA
    scored.sort((a, b) => a.eta - b.eta);

    return {
        bestRoute: scored[0] || null,
        allCandidates: scored,
    };
}

/**
 * Resolve a donor route (hospital → hospital).
 * Donor routes bypass hospital comparison — they are fixed paths.
 *
 * @param {string} fromHospital - e.g. "H1"
 * @param {string} toHospital   - e.g. "H5"
 * @param {Object} opts
 * @param {string} opts.urgency
 * @param {Array}  opts.signals
 * @param {Object} [opts.biases]
 * @returns {Object|null}
 */
function resolveDonorRoute(fromHospital, toHospital, { urgency, signals, biases }) {
    const route = getRoute(fromHospital, toHospital);
    if (!route) return null;

    const eta = calculateETA({
        route,
        fromIndex: 0,
        urgency: urgency || 'VERY_CRITICAL', // donor is always highest priority
        signals,
        biases,
    });

    return {
        id: toHospital,
        name: HOSPITAL_NAMES[toHospital],
        route,
        distance: routeDistance(route),
        eta,
        isDonorRoute: true,
    };
}

module.exports = { selectBestEmergencyRoute, resolveDonorRoute };
