const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Url = require('./models/Url');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/urlshortener';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auth: {
    username: process.env.MONGO_USER || 'shawn',
    password: process.env.MONGO_PASSWORD || 'Welcome2028.'
  },
  authSource: 'admin'
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit with failure
  });

// MongoDB connection error handling
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Handle process termination and close MongoDB connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
});

app.use(express.static(path.join(__dirname, 'client/dist'))); // Serve static files from the client build directory

// API routes
app.use('/api/url', require('./routes/url'));

// Get latest shortened URLs (accepts limit parameter)
app.get('/api/latest', async (req, res) => {
  try {
    // Get the limit from query parameter, default to 5 if not provided
    let limit = 5;
    if (req.query.limit) {
      // Parse to integer and validate
      const parsedLimit = parseInt(req.query.limit);
      // Check if it's a valid number and is within reasonable range (1-100)
      if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100) {
        limit = parsedLimit;
      }
    }

    const latestUrls = await Url.find()
      .sort({ date: -1 })
      .limit(limit);

    // Return an empty array instead of 404 when no URLs are found
    // This is more RESTful as an empty result set is not an error condition
    return res.json(latestUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Redirect route
app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json('No URL found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));