import axiosApp from '@/lib/axios';
import { ScheduleWithAvailable } from '@/types/tour.types';

export const getSchedules = async (tourId: number | string, day: Date) =>
  await axiosApp.get<{ schedules: ScheduleWithAvailable[] }>(
    `/schedules/${tourId}/all?date=${day.toISOString().split('T')[0]}`
  );

// for create/modify by period by action
export const createPeriodSchedule = async (
  tourId: number | string,
  dataSchedule: {
    action: 'create' | 'pause' | 'resume' | 'delete';
    dateFrom: string;
    dateTo?: string;
    daysOfWeek: string[];
    times: string[];
  }
) =>
  await axiosApp.post<{ message: string; createdCount: number }>(
    `/schedules/${tourId}/by-period`,
    dataSchedule
  );

export const modifyByPeriodSchedule = async (dataSchedule: {
  tourId: string[];
  action: 'create' | 'pause' | 'resume' | 'delete';
  dateFrom: string;
  dateTo?: string;
  times: string[];
  daysOfWeek: string[];
}) =>
  await axiosApp.post<{
    message: string;
    details: {
      process: number;
      totalCreated: number;
      totalUpdated: number;
      totalDeleted: number;
      totalTours: number;
    };
  }>(`/schedules/by-period`, dataSchedule);

/** methods to handle edit/delete of one schedule */
export const updateSchedule = async (
  scheduleId: string | number,
  formData: { startTime: string; endTime?: string; active: '1' | '0' }
) => await axiosApp.put(`/schedules/${scheduleId}`, formData);

// export const deleteSchedule = async (scheduleId: string | number) =>
//   await axiosApp.delete(`/schedules/${scheduleId}`);

// method used for handle selection in one day specific
export const pauseSchedules = async (ids: string[]) => {
  await axiosApp.put(`/schedules/update`, {
    ids,
    active: '0'
  });
};

export const resumeSchedules = async (ids: string[]) => {
  await axiosApp.put(`/schedules/update`, {
    ids,
    active: '1'
  });
};

export const deleteSchedules = async (schedulesIds: string[]) => {
  await axiosApp.delete(
    `/schedules/delete?ids=${encodeURIComponent(schedulesIds.join(','))}`
  );
};
