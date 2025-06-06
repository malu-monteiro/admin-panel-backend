<h1 align="center">
Admin Panel Backend
</h1>

<div align="center">
Backend for an online scheduling system, developed with Node.js, Fastify, Prisma, and PostgreSQL.
</div>
<br>
<p align="center">

<img src="https://img.shields.io/badge/Node.js-22.14.1-339933?style=for-the-badge&logo=nodedotjs&logoColor=339933" alt="Node.js" />
<img src="https://img.shields.io/badge/Fastify-5.2.1-000000?style=for-the-badge&logo=fastify&logoColor=000000" alt="Fastify" />
<img src="https://img.shields.io/badge/Prisma-6.4.1-2D3748?style=for-the-badge&logo=prisma&logoColor=2D3748" alt="Prisma" />
<img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=4169E1" alt="PostgreSQL" /> 
</p>


---

## Table of Contents

- [✅ Prerequisites](#-prerequisites)  
- [📥 Installation](#-installation)  
- [🚀 Running the Application](#-running-the-application)  
- [💾 Database Management](#-database-management)
- [🔧 Environment Variables](#-environment-variables)  
- [💻 Technologies Used](#-technologies-used)  

---

## ✅ Prerequisites

Before you begin, make sure you have installed:

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)  
- [npm](https://www.npmjs.com/get-npm) (Node package manager)  
- [PostgreSQL](https://www.postgresql.org/download/) (version 12 or higher recommended)
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) (optional, for containerized running)

---

## 📥 Installation

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
Important: Make sure your `DATABASE_URL` in the `.env` file is set up correctly for PostgreSQL, e.g., `DATABASE_URL="postgresql://user:password@host:port/database"`.

4. Run Prisma migrations to create the PostgreSQL database schema:
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

## 🚀 Running the Application

By default, the backend will be available at:

http://localhost:3000

---

## 💾 Database Management
Prisma Studio (to visually browse and edit your database), run:

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

## 🔧 Environment Variables

Create a `.env` file in the backend root directory based on `.env.example` with the following variables:
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/your_database_name?schema=public"
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.example.com
EMAIL_PORT=465
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

- `NODE_ENV`: Environment (development, production)  
- `PORT`: Port where the backend will run  
- `DATABASE_URL`: Connection string for your PostgreSQL database
- `JWT_SECRET`: Secret key for JWT authentication  
- `FRONTEND_URL`: Frontend URL for CORS and redirects  
- `EMAIL_HOST`: SMTP host for sending emails  
- `EMAIL_PORT`: SMTP port  
- `EMAIL_USER`: SMTP user (email address)  
- `EMAIL_PASSWORD`: SMTP password  

---

## 💻 Technologies Used

- [Node.js](https://nodejs.org/)  
- [Fastify](https://www.fastify.io/)  
- [Prisma](https://www.prisma.io/)  
- [PostgreSQL](https://www.postgresql.org/)  
- [Docker](https://www.docker.com/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Nodemailer](https://nodemailer.com/)  

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. 😊

---

Made with 💜 by [malu-monteiro](https://github.com/malu-monteiro) | [Linkedin](https://www.linkedin.com/in/m-monteiro/)






