import prisma from "../../../prisma";

export const ProfileRepository = {
  findAdminById(id: string) {
    return prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });
  },

  updateAdminProfile(id: string, data: { name?: string }) {
    return prisma.admin.update({ where: { id }, data });
  },

  findAdminByEmail(id: string) {
    return prisma.admin.findUnique({ where: { id }, select: { email: true } });
  },

  updateAdminPassword(id: string, hashedPassword: string) {
    return prisma.admin.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },
};
