const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
// const config = require('config');
require('dotenv').config(); // Load environment variables


// @route     POST /api/url/shorten
// @desc      Create short URL
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  // const baseUrl = config.get('baseUrl');
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const db = req.app.locals.db;

  // Check if database connection exists
  if (!db) {
    console.error('Database connection not available');
    return res.status(500).json('Database connection error');
  }

  // Check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url');
  }

  // Check long url
  if (!validUrl.isUri(longUrl)) {
    return res.status(401).json('Invalid long url');
  }

  try {
    // Check if the URL already exists in database
    let url = await db.get('SELECT * FROM urls WHERE longUrl = ?', [longUrl]);

    if (url) {
      return res.json(url);
    } else {
      // Create new short URL
      const urlCode = shortid.generate();
      const shortUrl = `${baseUrl}/${urlCode}`;

      // Insert into database
      const result = await db.run(
        'INSERT INTO urls (urlCode, longUrl, shortUrl) VALUES (?, ?, ?)',
        [urlCode, longUrl, shortUrl]
      );

      // Get the inserted URL
      url = await db.get('SELECT * FROM urls WHERE id = ?', [result.lastID]);
      
      res.json(url);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

// @route     GET /api/url/latest
// @desc      Get latest shortened URLs
router.get('/latest', async (req, res) => {
  const db = req.app.locals.db;
  
  // Check if database connection exists
  if (!db) {
    console.error('Database connection not available');
    return res.status(500).json({ error: 'Database connection error' });
  }
  
  try {
    // Get limit from query parameter, default to 10, max 100
    const limit = Math.min(
      parseInt(req.query.limit) || 10,  // Default to 10 if not specified
      100                              // Cap at maximum of 100 records
    );
    
    // Fetch the latest URLs with the specified limit, sorted by date descending
    const urls = await db.all(`
      SELECT * FROM urls
      ORDER BY date DESC
      LIMIT ?
    `, [limit]);
    
    if (urls.length === 0) {
      return res.json([]);
    }
    
    return res.json(urls);
  } catch (err) {
    console.error('Error fetching latest URLs:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @route     GET /api/url/:code
// @desc      Redirect to the long URL
router.get('/:code', async (req, res) => {
  const db = req.app.locals.db;
  
  // Check if database connection exists
  if (!db) {
    console.error('Database connection not available');
    return res.status(500).json({ error: 'Database connection error' });
  }
  
  try {
    const { code } = req.params;
    
    // Find the URL by code
    const url = await db.get('SELECT longUrl FROM urls WHERE urlCode = ?', [code]);
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    // Redirect to the long URL
    return res.redirect(url.longUrl);
  } catch (err) {
    console.error('Error redirecting to URL:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
