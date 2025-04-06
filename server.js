const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Url = require('./models/Url'); // Add URL model import for MongoDB support
require('dotenv').config(); // Load environment variables
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database configuration
const DB_TYPE = process.env.DB_TYPE || 'sqlite'; // 'mongodb' or 'sqlite'
const SQLITE_DB_PATH = process.env.SQLITE_DB_PATH || './data/urlshortener.sqlite';
const RAILWAY_VOLUME_MOUNT_PATH = process.env.RAILWAY_VOLUME_MOUNT_PATH; // For Railway deployment

// Database connection
let db; // Will hold SQLite connection

// Connect to the appropriate database
if (DB_TYPE === 'mongodb') {
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
} else if (DB_TYPE === 'sqlite') {
  let dbPath = RAILWAY_VOLUME_MOUNT_PATH ? RAILWAY_VOLUME_MOUNT_PATH + 'urlshortener.sqlite' : SQLITE_DB_PATH
  // Ensure the database directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`Created database directory: ${dbDir}`);
  }

  // Connect to SQLite and initialize tables
  (async () => {
    try {
      // Open the database connection
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });

      console.log(`SQLite connected successfully at: ${dbPath}`);

      // Create tables if they don't exist
      await db.exec(`
        CREATE TABLE IF NOT EXISTS urls (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          urlCode TEXT UNIQUE NOT NULL,
          longUrl TEXT NOT NULL,
          shortUrl TEXT NOT NULL,
          date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Make the database available to routes through app.locals
      app.locals.db = db;

      // Set up routes AFTER the database is initialized
      setupRoutes();

      // Start the server after db connection is ready
      const PORT = process.env.PORT || 9999;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}, using ${DB_TYPE} database`);
      });

      // Handle process termination
      process.on('SIGINT', async () => {
        if (db) {
          await db.close();
          console.log('SQLite connection closed due to app termination');
        }
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        if (db) {
          await db.close();
          console.log('SQLite connection closed due to app termination');
        }
        process.exit(0);
      });
    } catch (err) {
      console.error('Failed to connect to SQLite:', err);
      process.exit(1);
    }
  })();
}

// @route     GET /:code
// @desc      Redirect to the original URL
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    // Check database type and query accordingly
    if (process.env.DB_TYPE === 'mongodb' || mongoose.connection.readyState === 1) {
      // MongoDB query
      const url = await Url.findOne({ urlCode: code });
      
      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }
      
      // Redirect to the long URL
      return res.redirect(url.longUrl);
    } else {
      // SQLite query
      const db = app.locals.db;
      
      // Check if database connection exists
      if (!db) {
        console.error('Database connection not available');
        return res.status(500).json({ error: 'Database connection error' });
      }
      
      // Find the URL by code
      const url = await db.get('SELECT longUrl FROM urls WHERE urlCode = ?', [code]);
      
      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }
      
      // Redirect to the long URL
      return res.redirect(url.longUrl);
    }
  } catch (err) {
    console.error('Error redirecting to URL:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Define a function to set up routes AFTER the database is initialized
function setupRoutes() {
  app.use(express.static(path.join(__dirname, 'client/dist')));

  // API routes
  if (DB_TYPE === 'mongodb') {
    app.use('/api/url', require('./routes/url'));
  } else {
    app.use('/api/url', require('./routes/url-sqlite'));
  }

  // Handle SPA routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}