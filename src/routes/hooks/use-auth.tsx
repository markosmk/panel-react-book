import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/providers';
import { authClient } from '@/services/auth';
import { tokenClient } from '@/services/token';
// import { useAuth } from '@/providers/auth-provider';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = tokenClient.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      try {
        const data = await authClient.getUser();
        if (!data) {
          throw new Error('Invalid user data');
        }
        return data;
      } catch (error) {
        tokenClient.removeToken();
        queryClient.clear();
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  });
}
