import axios from '@/lib/axios';
import { Additional, AdditionalRequest } from '@/types/app.types';

export const getAdditionals = async () => {
  return await axios.get<Additional[]>('/additionals/panel');
};

export const getAdditionalOne = async (id: number | string) =>
  await axios.get<{ message: string }>('/additionals/' + id);

export const createAdditional = async (data: AdditionalRequest) =>
  await axios.post<{ message: string }>('/additionals', data);

export const updateAdditional = async (
  id: string | number,
  data: AdditionalRequest
) => await axios.put<{ message: string }>('/additionals/' + id, data);

export const deleteAdditional = async (id: string | number) =>
  await axios.delete<{ message: string }>('/additionals/' + id);

export const deleteAdditionalSelected = async (ids: { ids: string[] }) =>
  await axios.delete<{ message: string }>('/additionals/delete', { data: ids });
