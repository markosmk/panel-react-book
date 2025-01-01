import * as React from 'react';
import { es } from 'date-fns/locale';
import axios from '@/lib/axios';

import { ScheduleWithAvailable, Tour } from '@/types/tour.types';
import { useModal } from '@/hooks/use-modal';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { PendingContent } from '@/components/pending-content';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardSchedule } from './card-schedule';
// import { AddSchedule } from './add-schedule';
import { EditSchedule } from './edit-schedule';
import { AddPeriodSchedule } from './add-period-schedule';

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
      const response = await axios.get<{ schedules: ScheduleWithAvailable[] }>(
        `/schedules/${tour.id}/date/${day.toISOString().split('T')[0]}`
      );
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
      <p className="text-lg font-bold">Tour: {tour.name}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-bold">Calendario</h3>
          <Calendar
            locale={es}
            selected={day}
            onDayClick={setDay}
            fromDate={new Date()}
          />
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
                  title: 'Agregar Horario/s',
                  component: (
                    // <AddSchedule
                    //   tourId={tour.id}
                    //   duration={tour.duration}
                    //   schedules={schedulesDay}
                    //   closeModal={closeModal}
                    //   date={day.toISOString().split('T')[0]}
                    //   setToggleUpdate={setToggleUpdate}
                    // />
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
    </div>
  );
}
