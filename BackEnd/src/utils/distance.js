/**
 * @file distance.js
 * @description Haversine distance calculation — extracted from frontend MapView.jsx.
 *
 * GPS INJECTION NOTE:
 * This is the core distance primitive used everywhere in the routing engine.
 * When an ambulance GPS coordinate arrives, this function is used to:
 *   1. Find the closest point on the active route
 *   2. Compute remaining distance for ETA
 *   3. Detect deviation from the planned route
 */

const EARTH_RADIUS_M = 6371000;

/**
 * Compute the great-circle distance between two lat/lng points (in metres).
 * Identical to the frontend `distMeters()` function.
 *
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in metres
 */
function distMeters(lat1, lon1, lat2, lon2) {
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Total distance along a polyline of [lat, lng] waypoints.
 * @param {Array<[number,number]>} waypoints - [[lat, lng], …]
 * @returns {number} distance in metres
 */
function routeDistance(waypoints) {
    let total = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
        total += distMeters(
            waypoints[i][0], waypoints[i][1],
            waypoints[i + 1][0], waypoints[i + 1][1],
        );
    }
    return total;
}

/**
 * Find the closest point on a route to a given position.
 *
 * GPS → ALGORITHM INJECTION:
 * This is called every time an ambulance GPS ping arrives.  It maps the raw
 * lat/lng to the nearest discrete route waypoint to determine:
 *   • which segment of the route the ambulance is currently on
 *   • the remaining distance from that point to the destination
 *
 * @param {number} lat
 * @param {number} lng
 * @param {Array<[number,number]>} route - [[lat, lng], …]
 * @returns {{ index: number, lat: number, lng: number, distance: number }}
 */
function closestPointOnRoute(lat, lng, route) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < route.length; i++) {
        const d = distMeters(lat, lng, route[i][0], route[i][1]);
        if (d < bestDist) {
            bestDist = d;
            bestIdx = i;
        }
    }
    return {
        index: bestIdx,
        lat: route[bestIdx][0],
        lng: route[bestIdx][1],
        distance: bestDist,
    };
}

/**
 * Remaining distance from a given route index to the end.
 * @param {Array<[number,number]>} route
 * @param {number} fromIndex
 * @returns {number} metres
 */
function remainingRouteDistance(route, fromIndex) {
    let total = 0;
    for (let i = fromIndex; i < route.length - 1; i++) {
        total += distMeters(route[i][0], route[i][1], route[i + 1][0], route[i + 1][1]);
    }
    return total;
}

module.exports = { distMeters, routeDistance, closestPointOnRoute, remainingRouteDistance };
