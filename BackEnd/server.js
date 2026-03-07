/**
 * @file server.js
 * @description GreenNote Backend entry point.
 *
 * Wires together:
 *   • Express app with security middleware, routes, and error handling
 *   • MongoDB via Mongoose
 *   • Socket.IO real-time layer
 *   • Graceful shutdown handling
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const { Server } = require('socket.io');

const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');
const { apiLimiter } = require('./src/middleware/rateLimit.middleware');
const { notFound, errorHandler } = require('./src/middleware/error.middleware');
const { setupCorridorSocket } = require('./src/sockets/corridorSocket');

// ── Route imports ─────────────────────────────────────────────────────
const authRoutes = require('./src/routes/auth.routes');
const hospitalRoutes = require('./src/routes/hospital.routes');
const ambulanceRoutes = require('./src/routes/ambulance.routes');
const corridorRoutes = require('./src/routes/corridor.routes');
const gpsRoutes = require('./src/routes/gps.routes');
const signalRoutes = require('./src/routes/signal.routes');
const auditRoutes = require('./src/routes/audit.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');

// ── Express app ───────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ── Socket.IO ─────────────────────────────────────────────────────────
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
app.set('io', io); // make io available in controllers via req.app.get('io')
setupCorridorSocket(io);

// ── Security middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

// ── Logging ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// ── Rate limiting ─────────────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ── Health check ──────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'GreenNote API is running', timestamp: new Date() });
});

// ── API routes ────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/corridors', corridorRoutes);
app.use('/api/gps', gpsRoutes);
app.use('/api/signals', signalRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/analytics', analyticsRoutes);

// ── Error handling (must be last) ─────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

async function start() {
    await connectDB();
    server.listen(PORT, () => {
        logger.info(`🚀  GreenNote API running on http://localhost:${PORT}`);
        logger.info(`📡  Socket.IO ready on ws://localhost:${PORT}`);
        console.log(`\n🚀  GreenNote API running on http://localhost:${PORT}`);
        console.log(`📡  Socket.IO ready on ws://localhost:${PORT}\n`);
    });
}

start().catch((err) => {
    logger.error('Server failed to start', { error: err.message });
    process.exit(1);
});

// ── Graceful shutdown ─────────────────────────────────────────────────
const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully…`);
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
    // Force shutdown after 10s
    setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled rejection', { error: err.message, stack: err.stack });
});

module.exports = { app, server }; // for testing
