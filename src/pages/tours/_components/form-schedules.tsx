import * as React from 'react';
import { es } from 'date-fns/locale';

import { ScheduleWithAvailable, Tour } from '@/types/tour.types';
import { useModal } from '@/hooks/use-modal';
import { formatDateOnly, sleep } from '@/lib/utils';
import { getSchedules } from '@/services/schedule.service';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { PendingContent } from '@/components/pending-content';
import { ScrollArea } from '@/components/ui/scroll-area';

import { CardSchedule } from './card-schedule';
import { EditSchedule } from './edit-schedule';
import { AddPeriodSchedule } from './add-period-schedule';
import { StatusSchedule } from './status-schedule';
import { CollapsibleHelp } from '@/components/collapsible-help';

export function FormSchedules({ tour }: { tour: Tour }) {
  const { openModal, closeModal } = useModal();
  const [day, setDay] = React.useState(new Date());
  const [isLoading, setIsLoading] = React.useState(true);
  const [toggleUpdate, setToggleUpdate] = React.useState(false);
  const [schedulesDay, setSchedules] = React.useState<ScheduleWithAvailable[]>(
    []
  );

  React.useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      await sleep(300);
      const response = await getSchedules(tour.id, day);
      setSchedules(response.data.schedules);
      setIsLoading(false);
    };
    if (day) {
      fetchSchedules();
    }
  }, [day, tour.id, toggleUpdate]);

  const handleEdit = (schedule: ScheduleWithAvailable) => {
    openModal({
      className: 'max-w-2xl',
      title: 'Editar Horario',
      description: '',
      component: (
        <EditSchedule
          schedules={schedulesDay}
          schedule={schedule}
          closeModal={closeModal}
          duration={tour.duration}
          capacity={Number(tour.capacity)}
          setToggleUpdate={setToggleUpdate}
        />
      )
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-y-2">
          <h3 className="text-lg font-bold">Calendario</h3>
          <Calendar
            locale={es}
            selected={day}
            onDayClick={setDay}
            fromDate={new Date()}
          />
          <p className="mt-3 text-sm font-bold text-muted-foreground">
            Seleccionado: {formatDateOnly(day, 'dd/MM/yyyy')}
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-bold">Horarios</h3>

          <ScrollArea type="always" className="h-[270px] w-full pr-4">
            <div className="flex flex-col space-y-2">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <PendingContent withOutText sizeIcon="sm" />
                </div>
              )}
              {!isLoading &&
                schedulesDay.length > 0 &&
                schedulesDay.map((schedule) => (
                  <CardSchedule
                    schedule={schedule}
                    key={schedule.id}
                    allowEdit={schedule.available !== 0}
                    onHandleEdit={handleEdit}
                  />
                ))}

              {!isLoading && schedulesDay.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-center text-sm text-muted-foreground">
                    No hay horarios disponibles
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          {!isLoading && (
            <Button
              type="button"
              className="min-w-[148px]"
              onClick={() =>
                openModal({
                  title: 'Agregar Horarios',
                  component: (
                    <AddPeriodSchedule
                      tourId={tour.id}
                      schedules={schedulesDay}
                      closeModal={closeModal}
                      date={day.toISOString().split('T')[0]}
                      setToggleUpdate={setToggleUpdate}
                    />
                  )
                })
              }
            >
              Agregar Horarios
            </Button>
          )}
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
              indica que hay 5 espacios disponibles para reservar y se encuentra
              activo para nuevas reservas.
            </li>
            <li>
              <StatusSchedule
                active={'1'}
                available={0}
                className="inline-flex"
              />{' '}
              indica que se han ocupado todos los espacios disponibles para
              reservar y aun se encuentra activo (es visible).
            </li>
            <li>
              <StatusSchedule
                active={'0'}
                available={7}
                className="inline-flex"
              />{' '}
              indica que el horario tiene aun 7 espacios disponibles, pero se
              encuentra pausado/inactivo, por lo que no pueden reservar y no
              sera visible.
            </li>
          </ul>
        </div>
        <p className="text-sm text-muted-foreground">
          * Los horarios no se pueden eliminar, solo se pueden editar y/o
          agregar nuevos.
        </p>
      </CollapsibleHelp>
    </div>
  );
}
