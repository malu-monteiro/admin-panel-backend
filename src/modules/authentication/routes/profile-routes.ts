import { FastifyInstance } from "fastify";

import { authenticate } from "../middlewares/auth-middleware";

import { ProfileController } from "../controllers/profile-controller";

export async function profileRoutes(fastify: FastifyInstance) {
  fastify.get("/me", { preHandler: authenticate }, ProfileController.getMe);

  fastify.patch(
    "/update",
    { preHandler: authenticate },
    ProfileController.updateProfile
  );

  fastify.patch(
    "/update-password",
    { preHandler: authenticate },
    ProfileController.updatePassword
  );
}
