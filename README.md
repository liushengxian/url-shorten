# URL Shortener

A URL shortening service built with Express.js and Vue.js.

## Features

- Shorten long URLs to compact, shareable links
- Copy links to clipboard with one click
- View history of recently shortened URLs
- Redirect users from shortened URLs to original destinations

## Tech Stack

- Backend: Express.js and MongoDB
- Frontend: Vue.js
- Additional libraries: shortid, valid-url, axios

## Setup and Installation

1. Make sure you have Node.js and MongoDB installed.

2. Install server dependencies:
   ```
   npm install
   ```

3. Install client dependencies:
   ```
   cd client
   npm install
   ```

4. Run MongoDB:
   ```
   mongod
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Start the Vue frontend:
   ```
   cd client
   npm run serve
   ```

7. Access the application at `http://localhost:8080`

## API Endpoints

- `POST /api/url/shorten`: Create a shortened URL
- `GET /:code`: Redirect to the original URL

## Configuration

You can set the following environment variables:
- `PORT`: Server port (default: 5000)
- `BASE_URL`: Base URL for shortened links (default: http://localhost:5000)
- `MONGO_URI`: MongoDB connection string (default: mongodb://localhost:27017/urlshortener)
