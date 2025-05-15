import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

import { CreateBlockBody } from "../types/availability";

import { BlockRepository } from "../repositories/blocks-repository";

import { AVAILABILITY_CONSTANTS } from "../constants/availability";

dayjs.extend(timezone);

export const BlockService = {
  async getBlocks(startDate: Date, endDate: Date) {
    return BlockRepository.findBlocksBetweenDates(startDate, endDate);
  },

  async createBlock(date: Date, startTime?: string, endTime?: string) {
    const parsedDate = dayjs
      .tz(
        typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD"),
        AVAILABILITY_CONSTANTS.DEFAULT_TIMEZONE
      )
      .startOf("day")
      .toDate();

    const existingBlock = await BlockRepository.findBlockByDate(parsedDate);

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

        return BlockRepository.updateBlockAddSlot(
          existingBlock.id,
          startTime,
          endTime
        );
      }

      return BlockRepository.createBlockWithSlot(
        parsedDate,
        startTime,
        endTime
      );
    } else {
      if (existingBlock) {
        return BlockRepository.updateFullDayBlock(existingBlock.id);
      }

      return BlockRepository.createFullDayBlock(parsedDate);
    }
  },

  async createBlockFromBody(body: CreateBlockBody) {
    const { date, startTime, endTime } = body;
    return this.createBlock(new Date(date), startTime, endTime);
  },

  async deleteBlock(type: "day" | "slot", id: number) {
    if (type === "day") {
      return BlockRepository.unblockDay(id);
    } else {
      return BlockRepository.deleteBlockedSlot(id);
    }
  },
};
