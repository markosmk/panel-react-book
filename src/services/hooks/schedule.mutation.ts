import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/notifications';
import {
  createPeriodSchedule,
  updateSchedule,
  deleteSchedules,
  pauseSchedules,
  resumeSchedules,
  modifyByPeriodSchedule
} from '../schedule.service';

type StatusScheduleProps = {
  startTime: string;
  endTime?: string;
  active: boolean;
  scheduleId: string;
};

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      startTime,
      endTime,
      active,
      scheduleId
    }: StatusScheduleProps) => {
      return await updateSchedule(scheduleId, {
        startTime: startTime,
        endTime: endTime,
        active: active ? '1' : '0'
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
    onError: (error: AxiosError<{ messages: { error?: string } }>) => {
      if (error instanceof AxiosError) {
        const data = error.response?.data;
        if (data?.messages?.error) {
          toast.error(
            'Error al actualizar los cambios: ' + data.messages.error
          );
        }
      }
    }
  });
}

type PropsModify = {
  tourId?: string;
  action: 'delete' | 'pause' | 'create' | 'resume';
  data?: {
    dateFrom: string;
    dateTo?: string;
    daysOfWeek: string[];
    times: string[];
  };
  ids?: string[];
};

export function useModifySingleSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tourId, action, ids, data }: PropsModify) => {
      if (action === 'create') {
        if (!tourId || !data)
          throw new Error(
            'No se ha seleccionado un tour o no se han proporcionado datos'
          );
        return await createPeriodSchedule(tourId, {
          action: 'create',
          dateFrom: data.dateFrom,
          dateTo: data.dateTo,
          daysOfWeek: data.daysOfWeek ?? [],
          times: data.times ?? []
        });
      } else if (action === 'pause') {
        if (!ids)
          throw new Error('No se han seleccionado horarios para pausar');
        return await pauseSchedules(ids);
      } else if (action === 'resume') {
        if (!ids)
          throw new Error('No se han seleccionado horarios para reanudar');
        return await resumeSchedules(ids);
      } else if (action === 'delete') {
        if (!ids)
          throw new Error('No se han seleccionado horarios para eliminar');
        return await deleteSchedules(ids);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
    onError: (error: AxiosError<{ messages: { error?: string } }>) => {
      let message = 'Error al procesar la solicitud de horarios';
      if (error instanceof AxiosError) {
        const data = error.response?.data;
        if (data?.messages?.error) {
          message = data?.messages?.error;
        }
      }
      toast.error(message);
    }
  });
}

type PropsPeriodSchedule = {
  tourId: string[];
  action: 'create' | 'resume' | 'pause' | 'delete';
  data: {
    dateFrom: string;
    dateTo?: string;
    daysOfWeek: string[];
    times: string[];
  };
};

export function usePeriodSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tourId, action, data }: PropsPeriodSchedule) => {
      return await modifyByPeriodSchedule({
        tourId,
        action,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        daysOfWeek: data.daysOfWeek ?? [],
        times: data.times ?? []
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
    onError: (error: AxiosError<{ messages: { error?: string } }>) => {
      let message = 'Error al procesar la solicitud de horarios';
      if (error instanceof AxiosError) {
        const data = error.response?.data;
        if (data?.messages?.error) {
          message = data?.messages?.error;
        }
      }
      toast.error(message);
    }
  });
}
