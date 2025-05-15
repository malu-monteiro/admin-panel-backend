import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { UpdateWorkingHoursBody } from "../types/availability";
import { AVAILABILITY_CONSTANTS } from "../constants/availability";

import { WorkingHoursController } from "../controllers/workingHours-controller";

export async function workingHoursRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const workingHours = await WorkingHoursController.getWorkingHours();
      return workingHours;
    } catch (error) {
      fastify.log.error("Error fetching working hours:", error);
      return reply.status(500).send({ error: "Error fetching working hours" });
    }
  });

  fastify.post(
    "/",
    async (
      request: FastifyRequest<{ Body: UpdateWorkingHoursBody }>,
      reply: FastifyReply
    ) => {
      try {
        const { startTime, endTime } = request.body;

        if (
          !AVAILABILITY_CONSTANTS.TIME_REGEX.test(startTime) ||
          !AVAILABILITY_CONSTANTS.TIME_REGEX.test(endTime)
        ) {
          return reply
            .status(400)
            .send({ error: "Invalid time format. Use HH:00" });
        }

        if (startTime >= endTime) {
          return reply
            .status(400)
            .send({ error: "Opening time must be before closing time" });
        }

        const result = await WorkingHoursController.updateWorkingHours(
          startTime,
          endTime
        );

        return reply.status(result.id ? 200 : 201).send(result);
      } catch (error) {
        fastify.log.error("Error saving working hours:", error);
        return reply.status(500).send({ error: "Error saving working hours" });
      }
    }
  );
}
