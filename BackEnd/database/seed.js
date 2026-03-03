/**
 * @file seed.js
 * @description Seeds the MongoDB database with demo data for GreenNote.
 *
 * Usage:  node database/seed.js
 *
 * Creates:
 *   • 5 demo users (one per role)
 *   • 3 hospitals (Lisie, Aster Medcity, Renai Medicity)
 *   • 1 ambulance driver
 *   • 1 traffic officer
 *   • 5 traffic signals
 *   • 1 federated model (v1 with zeroed biases)
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
    User, Hospital, Ambulance, TrafficOfficer,
    TrafficSignal, FederatedModel,
} = require('../src/models');

const DEMO_PASSWORD = 'demo123';

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅  Connected to MongoDB');

        // ── Clean existing data ─────────────────────────────────────────
        await Promise.all([
            User.deleteMany({}),
            Hospital.deleteMany({}),
            Ambulance.deleteMany({}),
            TrafficOfficer.deleteMany({}),
            TrafficSignal.deleteMany({}),
            FederatedModel.deleteMany({}),
        ]);
        console.log('🗑️   Cleared existing data');

        // ── Hospitals ───────────────────────────────────────────────────
        const hospitals = await Hospital.insertMany([
            {
                hospitalId: 'H001',
                name: 'Lisie Hospital',
                address: 'Lisie Junction, Ernakulam, Kochi',
                location: { type: 'Point', coordinates: [76.288166, 9.988078] },
                contactNumber: '+91-484-2402044',
                email: 'lisie@hospital.com',
                headOfHospital: 'Dr. Mathew Joseph',
                departments: ['Cardiology', 'Nephrology', 'Transplant'],
                hasTransplantFacility: true,
                emergencyBedCapacity: 50,
            },
            {
                hospitalId: 'H003',
                name: 'Aster Medcity',
                address: 'Cheranalloor, Kochi',
                location: { type: 'Point', coordinates: [76.2774219, 10.0066809] },
                contactNumber: '+91-484-6699999',
                email: 'aster@hospital.com',
                headOfHospital: 'Dr. Harish Pillai',
                departments: ['Cardiology', 'Neurology', 'Oncology', 'Transplant'],
                hasTransplantFacility: true,
                emergencyBedCapacity: 120,
            },
            {
                hospitalId: 'H005',
                name: 'Renai Medicity',
                address: 'Palarivattom, Kochi',
                location: { type: 'Point', coordinates: [76.303414, 10.007874] },
                contactNumber: '+91-484-2900200',
                email: 'renai@hospital.com',
                headOfHospital: 'Dr. Ramesh Kumar',
                departments: ['Orthopedics', 'General Surgery', 'Emergency'],
                hasTransplantFacility: false,
                emergencyBedCapacity: 40,
            },
        ]);
        console.log(`🏥  Created ${hospitals.length} hospitals`);

        // ── Ambulance ───────────────────────────────────────────────────
        const ambulance = await Ambulance.create({
            driverId: 'DRV001',
            driverName: 'Rajan Kumar',
            contactNumber: '+91-9876543210',
            email: 'ambulance@demo.com',
            drivingLicenseNumber: 'KL-07-2020-123456',
            licenseExpiry: new Date('2027-12-31'),
            vehicleNumbers: ['KL-07-AB-1234'],
            currentVehicle: 'KL-07-AB-1234',
            vehicleType: 'ALS',
            isAvailable: true,
            isOnDuty: true,
        });
        console.log('🚑  Created ambulance driver');

        // ── Traffic Officer ─────────────────────────────────────────────
        const officer = await TrafficOfficer.create({
            badgeId: 'BADGE001',
            name: 'SI Ramesh',
            rank: 'SI',
            contactNumber: '+91-9876543211',
            email: 'traffic@demo.com',
            zone: 'Ernakulam Central',
            isOnDuty: true,
        });
        console.log('🚦  Created traffic officer');

        // ── Users (one per role) ────────────────────────────────────────
        const hashedPwd = await bcrypt.hash(DEMO_PASSWORD, 12);

        const users = await User.insertMany([
            {
                email: 'hospital@demo.com', password: hashedPwd,
                role: 'HOSPITAL', name: 'City Hospital Admin', phone: '+91-1111111111',
                isVerified: true, hospitalId: hospitals[0]._id,
            },
            {
                email: 'controlroom@demo.com', password: hashedPwd,
                role: 'CONTROL_ROOM', name: 'Control Room Admin', phone: '+91-2222222222',
                isVerified: true,
            },
            {
                email: 'traffic@demo.com', password: hashedPwd,
                role: 'TRAFFIC', name: 'SI Ramesh', phone: '+91-3333333333',
                isVerified: true, trafficOfficerId: officer._id,
            },
            {
                email: 'ambulance@demo.com', password: hashedPwd,
                role: 'AMBULANCE', name: 'Rajan Kumar', phone: '+91-4444444444',
                isVerified: true, ambulanceId: ambulance._id,
            },
            {
                email: 'public@demo.com', password: hashedPwd,
                role: 'PUBLIC', name: 'Public User', phone: '+91-5555555555',
                isVerified: true,
            },
        ]);
        console.log(`👤  Created ${users.length} demo users`);

        // ── Traffic Signals ─────────────────────────────────────────────
        const signalData = [
            {
                signalId: 'SIG_01', name: 'MG Road Junction',
                location: { type: 'Point', coordinates: [76.3014861, 9.9954740] },
                signalType: '4-way', zone: 'Ernakulam Central', currentState: 'RED',
            },
            {
                signalId: 'SIG_02', name: 'Kaloor Junction',
                location: { type: 'Point', coordinates: [76.289544, 9.992308] },
                signalType: '4-way', zone: 'Ernakulam Central', currentState: 'RED',
            },
            {
                signalId: 'SIG_03', name: 'Palarivattom Junction',
                location: { type: 'Point', coordinates: [76.3014861, 9.9954740] },
                signalType: '4-way', zone: 'Ernakulam East', currentState: 'RED',
            },
            {
                signalId: 'SIG_04', name: 'Edappally Junction',
                location: { type: 'Point', coordinates: [76.292152, 9.994999] },
                signalType: '4-way', zone: 'Ernakulam Central', currentState: 'RED',
            },
            {
                signalId: 'SIG_05', name: 'Vytilla Junction',
                location: { type: 'Point', coordinates: [76.281511, 9.985764] },
                signalType: '4-way', zone: 'Ernakulam South', currentState: 'RED',
            },
        ];
        await TrafficSignal.insertMany(signalData);
        console.log(`🚦  Created ${signalData.length} traffic signals`);

        // ── Federated Model ─────────────────────────────────────────────
        await FederatedModel.create({
            version: 1,
            biases: { morning: 0, afternoon: 0, night: 0 },
            samples: { morning: 0, afternoon: 0, night: 0 },
            averageError: { morning: 0, afternoon: 0, night: 0 },
            accuracy: { morning: 100, afternoon: 100, night: 100 },
            isActive: true,
        });
        console.log('🧠  Created federated learning model v1');

        console.log('\n──────────────────────────────────────────');
        console.log('✅  SEED COMPLETE');
        console.log('──────────────────────────────────────────');
        console.log('\nDemo credentials (all roles use password: demo123)');
        console.log('  ambulance@demo.com   → AMBULANCE');
        console.log('  hospital@demo.com    → HOSPITAL');
        console.log('  traffic@demo.com     → TRAFFIC');
        console.log('  controlroom@demo.com → CONTROL_ROOM');
        console.log('  public@demo.com      → PUBLIC');
        console.log('──────────────────────────────────────────\n');

        process.exit(0);
    } catch (error) {
        console.error('❌  Seed failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

seed();
