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

type AddScheduleProps = {
  tourId: string;
  schedules: ScheduleWithAvailable[];
  closeModal: () => void;
  duration: number;
  date: string | undefined;
  setToggleUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export function AddSchedule({
  tourId,
  schedules,
  closeModal,
  duration,
  date,
  setToggleUpdate
}: AddScheduleProps) {
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

  const periodCount = React.useMemo(() => {
    if (!formValues.usePeriod) return 0;

    const startInMinutes = convertToMinutes(formValues.startTime);
    const endInMinutes = convertToMinutes(formValues.endTime);

    if (startInMinutes > endInMinutes) return 0;

    const rangeInMinutes = endInMinutes - startInMinutes;

    // Si el rango es negativo (es decir, el endTime es antes del startTime),
    // podemos asumir que cruza medianoche y ajustamos el cálculo.
    const adjustedRangeInMinutes =
      rangeInMinutes < 0 ? 1440 + rangeInMinutes : rangeInMinutes;

    // calcular cuantos periodos de 'duration' caben en ese rango
    return Math.floor(adjustedRangeInMinutes / Number(duration));
  }, [formValues, duration]);

  const handleSubmit = async () => {
    try {
      setErrors(null);
      const { startTime, endTime, usePeriod } = formValues;

      const startInMinutes = convertToMinutes(startTime);
      const endInMinutes = convertToMinutes(endTime);

      if (startTime === '00:00:00' && endTime === '00:00:00') {
        setErrors('Ambos tiempos no pueden ser "00:00:00".');
        return;
      }

      if (startTime === endTime) {
        setErrors('El tiempo inicial y final no pueden ser iguales.');
        return;
      }

      if (startInMinutes > endInMinutes && !usePeriod) {
        setErrors(
          'La hora de inicio no puede ser posterior a la hora de fin si no cruza la medianoche.'
        );
        return;
      }

      // Calcular la duración efectiva del rango
      const rangeInMinutes =
        endInMinutes >= startInMinutes
          ? endInMinutes - startInMinutes // Caso normal
          : 1440 - startInMinutes + endInMinutes; // Cruza medianoche

      const minRequiredDuration = usePeriod
        ? Number(duration) * 2
        : Number(duration);

      if (startInMinutes + Number(duration) > 1440) {
        setErrors(
          `El rango no puede cruzar la medianoche cuando "Usar Periodo" está activado.`
        );
        return;
      }

      if (rangeInMinutes !== Number(duration)) {
        setErrors(
          `El rango debe ser exactamente de ${duration} minutos cuando "Calculo Automático" está desactivado.`
        );
        return;
      }

      if (usePeriod) {
        // Validación de que el rango sea al menos 2 veces la duración
        if (rangeInMinutes < minRequiredDuration) {
          setErrors(
            `El rango debe ser al menos ${minRequiredDuration} minutos cuando "Calculo Automático" está activado.`
          );
          return;
        }
        // Validar que el endTime no exceda las 23:59
        if (endInMinutes > 1440) {
          setErrors(
            `El rango de tiempo no puede exceder las 23:59. Por favor, ajusta el 'Hasta'`
          );
          return;
        }

        // Validar que endTime no esté antes de startTime en un solo día
        if (startInMinutes > endInMinutes) {
          setErrors(`El rango de tiempo debe estar dentro del mismo día.`);
          return;
        }
      }

      if (doesOverlap(schedules, startInMinutes, endInMinutes)) {
        setErrors(`El rango definido se superpone con un periodo existente.`);
        return;
      }

      setIsPending(true);
      await sleep(1000);

      await axiosApp.post('/schedules/' + tourId, {
        date,
        endTime: formValues.endTime,
        startTime: formValues.startTime,
        active: formValues.active ? '1' : '0'
      });

      toast.success('Horario creado correctamente.');
      closeModal();
      setToggleUpdate((prev) => !prev);
    } catch (error) {
      console.error(error);
      setErrors('Error al actualizar el horario');
    } finally {
      setIsPending(false);
    }
  };

  // Actualizar automáticamente el endTime si usePeriod es false
  React.useEffect(() => {
    if (!formValues.usePeriod) {
      // Calcular endTime sumando la duración al startTime
      const startInMinutes = convertToMinutes(formValues.startTime);
      const endInMinutes = startInMinutes + Number(duration);

      const endHour = Math.floor(endInMinutes / 60) % 24; // Ajustar si pasa medianoche
      const endMinute = endInMinutes % 60;

      // Formatear el endTime como HH:mm:ss
      const calculatedEndTime = `${String(endHour).padStart(2, '0')}:${String(
        endMinute
      ).padStart(2, '0')}:00`;

      // Actualizar el estado del formulario
      setFormValues((prev) => ({ ...prev, endTime: calculatedEndTime }));
    }
  }, [formValues.startTime, formValues.usePeriod, duration]);

  return (
    <div>
      <div className="col-span-2 flex flex-col gap-y-2">
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
                  setDate={(field) => {
                    setFormValues({
                      ...formValues,
                      startTime: formatTime(field)
                    });
                    setErrors(null);
                  }}
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
                  setDate={(field) => {
                    setFormValues({
                      ...formValues,
                      endTime: formatTime(field)
                    });
                    setErrors(null);
                  }}
                  disabled={!formValues.usePeriod} // Deshabilitado si usePeriod es false
                  date={timeToDate(formValues.endTime) || new Date()}
                />
              </div>
            </div>
          </div>
        </div>

        {errors && <p className="text-sm text-destructive">{errors}</p>}

        <div className="flex flex-row items-center justify-between gap-x-2 rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="active">Estado</Label>
            <p className="text-sm text-muted-foreground">
              Permite recibir o no recibir reservas en este horario
            </p>
          </div>

          <Switch
            id="active"
            checked={formValues.active}
            onCheckedChange={(value) => {
              setFormValues({ ...formValues, active: value });
              setErrors(null);
            }}
          />
        </div>

        <div className="flex flex-row items-center justify-between gap-x-2 rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label
              htmlFor="usePeriod"
              className="mb-1 flex w-full items-center justify-between"
            >
              Calculo Automático{' '}
              {formValues.usePeriod && (
                <span className="text-xs leading-3 text-muted-foreground">
                  Horarios a crear: {periodCount}
                </span>
              )}
            </Label>
            <p className="text-sm text-muted-foreground">
              Permite crear todos los horarios correlativos en el rango que
              definas en <b>desde</b> y <b>hasta</b> (se utilizara la duracion
              del tour)
            </p>
          </div>

          <Switch
            id="usePeriod"
            checked={formValues.usePeriod}
            onCheckedChange={(value) => {
              setFormValues({ ...formValues, usePeriod: value });
              setErrors(null);
            }}
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
        <ButtonLoading
          type="button"
          isWorking={isPending}
          onClick={handleSubmit}
        >
          {`Crear Horario${formValues.usePeriod ? 's' : ''}`}
        </ButtonLoading>
      </div>
    </div>
  );
}
