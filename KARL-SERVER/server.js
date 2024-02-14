const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Install using: npm install axios

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/save_transcript', async (req, res) => {
    const transcript = req.body.transcript;

    // Send success response to the client
    res.json({ message: 'Transcript saved successfully' });

    // Notify Python server about the new transcript
    await axios.post('http://localhost:5000/process_transcript', { transcript });
});


// Add the following route
app.post('/process_success', (req, res) => {
    console.log('Success endpoint hit!');
    res.json({ message: 'Success' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
