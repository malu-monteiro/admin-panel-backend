import prisma from "../../../prisma";

export const AuthRepository = {
  findAdminByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  },

  findAdminById(id: number) {
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

  updateAdminPassword(id: number, hashedPassword: string) {
    return prisma.admin.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },

  markResetTokenUsed(id: number) {
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

  updateAdminEmailVerified(id: number, newEmail?: string) {
    const data = newEmail
      ? { email: newEmail, emailVerified: true }
      : { emailVerified: true };
    return prisma.admin.update({ where: { id }, data });
  },

  deleteEmailVerificationToken(id: number) {
    return prisma.emailVerificationToken.delete({ where: { id } });
  },
};
