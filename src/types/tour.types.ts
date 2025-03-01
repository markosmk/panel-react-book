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
  translations?: Translation[];
}

export interface Translation {
  id?: number;
  toud_id?: number;
  language: string;
  name: string;
  description: string;
  content: string;
}

export interface TranslationRequest {
  en: { name?: string; description?: string; content?: string };
  pt: { name?: string; description?: string; content?: string };
}

export interface TourRequest
  extends Omit<Tour, 'id' | 'created_at' | 'updated_at'> {}

export interface Availability {
  dateFrom: string;
  dateTo: string;
}

export interface TourDetail {
  tour: Tour;
  schedules: ScheduleWithAvailable[];
  // TODO: remover de la aPI availability, ya no lo mostraremos mas
  availability: Availability;
}

export interface Schedule {
  id: string;
  tourId: string;
  date: string;
  startTime: string;
  endTime?: string | null;
  active: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduleWithAvailable extends Schedule {
  available: number;
}
