import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStatusBooking } from '../booking.service';
import { Status } from '@/types/booking.types';
import { sleep } from '@/lib/utils';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

type StatusProps = {
  id: string | number;
  status: Status;
  totalPrice?: string | number;
};

export function useStatusBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, totalPrice }: StatusProps) => {
      await sleep(1000);
      return updateStatusBooking(id, { status, totalPrice });
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
