import { BadgeStatus } from '@/components/badge-status';
import { CardExpandable } from '@/components/card-expandable';
import { cn, formatDateOnly, formatPrice } from '@/lib/utils';
import { Booking } from '@/types/customer.types';

function ItemInfo({
  label,
  value,
  className
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={cn('col-span-1 space-y-1', className)}>
      <p className="text-xs text-muted-foreground">{label}:</p>
      <p className="truncate font-semibold">{value}</p>
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <CardExpandable minHeight={120}>
      <ul className="flex flex-col">
        <li className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
          <div className="flex w-full flex-col sm:flex-row">
            <div className="mb-2 min-w-32 font-medium">Reserva</div>
            <div className="grid w-full grid-cols-1 gap-2">
              <div className="col-span-1 flex items-center justify-between space-x-2">
                <p className="text-xs text-muted-foreground">Estado:</p>
                <div className="font-semibold">
                  <BadgeStatus status={booking.status} />
                </div>
              </div>
              <ItemInfo
                label="Cantidad de Personas"
                value={booking.quantity}
                className="col-span-1 flex items-center justify-between space-x-2 space-y-0"
              />
              <ItemInfo
                label="Precio Total"
                value={formatPrice(Number(booking.totalPrice))}
                className="col-span-1 flex items-center justify-between space-x-2 space-y-0"
              />
              <ItemInfo
                label="Notas"
                value={booking.notes}
                className="col-span-1 flex items-center justify-between space-x-2 space-y-0"
              />
              <ItemInfo
                label="Idioma"
                value={booking.language}
                className="col-span-1 flex items-center justify-between space-x-2 space-y-0"
              />
            </div>
          </div>
        </li>

        <li className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
          <div className="flex w-full flex-col sm:flex-row">
            <div className="mb-2 min-w-32 font-medium">Horario</div>
            <div className="grid w-full grid-cols-1 gap-2">
              <ItemInfo
                label="Fecha"
                value={formatDateOnly(booking?.schedule?.date, 'dd/MM/yyyy')}
                className="col-span-1 flex items-center justify-between space-x-2 space-y-0"
              />
              <ItemInfo
                label="Desde"
                value={
                  booking?.schedule?.startTime
                    ? booking.schedule.startTime.slice(0, 5)
                    : '-'
                }
                className="col-span-1 flex items-center justify-between space-x-2 space-y-0"
              />
            </div>
          </div>
        </li>

        <li className="flex flex-col border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
          <div className="flex w-full flex-col sm:flex-row">
            <div className="mb-2 min-w-32 font-medium">Tour</div>
            <div className="grid w-full grid-cols-1 gap-2">
              <ItemInfo
                label="Nombre"
                value={booking.tourData?.name ?? '-'}
                className="col-span-1 flex items-center justify-between space-x-2 space-y-0"
              />
              <ItemInfo
                label="Precio Individual / Persona"
                value={
                  booking.tourData?.price
                    ? formatPrice(Number(booking.tourData?.price))
                    : '-'
                }
                className="col-span-1 flex items-center justify-between space-x-2 space-y-0"
              />
              <ItemInfo
                label="Duracion"
                value={booking.tourData?.duration ?? '-'}
                className="col-span-1 flex items-center justify-between space-x-2 space-y-0"
              />
            </div>
          </div>

          <div className="mt-2">
            <small className="text-xs leading-[0] text-muted-foreground">
              Esta informacion del tour fue obtenida al momento de crear la
              reservar, puede que no este actualizada.
            </small>
          </div>
        </li>
      </ul>
    </CardExpandable>
  );
}

export function CustomerBookings({ data }: { data: Booking[] }) {
  if (!data) return <></>;

  return (
    <div className="relative flex flex-col gap-3">
      {data.length > 0 ? (
        data.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-center text-sm text-muted-foreground">
            No se encontraron reservas
          </p>
        </div>
      )}
    </div>
  );
}
