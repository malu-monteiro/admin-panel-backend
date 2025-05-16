import prisma from "@/prisma";

export const AuthRepository = {
  findAdminByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  },

  findAdminById(id: string) {
    return prisma.admin.findUnique({ where: { id } });
  },

  findAdminByEmailSelective(email: string) {
    return prisma.admin.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });
  },

  findPasswordResetToken(token: string) {
    return prisma.passwordResetToken.findUnique({
      where: { token },
      include: { admin: true },
    });
  },

  updateAdminPassword(id: string, hashedPassword: string) {
    return prisma.admin.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },

  markResetTokenUsed(id: string) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { used: true },
    });
  },

  findEmailVerificationToken(token: string) {
    return prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { admin: true },
    });
  },

  updateAdminEmailVerified(id: string, newEmail?: string) {
    const data = newEmail
      ? { email: newEmail, emailVerified: true }
      : { emailVerified: true };
    return prisma.admin.update({ where: { id }, data });
  },

  deleteEmailVerificationToken(id: string) {
    return prisma.emailVerificationToken.delete({ where: { id } });
  },
};
