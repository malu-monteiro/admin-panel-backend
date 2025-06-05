import prisma from "../../../prisma";

export const WorkingHoursRepository = {
  findLatest() {
    return prisma.workingHours.findFirst({
      orderBy: { createdAt: "desc" },
    });
  },

  create(startTime: string, endTime: string) {
    return prisma.workingHours.create({
      data: { startTime, endTime },
    });
  },

  update(id: number, startTime: string, endTime: string) {
    return prisma.workingHours.update({
      where: { id },
      data: { startTime, endTime },
    });
  },
};
