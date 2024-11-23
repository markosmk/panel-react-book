import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/providers';
import { authClient } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { tokenClient } from '@/services/token';
import { useAuth } from '@/providers/auth-provider';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      await sleep(2000);
      const token = tokenClient.getToken();
      if (!token) {
        throw new Error('No token found');
      }
      console.log('useCurrentUser', token);
      return await authClient.getUser(token);
    },
    staleTime: 5 * 60 * 1000, // cache data by 5 min
    retry: false
  });
}

export function useLogin() {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  return useMutation({
    // mutationFn: authClient.login,
    mutationFn: async (data: { email: string; password: string }) => {
      await sleep(2000);
      return authClient.login(data);
    },
    onSuccess: async (data) => {
      const { token } = data;
      tokenClient.setToken(token);
      setIsAuthenticated(true);

      await queryClient.invalidateQueries({
        queryKey: ['currentUser'],
        exact: true
      });

      navigate('/');
    },
    onError: (error) => {
      console.log('Login failed', error);
      // enqueueSnackbar('Login failed', { variant: 'error' });
    }
  });
}

export function useLogout() {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      await sleep(2000);
      // await authClient.logout();
      tokenClient.removeToken();
      return true;
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      queryClient.clear();
      navigate('/login');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    }
  });
}
