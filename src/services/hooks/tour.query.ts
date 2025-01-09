import { useQuery } from '@tanstack/react-query';
import { getTourById, getTours } from '@/services/tour.service';

export function useTours(page: number, perPage: number) {
  return useQuery({
    queryKey: ['tours', page, perPage],
    queryFn: async () => {
      const response = await getTours(); //getTours(page, perPage);
      if (response.status !== 200) {
        throw new Error('Invalid booking data');
      }
      return response.data;
    },
    staleTime: 3 * 60 * 1000,
    retry: false
  });
}

export function useTourDetail(id: string | number) {
  return useQuery({
    queryKey: ['tourDetail', id],
    queryFn: async () => {
      const response = await getTourById(id);
      if (response.status !== 200) {
        throw new Error('Invalid data');
      }
      return response.data;
    },
    staleTime: 0,
    retry: false
  });
}
