const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../urls.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Initialize database table
const initDatabase = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shortCode TEXT UNIQUE NOT NULL,
      longUrl TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('✅ Database table initialized');
    }
  });
};

// Insert new URL
const insertUrl = (shortCode, longUrl, callback) => {
  db.run(
    'INSERT INTO urls (shortCode, longUrl) VALUES (?, ?)',
    [shortCode, longUrl],
    function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: this.lastID, shortCode, longUrl, clicks: 0 });
      }
    }
  );
};

// Get URL by short code
const getUrlByShortCode = (shortCode, callback) => {
  db.get(
    'SELECT * FROM urls WHERE shortCode = ?',
    [shortCode],
    (err, row) => {
      callback(err, row);
    }
  );
};

// Update click count
const updateClicks = (shortCode, callback) => {
  db.run(
    'UPDATE urls SET clicks = clicks + 1 WHERE shortCode = ?',
    [shortCode],
    (err) => {
      callback(err);
    }
  );
};

// Get stats for a short code
const getStats = (shortCode, callback) => {
  db.get(
    'SELECT * FROM urls WHERE shortCode = ?',
    [shortCode],
    (err, row) => {
      callback(err, row);
    }
  );
};

// Get all URLs (for display)
const getAllUrls = (callback) => {
  db.all(
    'SELECT * FROM urls ORDER BY createdAt DESC LIMIT 50',
    (err, rows) => {
      callback(err, rows);
    }
  );
};

// Check if short code exists
const shortCodeExists = (shortCode, callback) => {
  db.get(
    'SELECT * FROM urls WHERE shortCode = ?',
    [shortCode],
    (err, row) => {
      callback(err, !!row);
    }
  );
};

module.exports = {
  initDatabase,
  insertUrl,
  getUrlByShortCode,
  updateClicks,
  getStats,
  getAllUrls,
  shortCodeExists
};
