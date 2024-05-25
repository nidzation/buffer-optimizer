const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Example route to handle video optimization settings
app.post('/optimize', (req, res) => {
    const settings = req.body;
    console.log('Received settings:', settings);
    // Handle the optimization logic here

    // Respond with a success message
    res.json({ message: 'Optimization settings received' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});