import dotenv from "dotenv";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";

import { authenticationRoutes } from "./modules/authentication";
import { availabilityRoutes } from "./modules/availability";
import { appointmentRoutes } from "./modules/appointments/routes";
import { analyticsRoutes } from "./modules/analyctics/routes";

dayjs.extend(utc);
dayjs.extend(timezone);

dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCors, {
  origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "Content-Type", "Authorization", "Accept"],
  exposedHeaders: ["Authorization"],
  credentials: true,
});

fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
  parseOptions: {},
});

fastify.register(authenticationRoutes, { prefix: "/auth" });
fastify.register(availabilityRoutes, { prefix: "/availability" });
fastify.register(appointmentRoutes, { prefix: "/appointments" });
fastify.register(analyticsRoutes, { prefix: "/analytics" });

const start = async () => {
  try {
    await fastify.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });
    console.log(
      `Server running in http://localhost:${process.env.PORT || 3000}`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
