/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { sleep } from '@/lib/utils';

import {
  createTour,
  updateFastTour,
  updateTour
} from '@/services/tour.service';
import { TourDetail, TourRequest, TourRequestCreate } from '@/types/tour.types';
import { CustomAxiosError } from '@/types/app.types';

type StatusProps = {
  id: string | number;
  price: string | number;
  capacity: string | number;
  duration: string | number;
  active: '1' | '0';
};

export function useEditingTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      price,
      capacity,
      duration,
      active
    }: StatusProps) => {
      await sleep(1000);
      return updateFastTour(id, { price, capacity, duration, active });
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.setQueryData(
        ['tourDetail', variables.id],
        (oldData: TourDetail) => {
          const { id, ...newData } = variables;
          if (!oldData) return null;
          return {
            ...oldData,
            tour: {
              ...oldData.tour,
              ...newData
            }
          };
        }
      );
      // queryClient.removeQueries({ queryKey: ['tourDetail', variables.id] });
    },
    onError: (error: AxiosError<{ messages: { error?: string } }>) => {
      if (error instanceof AxiosError) {
        const data = error.response?.data;
        if (data?.messages?.error) {
          toast.error('Error al procesar los datos: ' + data.messages.error);
        }
      }
    }
  });
}

export function useCreateEditTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string | number | null;
      data: TourRequest | TourRequestCreate;
    }) => {
      await sleep(1000);
      if (id !== null) {
        return updateTour(id, data);
      }
      return createTour(data);
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      if (variables.id) {
        // queryClient.invalidateQueries({ queryKey: ['tourDetail', variables.id] });
        queryClient.setQueryData(
          ['tourDetail', variables.id],
          (oldData: TourDetail) => {
            if (!oldData) return null;
            return {
              ...oldData,
              tour: {
                ...oldData.tour,
                ...variables.data
              }
            };
          }
        );
      }
    },
    onError: (error: CustomAxiosError) => {
      if (error.response) {
        //error instanceof AxiosError) {
        const data = error.response?.data;

        if (data?.messages) {
          if (typeof data?.messages === 'string') {
            toast.error('Error: ' + data.messages);
          } else if (data?.messages?.error) {
            toast.error('Error al procesar los datos: ' + data.messages.error);
          } else {
            const fields: string[] = [];
            Object.entries(data.messages).forEach(([field, message]) => {
              fields.push(field);
              console.error(`Error en ${field}: ${message}`);
              // TODO: change property name with correct label, ex: price -> Precio
            });
            toast.error('Error revisa estos campos: ' + fields.join(', '), {
              duration: 10000
            });
          }
        } else {
          toast.error(
            'Error de red o de configuración. Inténtalo de nuevo mas tarde.',
            {
              duration: 4000
            }
          );
        }
      }
    }
  });
}
