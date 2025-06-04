export interface AppointmentConfirmationEmailData {
  fullName: string;
  email: string;
  service: string;
  date: string;
  time: string;
  message?: string;
}

export interface CreateAppointmentInput {
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  message?: string;
}

export interface Appointment {
  id: string;
  service: string;
  date: Date;
  time: string;
  name: string;
  email: string;
  message: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentConfirmationTemplateParams {
  fullName: string;
  service: string;
  date: string;
  time: string;
  message?: string;
}
