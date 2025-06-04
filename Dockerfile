FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./ 

# Install project dependencies
RUN npm install

# Build the TypeScript application to JavaScript
RUN npm run build

# Generate Prisma client and apply database migrations
RUN npx prisma generate
RUN npx prisma migrate deploy

# Copy the rest of the application files (including the 'dist' folder created by 'npm run build')
COPY . .

# Command to start the application in production
CMD ["npm", "run", "dev"]