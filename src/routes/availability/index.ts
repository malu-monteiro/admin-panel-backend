import { FastifyInstance } from "fastify";
import { workingHoursRoutes } from "./routes/workingHours";
import { serviceRoutes } from "./routes/services";
import { blockRoutes } from "./routes/blocks";

export async function availabilityRoutes(fastify: FastifyInstance) {
  fastify.register(async (instance: FastifyInstance) => {
    instance.register(workingHoursRoutes, { prefix: "/working-hours" });
    instance.register(serviceRoutes, { prefix: "/services" });
    instance.register(blockRoutes, { prefix: "/blocks" });
  });
}
