// ------------------- Load environment variables -------------------
require('dotenv').config();

console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV || 'development');

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------- Middleware -------------------
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ------------------- OMDb API Route -------------------
const OMDB_API_KEY = process.env.OMDB_API_KEY;

app.get('/api/movie/:id', async (req, res) => {
    const id = req.params.id;

    if (!OMDB_API_KEY) {
        return res.status(500).json({
            error: 'OMDB API key not configured'
        });
    }

    try {
        const response = await axios.get(
            `https://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}`
        );

        res.json(response.data);
    } catch (err) {
        console.error('OMDB Error:', err.message);

        res.status(500).json({
            error: 'Failed to fetch movie data'
        });
    }
});

// ------------------- JSON Review Routes -------------------
const reviewRoutes = require('./routes/reviewRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/reviews', reviewRoutes);
app.use('/api/reports', reportRoutes);

// ------------------- Static Files -------------------
const frontendPath = path.join(__dirname, '..');

app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ------------------- SPA Fallback -------------------
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ------------------- Start Server -------------------
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

// ------------------- Export for Vercel -------------------
module.exports = app;