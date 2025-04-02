const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const Url = require('../models/Url');

// @route   POST /api/url/shorten
// @desc    Create short URL
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

  // Check if base URL is valid
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base URL');
  }

  // Check if long URL is valid
  if (!validUrl.isUri(longUrl)) {
    return res.status(401).json('Invalid long URL');
  }

  try {
    // Check if the URL already exists in the database
    let url = await Url.findOne({ longUrl });

    if (url) {
      return res.json(url);
    }

    // Create URL code
    const urlCode = shortid.generate();
    const shortUrl = `${baseUrl}/${urlCode}`;

    // Create new URL object
    url = new Url({
      longUrl,
      shortUrl,
      urlCode,
      date: new Date()
    });

    await url.save();
    res.json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

module.exports = router;
