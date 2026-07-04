const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  redirectUrl,
  getUrlStats,
  getAllShortenedUrls
} = require('../controllers/urlController');

// API Routes

// POST: Create shortened URL
router.post('/shorten', shortenUrl);

// GET: Get all shortened URLs
router.get('/urls', getAllShortenedUrls);

// GET: Get statistics for a short code
router.get('/stats/:shortCode', getUrlStats);

// Redirect route (this is handled in server.js but here for reference)
// GET: /:shortCode - handled separately to catch all short codes

module.exports = router;
