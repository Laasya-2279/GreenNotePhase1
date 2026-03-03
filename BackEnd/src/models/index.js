/**
 * @file index.js — barrel export for all Mongoose models.
 */
module.exports = {
    User: require('./User'),
    Hospital: require('./Hospital'),
    Ambulance: require('./Ambulance'),
    TrafficOfficer: require('./TrafficOfficer'),
    GreenCorridor: require('./GreenCorridor'),
    TrafficSignal: require('./TrafficSignal'),
    GPSLog: require('./GPSLog'),
    AuditLog: require('./AuditLog'),
    FederatedModel: require('./FederatedModel'),
};
