# Admin Panel Backend

Backend for an online scheduling system, developed with Node.js, Fastify, Prisma, and SQLite.

![Node.js](https://img.shields.io/badge/Nodejs-white?style=for-the-badge&logo=nodedotjs&logoColor=black)
![Fastify](https://img.shields.io/badge/Fastify-white?style=for-the-badge&logo=fastify&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-white?style=for-the-badge&logo=prisma&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-white?style=for-the-badge&logo=sqlite&logoColor=black)


---

## Table of Contents

- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Running the Application](#running-the-application)  
- [Database Management](#database-management)  
- [Environment Variables](#environment-variables)  
- [Technologies Used](#technologies-used)  

---

## Prerequisites

Before you begin, make sure you have installed:

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)  
- [npm](https://www.npmjs.com/get-npm) (Node package manager)  
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) (optional, for containerized running)

---

## Installation

### Option 1: Running Locally (without Docker)

1. Clone the repository:
```bash
git clone https://github.com/malu-monteiro/admin-panel-backend.git
cd admin-panel-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend root directory by copying the example file and filling in your values:
```bash
cp .env.example .env
```

4. Run Prisma migrations to create the SQLite database:
```bash
npx prisma migrate dev --name init
```

5. Start the server in development mode:
```bash
npm run dev
```

---

### Option 2: Running with Docker

1. Clone the repository:
```bash
git clone https://github.com/malu-monteiro/admin-panel-backend.git
cd admin-panel-backend
```

2. Build and start the Docker container:
```bash
npm run docker:build
```

3. To stop the container:
```bash
npm run docker:down
```

---

## Running the Application

By default, the backend will be available at:

http://localhost:3000

---

## Database Management
Prisma Studio
To visually browse and edit your database, run:

```bash
npx prisma studio
```
This opens a web-based GUI where you can easily view and modify your data.

Seeding the Database
To populate the database with initial data, run the seed script:
```bash
npx ts-node seed.ts
```

---

## Environment Variables

Create a `.env` file in the backend root directory based on `.env.example` with the following variables:
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.example.com
EMAIL_PORT=465
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

- `NODE_ENV`: Environment (development, production)  
- `PORT`: Port where the backend will run  
- `DATABASE_URL`: Path to the SQLite database  
- `JWT_SECRET`: Secret key for JWT authentication  
- `FRONTEND_URL`: Frontend URL for CORS and redirects  
- `EMAIL_HOST`: SMTP host for sending emails  
- `EMAIL_PORT`: SMTP port  
- `EMAIL_USER`: SMTP user (email address)  
- `EMAIL_PASSWORD`: SMTP password  

---

## Technologies Used

- [Node.js](https://nodejs.org/)  
- [Fastify](https://www.fastify.io/)  
- [Prisma](https://www.prisma.io/)  
- [SQLite](https://www.sqlite.org/index.html)  
- [Docker](https://www.docker.com/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Nodemailer](https://nodemailer.com/)  

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. 😊

---

Made with 💜 by [malu-monteiro](https://github.com/malu-monteiro)







