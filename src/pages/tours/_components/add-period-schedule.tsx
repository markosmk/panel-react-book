import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ButtonLoading } from '@/components/button-loading';
import { Icons } from '@/components/icons';
import { createNotification } from '@/components/notifications';
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
import { cn, sleep } from '@/lib/utils';
import { z } from 'zod';
import { ScheduleWithAvailable } from '@/types/tour.types';
import * as React from 'react';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { SelectTagInput } from '@/components/ui/select-tag-input';
import axiosApp from '@/lib/axios';

const dayOfWeek = [
  { value: 'Monday', label: 'Lunes' },
  { value: 'Tuesday', label: 'Martes' },
  { value: 'Wednesday', label: 'Miercoles' },
  { value: 'Thursday', label: 'Jueves' },
  { value: 'Friday', label: 'Viernes' },
  { value: 'Saturday', label: 'Sabado' },
  { value: 'Sunday', label: 'Domingo' }
];

const formSchema = z.object({
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
    })
    .optional(),
  dateRange: z.object({
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
  }),
  noDays: z.array(z.string())
});

type FormValues = z.infer<typeof formSchema>;

type AddScheduleProps = {
  tourId: string;
  schedules: ScheduleWithAvailable[];
  closeModal: () => void;
  date: string | undefined;
  setToggleUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValue = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

export function AddPeriodSchedule({
  tourId,
  closeModal,
  setToggleUpdate
}: AddScheduleProps) {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    try {
      setIsPending(true);
      await sleep(500);

      let dataSchedule = {};
      if (values.dateRange) {
        dataSchedule = {
          dateFrom: values.dateRange.from?.toISOString().split('T')[0],
          dateTo: values.dateRange.to?.toISOString().split('T')[0],
          noDays: values.noDays,
          schedule:
            values.list && values.list?.length > 0
              ? values.list?.map((item) => item.value + ':00')
              : []
        };
      }

      await axiosApp.post('/schedules/' + tourId + '/period', dataSchedule);

      createNotification({
        type: 'success',
        text: 'Horarios creados correctamente.'
      });
      closeModal();
      setToggleUpdate((prev) => !prev);
    } catch (e) {
      createNotification({
        type: 'error',
        text: 'Error al Crear los Horarios'
      });
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)}>
        <div
          className={cn(
            'transition-opacity',
            isPending ? 'pointer-events-none select-none opacity-50' : ''
          )}
        >
          <div className="block">
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Periodo de Disponibilidad</FormLabel>
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

          <div className="mt-4">
            <FormLabel required>Horarios por Dia</FormLabel>
            <FormDescription>
              Agrega los horarios de inicio de cada reserva
            </FormDescription>
            <div
              className={cn('mb-4 mt-2 grid grid-cols-2 gap-2 md:grid-cols-3')}
            >
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
                          <Input placeholder="ej: 10" {...field} />
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
              <Button
                type="button"
                variant="outline"
                className="col-span-1"
                disabled={isPending}
                onClick={() => append({ value: '' })}
              >
                Añadir Horario
              </Button>
            </div>
          </div>

          <div className="flex">
            <FormField
              control={form.control}
              name="noDays"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Dias a Excluir</FormLabel>
                  <FormControl>
                    <SelectTagInput
                      options={dayOfWeek}
                      placeholder='Ej: "Lunes'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Para los dias que se seleccionen no se crearan horarios.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
