import { transporter } from "./mailer";

import { AppointmentConfirmationEmailData } from "@/modules/availability/types/availability";

export const emailService = {
  async sendAppointmentConfirmation(data: AppointmentConfirmationEmailData) {
    const { fullName, email, service, date, time, message } = data;

    const emailSubject = `Appointment Confirmation: ${service}`;
    const emailHtmlContent = `
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>Your appointment has been successfully confirmed!</p>
      <p><strong>Service Details:</strong></p> 
      <ul>
          <li><strong>Service:</strong> ${service}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
      </ul>
      ${message ? `<p><strong>Your Message:</strong> "${message}"</p>` : ""} 
      <p>We look forward to seeing you!</p> 
      <p>Sincerely,<br>Pawfaction</p> 
    `;

    const mailOptions = {
      from: `Pawfaction <${process.env.EMAIL_USER}>`,
      to: email,
      subject: emailSubject,
      html: emailHtmlContent,
      text: emailHtmlContent.replace(/<[^>]*>?/gm, ""),
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
