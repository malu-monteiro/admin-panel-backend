import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { BlockController } from "../controllers/blocks-controller";
import {
  CreateBlockBody,
  DeleteBlockParams,
  GetBlocksQuery,
} from "../types/availability";

import { SYSTEM_TIMEZONE } from "../constants/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function blockRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    async (
      request: FastifyRequest<{ Querystring: GetBlocksQuery }>,
      reply: FastifyReply
    ) => {
      try {
        const { startDate, endDate } = request.query;

        if (!startDate || !endDate) {
          return reply.status(400).send({
            error: "Both startDate and endDate are required",
          });
        }

        const parsedStart = dayjs
          .tz(startDate, "YYYY-MM-DD", SYSTEM_TIMEZONE)
          .toDate();
        const parsedEnd = dayjs
          .tz(endDate, "YYYY-MM-DD", SYSTEM_TIMEZONE)
          .toDate();

        const blocks = await BlockController.getBlocks(parsedStart, parsedEnd);

        return blocks.map((block) => ({
          ...block,
          date: dayjs(block.date).tz(SYSTEM_TIMEZONE).toISOString(),
        }));
      } catch (error) {
        fastify.log.error("Error fetching blocks:", error);
        return reply.status(500).send({ error: "Error fetching blocks" });
      }
    }
  );

  fastify.post(
    "/",
    async (
      request: FastifyRequest<{ Body: CreateBlockBody }>,
      reply: FastifyReply
    ) => {
      try {
        const result = await BlockController.createBlock(request.body);
        return reply.status(201).send(result);
      } catch (error: any) {
        fastify.log.error("Error creating block:", error);
        return reply.status(400).send({
          error: error.message || "Error creating block",
        });
      }
    }
  );

  fastify.delete(
    "/:type/:id",
    async (
      request: FastifyRequest<{ Params: DeleteBlockParams }>,
      reply: FastifyReply
    ) => {
      try {
        const { type, id } = request.params;
        const parsedId = parseInt(id);

        if (isNaN(parsedId)) {
          return reply.status(400).send({ error: "Invalid ID" });
        }

        await BlockController.deleteBlock(type as "day" | "slot", parsedId);
        return { message: "Block removed successfully" };
      } catch (error) {
        fastify.log.error("Error removing block:", error);
        return reply.status(500).send({ error: "Error removing block" });
      }
    }
  );
}
