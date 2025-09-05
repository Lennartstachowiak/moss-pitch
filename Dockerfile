# Use the official Node.js 18 image as base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Remove devDependencies after build
RUN npm prune --production

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory to the nextjs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]