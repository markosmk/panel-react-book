import { Card, CardContent } from '@/components/ui/card';
import { HeadingMain } from '@/components/heading-main';
import { BookingEditForm } from './_components/booking-edit-form';

export default function CreatePage() {
  return (
    <div className="relative mx-auto w-full max-w-2xl space-y-8 px-4 pb-4 md:px-6 md:pb-6">
      <HeadingMain title="Crear Reserva" />
      <Card>
        <CardContent className="pb-0 md:pb-0">
          <BookingEditForm isFetching={false} />
        </CardContent>
      </Card>
    </div>
  );
}
