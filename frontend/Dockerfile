# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Create .next directory and set permissions
RUN mkdir -p .next && chown -R node:node .next

# Switch to non-root user
USER node

# Expose port 3000
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"] 