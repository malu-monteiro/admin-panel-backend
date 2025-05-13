import { AVAILABILITY_CONSTANTS } from "../../../constants/availability";
import prisma from "../../../prisma";

export const ServiceController = {
  async getAll() {
    return prisma.service.findMany({ orderBy: { name: "asc" } });
  },

  async create(name: string) {
    if (name.trim().length < AVAILABILITY_CONSTANTS.MIN_SERVICE_NAME_LENGTH) {
      throw new Error(
        `Service name must have at least ${AVAILABILITY_CONSTANTS.MIN_SERVICE_NAME_LENGTH} characters`
      );
    }

    const existing = await prisma.service.findFirst({
      where: { name: { equals: name.trim().toLocaleLowerCase() } },
    });

    if (existing) throw new Error("Service already exists");

    return prisma.service.create({ data: { name: name.trim() } });
  },

  async delete(id: number) {
    return prisma.service.delete({ where: { id } });
  },
};
