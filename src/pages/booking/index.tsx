import { useSearchParams } from 'react-router-dom';

import { useBookings } from '@/services/hooks/booking.query';
import { useModal } from '@/hooks/use-modal';

import { PendingContent } from '@/components/pending-content';
import { HeadingMain } from '@/components/heading-main';
import { BookingsDataTable } from './bookings-data-table';

export function BookingPage() {
  const { openModal } = useModal();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 20);
  // query
  const { data, isLoading, isError } = useBookings(page, perPage);

  if (isLoading) return <PendingContent />;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
      <HeadingMain
        title="Lista de Reservas"
        description="Gestiona tus reservas desde esta seccion, puedes agregar, editar y eliminar reservas."
      />
      <BookingsDataTable data={data?.results || []} />
    </div>
  );
}
