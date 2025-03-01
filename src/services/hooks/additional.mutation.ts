import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Additional, AdditionalRequest } from '@/types/app.types';
import {
  createAdditional,
  deleteAdditional,
  updateAdditional
} from '../additional.service';
import { toast } from '@/components/notifications';

export function useCreateEditAdditional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AdditionalRequest) => {
      if (data?.id && data?.id !== null) {
        return updateAdditional(data.id, data);
      } else {
        return createAdditional(data);
      }
    },
    onSuccess: async (data, variables) => {
      if (variables.id) {
        queryClient.setQueryData(['additionals'], (oldData: Additional[]) => {
          if (!oldData) return [];
          return oldData.map((item) => {
            if (item.id === variables.id) {
              return {
                ...item,
                ...variables
              };
            }
            return item;
          });
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ['additionals'] });
      }
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

export function useAdditionalDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      return await deleteAdditional(id);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['additionals'] });
    },
    onError: (error: AxiosError<{ messages: { error?: string } }>) => {
      let message = 'Error al eliminar el registro';
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
