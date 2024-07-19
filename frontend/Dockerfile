FROM node:20-alpine3.18

# Create working directory /app
WORKDIR /app

# Copy the all file with prefix package (package.lock.json, package.json)
COPY package*.json ./

# Install the all dependencies
RUN npm install

# Copy the all code into ./app working directory
COPY . ./

# Run the build command of the project
# RUN npm run build

# Expose port 3000
EXPOSE 3000

# Run nginx
CMD ["npm", "run", "dev"]


