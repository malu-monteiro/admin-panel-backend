FROM node:20-alpine

WORKDIR /app

# Install project dependencies
COPY package*.json ./
COPY tsconfig.json ./ 

COPY prisma ./prisma/
COPY src ./src/

RUN npm install

# Build the TypeScript application to JavaScript
RUN npm run build

# Generate Prisma client and apply database migrations
RUN npx prisma generate
RUN npx prisma migrate deploy

# Command to start the application in production
CMD ["npm", "run", "start"]