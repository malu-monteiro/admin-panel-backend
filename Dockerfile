FROM node:20-alpine

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./ 
COPY prisma ./prisma/

# Install project dependencies
RUN npm install

# Build the TypeScript application to JavaScript
RUN npm run build
RUN npm run build:seed

# Generate Prisma client and apply database migrations
RUN npx prisma generate
RUN npx prisma migrate deploy

# Copy the rest of the application files (including the 'dist' folder created by 'npm run build')
COPY . .

# Command to start the application in production
CMD ["npm", "run", "start"]