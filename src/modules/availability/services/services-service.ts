import { ServiceRepository } from "../repositories/services-repository";

import { AVAILABILITY_CONSTANTS } from "../constants/availability";

export const ServicesService = {
  async getAll() {
    return ServiceRepository.getAll();
  },

  async create(name: string) {
    const trimmed = name.trim();

    if (trimmed.length < AVAILABILITY_CONSTANTS.MIN_SERVICE_NAME_LENGTH) {
      throw new Error(
        `Service name must have at least ${AVAILABILITY_CONSTANTS.MIN_SERVICE_NAME_LENGTH} characters`
      );
    }

    const serviceExists = await ServiceRepository.findByName(trimmed);

    if (serviceExists) throw new Error("Service already exists");

    return ServiceRepository.create(trimmed);
  },

  async delete(id: number) {
    return ServiceRepository.delete(id);
  },
};
