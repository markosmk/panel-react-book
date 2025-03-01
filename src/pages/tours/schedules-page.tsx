import { useParams } from 'react-router-dom';

import { useTourDetail } from '@/services/hooks/tour.query';
import { cn, formatPrice } from '@/lib/utils';

import { HeadingMain } from '@/components/heading-main';
import { PendingContent } from '@/components/pending-content';
import { ErrorContent } from '@/components/error-content';
import { NoContent } from '@/components/no-content';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { FormSchedules } from './_components/form-schedules';
import { ModifyPeriodSchedule } from './_components/modify-period-schedule';
import { useModalStore } from '@/utils/modal/use-modal-store';

export default function TourSchedulesPage() {
  const { tourId } = useParams();
  const { openModal, closeModal } = useModalStore();
  const {
    data: tourDetail,
    isLoading,
    isFetching,
    isError
  } = useTourDetail(tourId || '');

  const handleAddByRange = () => {
    if (!tourDetail?.tour.id) return;
    openModal({
      title: 'Agregar o Modificar Horarios',
      content: (
        <ModifyPeriodSchedule
          tourId={tourDetail?.tour.id}
          closeModal={closeModal}
          action="create"
        />
      )
    });
  };

  if (isLoading) return <PendingContent withOutText className="h-40" />;
  if (isError) return <ErrorContent />;
  if (!tourDetail) return <NoContent description="Tour no encontrado." />;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-4 pb-4 md:px-6 md:pb-6">
      <HeadingMain
        title="Gestion de Horarios"
        description={`Tour: ${tourDetail.tour.name}`}
        hasBackNavigation
      >
        <Button
          type="button"
          title="Acciones"
          disabled={isLoading || isFetching}
          onClick={handleAddByRange}
        >
          <span>Acciones</span>
        </Button>
      </HeadingMain>

      <Card className={cn(isFetching && 'cursor-wait')}>
        <CardContent>
          <h3 className="mb-1 text-lg font-bold">Informacion del Tour</h3>
          <Alert className="mb-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="flex flex-col">
                <p className="font-light text-muted-foreground">Precio:</p>
                <p className="font-semibold">
                  {formatPrice(Number(tourDetail.tour.price))}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="font-light text-muted-foreground">Capacidad:</p>
                <p className="font-semibold">
                  {tourDetail.tour.capacity} personas
                </p>
              </div>
              <div className="flex flex-col">
                <p className="font-light text-muted-foreground">Duracion:</p>
                <p className="font-semibold">{tourDetail.tour.duration}</p>
              </div>
            </div>
          </Alert>

          <FormSchedules tour={tourDetail.tour} />
        </CardContent>
      </Card>
    </div>
  );
}
