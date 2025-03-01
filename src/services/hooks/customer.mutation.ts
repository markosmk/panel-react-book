import { CustomerRequest, CustomerTable } from '@/types/customer.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/notifications';
import {
  createCustomer,
  deleteCustomer,
  updateCustomer
} from '../customer.service';

export function useCreateEditCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CustomerRequest) => {
      if (data?.id && data?.id !== null) {
        return updateCustomer(data.id, data);
      } else {
        return createCustomer(data);
      }
    },
    onSuccess: async (data, variables) => {
      if (variables.id) {
        queryClient.setQueryData(
          ['customers'],
          (oldData: { results: CustomerTable[] }) => {
            if (!oldData) return [];
            const newData = oldData?.results.map((item) => {
              if (item.id === variables.id) {
                return {
                  ...item,
                  ...variables
                };
              }
              return item;
            });

            return {
              ...oldData,
              results: newData
            };
          }
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      }
    },
    onError: handleMutationError
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      return await deleteCustomer(id);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: handleMutationError
  });
}

export function handleMutationError(error: unknown) {
  let message = 'Error al procesar la solicitud.';
  // AxiosError<{ messages: { error?: string; email?: string; phone?: string } }>
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data?.messages?.error) {
      message = data.messages.error;
    }
    if (data?.messages?.email || data?.messages?.phone) {
      message = data.messages.email || data.messages.phone || message;
    }
  }
  toast.error(message);
}
