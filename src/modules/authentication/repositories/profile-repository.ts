import prisma from "@/prisma";

import { UpdateProfileBody } from "../types/authentication";

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

  updateAdminProfile(id: string, data: UpdateProfileBody) {
    return prisma.admin.update({ where: { id }, data });
  },

  findAdminByEmail(email: string) {
    return prisma.admin.findUnique({
      where: { email },
      select: { email: true },
    });
  },

  updateAdminPassword(id: string, hashedPassword: string) {
    return prisma.admin.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },
};
