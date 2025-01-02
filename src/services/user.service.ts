import axios from '@/lib/axios';
import { UserTable } from '@/types/user.types';

export const getUsers = async (page?: number, perPage?: number) =>
  await axios.get<UserTable[]>('/users', {
    params: { page, perPage }
  });

// export const getUserById = async (id: string | number, signal?: AbortSignal) =>
//   await axios.get<UserTable>('/users/' + id, { signal });

export const createUser = async (
  data: Omit<UserTable, 'id' | 'created_at' | 'updated_at'>
) => await axios.post('/users/', data);

export const updateUser = async (
  id: string | number,
  data: Partial<UserTable>
) => await axios.put('/users/' + id, data);

export const deleteUser = async (id: string | number) =>
  await axios.delete('/users/' + id);
