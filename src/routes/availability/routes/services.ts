import { FastifyInstance } from "fastify";
import { ServiceController } from "../controllers/services";

export async function serviceRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    try {
      return await ServiceController.getAll();
    } catch (error) {
      fastify.log.error("Error fetching services:", error);
      return reply.status(500).send({ error: "Failed to load services" });
    }
  });

  fastify.post("/", async (request, reply) => {
    try {
      const { name } = request.body as any;
      const service = await ServiceController.create(name);
      return reply.status(201).send(service);
    } catch (error: any) {
      fastify.log.error("Error creating service:", error);
      const status = error.message.includes("already exists") ? 409 : 400;
      return reply.status(status).send({ error: error.message });
    }
  });

  fastify.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as any;
      const serviceId = parseInt(id);

      if (isNaN(serviceId))
        return reply.status(400).send({ error: "Invalid ID" });

      await ServiceController.delete(serviceId);
      return { message: "Service deleted successfully" };
    } catch (error: any) {
      fastify.log.error("Error deleting service:", error);
      return reply.status(500).send({ error: "Error deleting service" });
    }
  });
}
