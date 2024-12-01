# Use a lightweight Node.js image as the base
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package*.json and package-lock.json
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN bun run build

# Expose the port where the application will run
EXPOSE 4200

# Command to run the application
CMD ["bun", "start"]