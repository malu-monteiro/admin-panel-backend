import { compare, hash } from "bcryptjs";

import { EmailService } from "../utils/emailService";
import { PasswordValidator } from "../utils/passwordValidator";
import { generateEmailVerificationToken } from "../utils/emailVerification";

import { ProfileRepository } from "../repositories/profile-repository";

import { UpdateProfileBody, UpdatePasswordBody } from "../types/authentication";

export const ProfileService = {
  async getProfile(adminId: string) {
    return ProfileRepository.findAdminById(adminId);
  },

  async updateProfile(
    adminId: string,
    { email: newEmail, name }: UpdateProfileBody
  ) {
    let requiresVerification = false;

    if (newEmail) {
      const admin = await ProfileRepository.findAdminByEmail(adminId);
      if (admin?.email !== newEmail) {
        const { token } = await generateEmailVerificationToken(
          adminId,
          newEmail
        );
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        await EmailService.sendNewEmailVerificationEmail(
          newEmail,
          verificationLink
        );
        requiresVerification = true;
      }
    }

    const updatedAdmin = await ProfileRepository.updateAdminProfile(adminId, {
      name,
    });

    return {
      ...updatedAdmin,
      message: requiresVerification
        ? "Verification email sent to new address"
        : "Data updated successfully",
      requiresVerification,
    };
  },

  async updatePassword(
    adminId: string,
    { currentPassword, newPassword }: UpdatePasswordBody
  ) {
    const admin = await ProfileRepository.findAdminById(adminId);
    if (!admin || !(await compare(currentPassword, admin.password))) {
      throw new Error("Current password is incorrect");
    }

    // Validar a nova senha
    PasswordValidator.validateOrThrow(newPassword);

    const hashedPassword = await hash(newPassword, 10);
    await ProfileRepository.updateAdminPassword(adminId, hashedPassword);
  },
};
