import { useQuery } from '@tanstack/react-query';
import { dashboardRecentBookings, dashboardStats } from '../stats.service';

export function useStats() {
  return useQuery({
    queryKey: ['stats_dashboard'],
    queryFn: async () => {
      //   try {
      const response = await dashboardStats();
      if (response.status !== 200) {
        throw new Error('Invalid data');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  });
}

export function useRecentBookings() {
  return useQuery({
    queryKey: ['stats_recent_bookings'],
    queryFn: async () => {
      const response = await dashboardRecentBookings();
      if (response.status !== 200) {
        throw new Error('Invalid data');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  });
}
