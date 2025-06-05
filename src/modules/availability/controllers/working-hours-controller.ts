import { WorkingHoursService } from "../services/workingHours-service";

export const WorkingHoursController = {
  getWorkingHours: WorkingHoursService.getWorkingHours,
  updateWorkingHours: WorkingHoursService.updateWorkingHours,
  updateWorkingHoursById: WorkingHoursService.updateWorkingHoursById,
};
