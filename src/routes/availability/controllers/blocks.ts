import dayjs from "dayjs";
import prisma from "../../../prisma";
import { AVAILABILITY_CONSTANTS } from "../../../constants/availability";

export const BlockController = {
  async getBlocks(startDate: Date, endDate: Date) {
    return prisma.availability.findMany({
      where: { date: { gte: startDate, lte: endDate } },
      include: { blockedSlots: true },
    });
  },

  async createBlock(date: Date, startTime?: string, endTime?: string) {
    const parsedDate = dayjs
      .tz(
        typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD"),
        AVAILABILITY_CONSTANTS.DEFAULT_TIMEZONE
      )
      .startOf("day");

    const existingBlock = await prisma.availability.findUnique({
      where: { date: parsedDate.toDate() },
      include: { blockedSlots: true },
    });

    if (startTime && endTime) {
      if (existingBlock) {
        if (existingBlock.isBlocked) {
          throw new Error("Cannot add time slot to a fully blocked day");
        }

        const overlappingSlot = existingBlock.blockedSlots.some(
          (slot) =>
            (slot.startTime <= startTime && slot.endTime > startTime) ||
            (slot.startTime < endTime && slot.endTime >= endTime) ||
            (startTime <= slot.startTime && endTime >= slot.endTime)
        );

        if (overlappingSlot) {
          throw new Error("Time slot overlaps with an existing blocked slot");
        }

        return prisma.availability.update({
          where: { id: existingBlock.id },
          data: {
            blockedSlots: {
              create: { startTime, endTime },
            },
          },
          include: { blockedSlots: true },
        });
      }

      return prisma.availability.create({
        data: {
          date: parsedDate.toDate(),
          blockedSlots: {
            create: { startTime, endTime },
          },
        },
        include: { blockedSlots: true },
      });
    } else {
      if (existingBlock) {
        return prisma.availability.update({
          where: { id: existingBlock.id },
          data: {
            isBlocked: true,
            blockedSlots: {
              deleteMany: {},
            },
          },
          include: { blockedSlots: true },
        });
      }

      return prisma.availability.create({
        data: {
          date: parsedDate.toDate(),
          isBlocked: true,
        },
        include: { blockedSlots: true },
      });
    }
  },

  async deleteBlock(type: "day" | "slot", id: number) {
    if (type === "day") {
      return prisma.availability.update({
        where: { id },
        data: { isBlocked: false },
      });
    } else {
      return prisma.blockedSlot.delete({ where: { id } });
    }
  },
};
