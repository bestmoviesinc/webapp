# Use an official Node.js runtime as a parent image
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the entire project directory
COPY . .

# Build the Angular app
RUN npm run build --prod

# Use an official NGINX image as the base for serving the app
FROM nginx:alpine

# Copy the built Angular app from the previous stage
COPY --from=build /app/dist/bestmoviesinc /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 4200

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]