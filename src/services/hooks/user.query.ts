import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../user.service';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await getUsers();
      if (response.status !== 200) {
        throw new Error('Invalid user data');
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    retry: false
  });
}
