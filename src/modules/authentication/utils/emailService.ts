import transporter from "./emailTransporter";
import { emailTemplates } from "../../../emails/templates";

const SYSTEM_EMAIL = '"Pawfaction" <no-reply@example.com>';

export const EmailService = {
  async sendPasswordResetEmail(email: string, resetLink: string) {
    const { subject, html } = emailTemplates.passwordReset({ link: resetLink });
    await transporter.sendMail({
      from: SYSTEM_EMAIL,
      to: email,
      subject,
      html,
    });
  },

  async sendEmailVerificationEmail(email: string, verificationLink: string) {
    const { subject, html } = emailTemplates.emailVerification({
      link: verificationLink,
    });
    await transporter.sendMail({
      from: SYSTEM_EMAIL,
      to: email,
      subject,
      html,
    });
  },

  async sendNewEmailVerificationEmail(email: string, verificationLink: string) {
    const { subject, html } = emailTemplates.newEmailVerification({
      link: verificationLink,
    });
    await transporter.sendMail({
      from: SYSTEM_EMAIL,
      to: email,
      subject,
      html,
    });
  },
};
