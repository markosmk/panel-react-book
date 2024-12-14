import axios from '@/lib/axios';
import {
  BookingUpdateRequest,
  BookingList,
  BookingCreateRequest,
  BookingDetail,
  Status
} from '@/types/booking.types';

export const getBookings = async (page?: number, perPage?: number) =>
  await axios.get<BookingList>('/bookings', {
    params: { page, perPage }
  });

export const getBookingById = async (
  id: string | number,
  signal?: AbortSignal
) => await axios.get<BookingDetail>('/bookings/' + id, { signal });

export const updateStatusBooking = async (
  id: string | number,
  { status, totalPrice }: { status: Status; totalPrice?: string | number }
) => await axios.put('/bookings/' + id + '/status', { status, totalPrice });

export const createBooking = async (data: BookingCreateRequest) =>
  await axios.post('/bookings', { ...data });

export const editBooking = async (
  id: string | number,
  data: BookingUpdateRequest
) => await axios.put('/bookings/' + id, { ...data });

export const deleteBooking = async (id: string | number) =>
  await axios.delete('/bookings/' + id);
