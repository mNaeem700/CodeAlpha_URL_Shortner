const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const urlRoutes = require('./routes/urlRoutes');
const { initDatabase } = require('./models/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
initDatabase();

// Routes
app.use('/api', urlRoutes);

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Redirect route for short codes
const { redirectUrl } = require('./controllers/urlController');
app.get('/:shortCode', redirectUrl);

// 404 handler for non-existent routes (should be last)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 URL Shortener running on http://localhost:${PORT}`);
});
