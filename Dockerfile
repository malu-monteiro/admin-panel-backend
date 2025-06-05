FROM node:20-alpine

WORKDIR /app

# Install project dependencies
COPY package*.json ./
COPY tsconfig.json ./ 
COPY prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY src ./src/



# Build the TypeScript application to JavaScript
RUN npm run build

# Generate Prisma client and apply database migrations
RUN npx prisma migrate deploy

# Command to start the application in production
CMD ["npm", "run", "start"]