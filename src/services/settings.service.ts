import axios from '@/lib/axios';
import { SettingsApp } from '@/types/app.types';

export const getSettings = async () =>
  await axios.get<SettingsApp>('/settings');

export const updateSettings = async (id: string | number, data: SettingsApp) =>
  await axios.put<{ message: string }>('/settings/' + id, data);

export const updateUserSelf = async (
  id: string | number,
  data: { name: string; email: string; password: string; newPassword?: string }
) => await axios.put<{ message: string }>('/users/self/', data);
