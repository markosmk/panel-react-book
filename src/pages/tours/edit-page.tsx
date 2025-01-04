import { Link, useParams } from 'react-router-dom';

import { FormTour } from './form-tour';
import { useTourDetail } from '@/services/hooks/tour.query';
import { cn, formatDateOnly } from '@/lib/utils';

import { Card, CardContent } from '@/components/ui/card';
import { PendingContent } from '@/components/pending-content';
import { HeadingMain } from '@/components/heading-main';
import { buttonVariants } from '@/components/ui/button';

export default function EditPage() {
  const { tourId } = useParams();
  const {
    data: tourDetail,
    isLoading,
    isFetching,
    isError
  } = useTourDetail(tourId || '');

  if (isLoading) return <PendingContent />;

  // TODO: better error handling
  if (!tourDetail) return <></>;

  if (isError) return <div>Error</div>;

  return (
    <div className="relative mx-auto w-full max-w-2xl space-y-8 px-4 pb-4 md:px-6 md:pb-6">
      <HeadingMain
        title={tourDetail.tour.name}
        description={`Ultima actualizacion: ${formatDateOnly(tourDetail.tour.updated_at)}`}
        hasBackNavigation
      >
        <Link
          to={`/tours/${tourId}/schedules`}
          className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
        >
          Ver Horarios
        </Link>
      </HeadingMain>
      <Card className={cn(isFetching && 'cursor-wait')}>
        <CardContent>
          <FormTour data={tourDetail.tour} isFetching={isFetching} />
        </CardContent>
      </Card>
    </div>
  );
}
