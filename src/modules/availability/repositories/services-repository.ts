import prisma from "@/prisma";

export const ServiceRepository = {
  getAll() {
    return prisma.service.findMany({ orderBy: { name: "asc" } });
  },

  findByName(name: string) {
    return prisma.service.findFirst({
      where: { name: { equals: name.trim().toLocaleLowerCase() } },
    });
  },

  create(name: string) {
    return prisma.service.create({ data: { name: name.trim() } });
  },

  delete(id: number) {
    return prisma.service.delete({ where: { id } });
  },
};
