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

export interface Availability {
  dateFrom: string;
  dateTo: string;
}

export interface TourDetail {
  tour: Tour;
  schedules: Schedule & { available: number }[];
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
