import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { UpdateWorkingHoursBody } from "../types/availability";
import { AVAILABILITY_CONSTANTS } from "../constants/availability";

import { WorkingHoursController } from "../controllers/workingHours-controller";

function validateWorkingHours(
  startTime: string,
  endTime: string
): string | null {
  if (
    !AVAILABILITY_CONSTANTS.TIME_REGEX.test(startTime) ||
    !AVAILABILITY_CONSTANTS.TIME_REGEX.test(endTime)
  ) {
    return "Invalid time format. Use HH:00";
  }

  if (startTime >= endTime) {
    return "Opening time must be before closing time";
  }

  return null;
}

export async function workingHoursRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const workingHours = await WorkingHoursController.getWorkingHours();
      return reply.status(200).send(workingHours);
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

        const validationError = validateWorkingHours(startTime, endTime);
        if (validationError) {
          return reply.status(400).send({ error: validationError });
        }

        const { workingHours, created } =
          await WorkingHoursController.updateWorkingHours(startTime, endTime);

        const statusCode = created ? 201 : 200;

        return reply.status(statusCode).send(workingHours);
      } catch (error) {
        fastify.log.error("Error saving working hours:", error);
        return reply.status(500).send({ error: "Error saving working hours" });
      }
    }
  );

  fastify.put<{ Params: { id: string }; Body: UpdateWorkingHoursBody }>(
    "/:id",
    async (request, reply) => {
      const { id } = request.params;
      const { startTime, endTime } = request.body;

      const validationError = validateWorkingHours(startTime, endTime);
      if (validationError) {
        return reply.status(400).send({ error: validationError });
      }

      try {
        const updated = await WorkingHoursController.updateWorkingHoursById(
          Number(id),
          startTime,
          endTime
        );
        return reply.status(200).send(updated);
      } catch (error) {
        request.log.error("Error updating working hours:", error);
        return reply
          .status(500)
          .send({ error: "Error updating working hours" });
      }
    }
  );
}
