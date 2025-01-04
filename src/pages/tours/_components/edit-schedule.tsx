import * as React from 'react';
import { AxiosError } from 'axios';

import { ScheduleWithAvailable } from '@/types/tour.types';
import { convertToMinutes, formatTime, sleep, timeToDate } from '@/lib/utils';
import { toast } from '@/components/notifications';
import { updateSchedule } from '@/services/schedule.service';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ButtonLoading } from '@/components/button-loading';
import { TimePicker } from '@/components/ui/time-picker-input';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Icons } from '@/components/icons';

export function EditSchedule({
  schedule,
  closeModal,
  duration,
  capacity,
  setToggleUpdate
}: {
  schedules: ScheduleWithAvailable[];
  schedule: ScheduleWithAvailable;
  duration: number | string;
  capacity: number;
  closeModal: () => void;
  setToggleUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isPending, setIsPending] = React.useState(false);
  const [formValues, setFormValues] = React.useState<{
    duration: number;
    startTime: string;
    endTime: string;
    active: boolean;
  }>({
    duration: schedule?.endTime
      ? convertToMinutes(schedule.endTime) -
        convertToMinutes(schedule.startTime)
      : 30,
    startTime: schedule.startTime,
    endTime: schedule?.endTime || '',
    active: schedule.active === '1' ? true : false
  });

  const handleSubmit = async () => {
    toast.dismiss();
    try {
      const { startTime, endTime } = formValues;

      const startInMinutes = convertToMinutes(startTime);
      const endInMinutes = endTime ? convertToMinutes(endTime) : 0;

      if (startInMinutes > endInMinutes) {
        toast.error('El rango de tiempo debe estar dentro del mismo día.');
        return;
      }

      setIsPending(true);
      await sleep(500);

      await updateSchedule(schedule.id, {
        startTime: formValues.startTime,
        endTime: formValues.endTime,
        active: formValues.active ? '1' : '0'
      });

      toast.success('Horario actualizado correctamente.');
      closeModal();
      setToggleUpdate((prev) => !prev);
    } catch (error) {
      let message =
        'Error al actualizar el horario, contacta a un administrador.';
      if (error instanceof AxiosError) {
        message = error.response?.data.messages?.error;
      }
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  };

  React.useEffect(() => {
    const startInMinutes = convertToMinutes(formValues.startTime);
    const endInMinutes = startInMinutes + formValues.duration;

    const endHour = Math.floor(endInMinutes / 60) % 24; // only 0-23
    const endMinute = endInMinutes % 60;

    const calculatedEndTime = `${String(endHour).padStart(2, '0')}:${String(
      endMinute
    ).padStart(2, '0')}:00`;

    setFormValues((prev) => ({ ...prev, endTime: calculatedEndTime }));
  }, [formValues.startTime, formValues.duration]);

  return (
    <div>
      <div className="col-span-2 flex flex-col gap-y-2">
        {capacity !== schedule.available && (
          <Alert variant="warning">
            Ten en cuenta que este horario tiene{' '}
            <b>{capacity - schedule.available}</b> reservas realizadas.
          </Alert>
        )}

        <Alert variant="info">
          Duracion configurado en el Tour:{' '}
          <b className="font-bold text-white">{duration}</b>
        </Alert>

        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
          <div className="col-span-2">
            <Label htmlFor="duration">Duracion (opcional):</Label>
            <p className="text-sm text-muted-foreground">
              La duracion del tour en minutos, si colocas 0 (cero) puedes editar
              el campo.
            </p>
          </div>
          <Input
            id="duration"
            type="number"
            value={formValues.duration}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                duration: Number(e.target.value)
              })
            }
          />

          <p className="col-span-3 text-sm text-muted-foreground">
            Esto No actualizara la duracion del tour original, es opcional
            porque sirve simplemente para calcular automáticamente el horario
            "Hasta".
          </p>
        </div>

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
                  disabled={formValues.duration !== 0}
                />
              </div>
            </div>
          </div>
        </div>

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

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger>
              <div className="flex items-center">
                <Icons.help className="mr-2 h-4 w-4 text-muted-foreground" />
                Ver Ayuda y/o Tips
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <p className="text-sm text-muted-foreground">
                  * No es habitual hacer cambios en un horario especifico, pero
                  si lo deseas puedes hacerlo.
                </p>
                <p className="text-sm text-muted-foreground">
                  * Esta seccion esta pensada para que puedas
                  deshabilitar/habilitar un horario.{' '}
                  <em>
                    <b>Por ejemplo</b> para pausar reservas en un horario
                    especifico.
                  </em>
                </p>
                <p className="text-sm text-muted-foreground">
                  * Si el estado esta inactivo, el horario no se vera en la web
                  de reservas.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
