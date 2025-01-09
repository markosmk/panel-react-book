import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../user.service';
import { getMe } from '../auth.service';

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

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await getMe();
      if (response.status !== 200) {
        throw new Error('Invalid user data');
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: 'always',
    retry: false
  });
}
