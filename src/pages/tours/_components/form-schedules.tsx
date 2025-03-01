import * as React from 'react';
import { es } from 'date-fns/locale';

import { Tour } from '@/types/tour.types';

import { Calendar } from '@/components/ui/calendar';
import { CollapsibleHelp } from '@/components/collapsible-help';
import { StatusSchedule } from './status-schedule';
import { ListHandleSchedules } from './list-handle-schedules';
import { useSchedules } from '@/services/hooks/schedule.query';

export function FormSchedules({ tour }: { tour: Tour }) {
  const [day, setDay] = React.useState(new Date());
  const { data, isLoading } = useSchedules(Number(tour.id), day);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:min-h-96 md:flex-row">
        <div className="flex flex-col gap-y-2">
          <div className="mb-2 flex justify-between gap-x-2">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">Calendario</h3>
              <p className="text-sm text-muted-foreground">
                <span>Escoge un día para ver los horarios.</span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Calendar
              locale={es}
              selected={day}
              onDayClick={setDay}
              fromDate={new Date()}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-y-2">
          <ListHandleSchedules
            schedules={data?.schedules ?? []}
            selectedDay={day}
            isLoading={isLoading}
            tour={tour}
          />
        </div>
      </div>

      <CollapsibleHelp title="Click para ver Ayuda" noIcon>
        <div className="relative mb-2 text-sm text-muted-foreground">
          <p>
            <b>Como leer los estados:</b>
          </p>
          <ul>
            <li>
              <StatusSchedule
                active={'1'}
                available={5}
                className="inline-flex"
              />{' '}
              Hay <b>5 espacios disponibles para reservar</b> y el horario está{' '}
              <b>activo</b>, permitiendo nuevas reservas.
            </li>
            <li>
              <StatusSchedule
                active={'1'}
                available={0}
                className="inline-flex"
              />{' '}
              Todos los espacios disponibles para reservar están <b>ocupados</b>
              , pero el horario sigue <b>activo</b> y es <b>visible</b> para los
              usuarios.
            </li>
            <li>
              <StatusSchedule
                active={'0'}
                available={7}
                className="inline-flex"
              />{' '}
              Hay <b>7 espacios disponibles</b>, pero el horario está{' '}
              <b>inactivo</b>
              (pausado), por lo que <b>no se pueden hacer reservas</b> y no será{' '}
              <b>visible</b> en la web.
            </li>
          </ul>
        </div>
        <p className="text-sm text-muted-foreground">
          * Solo se permite <b>eliminar</b> horarios que no tengan reservas
          asociadas.
        </p>
      </CollapsibleHelp>
    </div>
  );
}
