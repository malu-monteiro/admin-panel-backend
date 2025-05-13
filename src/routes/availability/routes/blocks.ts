import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { FastifyInstance } from "fastify";
import { BlockController } from "../controllers/blocks";
import { AVAILABILITY_CONSTANTS } from "../../../constants/availability";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function blockRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    try {
      const { startDate, endDate } = request.query as any;

      if (!startDate || !endDate) {
        return reply
          .status(400)
          .send({ error: "Both startDate and endDate are required" });
      }

      const parsedStart = dayjs
        .tz(startDate, "YYYY-MM-DD", AVAILABILITY_CONSTANTS.DEFAULT_TIMEZONE)
        .toDate();
      const parsedEnd = dayjs
        .tz(endDate, "YYYY-MM-DD", AVAILABILITY_CONSTANTS.DEFAULT_TIMEZONE)
        .toDate();

      const blocks = await BlockController.getBlocks(parsedStart, parsedEnd);
      return blocks.map((block) => ({
        ...block,
        date: block.date.toISOString(),
        blockedSlots: block.blockedSlots.map((slot) => ({
          ...slot,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      }));
    } catch (error) {
      fastify.log.error("Error fetching blocks:", error);
      return reply.status(500).send({ error: "Error fetching blocks" });
    }
  });

  fastify.post("/", async (request, reply) => {
    try {
      const { date, startTime, endTime } = request.body as any;
      const result = await BlockController.createBlock(
        new Date(date),
        startTime,
        endTime
      );
      return reply.status(201).send(result);
    } catch (error) {
      fastify.log.error("Error creating block:", error);
      return reply.status(500).send({ error: "Error creating block" });
    }
  });

  fastify.delete("/:type/:id", async (request, reply) => {
    try {
      const { type, id } = request.params as any;
      const parsedId = parseInt(id);

      if (isNaN(parsedId))
        return reply.status(400).send({ error: "Invalid ID" });

      await BlockController.deleteBlock(type, parsedId);
      return { message: "Block removed successfully" };
    } catch (error) {
      fastify.log.error("Error removing block:", error);
      return reply.status(500).send({ error: "Error removing block" });
    }
  });
}
