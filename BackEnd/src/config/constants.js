/**
 * @file constants.js
 * @description Application-wide constants — roles, statuses, thresholds.
 */

const ROLES = Object.freeze({
    HOSPITAL: 'HOSPITAL',
    CONTROL_ROOM: 'CONTROL_ROOM',
    TRAFFIC: 'TRAFFIC',
    AMBULANCE: 'AMBULANCE',
    PUBLIC: 'PUBLIC',
});

const CORRIDOR_STATUSES = Object.freeze({
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    FAILED: 'FAILED',
});

const URGENCY_LEVELS = Object.freeze({
    STABLE: 'STABLE',
    CRITICAL: 'CRITICAL',
    VERY_CRITICAL: 'VERY_CRITICAL',
});

const ORGAN_TYPES = [
    'Heart', 'Kidney', 'Liver', 'Lung', 'Pancreas',
    'Cornea', 'Bone Marrow', 'Tissue', 'Emergency Patient', 'Other',
];

const VEHICLE_TYPES = ['BLS', 'ALS', 'ICU'];

const RANKS = [
    'Constable', 'Head Constable', 'ASI', 'SI', 'Inspector', 'ACP', 'DCP',
];

const AUDIT_ACTIONS = [
    'USER_LOGIN', 'USER_LOGOUT', 'USER_SIGNUP',
    'CORRIDOR_CREATED', 'CORRIDOR_APPROVED', 'CORRIDOR_REJECTED',
    'CORRIDOR_STARTED', 'CORRIDOR_COMPLETED', 'CORRIDOR_CANCELLED',
    'ROUTE_CALCULATED', 'ROUTE_CHANGED',
    'SIGNAL_OVERRIDDEN', 'SIGNAL_RESTORED',
    'GPS_UPDATE', 'AMBULANCE_STATUS_CHANGED',
    'HOSPITAL_REGISTERED', 'AMBULANCE_REGISTERED',
];

/** Signal auto-override threshold in metres, keyed by urgency */
const SIGNAL_THRESHOLDS = Object.freeze({
    STABLE: 40,
    CRITICAL: 80,
    VERY_CRITICAL: 200,
});

/** Ambulance speed in m/s (≈ 72 km/h) */
const AMBULANCE_SPEED_MS = 20;

/** Signal delay in seconds per RED signal, keyed by urgency */
const SIGNAL_DELAY = Object.freeze({
    STABLE: 10,
    CRITICAL: 5,
    VERY_CRITICAL: 2,
});

module.exports = {
    ROLES,
    CORRIDOR_STATUSES,
    URGENCY_LEVELS,
    ORGAN_TYPES,
    VEHICLE_TYPES,
    RANKS,
    AUDIT_ACTIONS,
    SIGNAL_THRESHOLDS,
    AMBULANCE_SPEED_MS,
    SIGNAL_DELAY,
};
