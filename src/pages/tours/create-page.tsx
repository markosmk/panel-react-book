import { HeadingMain } from '@/components/heading-main';
import { Card, CardContent } from '@/components/ui/card';
import { FormTour } from './form-tour';

export default function TourCreatePage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-4 pb-4 md:px-6 md:pb-6">
      <HeadingMain
        title="Nuevo Tour"
        description="Desde aqui puedes crear un nuevo tour, una ves creado puedes definir los horarios desde la lista de tours."
        hasBackNavigation
      />

      <Card>
        <CardContent>
          <FormTour isNew={true} />
        </CardContent>
      </Card>
    </div>
  );
}
