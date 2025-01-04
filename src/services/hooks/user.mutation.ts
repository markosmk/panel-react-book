import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createUser, deleteUser, updateUser } from '../user.service';
import { sleep } from '@/lib/utils';
import { Role } from '@/types/user.types';
import { toast } from '@/components/notifications';

type StatusProps = {
  id: string | number | null;
  role: Role;
  name: string;
  email: string;
  username: string;
  password: string;
};

export function useEditOrCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: StatusProps) => {
      await sleep(500);
      if (!data.id) {
        return createUser(data);
      } else {
        return updateUser(data.id, {
          ...data,
          id: data.id.toString(),
          password: data.password?.length > 0 ? data.password : undefined
        });
      }
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: AxiosError<{ messages: { [key: string]: string } }>) => {
      // let title = 'Upps Error';
      let message = 'Error al procesar la informacion del usuario';
      if (error instanceof AxiosError) {
        const data = error.response?.data;
        if (data?.messages?.error) {
          message = data?.messages?.error;
        }
        if (data?.messages?.message) {
          message = data?.messages?.message;
        }
        if (data?.messages) {
          const errorMessages = Object.entries(data.messages).map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_field, errorMessage]) => `- ${errorMessage}`
          );
          // title = 'Corrige los errores';
          message = `${errorMessages.join('\n')}`;
        }
      }
      const toastDuration = Math.min(
        Math.max(message.length * 50, 3000),
        12000
      );

      toast.error(message, {
        classNames: {
          title: 'text-base font-semibold',
          description: 'text-sm whitespace-pre-line'
        },
        duration: toastDuration
      });
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      await sleep(500);
      return await deleteUser(id);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: AxiosError<{ messages: { error?: string } }>) => {
      let message = 'Error al eliminar el usuario';
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
