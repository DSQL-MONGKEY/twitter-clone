FROM node:20-alpine3.18

# Create working directory
WORKDIR /app

# Copy the all codes
COPY . ./

# Install the dependencies
RUN npm install

# Expose the port
EXPOSE 5000

# Command to run the server
CMD ["npm", "run", "start:prod"]