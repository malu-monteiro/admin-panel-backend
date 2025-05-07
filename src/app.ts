import dotenv from "dotenv";

import Fastify from "fastify";
import fastifyCors from "@fastify/cors";

import { authRoutes } from "./routes/authRoutes";
import { availabilityRoutes } from "./routes/availabilityRoutes";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCors, {
  origin:
    process.env.NODE_ENV === "development" ? true : [process.env.FRONTEND_URL!],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
  exposedHeaders: ["Authorization"],
  credentials: true,
});

fastify.register(authRoutes, { prefix: "/api" });
fastify.register(availabilityRoutes, { prefix: "/api" });

const start = async () => {
  try {
    await fastify.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });
    console.log(
      `Servidor rodando em http://localhost:${process.env.PORT || 3000}`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
