/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { format, formatISO, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';

import { BookingDetail, Language, Status } from '@/types/booking.types';
import { useCreateEditBooking } from '@/services/hooks/booking.mutation';
import { useTours } from '@/services/hooks/tour.query';
import { useSchedules } from '@/services/hooks/schedule.query';
import { useAdditionals } from '@/services/hooks/additional.query';

import { toast } from '@/components/notifications';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { InputNumber } from '@/components/ui/input-number';
import { ButtonLoading } from '@/components/button-loading';
import { Icons } from '@/components/icons';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn, formatPrice } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/select-multiple';
import { Switch } from '@/components/ui/switch';
import { ComboboxVirtualized } from '@/components/ui/combobox-virtualized';
import { useCustomers } from '@/services/hooks/customer.query';
import { Input } from '@/components/ui/input';
import { BookingManualParams } from '@/services/booking.service';
import { useRouter } from '@/routes/hooks/use-router';
import { LanguageFlag } from '@/components/language-flag';

const baseSchema = z.object({
  tourId: z.string().min(1, 'Debe seleccionar un tour.'),
  selectedDate: z.string().min(1, 'Debe seleccionar una fecha.'),
  scheduleId: z.string().min(1, 'Debe seleccionar un cliente.'),
  isExistingCustomer: z.boolean(),
  quantity: z.coerce.number().min(1, 'La cantidad no es valida.'),
  status: z.string().min(1, 'Debe seleccionar un estado.'),
  totalPrice: z.coerce.number().min(1, 'El precio no es valido.'),
  additionalIds: z.array(z.string()).optional(),
  notes: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres.')
    .max(120, 'La descripción no puede tener más de 120 caracteres.')
    .optional()
    .or(z.literal('')),
  language: z.string().nullable().optional()
});

const existingCustomerSchema = baseSchema.extend({
  customerId: z.string().min(1, 'Debe seleccionar un cliente.')
});

const newCustomerSchema = baseSchema.extend({
  customerName: z
    .string({
      required_error: 'El nombre es requerido.'
    })
    .min(1, 'El nombre es requerido.')
    .max(100, 'El nombre no puede tener más de 100 caracteres.'),
  customerEmail: z
    .string()
    .email('El email es requerido.')
    .min(1, 'El email debe tener al menos 1 caracter.')
    .or(z.literal(''))
    .optional(),
  customerPhone: z
    .string()
    .min(1, 'El teléfono es requerido.')
    .regex(
      /^\d{6,30}$/,
      'El teléfono debe contener solo números y tener entre 6 y 30 caracteres'
    )
    .or(z.literal(''))
    .optional()
});

const formSchema = existingCustomerSchema.merge(newCustomerSchema);

type _FormData = z.infer<typeof formSchema>;
type FormData = _FormData & {
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
};

type FormBookingProps = {
  data?: BookingDetail;
  isFetching?: boolean;
  closeModal?: () => void;
};

export function BookingEditForm({
  data,
  isFetching = false,
  closeModal
}: FormBookingProps) {
  const router = useRouter();
  const isEditing = React.useMemo(() => !!data?.id, [data?.id]);
  const [dynamicSchema, setDynamicSchema] =
    React.useState<z.ZodTypeAny>(newCustomerSchema);

  const form = useForm<FormData>({
    defaultValues: {
      tourId: data?.tourId || '',
      scheduleId: data?.scheduleId || '',
      selectedDate: data?.schedule.date || '',
      additionalIds:
        data?.additionals?.map((item) => item.additional_id?.toString()) || [],
      totalPrice: data?.totalPrice ? parseFloat(data.totalPrice) : 0,
      quantity: data?.quantity ? parseFloat(data.quantity) : 1,
      status: data?.status || Status.PENDING,
      notes: data?.notes || '',
      language: data?.language || '',
      isExistingCustomer: false,
      customerId: data?.customerId || '',
      customerName: data?.customer?.name || '',
      customerEmail: data?.customer?.email || '',
      customerPhone: data?.customer?.phone || ''
    },
    resolver: zodResolver(dynamicSchema)
  });
  const watchTourId = form.watch('tourId');
  const watchSelectedDate = form.watch('selectedDate');
  const watchQuantity = form.watch('quantity');
  const watchAdditionalIds = form.watch('additionalIds');
  const watchIsExistingCustomer = form.watch('isExistingCustomer');

  const isInitialLoad = React.useRef(true);
  const [tourId, setTourId] = React.useState<string | undefined>(
    data?.tourId || undefined
  );
  const [selectedDate, setSelectedDate] = React.useState<string | undefined>(
    data?.schedule?.date || undefined
  );

  const { data: tours, isLoading: isLoadingTours } = useTours();
  const { data: additionals, isLoading: isLoadingAdditionals } =
    useAdditionals();
  const {
    data: schedules,
    isLoading: isLoadingSchedules,
    isFetching: isFetchingSchedules
  } = useSchedules(
    tourId ? Number(tourId) : undefined,
    selectedDate ? parseISO(selectedDate) : undefined,
    0
  );
  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();

  const calculatePrice = React.useMemo(() => {
    if (!watchTourId || !watchQuantity || watchQuantity < 1) return 0;

    const tourPrice =
      tours?.find((item) => item.id === watchTourId)?.price || 0;
    const additionalPrice =
      watchAdditionalIds?.reduce((sum, id) => {
        const additional = additionals?.find((item) => item.id === id);
        return sum + Number(additional?.price || 0);
      }, 0) || 0;

    return (Number(tourPrice) + additionalPrice) * watchQuantity;
  }, [watchTourId, watchQuantity, watchAdditionalIds, tours, additionals]);

  React.useEffect(() => {
    if (!isFetching) {
      setTourId(watchTourId);
      setSelectedDate(watchSelectedDate);
    }
  }, [watchTourId, watchSelectedDate, isFetching]);

  React.useEffect(() => {
    if (watchTourId && watchSelectedDate) {
      form.setValue('scheduleId', '');
    }
  }, [watchTourId, watchSelectedDate]);

  const { mutateAsync, isPending } = useCreateEditBooking();

  async function onSubmit(values: FormData) {
    toast.dismiss();

    const dataValues: BookingManualParams = {
      tourId: values.tourId,
      scheduleId: values.scheduleId,
      numGuests: values.quantity.toString(),
      additionalIds: values.additionalIds?.map((a) => Number(a)) || [],
      totalPrice: values.totalPrice.toFixed(2),
      status: values.status as Status,
      notes: values.notes || '',
      language: values.language || ''
    };

    if (!isEditing) {
      if (values.isExistingCustomer) {
        dataValues.customerId = values.customerId;
      } else {
        dataValues.customer = {
          name: values.customerName,
          email: values.customerEmail || '',
          phone: values.customerPhone || ''
        };
      }
    }

    mutateAsync(
      {
        id: isEditing && data?.id ? data.id : null,
        data: { ...dataValues }
      },
      {
        onSuccess: () => {
          toast.success(
            `Reserva ${isEditing ? 'Actualizada' : 'Creada'} correctamente.`
          );
          if (closeModal) {
            setTimeout(() => {
              closeModal();
            }, 150);
          } else {
            router.push('/bookings');
          }
        }
      }
    );
  }

  React.useEffect(() => {
    if (isInitialLoad.current && !isLoadingSchedules && data?.scheduleId) {
      form.setValue('scheduleId', data?.scheduleId);
      isInitialLoad.current = false;
    } else if (
      !isInitialLoad.current &&
      watchTourId &&
      watchSelectedDate &&
      (watchTourId !== data?.tourId ||
        watchSelectedDate !== data?.schedule?.date)
    ) {
      form.setValue('scheduleId', '');
    }
  }, [watchTourId, watchSelectedDate, isLoadingSchedules, data]);

  // React.useEffect(() => {
  // not necesary
  // if (
  //   !isLoadingAdditionals &&
  //   additionals &&
  //   data.additionals &&
  //   data.additionals?.length > 0
  // ) {
  //   form.setValue(
  //     'additionalIds',
  //     data.additionals.map((item) => item.booking_id?.toString())
  //   );
  // }
  // }, [isLoadingAdditionals, data, additionals]);

  React.useEffect(() => {
    setDynamicSchema(
      watchIsExistingCustomer ? existingCustomerSchema : newCustomerSchema
    );
  }, [watchIsExistingCustomer]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <div
          className={cn(
            'space-y-4 transition-opacity',
            isPending || isFetching
              ? 'pointer-events-none select-none opacity-50'
              : ''
          )}
        >
          {!isEditing && (
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between gap-x-2 border-b pb-2">
                <div className="mb-0 text-xs font-light uppercase text-muted-foreground">
                  {!watchIsExistingCustomer
                    ? 'Cliente Nuevo'
                    : 'Cliente Existente'}
                </div>
                <FormField
                  control={form.control}
                  name="isExistingCustomer"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-x-2 space-y-0">
                      <FormLabel className="text-xs text-muted-foreground">
                        buscar cliente Existente?
                      </FormLabel>
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

              {watchIsExistingCustomer ? (
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                      <Label
                        className="col-span-3 mt-4 w-auto sm:col-span-1"
                        required
                      >
                        Cliente
                      </Label>
                      <div className="col-span-3 w-full space-y-1 sm:col-span-2">
                        <FormControl>
                          <ComboboxVirtualized
                            options={
                              customers?.results.map((item) => ({
                                label: item.name,
                                value: item.id
                              })) ?? []
                            }
                            onChange={field.onChange}
                            value={field.value}
                            isLoading={isLoadingCustomers}
                            placeholder="Selecciona un cliente"
                            className="bg-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              ) : (
                <div className="flex flex-col gap-y-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                        <Label
                          className="col-span-3 mt-4 w-auto sm:col-span-1"
                          required
                        >
                          Nombre
                        </Label>
                        <div className="col-span-3 space-y-1 sm:col-span-2">
                          <FormControl>
                            <Input
                              placeholder="Nombre Cliente"
                              type="text"
                              {...field}
                              autoComplete="off"
                              data-lpignore="true"
                              data-form-type="other"
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                        <Label className="col-span-3 mt-4 w-auto sm:col-span-1">
                          Email
                        </Label>
                        <div className="col-span-3 space-y-1 sm:col-span-2">
                          <FormControl>
                            <Input
                              placeholder="Email Cliente"
                              type="text"
                              {...field}
                              autoComplete="off"
                              data-lpignore="true"
                              data-form-type="other"
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                        <Label className="col-span-3 mt-4 w-auto sm:col-span-1">
                          Telefono
                        </Label>
                        <div className="col-span-3 space-y-1 sm:col-span-2">
                          <FormControl>
                            <Input
                              placeholder="Telefono Cliente"
                              type="text"
                              {...field}
                              autoComplete="off"
                              data-lpignore="true"
                              data-form-type="other"
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between gap-x-2 border-b pb-2">
              <div className="mb-0 text-xs font-light uppercase text-muted-foreground">
                Tour
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="tourId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                    <Label
                      className="col-span-3 mt-4 w-auto sm:col-span-1"
                      required
                    >
                      Tour
                    </Label>
                    <div className="col-span-3 space-y-1 sm:col-span-2">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="min-h-12 bg-input hover:bg-secondary/80"
                            isLoading={isLoadingTours}
                          >
                            <SelectValue placeholder="Selecciona un tour" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tours?.map((tour, idx) => (
                            <SelectItem
                              key={idx}
                              value={tour.id}
                              disabled={tour.active === '0'}
                            >
                              {tour.name} {tour.active === '0' && '(Inactivo)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalIds"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                    <Label className="col-span-3 mt-4 sm:col-span-1">
                      Adicionales
                    </Label>
                    <div className="col-span-3 space-y-1 sm:col-span-2">
                      <MultiSelect
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecciona adicionales"
                        isProcesingOptions={isLoadingAdditionals}
                        options={
                          additionals?.map((item) => ({
                            value: item.id,
                            label: `${item.name} (${formatPrice(item.price)})`,
                            disabled: item.active === '0'
                          })) ?? []
                        }
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between gap-x-2 border-b pb-2">
              <div className="mb-0 text-xs font-light uppercase text-muted-foreground">
                Reserva
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="selectedDate"
                render={({ field }) => {
                  const selectedDateValue =
                    field.value && isValid(parseISO(field.value))
                      ? parseISO(field.value)
                      : undefined;

                  return (
                    <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                      <Label className="col-span-3 mt-4 sm:col-span-1" required>
                        Fecha Reserva
                      </Label>
                      <div className="col-span-3 space-y-1 sm:col-span-2">
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                type="button"
                                variant="secondary"
                                className={cn(
                                  'w-full gap-x-2 px-4 text-left text-base font-normal',
                                  !field.value && 'text-muted-foreground/70'
                                )}
                              >
                                {field.value ? (
                                  <span className="truncate">
                                    {format(
                                      parseISO(field.value),
                                      'EEEE, PPP',
                                      {
                                        locale: es
                                      }
                                    )}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground/70">
                                    Selecciona una Fecha
                                  </span>
                                )}
                                <CalendarIcon className="ml-auto size-4 min-w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2" align="end">
                            <Calendar
                              mode="single"
                              selected={selectedDateValue}
                              onSelect={(value) => {
                                if (!value || !isValid(value)) return;
                                const dateISO = formatISO(value, {
                                  representation: 'date'
                                });
                                field.onChange(dateISO);
                              }}
                              defaultMonth={selectedDateValue}
                              initialFocus
                              locale={es}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <div className="grid grid-cols-3 gap-2">
                <Label className="col-span-3 mt-4 sm:col-span-1" required>
                  Horario y Cantidad
                </Label>

                <div className="col-span-3 space-y-1 sm:col-span-2">
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="scheduleId"
                      render={({ field }) => (
                        <FormItem className="col-span-2 flex w-full flex-col space-y-0">
                          <FormLabel required className="sr-only">
                            Horario
                          </FormLabel>
                          <div className="space-y-1">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!watchTourId || !watchSelectedDate}
                            >
                              <FormControl>
                                <SelectTrigger
                                  isLoading={
                                    isLoadingSchedules || isFetchingSchedules
                                  }
                                  className="min-h-12 w-full bg-input"
                                >
                                  <SelectValue
                                    placeholder={
                                      isLoadingSchedules || isFetchingSchedules
                                        ? 'Cargando...'
                                        : 'Seleccionar Horario'
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {schedules?.schedules.map((item, idx) => (
                                  <SelectItem
                                    key={idx}
                                    value={item.id}
                                    disabled={
                                      item.available === 0 ||
                                      item.active === '0'
                                    }
                                  >
                                    {item.startTime.slice(0, 5)}
                                    <small className="ml-1 text-muted-foreground">
                                      ({item.available} cupos){' '}
                                      {item.active === '0' && '(Inactivo)'}
                                    </small>
                                  </SelectItem>
                                ))}
                                {schedules?.schedules.length === 0 && (
                                  <SelectItem value="undefined" disabled>
                                    No hay horarios
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel required className="sr-only">
                            Cantidad
                          </FormLabel>
                          <div className="space-y-1">
                            <FormControl>
                              <InputNumber placeholder="Ej: 12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Label className="col-span-3 mt-4 sm:col-span-1" required>
                  Estado e Idioma
                </Label>

                <div className="col-span-3 space-y-1 sm:col-span-2">
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="col-span-2 space-y-0">
                          <FormLabel required className="sr-only">
                            Estado
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                id="status"
                                className="col-span-2 ml-auto h-12 w-full bg-input"
                              >
                                <SelectValue placeholder="Cambiar Estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={Status.PENDING}>
                                <span className="flex items-center">
                                  <Icons.pending className="mr-2 size-4 text-yellow-600" />
                                  Pendiente
                                </span>
                              </SelectItem>
                              <SelectItem value={Status.CONFIRMED}>
                                <span className="flex items-center">
                                  <Icons.success className="mr-2 size-4 text-green-600" />
                                  Confirmado
                                </span>
                              </SelectItem>
                              <SelectItem value={Status.CANCELED}>
                                <span className="flex items-center">
                                  <Icons.canceled className="mr-2 size-4 text-red-600" />
                                  Cancelado
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel required className="sr-only">
                            Idioma
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(value === 'null' ? null : value)
                            }
                            value={field.value ?? 'null'}
                          >
                            <FormControl>
                              <SelectTrigger className="col-span-2 ml-auto h-12 w-full bg-input">
                                <LanguageFlag
                                  language={(field.value as Language) || null}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="null">
                                <div className="flex items-center gap-x-2">
                                  <LanguageFlag language={null} />
                                  No especificado
                                </div>
                              </SelectItem>
                              <SelectItem value={'es'}>
                                <div className="flex items-center gap-x-2">
                                  <LanguageFlag language="es" />
                                  Español
                                </div>
                              </SelectItem>
                              <SelectItem value={'en'}>
                                <div className="flex items-center gap-x-2">
                                  <LanguageFlag language="en" />
                                  English
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between gap-x-2 border-b pb-2">
              <div className="mb-0 text-xs font-light uppercase text-muted-foreground">
                General
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                    <Label className="col-span-3 mt-4 sm:col-span-1" required>
                      Precio Total
                    </Label>
                    <div className="col-span-3 space-y-1 sm:col-span-2">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-6">
                          <FormControl>
                            <InputNumber
                              placeholder="Ej: 4500"
                              {...field}
                              onFocus={(e) => e.target.select()}
                            />
                          </FormControl>
                        </div>
                        <div className="col-span-6 space-y-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-min-12 flex h-12 w-full items-center justify-between rounded-md border-2 border-border px-3 transition-transform active:scale-95"
                            onClick={() => {
                              form.setValue('totalPrice', calculatePrice);
                            }}
                          >
                            <div className="pointer-events-none flex w-full select-none flex-col items-end justify-center">
                              <span className="text-xs leading-none text-muted-foreground">
                                Precio Calculado
                              </span>
                              <span className="truncate font-mono text-sm font-bold leading-4 text-muted-foreground">
                                $ {calculatePrice}
                              </span>
                            </div>
                          </Button>
                        </div>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 gap-2 space-y-0">
                    <Label className="col-span-3 mt-4 sm:col-span-1">
                      Notas Adicionales
                    </Label>
                    <div className="col-span-3 space-y-1 sm:col-span-2">
                      <FormControl>
                        <Textarea
                          placeholder="Ej: Necesita silla de ruedas"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* <pre>{JSON.stringify(form.getValues(), null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}

        <div
          className={cn(
            'sticky bottom-0 -mx-4 mt-4 flex items-center justify-end gap-x-2 border-t  px-4 py-4 backdrop-blur-sm md:-mx-6 md:px-6',
            closeModal ? 'bg-background/50' : 'bg-card/50'
          )}
        >
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
          {closeModal && (
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              disabled={isPending || isFetching}
              onClick={closeModal}
            >
              Cancelar
            </Button>
          )}
          <ButtonLoading
            type="submit"
            disabled={isFetching || !form.formState.isDirty}
            isWorking={isPending}
          >
            Guardar Cambios
          </ButtonLoading>
        </div>
      </form>
    </Form>
  );
}
