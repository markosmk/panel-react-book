import { useBookings } from '@/services/hooks/booking.query';
import { useModalStore } from '@/utils/modal/use-modal-store';

import { HeadingMain } from '@/components/heading-main';
import { Button } from '@/components/ui/button';
import { WrapperQueryTable } from '@/components/wrapper-query-table';

import { BookingEditForm } from './_components/booking-edit-form';
import { BookingTable } from './booking-table';

export function BookingPage() {
  const { openModal, closeModal } = useModalStore();
  // const [searchParams] = useSearchParams();
  // const page = Number(searchParams.get('page') || 1);
  // const perPage = Number(searchParams.get('perPage') || 20);
  // query
  const { data, isLoading, isFetching, isError } = useBookings();

  const handleBookingAdd = () => {
    openModal({
      title: 'Crear Reserva',
      content: <BookingEditForm closeModal={closeModal} />
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
      <HeadingMain
        title="Lista de Reservas"
        description="Gestiona tus reservas desde esta seccion, puedes agregar, editar y eliminar reservas."
      >
        <Button type="button" onClick={handleBookingAdd}>
          Crear Reserva
        </Button>
      </HeadingMain>

      <WrapperQueryTable
        data={data?.results}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
      >
        <BookingTable data={data?.results || []} />
      </WrapperQueryTable>
    </div>
  );
}
