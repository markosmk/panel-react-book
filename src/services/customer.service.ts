import axios from '@/lib/axios';
import { CustomerList, CustomerDetail } from '@/types/customer.types';

export const getCustomers = async (page?: number, perPage?: number) =>
  await axios.get<CustomerList>('/customers', {
    params: { page, perPage }
  });

export const getCustomerById = async (
  id: string | number,
  signal?: AbortSignal
) => await axios.get<CustomerDetail>('/customers/' + id, { signal });

export const deleteCustomer = async (id: string | number) =>
  await axios.delete('/customers/' + id);
