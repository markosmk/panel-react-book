import { Status } from './booking.types';

export interface ScheduleSummary {
  schedule_id: string;
  schedule_start_time: string;
  tour_id: string;
  tour_name: string;
  tour_description: string;
  tour_capacity: string;
  tour_price: string;
  tour_duration: string;
  booking_language: string;
  booking_count: string;
  booking_total_reserved: string;
  bookings: Reservation[];
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
