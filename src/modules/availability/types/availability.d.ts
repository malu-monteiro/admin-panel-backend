export interface CreateWorkingHoursBody {
  startTime: string;
  endTime: string;
}

export interface UpdateWorkingHoursBody {
  startTime: string;
  endTime: string;
}

export interface CreateBlockBody {
  date: string;
  startTime?: string;
  endTime?: string;
}
export interface GetBlocksQuery {
  startDate: string;
  endDate: string;
}

export interface DeleteBlockParams {
  type: "day" | "slot";
  id: string;
}

export interface CreateServiceBody {
  name: string;
}

export interface DeleteServiceParams {
  id: string;
}
