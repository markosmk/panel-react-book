import axiosApp from '@/lib/axios';
import { User } from '@/types/app.types';

export const getMe = async () => axiosApp.get('/me');

export const login = async (data: { email: string; password: string }) =>
  axiosApp.post<{
    user: User;
    token?: string;
    message?: string;
  }>('/login', data);

export const logout = async () => axiosApp.post('/logout');
