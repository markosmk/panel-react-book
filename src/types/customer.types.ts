import { Status } from './booking.types';

export type CustomerTable = {
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
  observations?: string;
  created_at: string;
  updated_at: string;
};

export interface CustomerList {
  results: CustomerTable[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CustomerDetail {
  customer: CustomerTable;
  bookings: BookingInCustomer[];
}

export type BookingInCustomer = {
  id: string;
  tourId: string;
  scheduleId: string;
  quantity: string;
  status: Status;
  totalPrice: string;
  notes: string;
  created_at: string;
  aditional: string | null;
  aditionalData: string;
  customerData: string;
  scheduleData: string;
  tourData: string;
};
