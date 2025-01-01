import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBooking, updateStatusBooking } from '../booking.service';
import { Status } from '@/types/booking.types';
import { sleep } from '@/lib/utils';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

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
      await sleep(500);
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
      await sleep(500);
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
