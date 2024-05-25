// Import necessary modules
const express = require('express');

// Create Express app
const app = express();

// Define a route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
const port = 3000; // You can change this port number if needed
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
