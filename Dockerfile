# Use an official Node.js runtime as base
FROM node:latest

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["node", "dist/server.js"]

# Build the image => docker build -t to_be_noted .
# Run container locally => docker run -p 3000:3000 --env-file .env to_be_noted