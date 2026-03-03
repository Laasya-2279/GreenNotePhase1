/**
 * @file logger.js
 * @description Winston logger configured from env vars.
 */
const { createLogger, format, transports } = require('winston');
const path = require('path');

const logLevel = process.env.LOG_LEVEL || 'info';
const logFilePath = process.env.LOG_FILE_PATH || './logs/app.log';

const logger = createLogger({
    level: logLevel,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.json(),
    ),
    defaultMeta: { service: 'greennote-api' },
    transports: [
        new transports.File({ filename: path.resolve(logFilePath), maxsize: 5242880, maxFiles: 5 }),
        new transports.File({ filename: path.resolve(path.dirname(logFilePath), 'error.log'), level: 'error' }),
    ],
});

// In development also log to console in colour
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
    }));
}

module.exports = logger;
