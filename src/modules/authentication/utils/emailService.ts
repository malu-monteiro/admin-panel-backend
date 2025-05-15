import transporter from "./emailTransporter";

import { EmailTemplateParams } from "../types/authentication";

const SYSTEM_EMAIL = '"Pawfaction" <no-reply@example.com>';

const emailTemplates = {
  passwordReset: ({ link }: EmailTemplateParams) => ({
    subject: "Password Reset",
    html: `<p>Click on the link to reset your password: <a href="${link}">${link}</a></p>`,
  }),

  emailVerification: ({ link }: EmailTemplateParams) => ({
    subject: "Verify your email",
    html: `<p>Click here to verify: <a href="${link}">${link}</a></p>`,
  }),

  newEmailVerification: ({ link }: EmailTemplateParams) => ({
    subject: "Verify your new email",
    html: `<p>Click to verify: <a href="${link}">${link}</a></p>`,
  }),
};

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
