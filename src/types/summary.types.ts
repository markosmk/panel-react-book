import { Status } from './booking.types';

export interface ScheduleSummary {
  schedule_id: string;
  schedule_start_time: string;
  schedule_end_time: string | null;
  tour_id: string;
  tour_name: string;
  tour_description: string;
  tour_capacity: string;
  tour_price: string;
  tour_duration: string;
  reservations_count: string;
  total_reserved: string;
  reservations: Reservation[];
}

export interface Reservation {
  booking_id: number;
  booking_status: Status;
  booking_quantity: number;
  booking_total_price: number;
  booking_notes: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}
