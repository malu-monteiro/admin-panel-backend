import { FastifyInstance } from "fastify";
import { WorkingHoursController } from "../controllers/workingHours";
import { AVAILABILITY_CONSTANTS } from "../../../constants/availability";

export async function workingHoursRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    try {
      return await WorkingHoursController.getWorkingHours();
    } catch (error) {
      fastify.log.error("Error fetching working hours:", error);
      return reply.status(500).send({ error: "Error fetching working hours" });
    }
  });

  fastify.post("/", async (request, reply) => {
    try {
      const { startTime, endTime } = request.body as any;

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
  });
}
