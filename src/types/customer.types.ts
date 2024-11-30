import { BookingTable } from './booking.types';

export type CustomerTable = {
  id: string;
  name: string;
  email: string;
  phone: string;
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
  bookings: BookingTable[];
}
