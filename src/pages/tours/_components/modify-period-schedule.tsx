import * as React from 'react';
import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInDays, formatISO } from 'date-fns';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { usePeriodSchedule } from '@/services/hooks/schedule.mutation';

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
import { ToogleDaySelector } from '@/components/ui/toggle-day-selector';
import { ButtonDelete } from '@/components/button-delete';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { TooltipHelper } from '@/components/tooltip-helper';
import { ListItemForm } from './list-item-form';

const createOrModifySchema = (isCreating: boolean = false) =>
  z.object({
    action: z.enum(['create', 'pause', 'resume', 'delete'], {
      required_error: 'Debes seleccionar una acción.'
    }),
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
      .min(isCreating ? 1 : 0, 'Debes ingresar al menos un horario.')
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
        from: z.date().optional(),
        to: z.date().optional()
      })
      .refine((data) => data.from && data.to, {
        message: 'Ambas fechas son requeridas.'
      })
      .refine(
        (data) => {
          if (!data.from || !data.to) return true; // Skip if either date is missing
          const diff = differenceInDays(data.to, data.from);
          return diff <= 365;
        },
        {
          message:
            'La diferencia entre las fechas no puede ser mayor a 365 días.'
        }
      ),

    daysOfWeek: z.array(z.string()).min(1, 'Debes seleccionar al menos un día.')
  });

type FormValues = z.infer<ReturnType<typeof createOrModifySchema>>;

const defaultValue = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const defaultDaysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];
const defaultDaysZorzal = [
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

type ModifyScheduleProps = {
  tourId: string | string[];
  action: 'create' | 'pause' | 'resume' | 'delete';
  closeModal: () => void;
};

export function ModifyPeriodSchedule({
  tourId,
  action: initialAction = 'create',
  closeModal
}: ModifyScheduleProps) {
  const [readyToDelete, setReadyToDelete] = React.useState(false);

  const [formSchema, setSchema] = React.useState<z.ZodTypeAny>(
    createOrModifySchema(initialAction === 'create')
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: initialAction,
      list:
        initialAction === 'create'
          ? defaultValue.map((d) => ({ value: d }))
          : [],
      dateRange: {
        from: undefined,
        to: undefined
      },
      daysOfWeek: defaultDaysZorzal
    },
    mode: 'onChange'
  });

  const dateRange = form.watch('dateRange');
  const action = form.watch('action');

  const { fields, append, remove } = useFieldArray({
    name: 'list',
    control: form.control
  });

  const { mutateAsync, isPending } = usePeriodSchedule();

  const onSubmitForm = async (values: FormValues) => {
    toast.dismiss();

    if (!values.dateRange.from || !values.dateRange.to) {
      toast.error('Debes seleccionar un rango de fechas.');
      return;
    }

    await mutateAsync(
      {
        tourId: Array.isArray(tourId) ? tourId : [tourId],
        action: action,
        data: {
          dateFrom: formatISO(values.dateRange.from, {
            representation: 'date'
          }),
          dateTo: formatISO(values.dateRange.to, { representation: 'date' }),
          daysOfWeek: values.daysOfWeek,
          times:
            values.list && values.list?.length > 0
              ? values.list?.map((item) => item.value + ':00')
              : []
        }
      },
      {
        onSuccess: (data) => {
          if (data?.data?.message) {
            toast.success(data?.data?.message);
          } else {
            const actionLabel = {
              create: 'creados',
              delete: 'eliminados',
              resume: 'reanudados',
              pause: 'pausados'
            }[action];
            toast.success('Horarios ' + actionLabel + ' correctamente.');
          }
          setTimeout(() => {
            closeModal();
          }, 150);
        }
      }
    );
  };

  React.useEffect(() => {
    form.clearErrors();
    setSchema(createOrModifySchema(action === 'create'));
    form.setValue(
      'list',
      action === 'create' ? defaultValue.map((d) => ({ value: d })) : []
    );
    form.setValue('dateRange', { from: undefined, to: undefined });
    form.setValue('daysOfWeek', defaultDaysZorzal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)}>
        <div
          className={cn(
            'space-y-2 transition-opacity',
            isPending ? 'pointer-events-none select-none opacity-50' : ''
          )}
        >
          <ul className="rounded-lg border border-border bg-background text-sm font-medium">
            <ListItemForm
              title="Acción"
              required={true}
              hasError={!!form.formState.errors.action}
            >
              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <div className="space-y-1">
                      <FormLabel required className="sr-only">
                        Selecciona Accion
                      </FormLabel>
                      <FormDescription className="sr-only">
                        Selecciona la accion a realizar.
                      </FormDescription>
                    </div>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una acción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="select" disabled>
                          Selecciona una acción
                        </SelectItem>
                        <SelectItem value="create">Crear</SelectItem>
                        <SelectItem value="pause">Pausar</SelectItem>
                        <SelectItem value="resume">Reanudar</SelectItem>
                        <SelectItem value="delete">Eliminar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="md:text-right" />
                  </FormItem>
                )}
              />
            </ListItemForm>

            <ListItemForm
              title="Periodo"
              description={
                dateRange.to &&
                dateRange.from &&
                `${differenceInDays(dateRange.to, dateRange.from)} dias`
              }
              required
              hasError={!!form.formState.errors.dateRange}
            >
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <div className="mb-0 space-y-1">
                      <div className="hidden items-center justify-between gap-x-2">
                        <FormLabel required>Periodo</FormLabel>
                        {dateRange.to && dateRange.from && (
                          <p className="text-sm leading-none text-muted-foreground">
                            {`${differenceInDays(dateRange.to, dateRange.from)} dias`}
                          </p>
                        )}
                      </div>
                      <FormDescription className="sr-only">
                        Selecciona el rango de fechas en el que se gestionarán
                        los horarios.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <DateRangePicker
                        onUpdate={({ range }) => {
                          field.onChange(range);
                        }}
                        initialDateFrom={field.value.from}
                        initialDateTo={field.value.to}
                        direction="future"
                      />
                    </FormControl>
                    <FormMessage className="md:text-right" />
                  </FormItem>
                )}
              />
            </ListItemForm>

            <ListItemForm
              title="Horarios"
              required={action === 'create'}
              hasError={!!form.formState.errors.list}
              subAction={
                <div className="flex gap-x-1">
                  <TooltipHelper content="Agregar Horario" align="start">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 min-w-8"
                      title="Agregar Horario"
                      onClick={() => append({ value: '' })}
                    >
                      <Icons.plus className="size-4" />
                    </Button>
                  </TooltipHelper>
                  <TooltipHelper content="Limpiar Lista" align="start">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 min-w-8"
                      title="Limpiar Lista"
                      onClick={() =>
                        fields.length > 0 && form.setValue('list', [])
                      }
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </TooltipHelper>
                  <TooltipHelper
                    content="Agregar Valores por Defecto"
                    align="start"
                  >
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 min-w-8"
                      title="Agregar Valores por Defecto"
                      onClick={() => {
                        form.setValue(
                          'list',
                          defaultValue.map((d) => ({ value: d }))
                        );
                        //   form.resetField('list');
                      }}
                    >
                      <Icons.default className="size-4" />
                    </Button>
                  </TooltipHelper>
                </div>
              }
            >
              {fields.length === 0 ? (
                <div className="flex flex-col items-end justify-center text-muted-foreground">
                  {action === 'create' ? (
                    <>
                      <span>No hay horarios agregados</span>
                    </>
                  ) : (
                    <>
                      <span>Todos los horarios</span>
                      <small>
                        Las modificaciones se aplicarán a todos los horarios.
                      </small>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {fields.map((field, index) => (
                    <FormField
                      control={form.control}
                      key={field.id}
                      name={`list.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel className="sr-only">
                            Periodos por Dia
                          </FormLabel>
                          <FormDescription className="sr-only">
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
                </div>
              )}

              {form.formState.errors.list?.root?.message && (
                <div className="col-span-full">
                  <p className="text-[0.8rem] font-medium text-destructive md:text-right">
                    {form.formState.errors.list.root.message}
                  </p>
                </div>
              )}
            </ListItemForm>

            <ListItemForm
              title="Dias"
              required
              hasError={!!form.formState.errors.daysOfWeek}
              subAction={
                <div className="flex gap-x-1">
                  <TooltipHelper content="Seleccionar Todos" align="start">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 min-w-8"
                      title="Seleccionar Todos"
                      onClick={() =>
                        form.setValue('daysOfWeek', [...defaultDaysOfWeek])
                      }
                    >
                      <Icons.selection className="size-4" />
                    </Button>
                  </TooltipHelper>
                  <TooltipHelper content="Limpiar Seleccion" align="start">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 min-w-8"
                      title="Limpiar Seleccion"
                      onClick={() => form.setValue('daysOfWeek', [])}
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </TooltipHelper>
                  <TooltipHelper
                    content="Seleccionar Valores Por Defecto"
                    align="start"
                  >
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 min-w-8"
                      title="Valores Por Defecto"
                      onClick={() =>
                        form.setValue('daysOfWeek', [...defaultDaysZorzal])
                      }
                    >
                      <Icons.default className="size-4" />
                    </Button>
                  </TooltipHelper>
                </div>
              }
            >
              <FormField
                control={form.control}
                name="daysOfWeek"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <div className="space-y-1">
                      <FormLabel required className="sr-only">
                        Días a Gestionar
                      </FormLabel>
                      <FormDescription className="sr-only">
                        Selecciona los días que se verán afectados en el rango
                        de fechas elegido.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <ToogleDaySelector
                        selectedDays={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="md:text-right" />
                  </FormItem>
                )}
              />
            </ListItemForm>
          </ul>

          {/* information */}
          {action === 'create' && (
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
          )}
        </div>

        <div className="mt-4 flex items-center justify-end gap-x-2">
          <Button
            type="button"
            variant="ghost"
            onClick={closeModal}
            disabled={isPending || readyToDelete}
          >
            Cancelar
          </Button>

          {action === 'delete' ? (
            <ButtonDelete
              isDeleting={isPending}
              handleDelete={() => onSubmitForm(form.getValues())}
              readyToDelete={readyToDelete}
              setReadyToDelete={setReadyToDelete}
              isDisabled={!form.formState.isValid}
            >
              Eliminar Horarios
            </ButtonDelete>
          ) : (
            <ButtonLoading
              type="submit"
              isWorking={isPending}
              variant={'default'}
            >
              {action === 'pause'
                ? 'Pausar'
                : action === 'resume'
                  ? 'Reanudar'
                  : 'Crear'}{' '}
              Horarios
            </ButtonLoading>
          )}
        </div>
      </form>
    </Form>
  );
}
