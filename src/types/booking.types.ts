import { Schedule, Tour } from './tour.types';

export enum Status {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED'
}

export interface Booking {
  id: string;
  customerId: string;
  tourId: string;
  scheduleId: string;
  quantity: string;
  status: Status;
  totalPrice: string;
  tourData?: string;
  scheduleData?: string;
  customerData?: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

export type BookingTable = {
  id: string;
  quantity: string;
  status: Status;
  totalPrice: string;
  notes: string;
  created_at: string;
  // para Booking
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  tour_name: string | null;
  tour_price: string | null;
  schedule_date: string | null;
  schedule_startTime: string | null;
};

export interface BookingList {
  results: BookingTable[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface BookingDetail {
  id: string;
  customerId: string;
  tourId: string;
  scheduleId: string;
  totalPrice: string;
  quantity: string;
  status: Status;
  tourData: TourSaved | null;
  aditionalData: AditionalSaved[] | null;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  tour: Omit<Tour, 'id' | 'createdAt'>;
  schedule: Pick<Schedule, 'date' | 'startTime' | 'endTime'>;
  created_at: string;
}

export type TourSaved = Omit<Tour, 'id' | 'created_at' | 'updated_at'> & {
  last_updated: string;
};

export type AditionalSaved = {
  id: number | string;
  name: string;
  price: number;
};

// to create booking
export type BookingCreateRequest = {
  tourId: string | number;
  scheduleId: string | number;
  quantity: string | number;
  phone: string;
  email: string;
  name: string;
};

export type BookingUpdateRequest = {
  quantity: string | number;
  status: Status;
  totalPrice: string;
};
