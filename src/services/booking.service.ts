import axios from '@/lib/axios';
import {
  // BookingUpdateRequest,
  BookingList,
  BookingCreateRequest,
  BookingDetail,
  Status,
  BookingDelete
} from '@/types/booking.types';
import { ScheduleSummary } from '@/types/summary.types';

export type BookingParams = {
  page?: string | number;
  perPage?: string | number;
  dateFrom?: string;
  dateTo?: string;
};
export const getBookings = async (paramsBooking?: BookingParams) =>
  await axios.get<BookingList>(
    '/bookings',
    paramsBooking ? { params: { ...paramsBooking } } : {}
  );

export const getBookingById = async (
  id: string | number,
  signal?: AbortSignal,
  allowDeleted: boolean = false
) =>
  await axios.get<BookingDetail>('/bookings/' + id, {
    signal,
    params: allowDeleted ? { deleted: true } : {}
  });

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
  data: BookingManualParams
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

export type BookingManualParams = {
  tourId: string | number;
  scheduleId: string | number;
  numGuests: string | number;
  customerId?: string | number;
  customer?: {
    phone: string;
    email: string;
    name: string;
  };
  notes: string;
  totalPrice: string | number;
  status: Status;
  additionalIds: (string | number)[];
  language?: string;
};

export const createManualBooking = async (
  data: BookingManualParams,
  signal?: AbortSignal
) => {
  await axios.post<{ status: string; message: string }>(
    '/bookings/manual',
    data,
    {
      signal
    }
  );
};

export const getBookingsDeleted = async () =>
  await axios.get<BookingDelete[]>('/bookings/deleted');
