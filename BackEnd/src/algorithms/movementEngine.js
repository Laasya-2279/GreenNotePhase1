/**
 * @file movementEngine.js
 * @description GPS → route mapping and deviation detection.
 *
 * DEVIATION THRESHOLD HANDLING:
 *   The backend does NOT recompute the route on every GPS tick.
 *   It only reroutes when:
 *     1. Ambulance has deviated > DEVIATION_THRESHOLD_M from the route
 *     2. ETA variance exceeds ETA_VARIANCE_THRESHOLD_S
 *
 *   This prevents "route thrashing" — constant oscillation between paths.
 */
const { closestPointOnRoute, remainingRouteDistance, distMeters } = require('../utils/distance');

const DEVIATION_THRESHOLD_M = 50;   // metres
const ETA_VARIANCE_THRESHOLD_S = 30; // seconds
const ARRIVAL_THRESHOLD_M = 15;      // metres

/**
 * Process a GPS update against the active corridor session.
 *
 * GPS → ALGORITHM INJECTION:
 *   1. Accept live lat/lng from ambulance
 *   2. Snap to nearest route waypoint
 *   3. Compute remaining distance
 *   4. Detect deviation
 *   5. Return whether reroute is needed
 *
 * @param {Object} session         - activeCorridorSession
 * @param {number} lat
 * @param {number} lng
 * @param {number} [previousETA]   - last computed ETA in seconds
 * @param {number} [newETA]        - freshly computed ETA in seconds
 * @returns {Object} { snapped, remainingDist, isDeviated, shouldReroute, hasArrived }
 */
function processGPSUpdate(session, lat, lng, previousETA, newETA) {
    const route = session.route;

    // 1. Find closest waypoint on the route
    const snapped = closestPointOnRoute(lat, lng, route);

    // 2. Remaining distance
    const remainingDist = remainingRouteDistance(route, snapped.index);

    // 3. Has ambulance arrived at destination?
    const dest = route[route.length - 1];
    const distToDest = distMeters(lat, lng, dest[0], dest[1]);
    const hasArrived = distToDest <= ARRIVAL_THRESHOLD_M;

    // 4. Deviation detection — only reroute if deviation is significant
    const isDeviated = snapped.distance > DEVIATION_THRESHOLD_M;

    // 5. ETA variance check — only if we have both previous and new ETA
    const etaVarianceExceeded =
        previousETA !== undefined &&
        newETA !== undefined &&
        Math.abs(newETA - previousETA) > ETA_VARIANCE_THRESHOLD_S;

    const shouldReroute = isDeviated || etaVarianceExceeded;

    return {
        snapped,
        remainingDist,
        isDeviated,
        etaVarianceExceeded,
        shouldReroute,
        hasArrived,
        distToDest: Math.round(distToDest),
    };
}

module.exports = {
    processGPSUpdate,
    DEVIATION_THRESHOLD_M,
    ETA_VARIANCE_THRESHOLD_S,
    ARRIVAL_THRESHOLD_M,
};
