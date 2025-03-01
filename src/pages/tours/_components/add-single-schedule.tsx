import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ButtonLoading } from '@/components/button-loading';
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
import { cn } from '@/lib/utils';
import { ScheduleWithAvailable } from '@/types/tour.types';
import { XIcon } from 'lucide-react';
import { formatISO } from 'date-fns';
import { useModifySingleSchedule } from '@/services/hooks/schedule.mutation';

const formSchema = z.object({
  list: z
    .array(
      z.object({
        value: z
          .string()
          .trim()
          .min(1, 'Esta vacio!')
          .regex(
            /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            'El formato es incorrecto, ej: 10:00'
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
    })
});

type FormValues = z.infer<typeof formSchema>;

type AddScheduleProps = {
  tourId: string;
  date: string;
  schedules: ScheduleWithAvailable[];
  closeModal: () => void;
};

const defaultValue = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

export function AddSingleSchedule({
  tourId,
  date,
  closeModal
}: AddScheduleProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      list: defaultValue.map((d) => ({ value: d }))
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    name: 'list',
    control: form.control
  });

  const { mutateAsync, isPending } = useModifySingleSchedule();

  const onSubmitForm = async (values: FormValues) => {
    toast.dismiss();

    const currentDate = date
      ? date
      : formatISO(new Date(), { representation: 'date' });
    await mutateAsync(
      {
        tourId,
        action: 'create',
        data: {
          dateFrom: currentDate,
          dateTo: currentDate,
          daysOfWeek: [], // empty because is a single day
          times: values.list?.map((item) => item.value + ':00') || []
        }
      },
      {
        onSuccess: () => {
          toast.success('Horario creado correctamente.');
          setTimeout(() => {
            closeModal();
          }, 150);
        }
      }
    );
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
          <div className="rounded-lg border p-4">
            <div className="mb-2 space-y-1">
              <FormLabel required>Horarios por Dia</FormLabel>
              <FormDescription>
                Define los horarios de inicio para las reservas de este día.
                Tienes la opción de añadir o quitar horarios (por ejemplo,
                10:00, 11:00, 12:00).
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
                        <div className="flex flex-row rounded-lg border">
                          <Input
                            placeholder="10:00"
                            className="rounded-r-none"
                            onFocus={(e) => e.target.select()}
                            {...field}
                          />
                          <Button
                            variant="ghost"
                            type="button"
                            size="icon"
                            className="h-12 w-8 min-w-8"
                            onClick={() => remove(index)}
                          >
                            <XIcon className="h-5 w-5 opacity-85" />
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
                  size="sm"
                  className="col-span-1"
                  disabled={isPending}
                  onClick={() => append({ value: '' })}
                >
                  Agregar Horario
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="col-span-1"
                  disabled={isPending}
                  onClick={() => fields.length > 0 && form.setValue('list', [])}
                >
                  Limpiar Lista
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
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

          <div>
            <p className="text-sm text-muted-foreground">
              * Los horarios deben estar en formato de 24 horas
            </p>
            <p className="text-sm text-muted-foreground">
              * Al presionar <b>Crear Horarios</b>, se evitará la creación de
              superposiciones de horarios. Si hay un horario a las 10:00 en el
              algun dia del periodo seleccionado, no se añadirá otro.
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
