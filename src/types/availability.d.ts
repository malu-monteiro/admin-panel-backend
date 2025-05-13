export interface WorkingHours {
  startTime: string;
  endTime: string;
}

export interface Service {
  id?: number;
  name: string;
}

export interface BlockRequest {
  date: string;
  startTime?: string;
  endTime?: string;
}
