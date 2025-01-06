import axios from '@/lib/axios';
import { SettingsApp, SettingsSAdmin } from '@/types/app.types';

export const getSettings = async () => {
  return await axios.get<SettingsApp>('/options/all');
};

export const updateSettings = async (data: SettingsApp) =>
  await axios.put<{ message: string }>('/options', data);

export const updateSettinsSAdmin = async (data: SettingsSAdmin) =>
  await axios.put<{ message: string }>('/options/sadmin', data);

export const updateUserSelf = async (
  id: string | number,
  data: { name: string; email: string; password: string; newPassword?: string }
) => await axios.put<{ message: string }>('/users/self/', data);
