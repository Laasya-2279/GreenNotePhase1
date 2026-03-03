/**
 * @file emergencyCostEngine.js
 * @description Graph-based emergency cost function for route evaluation.
 *
 * Emergency Cost = BaseTime × W_time
 *                + CongestionFactor × W_congestion
 *                + StabilityScore × W_stability
 *                + SignalPenalty × W_signal
 *                + DistanceFallback × W_distance
 *
 * This module is used by the routing engine to score graph edges when computing
 * paths across the road network.  It intentionally does NOT include pothole logic.
 */

const WEIGHTS = Object.freeze({
    time: 0.45,
    congestion: 0.25,
    stability: 0.20,
    signal: 0.08,
    distanceFallback: 0.02,
});

/**
 * Compute emergency cost for a single edge.
 *
 * @param {Object} edge
 * @param {number} edge.baseTravelTime  - base traverse time (minutes)
 * @param {number} edge.congestion      - congestion factor (0–1)
 * @param {number} edge.stability       - road stability (0–1, higher = better)
 * @param {number} edge.signalPenalty   - cumulative signal penalty
 * @param {number} edge.distance        - distance in km
 * @param {string} [urgency='HIGH']     - CRITICAL | HIGH | NORMAL
 * @param {number} [learnedCongestion]  - override from federated model
 * @returns {number} cost (lower = better)
 */
function computeEdgeCost(edge, urgency = 'HIGH', learnedCongestion) {
    const congestion = learnedCongestion ?? edge.congestion;
    const urgencyMultiplier =
        urgency === 'CRITICAL' ? 1.25 : urgency === 'HIGH' ? 1.1 : 1;

    const cost =
        (WEIGHTS.time * edge.baseTravelTime +
            WEIGHTS.congestion * (edge.baseTravelTime * (1 + congestion)) +
            WEIGHTS.stability * (1 - edge.stability) * 10 +
            WEIGHTS.signal * edge.signalPenalty +
            WEIGHTS.distanceFallback * edge.distance) *
        urgencyMultiplier;

    return Number(cost.toFixed(4));
}

/**
 * Dijkstra shortest-path using emergency cost.
 *
 * @param {Object} graph          - { nodes: { id: { id, lat, lng } }, edges: [{ from, to, ... }] }
 * @param {string} sourceId       - start node id
 * @param {string} destinationId  - end node id
 * @param {string} urgency
 * @param {Map}    [congestionMap] - Map<edgeKey, learnedCongestion>
 * @returns {{ path: string[], totalCost: number, estimatedTimeMins: number }}
 */
function dijkstraEmergency(graph, sourceId, destinationId, urgency, congestionMap = new Map()) {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set(Object.keys(graph.nodes));

    for (const nodeId of unvisited) distances.set(nodeId, Infinity);
    distances.set(sourceId, 0);

    while (unvisited.size > 0) {
        let current = null;
        let best = Infinity;
        for (const n of unvisited) {
            const d = distances.get(n);
            if (d < best) { best = d; current = n; }
        }
        if (!current || current === destinationId) break;
        unvisited.delete(current);

        const neighbors = graph.edges
            .filter((e) => e.from === current || e.to === current)
            .map((e) => (e.from === current ? { next: e.to, edge: e } : { next: e.from, edge: e }));

        for (const { next, edge } of neighbors) {
            if (!unvisited.has(next)) continue;
            const edgeKey = [edge.from, edge.to].sort().join('::');
            const cost = computeEdgeCost(edge, urgency, congestionMap.get(edgeKey));
            const newDist = distances.get(current) + cost;
            if (newDist < distances.get(next)) {
                distances.set(next, newDist);
                previous.set(next, current);
            }
        }
    }

    // Reconstruct path
    const path = [];
    let cur = destinationId;
    while (cur && cur !== sourceId) { path.unshift(cur); cur = previous.get(cur); }
    if (cur === sourceId) path.unshift(sourceId);

    // Compute time estimate along path
    let totalTime = 0;
    let totalCost = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const a = path[i];
        const b = path[i + 1];
        const edge = graph.edges.find(
            (e) => (e.from === a && e.to === b) || (e.from === b && e.to === a),
        );
        if (edge) {
            const edgeKey = [edge.from, edge.to].sort().join('::');
            totalCost += computeEdgeCost(edge, urgency, congestionMap.get(edgeKey));
            const cong = congestionMap.get(edgeKey) ?? edge.congestion;
            totalTime += edge.baseTravelTime * (1 + cong);
        }
    }

    return {
        path,
        totalCost: Number(totalCost.toFixed(2)),
        estimatedTimeMins: Number(totalTime.toFixed(2)),
    };
}

module.exports = { computeEdgeCost, dijkstraEmergency, WEIGHTS };
