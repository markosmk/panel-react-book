import * as React from 'react';

import axios from '@/lib/axios';
import { ScheduleWithAvailable, Tour } from '@/types/tour.types';
import { useModal } from '@/hooks/use-modal';
import { Calendar } from '@/components/ui/calendar';
import { PendingContent } from '@/components/pending-content';
import {
  cn,
  formatDateOnly,
  formatDuration,
  formatTime,
  sleep
} from '@/lib/utils';
import { TimePicker } from '@/components/ui/time-picker-input';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ButtonLoading } from '@/components/button-loading';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

function timeToDate(timeString: string) {
  const [hours, minutes, seconds] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  date.setSeconds(parseInt(seconds, 10));
  return date;
}

function EditSchedule({
  schedule,
  closeModal,
  duration
}: {
  schedule: ScheduleWithAvailable;
  duration: string | number;
  closeModal: () => void;
}) {
  const [isPending, setIsPending] = React.useState(false);
  const [errors, setErrors] = React.useState<string | null>(null);
  const [formValues, setFormValues] = React.useState<{
    startTime: string;
    endTime: string;
    active: boolean;
  }>({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    active: schedule.active === '1' ? true : false
  });

  const handleSubmit = async () => {
    try {
      setIsPending(true);
      await sleep(2000);
      // await axios.put(`/schedules/${schedule.id}`, {
      //   startTime: formValues.startTime,
      //   endTime: formValues.endTime
      // });
      toast.success('Horario actualizado correctamente.');
      closeModal();
    } catch (error) {
      console.error(error);
      setErrors('Error al actualizar el horario');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <div className="col-span-2 flex flex-col gap-y-2">
        <p className="mb-4 flex w-full gap-x-2 rounded-md bg-black p-4 pb-4 text-base font-medium leading-none text-muted-foreground">
          Duracion del Tour:{' '}
          <b className="font-bold text-white">
            {formatDuration(Number(duration))}
          </b>
          <em className="text-xs text-muted-foreground">
            ({formatDuration(Number(duration), true)})
          </em>
        </p>
        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
          <div className="col-span-1">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row items-center gap-x-4">
                <Label>Desde</Label>
                <TimePicker
                  setDate={(field) =>
                    setFormValues({
                      ...formValues,
                      startTime: formatTime(field)
                    })
                  }
                  date={timeToDate(formValues.startTime) || new Date()}
                />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row items-center gap-x-4">
                <Label>Hasta</Label>
                <TimePicker
                  setDate={(field) =>
                    setFormValues({ ...formValues, endTime: formatTime(field) })
                  }
                  date={timeToDate(formValues.endTime) || new Date()}
                />
              </div>
            </div>
          </div>
        </div>
        {errors && (
          <FormMessage>
            <>{errors}</>
          </FormMessage>
        )}

        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label>Estado</Label>
            <p className="text-sm text-muted-foreground">
              Permite recibir o no recibir reservas en este horario
            </p>
          </div>

          <Switch
            checked={formValues.active}
            onCheckedChange={(value) =>
              setFormValues({ ...formValues, active: value })
            }
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Al actualizar el horario, se comprueba que el tiempo sea el definido
          en el tour (porque el cliente podria ser informado con datos
          incorrectos), ademas comprobaremos que no se solapen con otros
          horarios.
        </p>
        <p className="text-sm text-muted-foreground">
          No es habitual hacer cambios en un horario especifico, pero si lo
          deseas puedes hacerlo.
        </p>
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
        <ButtonLoading
          variant="secondary"
          type="button"
          isWorking={isPending}
          onClick={handleSubmit}
        >
          Guardar Cambios
        </ButtonLoading>
      </div>
    </div>
  );
}

function AddSchedule({
  closeModal,
  duration
}: {
  duration: string;
  closeModal: () => void;
}) {
  const [isPending, setIsPending] = React.useState(false);
  const [errors, setErrors] = React.useState<string | null>(null);
  const [formValues, setFormValues] = React.useState<{
    startTime: string;
    endTime: string;
    active: boolean;
    usePeriod?: boolean;
  }>({
    startTime: '00:00:00',
    endTime: '00:00:00',
    active: true,
    usePeriod: false
  });

  const handleSubmit = async () => {
    try {
      setIsPending(true);
      await sleep(2000);
      // await axios.put(`/schedules/${schedule.id}`, {
      //   startTime: formValues.startTime,
      //   endTime: formValues.endTime
      // });
      toast.success('Horario actualizado correctamente.');
      closeModal();
    } catch (error) {
      console.error(error);
      setErrors('Error al actualizar el horario');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <div className="col-span-2 flex flex-col gap-y-2">
        <p className="mb-4 flex w-full gap-x-2 rounded-md bg-black p-4 pb-4 text-base font-medium leading-none text-muted-foreground">
          Duracion del Tour:{' '}
          <b className="font-bold text-white">
            {formatDuration(Number(duration))}
          </b>
          <em className="text-xs text-muted-foreground">
            ({formatDuration(Number(duration), true)})
          </em>
        </p>
        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
          <div className="col-span-1">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row items-center gap-x-4">
                <Label>Desde</Label>
                <TimePicker
                  setDate={(field) =>
                    setFormValues({
                      ...formValues,
                      startTime: formatTime(field)
                    })
                  }
                  date={timeToDate(formValues.startTime) || new Date()}
                />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row items-center gap-x-4">
                <Label>Hasta</Label>
                <TimePicker
                  setDate={(field) =>
                    setFormValues({ ...formValues, endTime: formatTime(field) })
                  }
                  date={timeToDate(formValues.endTime) || new Date()}
                />
              </div>
            </div>
          </div>
        </div>
        {errors && (
          <FormMessage>
            <>{errors}</>
          </FormMessage>
        )}

        <div className="flex flex-row items-center justify-between gap-x-2 rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label>Estado</Label>
            <p className="text-sm text-muted-foreground">
              Permite recibir o no recibir reservas en este horario
            </p>
          </div>

          <Switch
            checked={formValues.active}
            onCheckedChange={(value) =>
              setFormValues({ ...formValues, active: value })
            }
          />
        </div>

        <div className="flex flex-row items-center justify-between gap-x-2 rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label>Calculo Automático</Label>
            <p className="text-sm text-muted-foreground">
              Permite crear todos los horarios correlativos en el rango que
              definas en <b>desde</b> y <b>hasta</b> (se utilizara la duracion
              del tour)
            </p>
          </div>

          <Switch
            checked={formValues.usePeriod}
            onCheckedChange={(value) =>
              setFormValues({ ...formValues, usePeriod: value })
            }
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Cuando creas un horario no comprobaremos si cumple con la duracion del
          Tour, pero ten cuidado que al cliente en la informacion del tour se le
          muestra la duracion del Tour.
        </p>
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
        <ButtonLoading
          variant="secondary"
          type="button"
          isWorking={isPending}
          onClick={handleSubmit}
        >
          Guardar Cambios
        </ButtonLoading>
      </div>
    </div>
  );
}

export function FormSchedules({
  // schedules,
  tour
}: {
  schedules: ScheduleWithAvailable[];
  tour: Tour;
}) {
  const { openModal, closeModal } = useModal();
  const [day, setDay] = React.useState(new Date());
  const [schedulesDay, setSchedules] = React.useState<ScheduleWithAvailable[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);
  // console.log('schedules', schedulesDay);
  React.useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      const response = await axios.get<{ schedules: ScheduleWithAvailable[] }>(
        // `/tours/${tour.id}/schedules?date=${day.toISOString()}`
        `/schedules/${tour.id}/date/${day.toISOString().split('T')[0]}`
      );
      setSchedules(response.data.schedules);
      setIsLoading(false);
    };
    if (day) {
      fetchSchedules();
    }
  }, [day, tour.id]);

  const handleEdit = (schedule: ScheduleWithAvailable) => {
    openModal({
      className: 'max-w-2xl',
      title: 'Editar Horario',
      description: '',
      component: (
        <EditSchedule
          schedule={schedule}
          closeModal={closeModal}
          duration={tour.duration}
        />
      )
    });
  };

  return (
    <div className="space-y-4">
      <p>Selecciona el dia del calendario: {day.getDate().toLocaleString()}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-bold">Calendario</h3>
          <Calendar selected={day} onDayClick={setDay} fromDate={new Date()} />
        </div>
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-bold">Horarios</h3>
          {isLoading && <PendingContent withOutText sizeIcon="sm" />}

          {!isLoading &&
            schedulesDay.length > 0 &&
            schedulesDay.map((schedule) => (
              <button
                key={schedule.id}
                type="button"
                className="relative whitespace-nowrap rounded-md bg-secondary px-4 py-2 pt-9 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                onClick={() => handleEdit(schedule)}
              >
                <div className="absolute right-4 top-2 text-xs text-muted-foreground/50">
                  {formatDateOnly(schedule.date, 'cccc dd, MMM')}
                </div>
                <div className="flex w-full items-center justify-between gap-x-4">
                  <div className="flex flex-col">
                    <p className="text-left text-xs uppercase text-muted-foreground">
                      desde
                    </p>
                    <p className="font-mono text-xl font-bold">
                      {schedule.startTime.slice(0, 5)}
                    </p>
                  </div>
                  <div className="relative flex flex-1 items-center justify-center">
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] rounded-full bg-muted-foreground" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 48 48"
                      className="absolute size-10 bg-secondary p-2 text-muted-foreground"
                    >
                      <path
                        fill="currentColor"
                        d="M24.15 42c-2.5 0 -4.85 -0.475 -7.05 -1.425 -2.2 -0.95 -4.125 -2.2417 -5.775 -3.875 -1.65 -1.6333 -2.95 -3.55 -3.9 -5.75C6.475 28.75 6 26.4 6 23.9s0.475 -4.8333 1.425 -7c0.95 -2.1667 2.25 -4.0583 3.9 -5.675C12.975 9.60833 14.9 8.33333 17.1 7.4c2.2 -0.93333 4.55 -1.4 7.05 -1.4 2.6667 0 5.1917 0.58333 7.575 1.75 2.3833 1.16667 4.4417 2.7667 6.175 4.8v-5.3h3v10.4H30.45v-3h5.25c-1.4667 -1.7 -3.1917 -3.0667 -5.175 -4.1C28.5417 9.51667 26.4167 9 24.15 9c-4.1667 0 -7.7333 1.425 -10.7 4.275C10.4833 16.125 9 19.6167 9 23.75c0 4.2333 1.4667 7.8333 4.4 10.8C16.3333 37.5167 19.9167 39 24.15 39c4.1667 0 7.6833 -1.4667 10.55 -4.4 2.8667 -2.9333 4.3 -6.4833 4.3 -10.65h3c0 5 -1.7333 9.2583 -5.2 12.775C33.3333 40.2417 29.1167 42 24.15 42Zm6.1 -9.85 -7.7 -7.6v-10.7h3v9.45L32.4 30l-2.15 2.15Z"
                        strokeWidth={1}
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-left text-xs uppercase text-muted-foreground">
                      hasta
                    </p>
                    <p className="font-mono text-xl font-bold">
                      {schedule.endTime.slice(0, 5)}
                    </p>
                  </div>
                </div>

                <div className="absolute left-2 top-2 flex items-center gap-x-2 rounded-md bg-background px-2 py-0.5">
                  <div className="relative flex size-2">
                    <span
                      className={cn(
                        'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                        schedule.active == '1' ? 'bg-green-400' : 'bg-red-400'
                      )}
                    ></span>
                    <span
                      className={cn(
                        'relative inline-flex h-2 w-2 rounded-full',
                        schedule.active == '1' ? 'bg-green-500' : 'bg-red-500'
                      )}
                    ></span>
                  </div>
                  <p className="text-xs font-medium">
                    {schedule.available ?? 0}
                  </p>
                </div>
              </button>
            ))}

          {!isLoading && schedulesDay.length === 0 && (
            <>
              <p className="text-center text-sm text-muted-foreground">
                No hay horarios disponibles
              </p>
            </>
          )}
          {!isLoading && (
            <Button
              type="button"
              variant="secondary"
              className="min-w-[148px]"
              onClick={() =>
                openModal({
                  title: 'Agregar Horario/s',
                  component: (
                    <AddSchedule
                      duration={tour.duration}
                      closeModal={closeModal}
                    />
                  )
                })
              }
            >
              Agregar Horario/s
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
