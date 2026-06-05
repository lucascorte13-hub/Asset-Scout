const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint using query parameter
app.get('/proxy', async (req, res) => {
    let targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }
    // Auto-add Brapi token for brapi.dev requests
    if (targetUrl.includes('brapi.dev') && !targetUrl.includes('token=')) {
        targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'token=vymG61GdXbpALNUVm6k3f9';
    }
    try {
        const response = await fetch(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        const text = await response.text();
        res.set('Content-Type', response.headers.get('content-type') || 'application/json');
        res.set('Access-Control-Allow-Origin', '*');
        res.send(text);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`Asset Scout server running on port ${PORT}`);
});
