import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { FormValues, GeneralForm } from './general-form';

import { Card, CardContent } from '@/components/ui/card';
import { SettingsApp } from '@/types/app.types';
import { getSettings, updateSettings } from '@/services/settings.service';
import { toast } from 'sonner';

const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await getSettings();
      if (response.statusText !== 'OK') {
        throw new Error('Invalid data');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
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
      const response = await updateSettings(1, data);
      return response.data;
    },
    onSuccess: async (data, variables) => {
      // queryClient.invalidateQueries({ queryKey: ['settings'] });
      // this method not call api again, best performance
      queryClient.setQueryData(['settings'], (oldData: SettingsApp) => {
        console.log({ oldData });
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
  const { data, isLoading } = useSettings();
  const { mutateAsync, isPending } = useUpdateSettings();

  const handleSubmit = async (data: FormValues) => {
    if (!data) return;
    await mutateAsync(
      {
        email: data.email,
        phoneWhatsapp: data.phoneWhatsapp,
        aditionalNote: data.aditionalNote,
        active: data.active ? '1' : '0',
        termsAndConditions: data.termsAndConditions,
        messageDisabled: data.messageDisabled ?? ''
      },
      {
        onSuccess: () => {
          toast.success('Configuración actualizada');
        },
        onError: (error) => {
          console.log(error);
          toast.error('Error al actualizar la configuración');
        }
      }
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
