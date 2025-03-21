import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { FormValues, GeneralForm } from './general-form';

import { Card, CardContent } from '@/components/ui/card';
import { SettingsApp } from '@/types/app.types';
import { getSettings, updateSettings } from '@/services/settings.service';
import { toast } from '@/components/notifications';
import { ErrorContent } from '@/components/error-content';
import { PendingContent } from '@/components/pending-content';

const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await getSettings();
      if (response.status !== 200) {
        throw new Error('Invalid data');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    retry: false
  });
};

const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: SettingsApp
    ): Promise<{
      message: string;
    }> => {
      const response = await updateSettings(data);
      return response.data;
    },
    onSuccess: async (data, variables) => {
      // queryClient.invalidateQueries({ queryKey: ['settings'] });
      // this method not call api again, best performance
      queryClient.setQueryData(['settings'], (oldData: SettingsApp) => {
        if (!oldData) return null;
        return {
          ...oldData,
          ...variables
        };
      });
    }
  });
};

export function GeneralSection() {
  const { data, isLoading, isError } = useSettings();
  const { mutateAsync, isPending } = useUpdateSettings();

  const handleSubmit = async (data: FormValues) => {
    if (!data) return;
    await mutateAsync(
      {
        email: data.email,
        phoneWhatsapp: data.phoneWhatsapp,
        aditionalNote: data.aditionalNote,
        isActiveBooking: data.isActiveBooking ? '1' : '0',
        terms: data.terms,
        messageDisabled: data.messageDisabled ?? ''
      },
      {
        onSuccess: () => {
          toast.success('Configuración actualizada');
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onError: (error) => {
          toast.error('Error al actualizar la configuración');
        }
      }
    );
  };

  if (isLoading) {
    return <PendingContent withOutText className="h-40" />;
  }

  if (isError) {
    return <ErrorContent />;
  }

  return (
    <Card>
      <CardContent>
        <div>
          <p className="text-xl font-semibold">Configuración General</p>
          <p className="mb-2 mt-1 text-muted-foreground">
            Estos datos son importantes, se utilizarán durante el proceso de
            reserva.
          </p>
        </div>
        <div className="mt-4">
          <GeneralForm
            data={data ?? ({} as SettingsApp)}
            isPending={isPending}
            onSubmit={handleSubmit}
          />
        </div>
      </CardContent>
    </Card>
  );
}
