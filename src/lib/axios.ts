import { queryClient } from '@/providers';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.example.com'
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
