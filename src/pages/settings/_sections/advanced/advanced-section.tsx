import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import axiosApp from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { ButtonLoading } from '@/components/button-loading';
import { toast } from '@/components/notifications';
import { PendingContent } from '@/components/pending-content';
import { ErrorContent } from '@/components/error-content';
import { Label } from '@/components/ui/label';
import { InputPassword } from '@/components/ui/input-password';
import { updateSettinsSAdmin } from '@/services/settings.service';
import { useAuth } from '@/providers/auth-provider';

const useCache = () => {
  return useQuery({
    queryKey: ['cached'],
    queryFn: async () => {
      const response = await axiosApp.get('/cache');
      if (response.status !== 200) {
        throw new Error('Invalid data');
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    retry: false
  });
};

const useCacheClean = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<{ message: string }> => {
      const response = await axiosApp.put('/cache/clean');
      return response.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['cached'] });
      queryClient.clear();
    }
  });
};

function getMostRecentFile(files) {
  if (files.length === 0 || !files) return null;
  return files.reduce((mostRecent, current) => {
    const currentDate = new Date(current.date);
    const mostRecentDate = new Date(mostRecent.date);

    return currentDate > mostRecentDate ? current : mostRecent;
  });
}

export function AdvancedSection() {
  const { user } = useAuth();
  const { mutateAsync, isPending } = useCacheClean();
  const { data, isLoading, isError } = useCache();
  const [isPendingSAdmin, setIsPendingSAdmin] = React.useState(false);
  // TODO: add validations
  // TODO: add iniitla values from database
  const [formValues, setFormValues] = React.useState({
    notionToken: '',
    notionDatabaseId: ''
  });

  const handleClean = async () => {
    if (!data) return;
    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success('Cache limpiada correctamente.');
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onError: (error) => {
        toast.error('Error al ejecutar la accion. intenta mas tarde');
      }
    });
  };

  const handleSave = async () => {
    if (!formValues.notionDatabaseId || !formValues.notionToken) return;
    if (!user || user?.role !== 'SUPERADMIN') return;
    try {
      setIsPendingSAdmin(true);
      await updateSettinsSAdmin(formValues);
      toast.success('Configuraciones guardadas correctamente.');
    } catch (error) {
      toast.error('Error al guardar las configuraciones');
    } finally {
      setIsPendingSAdmin(false);
    }
  };

  if (isLoading) return <PendingContent withOutText className="h-40" />;
  if (isError) return <ErrorContent />;

  // TODO: Add Types to Log
  const mostRecentFile = getMostRecentFile(data?.content);
  const recentDate = mostRecentFile
    ? new Date(mostRecentFile.date).toLocaleString()
    : '';

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <div>
            <p className="text-xl font-semibold">Cache de Datos</p>
            <p className="mb-2 mt-1 text-muted-foreground">
              Almacenar datos en caché mejora la velocidad de la aplicación. Si
              experimentas errores o datos desactualizados, considera limpiar la
              caché para una mejor experiencia.
            </p>
            <p className="mb-2 mt-1 text-base font-bold">
              Información cache actual:
            </p>
            <ul className="rounded-md border border-primary/50 p-4">
              <li className="text-muted-foreground">
                <b>Soporte de Cache:</b> {data?.isSupported ? 'Si' : 'No'}
              </li>
              <li className="text-muted-foreground">
                <b>Cantidad de Items:</b> {data?.content?.length}
              </li>
              <li className="text-muted-foreground">
                <b>Tamaño total:</b> {data?.totalSize}
              </li>
              <li className="text-muted-foreground">
                <b>Ultimo actualizado:</b> {recentDate}
              </li>
            </ul>
          </div>

          <hr className="-mx-4 md:-mx-6" />
          <div>
            <p className="text-xl font-semibold">Limpiar Cache</p>
            <p className="mb-2 mt-1 text-muted-foreground">
              El proceso de limpieza de caché es rápido y no afectará tus datos.
              Simplemente presiona el botón para asegurarte de que estás
              trabajando con la información más actual.
            </p>
            <ButtonLoading
              type="button"
              onClick={handleClean}
              isWorking={isPending}
            >
              Limpiar {data?.totalSize} de Cache
            </ButtonLoading>
          </div>

          {user?.role === 'SUPERADMIN' && (
            <>
              <hr className="-mx-4 md:-mx-6" />
              <div>
                <p className="text-xl font-semibold">Api Notion</p>
                <p className="mb-2 mt-1 text-muted-foreground">
                  Es utilizado para obtener los datos de la base de datos de
                  Notion, para la documentacion del panel en /docs
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="notionToken" className="text-base">
                    Internal Integration Token
                  </Label>
                  <InputPassword
                    id="notionToken"
                    placeholder="Ej: i49rodg9493GsvD786.."
                    value={formValues.notionToken}
                    onChange={(e) => {
                      setFormValues({
                        ...formValues,
                        notionToken: e.target.value
                      });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notionDatabase" className="text-base">
                    Notion Database ID
                  </Label>
                  <InputPassword
                    id="notionDatabase"
                    placeholder="Ej: 24b432895894038g4..."
                    value={formValues.notionDatabaseId}
                    onChange={(e) => {
                      setFormValues({
                        ...formValues,
                        notionDatabaseId: e.target.value
                      });
                    }}
                  />
                </div>
                <div>
                  <ButtonLoading
                    type="button"
                    onClick={handleSave}
                    isWorking={isPendingSAdmin}
                  >
                    Guardar Cambios
                  </ButtonLoading>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
