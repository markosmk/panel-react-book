import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '../customer.service';

export function useCustomers(page: number, perPage: number) {
  return useQuery({
    queryKey: ['customers', page, perPage],
    queryFn: async () => {
      const response = await getCustomers(page, perPage);
      if (response.statusText !== 'OK') {
        throw new Error('Invalid customer data');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  });
}
