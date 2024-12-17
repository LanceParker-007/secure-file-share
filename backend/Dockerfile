# Use an official Node.js runtime as a parent image
FROM node:20.9.0

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app will run on (default port for Express is 5000)
EXPOSE 5000

# Run the app
CMD ["npm", "start"]
