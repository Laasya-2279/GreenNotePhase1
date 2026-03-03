/**
 * @file osrmService.js
 * @description Optional OSRM integration for road-snapped geometry.
 *              Falls back to straight-line node coordinates when offline.
 */

/**
 * Fetch detailed road geometry from OSRM.
 *
 * @param {Array<{ lat: number, lng: number }>} points
 * @returns {Array<{ lat: number, lng: number }>}
 */
async function fetchRoadGeometry(points) {
    if (!points || points.length < 2) return points;

    const coords = points.map((p) => `${p.lng},${p.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(5000) });
        const payload = await response.json();
        const geometry = payload?.routes?.[0]?.geometry?.coordinates;
        if (geometry) {
            return geometry.map(([lng, lat]) => ({ lat, lng }));
        }
    } catch (_) {
        // OSRM unavailable — fall back to raw points
    }

    return points;
}

module.exports = { fetchRoadGeometry };
