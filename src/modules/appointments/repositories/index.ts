import prisma from "../../../prisma";

import { Appointment, CreateAppointmentInput } from "../types";

export const AppointmentRepository = {
  async create(data: CreateAppointmentInput): Promise<Appointment> {
    const { service, date, time, name, email, message } = data;

    const parsedDate = new Date(date);

    const newAppointment = await prisma.appointment.create({
      data: {
        service,
        date: parsedDate,
        time,
        name,
        email,
        message: message || null,
      },
    });

    return newAppointment as Appointment;
  },
};
