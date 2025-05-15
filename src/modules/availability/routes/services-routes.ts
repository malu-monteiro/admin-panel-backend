import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { ServiceController } from "../controllers/services-controller";

import { CreateServiceBody, DeleteServiceParams } from "../types/availability";

export async function serviceRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const services = await ServiceController.getAll();
      return services;
    } catch (error) {
      fastify.log.error("Error fetching services:", error);
      return reply.status(500).send({ error: "Failed to load services" });
    }
  });

  fastify.post(
    "/",
    async (
      request: FastifyRequest<{ Body: CreateServiceBody }>,
      reply: FastifyReply
    ) => {
      try {
        const { name } = request.body;
        const service = await ServiceController.create(name);
        return reply.status(201).send(service);
      } catch (error: any) {
        fastify.log.error("Error creating service:", error);
        const status = error.message.includes("already exists") ? 409 : 400;
        return reply.status(status).send({ error: error.message });
      }
    }
  );

  fastify.delete(
    "/:id",
    async (
      request: FastifyRequest<{ Params: DeleteServiceParams }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = request.params;
        const serviceId = parseInt(id, 10);

        if (isNaN(serviceId)) {
          return reply.status(400).send({ error: "Invalid ID" });
        }

        await ServiceController.delete(serviceId);
        return { message: "Service deleted successfully" };
      } catch (error: any) {
        fastify.log.error("Error deleting service:", error);
        return reply.status(500).send({ error: "Error deleting service" });
      }
    }
  );
}
