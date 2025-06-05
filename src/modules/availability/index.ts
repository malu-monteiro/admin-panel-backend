import { FastifyInstance } from "fastify";

import { workingHoursRoutes } from "./routes/working-hours-routes";
import { serviceRoutes } from "./routes/services-routes";
import { blockRoutes } from "./routes/blocks-routes";

export async function availabilityRoutes(fastify: FastifyInstance) {
  fastify.register(workingHoursRoutes, { prefix: "/working-hours" });
  fastify.register(serviceRoutes, { prefix: "/services" });
  fastify.register(blockRoutes, { prefix: "/blocks" });
}
