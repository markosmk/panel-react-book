import { CONFIG } from '@/constants/config';
import { queryClient } from '@/providers';
import axios from 'axios';

const axiosApp = axios.create({
  baseURL: CONFIG.apiUrl,
  withCredentials: true
});

axiosApp.interceptors.request.use((config) => {
  // const token = localStorage.getItem(CONFIG.cookieName);
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  // const tokenUser = Cookies.get(CONFIG.cookieName);
  // const token = Cookies.get('app_token');
  // console.log('tokenuser', tokenUser);
  // console.log('token', token);

  return config;
});

axiosApp.interceptors.response.use(
  (response) => {
    // checkear si existe token en cookies
    // const tokenUser = Cookies.get(CONFIG.cookieName);
    // const token = Cookies.get('app_token');
    // console.log('tokenuser', tokenUser);
    // console.log('token', token);
    return response;
  },
  (error) => {
    console.log(error);

    // const tokenUser = Cookies.get(CONFIG.cookieName);
    // const token = Cookies.get('app_token');
    // console.log('tokenuser', tokenUser);
    // console.log('token', token);

    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });

      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosApp;
