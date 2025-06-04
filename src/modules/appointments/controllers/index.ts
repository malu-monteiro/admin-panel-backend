import { AppointmentService } from "../services";

import { CreateAppointmentInput } from "../types";

import { FastifyReply, FastifyRequest } from "fastify";

export const AppointmentController = {
  async createAppointment(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as CreateAppointmentInput;

    try {
      const newAppointment = await AppointmentService.scheduleAppointment(data);

      reply.status(201).send({
        success: true,
        message: "Appointment successfully scheduled and confirmed via email!",
        appointmentId: newAppointment.id,
      });
    } catch (error: any) {
      request.log.error("Error during appointment creation:", error);

      reply.status(500).send({
        success: false,
        message:
          error.message || "An unexpected error occurred during scheduling.",
      });
    }
  },
};
