import { Status } from './booking.types';

export interface CustomerTable {
  id: string;
  name: string;
  email: string;
  phone: string;
  origen: string;
  hotel: string;
  findAbout: string;
  customAbout: string;
  about: string;
  wantNewsletter: '1' | '0';
  created_at: string;
  updated_at: string;
  total_bookings: string;
  observations?: string; // not implemented yet
}

export interface CustomerList {
  results: CustomerTable[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CustomerDetail extends CustomerTable {}

export interface CustomerRequest
  extends Pick<CustomerTable, 'name' | 'email' | 'phone' | 'wantNewsletter'> {
  id?: string;
  origen?: string;
  hotel?: string;
  findAbout?: string;
  customAbout?: string;
  about?: string;
}

export type BookingData = {
  booking_id: string;
  schedule_id: string;
  tourId: string;
  tourName: string;
  tourDescription: string;
  tourPrice: string;
  tourDuration: string;
  tourCapacity: string;
  tourContent: string;
  scheduleDate: string;
  scheduleStartTime: string;
  // scheduleendTime: string | null;
  bookingQuantity: string;
  bookingStatus: Status;
  bookingTotalPrice: string;
  bookingNotes: string;
};

export interface Booking {
  id: string;
  tourId: string;
  scheduleId: string;
  customerId: string;
  status: Status;
  quantity: string;
  totalPrice: string;
  tourData: TourData;
  customer: Customer;
  tour: Tour;
  schedule: Schedule;
  notes: string;
  language: string; // 'es | en'
  createdAt: Date;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Schedule {
  date: Date;
  startTime: string;
}

export interface Tour {
  name: string;
  description: string;
  content: string;
  capacity: string;
  duration: string;
  price: string;
  updatedAt: Date;
}

export interface TourData {
  name: string;
  price: string;
  duration: string;
}
