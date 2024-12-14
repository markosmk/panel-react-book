import { useParams } from 'react-router-dom';

import { FormTour } from './form-tour';
import { useTourDetail } from '@/services/hooks/tour.query';
import { cn, formatDateOnly } from '@/lib/utils';

import { Card, CardContent } from '@/components/ui/card';
import { PendingContent } from '@/components/pending-content';
import { HeadingMain } from '@/components/heading-main';

export default function TourDetailPage() {
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
    <div className="mx-auto w-full max-w-2xl space-y-8 px-6">
      <HeadingMain
        title={tourDetail.tour.name}
        description={`Ultima actualizacion: ${formatDateOnly(tourDetail.tour.updated_at)}`}
      />
      <Card className={cn(isFetching && 'cursor-wait')}>
        <CardContent>
          <FormTour data={tourDetail.tour} isFetching={isFetching} />
        </CardContent>
      </Card>
    </div>
  );
}
