/**
 * @file db.js
 * @description MongoDB connection configuration using Mongoose.
 */
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Mongoose 7+ uses these defaults; explicit for clarity
        });
        console.log(`✅  MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error(`❌  MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
