import { FastifyReply, FastifyRequest } from "fastify";

import { ProfileService } from "../services/profile-service";

import { UpdatePasswordBody, UpdateProfileBody } from "../types";

export const ProfileController = {
  async getMe(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.admin) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const admin = await ProfileService.getProfile(request.admin.id);
      if (!admin) return reply.status(404).send({ error: "Admin not found" });
      reply.send({
        name: admin.name,
        email: admin.email,
      });
    } catch (error) {
      request.log.error("Error fetching user data:", error);
      reply.code(500).send({ error: "Error fetching user data" });
    }
  },

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.admin) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const result = await ProfileService.updateProfile(
        request.admin.id,
        request.body as UpdateProfileBody
      );

      reply.send(result);
    } catch (error) {
      request.log.error("Update profile error:", error);
      reply.code(500).send({ error: "Error updating data" });
    }
  },

  async updatePassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.admin) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      await ProfileService.updatePassword(
        request.admin.id,
        request.body as UpdatePasswordBody
      );

      reply.send({ message: "Password updated successfully" });
    } catch (error) {
      request.log.error("Update password error:", error);
      reply.status(500).send({ error: "Error updating password" });
    }
  },
};
