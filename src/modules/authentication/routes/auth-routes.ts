import { FastifyInstance } from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";

import { authenticate } from "../middlewares/auth-middleware";

import { AuthController } from "../controllers/auth-controller";

const rateLimitConfig = {
  login: { max: 5, timeWindow: "5 minutes" },
  passwordReset: { max: 3, timeWindow: "1 hour" },
};

export async function authRoutes(fastify: FastifyInstance) {
  await fastify.register(fastifyRateLimit, {
    global: false,
    allowList: process.env.NODE_ENV === "test" ? [] : ["127.0.0.1"],
    keyGenerator: (req) => req.headers["x-forwarded-for"]?.toString() || req.ip,
  });

  fastify.decorateRequest("admin");

  fastify.post("/sign-in", {
    config: { rateLimit: rateLimitConfig.login },
    handler: AuthController.signIn,
  });

  fastify.post("/refresh-token", AuthController.refreshToken);
  fastify.post("/forgot-password", {
    config: { rateLimit: rateLimitConfig.passwordReset },
    handler: AuthController.forgotPassword,
  });

  fastify.post("/reset-password", AuthController.resetPassword);
  fastify.post("/send-verification-email", {
    preHandler: authenticate,
    handler: AuthController.sendVerificationEmail,
  });

  fastify.post("/verify-email", AuthController.verifyEmail);
}
