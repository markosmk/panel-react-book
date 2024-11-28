import { useTourDetail } from '@/services/hooks/tour.query';
import { useParams } from 'react-router-dom';
import { FormTour } from './form-tour';
import { Card, CardContent } from '@/components/ui/card';
import { PendingContent } from '@/components/pending-content';
import { HeadingMain } from '@/components/heading-main';
import { cn } from '@/lib/utils';

export default function TourDetailPage() {
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
        title={tourDetail.tour.name}
        description="Edita los datos de tu tour."
      />
      <Card className={cn(isFetching && 'cursor-wait')}>
        <CardContent>
          <FormTour data={tourDetail.tour} isFetching={isFetching} />
        </CardContent>
      </Card>
    </div>
  );
}
