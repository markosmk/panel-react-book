import { Card, CardContent } from '@/components/ui/card';
import { BookingsDeletedTable } from './bookings-deleted-table';
import { WrapperQueryTable } from '@/components/wrapper-query-table';
import { useBookingsDeleted } from '@/services/hooks/booking.query';

export function ComplementsSection() {
  const { data, isLoading, isFetching, isError } = useBookingsDeleted();
  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <div>
            <p className="text-xl font-semibold">Restaurar Reservas</p>
            <p className="mb-2 mt-1 text-muted-foreground">
              Esta seccion permite restaurar las reservas de los clientes que se
              han eliminado. Si eliminas de aqui una reserva, se eliminara
              completamente del sistema.
            </p>
          </div>

          <WrapperQueryTable
            data={data}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
          >
            <BookingsDeletedTable data={data || []} />
          </WrapperQueryTable>
        </div>
      </CardContent>
    </Card>
  );
}
