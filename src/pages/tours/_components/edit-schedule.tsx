import * as React from 'react';

import { ScheduleWithAvailable } from '@/types/tour.types';
import { useUpdateSchedule } from '@/services/hooks/schedule.mutation';

import { toast } from '@/components/notifications';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ButtonLoading } from '@/components/button-loading';
import { TimePicker } from '@/components/ui/time-picker-input';
import { Alert } from '@/components/ui/alert';
import { CollapsibleHelp } from '@/components/collapsible-help';

export function EditSchedule({
  schedule,
  closeModal,
  duration,
  capacity
}: {
  schedules: ScheduleWithAvailable[];
  schedule: ScheduleWithAvailable;
  duration: number | string;
  capacity: number;
  closeModal: () => void;
}) {
  const [formValues, setFormValues] = React.useState<{
    startTime: string;
    active: boolean;
  }>({
    startTime: schedule.startTime,
    active: schedule.active === '1' ? true : false
  });

  const hasBookings = React.useMemo(
    () => schedule.available !== capacity,
    [capacity, schedule.available]
  );

  const { mutateAsync, isPending } = useUpdateSchedule();

  const handleSubmit = async () => {
    toast.dismiss();

    await mutateAsync(
      {
        scheduleId: schedule.id,
        startTime: formValues.startTime,
        active: formValues.active
      },
      {
        onSuccess: () => {
          toast.success('Horario actualizado correctamente.');
          setTimeout(() => {
            closeModal();
          }, 150);
        }
      }
    );
  };

  return (
    <div>
      <div className="col-span-2 flex flex-col gap-y-2">
        {hasBookings && (
          <Alert variant="warning">
            Este horario tiene <b>{capacity - schedule.available}</b> reservas
            realizadas.
          </Alert>
        )}
        <Alert variant="info">
          Duracion configurado en el Tour:{' '}
          <b className="font-bold text-white">{duration}</b>
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
                  disabled={hasBookings}
                  setTime={(field) =>
                    setFormValues({
                      ...formValues,
                      startTime: field
                    })
                  }
                  time={formValues.startTime}
                />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="flex flex-col gap-y-2">
              {hasBookings && (
                <Alert variant="warning">
                  Este campo no se puede editar porque ya existen reservas
                  realizadas.
                </Alert>
              )}
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

        <CollapsibleHelp title="Click para ver Tips" noIcon>
          <div>
            <p className="text-sm font-bold italic text-muted-foreground">
              * Edición limitada con reservas existentes:
            </p>
            <p className="ml-3 text-sm text-muted-foreground">
              No es posible editar un horario si ya tiene reservas realizadas.
              Sin embargo, puedes cambiar el estado a inactivo para dejar de
              recibir nuevas reservas.
            </p>
            <p className="text-sm font-bold italic text-muted-foreground">
              * Edición de hora de inicio:
            </p>
            <p className="ml-3 text-sm text-muted-foreground">
              Solo puedes modificar la hora de inicio si no hay reservas
              asociadas al horario.
            </p>

            <p className="text-sm font-bold italic text-muted-foreground">
              * Gestión de horarios:
            </p>
            <p className="ml-3 text-sm text-muted-foreground">
              Usa esta sección para habilitar o deshabilitar un horario. Por
              ejemplo, puedes pausar las reservas temporalmente en un horario
              específico.
            </p>
            <p className="text-sm font-bold italic text-muted-foreground">
              * Visibilidad en la web:
            </p>
            <p className="ml-3 text-sm text-muted-foreground">
              Si el estado de un horario está inactivo, no será visible para los
              usuarios en la web de reservas.
            </p>
          </div>
        </CollapsibleHelp>
      </div>

      <div className="mt-4 flex items-center justify-between space-x-2">
        <div className="ml-auto flex gap-x-2 transition-opacity duration-500 ease-in-out">
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
    </div>
  );
}
