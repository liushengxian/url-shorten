FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files for server and client
COPY package*.json ./
COPY client/package*.json ./client/

# Install server dependencies
RUN npm ci

# Install client dependencies
WORKDIR /app/client
RUN npm ci

# Return to app root
WORKDIR /app

# Copy the rest of the application
COPY . .

# Build the client application
WORKDIR /app/client
RUN npm run build

# Return to app root
WORKDIR /app

# Expose the port the app runs on
EXPOSE 9999

# Command to run the server
CMD ["npm", "run", "start"]
