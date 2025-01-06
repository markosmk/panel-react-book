import axiosApp from '@/lib/axios';
import { ScheduleWithAvailable } from '@/types/tour.types';

export const getSchedules = async (tourId: number | string, day: Date) =>
  await axiosApp.get<{ schedules: ScheduleWithAvailable[] }>(
    `/schedules/${tourId}/all?date=${day.toISOString().split('T')[0]}`
  );

export const createPeriodSchedule = async (
  tourId: number | string,
  dataSchedule: {
    dateFrom: string;
    dateTo: string;
    noDays: string[];
    schedule: string[];
  }
) =>
  await axiosApp.post<{ message: string; createdCount: number }>(
    `/schedules/${tourId}/period`,
    dataSchedule
  );

export const updateSchedule = async (
  scheduleId: string | number,
  formData: { startTime: string; endTime: string; active: '1' | '0' }
) => await axiosApp.put(`/schedules/${scheduleId}`, formData);
