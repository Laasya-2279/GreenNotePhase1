/**
 * @file trafficAnalyzer.js
 * @description Monitors congestion and feeds data into the cost engine.
 *              Uses historical signal data + live corridor metrics.
 */

/**
 * Compute a congestion score for a given zone based on signal override history.
 *
 * @param {Array} signals - TrafficSignal documents in the zone
 * @returns {number} congestion score 0–1
 */
function computeZoneCongestion(signals) {
    if (!signals.length) return 0;

    // Higher total overrides in a short window → higher congestion estimate
    const now = Date.now();
    const ONE_HOUR = 3600000;
    let recentOverrides = 0;

    for (const sig of signals) {
        if (sig.overrideHistory?.length) {
            recentOverrides += sig.overrideHistory.filter(
                (h) => now - new Date(h.timestamp).getTime() < ONE_HOUR,
            ).length;
        }
    }

    // Sigmoid-like saturation: caps at ~0.9 for very busy intersections
    return Math.min(0.9, recentOverrides / (signals.length * 2));
}

/**
 * Aggregate traffic pattern data for analytics.
 *
 * @param {Array} corridors - completed corridor documents
 * @returns {Object} { peakHours, avgDelay, signalUsage }
 */
function analyzeTrafficPatterns(corridors) {
    const hourCounts = new Array(24).fill(0);
    let totalDelay = 0;
    let totalSignals = 0;
    let count = 0;

    for (const c of corridors) {
        if (c.startedAt) {
            const h = new Date(c.startedAt).getHours();
            hourCounts[h]++;
        }
        if (c.actualDuration && c.predictedETA) {
            totalDelay += Math.max(0, c.actualDuration - c.predictedETA);
            count++;
        }
        totalSignals += c.signalsEncountered || 0;
    }

    // Find peak hours (top 3)
    const peakHours = hourCounts
        .map((v, i) => ({ hour: i, count: v }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((p) => `${String(p.hour).padStart(2, '0')}:00`);

    return {
        peakHours,
        avgDelay: count ? Math.round(totalDelay / count) : 0,
        signalUsage: totalSignals,
    };
}

module.exports = { computeZoneCongestion, analyzeTrafficPatterns };
