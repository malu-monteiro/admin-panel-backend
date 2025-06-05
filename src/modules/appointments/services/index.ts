import { emailService } from "../../../emails/emailService";

import { AppointmentRepository } from "../repositories";

import { Appointment, CreateAppointmentInput } from "../types";

export const AppointmentService = {
  async scheduleAppointment(
    data: CreateAppointmentInput
  ): Promise<Appointment> {
    let newAppointment: Appointment;
    try {
      newAppointment = await AppointmentRepository.create(data);
      console.log("Appointment saved to DB:", newAppointment.id);
    } catch (dbError) {
      console.error("Error saving appointment to DB:", dbError);
      throw new Error("Failed to save appointment to the database.");
    }

    try {
      await emailService.sendAppointmentConfirmation({
        fullName: data.name,
        email: data.email,
        service: data.service,
        date: data.date,
        time: data.time,
        message: data.message,
      });
      console.log("Confirmation email sent successfully to:", data.email);
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);

      throw new Error(
        "Failed to send appointment confirmation email after saving."
      );
    }

    return newAppointment;
  },
};
