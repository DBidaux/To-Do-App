# Use the official Node.js image.
FROM node:16

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the app on port 3000
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
