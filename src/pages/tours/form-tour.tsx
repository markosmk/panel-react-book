import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

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
import { TimePicker } from '@/components/ui/time-picker-input';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { InputNumber } from '@/components/ui/input-number';

import { useCreateEditTour } from '@/services/hooks/tour.mutation';
import { Tour, TourRequest, TourRequestCreate } from '@/types/tour.types';
import { ButtonLoading } from '@/components/button-loading';
import { useRouter } from '@/routes/hooks';
import { cn, formatTime } from '@/lib/utils';
import { Icons } from '@/components/icons';

const formSchema = z
  .object({
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
      .optional()
      .or(z.literal('')),
    price: z.coerce.number().min(1, 'El precio no es valido.'),
    capacity: z.coerce.number().min(1, 'La capacidad no es valida.'),
    duration: z.coerce
      .number()
      .min(10, 'La duración debe ser al menos 10 minutos.'),
    content: z
      .string()
      .min(100, 'El contenido debe tener al menos 100 caracteres.')
      .max(1000, 'El contenido no puede tener más de 1500 caracteres.'),
    active: z.boolean(),
    weekends: z.boolean().optional(),
    startTime: z
      .date({
        required_error: 'La hora es requerida.',
        invalid_type_error: 'La hora debe ser válida.'
      })
      .optional(),
    endTime: z
      .date({
        required_error: 'La hora es requerida.',
        invalid_type_error: 'La hora debe ser válida.'
      })
      .optional(),
    dateRange: z
      .object({
        from: z
          .date({
            required_error: 'La fecha de inicio es requerida.',
            invalid_type_error: 'La fecha de inicio debe ser una fecha válida.'
          })
          .optional(),
        to: z
          .date({
            required_error: 'La fecha de finalización es requerida.',
            invalid_type_error:
              'La fecha de finalización debe ser una fecha válida.'
          })
          .optional()
      })
      .optional()
  })
  .refine(
    (data) => {
      if (data.dateRange) {
        return (
          data.dateRange.from !== undefined && data.dateRange.to !== undefined
        );
      }
      return true;
    },
    {
      message:
        'Si define un rango, ambos valores (de y hasta) deben estar presentes.',
      path: ['dateRange']
    }
  )
  // TODO: validate startTime and endTime not be minor than duration in minutes
  // TODO: when user change startTime or endTime, maybe we can show how many schedules will be created
  .refine(
    (data) => {
      if (data.dateRange && data.dateRange.from && data.dateRange.to) {
        if (data.startTime == undefined && data.endTime == undefined) {
          return false;
        }

        if (data.startTime) {
          if (
            data.startTime.getHours() === 0 &&
            data.startTime.getMinutes() === 0
          ) {
            return false;
          }
        }
        if (data.endTime) {
          if (
            data.endTime.getHours() === 0 &&
            data.endTime.getMinutes() === 0
          ) {
            return false;
          }
        }
      }
      return true;
    },
    {
      message:
        'Si define un rango de fechas, también debe definir la hora de inicio y la hora de finalización. y no puede ser a las 00:00.',
      path: ['rangeTime']
    }
  )
  .refine(
    (data) => {
      if (data.dateRange && data.startTime && data.endTime) {
        return data.startTime < data.endTime;
      }
      return true;
    },
    {
      message:
        'La hora de inicio no puede ser mayor que la hora de finalización.',
      path: ['rangeTime']
    }
  );

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
      duration: parseFloat(data.duration.toString()) || 0,
      content: data.content,
      active: data.active === '1' ? true : false,
      weekends: false,
      startTime: undefined,
      endTime: undefined,
      dateRange: undefined
    },
    resolver: zodResolver(formSchema)
  });
  const { mutateAsync, isPending } = useCreateEditTour();

  function onSubmit(values: FormData) {
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
    let dataShcedule = {};
    if (values.dateRange) {
      dataShcedule = {
        dateFrom: values.dateRange.from?.toISOString().split('T')[0],
        dateTo: values.dateRange.to?.toISOString().split('T')[0],
        startTime: formatTime(values.startTime),
        endTime: formatTime(values.endTime),
        weekends: values.weekends ? '1' : '0'
      };
    }

    const dataToSend = isNew
      ? { ...dataValues, ...dataShcedule }
      : { ...dataValues };

    mutateAsync(
      {
        id: !isNew ? data.id : null,
        data: dataToSend
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
        <div
          className={cn(
            'mx-auto max-w-xl space-y-4 pt-4 transition-opacity duration-500 ease-in-out',
            (isPending || isFetching) && 'pointer-events-none opacity-50'
          )}
        >
          <div className="flex flex-col space-y-1">
            <h4 className="text-lg font-semibold">1. Información General</h4>
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
                <FormLabel>Nombre</FormLabel>
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
                <FormLabel>Descripción</FormLabel>
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
                    <FormLabel>Precio</FormLabel>
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
                    <FormLabel>Capacidad</FormLabel>
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
                    <FormLabel>Duracion</FormLabel>
                    <FormControl>
                      <InputNumber
                        placeholder="Ej: 90"
                        value={field.value}
                        onChange={field.onChange}
                      />
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

          {isNew && (
            <>
              <div className="flex flex-col pb-2 pt-6">
                <h4 className="mb-0.5 text-lg font-semibold">
                  2. Crear Horarios (Opcional)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Esta seccion es para definir un rango de fechas en el que se
                  crearán los horarios, luego puedes añadir más (esta sección es
                  simplemente para optimizar el tiempo de creación de los
                  horarios al crear el tour).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Periodo de Disponibilidad</FormLabel>
                        <FormControl>
                          <DatePickerWithRange field={field} />
                        </FormControl>
                        <FormDescription>
                          Rango de fechas en el que se crearán los horarios.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2 flex flex-col space-y-2 rounded-lg border p-4">
                  <p className="text-sm font-medium leading-none">
                    Periodo por dia
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="col-span-1">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-y-2">
                            <div className="flex flex-row items-center gap-x-4">
                              <FormLabel>Desde</FormLabel>
                              <FormControl>
                                <TimePicker
                                  setDate={field.onChange}
                                  date={field.value}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-1">
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-y-2">
                            <div className="flex flex-row items-center gap-x-4">
                              <FormLabel>Hasta</FormLabel>
                              <FormControl>
                                <TimePicker
                                  setDate={field.onChange}
                                  date={field.value}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {form.formState.errors?.rangeTime && (
                    <FormMessage>
                      <>{form.formState.errors.rangeTime?.message}</>
                    </FormMessage>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Ej: si defines una duracion de <b>90 minutos</b>, y eliges{' '}
                    <em>inicio de 10:00 y final 14:00</em>, se crearán{' '}
                    <b>2 horarios: 10:00 y 11:30</b> (y el horario de las 13:00?
                    este no se creará porque el horario final es 14:00 y no se
                    puede ocupar mas de <b>90 minutos</b>, duración de este
                    ejemplo)
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="weekends"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel htmlFor="weekends">Fines de Semana</FormLabel>
                      <FormDescription>
                        Si activas, tambien se crearan horarias los dias sabados
                        y domingos, en el periodo seleccionado
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="weekends"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
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
