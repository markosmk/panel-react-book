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
  language: string | null;
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
  additionals: AdditionalRelated[] | null;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  tour: TourBooking;
  schedule: Pick<Schedule, 'date' | 'startTime' | 'endTime'>;
  notes: string;
  language?: string;
  created_at: string;
}

export type TourSaved = Pick<Tour, 'name' | 'price' | 'duration'>;

export type TourBooking = Pick<
  Tour,
  'name' | 'description' | 'content' | 'duration' | 'price' | 'capacity'
> & { updatedAt: string };

export type AdditionalRelated = {
  booking_id: string;
  additional_id: string;
  additional_name: string;
  additional_price: string;
  additional_description: string;
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

export type BookingDelete = {
  id: string;
  customerId: string;
  tourId: string;
  scheduleId: string;
  quantity: string;
  status: Status;
  totalPrice: string;
  notes: string;
  language: string | null;
  tour_data: {
    name: string;
    price: string;
    duration: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at: string;
};
