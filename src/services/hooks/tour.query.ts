import { useQuery } from '@tanstack/react-query';
import { getTourById, getTours } from '@/services/tour.service';
import { sleep } from '@/lib/utils';

export function useTours(page: number, perPage: number) {
  return useQuery({
    queryKey: ['tours', page, perPage],
    queryFn: async () => {
      const response = await getTours(); //(page, perPage);
      if (response.statusText !== 'OK') {
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
      await sleep(1000);
      const response = await getTourById(id);
      if (response.statusText !== 'OK') {
        throw new Error('Invalid data');
      }
      return response.data;
    },
    staleTime: 0,
    retry: false
  });
}