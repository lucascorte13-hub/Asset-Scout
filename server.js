const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint for Yahoo Finance, Stooq, etc.
app.get('/proxy/:url', async (req, res) => {
    const targetUrl = decodeURIComponent(req.params.url);
    try {
        const response = await fetch(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        const text = await response.text();
        res.set('Content-Type', response.headers.get('content-type') || 'application/json');
        res.send(text);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`Asset Scout server running on port ${PORT}`);
});
