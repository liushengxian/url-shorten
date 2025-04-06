FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files for server and client
COPY package*.json ./
COPY client/package*.json ./client/

# Install server dependencies
RUN npm ci --only=production

# Copy source files needed for the build
COPY . .

# Install client dependencies and build
WORKDIR /app/client
RUN npm ci && npm run build && npm prune --production

# Final stage
FROM node:22-alpine

WORKDIR /app

# Ensure proper permissions on the data directory
RUN mkdir -p /app/data && chmod 777 /app/data

# Copy server files and dependencies
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/models ./models
COPY --from=build /app/routes ./routes

# Copy built client files
COPY --from=build /app/client/dist ./client/dist

# Expose the port the app runs on
EXPOSE 9999

# Define a volume for SQLite database persistence
# VOLUME /app/data

# Command to run the server
CMD ["npm", "run", "start"]
