import { useQuery } from '@tanstack/react-query';

import { getBookings, getBookingsByDateSchedule } from '../booking.service';

export function useBookings() {
  //page: number, perPage: number) {
  return useQuery({
    queryKey: ['bookings'], // page, perPage
    queryFn: async () => {
      const response = await getBookings(); // getBookings(page, perPage);
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
