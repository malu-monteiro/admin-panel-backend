import prisma from "@/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getMostBookedServicesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const serviceCounts = await prisma.appointment.groupBy({
      by: ["service"],
      _count: {
        service: true,
      },
      orderBy: {
        _count: {
          service: "desc",
        },
      },
    });

    const formattedData = serviceCounts.map((item) => ({
      name: item.service,
      value: item._count.service,
    }));

    return reply.code(200).send(formattedData);
  } catch (error) {
    console.error("Error fetching most booked services:", error);
    return reply
      .code(500)
      .send({ message: "Failed to fetch services data.", error });
  }
}

export async function getMostBookedTimesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const timeCounts = await prisma.appointment.groupBy({
      by: ["time"],
      _count: {
        time: true,
      },

      orderBy: {
        time: "asc",
      },
    });

    const formattedData = timeCounts.map((item) => ({
      time: item.time,
      appointments: item._count.time,
    }));

    return reply.code(200).send(formattedData);
  } catch (error) {
    console.error("Error fetching most booked times:", error);
    return reply.code(500).send({ message: "Failed to fetch times data." });
  }
}
