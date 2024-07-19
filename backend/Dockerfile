FROM node:20-alpine3.18

# Create working directory
WORKDIR /app

# Copy the package
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the all codes
COPY . ./

# Expose the port
EXPOSE 5000

# Command to run the server
CMD ["npm", "run", "start:dev"]