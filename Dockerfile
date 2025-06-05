FROM node:20-alpine

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./ 

# Install project dependencies
RUN npm install

COPY src ./src/
COPY prisma ./prisma/ 

# Build the TypeScript application to JavaScript
RUN npm run build
RUN npm run build:seed

# Generate Prisma client and apply database migrations
RUN npx prisma generate
RUN npx prisma migrate deploy

# Command to start the application in production
CMD ["npm", "run", "start"]