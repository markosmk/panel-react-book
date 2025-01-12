import * as React from 'react';
import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';

import { ButtonLoading } from '@/components/button-loading';
import { Icons } from '@/components/icons';
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
import { cn, formatDateOnly, sleep } from '@/lib/utils';
import { ScheduleWithAvailable } from '@/types/tour.types';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { SelectTagInput } from '@/components/ui/select-tag-input';
import { createPeriodSchedule } from '@/services/schedule.service';
import { Switch } from '@/components/ui/switch';

const dayOfWeek = [
  { value: 'Monday', label: 'Lunes' },
  { value: 'Tuesday', label: 'Martes' },
  { value: 'Wednesday', label: 'Miercoles' },
  { value: 'Thursday', label: 'Jueves' },
  { value: 'Friday', label: 'Viernes' },
  { value: 'Saturday', label: 'Sabado' },
  { value: 'Sunday', label: 'Domingo' }
];

const formSchema = z
  .object({
    usePeriod: z.boolean().default(false),
    list: z
      .array(
        z.object({
          value: z
            .string()
            .trim()
            .min(1, 'El mensaje no puede estar vacio')
            .regex(
              /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
              'El formato de la hora no es valido, debe ser HH:MM, ej: 10:00'
            )
        })
      )
      .min(1, 'Debes ingresar al menos un horario.')
      .superRefine((list, ctx) => {
        const values = list.map((item) => item.value);
        const duplicates = values.filter(
          (item, index) => values.indexOf(item) !== index
        );

        duplicates.forEach((duplicate) => {
          list.forEach((schedule, index) => {
            if (schedule.value.toLowerCase() === duplicate) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Valor identico',
                path: [index, 'value']
              });
            }
          });
        });
      }),
    dateRange: z
      .object({
        from: z.date({
          required_error: 'La fecha de inicio es requerida.',
          invalid_type_error: 'La fecha de inicio debe ser una fecha válida.'
        }),
        to: z.date({
          required_error: 'La fecha de finalización es requerida.',
          invalid_type_error:
            'La fecha de finalización debe ser una fecha válida.'
        })
      })
      .optional(),
    noDays: z.array(z.string())
  })
  .refine(
    (data) => {
      if (data.usePeriod) {
        return data.dateRange?.from && data.dateRange?.to;
      }
      return true;
    },
    {
      message: 'Debes completar el rango de fechas si usas periodos.',
      path: ['dateRange']
    }
  );

type FormValues = z.infer<typeof formSchema>;

type AddScheduleProps = {
  tourId: string;
  date: string | undefined;
  schedules: ScheduleWithAvailable[];
  closeModal: () => void;
  setToggleUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValue = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

export function AddPeriodSchedule({
  tourId,
  date,
  closeModal,
  setToggleUpdate
}: AddScheduleProps) {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usePeriod: false,
      list: defaultValue.map((d) => ({ value: d })),
      dateRange: undefined,
      noDays: ['Sunday', 'Monday']
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    name: 'list',
    control: form.control
  });

  const onSubmitForm = async (values: FormValues) => {
    toast.dismiss();
    try {
      setIsPending(true);

      if (values.usePeriod == false && date) {
        const selectedDayIndex = formatDateOnly(date, 'c');
        const adjustedDayIndex =
          selectedDayIndex === '7' ? 0 : parseInt(selectedDayIndex, 10) - 1;
        const selectedDayValue = dayOfWeek[adjustedDayIndex].value;
        if (values.noDays?.includes(selectedDayValue)) {
          toast.error(
            'El día seleccionado está excluido y no se pueden crear horarios.'
          );
          return;
        }
      }

      await sleep(500);

      const currentDate = date ? date : new Date().toISOString().split('T')[0];
      const dataSchedule = {
        dateFrom:
          values.usePeriod && values.dateRange?.from
            ? values.dateRange.from.toISOString().split('T')[0]
            : currentDate,
        dateTo:
          values.usePeriod && values.dateRange?.to
            ? values.dateRange.to.toISOString().split('T')[0]
            : currentDate,
        noDays: values.noDays,
        schedule:
          values.list && values.list?.length > 0
            ? values.list?.map((item) => item.value + ':00')
            : []
      };
      const response = await createPeriodSchedule(tourId, dataSchedule);
      let message = 'Horarios creados correctamente.';
      if (response?.data?.message) {
        message = response.data.message;
      }
      toast.success(message);
      closeModal();
      setToggleUpdate((prev) => !prev);
    } catch (error) {
      let message = 'Error al Crear los Horarios. Contacta al administrador.';
      if (error instanceof AxiosError) {
        message = error.response?.data.messages?.error;
      }
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)}>
        <div
          className={cn(
            'space-y-2 transition-opacity',
            isPending ? 'pointer-events-none select-none opacity-50' : ''
          )}
        >
          <FormField
            control={form.control}
            name="usePeriod"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <FormLabel>Usar Periodo:</FormLabel>
                  <FormDescription>
                    Crear horarios en un periodo seleccionado o el dia
                    seleccionado
                    {date && (
                      <span className="ml-2 font-bold text-green-500">
                        {formatDateOnly(date, 'dd/MM/yyyy')}
                      </span>
                    )}
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

          {form.watch('usePeriod') === true && (
            <div className="block">
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="rounded-lg border p-4">
                    <div className="space-y-1">
                      <FormLabel required>Periodo de Disponibilidad</FormLabel>
                      <FormDescription>
                        Selecciona el rango de fechas en el que se crearán los
                        horarios.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <DatePickerWithRange field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="rounded-lg border p-4">
            <div className="mb-2 space-y-1">
              <FormLabel required>Horarios por Dia</FormLabel>
              <FormDescription>
                Agrega los horarios de inicio de cada reserva
              </FormDescription>
            </div>
            <div className={cn('grid grid-cols-2 gap-2 md:grid-cols-3')}>
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`list.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className={'sr-only'}>
                        Periodos por Dia
                      </FormLabel>
                      <FormDescription className={'sr-only'}>
                        Agrega el horario de inicio de cada reserva
                      </FormDescription>
                      <FormControl>
                        <div className="flex flex-row gap-x-2">
                          <Input placeholder="10:00" {...field} />
                          <Button
                            variant="destructive"
                            type="button"
                            size="icon"
                            className="h-12 w-12 min-w-12"
                            onClick={() => remove(index)}
                          >
                            <Icons.remove className="h-5 w-5" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <div className="col-span-full flex items-center justify-start gap-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="col-span-1"
                  disabled={isPending}
                  onClick={() => append({ value: '' })}
                >
                  Agregar Horario
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="col-span-1"
                  disabled={isPending}
                  onClick={() => fields.length > 0 && form.setValue('list', [])}
                >
                  Limpiar Lista
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="col-span-1"
                  disabled={isPending}
                  onClick={() => form.resetField('list')}
                >
                  Por Defecto
                </Button>
              </div>
              {form.formState.errors.list?.root?.message && (
                <div className="col-span-full">
                  <p className="text-sm text-red-500">
                    {form.formState.errors.list.root.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex rounded-lg border p-4">
            <FormField
              control={form.control}
              name="noDays"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <div className="space-y-1">
                    <FormLabel>Dias a Excluir</FormLabel>
                    <FormDescription>
                      En estos dias no se crearan horarios.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <SelectTagInput
                      options={dayOfWeek}
                      placeholder='Ej: "Lunes'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              * Los horarios deben estar en formato de 24 horas
            </p>
            <p className="text-sm text-muted-foreground">
              * No se crearan superposicion de horarios, es decir, si ya existe
              un horario "10:00" para una fecha determinada (o alguna fecha en
              el periodo), no se creara el horario para esa fecha.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end space-x-2">
          <Button
            type="button"
            variant="ghost"
            onClick={closeModal}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <ButtonLoading type="submit" isWorking={isPending}>
            Crear Horarios
          </ButtonLoading>
        </div>
      </form>
    </Form>
  );
}
