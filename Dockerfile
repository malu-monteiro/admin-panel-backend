FROM node:20-alpine

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

# Install project dependencies
COPY package*.json ./
COPY tsconfig.json ./ 

RUN npm install

COPY prisma ./prisma/ 

RUN npx prisma generate

COPY src ./src/

# Build the TypeScript application to JavaScript
RUN npm run build
RUN npm run build:seed

# Generate Prisma client and apply database migrations
RUN npx prisma migrate deploy

# Command to start the application in production
CMD ["npm", "run", "start"]