import axios from '@/lib/axios';
import {
  BookingUpdateRequest,
  BookingList,
  BookingCreateRequest,
  BookingDetail,
  Status
} from '@/types/booking.types';
import { ScheduleSummary } from '@/types/summary.types';

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
  {
    status,
    totalPrice,
    sendMail = false
  }: { status: Status; totalPrice?: string | number; sendMail?: boolean }
) =>
  await axios.put(
    '/bookings/' + id + '/status' + (sendMail ? '?sendMail=true' : ''),
    { status, totalPrice }
  );

export const createBooking = async (data: BookingCreateRequest) =>
  await axios.post('/bookings', { ...data });

export const editBooking = async (
  id: string | number,
  data: BookingUpdateRequest
) => await axios.put('/bookings/' + id, { ...data });

export const deleteBooking = async (id: string | number) =>
  await axios.delete('/bookings/' + id);

export const getBookingsByDateSchedule = async (
  date: string,
  signal?: AbortSignal
) =>
  await axios.get<{
    status: string;
    date: string;
    schedules: ScheduleSummary[];
  }>('/bookings/summary', {
    params: { date },
    signal
  });
