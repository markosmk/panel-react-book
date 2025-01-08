import { useMutation } from '@tanstack/react-query';
import { login } from '../auth.service';

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: async () => {},
    onError: () => {
      // console.log('Login failed', error);
      // toast('Login failed', { variant: 'error' });
    }
  });
}
