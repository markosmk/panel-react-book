import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { toast } from '@/components/notifications';
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
import { InputNumber } from '@/components/ui/input-number';
import { ButtonLoading } from '@/components/button-loading';
import { CardForm, CardFormFooter } from '@/components/card-footer-action';
import { Icons } from '@/components/icons';

import { useRouter } from '@/routes/hooks';
import { useCreateEditTour } from '@/services/hooks/tour.mutation';
import { Tour, TourRequest, TourRequestCreate } from '@/types/tour.types';

const formSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .max(200, 'El nombre no puede tener más de 200 caracteres.'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres.')
    .max(200, 'La descripción no puede tener más de 200 caracteres.'),
  media: z
    .string()
    .url('La URL proporcionada no es válida.')
    .regex(
      /(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i,
      'La URL debe terminar con alguna de estas extensiones: .jpg, .jpeg, .png, .gif, .webp.'
    )
    .optional()
    .or(z.literal('')),
  price: z.coerce.number().min(1, 'El precio no es valido.'),
  capacity: z.coerce.number().min(1, 'La capacidad no es valida.'),
  duration: z.string().min(1, 'La duracion debe tener al menos 10 caracteres.'),
  content: z
    .string()
    .min(100, 'El contenido debe tener al menos 100 caracteres.')
    .max(1000, 'El contenido no puede tener más de 1500 caracteres.'),
  active: z.boolean()
});

type FormData = z.infer<typeof formSchema>;

type ExtendedFormData = FormData & {
  rangeTime?: {
    message: string;
  };
};

const initDefaultValues: Tour = {
  name: '',
  description: '',
  media: '',
  price: '0',
  capacity: '0',
  duration: '0',
  content: '',
  active: '1',
  id: '',
  created_at: '',
  updated_at: ''
};

export function FormTour({
  data = initDefaultValues,
  isFetching = false,
  isNew = false
}: {
  data?: Tour;
  isFetching?: boolean;
  isNew?: boolean;
}) {
  const router = useRouter();
  const form = useForm<ExtendedFormData>({
    defaultValues: {
      name: data.name,
      description: data.description,
      media: data.media,
      price: parseFloat(data.price) || 0,
      capacity: parseFloat(data.capacity) || 0,
      duration: data.duration.toString() || '0',
      content: data.content,
      active: data.active === '1' ? true : false
    },
    resolver: zodResolver(formSchema)
  });
  const { mutateAsync, isPending } = useCreateEditTour();

  function onSubmit(values: FormData) {
    toast.dismiss();

    const dataValues: TourRequestCreate | TourRequest = {
      name: values.name,
      description: values.description,
      media: values.media || '',
      price: values.price.toFixed(2),
      capacity: values.capacity.toString(),
      duration: values.duration.toString(),
      content: values.content,
      active: values.active ? '1' : '0'
    };

    mutateAsync(
      {
        id: !isNew ? data.id : null,
        data: { ...dataValues }
      },
      {
        onSuccess: () => {
          toast.success(
            `Tour ${!isNew ? 'Actualizado' : 'Creado'} correctamente.`
          );
          router.push('/tours');
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <CardForm isPending={isPending || isFetching}>
          <div className="flex flex-col space-y-1">
            <h4 className="text-lg font-semibold">Información General</h4>
            <p className="text-sm text-muted-foreground">
              Información que se mostrará en la página, al seleccionar y ver el
              detalle de un tour.
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tour Visita a la Bodega"
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
                <FormLabel required>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detalles breves del tour"
                    className="resize-none"
                    rows={3}
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
                    <FormLabel required>Precio</FormLabel>
                    <FormControl>
                      <InputNumber
                        placeholder="Ej: 4500"
                        value={field.value}
                        onChange={field.onChange}
                        // {...field}
                      />
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
                    <FormLabel required>Capacidad</FormLabel>
                    <FormControl>
                      <InputNumber
                        placeholder="Ej: 12"
                        value={field.value}
                        onChange={field.onChange}
                      />
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
                    <FormLabel htmlFor="duration" required>
                      Duracion
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="duration"
                        type="text"
                        placeholder="Ej: 30 a 40 min"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>Ej: 30 a 40 min</FormDescription>
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
                <FormLabel required>Contenido</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Itinerario del tour..."
                    className="resize-none"
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  El Itinerario o detalles de lo que contiene el tour
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
        </CardForm>

        <CardFormFooter>
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
          >
            Guardar Cambios
          </ButtonLoading>
        </CardFormFooter>
      </form>
    </Form>
  );
}
