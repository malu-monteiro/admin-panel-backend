import { WorkingHoursRepository } from "../repositories/workingHours-repository";

export const WorkingHoursService = {
  async getWorkingHours() {
    const workingHours = await WorkingHoursRepository.findLatest();

    if (!workingHours) {
      return WorkingHoursRepository.create("08:00", "18:00");
    }

    return workingHours;
  },

  async updateWorkingHours(startTime: string, endTime: string) {
    const existing = await WorkingHoursRepository.findLatest();

    if (existing) {
      const updated = await WorkingHoursRepository.update(
        existing.id,
        startTime,
        endTime
      );
      return { workingHours: updated, created: false };
    }

    const created = await WorkingHoursRepository.create(startTime, endTime);
    return { workingHours: created, created: true };
  },
};
