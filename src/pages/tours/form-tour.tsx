import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

import { useCreateEditTour } from '@/services/hooks/tour.mutation';
import { Tour } from '@/types/tour.types';
import { ButtonLoading } from '@/components/button-loading';
import { useRouter } from '@/routes/hooks';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(10).max(200),
  media: z.string().url(),
  price: z.coerce.number().min(1),
  capacity: z.coerce.number().min(1),
  duration: z.coerce.number().min(10),
  content: z.string().min(100).max(1000),
  active: z.boolean()
});
// TODO: add messages validation in spa

export function FormTour({
  data,
  isFetching
}: {
  data: Tour;
  isFetching: boolean;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: data.name,
      description: data.description,
      media: data.media,
      price: parseFloat(data.price) || 0,
      capacity: parseFloat(data.capacity) || 0,
      duration: parseFloat(data.duration.toString()) || 0,
      content: data.content,
      active: data.active === '1' ? true : false
    },
    resolver: zodResolver(formSchema)
  });
  const { mutateAsync, isPending } = useCreateEditTour();

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutateAsync(
      {
        id: data.id,
        data: {
          name: values.name,
          description: values.description,
          media: values.media,
          price: values.price.toFixed(2),
          capacity: values.capacity.toString(),
          duration: values.duration.toString(),
          content: values.content,
          active: values.active ? '1' : '0'
        }
      },
      {
        onSuccess: () => {
          toast.success('Tour actualizado correctamente.');
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <div
          className={cn(
            'mx-auto max-w-xl space-y-4 pt-4 transition-opacity duration-500 ease-in-out',
            (isPending || isFetching) && 'pointer-events-none opacity-50'
          )}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tour Visita al Viñedo"
                    type="text"
                    {...field}
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detalles breves del tour"
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url Imagen</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: https://google.com/image.jpg"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  La imagen que se mostrara como portada del tour
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 4500" type="number" {...field} />
                    </FormControl>
                    <FormDescription>Por persona</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 12" type="number" {...field} />
                    </FormControl>
                    <FormDescription>De cada reserva</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duracion</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 90" type="number" {...field} />
                    </FormControl>
                    <FormDescription>En minutos</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenido</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Que encontraremos en el tour..."
                    className="resize-none"
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  El Itinerario o detalles del tour
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Estado</FormLabel>
                  <FormDescription>
                    Permitir reservas desde la web
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="sticky bottom-0 -mx-4 -mb-4 flex justify-end bg-card/50 px-4 py-4 backdrop-blur">
          {}
          <div className="flex flex-1 items-center">
            {isFetching && (
              <>
                <Icons.spinner className="animate-spin" />
                <p className="ml-2 text-sm text-muted-foreground">
                  Cargando Información...
                </p>
              </>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            className="mr-2"
            disabled={isPending || isFetching}
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <ButtonLoading
            type="submit"
            disabled={isFetching}
            isWorking={isPending}
            className="min-w-[148px]"
          >
            Guardar Cambios
          </ButtonLoading>
        </div>
      </form>
    </Form>
  );
}
