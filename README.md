# URL Shortener

A modern URL shortening service built with Express.js and Vue.js that offers both SQLite and MongoDB database options.

## Features

- Shorten long URLs to compact, shareable links
- Copy shortened links to clipboard with one click
- Generate and download QR codes for your shortened URLs
- View history of recently shortened URLs
- Responsive UI that works on mobile and desktop devices

## Tech Stack

- **Backend**: Express.js with support for both SQLite and MongoDB
- **Frontend**: Vue.js 3 with Vite and Tailwind CSS
- **Database**: SQLite (default) or MongoDB (configurable)
- **Additional libraries**: 
  - shortid (for generating unique URL codes)
  - valid-url (for URL validation)
  - axios (for API requests)
  - qrcode (for QR code generation)

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- SQLite (included) or MongoDB (optional)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/url-shorten.git
   cd url-shorten
   ```

2. Install server dependencies:
   ```
   npm install
   ```

3. Install client dependencies:
   ```
   cd client
   npm install
   cd ..
   ```

4. Create a `.env` file based on the `.env.example`:
   ```
   cp .env.example .env
   ```
   Then update the values accordingly.

### Running the Application

#### Development Mode

1. Start the backend server:
   ```
   npm run dev
   ```

2. In a separate terminal, start the frontend development server:
   ```
   cd client
   npm run dev
   ```

3. Access the application:
   - Frontend: `http://localhost:5173` (or the port shown in your terminal)
   - Backend API: `http://localhost:9999` (or the port set in your .env)

#### Production Mode

1. Build the frontend:
   ```
   cd client
   npm run build
   cd ..
   ```

2. Start the server:
   ```
   npm start
   ```

3. Access the application at `http://localhost:9999` (or the port set in your .env)

### Docker

The application can also be run using Docker:

```
docker build -t url-shortener .
docker run -p 9999:9999 -v $(pwd)/data:/app/data url-shortener
```

## API Endpoints

- `POST /api/url/shorten`: Create a shortened URL
- `GET /api/url/latest`: Get the latest shortened URLs
- `GET /:code`: Redirect to the original URL

## Configuration

You can configure the application using environment variables in the `.env` file:

- `PORT`: Server port (default: 9999)
- `BASE_URL`: Base URL for shortened links (default: http://localhost:9999)
- `DB_TYPE`: Database type to use ("sqlite" or "mongodb")
- `SQLITE_DB_PATH`: Path to SQLite database file (default: ./data/urlshortener.sqlite)
- `MONGO_URI`: MongoDB connection string (when using MongoDB)
- `MONGO_USER`: MongoDB username (when using MongoDB with authentication)
- `MONGO_PASSWORD`: MongoDB password (when using MongoDB with authentication)

## License

[MIT](LICENSE)
