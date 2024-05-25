const winston = require('winston');

// Configure winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'server.log' })
    ]
});

// Validate settings
function validateSettings(settings) {
    if (!settings.setting1 || !settings.setting2) {
        throw new Error('Invalid settings');
    }
}

// Error handling middleware
function errorHandler(err, req, res, next) {
    logger.error('Error processing request:', { message: err.message, stack: err.stack });
    res.status(400).json({ error: 'Invalid request', details: err.message });
}

module.exports = {
    validateSettings,
    errorHandler,
    logger
};