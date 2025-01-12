import { useQuery } from '@tanstack/react-query';
import { getAdditionals } from '../additional.service';

export function useAdditionals() {
  //page: number, perPage: number) {
  return useQuery({
    queryKey: ['additionals'], // page, perPage
    queryFn: async () => {
      const response = await getAdditionals(); // getAdditionals(page, perPage);
      if (response.status !== 200) {
        throw new Error('Invalid getting data');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: 'always',
    retry: false
  });
}
