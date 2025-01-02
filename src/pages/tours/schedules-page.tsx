import { useParams } from 'react-router-dom';

import { useTourDetail } from '@/services/hooks/tour.query';
import { cn, formatDateOnly } from '@/lib/utils';

import { HeadingMain } from '@/components/heading-main';
import { PendingContent } from '@/components/pending-content';
import { Card, CardContent } from '@/components/ui/card';

import { FormSchedules } from './_components/form-schedules';
import { Alert } from '@/components/ui/alert';

export default function TourSchedulesPage() {
  const { tourId } = useParams();
  const {
    data: tourDetail,
    isLoading,
    isFetching
  } = useTourDetail(tourId || '');

  if (isLoading) return <PendingContent />;

  // TODO: better error handling
  if (!tourDetail) return <>No hay tour</>;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-4 pb-4 md:px-6 md:pb-6">
      <HeadingMain
        title="Gestion de Horarios"
        description={`Duracion: ${tourDetail.tour.duration} | Capacidad: para ${tourDetail.tour.capacity} personas`}
      />

      <Card className={cn(isFetching && 'cursor-wait')}>
        <CardContent>
          {tourDetail.availability && (
            <Alert variant="info" className="mb-4">
              <p>El tour tiene disponibilidad desde:</p>
              <p className="e font-semibold text-cyan-200">
                {formatDateOnly(
                  tourDetail.availability.dateFrom,
                  "dd 'de' MMMM, yyyy"
                )}
                <span className="px-1 text-cyan-500">{' -> '}</span>
                {formatDateOnly(
                  tourDetail.availability.dateTo,
                  "dd 'de' MMMM, yyyy"
                )}
              </p>
            </Alert>
          )}
          <FormSchedules tour={tourDetail.tour} />
        </CardContent>
      </Card>
    </div>
  );
}
