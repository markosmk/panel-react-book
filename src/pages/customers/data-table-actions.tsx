import { MoreHorizontalIcon } from 'lucide-react';

import { formatDateOnly, formatPrice } from '@/lib/utils';
import { CustomerDetail, CustomerTable } from '@/types/customer.types';
import { useModal } from '@/hooks/use-modal';
import { useMediaQuery } from '@/hooks/use-media-query';
import { getCustomerById } from '@/services/customer.service';

import { TooltipHelper } from '@/components/tooltip-helper';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { BadgeStatus } from '@/components/badge-status';
import { toast } from '@/components/notifications';

function ItemInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-span-1 space-y-1">
      <p className="text-xs text-muted-foreground">{label}:</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function DetailModal({ detail }: { detail: CustomerDetail }) {
  const booking = detail.bookings.length > 0 ? detail.bookings[0] : null;

  const schedule =
    detail.bookings.length > 0
      ? JSON.parse(detail.bookings[0]?.scheduleData ?? '{}')
      : null;
  const tour =
    detail.bookings.length > 0
      ? JSON.parse(detail.bookings[0]?.tourData ?? '{}')
      : null;
  return (
    <div className="relative flex flex-col gap-2">
      <div className="my-2">
        <h4 className="text-xs uppercase text-muted-foreground">
          Información del Cliente
        </h4>

        <Card className="mt-3 overflow-hidden">
          <ul className="flex flex-col">
            <li className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
              <div className="grid w-full grid-cols-2 gap-2">
                <ItemInfo label="Nombre" value={detail.customer?.name} />
                <ItemInfo
                  label="Número Teléfono"
                  value={detail.customer?.phone}
                />
                <ItemInfo label="Email" value={detail.customer?.email} />

                <ItemInfo
                  label="Lugar de Residencia"
                  value={detail.customer?.origen}
                />

                <ItemInfo
                  label="Como se entero de nosotros"
                  value={
                    detail.customer?.findAbout === 'other'
                      ? detail.customer?.customAbout
                      : detail.customer?.about
                  }
                />

                <ItemInfo
                  label="Indico que desea Newsletter?"
                  value={detail.customer?.wantNewsletter === '1' ? 'Si' : 'No'}
                />
                <ItemInfo
                  label="Hospedaje / Alojamiento"
                  value={detail.customer?.hotel}
                />
              </div>
            </li>
          </ul>
        </Card>
      </div>

      {booking && (
        <>
          <div className="my-2">
            <h4 className="text-xs uppercase text-muted-foreground">
              Información del Horario Seleccionado
            </h4>

            <Card className="mt-3 overflow-hidden">
              <ul className="flex flex-col">
                <li className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
                  <div className="grid w-full grid-cols-2 gap-2">
                    <div className="col-span-3 space-y-1">
                      <p className="text-xs text-muted-foreground">Fecha:</p>
                      <p className="font-semibold">
                        {formatDateOnly(schedule?.date, 'dd/MM/yyyy')}
                      </p>
                    </div>

                    <ItemInfo
                      label="Desde"
                      value={
                        schedule?.startTime
                          ? schedule?.endTime.split(':').slice(0, 2).join(':')
                          : '-'
                      }
                    />
                    <ItemInfo
                      label="Hasta"
                      value={
                        schedule?.endTime
                          ? schedule?.endTime.split(':').slice(0, 2).join(':')
                          : '-'
                      }
                    />
                  </div>
                </li>
              </ul>
            </Card>
          </div>

          <div className="mt-2">
            <h4 className="text-xs uppercase text-muted-foreground">
              Información del Tour Reservado
            </h4>

            <Card className="mt-3 overflow-hidden">
              <ul className="flex flex-col">
                <li className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
                  <div className="grid w-full grid-cols-2 gap-2">
                    <ItemInfo label="Nombre" value={tour.name} />
                    <ItemInfo
                      label="Precio Individual"
                      value={formatPrice(Number(tour.price))}
                    />
                    <ItemInfo label="Duracion" value={tour.duration} />
                    <ItemInfo label="Capacidad" value={tour.capacity} />
                  </div>

                  <hr className="my-4 h-[1px] w-full bg-accent" />

                  <div className="grid w-full grid-cols-2 gap-2">
                    <div className="col-span-1 space-y-1">
                      <p className="text-xs text-muted-foreground">Estado:</p>
                      <p className="font-semibold">
                        <BadgeStatus status={booking.status} />
                      </p>
                    </div>
                    <ItemInfo
                      label="Cantidad de Personas"
                      value={booking.quantity}
                    />
                    <ItemInfo
                      label="Precio Total"
                      value={formatPrice(Number(booking.totalPrice))}
                    />
                    <ItemInfo label="Notes" value={booking.notes} />
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export function DataTableActions({ data }: { data: CustomerTable }) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { openModal } = useModal();

  const handleOpenDetails = () => {
    openModal({
      title: 'Detalles del Cliente',
      description: 'registro creado el ' + formatDateOnly(data.created_at),
      fetchData: async (signal) => {
        const response = await getCustomerById(data.id, signal);
        return <DetailModal detail={response.data} />;
      }
    });
  };

  return (
    <>
      <div className="hidden justify-end gap-x-1 sm:flex">
        <TooltipHelper content="Ver Cliente">
          <Button variant="outline" size="icon" onClick={handleOpenDetails}>
            <Icons.look className="size-5" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Copiar Número">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              toast.success('Numero copiado al portapapeles');
              navigator.clipboard.writeText(data.phone.toString());
            }}
            title="Copiar Número"
          >
            <Icons.copy className="h-4 w-4" />
          </Button>
        </TooltipHelper>
      </div>

      {isMobile && (
        <div className="inline-flex sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 data-[state=open]:bg-background"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleOpenDetails}>
                <Icons.look className="mr-2 size-4" />
                Ver Cliente
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast.success('Numero copiado al portapapeles');
                  navigator.clipboard.writeText(data.phone.toString());
                }}
              >
                <Icons.copy className="mr-2 h-4 w-4" /> Copiar Nro. Teléfono
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                      <Icons.remove className="mr-2 size-4" />
                      Eliminar
                    </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}
