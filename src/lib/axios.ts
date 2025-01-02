import axios from 'axios';
import { toast } from 'sonner';

import { CONFIG } from '@/constants/config';
import { queryClient } from '@/providers';

const axiosApp = axios.create({
  baseURL: CONFIG.apiUrl,
  withCredentials: true
});

axiosApp.interceptors.request.use((config) => {
  return config;
});

axiosApp.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      queryClient.clear();
      // queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      window.location.href = '/login';
    } else if (
      error.response?.status === 429 &&
      error.config.method === 'post'
    ) {
      toast.warning(
        'Demasiados intentos, intenta de nuevo más tarde o contacta al soporte.',
        {
          duration: 5000
        }
      );
    }
    return Promise.reject(error);
  }
);

export default axiosApp;
