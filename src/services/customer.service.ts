import axios from '@/lib/axios';
import {
  CustomerList,
  CustomerDetail,
  Booking,
  CustomerRequest
} from '@/types/customer.types';

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

export const createCustomer = async (data: CustomerRequest) =>
  await axios.post('/customers', data);

export const updateCustomer = async (
  id: string | number,
  data: CustomerRequest
) => await axios.put('/customers/' + id, data);

export const getBookingsByCustomerId = async (
  customerId: string | number,
  signal?: AbortSignal
) =>
  await axios.get<Booking[]>('/customers/' + customerId + '/bookings', {
    signal
  });
