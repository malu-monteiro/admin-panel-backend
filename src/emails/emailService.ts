import { transporter } from "./mailer";

import {
  emailTemplates,
  AppointmentConfirmationTemplateParams,
} from "./templates";

import { AppointmentConfirmationEmailData } from "@/modules/appointments/types";

export const emailService = {
  async sendAppointmentConfirmation(data: AppointmentConfirmationEmailData) {
    const templateParams: AppointmentConfirmationTemplateParams = {
      fullName: data.fullName,
      service: data.service,
      date: data.date,
      time: data.time,
      message: data.message,
    };

    const { subject, html } =
      emailTemplates.appointmentConfirmation(templateParams);

    const mailOptions = {
      from: `Pawfaction <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: subject,
      html: html,
      text: html.replace(/<[^>]*>?/gm, ""),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(
        "Appointment confirmation email sent successfully:",
        info.messageId
      );
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error sending appointment confirmation email:", error);
      throw new Error("Failed to send appointment confirmation email.");
    }
  },
};
