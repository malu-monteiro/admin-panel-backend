import { FastifyInstance } from "fastify";

import { authRoutes } from "./routes/auth-routes";
import { profileRoutes } from "./routes/profile-routes";

export async function authenticationRoutes(fastify: FastifyInstance) {
  fastify.register(authRoutes);
  fastify.register(profileRoutes);
}
