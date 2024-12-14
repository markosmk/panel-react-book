import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../booking.service';

export function useBookings(page: number, perPage: number) {
  return useQuery({
    queryKey: ['bookings', page, perPage],
    queryFn: async () => {
      const response = await getBookings(); // getBookings(page, perPage);
      if (response.status !== 200) {
        throw new Error('Invalid booking data');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  });
}
