import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '../customer.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useCustomers(page?: number, perPage?: number) {
  return useQuery({
    queryKey: ['customers'], //     queryKey: ['customers', page, perPage],
    queryFn: async () => {
      const response = await getCustomers(); //getCustomers(page, perPage);
      if (response.status !== 200) {
        throw new Error('Invalid customer data');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: 'always',
    retry: false
  });
}
