import prisma from "../../../prisma";

export const WorkingHoursController = {
  async getWorkingHours() {
    const workingHours = await prisma.workingHours.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!workingHours) {
      return prisma.workingHours.create({
        data: { startTime: "08:00", endTime: "18:00" },
      });
    }

    return workingHours;
  },

  async updateWorkingHours(startTime: string, endTime: string) {
    const existing = await prisma.workingHours.findFirst();

    if (existing) {
      return prisma.workingHours.update({
        where: { id: existing.id },
        data: { startTime, endTime },
      });
    }

    return prisma.workingHours.create({ data: { startTime, endTime } });
  },
};
