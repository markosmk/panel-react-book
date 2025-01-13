import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Status } from '@/types/booking.types';
import { deleteBooking, updateStatusBooking } from '../booking.service';
import { toast } from '@/components/notifications';

type StatusProps = {
  id: string | number;
  status: Status;
  totalPrice?: string | number;
  sendMail?: boolean;
};

export function useStatusBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, totalPrice, sendMail }: StatusProps) => {
      return updateStatusBooking(id, { status, totalPrice, sendMail });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
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

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      return await deleteBooking(id);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: AxiosError<{ messages: { error?: string } }>) => {
      let message = 'Error al eliminar la reserva';
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
