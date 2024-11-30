export interface Tour {
  id: string;
  name: string;
  description: string;
  content: string;
  capacity: string;
  price: string;
  media: string;
  /** in minutes */
  duration: string;
  /** 1 | 0 */
  active: '1' | '0';
  created_at: string;
  updated_at: string;
}

export interface TourRequest
  extends Omit<Tour, 'id' | 'created_at' | 'updated_at'> {}

export interface TourRequestCreate extends TourRequest {
  dateFrom?: string;
  dateTo?: string;
  startTime?: string;
  endTime?: string;
  weekends?: '1' | '0';
}

export interface Availability {
  dateFrom: string;
  dateTo: string;
}

export interface TourDetail {
  tour: Tour;
  schedules: ScheduleWithAvailable[];
  availability: Availability;
}

export interface Schedule {
  id: string;
  tourId: string;
  date: string;
  startTime: string;
  endTime: string;
  active: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduleWithAvailable extends Schedule {
  available: number;
}
