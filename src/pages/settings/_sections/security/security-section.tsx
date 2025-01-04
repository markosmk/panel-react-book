import { useMutation } from '@tanstack/react-query';

import { FormValues, UserDataForm } from './user-data-form';

import { Card, CardContent } from '@/components/ui/card';
import { updateUserSelf } from '@/services/settings.service';
import { useAuth } from '@/providers/auth-provider';
import { AxiosError } from 'axios';
import { toast } from '@/components/notifications';

const useUpdateSecurity = () => {
  return useMutation({
    mutationFn: async ({
      userId,
      data
    }: {
      userId: string | number;
      data: FormValues;
    }): Promise<{
      message: string;
    }> => {
      const response = await updateUserSelf(userId, {
        name: data?.name ?? '',
        email: data?.email ?? '',
        password: data.password,
        newPassword:
          data.newPassword && data.newPassword == ''
            ? undefined
            : data.newPassword
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Datos actualizados');
    },
    onError: (error) => {
      console.log(error);
      if (error instanceof AxiosError) {
        if (error.response?.data.message) {
          toast.error(error.response?.data.message);
          return;
        }
        if (error.response?.data.messages) {
          const messages = error.response?.data.messages;
          if (messages?.password) {
            if (messages.password.includes('incorrecta')) {
              toast.error(messages.password);
              return;
            }
          }
          if (messages?.newPassword) {
            if (messages.newPassword.includes('actual')) {
              toast.error(messages.newPassword);
              return;
            }
          }
          // toast.error(error.response?.data.messages[0]);
          // return;
        }
      }
      toast.error(
        'Error al actualizar los datos, contacta a un administrador.'
      );
    }
  });
};

export function SecuritySection() {
  const { user } = useAuth();
  const { mutateAsync, isPending } = useUpdateSecurity();

  const handleSubmit = async (data: FormValues) => {
    if (!data || !user) return;
    await mutateAsync({ userId: user.id, data });
  };

  if (!user) {
    return (
      <div className="flex flex-col gap-y-4">
        <Card>
          <CardContent>
            <p className="text-xl font-semibold">Error</p>
            <p className="mb-2 mt-1 text-muted-foreground">
              Actualiza la pagina y vuelve a intentarlo
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent>
          <div>
            <p className="text-xl font-semibold">Seguridad</p>
            <p className="mb-2 mt-1 text-muted-foreground">
              Al actualizar los datos de tu cuenta e iniciar sesion nuevamente,
              deberás ingresar con los nuevos datos.
            </p>
          </div>
          <div className="mt-4">
            <UserDataForm
              data={{
                email: user?.email ?? '',
                username: user?.username ?? '',
                name: user?.name ?? ''
              }}
              isPending={isPending}
              onSubmit={handleSubmit}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
