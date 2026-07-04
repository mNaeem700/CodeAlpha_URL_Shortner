const {
  insertUrl,
  getUrlByShortCode,
  updateClicks,
  getStats,
  getAllUrls,
  shortCodeExists
} = require('../models/database');

// Generate random short code
const generateShortCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';
  for (let i = 0; i < 6; i++) {
    shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return shortCode;
};

// Validate URL format
const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

// Shorten URL endpoint
const shortenUrl = (req, res) => {
  const { longUrl, customCode } = req.body;

  // Validation
  if (!longUrl) {
    return res.status(400).json({ error: 'Long URL is required' });
  }

  if (!isValidUrl(longUrl)) {
    return res.status(400).json({ error: 'Invalid URL format. Use http:// or https://' });
  }

  // Generate or use custom short code
  const shortCode = customCode || generateShortCode();

  // Check if custom code is valid (if provided)
  if (customCode && customCode.length < 3) {
    return res.status(400).json({ error: 'Custom code must be at least 3 characters' });
  }

  // Check if short code already exists
  shortCodeExists(shortCode, (err, exists) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (exists) {
      return res.status(409).json({ error: 'Short code already exists. Try a different one.' });
    }

    // Insert into database
    insertUrl(shortCode, longUrl, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create short URL' });
      }

      res.status(201).json({
        success: true,
        shortCode: result.shortCode,
        shortUrl: `http://localhost:3000/${result.shortCode}`,
        longUrl: result.longUrl,
        createdAt: new Date().toISOString()
      });
    });
  });
};

// Redirect endpoint
const redirectUrl = (req, res) => {
  const { shortCode } = req.params;

  getUrlByShortCode(shortCode, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Increment click count
    updateClicks(shortCode, (err) => {
      if (err) {
        console.error('Error updating clicks:', err);
      }
    });

    // Redirect to original URL
    res.redirect(row.longUrl);
  });
};

// Get statistics for a short code
const getUrlStats = (req, res) => {
  const { shortCode } = req.params;

  getStats(shortCode, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.json({
      shortCode: row.shortCode,
      longUrl: row.longUrl,
      clicks: row.clicks,
      createdAt: row.createdAt
    });
  });
};

// Get all URLs (recent)
const getAllShortenedUrls = (req, res) => {
  getAllUrls((err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      success: true,
      data: rows || []
    });
  });
};

module.exports = {
  shortenUrl,
  redirectUrl,
  getUrlStats,
  getAllShortenedUrls
};
