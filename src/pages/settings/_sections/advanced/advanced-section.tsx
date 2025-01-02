import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import axiosApp from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { ButtonLoading } from '@/components/button-loading';

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
  const { mutateAsync, isPending } = useCacheClean();
  const { data, isLoading, isError } = useCache();

  const handleClean = async () => {
    if (!data) return;
    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success('Cache limpiada correctamente.');
      },
      onError: (error) => {
        console.log(error);
        toast.error('Error al ejecutar la accion. intenta mas tarde');
      }
    });
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const mostRecentFile = getMostRecentFile(data?.content);
  const recentDate = mostRecentFile
    ? new Date(mostRecentFile.date).toLocaleString()
    : '';

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <div>
            <p className="text-xl font-semibold">Tamaño Cache de Datos</p>
            <p className="mb-2 mt-1 text-muted-foreground">
              El Cache es usado para almacenar datos que demandan recursos para
              su uso, el uso del cache en la app, es principalmente para la
              pagina de inicio (estadisticas) y para limitar las solicitudes a
              la api (se establecio un margen de 60 solicitudes/minuto)
            </p>
            <p className="mb-2 mt-1 text-base font-bold">
              Informacion cache actual:
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
              A veces se requiere limpiar el cache de la app, para esto solo
              presionas el boton de limpiar cache. Puedes realizar esto cuando
              veas que los datos de la cache sean demasiados. Esta accion no
              modifica los datos almacenados en la base de datos.
            </p>
            <ButtonLoading
              type="button"
              onClick={handleClean}
              isWorking={isPending}
            >
              Limpiar {data?.totalSize} de Cache
            </ButtonLoading>
          </div>

          <div className="mt-4"></div>
        </div>
      </CardContent>
    </Card>
  );
}
