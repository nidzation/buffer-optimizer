require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const port = process.env.PORT || 3000;
const { validateSettings, errorHandler, logger } = require('./utils');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'buffer-optimizer-server' directory
app.use(express.static(path.join(__dirname)));

// Example route to handle video optimization settings
app.post('/optimize', async (req, res, next) => {
    try {
        const settings = req.body;
        logger.info('Received settings:', settings);

        // Validate settings
        validateSettings(settings);

        // Handle the optimization logic here
        // Example: Perform optimization asynchronously
        await performOptimization(settings);

        // Respond with a success message
        res.json({ message: 'Optimization settings received', settings });
    } catch (error) {
        next(error);
    }
});

// Endpoint to receive error logs from the client
app.post('/log-error', (req, res) => {
    const { message, source, lineno, colno, error } = req.body;
    logger.error(`Client error: ${message} at ${source}:${lineno}:${colno}`, error);
    res.status(204).send(); // No content
});

// Error handling middleware
app.use(errorHandler);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('WebSocket connection established.');
    ws.on('message', message => {
        const data = JSON.parse(message);
        console.clear();
        console.log(`Video Info:
        - FPS: ${data.fps}
        - Quality: ${data.quality}
        - Bandwidth Usage: ${data.bandwidth} bytes`);
    });
});

server.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});

// Example function to perform optimization
async function performOptimization(settings) {
    // Simulate optimization process
    return new Promise((resolve) => {
        setTimeout(() => {
            logger.info('Optimization completed:', settings);
            resolve();
        }, 1000);
    });
}