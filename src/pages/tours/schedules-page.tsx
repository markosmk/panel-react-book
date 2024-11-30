import { useParams } from 'react-router-dom';

import { useTourDetail } from '@/services/hooks/tour.query';
import { cn, formatDuration } from '@/lib/utils';

import { HeadingMain } from '@/components/heading-main';
import { PendingContent } from '@/components/pending-content';
import { Card, CardContent } from '@/components/ui/card';

import { FormSchedules } from './_components/form-schedules';

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
    <div className="mx-auto w-full max-w-2xl space-y-8 px-6">
      <HeadingMain
        title="Gestion de Horarios"
        description={`Tour: ${tourDetail.tour.name} | Duracion: ${formatDuration(tourDetail.tour.duration)} | Capacidad: para ${tourDetail.tour.capacity} personas`}
      />

      <Card className={cn(isFetching && 'cursor-wait')}>
        <CardContent>
          {tourDetail.availability && (
            <div className="my-4 text-muted-foreground">
              El tour tiene disponibilidad desde:{' '}
              {tourDetail.availability.dateFrom} a{' '}
              {tourDetail.availability.dateTo}
            </div>
          )}
          <FormSchedules
            schedules={tourDetail.schedules}
            tour={tourDetail.tour}
          />
        </CardContent>
      </Card>
    </div>
  );
}
