import axios from '@/lib/axios';
import { CustomerList, CustomerDetail } from '@/types/customer.types';

export const getCustomers = async (page: number = 1, perPage: number = 10) =>
  await axios.get<CustomerList>(
    '/customers?page=' + page + '&perPage=' + perPage
  );

export const getCustomerById = async (id: string | number) =>
  await axios.get<CustomerDetail>('/customers/' + id);

export const deleteCustomer = async (id: string | number) =>
  await axios.delete('/customers/' + id);
