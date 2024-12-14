import * as React from 'react';
import { toast } from 'sonner';

import axiosApp from '@/lib/axios';
import { ScheduleWithAvailable } from '@/types/tour.types';
import {
  convertToMinutes,
  doesOverlap,
  formatDuration,
  formatTime,
  sleep,
  timeToDate
} from '@/lib/utils';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ButtonLoading } from '@/components/button-loading';
import { TimePicker } from '@/components/ui/time-picker-input';
import { Alert } from '@/components/ui/alert';

export function EditSchedule({
  schedules,
  schedule,
  closeModal,
  duration,
  capacity,
  setToggleUpdate
}: {
  schedules: ScheduleWithAvailable[];
  schedule: ScheduleWithAvailable;
  duration: number;
  capacity: number;
  closeModal: () => void;
  setToggleUpdate: React.Dispatch<React.SetStateAction<boolean>>;
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
      setErrors(null);
      const { startTime, endTime } = formValues;

      const startInMinutes = convertToMinutes(startTime);
      const endInMinutes = convertToMinutes(endTime);

      if (startInMinutes > endInMinutes) {
        setErrors('El rango de tiempo debe estar dentro del mismo día.');
        return;
      }

      if (doesOverlap(schedules, startInMinutes, endInMinutes, schedule.id)) {
        setErrors('El rango definido se superpone con un periodo existente.');
        return;
      }

      setIsPending(true);
      await sleep(1000);

      await axiosApp.put(`/schedules/${schedule.id}`, {
        startTime: formValues.startTime,
        endTime: formValues.endTime,
        active: formValues.active ? '1' : '0'
      });

      toast.success('Horario actualizado correctamente.');
      closeModal();
      setToggleUpdate((prev) => !prev);
    } catch (error) {
      console.error(error);
      setErrors('Error al actualizar el horario, contacta a un administrador.');
    } finally {
      setIsPending(false);
    }
  };

  React.useEffect(() => {
    const startInMinutes = convertToMinutes(formValues.startTime);
    const endInMinutes = startInMinutes + Number(duration);

    const endHour = Math.floor(endInMinutes / 60) % 24; // only 0-23
    const endMinute = endInMinutes % 60;

    const calculatedEndTime = `${String(endHour).padStart(2, '0')}:${String(
      endMinute
    ).padStart(2, '0')}:00`;

    setFormValues((prev) => ({ ...prev, endTime: calculatedEndTime }));
  }, [formValues.startTime, duration]);

  return (
    <div>
      <div className="col-span-2 flex flex-col gap-y-2">
        {capacity !== schedule.available && (
          <Alert variant="warning">
            Ten en cuenta que este horario {capacity - schedule.available} tiene
            reservas realizadas.
          </Alert>
        )}

        <Alert variant="info">
          <p className="flex w-full gap-x-2 text-base font-medium leading-none">
            Duracion del Tour:{' '}
            <b className="font-bold text-white">
              {formatDuration(Number(duration))}
            </b>
            <em className="text-xs text-muted-foreground">
              ({formatDuration(Number(duration), true)})
            </em>
          </p>
        </Alert>

        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
          <div className="col-span-1">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row items-center gap-x-4">
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Desde
                </p>
                <TimePicker
                  name="from"
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
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Hasta
                </p>
                <TimePicker
                  name="to"
                  setDate={(field) =>
                    setFormValues({ ...formValues, endTime: formatTime(field) })
                  }
                  date={timeToDate(formValues.endTime) || new Date()}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </div>

        {errors && <p className="text-sm text-destructive">{errors}</p>}

        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="active">Estado</Label>
            <p className="text-sm text-muted-foreground">
              Permite recibir o no recibir reservas en este horario
            </p>
          </div>

          <Switch
            id="active"
            checked={formValues.active}
            onCheckedChange={(value) =>
              setFormValues({ ...formValues, active: value })
            }
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Validamos el horario, se comprueba que el tiempo sea el definido en el
          tour (para mostrar al cliente horarios acorde a la duracion definida
          en el tour), ademas comprobaremos que no se solapen con otros
          horarios.
        </p>
        <p className="text-sm text-muted-foreground">
          No es habitual hacer cambios en un horario especifico, pero si lo
          deseas puedes hacerlo. Esta seccion esta pensada para que puedas
          deshabilitar/habilitar un horario especifico.
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
