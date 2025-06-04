import { FastifyInstance } from "fastify";

import {
  getMostBookedServicesHandler,
  getMostBookedTimesHandler,
} from "../controllers";

export async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.get("/most-booked-services", getMostBookedServicesHandler);

  fastify.get("/most-booked-times", getMostBookedTimesHandler);
}
