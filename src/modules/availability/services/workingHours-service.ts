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
      return WorkingHoursRepository.update(existing.id, startTime, endTime);
    }

    return WorkingHoursRepository.create(startTime, endTime);
  },
};
