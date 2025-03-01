import { useQuery } from '@tanstack/react-query';

import {
  BookingParams,
  getBookings,
  getBookingsByDateSchedule,
  getBookingsDeleted
} from '../booking.service';

export function useBookings(filters?: BookingParams) {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: async () => {
      const response = await getBookings(filters); // getBookings(page, perPage);
      if (response.status !== 200) {
        throw new Error('Invalid booking data');
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: 'always',
    retry: false
  });
}

export function useBookingSummary(date: string) {
  return useQuery({
    queryKey: ['bookingSummary', date],
    queryFn: async () => {
      const response = await getBookingsByDateSchedule(date);
      if (response.status !== 200) {
        throw new Error('Invalid booking data');
      }
      return response.data;
    },
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: 'always',
    retry: false
  });
}

export function useBookingsDeleted() {
  return useQuery({
    queryKey: ['bookingsDeleted'],
    queryFn: async () => {
      const response = await getBookingsDeleted();
      if (response.status !== 200) {
        throw new Error('Invalid booking data');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: 'always',
    retry: false
  });
}
