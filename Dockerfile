# Step 1: Use an official Node.js image as the base
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy the package files for dependency installation
# (If you have a package.json file)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application source code
COPY . .

# Step 6: Expose the port your app listens on (3000)
EXPOSE 3000

# Step 7: Command to run the application
CMD ["node", "index.js"]
