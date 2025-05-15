import { ServicesService } from "../services/services-service";

export const ServiceController = {
  getAll: ServicesService.getAll,
  create: ServicesService.create,
  delete: ServicesService.delete,
};
