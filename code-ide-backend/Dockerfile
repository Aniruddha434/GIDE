# Stage 1: Build stage (if you had build steps, e.g., TypeScript)
# For a simple Node.js app without a separate build step, this might be less critical,
# but it's good practice for more complex apps. We'll keep it simple for now.

# Stage 2: Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Install Docker CLI (needed for your app to interact with Docker)
# Using apk for Alpine Linux
RUN apk add --no-cache docker-cli

# Copy package.json and package-lock.json (or yarn.lock)
# If you use yarn, change to `COPY package.json yarn.lock ./`
COPY package*.json ./

# Install production dependencies
# If you use yarn, change to `RUN yarn install --production`
RUN npm install --omit=dev

# Copy application code
COPY . .

# Expose the port your app runs on (e.g., 5000)
# This should match the port in your server.js or be configurable via ENV
EXPOSE 5000

# Command to run the application
# Ensure your server.js listens on 0.0.0.0 to be accessible from outside the container
CMD [ "node", "server.js" ] 