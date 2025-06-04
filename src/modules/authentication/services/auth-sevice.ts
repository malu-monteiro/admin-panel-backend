import jwt from "jsonwebtoken";

import {
  LoginBody,
  JwtPayload,
  ForgotPasswordBody,
  ResetPasswordBody,
  VerifyEmailBody,
} from "../types";

import prisma from "../../../prisma";

import { compare, hash } from "bcryptjs";

import { AuthRepository } from "../repositories/auth-repository";

import { EmailService } from "../utils/emailService";
import { generateResetToken } from "../utils/passwordReset";
import { PasswordValidator } from "../utils/passwordValidator";
import { generateEmailVerificationToken } from "../utils/emailVerification";

const JWT_SECRET = process.env.JWT_SECRET!;

export const AuthService = {
  async signIn({ email, password }: LoginBody) {
    const admin = await AuthRepository.findAdminByEmail(email);

    if (!admin || !(await compare(password, admin.password))) {
      throw new Error("Invalid credentials");
    }

    const accessToken = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken, admin };
  },

  async refreshToken(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;
    const admin = await AuthRepository.findAdminById(decoded.adminId);

    if (!admin) throw new Error("Admin not found");

    return jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: "15m" });
  },

  async forgotPassword({ email }: ForgotPasswordBody) {
    const admin = await AuthRepository.findAdminByEmailSelective(email);

    if (!admin) return;

    const { token } = await generateResetToken(admin.id);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await EmailService.sendPasswordResetEmail(email, resetLink);
  },

  async resetPassword({ token, newPassword }: ResetPasswordBody) {
    if (!token) throw new Error("Missing token");

    PasswordValidator.validateOrThrow(newPassword);

    const resetToken = await AuthRepository.findPasswordResetToken(token);
    if (!resetToken || resetToken.used) throw new Error("Invalid token");
    if (resetToken.expiresAt < new Date()) throw new Error("Expired token");

    const hashedPassword = await hash(newPassword, 10);
    await prisma.$transaction([
      AuthRepository.updateAdminPassword(resetToken.adminId, hashedPassword),
      AuthRepository.markResetTokenUsed(resetToken.id),
    ]);
  },

  async sendVerificationEmail(adminId: number) {
    const admin = await AuthRepository.findAdminById(adminId);

    if (!admin) throw new Error("Admin not found");
    if (admin.emailVerified) throw new Error("Email already verified");

    const { token } = await generateEmailVerificationToken(adminId);
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await EmailService.sendEmailVerificationEmail(
      admin.email,
      verificationLink
    );
  },

  async verifyEmail({ token }: VerifyEmailBody) {
    const verificationToken = await AuthRepository.findEmailVerificationToken(
      token
    );

    if (!verificationToken) throw new Error("Invalid token");

    if (verificationToken.expiresAt < new Date())
      throw new Error("Expired token");

    await prisma.$transaction(async (tx) => {
      if (verificationToken.newEmail) {
        await tx.admin.update({
          where: { id: verificationToken.adminId },
          data: {
            email: verificationToken.newEmail,
            emailVerified: true,
          },
        });
      } else {
        await tx.admin.update({
          where: { id: verificationToken.adminId },
          data: { emailVerified: true },
        });
      }

      await tx.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
    });

    return verificationToken.newEmail || null;
  },
};
