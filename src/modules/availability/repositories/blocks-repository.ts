import prisma from "@/prisma";

export const BlockRepository = {
  findBlocksBetweenDates(startDate: Date, endDate: Date) {
    return prisma.availability.findMany({
      where: { date: { gte: startDate, lte: endDate } },
      include: { blockedSlots: true },
    });
  },

  findBlockByDate(date: Date) {
    return prisma.availability.findUnique({
      where: { date },
      include: { blockedSlots: true },
    });
  },

  createBlockWithSlot(date: Date, startTime: string, endTime: string) {
    return prisma.availability.create({
      data: {
        date,
        blockedSlots: { create: { startTime, endTime } },
      },
      include: { blockedSlots: true },
    });
  },

  updateBlockAddSlot(id: number, startTime: string, endTime: string) {
    return prisma.availability.update({
      where: { id },
      data: {
        blockedSlots: { create: { startTime, endTime } },
      },
      include: { blockedSlots: true },
    });
  },

  createFullDayBlock(date: Date) {
    return prisma.availability.create({
      data: { date, isBlocked: true },
      include: { blockedSlots: true },
    });
  },

  updateFullDayBlock(id: number) {
    return prisma.availability.update({
      where: { id },
      data: {
        isBlocked: true,
        blockedSlots: { deleteMany: {} },
      },
      include: { blockedSlots: true },
    });
  },

  unblockDay(id: number) {
    return prisma.availability.update({
      where: { id },
      data: { isBlocked: false },
    });
  },

  deleteBlockedSlot(id: number) {
    return prisma.blockedSlot.delete({ where: { id } });
  },
};
