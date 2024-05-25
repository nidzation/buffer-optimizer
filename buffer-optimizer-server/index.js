const WebSocket = require('ws');
const express = require('express');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 3000 });

// Create an Express app
const app = express();
const PORT = 4000;

// Configure Express to parse JSON body
app.use(express.json());

// Handle POST requests to /errors route
app.post('/errors', (req, res) => {
  // Log errors received from the extension
  console.error('Error from extension:', req.body.error);
  res.status(200).send('Error received successfully.');
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Listen for WebSocket connections
wss.on('connection', function connection(ws) {
  console.log('New WebSocket connection');

  // Listen for messages from clients
  ws.on('message', function incoming(message) {
    // Parse the incoming message
    const data = JSON.parse(message);
    console.clear(); // Clear the console before printing new message
    console.log('Received:', data);

    // Log FPS dynamically
    console.log('FPS:', data.fps);
  });
});

// Log server start
console.log('WebSocket Server is running on http://localhost:3000');
