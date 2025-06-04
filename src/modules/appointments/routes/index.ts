import { FastifyInstance } from "fastify";

import { AppointmentController } from "../controllers";

export async function appointmentRoutes(fastify: FastifyInstance) {
  fastify.post("/appointments", AppointmentController.createAppointment);
}
