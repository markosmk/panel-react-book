import * as React from 'react';
import { formatISO } from 'date-fns';

import { cn, formatDateOnly, formatTimeTo24Hour } from '@/lib/utils';
import { useConfirmStore } from '@/utils/confirm-modal/use-confirm-store';
import { ScheduleWithAvailable, Tour } from '@/types/tour.types';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PendingContent } from '@/components/pending-content';
import { CardSchedule } from './card-schedule';
import { EditSchedule } from './edit-schedule';
import { AddSingleSchedule } from './add-single-schedule';
import { PopConfirm } from '@/components/ui/pop-confirm';
import { toast } from '@/components/notifications';
import { useModifySingleSchedule } from '@/services/hooks/schedule.mutation';
import { useModalStore } from '@/utils/modal/use-modal-store';

type Props = {
  selectedDay: Date | null;
  schedules: ScheduleWithAvailable[];
  isLoading: boolean;
  tour: Tour;
};

export function ListHandleSchedules({
  isLoading,
  selectedDay,
  schedules,
  tour
}: Props) {
  const { openConfirm } = useConfirmStore();
  const { openModal, closeModal } = useModalStore();
  const [selectedSchedules, setSelectedSchedules] = React.useState<string[]>(
    []
  );

  const mutationModify = useModifySingleSchedule();

  React.useEffect(() => {
    setSelectedSchedules([]);
  }, [selectedDay]);

  const handleAddSingle = () => {
    if (!selectedDay) return;
    openModal({
      title:
        'Agregar Horarios al ' + formatDateOnly(selectedDay, 'dd MMM, yyyy'),
      content: (
        <AddSingleSchedule
          tourId={tour.id}
          schedules={schedules}
          closeModal={closeModal}
          date={formatISO(selectedDay, { representation: 'date' })}
        />
      )
    });
  };

  const handleEditSingle = (schedule: ScheduleWithAvailable) => {
    openModal({
      className: 'max-w-2xl',
      title: 'Editar Horario',
      description: '',
      content: (
        <EditSchedule
          schedules={schedules}
          schedule={schedule}
          closeModal={closeModal}
          duration={tour.duration}
          capacity={Number(tour.capacity)}
        />
      )
    });
  };

  const handleDeleteSingle = (schedule: ScheduleWithAvailable) => {
    openConfirm({
      title:
        'Eliminar Horario de las ' + formatTimeTo24Hour(schedule.startTime),
      description: '¿Estás seguro de que deseas eliminar este horario?',
      onConfirm: async () => {
        await mutationModify.mutateAsync(
          {
            action: 'delete',
            ids: [schedule.id]
          },
          {
            onSuccess: () => {
              toast.success('Horario eliminado correctamente.');
            }
          }
        );
      }
    });
  };

  const handleModifySelected = async (
    action: 'delete' | 'resume' | 'pause'
  ) => {
    const actionLabel = {
      delete: 'eliminados',
      resume: 'reanudados',
      pause: 'pausados'
    }[action];

    await mutationModify.mutateAsync(
      {
        action: action,
        ids: selectedSchedules
      },
      {
        onSuccess: () => {
          toast.success('Horarios ' + actionLabel + ' correctamente.');
          setSelectedSchedules([]);
        },
        onError: (error) => {
          console.log(error);
        }
      }
    );
  };

  const handleSelected = (schedule: ScheduleWithAvailable) => {
    setSelectedSchedules((prev) => {
      if (prev.includes(schedule.id)) {
        return prev.filter((id) => id !== schedule.id);
      }
      return [...prev, schedule.id];
    });
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-x-2">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold">
            Horarios{' '}
            {!isLoading && schedules?.length > 0 && `(${schedules?.length})`}
          </h3>

          <p className="text-sm text-muted-foreground">
            {!selectedDay ? (
              <span>Seleccione una fecha</span>
            ) : (
              <span>Dia: {formatDateOnly(selectedDay, 'dd/MM/yyyy')}</span>
            )}
          </p>
        </div>
        <div className="flex justify-end gap-x-1.5">
          <Button
            variant="default"
            size="sm"
            title="Agregar"
            onClick={handleAddSingle}
            disabled={isLoading || !selectedDay}
            className="h-10 min-h-10 gap-x-1"
          >
            <Icons.plus className="size-5" />
            Agregar
          </Button>
        </div>
      </div>
      <ScrollArea type="always" className="relative h-[320px] w-full pr-4">
        <div className="mb-6 flex flex-col space-y-2">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <PendingContent withOutText sizeIcon="sm" />
            </div>
          )}
          {!isLoading &&
            schedules.length > 0 &&
            schedules.map((schedule) => (
              <CardSchedule
                key={schedule.id}
                schedule={schedule}
                isEditable={schedule.available !== 0}
                onHandleEdit={handleEditSingle}
                onHandleDelete={handleDeleteSingle}
                onHandleSelected={handleSelected}
                isSelected={selectedSchedules.includes(schedule.id)}
              />
            ))}

          {!isLoading && schedules.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-center text-sm text-muted-foreground">
                No hay horarios creados para este dia <br />{' '}
                <Button
                  type="button"
                  size="sm"
                  className="mt-1"
                  disabled={isLoading || !selectedDay}
                  variant="link"
                  onClick={handleAddSingle}
                >
                  Agregar
                </Button>
              </p>
            </div>
          )}
        </div>
        <div
          className={cn(
            'pointer-events-none absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-t from-card to-transparent transition-opacity duration-300',
            schedules.length === 0 || schedules.length === 1
              ? 'opacity-0'
              : 'opacity-100'
          )}
        ></div>
      </ScrollArea>

      {!isLoading && schedules.length > 0 && (
        <div className="mt-2 flex flex-col space-y-1">
          <div className="flex items-center justify-between gap-x-2">
            <h4 className="text-xs font-light uppercase text-muted-foreground">
              Acciones por Seleccion
            </h4>
            {!isLoading && selectedSchedules.length > 0 && (
              <div className="text-right text-xs text-muted-foreground">
                {selectedSchedules.length} seleccionado/s
              </div>
            )}
          </div>
          <div className="flex items-center gap-x-2 rounded-md bg-background p-2">
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setSelectedSchedules(
                    schedules.map((schedule) => schedule.id)
                  );
                }}
              >
                Todos
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSelectedSchedules([])}
              >
                Ninguno
              </Button>
            </div>
            <div className="flex flex-1 justify-end gap-x-1">
              <PopConfirm
                isError={mutationModify.isError}
                isPending={mutationModify.isPending}
                confirmationText={
                  <>
                    ¿Estás seguro de que quieres{' '}
                    <b className="text-orange-500">PAUSAR</b> los horarios
                    seleccionados?
                  </>
                }
                onConfirm={() => handleModifySelected('pause')}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  disabled={selectedSchedules.length === 0}
                >
                  <Icons.paused className="size-5" />
                  <span className="sr-only">Pausar</span>
                </Button>
              </PopConfirm>

              <PopConfirm
                isError={mutationModify.isError}
                isPending={mutationModify.isPending}
                confirmationText={
                  <>
                    ¿Estás seguro de que quieres{' '}
                    <b className="text-lime-500">REANUDAR</b> los horarios
                    seleccionados?
                  </>
                }
                onConfirm={() => handleModifySelected('resume')}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  disabled={selectedSchedules.length === 0}
                >
                  <Icons.resume className="size-5" />

                  <span className="sr-only">Reanudar</span>
                </Button>
              </PopConfirm>
              <PopConfirm
                isError={mutationModify.isError}
                isPending={mutationModify.isPending}
                confirmationText={
                  <>
                    ¿Estás seguro de que quieres{' '}
                    <b className="text-red-500">ELIMINAR</b> los horarios
                    seleccionados?
                  </>
                }
                onConfirm={() => handleModifySelected('delete')}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  disabled={selectedSchedules.length === 0}
                >
                  <Icons.remove className="size-5" />
                  <span className="sr-only">Activar</span>
                </Button>
              </PopConfirm>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
